import { describe, expect, it, vi } from "vitest";
import { MeilisearchApiError } from "meilisearch";
import { createListReleasesTool } from "../list-releases.ts";
import { fakeContext, missingIndex } from "../../__tests__/fakes.ts";

function call(toolCallId = "call-1") {
  return { toolCallId, messages: [], abortSignal: undefined, context: {} as Record<string, unknown> };
}

function run(ctx: ReturnType<typeof fakeContext>, toolCallId = "call-1") {
  const tool = createListReleasesTool(ctx);
  return tool.execute({}, call(toolCallId));
}

describe("createListReleasesTool", () => {
  it("groups changelog hits newest first and remembers the releases", async () => {
    const ctx = fakeContext();
    ctx.meili.changelog.search.mockResolvedValue({
      hits: [
        { page: "changelog/v1.57", version_label: "v1.57", released_on: "2026-10-01" },
        { page: "changelog/v1.58", version_label: "v1.58", released_on: "2026-11-23" },
        { page: "changelog/v1.58", version_label: "v1.58", released_on: "2026-11-23" },
      ],
      processingTimeMs: 3,
    });

    const result = await run(ctx);

    expect(ctx.meili.changelog.search).toHaveBeenCalledWith("", {
      sort: ["released_on:desc"],
      limit: 1000,
      attributesToRetrieve: ["page", "version_label", "released_on"],
      showPerformanceDetails: true,
    });
    expect(result).toEqual({
      releases: [
        { version: "v1.58", released_on: "2026-11-23", url: "/changelog/v1.58" },
        { version: "v1.57", released_on: "2026-10-01", url: "/changelog/v1.57" },
      ],
    });
    expect(ctx.pool.cited("[new](/changelog/v1.58) [old](/changelog/v1.57)")).toEqual([
      { title: "Meilisearch v1.58 release notes", href: "/changelog/v1.58", breadcrumb: "Changelog" },
      { title: "Meilisearch v1.57 release notes", href: "/changelog/v1.57", breadcrumb: "Changelog" },
    ]);
    expect(ctx.details.releaseLists.get("call-1")).toMatchObject({ count: 2, oldest: "2026-10-01" });
  });

  it("returns no releases and still records the detail when the changelog index is missing", async () => {
    const ctx = fakeContext();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    ctx.meili.changelog.search.mockRejectedValue(missingIndex());

    const result = await run(ctx);

    expect(result).toEqual({ releases: [] });
    expect(ctx.details.releaseLists.get("call-1")).toMatchObject({
      count: 0,
      bytes: new TextEncoder().encode(JSON.stringify({ releases: [] })).length,
      meili: { ms: 0, processingMs: 0, waitMs: 0, inFlight: 0, traces: [] },
    });
    expect(ctx.details.releaseLists.get("call-1")?.oldest).toBeUndefined();
    expect(ctx.pool.cited("[notes](/changelog/v1.58)")).toEqual([]);
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
    ctx.meili.changelog.search.mockRejectedValue(error);

    await expect(run(ctx)).rejects.toBe(error);
    expect(ctx.details.releaseLists.size).toBe(0);
  });
});
