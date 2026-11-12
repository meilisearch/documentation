import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { PIPELINE_VERSION } from "../config.ts";
import { normalizeLanguage } from "../languages.ts";
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

function lookupKeys(method: string, routePath: string, page: string, summary: string, baseUrl: string): string[] {
  const url = `${baseUrl}/${page}`;
  return [`${method} ${routePath}`, page, slugify(summary), `/${page}`, url];
}

function renderLocation(
  location: RouteLocation,
  spec: Spec,
  baseUrl: string,
  chunking: ChunkingConfig,
): RouteDocument | null {
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
  const keys = lookupKeys(method, routePath, page, summary, baseUrl);
  const pageHash = createHash("sha1")
    .update(JSON.stringify([PIPELINE_VERSION, page, location.tab, location.groupPath, chunking, parts, codes, keys]))
    .digest("hex");

  return {
    page,
    pageHash,
    tab: location.tab,
    groupPath: location.groupPath,
    method,
    path: routePath,
    summary,
    description,
    lookupKeys: keys,
    codes,
    parts,
  };
}

export async function loadApiRoutes(options: {
  rootDir: string;
  navigation: string;
  baseUrl: string;
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

    const route = renderLocation(location, spec, options.baseUrl, options.chunking);
    if (!route) continue;
    if (only.length > 0 && !only.some((glob) => path.matchesGlob(route.page, glob))) continue;
    routes.push(route);
  }
  return routes;
}
