import { describe, expect, it } from "vitest";
import { planSync } from "../sync/plan.ts";
import type { RawPage } from "../types.ts";

function page(name: string, hash: string): RawPage {
  return { page: name, tab: "", group: "", frontmatter: { title: name }, body: "", pageHash: hash };
}

describe("planSync", () => {
  it("adds every page when the index is empty", () => {
    const a = page("a", "h1");
    const b = page("b", "h2");

    const plan = planSync(new Map(), [a, b]);

    expect(plan.changed).toEqual([a, b]);
    expect(plan.added).toEqual(["a", "b"]);
    expect(plan.updated).toEqual([]);
    expect(plan.removed).toEqual([]);
    expect(plan.deletePages).toEqual([]);
    expect(plan.unchanged).toBe(0);
  });

  it("skips pages whose hash is identical", () => {
    const existing = new Map([
      ["a", "h1"],
      ["b", "h2"],
    ]);

    const plan = planSync(existing, [page("a", "h1"), page("b", "h2")]);

    expect(plan.changed).toEqual([]);
    expect(plan.added).toEqual([]);
    expect(plan.updated).toEqual([]);
    expect(plan.deletePages).toEqual([]);
    expect(plan.unchanged).toBe(2);
  });

  it("updates and deletes a page whose hash changed", () => {
    const existing = new Map([
      ["a", "h1"],
      ["b", "h2"],
    ]);
    const b = page("b", "h2-new");

    const plan = planSync(existing, [page("a", "h1"), b]);

    expect(plan.changed).toEqual([b]);
    expect(plan.added).toEqual([]);
    expect(plan.updated).toEqual(["b"]);
    expect(plan.deletePages).toEqual(["b"]);
    expect(plan.unchanged).toBe(1);
  });

  it("removes and deletes a page no longer in the docs", () => {
    const existing = new Map([
      ["a", "h1"],
      ["gone", "h2"],
    ]);

    const plan = planSync(existing, [page("a", "h1")]);

    expect(plan.changed).toEqual([]);
    expect(plan.removed).toEqual(["gone"]);
    expect(plan.deletePages).toEqual(["gone"]);
    expect(plan.unchanged).toBe(1);
  });

  it("orders deletePages as updated in input order, then removed sorted", () => {
    const existing = new Map([
      ["z", "hz"],
      ["a", "ha"],
      ["b", "hb"],
      ["m", "hm"],
      ["c", "hc"],
    ]);
    const c = page("c", "hc-new");
    const fresh = page("fresh", "hf");
    const b = page("b", "hb-new");

    const plan = planSync(existing, [c, fresh, b, page("a", "ha")]);

    expect(plan.changed).toEqual([c, fresh, b]);
    expect(plan.added).toEqual(["fresh"]);
    expect(plan.updated).toEqual(["c", "b"]);
    expect(plan.removed).toEqual(["m", "z"]);
    expect(plan.deletePages).toEqual(["c", "b", "m", "z"]);
    expect(plan.unchanged).toBe(1);
  });

  it("re-chunks every page when forced", () => {
    const existing = new Map([
      ["a", "ha"],
      ["b", "hb"],
      ["gone", "hg"],
    ]);
    const b = page("b", "hb");
    const fresh = page("fresh", "hf");
    const a = page("a", "ha");

    const plan = planSync(existing, [b, fresh, a], { force: true });

    expect(plan.changed).toEqual([b, fresh, a]);
    expect(plan.added).toEqual(["fresh"]);
    expect(plan.updated).toEqual(["b", "a"]);
    expect(plan.removed).toEqual(["gone"]);
    expect(plan.deletePages).toEqual(["b", "a", "gone"]);
    expect(plan.unchanged).toBe(0);
  });
});
