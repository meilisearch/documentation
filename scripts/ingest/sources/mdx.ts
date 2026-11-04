import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import { PIPELINE_VERSION } from "../config.ts";
import type { ChunkingConfig, RawPage } from "../types.ts";

type NavGroup = { group: string; root?: string; pages?: NavEntry[] };
type NavEntry = string | NavGroup;
type NavTab = { tab: string; groups?: NavGroup[]; pages?: NavEntry[] };
type NavLocation = { page: string; tab: string; group: string };

const OPENAPI_ROUTE = /^(GET|POST|PUT|PATCH|DELETE) \//;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

function parsePage(page: string, content: string): Pick<RawPage, "frontmatter" | "body"> {
  const match = FRONTMATTER.exec(content);
  const data = (match ? YAML.parse(match[1]) : null) ?? {};
  const body = (match ? content.slice(match[0].length) : content).replace(/^(\r?\n)+/, "");
  return { frontmatter: { ...data, title: data.title ?? data.sidebarTitle ?? path.posix.basename(page) }, body };
}

function* walkEntries(entries: NavEntry[], tab: string, groups: string[]): Generator<NavLocation> {
  for (const entry of entries) {
    if (typeof entry === "string") {
      yield { page: entry, tab, group: groups.join(" > ") };
    } else {
      const entryGroups = [...groups, entry.group];
      if (entry.root) yield { page: entry.root, tab, group: entryGroups.join(" > ") };
      yield* walkEntries(entry.pages ?? [], tab, entryGroups);
    }
  }
}

function* walkNavigation(tabs: NavTab[]): Generator<NavLocation> {
  for (const tab of tabs) {
    yield* walkEntries([...(tab.groups ?? []), ...(tab.pages ?? [])], tab.tab, []);
  }
}

export async function loadPages(options: {
  rootDir: string;
  navigation: string;
  exclude?: string[];
  only?: string[];
  chunking: ChunkingConfig;
}): Promise<RawPage[]> {
  const navigation = JSON.parse(await fs.readFile(path.join(options.rootDir, options.navigation), "utf8")) as {
    tabs: NavTab[];
  };
  const { exclude = [], only = [] } = options;
  const pages: RawPage[] = [];
  const seen = new Set<string>();
  for (const { page, tab, group } of walkNavigation(navigation.tabs)) {
    if (OPENAPI_ROUTE.test(page) || seen.has(page)) continue;
    seen.add(page);
    if (exclude.some((glob) => path.matchesGlob(page, glob))) continue;
    if (only.length > 0 && !only.some((glob) => path.matchesGlob(page, glob))) continue;
    const content = await fs.readFile(path.join(options.rootDir, `${page}.mdx`), "utf8").catch((error) => {
      if (error.code !== "ENOENT") throw error;
      throw new Error(`Page "${page}" is listed in ${options.navigation} but ${page}.mdx was not found`);
    });
    const pageHash = createHash("sha1")
      .update(JSON.stringify([PIPELINE_VERSION, page, tab, group, options.chunking, content]))
      .digest("hex");
    pages.push({ page, tab, group, ...parsePage(page, content), pageHash });
  }
  return pages;
}
