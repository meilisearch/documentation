import { describe, expect, it } from "vitest";
import { createExpandPageTool } from "../expand-page.ts";
import { fakeContext } from "../../__tests__/fakes.ts";

const jsSample = "```javascript\nclient.search()\n```";

function call(toolCallId = "call-1") {
  return { toolCallId, messages: [], abortSignal: undefined, context: {} as Record<string, unknown> };
}

function pageOf<T extends { markdown: string }>(result: T | { error: string } | AsyncIterable<T | { error: string }>): T {
  if (typeof result !== "object" || result === null || !("markdown" in result)) throw new Error("expected a page");
  return result;
}

function searchResult(hits: Record<string, unknown>[], estimatedTotalHits = hits.length) {
  return { hits, estimatedTotalHits, processingTimeMs: 2 };
}

describe("createExpandPageTool", () => {
  it("reads a version from the changelog and renders its code samples", async () => {
    const ctx = fakeContext({ user: { codeLanguage: "JS" } });
    ctx.meili.changelog.search.mockResolvedValue(
      searchResult([
        { title: "v1.58", content: "Hybrid search is stable.", content_type: "prose" },
        {
          title: "v1.58",
          content: "ignored",
          content_type: "code_sample",
          codes: { js: "client.search()", http: "curl search" },
        },
      ]),
    );
    const tool = createExpandPageTool(ctx);

    const result = await tool.execute({ page: "v1.58" }, call());

    expect(ctx.meili.changelog.search).toHaveBeenCalledWith("", {
      filter: 'page = "changelog/v1.58"',
      sort: ["chunk_index:asc"],
      limit: 1000,
      attributesToRetrieve: ["title", "content", "content_type", "codes"],
      showPerformanceDetails: true,
    });
    expect(ctx.meili.docs.search).not.toHaveBeenCalled();
    expect(result).toEqual({
      title: "v1.58",
      url: "/changelog/v1.58",
      markdown: `# v1.58\n\nHybrid search is stable.\n\n${jsSample}`,
      truncated: false,
    });
    expect(ctx.details.opened).toEqual([{ tool: "expand_page", arg: "changelog/v1.58", page: "changelog/v1.58" }]);
  });

  it("reads a documentation page from the docs index", async () => {
    const ctx = fakeContext();
    ctx.meili.docs.search.mockResolvedValue(
      searchResult([
        { title: "Hybrid search", content: "Keyword.", content_type: "prose" },
        { title: "Hybrid search", content: "Semantic.", content_type: "prose" },
      ]),
    );
    const tool = createExpandPageTool(ctx);

    const result = await tool.execute({ page: "learn/hybrid_search" }, call());

    expect(ctx.meili.docs.search).toHaveBeenCalledWith("", {
      filter: 'page = "learn/hybrid_search"',
      sort: ["chunk_index:asc"],
      limit: 1000,
      attributesToRetrieve: ["title", "content", "content_type", "codes"],
      showPerformanceDetails: true,
    });
    expect(ctx.meili.changelog.search).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      title: "Hybrid search",
      url: "/learn/hybrid_search",
      markdown: "# Hybrid search\n\nKeyword.\n\nSemantic.",
      truncated: false,
    });
  });

  it("returns an error and records the read when the page has no hits", async () => {
    const ctx = fakeContext();
    ctx.meili.docs.search.mockResolvedValue(searchResult([]));
    const tool = createExpandPageTool(ctx);
    const missing = { error: 'No page found for "missing/page". Use the page field of a search result.' };

    const result = await tool.execute({ page: "missing/page" }, call());

    expect(result).toEqual(missing);
    expect(ctx.details.reads.get("call-1")).toMatchObject({
      bytes: new TextEncoder().encode(JSON.stringify(missing)).length,
      page: "missing/page",
    });
    expect(ctx.details.reads.get("call-1")?.matched).toBeUndefined();
    expect(ctx.details.opened).toEqual([{ tool: "expand_page", arg: "missing/page", page: "missing/page" }]);
  });

  it("marks a page longer than 30000 characters as truncated", async () => {
    const ctx = fakeContext();
    const prefix = "# Big\n\n";
    const under = "x".repeat(30_000 - prefix.length);
    const over = "x".repeat(30_000 - prefix.length + 1);
    ctx.meili.docs.search
      .mockResolvedValueOnce(searchResult([{ title: "Big", content: under, content_type: "prose" }]))
      .mockResolvedValueOnce(searchResult([{ title: "Big", content: over, content_type: "prose" }]));
    const tool = createExpandPageTool(ctx);

    const fits = pageOf(await tool.execute({ page: "learn/big" }, call("under")));
    const huge = pageOf(await tool.execute({ page: "learn/big" }, call("over")));

    expect(fits).toMatchObject({ truncated: false, markdown: `${prefix}${under}` });
    expect(fits.markdown).toHaveLength(30_000);
    expect(huge.truncated).toBe(true);
    expect(huge.markdown.length).toBeLessThanOrEqual(30_000);
    expect(huge.markdown.length).toBeLessThan(`${prefix}${over}`.length);
  });
});
