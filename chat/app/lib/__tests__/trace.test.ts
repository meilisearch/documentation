import { describe, expect, it } from "vitest";
import type { ChatMessage } from "../../../shared/source.ts";
import { traceRefFor } from "../trace.ts";

const conversationId = "c0ffee00-0000-4000-8000-000000000001";
const traceId = "4bf92f3577b34da6a3ce929d0e0e4736";

function message(role: "user" | "assistant", metadata?: ChatMessage["metadata"]): ChatMessage {
  return {
    id: "msg-1",
    role,
    parts: [{ type: "text", text: "Hello" }],
    metadata,
  };
}

describe("traceRefFor", () => {
  it("returns the trace for a settled assistant message", () => {
    expect(traceRefFor(message("assistant", { traceId }), conversationId, false)).toEqual({
      traceId,
      conversationId,
      messageId: "msg-1",
    });
  });

  it("returns null for a user message", () => {
    expect(traceRefFor(message("user", { traceId }), conversationId, false)).toBeNull();
  });

  it("returns null while the message is streaming", () => {
    expect(traceRefFor(message("assistant", { traceId }), conversationId, true)).toBeNull();
  });

  it("returns null when the trace id is missing or empty", () => {
    expect(traceRefFor(message("assistant"), conversationId, false)).toBeNull();
    expect(traceRefFor(message("assistant", { traceId: "" }), conversationId, false)).toBeNull();
  });
});
