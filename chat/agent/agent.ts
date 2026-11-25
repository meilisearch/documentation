import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  type LanguageModel,
  type UIMessage,
} from "ai";
import { OPENAI_PROVIDER, STEP_BUDGET } from "./config.js";
import { elapsedMs, formatCount, formatDuration } from "./lib/format.js";
import { DECLINE_MESSAGE, systemInstructions } from "./instructions.js";
import { routeQuestion } from "./router.js";
import type { AgentContext } from "./state.js";
import { createExpandPageTool } from "./tools/expand-page.js";
import { createApiRouteTool } from "./tools/get-api-route.js";
import { createListReleasesTool } from "./tools/list-releases.js";
import { createSearchTool } from "./tools/search.js";
import { logFooter, logStep, logStepError, logTraceStart } from "./transcript.js";

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
function declineResponse(headers: HeadersInit): Response {
  const id = "decline";
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: "start" });
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
): Promise<Response> {
  const { handled } = await routeQuestion(models.router, messages);
  if (!handled) return declineResponse(headers);

  logTraceStart();
  const result = streamText({
    model: models.main,
    instructions: systemInstructions(now),
    messages: await convertToModelMessages(messages),
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
      logStep(ctx, step);
    },
    onStepError: (event) => {
      logStepError(ctx, event);
    },
    onEnd: (event) => {
      logFooter(
        ctx,
        `roundtrip ${formatDuration(elapsedMs(ctx.started))}  steps ${event.steps.length}  ${event.finishReason}  in ${formatCount(event.usage.inputTokens)} cache ${formatCount(event.usage.inputTokenDetails?.cacheReadTokens)} out ${formatCount(event.usage.outputTokens)} reason ${formatCount(event.usage.outputTokenDetails?.reasoningTokens)}`,
      );
    },
    onAbort: (event) => {
      logFooter(ctx, `aborted  at +${formatDuration(elapsedMs(ctx.started))}  steps ${event.steps.length}`);
    },
  });

  return result.toUIMessageStreamResponse({
    headers,
    messageMetadata: ({ part }) => {
      if (part.type !== "finish") return undefined;
      return { sources: ctx.pool.cited(ctx.answer.text) };
    },
    onError: (error) => {
      console.error("[chat] stream error", error);
      return "Something went wrong. Please try again.";
    },
  });
}
