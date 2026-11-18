import { voyage } from "@ai-sdk/voyage";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, isStepCount, rerank, streamText, tool, type UIMessage } from "ai";
import { Meilisearch } from "meilisearch";
import { z } from "zod";
import { fenceLanguage, lookupCandidates, methodCandidates, quoteFilter, selectSample } from "../src/samples.js";
import type { ChatUser } from "../src/user.ts";

const DEFAULT_MODEL = "openai/gpt-6-luna";
const DEFAULT_ALLOWED_ORIGINS = "meilisearch.com,*.meilisearch.com,*.mintlify.site";
const MAX_MESSAGES = 30;
const MAX_TEXT_LENGTH = 4000;
/** About 8k tokens. Safety net for the largest pages. */
const MAX_PAGE_CHARS = 30_000;
/** Default `pagination.maxTotalHits`. */
const MAX_PAGE_CHUNKS = 1000;
const RETRIEVE_DOCS = 80;
const RETRIEVE_ROUTES = 20;
const KEEP = 20;

const HIT_FIELDS = ["title", "page", "url", "anchor", "breadcrumb", "content", "content_type", "tab", "group"] as const;

const SYSTEM_PROMPT = `You are the Meilisearch documentation assistant, embedded in the Meilisearch docs website.

Rules:
- Always call the search tool before answering a question about Meilisearch. You may call it several times with different queries.
- Search results may be prose chunks, code samples already in the reader's language, or API route chunks. If a chunk is too partial to answer fully, call the expand_page tool with the "page" field of that result to read the whole page. Do not expand pages you do not need.
- If a search hit is an API route (content_type "api_route") and the answer needs parameters or a request body, call get_api_route with that hit's page.
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

async function rerankHits<T extends { breadcrumb: string; content: string }>(query: string, pool: T[]): Promise<T[]> {
  const documents = pool.map(rerankDocument);
  try {
    const { ranking } = await rerank({
      model: voyage.reranking("rerank-3"),
      query,
      documents,
      topN: KEEP,
    });
    console.log(`[chat] search: ${pool.length} candidates, ${ranking.length} reranked`);
    return ranking.map((item) => pool[item.originalIndex]);
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

  let messages: unknown;
  let userInput: unknown;
  try {
    ({ messages, user: userInput } = await request.json());
  } catch {
    return json(400, { error: "Invalid JSON" }, headers);
  }
  if (!isValidMessages(messages)) return json(400, { error: "Invalid messages" }, headers);

  const user = parseChatUser(userInput);

  const openrouter = createOpenRouter({ apiKey: openrouterKey });
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
      'Search the Meilisearch documentation. Results are prose chunks from guides and concept pages, and may also be a code sample already rendered in the reader\'s language or an API route chunk. Pass a focused natural-language query. Call expand_page to read a page and its code samples. Call get_api_route for a route\'s parameters, request body, and response. When a hit has content_type "api_route", call get_api_route with its page before stating parameters or a request body.',
    inputSchema: z.object({
      q: z.string().min(1).max(500).describe("The search query"),
    }),
    execute: async ({ q }) => {
      const retrieved = await client.multiSearch({
        queries: [
          {
            indexUid: config.docsIndex,
            q,
            limit: RETRIEVE_DOCS,
            hybrid: { embedder: config.embedder, semanticRatio: 0.5 },
            attributesToRetrieve: [...HIT_FIELDS, "codes"],
          },
          {
            indexUid: config.routesIndex,
            q,
            limit: RETRIEVE_ROUTES,
            hybrid: { embedder: config.embedder, semanticRatio: 0.5 },
            attributesToRetrieve: [...HIT_FIELDS],
          },
        ],
      });
      const pool = [...(retrieved.results[0]?.hits ?? []), ...(retrieved.results[1]?.hits ?? [])].map((hit) => toHit(hit));
      if (pool.length === 0) return { hits: [] };
      return { hits: await rerankHits(q, pool) };
    },
  });

  // Chunks of one page are ordered by chunk_index. Joining them rebuilds the page, samples included.
  const expandPage = tool({
    description:
      "Read one documentation page in its real order, including code samples already chosen for the reader's language. Use it when a search result is too partial to answer. Pass the `page` field of a search result.",
    inputSchema: z.object({
      page: z
        .string()
        .min(1)
        .max(300)
        .regex(/^[\w\-/.]+$/)
        .describe('The "page" field of a search result, for example "capabilities/personalization/overview"'),
    }),
    execute: async ({ page }) => {
      const { hits, estimatedTotalHits } = await index.search("", {
        filter: `page = "${page}"`, // the schema regex rejects quotes and backslashes
        sort: ["chunk_index:asc"],
        limit: MAX_PAGE_CHUNKS,
        attributesToRetrieve: ["title", "url", "content", "content_type", "codes"],
      });
      if (hits.length === 0) return { error: `No page found for "${page}". Use the page field of a search result.` };

      const parts = hits.map((hit) =>
        hit.content_type === "code_sample" ? renderSample(hit.codes as Record<string, string> | undefined) : String(hit.content ?? ""),
      );
      const markdown = [`# ${hits[0].title}`, ...parts.filter(Boolean)].join("\n\n");
      const { text, truncated } = truncate(markdown, MAX_PAGE_CHARS);
      return {
        title: hits[0].title as string,
        url: (hits[0].url as string).split("#")[0],
        markdown: text,
        truncated: truncated || (estimatedTotalHits ?? hits.length) > hits.length,
      };
    },
  });

  const routeAttributes = ["title", "page", "url", "content", "chunk_index", "codes"];
  const loadRoute = async (filter: string) => {
    const { hits } = await routes.search("", {
      filter,
      sort: ["chunk_index:asc"],
      limit: MAX_PAGE_CHUNKS,
      attributesToRetrieve: routeAttributes,
    });
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
    execute: async ({ route }) => {
      const candidates = lookupCandidates(route);
      if (candidates.length === 0) return { error: "Provide a method and path, a docs URL, a slug, or an SDK method name." };
      const exact = await loadRoute(`lookup_keys IN [${candidates.map(quoteFilter).join(", ")}]`);
      if (exact.length > 0) return presentRoute(exact, "exact");

      const methods = methodCandidates(route);
      if (methods.length > 0) {
        const methodHits = await loadRoute(`sdk_methods IN [${methods.map(quoteFilter).join(", ")}]`);
        const pages = pagesOf(methodHits);
        if (pages.length === 1) return presentRoute(methodHits, "sdk_method");
        if (pages.length > 1) {
          return {
            matches: pages.slice(0, 8),
            hint: "Several routes match this SDK method. Call get_api_route again with the method and path (the title or page).",
          };
        }
      }

      const similar = await routes.search(route, {
        limit: 5,
        hybrid: { embedder: config.embedder, semanticRatio: 0.5 },
        attributesToRetrieve: ["page"],
      });
      const page = similar.hits[0]?.page as string | undefined;
      if (!page) return { error: `No API route found for "${route}".` };
      const hits = await loadRoute(`page = ${quoteFilter(page)}`);
      if (hits.length === 0) return { error: `No API route found for "${route}".` };
      return presentRoute(hits, "similar");
    },
  });

  const result = streamText({
    model: openrouter(config.model, { reasoning: { effort: "high" } }),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: { search, expand_page: expandPage, get_api_route: getApiRoute },
    stopWhen: isStepCount(7),
    onStepFinish: ({ toolCalls }) => {
      for (const call of toolCalls) {
        const { q, page, route } = call.input as { q?: string; page?: string; route?: string };
        console.log(`[chat] ${call.toolName}: ${q ?? page ?? route}`);
      }
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
