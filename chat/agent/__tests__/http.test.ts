import { describe, expect, it } from "vitest";
import { corsHeaders, isAllowedOrigin, isValidMessages, json, parseChatUser, parseTelemetryIdentity } from "../http.ts";

const allowed = ["meilisearch.com", "*.meilisearch.com"];

describe("isAllowedOrigin", () => {
  it("allows a missing origin only outside production", () => {
    expect(isAllowedOrigin(null, allowed, "production")).toBe(false);
    expect(isAllowedOrigin(null, allowed, "development")).toBe(true);
    expect(isAllowedOrigin(null, allowed, "test")).toBe(true);
    expect(isAllowedOrigin(null, allowed, undefined)).toBe(true);
  });

  it("allows localhost and 127.0.0.1 over http and https", () => {
    expect(isAllowedOrigin("http://localhost:3000", [], "production")).toBe(true);
    expect(isAllowedOrigin("https://localhost", [], "production")).toBe(true);
    expect(isAllowedOrigin("http://127.0.0.1:3000", [], "production")).toBe(true);
    expect(isAllowedOrigin("https://127.0.0.1", [], "production")).toBe(true);
  });

  it("matches an https host exactly or as a subdomain of a wildcard", () => {
    expect(isAllowedOrigin("https://meilisearch.com", allowed, "production")).toBe(true);
    expect(isAllowedOrigin("https://www.meilisearch.com", allowed, "production")).toBe(true);
    expect(isAllowedOrigin("https://docs.meilisearch.com/docs", allowed, "production")).toBe(true);
    expect(isAllowedOrigin("https://meilisearch.com", ["*.meilisearch.com"], "production")).toBe(false);
    expect(isAllowedOrigin("https://notmeilisearch.com", ["*.meilisearch.com"], "production")).toBe(false);
    expect(isAllowedOrigin("https://meilisearch.com.evil.example", allowed, "production")).toBe(false);
  });

  it("rejects http remote origins and garbage", () => {
    expect(isAllowedOrigin("http://meilisearch.com", allowed, "production")).toBe(false);
    expect(isAllowedOrigin("http://www.meilisearch.com", allowed, "production")).toBe(false);
    expect(isAllowedOrigin("not a url", allowed, "production")).toBe(false);
    expect(isAllowedOrigin("https://", allowed, "production")).toBe(false);
  });
});

describe("corsHeaders", () => {
  it("echoes the request origin", () => {
    expect(corsHeaders("https://www.meilisearch.com")).toEqual({
      "Access-Control-Allow-Origin": "https://www.meilisearch.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-POSTHOG-DISTINCT-ID, X-POSTHOG-SESSION-ID",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    });
  });

  it("uses a wildcard when the request has no origin", () => {
    expect(corsHeaders(null)["Access-Control-Allow-Origin"]).toBe("*");
  });
});

const CONVERSATION = "c0ffee00-0000-4000-8000-000000000001";

describe("parseTelemetryIdentity", () => {
  it("passes through valid headers and a regenerate body", () => {
    const headers = new Headers({
      "X-POSTHOG-DISTINCT-ID": "ph-visitor-1",
      "X-POSTHOG-SESSION-ID": "ph-session-1",
    });

    expect(
      parseTelemetryIdentity(headers, {
        id: CONVERSATION,
        trigger: "regenerate-message",
        messageId: "msg-1",
      }),
    ).toEqual({
      distinctId: "ph-visitor-1",
      webSessionId: "ph-session-1",
      conversationId: CONVERSATION,
      trigger: "regenerate-message",
      regeneratedMessageId: "msg-1",
    });
  });

  it("drops a conversation id with a space and a distinct id longer than 200 characters", () => {
    const headers = new Headers({ "X-POSTHOG-DISTINCT-ID": "x".repeat(201) });

    expect(parseTelemetryIdentity(headers, { id: "a b" })).toEqual({ trigger: "submit-message" });
  });

  it("uses the conversation id when the distinct id header is missing", () => {
    expect(parseTelemetryIdentity(new Headers(), { id: CONVERSATION })).toEqual({
      distinctId: CONVERSATION,
      conversationId: CONVERSATION,
      trigger: "submit-message",
    });
  });

  it("defaults the trigger to submit-message", () => {
    expect(parseTelemetryIdentity(new Headers(), {}).trigger).toBe("submit-message");
    expect(parseTelemetryIdentity(new Headers(), { trigger: "retry" }).trigger).toBe("submit-message");
  });

  it("sets regeneratedMessageId only for a regenerate trigger with a valid message id", () => {
    expect(parseTelemetryIdentity(new Headers(), { trigger: "submit-message", messageId: "msg-1" })).toEqual({
      trigger: "submit-message",
    });
    expect(parseTelemetryIdentity(new Headers(), { trigger: "regenerate-message", messageId: "   " })).toEqual({
      trigger: "regenerate-message",
    });
    expect(parseTelemetryIdentity(new Headers(), { trigger: "regenerate-message", messageId: "msg-1" })).toEqual({
      trigger: "regenerate-message",
      regeneratedMessageId: "msg-1",
    });
  });
});

describe("json", () => {
  it("sets the status and JSON content type", async () => {
    const response = json(201, { ok: true }, { "X-Test": "1" });

    expect(response.status).toBe(201);
    expect(response.headers.get("content-type")).toBe("application/json");
    expect(response.headers.get("x-test")).toBe("1");
    await expect(response.json()).resolves.toEqual({ ok: true });
  });
});

describe("parseChatUser", () => {
  it("returns a null language when the value is missing or invalid", () => {
    expect(parseChatUser(undefined)).toEqual({ codeLanguage: null });
    expect(parseChatUser(null)).toEqual({ codeLanguage: null });
    expect(parseChatUser("JS")).toEqual({ codeLanguage: null });
    expect(parseChatUser({ codeLanguage: 12 })).toEqual({ codeLanguage: null });
  });

  it("trims a language and rejects a blank or oversized one", () => {
    expect(parseChatUser({ codeLanguage: "  JS  " })).toEqual({ codeLanguage: "JS" });
    expect(parseChatUser({ codeLanguage: "   " })).toEqual({ codeLanguage: null });
    expect(parseChatUser({ codeLanguage: "" })).toEqual({ codeLanguage: null });
    expect(parseChatUser({ codeLanguage: "x".repeat(40) })).toEqual({ codeLanguage: "x".repeat(40) });
    expect(parseChatUser({ codeLanguage: "x".repeat(41) })).toEqual({ codeLanguage: null });
  });
});

describe("isValidMessages", () => {
  it("rejects an empty list", () => {
    expect(isValidMessages([])).toBe(false);
  });

  it("rejects more than 30 messages", () => {
    const messages = Array.from({ length: 31 }, () => ({ parts: [{ type: "text", text: "hi" }] }));
    expect(isValidMessages(messages)).toBe(false);
  });

  it("rejects a text part longer than 4000 characters", () => {
    expect(isValidMessages([{ parts: [{ type: "text", text: "x".repeat(4001) }] }])).toBe(false);
  });

  it("rejects a non-array", () => {
    expect(isValidMessages(null)).toBe(false);
    expect(isValidMessages({ parts: [] })).toBe(false);
  });

  it("accepts a message whose text fits", () => {
    expect(isValidMessages([{ parts: [{ type: "text", text: "What is hybrid search?" }] }])).toBe(true);
    expect(isValidMessages([{ parts: [{ type: "text", text: "x".repeat(4000) }] }])).toBe(true);
  });
});
