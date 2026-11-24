import { describe, expect, it } from "vitest";
import { expandedPageLabel, isExpandPart, isReleasesPart, isSearchPart, searchQuery } from "../parts.ts";

type Part = Parameters<typeof isSearchPart>[0];

function part(value: object): Part {
  return value as Part;
}

const search = part({ type: "tool-search", state: "input-available" });
const expand = part({ type: "tool-expand_page", state: "input-available" });
const releases = part({ type: "tool-list_releases", state: "input-available" });
const text = part({ type: "text", text: "Hello" });

describe("tool part guards", () => {
  it("matches search, expand, and releases parts", () => {
    expect(isSearchPart(search)).toBe(true);
    expect(isSearchPart(expand)).toBe(false);
    expect(isSearchPart(releases)).toBe(false);
    expect(isSearchPart(text)).toBe(false);

    expect(isExpandPart(expand)).toBe(true);
    expect(isExpandPart(search)).toBe(false);
    expect(isExpandPart(releases)).toBe(false);
    expect(isExpandPart(text)).toBe(false);

    expect(isReleasesPart(releases)).toBe(true);
    expect(isReleasesPart(search)).toBe(false);
    expect(isReleasesPart(expand)).toBe(false);
    expect(isReleasesPart(text)).toBe(false);
  });
});

describe("searchQuery", () => {
  it("reads input.q only when it is a string", () => {
    expect(searchQuery(part({ input: { q: "filters" } }))).toBe("filters");
    expect(searchQuery(part({ input: { q: "" } }))).toBe("");
    expect(searchQuery(part({ input: { q: 3 } }))).toBeUndefined();
    expect(searchQuery(part({ input: { q: null } }))).toBeUndefined();
    expect(searchQuery(part({ input: {} }))).toBeUndefined();
    expect(searchQuery(part({}))).toBeUndefined();
  });
});

describe("expandedPageLabel", () => {
  it("prefers the returned title, then the requested page", () => {
    expect(
      expandedPageLabel(
        part({
          output: { title: "Filters" },
          input: { page: "/reference/api/search" },
        }),
      ),
    ).toBe("Filters");
    expect(
      expandedPageLabel(
        part({
          output: { title: 1 },
          input: { page: "/reference/api/search" },
        }),
      ),
    ).toBe("/reference/api/search");
    expect(expandedPageLabel(part({ input: { page: "/getting_started/overview" } }))).toBe(
      "/getting_started/overview",
    );
    expect(expandedPageLabel(part({ input: { page: 1 }, output: { title: null } }))).toBeUndefined();
    expect(expandedPageLabel(part({}))).toBeUndefined();
  });
});
