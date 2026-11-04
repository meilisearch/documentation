import { meilisearchSearch } from "@meilisearch/ai-sdk";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, isStepCount, streamText, type UIMessage } from "ai";

const DEFAULT_MODEL = "openai/gpt-6-luna";
const MAX_MESSAGES = 30;
const MAX_TEXT_LENGTH = 4000;

const SYSTEM_PROMPT = `You are the Meilisearch documentation assistant, embedded in the Meilisearch docs website.

Rules:
- Always call the search tool before answering a question about Meilisearch. You may call it several times with different queries.
- Answer only from the search results. If they do not contain the answer, say so plainly and suggest rephrasing. Never invent settings, routes, parameters, or behavior.
- Be concise and direct. Use short paragraphs, lists, and code blocks. Write for readers who may not be native English speakers.
- Cite your sources inline as Markdown links to the page the information came from, using the "url" field of the result (append "#anchor" when "anchor" is not null). Never link to a URL that was not in the search results.
- Do not use em dashes.
- If the question is not about Meilisearch or search, politely decline and say what you can help with.`;

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
      attributesToRetrieve: ["title", "url", "anchor", "breadcrumb", "content"],
    },
  });

  const result = streamText({
    model: openrouter(CHAT_MODEL || DEFAULT_MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: { search },
    stopWhen: isStepCount(5),
  });

  return result.toUIMessageStreamResponse({
    headers,
    onError: (error) => {
      console.error("[chat] stream error", error);
      return "Something went wrong. Please try again.";
    },
  });
}
