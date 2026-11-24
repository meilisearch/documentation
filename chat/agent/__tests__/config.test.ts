import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_MODEL, DEFAULT_QUERY_MODEL, missingSettings, readConfig } from "../config.ts";

const ORIGINAL = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL };
});

describe("readConfig", () => {
  it("reads settings from the env it is given, not from the process", () => {
    process.env.CHAT_MODEL = "from-process";
    const config = readConfig({
      OPENROUTER_API_KEY: "router",
      MEILISEARCH_URL: "http://meili.test",
      MEILISEARCH_KEY: "key",
      VOYAGE_API_KEY: "voyage",
      CHAT_MODEL: "model",
      CHAT_QUERY_MODEL: "query",
      CHAT_ALLOWED_ORIGINS: " example.com , *.example.com ",
      MEILISEARCH_DOCS_INDEX: "docs",
      MEILISEARCH_ROUTES_INDEX: "routes",
      MEILISEARCH_CHANGELOG_INDEX: "changelog",
      MEILISEARCH_EMBEDDER: "embed",
    });

    expect(config).toEqual({
      openrouterKey: "router",
      meiliUrl: "http://meili.test",
      meiliKey: "key",
      voyageKey: "voyage",
      model: "model",
      queryModel: "query",
      allowedOrigins: ["example.com", "*.example.com"],
      docsIndex: "docs",
      routesIndex: "routes",
      changelogIndex: "changelog",
      embedder: "embed",
    });
  });

  it("falls back when optional values are empty", () => {
    const config = readConfig({
      CHAT_MODEL: "",
      CHAT_QUERY_MODEL: "",
      CHAT_ALLOWED_ORIGINS: "",
      MEILISEARCH_DOCS_INDEX: "",
      MEILISEARCH_ROUTES_INDEX: "",
      MEILISEARCH_CHANGELOG_INDEX: "",
      MEILISEARCH_EMBEDDER: "",
    });

    expect(config.model).toBe(DEFAULT_MODEL);
    expect(config.queryModel).toBe(DEFAULT_QUERY_MODEL);
    expect(config.allowedOrigins).toEqual(["meilisearch.com", "*.meilisearch.com", "*.mintlify.site"]);
    expect(config.docsIndex).toBe("docs-chunks");
    expect(config.routesIndex).toBe("api-routes");
    expect(config.changelogIndex).toBe("changelog-chunks");
    expect(config.embedder).toBe("voyage");
  });
});

describe("missingSettings", () => {
  it("names only the required variables that are unset", () => {
    expect(missingSettings({})).toEqual([
      "OPENROUTER_API_KEY",
      "MEILISEARCH_URL",
      "MEILISEARCH_KEY",
      "VOYAGE_API_KEY",
    ]);
    expect(
      missingSettings({
        OPENROUTER_API_KEY: "router",
        MEILISEARCH_URL: "http://meili.test",
        MEILISEARCH_KEY: "key",
        VOYAGE_API_KEY: "voyage",
      }),
    ).toEqual([]);
  });
});
