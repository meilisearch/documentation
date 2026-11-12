import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ChunkingConfig, IngestConfig, MeilisearchConfig } from "./types.ts";

/** Bump when chunking or cleaning logic changes, to force a full re-sync. */
export const PIPELINE_VERSION = 3;

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "../..");

export const DEFAULT_CHUNKING: ChunkingConfig = {
  splitDepth: 3,
  maxChars: 2000,
  minChars: 200,
};

export const DEFAULT_CONFIG: IngestConfig = {
  rootDir: PROJECT_ROOT,
  baseUrl: "https://www.meilisearch.com/docs",
  navigation: "config/navigation.json",
  exclude: [],
  sources: { mdx: true, codeSamples: true, images: false },
  chunking: DEFAULT_CHUNKING,
  dryRunOutput: path.join(PROJECT_ROOT, ".ingest/chunks.jsonl"),
  routesDryRunOutput: path.join(PROJECT_ROOT, ".ingest/routes.jsonl"),
};

export type UserConfig = Partial<Omit<IngestConfig, "chunking" | "sources">> & {
  chunking?: Partial<ChunkingConfig>;
  sources?: Partial<IngestConfig["sources"]>;
  meilisearch?: {
    indexUid?: string;
    routesIndexUid?: string;
    embedder?: { name?: string; model?: string };
  };
};

export function defineConfig(config: UserConfig): UserConfig {
  return config;
}

export function resolveConfig(user: UserConfig = {}): IngestConfig {
  return {
    ...DEFAULT_CONFIG,
    ...user,
    sources: { ...DEFAULT_CONFIG.sources, ...user.sources },
    chunking: { ...DEFAULT_CONFIG.chunking, ...user.chunking },
  };
}

export function resolveMeilisearchConfig(
  user: UserConfig = {},
  env: NodeJS.ProcessEnv = process.env,
): MeilisearchConfig {
  const required = ["MEILISEARCH_URL", "MEILISEARCH_API_KEY", "VOYAGE_API_KEY"] as const;
  const missing = required.filter((name) => !env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}. Add them to .env.`);
  }
  return {
    host: env.MEILISEARCH_URL!,
    apiKey: env.MEILISEARCH_API_KEY!,
    indexUid: user.meilisearch?.indexUid ?? "docs-chunks",
    routesIndexUid: user.meilisearch?.routesIndexUid ?? "api-routes",
    embedder: {
      name: user.meilisearch?.embedder?.name ?? "voyage",
      model: user.meilisearch?.embedder?.model ?? "voyage-4",
      apiKey: env.VOYAGE_API_KEY!,
      documentTemplateMaxBytes: 4000,
    },
  };
}
