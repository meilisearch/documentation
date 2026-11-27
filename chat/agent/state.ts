import { Meilisearch } from "meilisearch";
import type { ChatUser } from "../shared/user.js";
import type { ChatConfig } from "./config.js";
import { utf8Bytes } from "./lib/format.js";
import { summarizeSpans, type MeiliSpan, type MeiliSummary, type SpanRecorder, createSpanRecorder } from "./lib/meili.js";
import type { ScoreCurve } from "./lib/rerank.js";
import { isRecord } from "./lib/records.js";
import { createSourcePool, type SourcePool } from "./lib/sources.js";

export type KeptHit = { page: string; rank: number; meiliRank: number };

export type SearchDetail = {
  q: string;
  meili: MeiliSummary;
  rerankMs: number;
  candidates: number;
  reranked: number;
  kept: number;
  cutoff: number | null;
  dupes: number;
  docs: number;
  routes: number;
  changelog: number;
  meiliBytes: number;
  resultBytes: number;
  pre: ScoreCurve;
  post: ScoreCurve;
  hits: KeptHit[];
};

export type ReadDetail = {
  bytes: number;
  page?: string;
  matched?: string;
  meili: MeiliSummary;
};

export type OpenedPage = { tool: string; arg: string; page?: string };

export type ReleaseListDetail = { count: number; bytes: number; oldest?: string; meili: MeiliSummary };

export type AgentContext = {
  config: ChatConfig;
  user: ChatUser;
  meili: {
    client: Meilisearch;
    docs: ReturnType<Meilisearch["index"]>;
    routes: ReturnType<Meilisearch["index"]>;
    changelog: ReturnType<Meilisearch["index"]>;
  };
  spans: SpanRecorder;
  pool: SourcePool;
  details: {
    searches: SearchDetail[];
    byCall: Map<string, SearchDetail>;
    reads: Map<string, ReadDetail>;
    releaseLists: Map<string, ReleaseListDetail>;
    opened: OpenedPage[];
  };
  answer: { text: string; firstOutputAt?: number };
  started: number;
};

export function createAgentContext(config: ChatConfig, user: ChatUser, started: number): AgentContext {
  if (!config.meiliUrl || !config.meiliKey) throw new Error("Chat is not configured");
  const client = new Meilisearch({ host: config.meiliUrl, apiKey: config.meiliKey });
  return {
    config,
    user,
    meili: {
      client,
      docs: client.index(config.docsIndex),
      routes: client.index(config.routesIndex),
      changelog: client.index(config.changelogIndex),
    },
    spans: createSpanRecorder(),
    pool: createSourcePool(),
    details: {
      searches: [],
      byCall: new Map(),
      reads: new Map(),
      releaseLists: new Map(),
      opened: [],
    },
    answer: { text: "" },
    started,
  };
}

export function rememberRead(
  ctx: AgentContext,
  toolCallId: string,
  tool: string,
  arg: string,
  body: unknown,
  spans: MeiliSpan[],
): void {
  const resolved = isRecord(body) && typeof body.page === "string" ? body.page : undefined;
  const matched = isRecord(body) && typeof body.matched === "string" ? body.matched : undefined;
  ctx.details.reads.set(toolCallId, {
    bytes: utf8Bytes(body),
    page: resolved ?? (tool === "expand_page" ? arg : undefined),
    matched,
    meili: summarizeSpans(spans),
  });
  ctx.details.opened.push({ tool, arg, page: tool === "expand_page" ? arg : resolved });
}
