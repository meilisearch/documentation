import { describe, expect, it } from "vitest";
import { createSourcePool } from "../sources.ts";

describe("createSourcePool", () => {
  it("ignores an empty page", () => {
    const pool = createSourcePool();

    pool.rememberPage({ page: "", title: "Missing", tab: "Docs", group: "API" }, 1);

    expect(pool.cited("https://www.meilisearch.com/docs")).toEqual([]);
  });

  it("keeps the higher score for a page and records the breadcrumb from its tab and group", () => {
    const pool = createSourcePool();

    pool.rememberPage({ page: "reference/search", title: "Search", tab: "Docs", group: "API reference" }, 0.4);
    pool.rememberPage({ page: "/docs/reference/search", title: "Replacement", tab: "Other", group: "Elsewhere" }, 0.9);
    pool.rememberPage({ page: "reference/search", title: "Lower", tab: null, group: null }, 0.2);
    pool.rememberPage({ page: "learn/filtering", title: "Filtering", tab: "", group: "Guides" }, 0.5);
    pool.rememberPage({ page: "learn/indexing", title: "Indexing", tab: null, group: null }, 0.1);
    pool.rememberPage({ page: "reference/documents", title: "Documents", tab: "Docs", group: "API" }, 1);

    const answer = [
      "The filtering guide is [Filtering](/docs/learn/filtering).",
      "Search is documented at https://www.meilisearch.com/docs/reference/search.",
      "Indexing is [Indexing](https://www.meilisearch.com/docs/learn/indexing).",
    ].join(" ");

    expect(pool.cited(answer)).toEqual([
      { title: "Search", href: "/reference/search", breadcrumb: "Docs > API reference" },
      { title: "Filtering", href: "/learn/filtering", breadcrumb: "Guides" },
      { title: "Indexing", href: "/learn/indexing" },
    ]);
  });

  it("skips a release whose page is already remembered and labels the rest as changelog", () => {
    const pool = createSourcePool();

    pool.rememberPage(
      { page: "changelog/v1.58", title: "Already indexed", tab: "Changelog", group: "Releases" },
      0.6,
    );
    pool.rememberReleases([
      { version: "v1.58", released_on: "2026-11-23", url: "https://www.meilisearch.com/docs/changelog/v1.58" },
      { version: "v1.57", released_on: "2026-10-14", url: "/changelog/v1.57" },
    ]);

    expect(
      pool.cited(
        "See https://www.meilisearch.com/docs/changelog/v1.58 and https://www.meilisearch.com/docs/changelog/v1.57",
      ),
    ).toEqual([
      { title: "Already indexed", href: "/changelog/v1.58", breadcrumb: "Changelog > Releases" },
      { title: "Meilisearch v1.57 release notes", href: "/changelog/v1.57", breadcrumb: "Changelog" },
    ]);
  });
});
