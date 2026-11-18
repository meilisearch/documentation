import { describe, expect, it } from "vitest";
import { resolveMeilisearchConfig, type UserConfig } from "../config.ts";

const required = {
  MEILISEARCH_URL: "https://example.meilisearch.io",
  MEILISEARCH_API_KEY: "key",
  VOYAGE_API_KEY: "voyage",
};

const fromFile: UserConfig = {
  meilisearch: {
    indexUid: "from-file",
    routesIndexUid: "routes-file",
    embedder: { name: "embed-file", model: "voyage-4" },
  },
};

describe("resolveMeilisearchConfig", () => {
  it("lets env vars override the config file", () => {
    const config = resolveMeilisearchConfig(fromFile, {
      ...required,
      MEILISEARCH_DOCS_INDEX: "docs-env",
      MEILISEARCH_ROUTES_INDEX: "routes-env",
      MEILISEARCH_EMBEDDER: "embed-env",
    });
    expect(config.indexUid).toBe("docs-env");
    expect(config.routesIndexUid).toBe("routes-env");
    expect(config.embedder.name).toBe("embed-env");
    expect(config.embedder.model).toBe("voyage-4");
  });

  it("uses the config file when the env vars are empty", () => {
    const config = resolveMeilisearchConfig(fromFile, {
      ...required,
      MEILISEARCH_DOCS_INDEX: "",
      MEILISEARCH_ROUTES_INDEX: "",
      MEILISEARCH_EMBEDDER: "",
    });
    expect(config.indexUid).toBe("from-file");
    expect(config.routesIndexUid).toBe("routes-file");
    expect(config.embedder.name).toBe("embed-file");
  });

  it("falls back to the defaults", () => {
    const config = resolveMeilisearchConfig({}, required);
    expect(config.indexUid).toBe("docs-chunks");
    expect(config.routesIndexUid).toBe("api-routes");
    expect(config.embedder.name).toBe("voyage");
    expect(config.embedder.model).toBe("voyage-4");
  });
});
