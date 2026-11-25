import type { ChatMessage } from "../../shared/source";
import type { TraceRef } from "./analytics";

/** Trace of the assistant reply in the latest turn. An earlier answer is not reused. */
export function currentTurnTraceId(messages: ChatMessage[]): string | undefined {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!message || message.role === "user") return undefined;
    if (message.role === "assistant") return message.metadata?.traceId || undefined;
  }
  return undefined;
}

export function traceRefFor(message: ChatMessage, conversationId: string, streaming: boolean): TraceRef | null {
  const traceId = message.metadata?.traceId;
  if (message.role === "user" || streaming || !traceId) return null;
  return { traceId, conversationId, messageId: message.id };
}
