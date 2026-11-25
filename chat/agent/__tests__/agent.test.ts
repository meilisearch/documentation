import { simulateReadableStream, type UIMessage } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { describe, expect, it } from "vitest";
import { createChatResponse } from "../agent.ts";
import { DECLINE_MESSAGE } from "../instructions.ts";
import { fakeContext } from "./fakes.ts";

const usage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 5, text: 5, reasoning: undefined },
};

function router(decision: { handled: boolean }) {
  return new MockLanguageModelV4({
    doGenerate: async () => ({
      content: [{ type: "text", text: JSON.stringify(decision) }],
      finishReason: { unified: "stop", raw: undefined },
      usage,
      warnings: [],
    }),
  });
}

function answering(answer: string) {
  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "text-start", id: "text-1" },
          { type: "text-delta", id: "text-1", delta: answer },
          { type: "text-end", id: "text-1" },
          { type: "finish", finishReason: { unified: "stop", raw: undefined }, usage },
        ],
        initialDelayInMs: null,
        chunkDelayInMs: null,
      }),
    }),
  });
}

const question: UIMessage = { id: "1", role: "user", parts: [{ type: "text", text: "How do I filter by price?" }] };
const headers = { "Access-Control-Allow-Origin": "https://docs.example.com" };
const now = new Date(Date.UTC(2024, 0, 2));
const TRACE = "4bf92f3577b34da6a3ce929d0e0e4736";
const telemetry = { startTurn: () => ({ traceId: TRACE, run: <T,>(fn: () => T) => fn(), end: () => {} }) };

type StreamChunk = { type: string; messageId?: string; messageMetadata?: { traceId?: string } };

function streamChunks(body: string): StreamChunk[] {
  return body
    .split("\n")
    .filter((line) => line.startsWith("data: {"))
    .map((line) => JSON.parse(line.slice("data: ".length)) as StreamChunk);
}

function mergedMetadata(body: string): { traceId?: string } {
  return Object.assign({}, ...streamChunks(body).map((chunk) => chunk.messageMetadata ?? {}));
}

describe("createChatResponse", () => {
  it("answers a question the router accepts", async () => {
    const main = answering("Use the filter parameter.");

    const response = await createChatResponse(
      fakeContext(),
      [question],
      now,
      headers,
      { main, router: router({ handled: true }) },
      telemetry,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("access-control-allow-origin")).toBe("https://docs.example.com");
    await expect(response.text()).resolves.toContain("Use the filter parameter.");
    expect(main.doStreamCalls).toHaveLength(1);
  });

  it("declines a question the router rejects, without calling the answering model", async () => {
    const main = answering("The weather is sunny.");

    const response = await createChatResponse(
      fakeContext(),
      [question],
      now,
      headers,
      { main, router: router({ handled: false }) },
      telemetry,
    );

    const body = await response.text();
    expect(response.status).toBe(200);
    expect(response.headers.get("access-control-allow-origin")).toBe("https://docs.example.com");
    expect(body).toContain(DECLINE_MESSAGE);
    expect(body).not.toContain("tool-input");
    expect(main.doStreamCalls).toHaveLength(0);
  });

  it("streams the refusal as one finished assistant message the widget can render", async () => {
    const response = await createChatResponse(
      fakeContext(),
      [question],
      now,
      headers,
      { main: answering("unused"), router: router({ handled: false }) },
      telemetry,
    );

    const types = (await response.text())
      .split("\n")
      .filter((line) => line.startsWith("data: {"))
      .map((line) => (JSON.parse(line.slice("data: ".length)) as { type: string }).type);
    expect(types).toEqual(["start", "text-start", "text-delta", "text-end", "finish"]);
  });

  it("rejects when the router fails instead of answering an unchecked question", async () => {
    const main = answering("Use the filter parameter.");
    const broken = new MockLanguageModelV4({
      doGenerate: async () => {
        throw new Error("router down");
      },
    });

    await expect(
      createChatResponse(fakeContext(), [question], now, headers, { main, router: broken }, telemetry),
    ).rejects.toThrow("router down");
    expect(main.doStreamCalls).toHaveLength(0);
  });

  it("tags the streamed answer with the turn's trace id and a message id", async () => {
    const response = await createChatResponse(
      fakeContext(),
      [question],
      now,
      headers,
      { main: answering("Use the filter parameter."), router: router({ handled: true }) },
      telemetry,
    );

    const body = await response.text();
    const start = streamChunks(body).find((chunk) => chunk.type === "start");
    expect(start?.messageId).toEqual(expect.any(String));
    expect(start?.messageId).not.toBe("");
    expect(mergedMetadata(body).traceId).toBe(TRACE);
  });

  it("tags the refusal with the turn's trace id and a message id", async () => {
    const response = await createChatResponse(
      fakeContext(),
      [question],
      now,
      headers,
      { main: answering("unused"), router: router({ handled: false }) },
      telemetry,
    );

    const body = await response.text();
    const chunks = streamChunks(body);
    const start = chunks.find((chunk) => chunk.type === "start");
    expect(start?.messageId).toEqual(expect.any(String));
    expect(start?.messageId).not.toBe("");
    expect(mergedMetadata(body).traceId).toBe(TRACE);
    expect(chunks.map((chunk) => chunk.type)).toEqual(["start", "text-start", "text-delta", "text-end", "finish"]);
  });
});
