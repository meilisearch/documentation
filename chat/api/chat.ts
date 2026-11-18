import { voyage } from "@ai-sdk/voyage";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, isStepCount, rerank, streamText, tool, type UIMessage } from "ai";
import { Meilisearch } from "meilisearch";
import { z } from "zod";
import { fenceLanguage, lookupCandidates, methodCandidates, quoteFilter, selectSample } from "../src/samples.js";
import type { ChatUser } from "../src/user.ts";

const DEFAULT_MODEL = "openai/gpt-6-luna";
const DEFAULT_QUERY_MODEL = "openai/gpt-6-luna";
const DEFAULT_ALLOWED_ORIGINS = "meilisearch.com,*.meilisearch.com,*.mintlify.site";
const MAX_MESSAGES = 30;
const MAX_TEXT_LENGTH = 4000;
/** About 8k tokens. Safety net for the largest pages. */
const MAX_PAGE_CHARS = 30_000;
/** Default `pagination.maxTotalHits`. */
const MAX_PAGE_CHUNKS = 1000;
/** Federated multi-search pool. Meilisearch merges docs and routes by ranking score. */
const RETRIEVE = 50;
/** Voyage rerank keeps this many, then the score trim drops the weak tail. */
const RERANK_TOP = 15;
/** Drop a hit below this Voyage score, unless it is one of the first MIN_KEEP. */
const MIN_SCORE = 0.5;
/** Drop a hit more than this far below the top Voyage score. */
const MAX_DROP = 0.2;
const MIN_KEEP = 3;
const MAX_SEARCHES = 2;
const MAX_READS = 2;

const HIT_FIELDS = ["title", "page", "url", "anchor", "breadcrumb", "content", "content_type", "tab", "group"] as const;

const SYSTEM_PROMPT = `You are the Meilisearch documentation assistant, embedded in the Meilisearch docs website.

Rules:
- Call the search tool before answering a question about Meilisearch. Write 1 short, keyword-rich query, about 12 words at most. If the question has two distinct parts, call search twice in the same turn, one query per part. Do not search more than twice. On a follow-up question, include the topic from the earlier turns in the query.
- Answer from the search hits. They may be prose chunks, code samples already in the reader's language, or API route chunks.
- Call expand_page or get_api_route only when the hits are not enough: a chunk is cut off, or the answer needs parameters, a request body, or a complete example. Pass expand_page the "page" field of a hit. Pass get_api_route the page of a hit whose content_type is "api_route", or a method and path. Open at most two pages or routes.
- Answer only from the search results, expanded pages, and get_api_route results. If they do not contain the answer, say so plainly and suggest rephrasing. Never invent settings, routes, parameters, or behavior.
- If the question is not about Meilisearch or search, politely decline and say what you can help with.

Output
- Be concise and direct. Synthesize the information from tool calls into a tailored answer, don't just repeat.
- Link to sources when they allow the reader to learn nore about a mentioned API or concept. Use it to avoid digressing and enable progressive disclosure of information to users.
- Links should be inserted inline as Markdown links on the relevant keywords using the "url" field of the result (append "#anchor" when "anchor" is not null). For an expanded page, use the "url" it returns, or the URL of a search result from that page. Never link to a URL that was not returned by a tool, and never guess an anchor.
- Write for readers who may not be native English speakers.
`;

/** Cuts `text` to at most `max` characters, on a paragraph boundary when possible. */
function truncate(text: string, max: number): { text: string; truncated: boolean } {
  if (text.length <= max) return { text, truncated: false };
  const cut = text.lastIndexOf("\n\n", max);
  return { text: text.slice(0, cut > 0 ? cut : max), truncated: true };
}

type ChatConfig = {
  openrouterKey: string | undefined;
  meiliUrl: string | undefined;
  meiliKey: string | undefined;
  voyageKey: string | undefined;
  model: string;
  queryModel: string;
  allowedOrigins: string[];
  docsIndex: string;
  routesIndex: string;
  embedder: string;
};

