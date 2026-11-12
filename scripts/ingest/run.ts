import path from "node:path";
import { chunkPage } from "./chunk/mdx-chunker.ts";
import { chunkRoute } from "./chunk/route-chunker.ts";
import { loadApiRoutes } from "./sources/openapi.ts";
import { loadPages } from "./sources/mdx.ts";
import { planSync } from "./sync/plan.ts";
import type { Chunk, IngestConfig, Sink } from "./types.ts";

export type RunIngestOptions = {
  config: IngestConfig;
  sinks: { docs: Sink; routes: Sink };
  /** Page globs: only matching pages are synced, other stored pages are left untouched. */
  only?: string[];
  /** Re-sync every page even when its hash is unchanged. */
  force?: boolean;
};

export type IngestSummary = {
  added: string[];
  updated: string[];
  removed: string[];
  unchanged: number;
  chunks: Chunk[];
};

async function syncIndex<T extends { page: string; pageHash: string }>(
  items: T[],
  sink: Sink,
  toChunks: (item: T) => Chunk[],
  only: string[],
  force: boolean,
): Promise<IngestSummary> {
  let existing = await sink.existingHashes();
  if (only.length > 0) {
    existing = new Map([...existing].filter(([page]) => only.some((glob) => path.matchesGlob(page, glob))));
  }
  const plan = planSync(existing, items, { force });
  const chunks = plan.changed.flatMap(toChunks);
  await sink.apply({ deletePages: plan.deletePages, chunks });
  const { added, updated, removed, unchanged } = plan;
  return { added, updated, removed, unchanged, chunks };
}

export async function runIngest({
  config,
  sinks,
  only = [],
  force = false,
}: RunIngestOptions): Promise<{ docs: IngestSummary; routes: IngestSummary }> {
  const pages = config.sources.mdx
    ? await loadPages({
        rootDir: config.rootDir,
        navigation: config.navigation,
        exclude: config.exclude,
        only,
        chunking: config.chunking,
        codeSamples: config.sources.codeSamples,
      })
    : [];
  const routes = await loadApiRoutes({
    rootDir: config.rootDir,
    navigation: config.navigation,
    baseUrl: config.baseUrl,
    chunking: config.chunking,
    only,
  });

  const docs = config.sources.mdx
    ? await syncIndex(
        pages,
        sinks.docs,
        (page) => chunkPage(page, { chunking: config.chunking, baseUrl: config.baseUrl }),
        only,
        force,
      )
    : { added: [], updated: [], removed: [], unchanged: 0, chunks: [] };
  const routeSummary = await syncIndex(
    routes,
    sinks.routes,
    (route) => chunkRoute(route, config.baseUrl),
    only,
    force,
  );
  return { docs, routes: routeSummary };
}
