import { describe, expect, it } from "vitest";
import { createAgentContext, rememberRead } from "../state.ts";
import { fakeContext, testConfig, testUser } from "./fakes.ts";

describe("createAgentContext", () => {
  it("throws when Meilisearch is not configured", () => {
    const user = { codeLanguage: null };

    expect(() => createAgentContext({ ...testConfig, meiliUrl: undefined }, user, 0)).toThrow("Chat is not configured");
    expect(() => createAgentContext({ ...testConfig, meiliKey: undefined }, user, 0)).toThrow("Chat is not configured");
  });

  it("returns the configured indexes and an empty pool", () => {
    const ctx = createAgentContext(testConfig, testUser, 25);

    expect(ctx.meili.docs.uid).toBe(testConfig.docsIndex);
    expect(ctx.meili.routes.uid).toBe(testConfig.routesIndex);
    expect(ctx.meili.changelog.uid).toBe(testConfig.changelogIndex);
    expect(ctx.pool.seenChunks).toEqual(new Set());
    expect(ctx.user).toEqual(testUser);
    expect(ctx.config).toBe(testConfig);
    expect(ctx.started).toBe(25);
    expect(ctx.answer).toEqual({ text: "" });
    expect(ctx.details.searches).toEqual([]);
    expect(ctx.identity).toEqual({ trigger: "submit-message" });
  });
});

describe("rememberRead", () => {
  it("stores the bytes, page, matched value, and opened page from the result", () => {
    const ctx = fakeContext();
    const body = { page: "reference/api/search", matched: "exact", markdown: "Parameters" };
    const spans = [{ ms: 8, processingMs: 3, inFlight: 1 }];

    rememberRead(ctx, "call-1", "get_api_route", "POST /indexes/{index_uid}/search", body, spans);

    expect(ctx.details.reads.get("call-1")).toEqual({
      bytes: new TextEncoder().encode(JSON.stringify(body)).length,
      page: "reference/api/search",
      matched: "exact",
      meili: { ms: 8, processingMs: 3, waitMs: 5, inFlight: 1, traces: [undefined] },
    });
    expect(ctx.details.opened).toEqual([
      { tool: "get_api_route", arg: "POST /indexes/{index_uid}/search", page: "reference/api/search" },
    ]);
  });

  it("records the expand_page argument as the opened page", () => {
    const ctx = fakeContext();
    const found = { page: "changelog/v1.58", matched: "exact", markdown: "notes" };
    const missing = { error: "missing" };

    rememberRead(ctx, "with-page", "expand_page", "v1.58", found, []);
    rememberRead(ctx, "without-page", "expand_page", "changelog/missing", missing, []);

    expect(ctx.details.opened).toEqual([
      { tool: "expand_page", arg: "v1.58", page: "v1.58" },
      { tool: "expand_page", arg: "changelog/missing", page: "changelog/missing" },
    ]);
    expect(ctx.details.reads.get("with-page")).toMatchObject({
      bytes: new TextEncoder().encode(JSON.stringify(found)).length,
      page: "changelog/v1.58",
      matched: "exact",
    });
    expect(ctx.details.reads.get("without-page")).toMatchObject({
      bytes: new TextEncoder().encode(JSON.stringify(missing)).length,
      page: "changelog/missing",
    });
    expect(ctx.details.reads.get("without-page")?.matched).toBeUndefined();
  });
});
