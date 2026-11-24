import { tool } from "ai";
import { MeilisearchApiError } from "meilisearch";
import { z } from "zod";
import { RETRIEVE } from "../config.js";
import { utf8Bytes } from "../lib/format.js";
import { toHit } from "../lib/hits.js";
import { summarizeSpans, type MeiliSpan } from "../lib/meili.js";
import { isRecord } from "../lib/records.js";
import { MAX_DROP, MIN_KEEP, MIN_SCORE, POST_RANKS, PRE_RANKS, rerankHits, scoreCurve } from "../lib/rerank.js";
import type { AgentContext, SearchDetail } from "../state.js";

const HIT_FIELDS = ["title", "page", "anchor", "breadcrumb", "content", "content_type", "tab", "group", "version_label", "released_on"] as const;

function rankingScore(hit: unknown): number | undefined {
  if (!isRecord(hit) || typeof hit._rankingScore !== "number") return undefined;
  return hit._rankingScore;
}

function federationIndexUid(hit: unknown): string | undefined {
  if (!isRecord(hit) || !isRecord(hit._federation) || typeof hit._federation.indexUid !== "string") return undefined;
  return hit._federation.indexUid;
}

export function createSearchTool(ctx: AgentContext) {
  return tool({
    description:
      "Search the Meilisearch documentation and changelog. Pass one short, keyword-rich query of about 12 words. A question with two distinct parts takes two calls in the same turn; a follow-up includes the earlier topic in its query.",
    inputSchema: z.object({
      q: z.string().min(1).max(500).describe("The search query"),
    }),
    execute: async ({ q }, { toolCallId }) => {
      const spans: MeiliSpan[] = [];
      const docsQuery = {
        indexUid: ctx.config.docsIndex,
        q,
        hybrid: { embedder: ctx.config.embedder, semanticRatio: 0.5 },
        showRankingScore: true,
        attributesToRetrieve: [...HIT_FIELDS, "codes"],
      };
      const routesQuery = {
        indexUid: ctx.config.routesIndex,
        q,
        hybrid: { embedder: ctx.config.embedder, semanticRatio: 0.5 },
        showRankingScore: true,
        attributesToRetrieve: [...HIT_FIELDS],
      };
      const changelogQuery = {
        indexUid: ctx.config.changelogIndex,
        q,
        hybrid: { embedder: ctx.config.embedder, semanticRatio: 0.5 },
        showRankingScore: true,
        attributesToRetrieve: [...HIT_FIELDS, "release_section", "description"],
        federationOptions: { weight: 0.8 },
      };
      const searchIndexes = (queries: Array<typeof docsQuery | typeof routesQuery | typeof changelogQuery>) =>
        ctx.spans.run(spans, () =>
          ctx.meili.client.multiSearch({
            federation: { limit: RETRIEVE, showPerformanceDetails: true },
            queries,
          }),
        );
      let retrieved;
      try {
        retrieved = await searchIndexes([docsQuery, routesQuery, changelogQuery]);
      } catch (error) {
        if (!(error instanceof MeilisearchApiError) || error.cause?.code !== "index_not_found") throw error;
        console.error("[chat] changelog index missing; searching docs and routes only");
        retrieved = await searchIndexes([docsQuery, routesQuery]);
      }
      const rawHits = retrieved.hits;
      const docs = rawHits.filter((hit) => federationIndexUid(hit) === ctx.config.docsIndex).length;
      const routeHits = rawHits.filter((hit) => federationIndexUid(hit) === ctx.config.routesIndex).length;
      const changelogHits = rawHits.filter((hit) => federationIndexUid(hit) === ctx.config.changelogIndex).length;
      const pool = rawHits.map((hit) => toHit(hit, ctx.user.codeLanguage));
      const detail: SearchDetail = {
        q,
        meili: summarizeSpans(spans),
        rerankMs: 0,
        candidates: pool.length,
        reranked: 0,
        kept: 0,
        cutoff: null,
        dupes: 0,
        docs,
        routes: routeHits,
        changelog: changelogHits,
        meiliBytes: utf8Bytes(rawHits),
        resultBytes: utf8Bytes({ hits: [] }),
        pre: scoreCurve(
          rawHits.map((hit) => rankingScore(hit)),
          PRE_RANKS,
        ),
        post: scoreCurve([], POST_RANKS),
        hits: [],
      };
      ctx.details.searches.push(detail);
      ctx.details.byCall.set(toolCallId, detail);
      if (pool.length === 0) return { hits: [] };
      const reranked = await rerankHits(q, pool);
      const top = reranked.ranked[0]?.score ?? 0;
      const cutoff = top - MAX_DROP;
      let dupes = 0;
      const kept = reranked.ranked.flatMap((item, index) => {
        if (index >= MIN_KEEP && (item.score < MIN_SCORE || item.score < cutoff)) return [];
        const key = `${item.hit.page}#${item.hit.anchor ?? ""}`;
        if (ctx.pool.seenChunks.has(key)) {
          dupes += 1;
          return [];
        }
        ctx.pool.seenChunks.add(key);
        return [{ ...item, voyageRank: index + 1 }];
      });
      detail.rerankMs = reranked.ms;
      detail.reranked = reranked.ranked.length;
      detail.kept = kept.length;
      detail.cutoff = reranked.ranked.length === 0 ? null : Math.max(MIN_SCORE, cutoff);
      detail.dupes = dupes;
      detail.post = scoreCurve(
        reranked.ranked.map((item) => item.score),
        POST_RANKS,
      );
      detail.hits = kept.flatMap((item) => (item.hit.page ? [{ page: item.hit.page, rank: item.voyageRank, meiliRank: item.originalIndex + 1 }] : []));
      detail.resultBytes = utf8Bytes({ hits: kept.map((item) => item.hit) });
      for (const item of kept) ctx.pool.rememberPage(item.hit, item.score);
      return { hits: kept.map((item) => item.hit) };
    },
  });
}
