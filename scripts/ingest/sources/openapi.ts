import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { PIPELINE_VERSION } from "../config.ts";
import { normalizeLanguage } from "../../../chat/shared/samples.ts";
import type { ChunkingConfig } from "../types.ts";
import { renderRoute, type RouteDocument } from "../chunk/route-chunker.ts";
import { loadRouteLocations, type RouteLocation } from "./mdx.ts";

type CodeSample = { lang?: string; label?: string; source?: string };
type Operation = {
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: { name?: string; in?: string; description?: string; required?: boolean; schema?: object }[];
  requestBody?: { content?: Record<string, { schema?: object; example?: unknown }> };
  responses?: Record<string, { description?: string; content?: Record<string, { schema?: object; example?: unknown }> }>;
  "x-codeSamples"?: CodeSample[];
};
type Spec = {
  paths?: Record<string, Record<string, Operation>>;
  components?: { schemas?: Record<string, object> };
};

const ROUTE = /^(GET|POST|PUT|PATCH|DELETE) (\/\S+)$/;
const MAX_ROUTES_PER_SDK_METHOD = 10;
const CALL = /(?:\.|::|->)\s*([A-Za-z_]\w*)\s*[(<{]/g;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function codesFromSamples(samples: CodeSample[] | undefined): Record<string, string> {
  const codes: Record<string, string> = {};
  for (const sample of samples ?? []) {
    if (!sample.source) continue;
    const language = normalizeLanguage(sample.label ?? sample.lang);
    if (!language || codes[language]) continue;
    codes[language] = sample.source.replace(/\s+$/, "");
  }
  return codes;
}

function lookupKeys(method: string, routePath: string, page: string, summary: string): string[] {
  return [`${method} ${routePath}`, page, slugify(summary), `/${page}`];
}

function sdkMethodNames(codes: Record<string, string>): string[] {
  const names = new Set<string>();
  for (const [language, source] of Object.entries(codes)) {
    if (language === "http" || language === "cli") continue;
    for (const match of source.matchAll(CALL)) {
      const name = match[1];
      if (name) names.add(name);
    }
  }
  return [...names].sort();
}

function countRoutesPerMethod(routes: { sdkMethods: string[] }[]): Map<string, number> {
  const usage = new Map<string, number>();
  for (const route of routes) {
    for (const name of route.sdkMethods) usage.set(name, (usage.get(name) ?? 0) + 1);
  }
  return usage;
}

function hashRoute(route: RouteDocument, chunking: ChunkingConfig): string {
  return createHash("sha1")
    .update(
      JSON.stringify([
        PIPELINE_VERSION,
        route.page,
        route.tab,
        route.groupPath,
        chunking,
        route.parts,
        route.codes,
        route.lookupKeys,
        route.sdkMethods,
      ]),
    )
    .digest("hex");
}

function renderLocation(location: RouteLocation, spec: Spec, chunking: ChunkingConfig): RouteDocument | null {
  const match = ROUTE.exec(location.route);
  if (!match) return null;
  const method = match[1];
  const routePath = match[2];
  const operation = spec.paths?.[routePath]?.[method.toLowerCase()];
  if (!operation) return null;

  const summary = operation.summary?.trim() || operation.operationId || `${method} ${routePath}`;
  const description = operation.description?.trim() ?? "";
  const group = location.group || "api";
  const page = `${location.directory}/${slugify(group)}/${slugify(summary)}`;
  const codes = codesFromSamples(operation["x-codeSamples"]);
  const parts = renderRoute(
    {
      method,
      path: routePath,
      summary,
      description,
      parameters: operation.parameters ?? [],
      requestBody: operation.requestBody,
      responses: operation.responses,
      schemas: spec.components?.schemas ?? {},
    },
    chunking.maxChars,
  );
  const keys = lookupKeys(method, routePath, page, summary);

  return {
    page,
    pageHash: "",
    tab: location.tab,
    groupPath: location.groupPath,
    method,
    path: routePath,
    summary,
    description,
    lookupKeys: keys,
    sdkMethods: sdkMethodNames(codes),
    codes,
    parts,
  };
}

export async function loadApiRoutes(options: {
  rootDir: string;
  navigation: string;
  chunking: ChunkingConfig;
  only?: string[];
}): Promise<RouteDocument[]> {
  const locations = await loadRouteLocations({ rootDir: options.rootDir, navigation: options.navigation });
  const { only = [] } = options;
  const specs = new Map<string, Spec>();
  const routes: RouteDocument[] = [];

  for (const location of locations) {
    let spec = specs.get(location.source);
    if (!spec) {
      const file = path.join(options.rootDir, location.source);
      try {
        spec = JSON.parse(await fs.readFile(file, "utf8")) as Spec;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          throw new Error(`OpenAPI source "${location.source}" listed in ${options.navigation} was not found`);
        }
        throw error;
      }
      specs.set(location.source, spec);
    }

    const route = renderLocation(location, spec, options.chunking);
    if (!route) continue;
    if (only.length > 0 && !only.some((glob) => path.matchesGlob(route.page, glob))) continue;
    routes.push(route);
  }

  const usage = countRoutesPerMethod(routes);
  for (const route of routes) {
    route.sdkMethods = route.sdkMethods.filter((name) => (usage.get(name) ?? 0) <= MAX_ROUTES_PER_SDK_METHOD);
    route.pageHash = hashRoute(route, options.chunking);
  }
  return routes;
}
