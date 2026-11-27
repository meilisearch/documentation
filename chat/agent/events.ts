import { waitUntil } from "@vercel/functions";
import { z } from "zod";
import { readConfig, type ChatConfig } from "./config.js";
import { conversationId, corsHeaders, isAllowedOrigin, json, opaqueId, traceId } from "./http.js";
import { getPostHogClient } from "./posthog.js";

function requiredString(sanitize: (value: unknown) => string | undefined) {
  return z.unknown().transform((value, ctx) => {
    const parsed = sanitize(value);
    if (!parsed) {
      ctx.addIssue({ code: "custom", message: "invalid" });
      return z.NEVER;
    }
    return parsed;
  });
}

function optionalTraceId() {
  return z
    .unknown()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined) return undefined;
      const parsed = traceId(value);
      if (!parsed) {
        ctx.addIssue({ code: "custom", message: "invalid" });
        return z.NEVER;
      }
      return parsed;
    });
}

const optionalOpaque = z
  .unknown()
  .optional()
  .transform((value) => opaqueId(value));

const optionalUrl = z
  .unknown()
  .optional()
  .transform((value) => (typeof value === "string" && value.trim() ? value.trim() : undefined));

const shared = {
  conversationId: requiredString(conversationId),
  distinctId: optionalOpaque,
  sessionId: optionalOpaque,
  url: optionalUrl,
};

type ChatEvent = z.infer<typeof eventSchema>;

function captureEvent(event: ChatEvent): { distinctId: string; event: string; properties: Record<string, unknown> } {
  const properties: Record<string, unknown> = {
    $ai_session_id: event.conversationId,
    $process_person_profile: false,
  };
  if (event.traceId) properties.$ai_trace_id = event.traceId;
  if ("messageId" in event && event.messageId) properties.message_id = event.messageId;
  if (event.sessionId) properties.$session_id = event.sessionId;
  if (event.url) properties.$current_url = event.url;
  if (event.type === "feedback") properties.rating = event.rating;
  const name =
    event.type === "feedback"
      ? "docs chat feedback submitted"
      : event.type === "regenerate"
        ? "docs chat message regenerated"
        : "docs chat retried";
  return { distinctId: event.distinctId ?? event.conversationId, event: name, properties };
}

const eventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("feedback"),
    rating: z.enum(["up", "down"]),
    traceId: requiredString(traceId),
    messageId: requiredString(opaqueId),
    ...shared,
  }),
  z.object({
    type: z.literal("regenerate"),
    traceId: requiredString(traceId),
    messageId: requiredString(opaqueId),
    ...shared,
  }),
  z.object({
    type: z.literal("retry"),
    traceId: optionalTraceId(),
    ...shared,
  }),
]);

export type EventsClient = {
  capture: (event: { distinctId: string; event: string; properties: Record<string, unknown> }) => void;
  flush: () => Promise<void>;
};

export function createEventsHandler(deps: {
  readConfig: typeof readConfig;
  client: EventsClient | null | ((config: ChatConfig) => EventsClient | null);
}): { OPTIONS: (request: Request) => Response; POST: (request: Request) => Promise<Response> } {
  function OPTIONS(request: Request): Response {
    const { allowedOrigins } = deps.readConfig();
    const origin = request.headers.get("origin");
    if (!isAllowedOrigin(origin, allowedOrigins)) return new Response(null, { status: 403 });
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  async function POST(request: Request): Promise<Response> {
    const config = deps.readConfig();
    const origin = request.headers.get("origin");
    if (!isAllowedOrigin(origin, config.allowedOrigins)) return new Response(null, { status: 403 });
    const headers = corsHeaders(origin);
    let payload: unknown;
    try {
      payload = JSON.parse(await request.text());
    } catch {
      return json(400, { error: "Invalid JSON" }, headers);
    }
    const parsed = eventSchema.safeParse(payload);
    if (!parsed.success) return json(400, { error: "Invalid event" }, headers);
    const client = typeof deps.client === "function" ? deps.client(config) : deps.client;
    if (client) {
      client.capture(captureEvent(parsed.data));
      waitUntil(
        Promise.resolve()
          .then(() => client.flush())
          .catch(() => {}),
      );
    }
    return new Response(null, { status: 202, headers });
  }

  return { OPTIONS, POST };
}

export const { OPTIONS, POST } = createEventsHandler({
  readConfig,
  client: (config) => getPostHogClient(config),
});
