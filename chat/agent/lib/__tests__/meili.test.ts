import { describe, expect, it } from "vitest";
import { createSpanRecorder, formatTraces, summarizeSpans, type MeiliSpan } from "../meili.ts";

function hold(): { promise: Promise<void>; open: () => void } {
  let open: () => void = () => {};
  const promise = new Promise<void>((resolve) => {
    open = resolve;
  });
  return { promise, open };
}

describe("summarizeSpans", () => {
  it("sums the durations and reports the highest in-flight count", () => {
    expect(
      summarizeSpans([
        { ms: 40, processingMs: 10, inFlight: 1, trace: { query: "4ms" } },
        { ms: 25, processingMs: 15, inFlight: 3 },
      ]),
    ).toEqual({
      ms: 65,
      processingMs: 25,
      waitMs: 40,
      inFlight: 3,
      traces: [{ query: "4ms" }, undefined],
    });
  });

  it("clamps the wait at zero when processing time exceeds the span", () => {
    expect(summarizeSpans([{ ms: 5, processingMs: 20, inFlight: 2 }])).toEqual({
      ms: 5,
      processingMs: 20,
      waitMs: 0,
      inFlight: 2,
      traces: [undefined],
    });
  });

  it("summarizes no spans as zeroes", () => {
    expect(summarizeSpans([])).toEqual({ ms: 0, processingMs: 0, waitMs: 0, inFlight: 0, traces: [] });
  });
});

describe("createSpanRecorder", () => {
  it("records a span and the in-flight count while calls overlap", async () => {
    const recorder = createSpanRecorder();
    const spans: MeiliSpan[] = [];
    const gate = hold();
    let started = 0;

    const first = recorder.run(spans, async () => {
      started += 1;
      await gate.promise;
      return { processingTimeMs: 4, performanceDetails: { "search > filter": "2ms" } };
    });
    const second = recorder.run(spans, async () => {
      started += 1;
      await gate.promise;
      return { processingTimeMs: 1, performanceDetails: ["not-a-record"] };
    });

    expect(started).toBe(2);
    expect(spans).toHaveLength(0);
    gate.open();

    await expect(Promise.all([first, second])).resolves.toEqual([
      { processingTimeMs: 4, performanceDetails: { "search > filter": "2ms" } },
      { processingTimeMs: 1, performanceDetails: ["not-a-record"] },
    ]);

    const recorded = new Map(spans.map((span) => [span.processingMs, span]));
    expect(recorded.get(4)).toMatchObject({ inFlight: 1, trace: { "search > filter": "2ms" } });
    expect(recorded.get(1)).toMatchObject({ inFlight: 2, trace: undefined });
    expect(recorded.get(4)?.ms).toBeGreaterThanOrEqual(0);
    expect(recorded.get(1)?.ms).toBeGreaterThanOrEqual(0);

    await recorder.run(spans, async () => ({ processingTimeMs: 8 }));
    expect(spans.at(-1)).toMatchObject({ processingMs: 8, inFlight: 1, trace: undefined });
  });

  it("decrements the in-flight count after a call throws", async () => {
    const recorder = createSpanRecorder();
    const spans: MeiliSpan[] = [];
    const gate = hold();
    let started = 0;

    const failed = recorder.run(spans, async () => {
      started += 1;
      await gate.promise;
      throw new Error("search failed");
    });
    const succeeded = recorder.run(spans, async () => {
      started += 1;
      await gate.promise;
      return { processingTimeMs: 2 };
    });
    const failure = expect(failed).rejects.toThrow("search failed");
    const success = expect(succeeded).resolves.toEqual({ processingTimeMs: 2 });

    expect(started).toBe(2);
    gate.open();
    await failure;
    await success;

    expect(spans).toHaveLength(1);
    expect(spans[0]).toMatchObject({ processingMs: 2, inFlight: 2, trace: undefined });
    expect(spans[0]?.ms).toBeGreaterThanOrEqual(0);

    await recorder.run(spans, async () => ({ processingTimeMs: 1 }));
    expect(spans[1]).toMatchObject({ processingMs: 1, inFlight: 1, trace: undefined });
  });
});

describe("formatTraces", () => {
  it("says the trace is unavailable when nothing was recorded", () => {
    expect(formatTraces([])).toEqual(["trace unavailable"]);
    expect(formatTraces([undefined, {}])).toEqual(["trace unavailable"]);
  });

  it("renders a parent and child map as a tree with durations", () => {
    expect(
      formatTraces([
        {
          "search > filter": "2ms",
          "search > sort": "1ms",
          tokenize: "3ms",
        },
      ]),
    ).toEqual(["trace", "├─ search", "│  ├─ filter  2ms", "│  └─ sort  1ms", "└─ tokenize  3ms"]);
  });

  it("numbers each trace when more than one was recorded", () => {
    expect(formatTraces([{ query: "4ms" }, { index: "1ms" }])).toEqual([
      "trace 1",
      "└─ query  4ms",
      "trace 2",
      "└─ index  1ms",
    ]);
  });

  it("walks nested objects", () => {
    expect(
      formatTraces([
        {
          search: {
            "filter > ranking": 5,
            empty: { unused: true },
          },
        },
      ]),
    ).toEqual(["trace", "└─ search", "   ├─ filter", "   │  └─ ranking  5", "   └─ empty", "      └─ unused"]);
  });
});
