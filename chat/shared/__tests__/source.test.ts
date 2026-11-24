import { describe, expect, it } from "vitest";
import { pageHref, pageKey } from "../source.ts";

const page = "capabilities/hybrid_search/overview";

describe("pageHref", () => {
  it("appends an anchor to the docs path", () => {
    expect(pageHref(page, "configure")).toBe("/capabilities/hybrid_search/overview#configure");
  });

  it("omits the hash when there is no anchor", () => {
    expect(pageHref(page)).toBe("/capabilities/hybrid_search/overview");
    expect(pageHref(page, null)).toBe("/capabilities/hybrid_search/overview");
    expect(pageHref(page, "")).toBe("/capabilities/hybrid_search/overview");
  });

  it("strips surrounding slashes", () => {
    expect(pageHref(`/${page}/`)).toBe("/capabilities/hybrid_search/overview");
    expect(pageHref(`//${page}///`, "configure")).toBe("/capabilities/hybrid_search/overview#configure");
  });
});

describe("pageKey", () => {
  it("identifies the same page across hosts, mounts, queries, and anchors", () => {
    for (const value of [
      "capabilities/hybrid_search/overview",
      "/capabilities/hybrid_search/overview",
      "/docs/capabilities/hybrid_search/overview",
      "/docs/capabilities/hybrid_search/overview#configure",
      "/capabilities/hybrid_search/overview?q=1#configure",
      "https://www.meilisearch.com/docs/capabilities/hybrid_search/overview#configure",
      "https://meilisearch.com/docs/capabilities/hybrid_search/overview/",
      "https://preview.mintlify.site/capabilities/hybrid_search/overview",
    ]) {
      expect(pageKey(value)).toBe(page);
    }
  });

  it("strips the query and hash when the URL constructor throws", () => {
    expect(pageKey("http://[?q=1#configure")).toBe("http://[");
  });

  it("returns / when the relative path is empty", () => {
    expect(pageKey("   ")).toBe("/");
    expect(pageKey("https://example.com")).toBe("/");
  });
});
