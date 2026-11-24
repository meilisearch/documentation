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

export function isAllowedOrigin(origin: string | null, allowed: string[]): boolean {
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

export function corsHeaders(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
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
