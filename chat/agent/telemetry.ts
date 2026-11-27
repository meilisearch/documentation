import { OpenTelemetry } from "@ai-sdk/otel";
import { context, isSpanContextValid, SpanStatusCode, trace } from "@opentelemetry/api";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { PostHogSpanProcessor } from "@posthog/ai/otel";
import { waitUntil } from "@vercel/functions";
import { registerTelemetry } from "ai";
import type { ChatUser } from "../shared/user.js";
import type { ChatConfig } from "./config.js";
import type { TelemetryIdentity } from "./http.js";
import { warnMissingPostHog } from "./posthog.js";

const KEY = Symbol.for("meili-chat.telemetry");

type TelemetryState = { processor?: PostHogSpanProcessor };

function telemetryState(): TelemetryState | undefined {
  return (globalThis as Record<symbol, TelemetryState | undefined>)[KEY];
}

function scalar(value: unknown): string | number | boolean | undefined {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  return undefined;
}

function enrichSpan({ runtimeContext }: { runtimeContext: Record<string, unknown> | undefined }) {
  const attributes: Record<string, string | number | boolean> = {};
  const distinctId = scalar(runtimeContext?.distinctId);
  const sessionId = scalar(runtimeContext?.sessionId);
  const webSessionId = scalar(runtimeContext?.webSessionId);
  if (distinctId !== undefined) attributes["posthog.distinct_id"] = distinctId;
  if (sessionId !== undefined) attributes["$ai_session_id"] = sessionId;
  if (webSessionId !== undefined) attributes["$session_id"] = webSessionId;
  const properties = runtimeContext?.properties;
  if (properties && typeof properties === "object") {
    for (const [key, value] of Object.entries(properties)) {
      const parsed = scalar(value);
      if (parsed !== undefined) attributes[key] = parsed;
    }
  }
  return attributes;
}

/** Starts PostHog tracing once per process. Missing configuration never throws. */
export function startTelemetry(config: ChatConfig): void {
  const slots = globalThis as Record<symbol, TelemetryState | undefined>;
  if (slots[KEY]) return;
  slots[KEY] = {};
  if (warnMissingPostHog(config)) return;
  const processor = new PostHogSpanProcessor({ projectToken: config.posthogToken ?? "", host: config.posthogHost });
  slots[KEY] = { processor };
  new NodeSDK({
    resource: resourceFromAttributes({ "service.name": "meilisearch-docs-chat" }),
    spanProcessors: [processor],
  }).start();
  registerTelemetry(new OpenTelemetry({ enrichSpan }));
}

export type Turn = {
  traceId: string;
  run<T>(fn: () => T): T;
  end(error?: unknown): void;
};

export type ChatTelemetry = { startTurn(): Turn };

export const otelTelemetry: ChatTelemetry = {
  startTurn() {
    const span = trace.getTracer("docs-chat").startSpan("docs-chat");
    const ctx = trace.setSpan(context.active(), span);
    const spanContext = span.spanContext();
    const traceId = isSpanContextValid(spanContext) ? spanContext.traceId : crypto.randomUUID().replaceAll("-", "");
    let ended = false;
    return {
      traceId,
      run<T>(fn: () => T): T {
        return context.with(ctx, fn);
      },
      end(error?: unknown) {
        if (ended) return;
        ended = true;
        if (error !== undefined) {
          span.recordException(error instanceof Error ? error : String(error));
          span.setStatus({ code: SpanStatusCode.ERROR });
        }
        span.end();
        const processor = telemetryState()?.processor;
        if (processor) {
          waitUntil(
            Promise.resolve()
              .then(() => processor.forceFlush())
              .catch(() => {}),
          );
        }
      },
    };
  },
};

export function runtimeContextFor(identity: TelemetryIdentity, user: ChatUser, messageId: string) {
  const properties: Record<string, string> = {
    message_id: messageId,
    chat_trigger: identity.trigger,
    environment: process.env.VERCEL_ENV ?? "development",
  };
  if (identity.regeneratedMessageId) properties.regenerated_message_id = identity.regeneratedMessageId;
  if (typeof user.codeLanguage === "string") properties.code_language = user.codeLanguage;
  return {
    distinctId: identity.distinctId,
    sessionId: identity.conversationId,
    webSessionId: identity.webSessionId,
    properties,
  };
}

export const telemetrySettings = (functionId: "docs-chat-router" | "docs-chat-answer") => ({
  functionId,
  includeRuntimeContext: { distinctId: true, sessionId: true, webSessionId: true, properties: true },
});
