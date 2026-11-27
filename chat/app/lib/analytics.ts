import type { Feedback } from "../../shared/source";
import type { Identity } from "./identity";

export type TraceRef = { traceId: string; conversationId: string; messageId: string };

export type ChatAnalytics = {
  feedback(ref: TraceRef, rating: Feedback): void;
  regenerated(ref: TraceRef): void;
  retried(ref: { conversationId: string; traceId?: string }): void;
  requestHeaders(): Record<string, string>;
};

export function createChatAnalytics(options: {
  apiBase: string;
  identity: () => Identity | null;
  fetch?: typeof fetch;
}): ChatAnalytics {
  const send = (event: Record<string, unknown>) => {
    const id = options.identity();
    if (!id) return;
    const body = {
      ...event,
      distinctId: id.distinctId,
      ...(id.sessionId ? { sessionId: id.sessionId } : {}),
      url: location.href,
    };
    void (options.fetch ?? fetch)(`${options.apiBase}/api/events`, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body),
    }).catch(() => {});
  };

  return {
    feedback(ref, rating) {
      send({
        type: "feedback",
        rating,
        traceId: ref.traceId,
        conversationId: ref.conversationId,
        messageId: ref.messageId,
      });
    },
    regenerated(ref) {
      send({
        type: "regenerate",
        traceId: ref.traceId,
        conversationId: ref.conversationId,
        messageId: ref.messageId,
      });
    },
    retried(ref) {
      send({
        type: "retry",
        conversationId: ref.conversationId,
        ...(ref.traceId ? { traceId: ref.traceId } : {}),
      });
    },
    requestHeaders() {
      const id = options.identity();
      if (!id) return {};
      const headers: Record<string, string> = { "X-POSTHOG-DISTINCT-ID": id.distinctId };
      if (id.sessionId) headers["X-POSTHOG-SESSION-ID"] = id.sessionId;
      return headers;
    },
  };
}
