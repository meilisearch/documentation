import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  isStepCount,
  streamText,
  type LanguageModel,
  type UIMessage,
} from "ai";
import { OPENAI_PROVIDER, STEP_BUDGET } from "./config.js";
import { DECLINE_MESSAGE, systemInstructions } from "./instructions.js";
import { routeQuestion } from "./router.js";
import type { AgentContext } from "./state.js";
import { otelTelemetry, runtimeContextFor, telemetrySettings, type ChatTelemetry } from "./telemetry.js";
import { createExpandPageTool } from "./tools/expand-page.js";
import { createApiRouteTool } from "./tools/get-api-route.js";
import { createListReleasesTool } from "./tools/list-releases.js";
import { createSearchTool } from "./tools/search.js";

export type ChatModels = {
  /** Answers the question. */
  main: LanguageModel;
  /** Decides whether the question is answered at all. */
  router: LanguageModel;
};

function openRouterModels(ctx: AgentContext): ChatModels {
  if (!ctx.config.openrouterKey) throw new Error("Chat is not configured");
  const openrouter = createOpenRouter({ apiKey: ctx.config.openrouterKey });
  return {
    main: openrouter(ctx.config.model, { reasoning: { effort: "medium" }, provider: OPENAI_PROVIDER }),
    router: openrouter(ctx.config.queryModel, {
      reasoning: { effort: "low", exclude: true },
      provider: OPENAI_PROVIDER,
    }),
  };
}

/** A finished assistant message that holds only the refusal, with no model call and no tools. */
function declineResponse(headers: HeadersInit, meta: { messageId: string; traceId: string }): Response {
  const id = "decline";
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: "start", messageId: meta.messageId, messageMetadata: { traceId: meta.traceId } });
      writer.write({ type: "text-start", id });
      writer.write({ type: "text-delta", id, delta: DECLINE_MESSAGE });
      writer.write({ type: "text-end", id });
      writer.write({ type: "finish" });
    },
  });
  return createUIMessageStreamResponse({ headers, stream });
}

/**
 * The router runs first. A conversation it declines gets the refusal. Any other conversation
 * streams an answer. A router failure rejects, so an unchecked question is never answered.
 */
export async function createChatResponse(
  ctx: AgentContext,
  messages: UIMessage[],
  now: Date,
  headers: HeadersInit,
  models: ChatModels = openRouterModels(ctx),
  telemetry: ChatTelemetry = otelTelemetry,
): Promise<Response> {
  const turn = telemetry.startTurn();
  const messageId = generateId();
  const runtimeContext = runtimeContextFor(ctx.identity, ctx.user, messageId);
  let handled: boolean;
  try {
    ({ handled } = await turn.run(() =>
      routeQuestion(models.router, messages, { runtimeContext, telemetry: telemetrySettings("docs-chat-router") }),
    ));
  } catch (error) {
    turn.end(error);
    throw error;
  }
  if (!handled) {
    turn.end();
    return declineResponse(headers, { messageId, traceId: turn.traceId });
  }

  const modelMessages = await convertToModelMessages(messages);
  const result = turn.run(() =>
    streamText({
      model: models.main,
      instructions: systemInstructions(now),
      messages: modelMessages,
      runtimeContext,
      telemetry: telemetrySettings("docs-chat-answer"),
      tools: {
        search: createSearchTool(ctx),
        expand_page: createExpandPageTool(ctx),
        get_api_route: createApiRouteTool(ctx),
        list_releases: createListReleasesTool(ctx),
      },
      stopWhen: isStepCount(STEP_BUDGET),
      prepareStep: ({ stepNumber }) => (stepNumber === STEP_BUDGET - 1 ? { toolChoice: "none" } : undefined),
      onStepEnd: (step) => {
        if (step.toolCalls.length === 0 && step.text) ctx.answer.text = step.text;
      },
      onStepError: (event) => {
        console.error("[chat] step error", event.error);
      },
      onEnd: () => turn.end(),
      onAbort: () => turn.end(),
      onError: ({ error }) => turn.end(error),
    }),
  );

  return result.toUIMessageStreamResponse({
    headers,
    generateMessageId: () => messageId,
    messageMetadata: ({ part }) => {
      if (part.type === "start") return { traceId: turn.traceId };
      if (part.type === "finish") return { sources: ctx.pool.cited(ctx.answer.text) };
      return undefined;
    },
    onError: (error) => {
      console.error("[chat] stream error", error);
      return "Something went wrong. Please try again.";
    },
  });
}