/** Reads every setting once. Empty strings fall back to the defaults. */
function readConfig(): ChatConfig {
  const env = process.env;
  return {
    openrouterKey: env.OPENROUTER_API_KEY,
    meiliUrl: env.MEILISEARCH_URL,
    meiliKey: env.MEILISEARCH_KEY,
    voyageKey: env.VOYAGE_API_KEY,
    model: env.CHAT_MODEL || DEFAULT_MODEL,
    queryModel: env.CHAT_QUERY_MODEL || DEFAULT_QUERY_MODEL,
    allowedOrigins: (env.CHAT_ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS)
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
    docsIndex: env.MEILISEARCH_DOCS_INDEX || "docs-chunks",
    routesIndex: env.MEILISEARCH_ROUTES_INDEX || "api-routes",
    embedder: env.MEILISEARCH_EMBEDDER || "voyage",
  };
}

/** `*.example.com` matches subdomains only, not the apex. */
function matchesHost(hostname: string, pattern: string): boolean {
  return pattern.startsWith("*.") ? hostname.endsWith(pattern.slice(1)) : hostname === pattern;
}

function isAllowedOrigin(origin: string | null, allowed: string[]): boolean {
  const dev = process.env.NODE_ENV !== "production";
  if (!origin) return dev;
  try {
    const { protocol, hostname } = new URL(origin);
    // Local docs (mint dev) call the hosted API. A remote site cannot use these hosts.
    if ((hostname === "localhost" || hostname === "127.0.0.1") && (protocol === "http:" || protocol === "https:")) {
      return true;
    }
    return protocol === "https:" && allowed.some((pattern) => matchesHost(hostname, pattern));
  } catch {
    return false;
  }
}

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(status: number, body: unknown, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringRecord(value: unknown): Record<string, string> | undefined {
  if (!isRecord(value)) return undefined;
  const codes: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry !== "string") return undefined;
    codes[key] = entry;
  }
  return codes;
}

type SearchHit = {
  title: string;
  page: string;
  url: string;
  anchor: string | null;
  breadcrumb: string;
  content: string;
  content_type: string;
  tab: string | null;
  group: string | null;
};

function rerankDocument(hit: { breadcrumb: string; content: string }): string {
  return hit.breadcrumb ? `${hit.breadcrumb}\n${hit.content}` : hit.content;
}

function elapsedMs(started: number): number {
  return Math.round(performance.now() - started);
}

