import { describe, expect, it } from "vitest";
import { linkTarget, localizeHref } from "../links.ts";
import { pageHref, pageKey } from "../../../shared/source.ts";

const PROD = "https://www.meilisearch.com/docs/getting_started/overview";
const PREVIEW = "https://meilisearch-6b28dec2-chat.mintlify.site/getting_started/overview";
const LOCAL = "http://127.0.0.1:3000/getting_started/overview";
const CUSTOM = "https://docs.example.com/getting_started/overview";
const DOCS_PATH = "/capabilities/hybrid_search/overview#configure";

describe("pageHref", () => {
  it("joins the page and anchor into a root-relative path", () => {
    expect(pageHref("capabilities/hybrid_search/overview", "configure")).toBe(DOCS_PATH);
    expect(pageHref("capabilities/hybrid_search/overview")).toBe("/capabilities/hybrid_search/overview");
    expect(pageHref("/capabilities/hybrid_search/overview/")).toBe("/capabilities/hybrid_search/overview");
  });
});

describe("pageKey", () => {
  it.each([
    ["capabilities/hybrid_search/overview", "capabilities/hybrid_search/overview"],
    ["/capabilities/hybrid_search/overview", "capabilities/hybrid_search/overview"],
    ["/docs/capabilities/hybrid_search/overview", "capabilities/hybrid_search/overview"],
    ["/docs/capabilities/hybrid_search/overview#configure", "capabilities/hybrid_search/overview"],
    ["/capabilities/hybrid_search/overview?q=1#configure", "capabilities/hybrid_search/overview"],
    [
      "https://www.meilisearch.com/docs/capabilities/hybrid_search/overview#configure",
      "capabilities/hybrid_search/overview",
    ],
    ["https://meilisearch.com/docs/capabilities/hybrid_search/overview/", "capabilities/hybrid_search/overview"],
    ["https://preview.mintlify.site/capabilities/hybrid_search/overview", "capabilities/hybrid_search/overview"],
  ])("%s -> %s", (value, key) => {
    expect(pageKey(value)).toBe(key);
  });
});

describe("localizeHref", () => {
  it("adds the production /docs mount to a docs path", () => {
    expect(localizeHref(DOCS_PATH, PROD)).toBe(
      "https://www.meilisearch.com/docs/capabilities/hybrid_search/overview#configure",
    );
  });

  it("keeps an already localized production link", () => {
    const href = "https://www.meilisearch.com/docs/capabilities/hybrid_search/overview#configure";
    expect(localizeHref(href, PROD)).toBe(href);
    expect(localizeHref(localizeHref(href, PROD), PROD)).toBe(href);
  });

  it("moves an apex docs URL onto www when the reader is on www", () => {
    expect(localizeHref("https://meilisearch.com/docs/capabilities/hybrid_search/overview", PROD)).toBe(
      "https://www.meilisearch.com/docs/capabilities/hybrid_search/overview",
    );
  });

  it("serves preview, localhost, and custom domains from the root", () => {
    expect(localizeHref(DOCS_PATH, PREVIEW)).toBe(
      "https://meilisearch-6b28dec2-chat.mintlify.site/capabilities/hybrid_search/overview#configure",
    );
    expect(localizeHref(DOCS_PATH, LOCAL)).toBe(
      "http://127.0.0.1:3000/capabilities/hybrid_search/overview#configure",
    );
    expect(localizeHref(DOCS_PATH, CUSTOM)).toBe(
      "https://docs.example.com/capabilities/hybrid_search/overview#configure",
    );
  });

  it("rewrites a stale production URL onto the current deployment", () => {
    const stale = "https://www.meilisearch.com/docs/capabilities/hybrid_search/overview?utm=1#configure";
    expect(localizeHref(stale, PREVIEW)).toBe(
      "https://meilisearch-6b28dec2-chat.mintlify.site/capabilities/hybrid_search/overview?utm=1#configure",
    );
    expect(localizeHref(stale, LOCAL)).toBe(
      "http://127.0.0.1:3000/capabilities/hybrid_search/overview?utm=1#configure",
    );
  });

  it("leaves non-docs links unchanged", () => {
    const page = LOCAL;
    for (const href of [
      "https://www.meilisearch.com/pricing",
      "https://github.com/meilisearch/meilisearch",
      "mailto:hello@meilisearch.com",
      "#configure",
      "//cdn.example.com/widget.js",
      "/docs/assets/datasets/movies.json",
      "https://www.meilisearch.com/docs/assets/datasets/movies.json",
      "https://developer.mozilla.org/docs/Web/API/URL",
    ]) {
      expect(localizeHref(href, page)).toBe(href);
    }
  });

  it("is idempotent", () => {
    for (const page of [PROD, PREVIEW, LOCAL, CUSTOM]) {
      const once = localizeHref(DOCS_PATH, page);
      expect(localizeHref(once, page)).toBe(once);
    }
  });
});

describe("linkTarget", () => {
  it("navigates localized docs links in place and opens other links in a new tab", () => {
    expect(linkTarget(DOCS_PATH, LOCAL)).toEqual({ target: "_self" });
    expect(linkTarget("https://www.meilisearch.com/docs/capabilities/hybrid_search/overview", PREVIEW)).toEqual({
      target: "_self",
    });
    expect(linkTarget("https://github.com/meilisearch/meilisearch", PROD)).toEqual({
      target: "_blank",
      rel: "noopener noreferrer",
    });
    expect(linkTarget("https://www.meilisearch.com/pricing", LOCAL)).toEqual({
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });
});
