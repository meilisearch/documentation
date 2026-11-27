import { describe, expect, it, vi } from "vitest";
import { MeilisearchApiError } from "meilisearch";
import { createSearchTool } from "../search.ts";
import { fakeContext, missingIndex } from "../../__tests__/fakes.ts";

const fields = ["title", "page", "anchor", "breadcrumb", "content", "content_type", "tab", "group", "version_label", "released_on"];
const hybrid = { embedder: "voyage", semanticRatio: 0.5 };
const jsSample = "```javascript\nclient.search()\n```";

function call(toolCallId: string) {
  return { toolCallId, messages: [], abortSignal: undefined, context: {} as Record<string, unknown> };
}

function fakeRerank() {
  const calls: string[] = [];
  const rerank = async <T extends { breadcrumb: string; content: string }>(q: string, pool: T[]) => {
    calls.push(q);
    return {
      ranked: pool.map((hit, originalIndex) => ({ hit, score: 0.9 - originalIndex * 0.01, originalIndex })),
      ms: 5,
    };
  };
  return { rerank, calls };
}

function federated(indexUid: string, hit: Record<string, unknown>, score = 0.8) {
  return { ...hit, _rankingScore: score, _federation: { indexUid } };
}

function textHit(indexUid: string, page: string, anchor: string | null, extra: Record<string, unknown> = {}) {
  return federated(indexUid, {
    title: page,
    page,
    anchor,
    breadcrumb: "Docs",
    content: page,
    content_type: "text",
    tab: "Documentation",
    group: "Learn",
    ...extra,
  });
}

async function run(ctx: ReturnType<typeof fakeContext>, rerank: ReturnType<typeof fakeRerank>["rerank"], toolCallId = "call-1", q = "hybrid") {
  const search = createSearchTool(ctx, { rerank });
  const result = await search.execute({ q }, call(toolCallId));
  if (typeof result !== "object" || result === null || !("hits" in result)) throw new Error("expected hits");
  return result;
}

