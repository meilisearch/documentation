import type { ChatMessage } from "../../shared/source";
import type { TraceRef } from "./analytics";

export function traceRefFor(message: ChatMessage, conversationId: string, streaming: boolean): TraceRef | null {
  const traceId = message.metadata?.traceId;
  if (message.role === "user" || streaming || !traceId) return null;
  return { traceId, conversationId, messageId: message.id };
}
