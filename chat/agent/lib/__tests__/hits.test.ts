import { describe, expect, it } from "vitest";
import { renderSample, toHit } from "../hits.ts";

const emptyHit = {
  title: "",
  page: "",
  url: "",
  anchor: null,
  breadcrumb: "",
  content: "",
  content_type: "",
  tab: null,
  group: null,
};

describe("toHit", () => {
  it("maps a plain object, derives the url from the page and anchor, and omits empty release fields", () => {
    expect(
      toHit(
        {
          title: "Search",
          page: "reference/search",
          anchor: "query",
          breadcrumb: "API reference",
          content: "Search for documents.",
          content_type: "guide",
          tab: "Docs",
          group: "Reference",
          version_label: "",
          released_on: null,
          release_section: "",
          description: "November 23, 2026",
        },
        null,
      ),
    ).toEqual({
      title: "Search",
      page: "reference/search",
      url: "/reference/search#query",
      anchor: "query",
      breadcrumb: "API reference",
      content: "Search for documents.",
      content_type: "guide",
      tab: "Docs",
      group: "Reference",
    });
  });

  it("keeps release fields that have a value", () => {
    expect(
      toHit(
        {
          title: "v1.58",
          page: "changelog/v1.58",
          content: "notes",
          content_type: "changelog",
          version_label: "v1.58",
          released_on: "2026-11-23",
          release_section: "Fixes",
          description: "November 23, 2026",
        },
        null,
      ),
    ).toEqual({
      title: "v1.58",
      page: "changelog/v1.58",
      url: "/changelog/v1.58",
      anchor: null,
      breadcrumb: "",
      content: "notes",
      content_type: "changelog",
      tab: null,
      group: null,
      version_label: "v1.58",
      released_on: "2026-11-23",
      release_section: "Fixes",
      description: "November 23, 2026",
    });
  });

  it("renders a code sample in the reader's language", () => {
    expect(
      toHit(
        {
          title: "Search",
          page: "reference/search",
          content: "raw chunk",
          content_type: "code_sample",
          codes: { js: "client.search()", http: "curl search" },
        },
        "JS",
      ),
    ).toEqual({
      title: "Search",
      page: "reference/search",
      url: "/reference/search",
      anchor: null,
      breadcrumb: "",
      content: "```javascript\nclient.search()\n```",
      content_type: "code_sample",
      tab: null,
      group: null,
    });
  });

  it("falls back to an HTTP sample and a note when that language is missing", () => {
    const hit = toHit(
      {
        title: "Search",
        page: "reference/search",
        content_type: "code_sample",
        codes: { http: "curl search" },
      },
      "Python",
    );

    expect(hit.content).toBe("```bash\ncurl search\n```\n\nNo Python sample for this route. Showing the HTTP request.");
    expect(hit.content_type).toBe("code_sample");
  });

  it("turns null, arrays, and primitives into empty hits", () => {
    for (const value of [null, ["page"], "page", 0, true]) {
      expect(toHit(value, "JS")).toEqual(emptyHit);
    }
  });
});

describe("renderSample", () => {
  it("returns nothing when there is no code and no note", () => {
    expect(renderSample(undefined, null)).toBe("");
    expect(renderSample({}, "http")).toBe("");
  });

  it("returns the note alone when the fallback has no HTTP sample", () => {
    expect(renderSample(undefined, "Python")).toBe("No Python sample for this route. Showing the HTTP request.");
  });
});
