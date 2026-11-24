import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, isStepCount, streamText, type UIMessage } from "ai";
import { OPENAI_PROVIDER, STEP_BUDGET } from "./config.js";
import { elapsedMs, formatCount, formatDuration } from "./lib/format.js";
import { systemInstructions, triageInstructions } from "./instructions.js";
import type { AgentContext } from "./state.js";
import { createExpandPageTool } from "./tools/expand-page.js";
import { createApiRouteTool } from "./tools/get-api-route.js";
import { createListReleasesTool } from "./tools/list-releases.js";
import { createSearchTool } from "./tools/search.js";
import { logFooter, logStep, logStepError, logTraceStart } from "./transcript.js";

export async function createChatStream(ctx: AgentContext, messages: UIMessage[], now: Date) {
  if (!ctx.config.openrouterKey) throw new Error("Chat is not configured");
  const openrouter = createOpenRouter({ apiKey: ctx.config.openrouterKey });
  const main = openrouter(ctx.config.model, { reasoning: { effort: "medium" }, provider: OPENAI_PROVIDER });
  const fast = openrouter(ctx.config.queryModel, {
    reasoning: { effort: "low", exclude: true },
    provider: OPENAI_PROVIDER,
  });

  logTraceStart();
  return streamText({
    model: main,
    system: systemInstructions(now),
    messages: await convertToModelMessages(messages),
    tools: {
      search: createSearchTool(ctx),
      expand_page: createExpandPageTool(ctx),
      get_api_route: createApiRouteTool(ctx),
      list_releases: createListReleasesTool(ctx),
    },
    stopWhen: isStepCount(STEP_BUDGET),
    prepareStep: ({ stepNumber }) => {
      if (stepNumber === 0) {
        return {
          model: fast,
          activeTools: ["search", "list_releases"],
          toolChoice: "required",
          instructions: triageInstructions(now),
        };
      }
      if (stepNumber === STEP_BUDGET - 1) return { toolChoice: "none", instructions: systemInstructions(now) };
      return { instructions: systemInstructions(now) };
    },
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
}
