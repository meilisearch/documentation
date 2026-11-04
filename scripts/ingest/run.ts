import path from "node:path";
import { chunkPage } from "./chunk/mdx-chunker.ts";
import { loadPages } from "./sources/mdx.ts";
import { planSync } from "./sync/plan.ts";
import type { Chunk, IngestConfig, Sink } from "./types.ts";

export type RunIngestOptions = {
  config: IngestConfig;
  sink: Sink;
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

export async function runIngest({ config, sink, only = [], force = false }: RunIngestOptions): Promise<IngestSummary> {
  const pages = await loadPages({
    rootDir: config.rootDir,
    navigation: config.navigation,
    exclude: config.exclude,
    only,
    chunking: config.chunking,
  });
  let existing = await sink.existingHashes();
  if (only.length > 0) {
    existing = new Map([...existing].filter(([page]) => only.some((glob) => path.matchesGlob(page, glob))));
  }
  const plan = planSync(existing, pages, { force });
  const chunks = plan.changed.flatMap((page) =>
    chunkPage(page, { chunking: config.chunking, baseUrl: config.baseUrl }),
  );
  await sink.apply({ deletePages: plan.deletePages, chunks });
  const { added, updated, removed, unchanged } = plan;
  return { added, updated, removed, unchanged, chunks };
}
