import { meilisearchSearch } from "@meilisearch/ai-sdk";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, isStepCount, streamText, tool, type UIMessage } from "ai";
import { Meilisearch } from "meilisearch";
import { z } from "zod";

const DEFAULT_MODEL = "openai/gpt-6-luna";
const MAX_MESSAGES = 30;
const MAX_TEXT_LENGTH = 4000;
/** About 8k tokens. Safety net for the largest pages. */
const MAX_PAGE_CHARS = 30_000;
/** Default `pagination.maxTotalHits`. */
const MAX_PAGE_CHUNKS = 1000;

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
  try {
    ({ messages } = await request.json());
  } catch {
    return json(400, { error: "Invalid JSON" }, headers);
  }
  if (!isValidMessages(messages)) return json(400, { error: "Invalid messages" }, headers);

  const openrouter = createOpenRouter({ apiKey: OPENROUTER_API_KEY });

  const search = meilisearchSearch({
    host: MEILISEARCH_URL,
    apiKey: MEILISEARCH_KEY,
    indexUid: "docs-chunks",
    description: "Search the Meilisearch documentation (guides, API reference, concepts). Pass a focused natural-language query.",
    searchParams: {
      limit: 8,
      hybrid: { embedder: "voyage", semanticRatio: 0.5 },
      attributesToRetrieve: ["title", "page", "url", "anchor", "breadcrumb", "content"],
    },
  });

  // `meilisearchSearch` only accepts a query, so reading a whole page needs its own tool.
  // Chunks are exact, non-overlapping slices of the page (see scripts/ingest), so joining them rebuilds it.
  const index = new Meilisearch({ host: MEILISEARCH_URL, apiKey: MEILISEARCH_KEY }).index("docs-chunks");
  const expandPage = tool({
    description:
      "Read the full content of one documentation page. Use it when a search result is too partial to answer, for example a cut-off step list or table. Pass the `page` field of a search result.",
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
        attributesToRetrieve: ["title", "url", "content"],
      });
      if (hits.length === 0) return { error: `No page found for "${page}". Use the page field of a search result.` };

      const markdown = [`# ${hits[0].title}`, ...hits.map((hit) => hit.content)].join("\n\n");
      const { text, truncated } = truncate(markdown, MAX_PAGE_CHARS);
      return {
        title: hits[0].title as string,
        url: (hits[0].url as string).split("#")[0],
        markdown: text,
        truncated: truncated || (estimatedTotalHits ?? hits.length) > hits.length,
      };
    },
  });

  const result = streamText({
    model: openrouter(CHAT_MODEL || DEFAULT_MODEL, { reasoning: { effort: "high" } }),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: { search, expand_page: expandPage },
    stopWhen: isStepCount(7),
    onStepFinish: ({ toolCalls }) => {
      for (const call of toolCalls) {
        const { q, page } = call.input as { q?: string; page?: string };
        console.log(`[chat] ${call.toolName}: ${q ?? page}`);
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
