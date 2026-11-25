import { afterEach, describe, expect, it, vi } from "vitest";
import { createEventsHandler } from "../events.ts";
import { testConfig } from "./fakes.ts";

const TRACE = "4bf92f3577b34da6a3ce929d0e0e4736";
const CONVERSATION = "c0ffee00-0000-4000-8000-000000000001";
const ORIGIN = "https://docs.example.com";

const eventsClient = { capture: vi.fn(), flush: vi.fn(async () => {}) };

const { OPTIONS, POST } = createEventsHandler({
  readConfig: () => ({ ...testConfig, allowedOrigins: ["example.com", "*.example.com"] }),
  client: eventsClient,
});

function request(method: string, body?: BodyInit, origin: string | null = ORIGIN) {
  const headers = new Headers({ "content-type": "text/plain" });
  if (origin) headers.set("origin", origin);
  return new Request("https://chat.test/api/events", { method, headers, body });
}

afterEach(() => {
  eventsClient.capture.mockClear();
  eventsClient.flush.mockClear();
});

describe("POST", () => {
  it("rejects a disallowed origin without capturing", async () => {
    const response = await POST(request("POST", "{}", "https://evil.example"));

    expect(response.status).toBe(403);
    expect(eventsClient.capture).not.toHaveBeenCalled();
  });

  it("returns 400 for a body that is not JSON and does not capture", async () => {
    const response = await POST(request("POST", "{"));

    expect(response.status).toBe(400);
    expect(eventsClient.capture).not.toHaveBeenCalled();
  });

  it("returns 400 for an unknown type, a bad trace id, or a missing conversation id", async () => {
    const unknown = await POST(request("POST", JSON.stringify({ type: "vote", conversationId: CONVERSATION })));
    const badTrace = await POST(
      request(
        "POST",
        JSON.stringify({
          type: "feedback",
          rating: "up",
          traceId: "not-a-trace",
          conversationId: CONVERSATION,
          messageId: "msg-1",
        }),
      ),
    );
    const missingConversation = await POST(
      request(
        "POST",
        JSON.stringify({ type: "retry", traceId: TRACE }),
      ),
    );
    const invalidConversation = await POST(
      request("POST", JSON.stringify({ type: "retry", conversationId: "a b", traceId: TRACE })),
    );

    expect(unknown.status).toBe(400);
    expect(badTrace.status).toBe(400);
    expect(missingConversation.status).toBe(400);
    expect(invalidConversation.status).toBe(400);
    expect(eventsClient.capture).not.toHaveBeenCalled();
  });

  it("captures feedback and returns 202", async () => {
    const response = await POST(
      request(
        "POST",
        JSON.stringify({
          type: "feedback",
          rating: "up",
          traceId: TRACE,
          conversationId: CONVERSATION,
          messageId: "msg-1",
          distinctId: "ph-visitor-1",
          sessionId: "ph-session-1",
          url: "https://www.meilisearch.com/docs/x",
        }),
      ),
    );

    expect(response.status).toBe(202);
    expect(eventsClient.capture).toHaveBeenCalledTimes(1);
    expect(eventsClient.capture).toHaveBeenCalledWith({
      distinctId: "ph-visitor-1",
      event: "docs chat feedback submitted",
      properties: {
        rating: "up",
        $ai_trace_id: TRACE,
        $ai_session_id: CONVERSATION,
        message_id: "msg-1",
        $session_id: "ph-session-1",
        $current_url: "https://www.meilisearch.com/docs/x",
        $process_person_profile: false,
      },
    });
    expect(eventsClient.flush).toHaveBeenCalledTimes(1);
  });

  it("uses the conversation id when feedback has no distinct id", async () => {
    const response = await POST(
      request(
        "POST",
        JSON.stringify({
          type: "feedback",
          rating: "down",
          traceId: TRACE,
          conversationId: CONVERSATION,
          messageId: "msg-1",
        }),
      ),
    );

    expect(response.status).toBe(202);
    expect(eventsClient.capture).toHaveBeenCalledWith(
      expect.objectContaining({ distinctId: CONVERSATION, event: "docs chat feedback submitted" }),
    );
  });

  it("captures regenerate and retry, and leaves out a missing trace, session, and url", async () => {
    const regenerated = await POST(
      request(
        "POST",
        JSON.stringify({
          type: "regenerate",
          traceId: TRACE,
          conversationId: CONVERSATION,
          messageId: "msg-1",
          distinctId: "ph-visitor-1",
          sessionId: "ph-session-1",
          url: "https://www.meilisearch.com/docs/x",
        }),
      ),
    );
    expect(regenerated.status).toBe(202);
    expect(eventsClient.capture).toHaveBeenNthCalledWith(1, {
      distinctId: "ph-visitor-1",
      event: "docs chat message regenerated",
      properties: {
        $ai_trace_id: TRACE,
        $ai_session_id: CONVERSATION,
        message_id: "msg-1",
        $session_id: "ph-session-1",
        $current_url: "https://www.meilisearch.com/docs/x",
        $process_person_profile: false,
      },
    });

    const retried = await POST(
      request(
        "POST",
        JSON.stringify({
          type: "retry",
          conversationId: CONVERSATION,
          distinctId: "ph-visitor-1",
        }),
      ),
    );
    expect(retried.status).toBe(202);
    expect(eventsClient.capture).toHaveBeenNthCalledWith(2, {
      distinctId: "ph-visitor-1",
      event: "docs chat retried",
      properties: {
        $ai_session_id: CONVERSATION,
        $process_person_profile: false,
      },
    });
  });

  it("returns 400 when a retry includes an invalid trace id", async () => {
    const response = await POST(
      request("POST", JSON.stringify({ type: "retry", conversationId: CONVERSATION, traceId: "not-a-trace" })),
    );

    expect(response.status).toBe(400);
    expect(eventsClient.capture).not.toHaveBeenCalled();
  });

  it("returns 202 when PostHog is not configured", async () => {
    const unconfigured = createEventsHandler({
      readConfig: () => ({ ...testConfig, allowedOrigins: ["example.com", "*.example.com"] }),
      client: null,
    });

    const response = await unconfigured.POST(
      request(
        "POST",
        JSON.stringify({
          type: "feedback",
          rating: "up",
          traceId: TRACE,
          conversationId: CONVERSATION,
          messageId: "msg-1",
          distinctId: "ph-visitor-1",
        }),
      ),
    );

    expect(response.status).toBe(202);
    expect(eventsClient.capture).not.toHaveBeenCalled();
  });

  it("still returns 202 when flushing fails", async () => {
    eventsClient.flush.mockRejectedValueOnce(new Error("flush failed"));

    const response = await POST(
      request(
        "POST",
        JSON.stringify({
          type: "retry",
          conversationId: CONVERSATION,
          traceId: TRACE,
        }),
      ),
    );

    expect(response.status).toBe(202);
    await new Promise((resolve) => setImmediate(resolve));
  });
});

describe("OPTIONS", () => {
  it("rejects a disallowed origin", () => {
    const response = OPTIONS(request("OPTIONS", undefined, "https://evil.example"));

    expect(response.status).toBe(403);
  });

  it("returns CORS headers for an allowed origin", () => {
    const response = OPTIONS(request("OPTIONS"));

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe(ORIGIN);
    expect(response.headers.get("access-control-allow-methods")).toBe("POST, OPTIONS");
    expect(response.headers.get("access-control-allow-headers")).toBe(
      "Content-Type, X-POSTHOG-DISTINCT-ID, X-POSTHOG-SESSION-ID",
    );
    expect(response.headers.get("vary")).toBe("Origin");
  });
});