describe("createSearchTool", () => {
  it("searches docs, routes, and the changelog with a federation limit of 50", async () => {
    const ctx = fakeContext();
    ctx.meili.client.multiSearch.mockResolvedValue({ hits: [], processingTimeMs: 1 });

    await run(ctx, fakeRerank().rerank);

    expect(ctx.meili.client.multiSearch).toHaveBeenCalledWith({
      federation: { limit: 50, showPerformanceDetails: true },
      queries: [
        {
          indexUid: "docs-chunks",
          q: "hybrid",
          hybrid,
          showRankingScore: true,
          attributesToRetrieve: [...fields, "codes"],
        },
        {
          indexUid: "api-routes",
          q: "hybrid",
          hybrid,
          showRankingScore: true,
          attributesToRetrieve: [...fields],
        },
        {
          indexUid: "changelog-chunks",
          q: "hybrid",
          hybrid,
          showRankingScore: true,
          attributesToRetrieve: [...fields, "release_section", "description"],
          federationOptions: { weight: 0.8 },
        },
      ],
    });
  });

  it("renders a code sample in the reader's language", async () => {
    const ctx = fakeContext({ user: { codeLanguage: "JS" } });
    ctx.meili.client.multiSearch.mockResolvedValue({
      hits: [
        federated("docs-chunks", {
          title: "Hybrid search",
          page: "learn/hybrid_search",
          anchor: "sample",
          breadcrumb: "Learn",
          content: "ignored",
          content_type: "code_sample",
          codes: { js: "client.search()", http: "curl search" },
          tab: "Documentation",
          group: "Learn",
        }),
      ],
      processingTimeMs: 2,
    });

    const result = await run(ctx, fakeRerank().rerank);

    expect(result).toEqual({
      hits: [
        {
          title: "Hybrid search",
          page: "learn/hybrid_search",
          url: "/learn/hybrid_search#sample",
          anchor: "sample",
          breadcrumb: "Learn",
          content: jsSample,
          content_type: "code_sample",
          tab: "Documentation",
          group: "Learn",
        },
      ],
    });
  });

  it("returns no hits and skips rerank when the pool is empty", async () => {
    const ctx = fakeContext();
    const { rerank, calls } = fakeRerank();
    ctx.meili.client.multiSearch.mockResolvedValue({ hits: [], processingTimeMs: 1 });

    const result = await run(ctx, rerank);

    expect(result).toEqual({ hits: [] });
    expect(calls).toEqual([]);
    expect(ctx.pool.seenChunks.size).toBe(0);
    expect(ctx.details.byCall.get("call-1")).toMatchObject({
      candidates: 0,
      kept: 0,
      dupes: 0,
      docs: 0,
      routes: 0,
      changelog: 0,
    });
  });

  it("remembers kept hits and records the search under the tool call", async () => {
    const ctx = fakeContext();
    ctx.meili.client.multiSearch.mockResolvedValue({
      hits: [
        textHit("docs-chunks", "learn/hybrid_search", "configuration", { title: "Hybrid search", content: "Keyword and semantic." }),
        textHit("api-routes", "reference/api/search", null, { title: "Search", content: "POST search", breadcrumb: "API" }),
        textHit("changelog-chunks", "changelog/v1.58", null, {
          title: "v1.58",
          content: "Shipped hybrid search.",
          breadcrumb: "Changelog",
          version_label: "v1.58",
          released_on: "2026-11-23",
          description: "November 23, 2026",
        }),
      ],
      processingTimeMs: 4,
    });

    const result = await run(ctx, fakeRerank().rerank);

    expect(result.hits.map((hit) => hit.page)).toEqual(["learn/hybrid_search", "reference/api/search", "changelog/v1.58"]);
    expect(ctx.pool.seenChunks).toEqual(
      new Set(["learn/hybrid_search#configuration", "reference/api/search#", "changelog/v1.58#"]),
    );
    expect(ctx.pool.cited("[hybrid](/learn/hybrid_search) [route](/reference/api/search) [notes](/changelog/v1.58)")).toEqual([
      { title: "Hybrid search", href: "/learn/hybrid_search", breadcrumb: "Documentation > Learn" },
      { title: "Search", href: "/reference/api/search", breadcrumb: "Documentation > Learn" },
      { title: "v1.58", href: "/changelog/v1.58", breadcrumb: "Documentation > Learn" },
    ]);
    const detail = ctx.details.byCall.get("call-1");
    expect(ctx.details.searches).toEqual([detail]);
    expect(detail).toMatchObject({
      q: "hybrid",
      candidates: 3,
      kept: 3,
      dupes: 0,
      docs: 1,
      routes: 1,
      changelog: 1,
      rerankMs: 5,
    });
  });

  it("drops a page anchor that a previous search already returned", async () => {
    const ctx = fakeContext();
    const seen = textHit("docs-chunks", "docs/a", "intro", { title: "A", content: "Seen" });
    const fresh = textHit("docs-chunks", "docs/b", "other", { title: "B", content: "Fresh" });
    ctx.meili.client.multiSearch
      .mockResolvedValueOnce({ hits: [seen], processingTimeMs: 1 })
      .mockResolvedValueOnce({ hits: [seen, fresh], processingTimeMs: 1 });
    const { rerank } = fakeRerank();

    await run(ctx, rerank, "call-1");
    const again = await run(ctx, rerank, "call-2");

    expect(again.hits).toEqual([
      {
        title: "B",
        page: "docs/b",
        url: "/docs/b#other",
        anchor: "other",
        breadcrumb: "Docs",
        content: "Fresh",
        content_type: "text",
        tab: "Documentation",
        group: "Learn",
      },
    ]);
    expect(ctx.details.byCall.get("call-2")).toMatchObject({ candidates: 2, kept: 1, dupes: 1, docs: 2 });
  });

  it("searches docs and routes when the changelog index is missing", async () => {
    const ctx = fakeContext();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    ctx.meili.client.multiSearch
      .mockRejectedValueOnce(missingIndex())
      .mockResolvedValueOnce({
        hits: [textHit("docs-chunks", "learn/hybrid_search", null, { title: "Hybrid search", content: "Keyword and semantic." })],
        processingTimeMs: 2,
      });

    const result = await run(ctx, fakeRerank().rerank);

    expect(result.hits.map((hit) => hit.page)).toEqual(["learn/hybrid_search"]);
    expect(ctx.meili.client.multiSearch).toHaveBeenCalledTimes(2);
    const queries = ctx.meili.client.multiSearch.mock.calls.map((callArgs) => callArgs[0].queries.map((query: { indexUid: string }) => query.indexUid));
    expect(queries).toEqual([
      ["docs-chunks", "api-routes", "changelog-chunks"],
      ["docs-chunks", "api-routes"],
    ]);
    expect(ctx.meili.client.multiSearch.mock.calls[1][0].federation).toEqual({ limit: 50, showPerformanceDetails: true });
    expect(ctx.details.byCall.get("call-1")).toMatchObject({ docs: 1, routes: 0, changelog: 0, kept: 1 });
    errorSpy.mockRestore();
  });

  it("rethrows an error that is not a missing index", async () => {
    const ctx = fakeContext();
    const error = new MeilisearchApiError(new Response(null, { status: 500, statusText: "Internal Server Error" }), {
      message: "Internal",
      code: "internal",
      type: "internal",
      link: "https://docs.meilisearch.com/errors#internal",
    });
    ctx.meili.client.multiSearch.mockRejectedValue(error);

    await expect(run(ctx, fakeRerank().rerank)).rejects.toBe(error);
    expect(ctx.meili.client.multiSearch).toHaveBeenCalledTimes(1);
    expect(ctx.details.searches).toEqual([]);
  });
});
