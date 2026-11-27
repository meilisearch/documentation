import { describe, expect, it } from "vitest";
import { createApiRouteTool } from "../get-api-route.ts";
import { fakeContext } from "../../__tests__/fakes.ts";

const codes = { js: "client.search()", http: "curl search" };

function call(toolCallId = "call-1") {
  return { toolCallId, messages: [], abortSignal: undefined, context: {} as Record<string, unknown> };
}

function empty() {
  return { hits: [], processingTimeMs: 1 };
}

function routePage(page: string, title: string) {
  return [
    { title, page, content: "Parameters", chunk_index: 0 },
    { title, page, content: "Response", chunk_index: 1, codes },
  ];
}

function presented(page: string, title: string, matched: "exact" | "similar" | "sdk_method") {
  return {
    matched,
    title,
    page,
    url: `/${page}`,
    markdown: "Parameters\n\nResponse",
    truncated: false,
    language: "js",
    code: "client.search()",
  };
}

describe("createApiRouteTool", () => {
  it("returns an exact lookup_keys match with the reader's code sample", async () => {
    const ctx = fakeContext({ user: { codeLanguage: "JS" } });
    const page = "reference/api/search/search-with-post";
    ctx.meili.routes.search.mockResolvedValue({ hits: routePage(page, "Search with POST"), processingTimeMs: 2 });
    const tool = createApiRouteTool(ctx);

    const result = await tool.execute({ route: "POST /indexes/{index_uid}/search" }, call());

    expect(ctx.meili.routes.search).toHaveBeenCalledTimes(1);
    expect(ctx.meili.routes.search).toHaveBeenCalledWith("", {
      filter: 'lookup_keys IN ["POST /indexes/{index_uid}/search"]',
      sort: ["chunk_index:asc"],
      limit: 1000,
      attributesToRetrieve: ["title", "page", "content", "chunk_index", "codes"],
      showPerformanceDetails: true,
    });
    expect(result).toEqual(presented(page, "Search with POST", "exact"));
  });

  it("returns the single page for an SDK method when there is no exact hit", async () => {
    const ctx = fakeContext({ user: { codeLanguage: "JS" } });
    const page = "reference/api/embedders/update-embedders";
    ctx.meili.routes.search
      .mockResolvedValueOnce(empty())
      .mockResolvedValueOnce({ hits: routePage(page, "Update embedders"), processingTimeMs: 2 });
    const tool = createApiRouteTool(ctx);

    const result = await tool.execute({ route: "updateEmbedders" }, call());

    expect(ctx.meili.routes.search).toHaveBeenNthCalledWith(
      2,
      "",
      expect.objectContaining({ filter: 'sdk_methods IN ["updateEmbedders"]' }),
    );
    expect(result).toEqual(presented(page, "Update embedders", "sdk_method"));
  });

  it("lists the matching pages when one SDK method hits several routes", async () => {
    const ctx = fakeContext();
    ctx.meili.routes.search.mockResolvedValueOnce(empty()).mockResolvedValueOnce({
      hits: [
        { title: "Update embedders", page: "reference/api/embedders/update-embedders", content: "Update" },
        { title: "Reset embedders", page: "reference/api/embedders/reset-embedders", content: "Reset" },
      ],
      processingTimeMs: 2,
    });
    const tool = createApiRouteTool(ctx);

    const result = await tool.execute({ route: "updateEmbedders" }, call());

    expect(result).toEqual({
      matches: [
        {
          title: "Update embedders",
          page: "reference/api/embedders/update-embedders",
          url: "/reference/api/embedders/update-embedders",
        },
        {
          title: "Reset embedders",
          page: "reference/api/embedders/reset-embedders",
          url: "/reference/api/embedders/reset-embedders",
        },
      ],
      hint: "Several routes match this SDK method. Call get_api_route again with the method and path (the title or page).",
    });
    expect(ctx.meili.routes.search).toHaveBeenCalledTimes(2);
  });

  it("loads a semantically similar page when the route is not a method", async () => {
    const ctx = fakeContext({ user: { codeLanguage: "JS" } });
    const page = "reference/api/search/search-with-post";
    ctx.meili.routes.search
      .mockResolvedValueOnce(empty())
      .mockResolvedValueOnce({ hits: [{ page }], processingTimeMs: 2 })
      .mockResolvedValueOnce({ hits: routePage(page, "Search with POST"), processingTimeMs: 3 });
    const tool = createApiRouteTool(ctx);

    const result = await tool.execute({ route: "search-with-post" }, call());

    expect(ctx.meili.routes.search).toHaveBeenNthCalledWith(2, "search-with-post", {
      limit: 5,
      hybrid: { embedder: "voyage", semanticRatio: 0.5 },
      attributesToRetrieve: ["page"],
      showPerformanceDetails: true,
    });
    expect(ctx.meili.routes.search).toHaveBeenNthCalledWith(
      3,
      "",
      expect.objectContaining({ filter: 'page = "reference/api/search/search-with-post"' }),
    );
    expect(result).toEqual(presented(page, "Search with POST", "similar"));
  });

  it("returns an error when nothing matches the route", async () => {
    const ctx = fakeContext();
    ctx.meili.routes.search.mockResolvedValue(empty());
    const tool = createApiRouteTool(ctx);

    const result = await tool.execute({ route: "missing-route" }, call());

    expect(result).toEqual({ error: 'No API route found for "missing-route".' });
    expect(ctx.meili.routes.search).toHaveBeenCalledTimes(2);
  });
});
