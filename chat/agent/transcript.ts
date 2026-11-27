// TEMPORARY: console trace for Vercel logs. Delete when real observability lands.
// This module is the only reader of AgentContext.details. Removing it drops the
// logStep / logStepError / logFooter imports in agent.ts and nothing else.

import type { StepResult, ToolSet } from "ai";
import { elapsedMs, formatBytes, formatCount, formatDuration, formatScore } from "./lib/format.js";
import { formatTraces } from "./lib/meili.js";
import { isRecord } from "./lib/records.js";
import type { ScoreCurve } from "./lib/rerank.js";
import type { AgentContext, OpenedPage, SearchDetail } from "./state.js";

function formatCurve(label: string, curve: ScoreCurve): string {
  const points = curve.at.map((point) => `r${point.rank}=${point.score.toFixed(3)}`).join(" ");
  return `${label} ${points}${points ? " " : ""}min=${formatScore(curve.min)} avg=${formatScore(curve.avg)}`;
}

function logChat(lines: string[]): void {
  console.log(lines.map((line) => `[chat] ${line}`).join("\n"));
}

function formatOpened(searches: SearchDetail[], opened: OpenedPage[]): string[] {
  const openedPages = new Set<string>();
  for (const read of opened) {
    if (read.page) openedPages.add(read.page);
    if (read.tool === "expand_page") openedPages.add(read.arg);
  }

  const best = new Map<string, { rank: number; meiliRank: number; query: string }>();
  const distinct = new Set<string>();
  for (const search of searches) {
    for (const hit of search.hits) {
      if (!hit.page) continue;
      distinct.add(hit.page);
      const previous = best.get(hit.page);
      if (!openedPages.has(hit.page)) continue;
      if (!previous || hit.rank < previous.rank) {
        best.set(hit.page, { rank: hit.rank, meiliRank: hit.meiliRank, query: search.q });
      }
    }
  }

  const used = [...best.entries()].sort((a, b) => a[1].rank - b[1].rank || a[0].localeCompare(b[0]));
  const seenUnmatched = new Set<string>();
  const unmatched = opened.filter((read) => {
    const page = read.tool === "expand_page" ? read.arg : read.page;
    if (!page || best.has(page) || seenUnmatched.has(`${read.tool}\0${read.arg}\0${page}`)) return false;
    seenUnmatched.add(`${read.tool}\0${read.arg}\0${page}`);
    return true;
  });

  const lines = [`   kept ${distinct.size} pages, ${used.length} opened from those hits`];
  const rows: Array<{ label: string; query?: string }> = [
    ...used.map(([page, hit]) => ({ label: `r${hit.rank} m${hit.meiliRank} ${page}`, query: hit.query })),
    ...unmatched.map((read) => ({
      label: `${read.tool} "${read.arg}"${read.page ? ` → ${read.page}` : ""}  not in kept hits`,
    })),
  ];
  rows.forEach((row, index) => {
    const last = index === rows.length - 1;
    lines.push(`   ${last ? "└─" : "├─"} ${row.label}`);
    if (row.query) lines.push(`   ${last ? "   " : "│  "}"${row.query}"`);
  });
  return lines;
}

function toolArg(input: unknown): string | undefined {
  if (!isRecord(input)) return undefined;
  const value = input.q ?? input.page ?? input.route;
  return typeof value === "string" ? value : undefined;
}

export function logTraceStart(): void {
  logChat(["trace"]);
}

