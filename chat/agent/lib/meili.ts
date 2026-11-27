import { elapsedMs } from "./format.js";
import { isRecord } from "./records.js";

export type MeiliSpan = {
  ms: number;
  processingMs: number;
  inFlight: number;
  trace?: Record<string, unknown>;
};

export type MeiliSummary = {
  ms: number;
  processingMs: number;
  waitMs: number;
  inFlight: number;
  traces: Array<Record<string, unknown> | undefined>;
};

type TraceNode = { duration?: string; children: Map<string, TraceNode> };

type MeiliResult = { processingTimeMs: number; performanceDetails?: unknown };

export type SpanRecorder = {
  run<T extends MeiliResult>(spans: MeiliSpan[], task: () => Promise<T>): Promise<T>;
};

/** One in-flight counter for every Meilisearch call in the request. */
export function createSpanRecorder(): SpanRecorder {
  let inFlightMeili = 0;
  return {
    async run(spans, task) {
      inFlightMeili += 1;
      const inFlight = inFlightMeili;
      const meiliStarted = performance.now();
      try {
        const value = await task();
        spans.push({
          ms: elapsedMs(meiliStarted),
          processingMs: value.processingTimeMs,
          inFlight,
          trace: isRecord(value.performanceDetails) ? value.performanceDetails : undefined,
        });
        return value;
      } finally {
        inFlightMeili -= 1;
      }
    },
  };
}

export function summarizeSpans(spans: MeiliSpan[]): MeiliSummary {
  const ms = spans.reduce((sum, span) => sum + span.ms, 0);
  const processingMs = spans.reduce((sum, span) => sum + span.processingMs, 0);
  const inFlight = spans.reduce((max, span) => Math.max(max, span.inFlight), 0);
  return { ms, processingMs, waitMs: Math.max(0, ms - processingMs), inFlight, traces: spans.map((span) => span.trace) };
}

function traceChild(parent: TraceNode, name: string): TraceNode {
  const existing = parent.children.get(name);
  if (existing) return existing;
  const created: TraceNode = { children: new Map() };
  parent.children.set(name, created);
  return created;
}

/** `performanceDetails` keys are `parent > child` paths. Values are duration strings. */
function addTraceValue(node: TraceNode, key: string, value: unknown): void {
  let current = node;
  for (const part of key.split(" > ")) current = traceChild(current, part);
  if (typeof value === "string" || typeof value === "number") {
    current.duration = String(value);
    return;
  }
  if (!isRecord(value)) return;
  for (const [nestedKey, nestedValue] of Object.entries(value)) addTraceValue(current, nestedKey, nestedValue);
}

function renderTrace(node: TraceNode, indent: string): string[] {
  const lines: string[] = [];
  const entries = [...node.children.entries()];
  entries.forEach(([name, child], index) => {
    const last = index === entries.length - 1;
    const duration = child.duration === undefined ? "" : `  ${child.duration}`;
    lines.push(`${indent}${last ? "└─" : "├─"} ${name}${duration}`);
    lines.push(...renderTrace(child, `${indent}${last ? "   " : "│  "}`));
  });
  return lines;
}

export function formatTraces(traces: Array<Record<string, unknown> | undefined>): string[] {
  const present = traces.filter((trace): trace is Record<string, unknown> => isRecord(trace) && Object.keys(trace).length > 0);
  if (present.length === 0) return ["trace unavailable"];
  return present.flatMap((trace, index) => {
    const root: TraceNode = { children: new Map() };
    for (const [key, value] of Object.entries(trace)) addTraceValue(root, key, value);
    const heading = present.length === 1 ? "trace" : `trace ${index + 1}`;
    return [heading, ...renderTrace(root, "")];
  });
}
