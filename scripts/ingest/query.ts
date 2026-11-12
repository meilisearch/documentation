import { parseArgs } from "node:util";
import { Meilisearch } from "meilisearch";
import { resolveMeilisearchConfig } from "./config.ts";
import userConfig from "./ingest.config.ts";
import type { Chunk } from "./types.ts";

const USAGE = `Usage: npm run ingest:query -- "<query>" [--ratio 0.5] [--limit 5] [--index docs|routes]`;

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      ratio: { type: "string", default: "0.5" },
      limit: { type: "string", default: "5" },
      index: { type: "string", default: "docs" },
    },
  });
  const query = positionals.join(" ");
  if (!query) {
    console.log(USAGE);
    return;
  }

  const meilisearch = resolveMeilisearchConfig(userConfig);
  const indexUid = values.index === "routes" ? meilisearch.routesIndexUid : meilisearch.indexUid;
  const client = new Meilisearch({ host: meilisearch.host, apiKey: meilisearch.apiKey });
  const response = await client.index<Chunk>(indexUid).search(query, {
    hybrid: { embedder: meilisearch.embedder.name, semanticRatio: Number(values.ratio) },
    limit: Number(values.limit),
    attributesToRetrieve: ["breadcrumb", "url", "content", "content_type"],
    showRankingScore: true,
  });

  console.log(`${response.hits.length} hits for "${query}" (semanticRatio ${values.ratio}, ${response.processingTimeMs}ms)\n`);
  for (const [rank, hit] of response.hits.entries()) {
    const score = hit._rankingScore?.toFixed(3) ?? "?";
    console.log(`${rank + 1}. [${score}] ${hit.breadcrumb}\n   ${hit.url}`);
    console.log(`   ${hit.content.replace(/\s+/g, " ").slice(0, 200)}...\n`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