export function logStep<TOOLS extends ToolSet>(ctx: AgentContext, step: StepResult<TOOLS>): void {
  const stepMs = Math.round(step.performance.stepTimeMs);
  const now = elapsedMs(ctx.started);
  const ttft = step.performance.timeToFirstOutputMs;
  const firstOutputAt = ttft === undefined ? undefined : now - stepMs + Math.round(ttft);
  if (step.finishReason === "stop" && firstOutputAt !== undefined) ctx.answer.firstOutputAt = firstOutputAt;

  const durations = step.toolCalls.map((call) => step.performance.toolExecutionMs[call.toolCallId] ?? 0);
  const slowest = durations.length > 1 ? Math.max(...durations) : undefined;
  const lines = [
    `├─ step ${step.stepNumber}  ${formatDuration(stepMs)}  at +${formatDuration(now)}  model ${formatDuration(Math.round(step.performance.responseTimeMs))}  firstOutput ${firstOutputAt === undefined ? "n/a" : `+${formatDuration(firstOutputAt)}`}  in ${formatCount(step.usage.inputTokens)} cache ${formatCount(step.usage.inputTokenDetails?.cacheReadTokens)} out ${formatCount(step.usage.outputTokens)} reason ${formatCount(step.usage.outputTokenDetails?.reasoningTokens)}  ${step.finishReason}`,
  ];

  step.toolCalls.forEach((call, index) => {
    const last = index === step.toolCalls.length - 1;
    const branch = last ? "└─" : "├─";
    const pad = last ? "   " : "│  ";
    const duration = step.performance.toolExecutionMs[call.toolCallId];
    const slow = slowest !== undefined && duration === slowest && slowest > 0 ? "  slowest" : "";
    const arg = toolArg(call.input) ?? "";
    const durationLabel = duration === undefined ? "n/a" : formatDuration(Math.round(duration));

    if (call.toolName === "list_releases") {
      const detail = ctx.details.releaseLists.get(call.toolCallId);
      lines.push(`│  ${branch} list_releases  ${durationLabel}${slow}`);
      if (!detail) {
        lines.push(`│  ${pad}no detail`);
        return;
      }
      lines.push(
        `│  ${pad}${detail.count} releases  oldest ${detail.oldest ?? "n/a"}  ${formatBytes(detail.bytes)}  meili ${formatDuration(detail.meili.ms)}  processing ${formatDuration(detail.meili.processingMs)}  wait ${formatDuration(detail.meili.waitMs)}  inFlight ${detail.meili.inFlight}`,
      );
      for (const line of formatTraces(detail.meili.traces)) lines.push(`│  ${pad}${line}`);
      return;
    }

    if (call.toolName === "search") {
      const detail = ctx.details.byCall.get(call.toolCallId);
      lines.push(`│  ${branch} search  ${durationLabel}${slow}  "${arg}"`);
      if (!detail) {
        lines.push(`│  ${pad}no detail`);
        return;
      }
      lines.push(
        `│  ${pad}meili ${formatDuration(detail.meili.ms)}  processing ${formatDuration(detail.meili.processingMs)}  wait ${formatDuration(detail.meili.waitMs)}  inFlight ${detail.meili.inFlight}  payload ${formatBytes(detail.meiliBytes)}`,
      );
      for (const line of formatTraces(detail.meili.traces)) lines.push(`│  ${pad}${line}`);
      const cutoff = detail.cutoff === null ? "n/a" : detail.cutoff.toFixed(3);
      lines.push(
        `│  ${pad}rerank ${formatDuration(detail.rerankMs)}  ${detail.candidates}→${detail.reranked}  trimmed ${detail.reranked}→${detail.kept}  cutoff ${cutoff}  dupes ${detail.dupes}  docs ${detail.docs}  routes ${detail.routes}  changelog ${detail.changelog}  result ${formatBytes(detail.resultBytes)}`,
      );
      lines.push(`│  ${pad}${formatCurve("pre ", detail.pre)}`);
      lines.push(`│  ${pad}${formatCurve("post", detail.post)}`);
      return;
    }

    const read = ctx.details.reads.get(call.toolCallId);
    const page = read?.page && read.page !== arg ? `  page ${read.page}` : "";
    const matched = read?.matched ? `  ${read.matched}` : "";
    const bytes = read ? `  ${formatBytes(read.bytes)}` : "";
    const meili = read
      ? `  meili ${formatDuration(read.meili.ms)}  processing ${formatDuration(read.meili.processingMs)}  wait ${formatDuration(read.meili.waitMs)}  inFlight ${read.meili.inFlight}`
      : "";
    lines.push(`│  ${branch} ${call.toolName}  ${durationLabel}${slow}  "${arg}"${bytes}${meili}${page}${matched}`);
    if (read) for (const line of formatTraces(read.meili.traces)) lines.push(`│  ${pad}${line}`);
  });

  logChat(lines);
}

export function logStepError(ctx: AgentContext, event: { stepNumber: number; error: unknown }): void {
  logChat([`├─ step ${event.stepNumber}  failed  at +${formatDuration(elapsedMs(ctx.started))}`]);
  console.error("[chat] step error", event.error);
}

export function logFooter(ctx: AgentContext, status: string): void {
  const lines = [`└─ ${status}`];
  if (ctx.answer.firstOutputAt !== undefined) lines.push(`   answer firstOutput +${formatDuration(ctx.answer.firstOutputAt)}`);
  lines.push(...formatOpened(ctx.details.searches, ctx.details.opened));
  logChat(lines);
}
