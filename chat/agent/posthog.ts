import { PostHog } from "posthog-node";
import type { ChatConfig } from "./config.js";

const CLIENT = Symbol.for("meili-chat.posthog");
const WARNED = Symbol.for("meili-chat.posthog-warning");

/** True when tracing and capture must stay off. Warns once outside production. */
export function warnMissingPostHog(config: { posthogToken?: string; posthogHost?: string }): boolean {
  const variable = !config.posthogToken ? "POSTHOG_PROJECT_TOKEN" : !config.posthogHost ? "POSTHOG_HOST" : undefined;
  if (!variable) return false;
  if (process.env.NODE_ENV !== "production") {
    const warned = ((globalThis as Record<symbol, Set<string> | undefined>)[WARNED] ??= new Set());
    if (!warned.has(variable)) {
      warned.add(variable);
      console.warn(
        `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
      );
    }
  }
  return true;
}

/** One PostHog client per process. Null when the project token or host is missing. */
export function getPostHogClient(config: ChatConfig): PostHog | null {
  const clients = globalThis as Record<symbol, PostHog | undefined>;
  const existing = clients[CLIENT];
  if (existing) return existing;
  if (warnMissingPostHog(config)) return null;
  const client = new PostHog(config.posthogToken ?? "", {
    host: config.posthogHost,
    flushAt: 1,
    flushInterval: 0,
  });
  clients[CLIENT] = client;
  return client;
}
