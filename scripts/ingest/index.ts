import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { Meilisearch } from "meilisearch";
import { resolveConfig, resolveMeilisearchConfig, type UserConfig } from "./config.ts";
import { runIngest, type IngestSummary } from "./run.ts";
import { JsonlSink } from "./sinks/jsonl.ts";
import { MeilisearchSink } from "./sinks/meilisearch.ts";
import type { Sink } from "./types.ts";

const USAGE = `Usage: npm run ingest -- [options]

  --dry-run        Write chunks to .ingest/chunks.jsonl instead of Meilisearch
  --force          Re-sync every page, even unchanged ones
  --only <glob>    Only sync pages matching the glob (repeatable), e.g. "changelog/**"
  --config <file>  Config file (default: scripts/ingest/ingest.config.ts)
  --help           Show this message`;

function percentile(sorted: number[], p: number): number {
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
}

function report(summary: IngestSummary, target: string, seconds: number): void {
  console.log(`Synced to ${target} in ${seconds.toFixed(1)}s`);
  console.log(
    `Pages: ${summary.added.length} added, ${summary.updated.length} updated, ` +
    `${summary.removed.length} removed, ${summary.unchanged} unchanged`,
  );
  for (const [label, pages] of [["Added", summary.added], ["Updated", summary.updated], ["Removed", summary.removed]] as const) {
    if (pages.length > 0 && pages.length <= 20) console.log(`  ${label}: ${pages.join(", ")}`);
  }
  if (summary.chunks.length === 0) return;

  const sizes = summary.chunks.map((chunk) => chunk.content.length).sort((a, b) => a - b);
  console.log(
    `Chunks written: ${summary.chunks.length} (chars p50 ${percentile(sizes, 50)}, ` +
    `p90 ${percentile(sizes, 90)}, max ${sizes[sizes.length - 1]})`,
  );
  const largest = [...summary.chunks].sort((a, b) => b.content.length - a.content.length).slice(0, 5);
  console.log("Largest chunks:");
  for (const chunk of largest) console.log(`  ${chunk.content.length}\t${chunk.id}`);
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      "dry-run": { type: "boolean", default: false },
      force: { type: "boolean", default: false },
      only: { type: "string", multiple: true, default: [] },
      config: { type: "string" },
      help: { type: "boolean", default: false },
    },
  });
  if (values.help) {
    console.log(USAGE);
    return;
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const configFile = path.resolve(values.config ?? path.join(scriptDir, "ingest.config.ts"));
  const userConfig: UserConfig = (await import(pathToFileURL(configFile).href)).default;
  const config = resolveConfig(userConfig);

  let sink: Sink;
  let target: string;
  if (values["dry-run"]) {
    sink = new JsonlSink(config.dryRunOutput);
    target = path.relative(process.cwd(), config.dryRunOutput);
  } else {
    const meilisearch = resolveMeilisearchConfig(userConfig);
    const client = new Meilisearch({ host: meilisearch.host, apiKey: meilisearch.apiKey });
    const meilisearchSink = new MeilisearchSink({ client, indexUid: meilisearch.indexUid, embedder: meilisearch.embedder });
    await meilisearchSink.ensureSettings();
    sink = meilisearchSink;
    target = `${meilisearch.host} (index ${meilisearch.indexUid})`;
  }

  const started = performance.now();
  const summary = await runIngest({ config, sink, only: values.only, force: values.force });
  report(summary, target, (performance.now() - started) / 1000);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
