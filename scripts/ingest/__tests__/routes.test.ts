import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { normalizeLanguage as chatNormalize, lookupCandidates, selectSample as chatSelect } from "../../../chat/src/samples.ts";
import { chunkRoute } from "../chunk/route-chunker.ts";
import { PROJECT_ROOT, DEFAULT_CHUNKING } from "../config.ts";
import { normalizeLanguage, selectSample } from "../languages.ts";
import { loadApiRoutes } from "../sources/openapi.ts";

const FIXTURE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../__fixtures__/docs");
const BASE_URL = "https://www.meilisearch.com/docs";

describe("language selection", () => {
  it("normalizes Mintlify labels and snippet fence labels to the same key", () => {
    for (const [label, key] of [
      ["HTTP request", "http"],
      ["cURL", "http"],
      ["Meili CLI", "cli"],
      ["CLI", "cli"],
      ["JS", "js"],
      ["C#", "csharp"],
      ["Python", "python"],
    ] as const) {
      expect(normalizeLanguage(label)).toBe(key);
      expect(chatNormalize(label)).toBe(key);
    }
    expect(normalizeLanguage(null)).toBe("http");
    expect(chatNormalize(undefined)).toBe("http");
  });

  it("falls back to the HTTP sample and says which language was missing", () => {
    const codes = { http: "curl search", js: "client.search()" };
    expect(selectSample(codes, "Python")).toEqual({
      language: "http",
      code: "curl search",
      note: "No Python sample for this route. Showing the HTTP request.",
    });
    expect(chatSelect(codes, "JS")).toEqual({ language: "js", code: "client.search()", note: null });
    expect(selectSample(codes, null)).toEqual({ language: "http", code: "curl search", note: null });
  });

  it("turns a docs URL, a site path, and a method path into lookup keys", () => {
    expect(lookupCandidates("https://www.meilisearch.com/docs/reference/api/search/search-with-post#body-q")).toEqual(
      expect.arrayContaining([
        "https://www.meilisearch.com/docs/reference/api/search/search-with-post",
        "/docs/reference/api/search/search-with-post",
        "/reference/api/search/search-with-post",
        "reference/api/search/search-with-post",
      ]),
    );
    expect(lookupCandidates("POST /indexes/{index_uid}/search")).toEqual(["POST /indexes/{index_uid}/search"]);
    expect(lookupCandidates("search-with-post")).toEqual(["search-with-post"]);
  });
});

describe("API route chunks", () => {
  it("renders the fixture route with its response example and lookup keys", async () => {
    const [route] = await loadApiRoutes({
      rootDir: FIXTURE_DIR,
      navigation: "navigation.json",
      baseUrl: BASE_URL,
      chunking: DEFAULT_CHUNKING,
    });

    expect(route.page).toBe("reference/api/indexes/list-indexes");
    expect(route.lookupKeys).toEqual([
      "GET /indexes",
      "reference/api/indexes/list-indexes",
      "list-indexes",
      "/reference/api/indexes/list-indexes",
      "https://www.meilisearch.com/docs/reference/api/indexes/list-indexes",
    ]);
    expect(route.parts.join("\n\n")).toContain('"results"');
    expect(route.parts.join("\n\n")).not.toContain("ResponseError");
    expect(route.codes).toEqual({ http: "curl -X GET 'MEILISEARCH_URL/indexes'" });

    const chunks = chunkRoute(route, BASE_URL);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toMatchObject({
      content_type: "api_route",
      url: "https://www.meilisearch.com/docs/reference/api/indexes/list-indexes",
      codes: route.codes,
      code_language: ["http"],
    });
  });

  it("splits the large search route and keeps only the languages that route has", async () => {
    const routes = await loadApiRoutes({
      rootDir: PROJECT_ROOT,
      navigation: "config/navigation.json",
      baseUrl: BASE_URL,
      chunking: DEFAULT_CHUNKING,
      only: ["reference/api/search/*"],
    });
    const get = routes.find((route) => route.method === "GET" && route.path === "/indexes/{index_uid}/search");
    const post = routes.find((route) => route.method === "POST" && route.path === "/indexes/{index_uid}/search");
    expect(get).toBeDefined();
    expect(post).toBeDefined();

    expect(Object.keys(get!.codes)).toEqual(["http", "cli", "js", "dart"]);
    expect(Object.keys(post!.codes).length).toBeGreaterThan(4);
    expect(get!.parts.length).toBeGreaterThan(1);
    expect(get!.parts.every((part) => part.startsWith("GET /indexes/{index_uid}/search"))).toBe(true);
    expect(get!.parts.every((part) => part.length <= DEFAULT_CHUNKING.maxChars)).toBe(true);

    const joined = get!.parts.join("\n\n");
    expect(joined).toContain("`filter`");
    expect(joined).toContain('"hits"');
    expect(joined).not.toContain("missing_authorization_header");

    const chunks = chunkRoute(get!, BASE_URL);
    expect(chunks[0].codes).toEqual(get!.codes);
    expect(chunks[1].codes).toBeUndefined();
    expect(chunks.every((chunk) => chunk.lookup_keys?.includes("search-with-get"))).toBe(true);
  });
});
