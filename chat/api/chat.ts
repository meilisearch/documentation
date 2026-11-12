import { meilisearchSearch } from "@meilisearch/ai-sdk";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, isStepCount, streamText, tool, type UIMessage } from "ai";
import { Meilisearch } from "meilisearch";
import { z } from "zod";
import { fenceLanguage, lookupCandidates, quoteFilter, selectSample } from "../src/samples.ts";
import type { ChatUser } from "../src/user.ts";

const DEFAULT_MODEL = "openai/gpt-6-luna";
const MAX_MESSAGES = 30;
const MAX_TEXT_LENGTH = 4000;
/** About 8k tokens. Safety net for the largest pages. */
const MAX_PAGE_CHARS = 30_000;
/** Default `pagination.maxTotalHits`. */
const MAX_PAGE_CHUNKS = 1000;

const DOCS_INDEX = "docs-chunks";
const ROUTES_INDEX = "api-routes";

const SYSTEM_PROMPT = `You are the Meilisearch documentation assistant, embedded in the Meilisearch docs website.

Rules:
- Always call the search tool before answering a question about Meilisearch. You may call it several times with different queries.
- Search results are page chunks. If a chunk is too partial to answer fully, call the expand_page tool with the "page" field of that result to read the whole page. Do not expand pages you do not need.
- Answer only from the search results and expanded pages. If they do not contain the answer, say so plainly and suggest rephrasing. Never invent settings, routes, parameters, or behavior.
- If the question is not about Meilisearch or search, politely decline and say what you can help with.

Output
- Be concise and direct. Synthesize the information from tool calls into a tailored answer, don't just repeat.
- Link to sources when they allow the reader to learn nore about a mentioned API or concept. Use it to avoid digressing and enable progressive disclosure of information to users.
- Links should be inserted inline as Markdown links on the relevant keywords using the "url" field of the result (append "#anchor" when "anchor" is not null). For an expanded page, use the "url" it returns, or the URL of a search result from that page. Never link to a URL that was not in the search results or returned by expand_page, and never guess an anchor.
- Write for readers who may not be native English speakers.
`;

/** Cuts `text` to at most `max` characters, on a paragraph boundary when possible. */
function truncate(text: string, max: number): { text: string; truncated: boolean } {
  if (text.length <= max) return { text, truncated: false };
  const cut = text.lastIndexOf("\n\n", max);
  return { text: text.slice(0, cut > 0 ? cut : max), truncated: true };
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return process.env.NODE_ENV !== "production";
  try {
    const { protocol, hostname } = new URL(origin);
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    if (protocol !== "https:") return false;
    return hostname === "meilisearch.com" || hostname.endsWith(".meilisearch.com") || hostname.endsWith(".vercel.app");
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
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) return new Response(null, { status: 403 });
  const headers = corsHeaders(origin);

  const { OPENROUTER_API_KEY, CHAT_MODEL, MEILISEARCH_URL, MEILISEARCH_KEY } = process.env;
  if (!OPENROUTER_API_KEY || !MEILISEARCH_URL || !MEILISEARCH_KEY) {
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

  const openrouter = createOpenRouter({ apiKey: OPENROUTER_API_KEY });

  const search = meilisearchSearch({
    host: MEILISEARCH_URL,
    apiKey: MEILISEARCH_KEY,
    indexUid: DOCS_INDEX,
    description:
      "Search the Meilisearch documentation. Results are prose chunks from guides and concept pages. Pass a focused natural-language query. Call expand_page to read a page and its code samples. Call get_api_route for a route's parameters, request body, and response.",
    searchParams: {
      limit: 8,
      hybrid: { embedder: "voyage", semanticRatio: 0.5 },
      filter: 'content_type = "prose"',
      attributesToRetrieve: ["title", "page", "url", "anchor", "breadcrumb", "content", "content_type", "tab", "group"],
    },
  });

  const client = new Meilisearch({ host: MEILISEARCH_URL, apiKey: MEILISEARCH_KEY });
  const index = client.index(DOCS_INDEX);
  const routes = client.index(ROUTES_INDEX);

  const renderSample = (codes: Record<string, string> | undefined): string => {
    const selected = selectSample(codes, user.codeLanguage);
    if (!selected.code && !selected.note) return "";
    const block = selected.code ? `\`\`\`${fenceLanguage(selected.language)}\n${selected.code}\n\`\`\`` : "";
    return [block, selected.note].filter(Boolean).join("\n\n");
  };

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

  const presentRoute = (hits: Record<string, unknown>[], matched: "exact" | "similar") => {
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

  const getApiRoute = tool({
    description:
      "Read one API route: its parameters, request body, and response example, plus a code sample already chosen for the reader's language. Pass a method and path (\"POST /indexes/{index_uid}/search\"), a docs URL, or a slug such as \"search-with-post\". If note is set, the reader's language has no sample: show the HTTP request and say so.",
    inputSchema: z.object({
      route: z
        .string()
        .min(1)
        .max(500)
        .describe('Method and path, slug, or URL. For example "POST /indexes/{index_uid}/search" or "search-with-post".'),
    }),
    execute: async ({ route }) => {
      const candidates = lookupCandidates(route);
      if (candidates.length === 0) return { error: "Provide a method and path, a docs URL, or a route slug." };
      const exact = await loadRoute(`lookup_keys IN [${candidates.map(quoteFilter).join(", ")}]`);
      if (exact.length > 0) return presentRoute(exact, "exact");

      const similar = await routes.search(route, {
        limit: 5,
        hybrid: { embedder: "voyage", semanticRatio: 0.5 },
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
    model: openrouter(CHAT_MODEL || DEFAULT_MODEL, { reasoning: { effort: "high" } }),
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
