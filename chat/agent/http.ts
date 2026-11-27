import type { UIMessage } from "ai";
import { z } from "zod";
import type { ChatUser } from "../shared/user.js";
import { MAX_MESSAGES, MAX_TEXT_LENGTH } from "./config.js";

const chatUserSchema = z.object({
  codeLanguage: z.string().nullable().optional(),
});

/** `*.example.com` matches subdomains only, not the apex. */
function matchesHost(hostname: string, pattern: string): boolean {
  return pattern.startsWith("*.") ? hostname.endsWith(pattern.slice(1)) : hostname === pattern;
}

export function isAllowedOrigin(
  origin: string | null,
  allowed: string[],
  nodeEnv: string | undefined = process.env.NODE_ENV,
): boolean {
  const dev = nodeEnv !== "production";
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

export function corsHeaders(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-POSTHOG-DISTINCT-ID, X-POSTHOG-SESSION-ID",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function json(status: number, body: unknown, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

/** Missing or invalid preference becomes `{ codeLanguage: null }`. Never rejects the request. */
export function parseChatUser(value: unknown): ChatUser {
  const parsed = chatUserSchema.safeParse(value ?? {});
  if (!parsed.success) return { codeLanguage: null };
  const codeLanguage = parsed.data.codeLanguage?.trim() ?? "";
  if (!codeLanguage || codeLanguage.length > 40) return { codeLanguage: null };
  return { codeLanguage };
}

export type TelemetryIdentity = {
  distinctId?: string;
  webSessionId?: string;
  conversationId?: string;
  trigger: "submit-message" | "regenerate-message";
  regeneratedMessageId?: string;
};

/** Conversation ids are the chat id: a short token, usually a UUID. */
export function conversationId(value: unknown): string | undefined {
  return typeof value === "string" && /^[A-Za-z0-9\-_~.@()!':|]{1,128}$/.test(value) ? value : undefined;
}

/** Visitor, session, and message ids are opaque strings, trimmed to 200 characters. */
export function opaqueId(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length >= 1 && trimmed.length <= 200 ? trimmed : undefined;
}

/** OpenTelemetry trace ids are 32 lowercase hex characters. */
export function traceId(value: unknown): string | undefined {
  return typeof value === "string" && /^[0-9a-f]{32}$/.test(value) ? value : undefined;
}

export function parseTelemetryIdentity(
  headers: Headers,
  body: { id?: unknown; trigger?: unknown; messageId?: unknown },
): TelemetryIdentity {
  const conversation = conversationId(body.id);
  const trigger = body.trigger === "regenerate-message" ? "regenerate-message" : "submit-message";
  const identity: TelemetryIdentity = { trigger };
  const distinct = opaqueId(headers.get("X-POSTHOG-DISTINCT-ID")) ?? conversation;
  const webSession = opaqueId(headers.get("X-POSTHOG-SESSION-ID"));
  if (distinct) identity.distinctId = distinct;
  if (webSession) identity.webSessionId = webSession;
  if (conversation) identity.conversationId = conversation;
  if (trigger === "regenerate-message") {
    const messageId = opaqueId(body.messageId);
    if (messageId) identity.regeneratedMessageId = messageId;
  }
  return identity;
}

export function isValidMessages(messages: unknown): messages is UIMessage[] {
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
