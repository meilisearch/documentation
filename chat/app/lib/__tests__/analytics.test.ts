import { beforeEach, describe, expect, it, vi } from "vitest";
import { createChatAnalytics } from "../analytics.ts";
import type { Identity } from "../identity.ts";

const trace = {
  traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
  conversationId: "c0ffee00-0000-4000-8000-000000000001",
  messageId: "msg-1",
};
const visitor: Identity = { distinctId: "ph-visitor-1", sessionId: "ph-session-1" };
const page = "http://localhost:3000/getting_started/overview";

beforeEach(() => {
  window.history.replaceState(null, "", "/getting_started/overview");
});

function eventFetch(impl?: typeof fetch) {
  return vi.fn<typeof fetch>(impl ?? (async () => new Response(null, { status: 204 })));
}

describe("createChatAnalytics", () => {
  it("posts feedback", () => {
    const fetchImpl = eventFetch();
    const analytics = createChatAnalytics({
      apiBase: "https://chat.test",
      identity: () => visitor,
      fetch: fetchImpl,
    });

    analytics.feedback(trace, "up");

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const init = fetchImpl.mock.calls[0]?.[1];
    expect(fetchImpl.mock.calls[0]?.[0]).toBe("https://chat.test/api/events");
    expect(init?.method).toBe("POST");
    expect(init?.keepalive).toBe(true);
    expect(init?.headers).toEqual({ "Content-Type": "text/plain" });
    expect(JSON.parse(String(init?.body))).toEqual({
      type: "feedback",
      rating: "up",
      traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
      conversationId: "c0ffee00-0000-4000-8000-000000000001",
      messageId: "msg-1",
      distinctId: "ph-visitor-1",
      sessionId: "ph-session-1",
      url: page,
    });
  });

  it("posts regenerate", () => {
    const fetchImpl = eventFetch();
    const analytics = createChatAnalytics({
      apiBase: "https://chat.test",
      identity: () => visitor,
      fetch: fetchImpl,
    });

    analytics.regenerated(trace);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const init = fetchImpl.mock.calls[0]?.[1];
    expect(fetchImpl.mock.calls[0]?.[0]).toBe("https://chat.test/api/events");
    expect(init?.method).toBe("POST");
    expect(init?.keepalive).toBe(true);
    expect(init?.headers).toEqual({ "Content-Type": "text/plain" });
    expect(JSON.parse(String(init?.body))).toEqual({
      type: "regenerate",
      traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
      conversationId: "c0ffee00-0000-4000-8000-000000000001",
      messageId: "msg-1",
      distinctId: "ph-visitor-1",
      sessionId: "ph-session-1",
      url: page,
    });
  });

  it("posts retry and omits traceId when the argument has none", () => {
    const fetchImpl = eventFetch();
    const analytics = createChatAnalytics({
      apiBase: "https://chat.test",
      identity: () => visitor,
      fetch: fetchImpl,
    });

    analytics.retried({ conversationId: trace.conversationId, traceId: trace.traceId });
    analytics.retried({ conversationId: trace.conversationId });

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    const withTrace = fetchImpl.mock.calls[0]?.[1];
    const withoutTrace = fetchImpl.mock.calls[1]?.[1];
    expect(fetchImpl.mock.calls[0]?.[0]).toBe("https://chat.test/api/events");
    expect(withTrace?.keepalive).toBe(true);
    expect(withTrace?.headers).toEqual({ "Content-Type": "text/plain" });
    expect(JSON.parse(String(withTrace?.body))).toEqual({
      type: "retry",
      traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
      conversationId: "c0ffee00-0000-4000-8000-000000000001",
      distinctId: "ph-visitor-1",
      sessionId: "ph-session-1",
      url: page,
    });
    const parsed = JSON.parse(String(withoutTrace?.body)) as Record<string, unknown>;
    expect(parsed).toEqual({
      type: "retry",
      conversationId: "c0ffee00-0000-4000-8000-000000000001",
      distinctId: "ph-visitor-1",
      sessionId: "ph-session-1",
      url: page,
    });
    expect(parsed).not.toHaveProperty("traceId");
  });

  it("sends nothing without an identity, and a rejected fetch does not throw", async () => {
    const fetchImpl = eventFetch(() => Promise.reject(new Error("offline")));
    const silent = createChatAnalytics({
      apiBase: "https://chat.test",
      identity: () => null,
      fetch: fetchImpl,
    });

    expect(() => silent.feedback(trace, "down")).not.toThrow();
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(silent.requestHeaders()).toEqual({});

    const rejecting = createChatAnalytics({
      apiBase: "https://chat.test",
      identity: () => visitor,
      fetch: fetchImpl,
    });
    expect(() => rejecting.feedback(trace, "down")).not.toThrow();
    await Promise.resolve();
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("returns PostHog request headers when an identity is present", () => {
    const analytics = createChatAnalytics({
      apiBase: "https://chat.test",
      identity: () => visitor,
      fetch: eventFetch(),
    });

    expect(analytics.requestHeaders()).toEqual({
      "X-POSTHOG-DISTINCT-ID": "ph-visitor-1",
      "X-POSTHOG-SESSION-ID": "ph-session-1",
    });

    const fetchImpl = eventFetch();
    const distinctOnly = createChatAnalytics({
      apiBase: "https://chat.test",
      identity: () => ({ distinctId: "ph-visitor-1" }),
      fetch: fetchImpl,
    });
    expect(distinctOnly.requestHeaders()).toEqual({
      "X-POSTHOG-DISTINCT-ID": "ph-visitor-1",
    });

    distinctOnly.feedback(trace, "down");
    const body = JSON.parse(String(fetchImpl.mock.calls[0]?.[1]?.body)) as Record<string, unknown>;
    expect(body).toEqual({
      type: "feedback",
      rating: "down",
      traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
      conversationId: "c0ffee00-0000-4000-8000-000000000001",
      messageId: "msg-1",
      distinctId: "ph-visitor-1",
      url: page,
    });
    expect(body).not.toHaveProperty("sessionId");
  });
});