function average(scores: number[]): number | null {
  if (scores.length === 0) return null;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function formatScore(score: number | null): string {
  return score === null ? "n/a" : score.toFixed(3);
}

const PRE_RANKS = [1, 10, 20, 50];
const POST_RANKS = [1, 5, 10, 15];

type ScoreCurve = {
  avg: number | null;
  min: number | null;
  at: Array<{ rank: number; score: number }>;
};

type MeiliSpan = {
  ms: number;
  processingMs: number;
  inFlight: number;
  trace?: Record<string, unknown>;
};

type MeiliSummary = {
  ms: number;
  processingMs: number;
  waitMs: number;
  inFlight: number;
  traces: Array<Record<string, unknown> | undefined>;
};

type TraceNode = { duration?: string; children: Map<string, TraceNode> };

type KeptHit = { page: string; rank: number; meiliRank: number };

type SearchDetail = {
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
  meiliBytes: number;
  resultBytes: number;
  pre: ScoreCurve;
  post: ScoreCurve;
  hits: KeptHit[];
};

type ReadDetail = {
  bytes: number;
  page?: string;
  matched?: string;
  meili: MeiliSummary;
};

type OpenedPage = { tool: string; arg: string; page?: string };

function scoreCurve(scores: Array<number | undefined>, ranks: number[]): ScoreCurve {
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

function formatCurve(label: string, curve: ScoreCurve): string {
  const points = curve.at.map((point) => `r${point.rank}=${point.score.toFixed(3)}`).join(" ");
  return `${label} ${points}${points ? " " : ""}min=${formatScore(curve.min)} avg=${formatScore(curve.avg)}`;
}

function formatDuration(value: number): string {
  if (value >= 10_000) return `${Math.round(value / 1000)}s`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}s`;
  return `${Math.round(value)}ms`;
}

function formatBytes(bytes: number): string {
  if (bytes < 0) return "n/a";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}kB`;
  return `${bytes}B`;
}

function formatCount(value: number | undefined): string {
  return value === undefined ? "n/a" : String(value);
}

function utf8Bytes(value: unknown): number {
  try {
    return new TextEncoder().encode(JSON.stringify(value)).length;
  } catch {
    return -1;
  }
}

function summarizeSpans(spans: MeiliSpan[]): MeiliSummary {
  const ms = spans.reduce((sum, span) => sum + span.ms, 0);
  const processingMs = spans.reduce((sum, span) => sum + span.processingMs, 0);
  const inFlight = spans.reduce((max, span) => Math.max(max, span.inFlight), 0);
  return { ms, processingMs, waitMs: Math.max(0, ms - processingMs), inFlight, traces: spans.map((span) => span.trace) };
}

function traceChild(parent: TraceNode, name: string): TraceNode {
  const existing = parent.children.get(name);
  if (existing) return existing;
  const created: TraceNode = { children: new Map() };
  parent.children.set(name, created);
  return created;
}

/** `performanceDetails` keys are `parent > child` paths. Values are duration strings. */
function addTraceValue(node: TraceNode, key: string, value: unknown): void {
  let current = node;
  for (const part of key.split(" > ")) current = traceChild(current, part);
  if (typeof value === "string" || typeof value === "number") {
    current.duration = String(value);
    return;
  }
  if (!isRecord(value)) return;
  for (const [nestedKey, nestedValue] of Object.entries(value)) addTraceValue(current, nestedKey, nestedValue);
}

function renderTrace(node: TraceNode, indent: string): string[] {
  const lines: string[] = [];
  const entries = [...node.children.entries()];
  entries.forEach(([name, child], index) => {
    const last = index === entries.length - 1;
    const duration = child.duration === undefined ? "" : `  ${child.duration}`;
    lines.push(`${indent}${last ? "└─" : "├─"} ${name}${duration}`);
    lines.push(...renderTrace(child, `${indent}${last ? "   " : "│  "}`));
  });
  return lines;
}

function formatTraces(traces: Array<Record<string, unknown> | undefined>): string[] {
  const present = traces.filter((trace): trace is Record<string, unknown> => isRecord(trace) && Object.keys(trace).length > 0);
  if (present.length === 0) return ["trace unavailable"];
  return present.flatMap((trace, index) => {
    const root: TraceNode = { children: new Map() };
    for (const [key, value] of Object.entries(trace)) addTraceValue(root, key, value);
    const heading = present.length === 1 ? "trace" : `trace ${index + 1}`;
    return [heading, ...renderTrace(root, "")];
  });
}

function logChat(lines: string[]): void {
  console.log(lines.map((line) => `[chat] ${line}`).join("\n"));
}

function formatOpened(searches: SearchDetail[], opened: OpenedPage[]): string[] {
  const openedPages = new Set<string>();
  for (const read of opened) {
    if (read.page) openedPages.add(read.page);
    if (read.tool === "expand_page") openedPages.add(read.arg);
  }

  const best = new Map<string, { rank: number; meiliRank: number; query: string }>();
  const distinct = new Set<string>();
  for (const search of searches) {
    for (const hit of search.hits) {
      if (!hit.page) continue;
      distinct.add(hit.page);
      const previous = best.get(hit.page);
      if (!openedPages.has(hit.page)) continue;
      if (!previous || hit.rank < previous.rank) {
        best.set(hit.page, { rank: hit.rank, meiliRank: hit.meiliRank, query: search.q });
      }
    }
  }

  const used = [...best.entries()].sort((a, b) => a[1].rank - b[1].rank || a[0].localeCompare(b[0]));
  const seenUnmatched = new Set<string>();
  const unmatched = opened.filter((read) => {
    const page = read.tool === "expand_page" ? read.arg : read.page;
    if (!page || best.has(page) || seenUnmatched.has(`${read.tool}\0${read.arg}\0${page}`)) return false;
    seenUnmatched.add(`${read.tool}\0${read.arg}\0${page}`);
    return true;
  });

  const lines = [`   kept ${distinct.size} pages, ${used.length} opened from those hits`];
  const rows: Array<{ label: string; query?: string }> = [
    ...used.map(([page, hit]) => ({ label: `r${hit.rank} m${hit.meiliRank} ${page}`, query: hit.query })),
    ...unmatched.map((read) => ({
      label: `${read.tool} "${read.arg}"${read.page ? ` → ${read.page}` : ""}  not in kept hits`,
    })),
  ];
  rows.forEach((row, index) => {
    const last = index === rows.length - 1;
    lines.push(`   ${last ? "└─" : "├─"} ${row.label}`);
    if (row.query) lines.push(`   ${last ? "   " : "│  "}"${row.query}"`);
  });
  return lines;
}

function rankingScore(hit: unknown): number | undefined {
  if (!isRecord(hit) || typeof hit._rankingScore !== "number") return undefined;
  return hit._rankingScore;
}

function federationIndexUid(hit: unknown): string | undefined {
  if (!isRecord(hit) || !isRecord(hit._federation) || typeof hit._federation.indexUid !== "string") return undefined;
  return hit._federation.indexUid;
}

function toolArg(input: unknown): string | undefined {
  if (!isRecord(input)) return undefined;
  const value = input.q ?? input.page ?? input.route;
  return typeof value === "string" ? value : undefined;
}

type RankedHit<T> = { hit: T; score: number; originalIndex: number };

async function rerankHits<T extends { breadcrumb: string; content: string }>(
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

const chatUserSchema = z.object({
  codeLanguage: z.string().nullable().optional(),
});

/** Missing or invalid preference becomes `{ codeLanguage: null }`. Never rejects the request. */
function parseChatUser(value: unknown): ChatUser {
  const parsed = chatUserSchema.safeParse(value ?? {});
  if (!parsed.success) return { codeLanguage: null };
  const codeLanguage = parsed.data.codeLanguage?.trim() ?? "";
  if (!codeLanguage || codeLanguage.length > 40) return { codeLanguage: null };
  return { codeLanguage };
}

function isValidMessages(messages: unknown): messages is UIMessage[] {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) return false;
  return messages.every(
    (message) =>
      message &&
      typeof message === "object" &&
      Array.isArray(message.parts) &&
      message.parts.every(
        (part: { type?: unknown; text?: unknown }) =>
          part.type !== "text" || (typeof part.text === "string" && part.text.length <= MAX_TEXT_LENGTH),
      ),
  );
}

export function OPTIONS(request: Request): Response {
  const { allowedOrigins } = readConfig();
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin, allowedOrigins)) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: Request): Promise<Response> {
  const config = readConfig();
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin, config.allowedOrigins)) return new Response(null, { status: 403 });
  const headers = corsHeaders(origin);

  const { openrouterKey, meiliUrl, meiliKey, voyageKey } = config;
  if (!openrouterKey || !meiliUrl || !meiliKey || !voyageKey) {
    const missing = (["OPENROUTER_API_KEY", "MEILISEARCH_URL", "MEILISEARCH_KEY", "VOYAGE_API_KEY"] as const).filter(
      (name) => !process.env[name],
    );
    console.error(`[chat] missing environment variables: ${missing.join(", ")}`);
    return json(500, { error: "Chat is not configured" }, headers);
  }

  void fetch(new URL("/health", meiliUrl)).catch(() => {});
  void fetch("https://api.voyageai.com/", { method: "HEAD" }).catch(() => {});

  let messages: unknown;
  let userInput: unknown;
  try {
    ({ messages, user: userInput } = await request.json());
  } catch {
    return json(400, { error: "Invalid JSON" }, headers);
  }
  if (!isValidMessages(messages)) return json(400, { error: "Invalid messages" }, headers);

  const user = parseChatUser(userInput);
  const started = performance.now();
  let inFlightMeili = 0;
  let answerFirstOutput: number | undefined;
  const searches: SearchDetail[] = [];
  const searchDetails = new Map<string, SearchDetail>();
  const seenChunks = new Set<string>();
  let searchCount = 0;
  let readCount = 0;
  const readDetails = new Map<string, ReadDetail>();
  const opened: OpenedPage[] = [];

  async function runMeili<T extends { processingTimeMs: number; performanceDetails?: unknown }>(
    spans: MeiliSpan[],
    task: () => Promise<T>,
  ): Promise<T> {
    inFlightMeili += 1;
    const inFlight = inFlightMeili;
    const meiliStarted = performance.now();
    try {
      const value = await task();
      spans.push({
        ms: elapsedMs(meiliStarted),
        processingMs: value.processingTimeMs,
        inFlight,
        trace: isRecord(value.performanceDetails) ? value.performanceDetails : undefined,
      });
      return value;
    } finally {
      inFlightMeili -= 1;
    }
  }

  function rememberRead(toolCallId: string, tool: string, arg: string, body: unknown, spans: MeiliSpan[]): void {
    const resolved = isRecord(body) && typeof body.page === "string" ? body.page : undefined;
    const matched = isRecord(body) && typeof body.matched === "string" ? body.matched : undefined;
    readDetails.set(toolCallId, {
      bytes: utf8Bytes(body),
      page: resolved ?? (tool === "expand_page" ? arg : undefined),
      matched,
      meili: summarizeSpans(spans),
    });
    opened.push({ tool, arg, page: tool === "expand_page" ? arg : resolved });
  }

  const openrouter = createOpenRouter({ apiKey: openrouterKey });
  const main = openrouter(config.model, { reasoning: { effort: "low" }, provider: { sort: "latency" } });
  const fast = openrouter(config.queryModel, {
    reasoning: { effort: "low", exclude: true },
    provider: { sort: "latency" },
  });
  const client = new Meilisearch({ host: meiliUrl, apiKey: meiliKey });
  const index = client.index(config.docsIndex);
  const routes = client.index(config.routesIndex);

  const renderSample = (codes: Record<string, string> | undefined): string => {
    const selected = selectSample(codes, user.codeLanguage);
    if (!selected.code && !selected.note) return "";
    const block = selected.code ? `\`\`\`${fenceLanguage(selected.language)}\n${selected.code}\n\`\`\`` : "";
    return [block, selected.note].filter(Boolean).join("\n\n");
  };

  const text = (value: unknown): string => (typeof value === "string" ? value : "");
  const textOrNull = (value: unknown): string | null => (typeof value === "string" ? value : null);
  const toHit = (value: unknown): SearchHit => {
    const hit = isRecord(value) ? value : {};
    const contentType = text(hit.content_type);
    const content = contentType === "code_sample" ? renderSample(stringRecord(hit.codes)) : text(hit.content);
    return {
      title: text(hit.title),
      page: text(hit.page),
      url: text(hit.url),
      anchor: textOrNull(hit.anchor),
      breadcrumb: text(hit.breadcrumb),
      content,
      content_type: contentType,
      tab: textOrNull(hit.tab),
      group: textOrNull(hit.group),
    };
  };

  const search = tool({
    description:
      "Search the Meilisearch documentation. Results are prose chunks, code samples already in the reader's language, or API route chunks. Pass one short keyword-rich query, about 12 words. If the question has two distinct parts, call this tool twice in the same turn. On a follow-up, include the topic from earlier turns. Call expand_page or get_api_route only when a hit is missing detail: parameters, a full example, or steps the chunk cuts off.",
    inputSchema: z.object({
      q: z.string().min(1).max(500).describe("The search query"),
    }),
    execute: async ({ q }, { toolCallId }) => {
      if (searchCount >= MAX_SEARCHES) return { hits: [], note: "Search budget used. Answer from earlier hits." };
      searchCount += 1;
      const spans: MeiliSpan[] = [];
      const retrieved = await runMeili(spans, () =>
        client.multiSearch({
          federation: { limit: RETRIEVE, showPerformanceDetails: true },
          queries: [
            {
              indexUid: config.docsIndex,
              q,
              hybrid: { embedder: config.embedder, semanticRatio: 0.5 },
              showRankingScore: true,
              attributesToRetrieve: [...HIT_FIELDS, "codes"],
            },
            {
              indexUid: config.routesIndex,
              q,
              hybrid: { embedder: config.embedder, semanticRatio: 0.5 },
              showRankingScore: true,
              attributesToRetrieve: [...HIT_FIELDS],
            },
          ],
        }),
      );
      const rawHits = retrieved.hits;
      const docs = rawHits.filter((hit) => federationIndexUid(hit) === config.docsIndex).length;
      const routeHits = rawHits.filter((hit) => federationIndexUid(hit) === config.routesIndex).length;
      const pool = rawHits.map((hit) => toHit(hit));
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
        meiliBytes: utf8Bytes(rawHits),
        resultBytes: utf8Bytes({ hits: [] }),
        pre: scoreCurve(
          rawHits.map((hit) => rankingScore(hit)),
          PRE_RANKS,
        ),
        post: scoreCurve([], POST_RANKS),
        hits: [],
      };
      searches.push(detail);
      searchDetails.set(toolCallId, detail);
      if (pool.length === 0) return { hits: [] };
      const reranked = await rerankHits(q, pool);
      const top = reranked.ranked[0]?.score ?? 0;
      const cutoff = top - MAX_DROP;
      let dupes = 0;
      const kept = reranked.ranked.flatMap((item, index) => {
        if (index >= MIN_KEEP && (item.score < MIN_SCORE || item.score < cutoff)) return [];
        const key = `${item.hit.page}#${item.hit.anchor ?? ""}`;
        if (seenChunks.has(key)) {
          dupes += 1;
          return [];
        }
        seenChunks.add(key);
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
      return { hits: kept.map((item) => item.hit) };
    },
  });

  // Chunks of one page are ordered by chunk_index. Joining them rebuilds the page, samples included.
  const expandPage = tool({
    description:
      "Read one documentation page in full, including code samples already chosen for the reader's language. Use it only when a search hit cuts off the steps or example the answer needs. Pass the `page` field of a search result.",
    inputSchema: z.object({
      page: z
        .string()
        .min(1)
        .max(300)
        .regex(/^[\w\-/.]+$/)
        .describe('The "page" field of a search result, for example "capabilities/personalization/overview"'),
    }),
    execute: async ({ page }, { toolCallId }) => {
      if (readCount >= MAX_READS) {
        const denied = { error: "Read budget used. Answer from what you have." };
        rememberRead(toolCallId, "expand_page", page, denied, []);
        return denied;
      }
      readCount += 1;
      const spans: MeiliSpan[] = [];
      const { hits, estimatedTotalHits } = await runMeili(spans, () =>
        index.search("", {
          filter: `page = "${page}"`, // the schema regex rejects quotes and backslashes
          sort: ["chunk_index:asc"],
          limit: MAX_PAGE_CHUNKS,
          attributesToRetrieve: ["title", "url", "content", "content_type", "codes"],
          showPerformanceDetails: true,
        }),
      );
      if (hits.length === 0) {
        const missing = { error: `No page found for "${page}". Use the page field of a search result.` };
        rememberRead(toolCallId, "expand_page", page, missing, spans);
        return missing;
      }
      const parts = hits.map((hit) =>
        hit.content_type === "code_sample" ? renderSample(hit.codes as Record<string, string> | undefined) : String(hit.content ?? ""),
      );
      const markdown = [`# ${hits[0].title}`, ...parts.filter(Boolean)].join("\n\n");
      const { text, truncated } = truncate(markdown, MAX_PAGE_CHARS);
      const body = {
        title: hits[0].title as string,
        url: (hits[0].url as string).split("#")[0],
        markdown: text,
        truncated: truncated || (estimatedTotalHits ?? hits.length) > hits.length,
      };
      rememberRead(toolCallId, "expand_page", page, body, spans);
      return body;
    },
  });

  const routeAttributes = ["title", "page", "url", "content", "chunk_index", "codes"];
  const loadRoute = async (filter: string, spans: MeiliSpan[]) => {
    const { hits } = await runMeili(spans, () =>
      routes.search("", {
        filter,
        sort: ["chunk_index:asc"],
        limit: MAX_PAGE_CHUNKS,
        attributesToRetrieve: routeAttributes,
        showPerformanceDetails: true,
      }),
    );
    return hits;
  };

  const presentRoute = (hits: Record<string, unknown>[], matched: "exact" | "similar" | "sdk_method") => {
    const codes = hits.find((hit) => hit.codes)?.codes as Record<string, string> | undefined;
    const selected = selectSample(codes, user.codeLanguage);
    const markdown = hits.map((hit) => String(hit.content ?? "")).join("\n\n");
    const { text, truncated } = truncate(markdown, MAX_PAGE_CHARS);
    return {
      matched,
      title: hits[0].title as string,
      page: hits[0].page as string,
      url: String(hits[0].url).split("#")[0],
      markdown: text,
      truncated,
      language: selected.language,
      code: selected.code,
      ...(selected.note ? { note: selected.note } : {}),
    };
  };

  const pagesOf = (hits: readonly object[]) => {
    const seen = new Set<string>();
    const pages: { title: string; page: string; url: string }[] = [];
    for (const hit of hits) {
      if (!isRecord(hit)) continue;
      const page = hit.page;
      if (typeof page !== "string" || seen.has(page)) continue;
      seen.add(page);
      const url = hit.url;
      pages.push({
        title: typeof hit.title === "string" ? hit.title : "",
        page,
        url: typeof url === "string" ? url.split("#")[0] : "",
      });
    }
    return pages;
  };

  const getApiRoute = tool({
    description:
      'Read one API route: its parameters, request body, and response example, plus a code sample already chosen for the reader\'s language. Pass a method and path ("POST /indexes/{index_uid}/search"), a docs URL, a slug such as "search-with-post", or an SDK method name such as updateEmbedders or update_embedders. If note is set, the reader\'s language has no sample: show the HTTP request and say so.',
    inputSchema: z.object({
      route: z
        .string()
        .min(1)
        .max(500)
        .describe(
          'Method and path, docs URL, slug, or SDK method name. For example "POST /indexes/{index_uid}/search", "search-with-post", or "updateEmbedders".',
        ),
    }),
    execute: async ({ route }, { toolCallId }) => {
      if (readCount >= MAX_READS) {
        const denied = { error: "Read budget used. Answer from what you have." };
        rememberRead(toolCallId, "get_api_route", route, denied, []);
        return denied;
      }
      readCount += 1;
      const spans: MeiliSpan[] = [];
      const finish = (body: unknown) => {
        rememberRead(toolCallId, "get_api_route", route, body, spans);
        return body;
      };
      const candidates = lookupCandidates(route);
      if (candidates.length === 0) return finish({ error: "Provide a method and path, a docs URL, a slug, or an SDK method name." });
      const exact = await loadRoute(`lookup_keys IN [${candidates.map(quoteFilter).join(", ")}]`, spans);
      if (exact.length > 0) return finish(presentRoute(exact, "exact"));

      const methods = methodCandidates(route);
      if (methods.length > 0) {
        const methodHits = await loadRoute(`sdk_methods IN [${methods.map(quoteFilter).join(", ")}]`, spans);
        const pages = pagesOf(methodHits);
        if (pages.length === 1) return finish(presentRoute(methodHits, "sdk_method"));
        if (pages.length > 1) {
          return finish({
            matches: pages.slice(0, 8),
            hint: "Several routes match this SDK method. Call get_api_route again with the method and path (the title or page).",
          });
        }
      }

      const similar = await runMeili(spans, () =>
        routes.search(route, {
          limit: 5,
          hybrid: { embedder: config.embedder, semanticRatio: 0.5 },
          attributesToRetrieve: ["page"],
          showPerformanceDetails: true,
        }),
      );
      const page = similar.hits[0]?.page as string | undefined;
      if (!page) return finish({ error: `No API route found for "${route}".` });
      const hits = await loadRoute(`page = ${quoteFilter(page)}`, spans);
      if (hits.length === 0) return finish({ error: `No API route found for "${route}".` });
      return finish(presentRoute(hits, "similar"));
    },
  });

  const logFooter = (status: string) => {
    const lines = [`└─ ${status}`];
    if (answerFirstOutput !== undefined) lines.push(`   answer firstOutput +${formatDuration(answerFirstOutput)}`);
    lines.push(...formatOpened(searches, opened));
    logChat(lines);
  };

  logChat(["trace"]);
  const result = streamText({
    model: main,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: { search, expand_page: expandPage, get_api_route: getApiRoute },
    stopWhen: isStepCount(3),
    prepareStep: ({ stepNumber }) => {
      if (stepNumber === 0) return { model: fast, activeTools: ["search"], toolChoice: "required" };
      if (stepNumber === 1) return { activeTools: ["expand_page", "get_api_route"] };
      return { toolChoice: "none" };
    },
    onStepEnd: (step) => {
      const stepMs = Math.round(step.performance.stepTimeMs);
      const now = elapsedMs(started);
      const ttft = step.performance.timeToFirstOutputMs;
      const firstOutputAt = ttft === undefined ? undefined : now - stepMs + Math.round(ttft);
      if (step.finishReason === "stop" && firstOutputAt !== undefined) answerFirstOutput = firstOutputAt;

      const durations = step.toolCalls.map((call) => step.performance.toolExecutionMs[call.toolCallId] ?? 0);
      const slowest = durations.length > 1 ? Math.max(...durations) : undefined;
      const lines = [
        `├─ step ${step.stepNumber}  ${formatDuration(stepMs)}  at +${formatDuration(now)}  model ${formatDuration(Math.round(step.performance.responseTimeMs))}  firstOutput ${firstOutputAt === undefined ? "n/a" : `+${formatDuration(firstOutputAt)}`}  in ${formatCount(step.usage.inputTokens)} cache ${formatCount(step.usage.inputTokenDetails?.cacheReadTokens)} out ${formatCount(step.usage.outputTokens)} reason ${formatCount(step.usage.outputTokenDetails?.reasoningTokens)}  ${step.finishReason}`,
      ];

      step.toolCalls.forEach((call, index) => {
        const last = index === step.toolCalls.length - 1;
        const branch = last ? "└─" : "├─";
        const pad = last ? "   " : "│  ";
        const duration = step.performance.toolExecutionMs[call.toolCallId];
        const slow = slowest !== undefined && duration === slowest && slowest > 0 ? "  slowest" : "";
        const arg = toolArg(call.input) ?? "";
        const durationLabel = duration === undefined ? "n/a" : formatDuration(Math.round(duration));

        if (call.toolName === "search") {
          const detail = searchDetails.get(call.toolCallId);
          lines.push(`│  ${branch} search  ${durationLabel}${slow}  "${arg}"`);
          if (!detail) {
            lines.push(`│  ${pad}no detail`);
            return;
          }
          lines.push(
            `│  ${pad}meili ${formatDuration(detail.meili.ms)}  processing ${formatDuration(detail.meili.processingMs)}  wait ${formatDuration(detail.meili.waitMs)}  inFlight ${detail.meili.inFlight}  payload ${formatBytes(detail.meiliBytes)}`,
          );
          for (const line of formatTraces(detail.meili.traces)) lines.push(`│  ${pad}${line}`);
          const cutoff = detail.cutoff === null ? "n/a" : detail.cutoff.toFixed(3);
          lines.push(
            `│  ${pad}rerank ${formatDuration(detail.rerankMs)}  ${detail.candidates}→${detail.reranked}  trimmed ${detail.reranked}→${detail.kept}  cutoff ${cutoff}  dupes ${detail.dupes}  docs ${detail.docs}  routes ${detail.routes}  result ${formatBytes(detail.resultBytes)}`,
          );
          lines.push(`│  ${pad}${formatCurve("pre ", detail.pre)}`);
          lines.push(`│  ${pad}${formatCurve("post", detail.post)}`);
          return;
        }

        const read = readDetails.get(call.toolCallId);
        const page = read?.page && read.page !== arg ? `  page ${read.page}` : "";
        const matched = read?.matched ? `  ${read.matched}` : "";
        const bytes = read ? `  ${formatBytes(read.bytes)}` : "";
        const meili = read
          ? `  meili ${formatDuration(read.meili.ms)}  processing ${formatDuration(read.meili.processingMs)}  wait ${formatDuration(read.meili.waitMs)}  inFlight ${read.meili.inFlight}`
          : "";
        lines.push(`│  ${branch} ${call.toolName}  ${durationLabel}${slow}  "${arg}"${bytes}${meili}${page}${matched}`);
        if (read) for (const line of formatTraces(read.meili.traces)) lines.push(`│  ${pad}${line}`);
      });

      logChat(lines);
    },
    onStepError: (event) => {
      logChat([`├─ step ${event.stepNumber}  failed  at +${formatDuration(elapsedMs(started))}`]);
      console.error("[chat] step error", event.error);
    },
    onEnd: (event) => {
      logFooter(
        `roundtrip ${formatDuration(elapsedMs(started))}  steps ${event.steps.length}  ${event.finishReason}  in ${formatCount(event.usage.inputTokens)} cache ${formatCount(event.usage.inputTokenDetails?.cacheReadTokens)} out ${formatCount(event.usage.outputTokens)} reason ${formatCount(event.usage.outputTokenDetails?.reasoningTokens)}`,
      );
    },
    onAbort: (event) => {
      logFooter(`aborted  at +${formatDuration(elapsedMs(started))}  steps ${event.steps.length}`);
    },
  });

  return result.toUIMessageStreamResponse({
    headers,
    onError: (error) => {
      console.error("[chat] stream error", error);
      return "Something went wrong. Please try again.";
    },
  });
}
