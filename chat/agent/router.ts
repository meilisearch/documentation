import { generateText, Output, type LanguageModel, type UIMessage } from "ai";
import { z } from "zod";
import { routerInstructions } from "./instructions.js";

/** Turns the router reads. Enough for a follow-up to keep its context, little enough to stay fast. */
const ROUTER_TURNS = 4;

const decisionSchema = z.object({ handled: z.boolean() });

export type RouteDecision = z.infer<typeof decisionSchema>;

type RouterTurn = { role: "user" | "assistant"; content: string };

function textOf(message: UIMessage): string {
  return message.parts
    .flatMap((part) => (part.type === "text" ? [part.text] : []))
    .join("\n")
    .trim();
}

/**
 * The last turns of the conversation as plain text. Tool calls and their results are left out:
 * they are large, and the router only needs to know what was asked and answered.
 */
export function routerMessages(messages: UIMessage[]): RouterTurn[] {
  const turns: RouterTurn[] = [];
  for (const message of messages) {
    if (message.role !== "user" && message.role !== "assistant") continue;
    const content = textOf(message);
    if (content) turns.push({ role: message.role, content });
  }
  return turns.slice(-ROUTER_TURNS);
}

/**
 * Decides whether the assistant handles the conversation. It fails when the model cannot answer,
 * so a question that was not checked is never handled.
 */
export async function routeQuestion(model: LanguageModel, messages: UIMessage[]): Promise<RouteDecision> {
  const turns = routerMessages(messages);
  if (turns.length === 0) return { handled: false };

  const { output } = await generateText({
    model,
    instructions: routerInstructions(),
    messages: turns,
    output: Output.object({ schema: decisionSchema }),
  });
  return output;
}
