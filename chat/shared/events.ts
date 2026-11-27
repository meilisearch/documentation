import type { Feedback } from "./source.js";

/** Body the widget posts to `/api/events`. The server accepts only these three shapes. */
export type ChatEvent =
  | { type: "feedback"; rating: Feedback; traceId: string; conversationId: string; messageId: string }
  | { type: "regenerate"; traceId: string; conversationId: string; messageId: string }
  | { type: "retry"; traceId?: string; conversationId: string };

export type ChatEventBody = ChatEvent & { distinctId?: string; sessionId?: string; url?: string };
