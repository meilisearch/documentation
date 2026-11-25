import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OPTIONS, POST } from "../handler.ts";

const { createChatResponse } = vi.hoisted(() => ({
  createChatResponse: vi.fn(
    async (_ctx: unknown, _messages: unknown, _now: Date, headers: HeadersInit) =>
      new Response("ok", { status: 200, headers }),
  ),
}));

vi.mock("../agent.js", () => ({ createChatResponse }));

const ORIGINAL = { ...process.env };
const ORIGIN = "https://docs.example.com";
const fetchMock = vi.fn((_input: RequestInfo | URL, _init?: RequestInit) => Promise.resolve(new Response(null, { status: 200 })));
const messages = [{ parts: [{ type: "text", text: "What is hybrid search?" }] }];

function allowOrigins() {
  process.env.CHAT_ALLOWED_ORIGINS = "example.com,*.example.com";
}

function configure() {
  process.env.OPENROUTER_API_KEY = "openrouter-key";
  process.env.MEILISEARCH_URL = "http://meili.test";
  process.env.MEILISEARCH_KEY = "meili-key";
  process.env.VOYAGE_API_KEY = "voyage-key";
  allowOrigins();
}

function clearRequired() {
  for (const name of ["OPENROUTER_API_KEY", "MEILISEARCH_URL", "MEILISEARCH_KEY", "VOYAGE_API_KEY"]) {
    delete process.env[name];
  }
}

function request(method: string, body?: BodyInit, origin: string | null = ORIGIN) {
  const headers = new Headers({ "content-type": "application/json" });
  if (origin) headers.set("origin", origin);
  return new Request("https://chat.test/api/chat", { method, headers, body });
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockClear();
  createChatResponse.mockClear();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.mocked(console.error).mockRestore();
  process.env = { ...ORIGINAL };
});

describe("OPTIONS", () => {
  it("rejects a disallowed origin", () => {
    allowOrigins();

    const response = OPTIONS(request("OPTIONS", undefined, "https://evil.example"));

    expect(response.status).toBe(403);
  });

  it("returns CORS headers for an allowed origin", () => {
    allowOrigins();

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

describe("POST", () => {
  it("returns 500 when required settings are missing", async () => {
    allowOrigins();
    clearRequired();

    const response = await POST(request("POST", JSON.stringify({ messages })));

    expect(response.status).toBe(500);
    expect(response.headers.get("content-type")).toBe("application/json");
    await expect(response.json()).resolves.toEqual({ error: "Chat is not configured" });
    expect(createChatResponse).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON", async () => {
    configure();

    const response = await POST(request("POST", "{"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid JSON" });
    expect(createChatResponse).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid messages", async () => {
    configure();

    const response = await POST(request("POST", JSON.stringify({ messages: [] })));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid messages" });
    expect(createChatResponse).not.toHaveBeenCalled();
  });

  it("returns the chat response when the env is complete and the messages are valid", async () => {
    configure();

    const response = await POST(request("POST", JSON.stringify({ messages })));

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe("ok");
    expect(response.headers.get("access-control-allow-origin")).toBe(ORIGIN);
    expect(createChatResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        user: { codeLanguage: null },
        config: expect.objectContaining({
          openrouterKey: "openrouter-key",
          meiliUrl: "http://meili.test",
          meiliKey: "meili-key",
          voyageKey: "voyage-key",
        }),
      }),
      messages,
      expect.any(Date),
      expect.objectContaining({ "Access-Control-Allow-Origin": ORIGIN }),
    );
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe("http://meili.test/health");
    expect(fetchMock.mock.calls[1]).toEqual(["https://api.voyageai.com/", { method: "HEAD" }]);
  });

  it("returns a 502 with CORS headers when the chat cannot start", async () => {
    configure();
    createChatResponse.mockRejectedValueOnce(new Error("router down"));

    const response = await POST(request("POST", JSON.stringify({ messages })));

    expect(response.status).toBe(502);
    expect(response.headers.get("access-control-allow-origin")).toBe(ORIGIN);
    await expect(response.json()).resolves.toEqual({ error: "Something went wrong. Please try again." });
    expect(console.error).toHaveBeenCalledWith("[chat] could not start", expect.any(Error));
  });
});
