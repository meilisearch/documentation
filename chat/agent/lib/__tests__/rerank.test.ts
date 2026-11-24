import { describe, expect, it } from "vitest";
import { MAX_DROP, MIN_KEEP, MIN_SCORE, rerankDocument, scoreCurve, selectHits, type RankedHit } from "../rerank.ts";

function hit(page: string, score: number, anchor: string | null = null): RankedHit<{ page: string; anchor: string | null }> {
  return { hit: { page, anchor }, score, originalIndex: 0 };
}

describe("scoreCurve", () => {
  it("ignores missing and non-finite scores", () => {
    expect(scoreCurve([0.9, undefined, Number.NaN, 0.3], [1, 2, 4])).toEqual({
      avg: 0.6,
      min: 0.3,
      at: [
        { rank: 1, score: 0.9 },
        { rank: 4, score: 0.3 },
      ],
    });
  });

  it("returns an empty curve when nothing was scored", () => {
    expect(scoreCurve([], [1])).toEqual({ avg: null, min: null, at: [] });
  });
});

describe("rerankDocument", () => {
  it("puts the version, description, and breadcrumb ahead of the content", () => {
    expect(
      rerankDocument({ version_label: "v1.58", description: "November 23, 2026", breadcrumb: "Changelog", content: "body" }),
    ).toBe("v1.58\nNovember 23, 2026\nChangelog\nbody");
  });

  it("returns the content alone when there is no heading", () => {
    expect(rerankDocument({ breadcrumb: "", content: "body" })).toBe("body");
  });
});

describe("selectHits", () => {
  it("keeps the first hits even when they fall below the score floor", () => {
    const seen = new Set<string>();
    const weak = Array.from({ length: MIN_KEEP }, (_, index) => hit(`page-${index}`, MIN_SCORE - 0.2));
    const dropped = hit("dropped", MIN_SCORE - 0.2);

    const selected = selectHits([...weak, dropped], seen);

    expect(selected.kept.map((item) => item.hit.page)).toEqual(weak.map((item) => item.hit.page));
    expect(selected.kept.map((item) => item.voyageRank)).toEqual([1, 2, 3]);
    expect(selected.dupes).toBe(0);
  });

  it("drops a later hit that is too far below the top score", () => {
    const top = 0.9;
    const selected = selectHits(
      [
        hit("top", top),
        hit("second", top),
        hit("third", top),
        hit("close", top - MAX_DROP),
        hit("far", top - MAX_DROP - 0.01),
      ],
      new Set(),
    );

    expect(selected.kept.map((item) => item.hit.page)).toEqual(["top", "second", "third", "close"]);
    expect(selected.cutoff).toBe(Math.max(MIN_SCORE, top - MAX_DROP));
  });

  it("counts a chunk that was already seen as a duplicate and does not return it", () => {
    const seen = new Set(["docs/page#anchor"]);
    const selected = selectHits([hit("docs/page", 0.9, "anchor"), hit("other", 0.8)], seen);

    expect(selected.dupes).toBe(1);
    expect(selected.kept.map((item) => item.hit.page)).toEqual(["other"]);
    expect(seen).toEqual(new Set(["docs/page#anchor", "other#"]));
  });

  it("has no cutoff when nothing was ranked", () => {
    expect(selectHits([], new Set())).toEqual({ kept: [], dupes: 0, cutoff: null });
  });
});
