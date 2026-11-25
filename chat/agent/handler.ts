import { missingSettings, readConfig } from "./config.js";
import { corsHeaders, isAllowedOrigin, isValidMessages, json, parseChatUser } from "./http.js";
import { createAgentContext } from "./state.js";
import { createChatResponse } from "./agent.js";

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

  const missing = missingSettings();
  if (missing.length > 0) {
    console.error(`[chat] missing environment variables: ${missing.join(", ")}`);
    return json(500, { error: "Chat is not configured" }, headers);
  }

  void fetch(new URL("/health", config.meiliUrl!)).catch(() => {});
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
  const now = new Date();
  const ctx = createAgentContext(config, user, performance.now());

  try {
    return await createChatResponse(ctx, messages, now, headers);
  } catch (error) {
    console.error("[chat] could not start", error);
    return json(502, { error: "Something went wrong. Please try again." }, headers);
  }
}
