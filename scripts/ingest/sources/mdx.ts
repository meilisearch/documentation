import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import { PIPELINE_VERSION } from "../config.ts";
import type { ChunkingConfig, RawPage } from "../types.ts";
import { loadSnippets, mountedSamples, type Snippet } from "./snippets.ts";

type OpenApiNav = { source: string; directory: string };
type NavGroup = { group: string; root?: string; pages?: NavEntry[]; openapi?: OpenApiNav };
type NavEntry = string | NavGroup;
type NavTab = { tab: string; groups?: NavGroup[]; pages?: NavEntry[] };

type PageHit = { kind: "page"; page: string; tab: string; group: string };
type RouteHit = {
  kind: "route";
  route: string;
  tab: string;
  /** Innermost navigation group. Its slug is the first URL segment under the OpenAPI directory. */
  group: string;
  /** Outermost to innermost, joined with " > ". */
  groupPath: string;
  directory: string;
  source: string;
};
type NavHit = PageHit | RouteHit;

export type RouteLocation = Omit<RouteHit, "kind">;

const OPENAPI_ROUTE = /^(GET|POST|PUT|PATCH|DELETE) \//;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

function parsePage(page: string, content: string): Pick<RawPage, "frontmatter" | "body"> {
  const match = FRONTMATTER.exec(content);
  const data = (match ? YAML.parse(match[1]) : null) ?? {};
  const body = (match ? content.slice(match[0].length) : content).replace(/^(\r?\n)+/, "");
  return { frontmatter: { ...data, title: data.title ?? data.sidebarTitle ?? path.posix.basename(page) }, body };
}

function* walkEntries(
  entries: NavEntry[],
  tab: string,
  groups: string[],
  openapi: OpenApiNav | null,
): Generator<NavHit> {
  for (const entry of entries) {
    if (typeof entry === "string") {
      if (OPENAPI_ROUTE.test(entry)) {
        if (openapi) {
          yield {
            kind: "route",
            route: entry,
            tab,
            group: groups[groups.length - 1] ?? "",
            groupPath: groups.join(" > "),
            directory: openapi.directory.replace(/^\/+|\/+$/g, ""),
            source: openapi.source,
          };
        }
        continue;
      }
      yield { kind: "page", page: entry, tab, group: groups.join(" > ") };
      continue;
    }

    const nextOpenapi = entry.openapi?.source && entry.openapi.directory ? entry.openapi : openapi;
    const entryGroups = [...groups, entry.group];
    if (entry.root) yield { kind: "page", page: entry.root, tab, group: entryGroups.join(" > ") };
    yield* walkEntries(entry.pages ?? [], tab, entryGroups, nextOpenapi);
  }
}

function* walkNavigation(tabs: NavTab[]): Generator<NavHit> {
  for (const tab of tabs) {
    yield* walkEntries([...(tab.groups ?? []), ...(tab.pages ?? [])], tab.tab, [], null);
  }
}

async function readNavigation(rootDir: string, navigation: string): Promise<NavTab[]> {
  const parsed = JSON.parse(await fs.readFile(path.join(rootDir, navigation), "utf8")) as { tabs: NavTab[] };
  return parsed.tabs;
}

export async function loadRouteLocations(options: { rootDir: string; navigation: string }): Promise<RouteLocation[]> {
  const tabs = await readNavigation(options.rootDir, options.navigation);
  const locations: RouteLocation[] = [];
  const seen = new Set<string>();
  for (const hit of walkNavigation(tabs)) {
    if (hit.kind !== "route" || seen.has(hit.route)) continue;
    seen.add(hit.route);
    const { kind: _kind, ...location } = hit;
    locations.push(location);
  }
  return locations;
}

export async function loadPages(options: {
  rootDir: string;
  navigation: string;
  exclude?: string[];
  only?: string[];
  chunking: ChunkingConfig;
  /** When false, mounted snippets are ignored and do not affect the page hash. */
  codeSamples?: boolean;
}): Promise<RawPage[]> {
  const tabs = await readNavigation(options.rootDir, options.navigation);
  const snippets: Map<string, Snippet> = options.codeSamples === false ? new Map() : await loadSnippets(options.rootDir);
  const { exclude = [], only = [] } = options;
  const pages: RawPage[] = [];
  const seen = new Set<string>();
  for (const hit of walkNavigation(tabs)) {
    if (hit.kind !== "page" || seen.has(hit.page)) continue;
    seen.add(hit.page);
    const { page, tab, group } = hit;
    if (exclude.some((glob) => path.matchesGlob(page, glob))) continue;
    if (only.length > 0 && !only.some((glob) => path.matchesGlob(page, glob))) continue;
    const content = await fs.readFile(path.join(options.rootDir, `${page}.mdx`), "utf8").catch((error) => {
      if (error.code !== "ENOENT") throw error;
      throw new Error(`Page "${page}" is listed in ${options.navigation} but ${page}.mdx was not found`);
    });
    const { frontmatter, body } = parsePage(page, content);
    const samples = mountedSamples(body, snippets);
    const sampleSources = samples.map((sample) => [sample.alias, sample.key, snippets.get(sample.key)?.source ?? ""]);
    const pageHash = createHash("sha1")
      .update(JSON.stringify([PIPELINE_VERSION, page, tab, group, options.chunking, content, sampleSources]))
      .digest("hex");
    pages.push({ page, tab, group, frontmatter, body, pageHash, samples });
  }
  return pages;
}
