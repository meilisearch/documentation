import { voyage } from "@ai-sdk/voyage";
import { rerank } from "ai";
import { average, elapsedMs } from "./format.js";

/** Voyage rerank keeps this many, then the score trim drops the weak tail. */
export const RERANK_TOP = 15;
/** Drop a hit below this Voyage score, unless it is one of the first MIN_KEEP. */
export const MIN_SCORE = 0.5;
/** Drop a hit more than this far below the top Voyage score. */
export const MAX_DROP = 0.2;
export const MIN_KEEP = 3;

export const PRE_RANKS = [1, 10, 20, 50];
export const POST_RANKS = [1, 5, 10, 15];

export type ScoreCurve = {
  avg: number | null;
  min: number | null;
  at: Array<{ rank: number; score: number }>;
};

export function scoreCurve(scores: Array<number | undefined>, ranks: number[]): ScoreCurve {
  const finite = scores.filter((score): score is number => typeof score === "number" && Number.isFinite(score));
  return {
    avg: average(finite),
    min: finite.length === 0 ? null : Math.min(...finite),
    at: ranks.flatMap((rank) => {
      const score = scores[rank - 1];
      return typeof score === "number" && Number.isFinite(score) ? [{ rank, score }] : [];
    }),
  };
}

export function rerankDocument(hit: {
  breadcrumb: string;
  content: string;
  description?: string;
  version_label?: string;
}): string {
  const heading = [hit.version_label, hit.description, hit.breadcrumb].filter(Boolean).join("\n");
  return heading ? `${heading}\n${hit.content}` : hit.content;
}

export type RankedHit<T> = { hit: T; score: number; originalIndex: number };

export async function rerankHits<T extends { breadcrumb: string; content: string }>(
  query: string,
  pool: T[],
): Promise<{ ranked: RankedHit<T>[]; ms: number }> {
  const started = performance.now();
  const documents = pool.map(rerankDocument);
  try {
    const { ranking } = await rerank({
      model: voyage.reranking("rerank-3"),
      query,
      documents,
      topN: RERANK_TOP,
    });
    return {
      ranked: ranking.map((item) => ({ hit: pool[item.originalIndex], score: item.score, originalIndex: item.originalIndex })),
      ms: elapsedMs(started),
    };
  } catch (error) {
    console.error("[chat] rerank failed", error);
    throw error;
  }
}
