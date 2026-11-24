import { describe, expect, it } from "vitest";
import {
  fenceLanguage,
  languageName,
  lookupCandidates,
  methodCandidates,
  normalizeLanguage,
  quoteFilter,
  selectSample,
} from "../samples.ts";

describe("normalizeLanguage", () => {
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
    }
    expect(normalizeLanguage(null)).toBe("http");
    expect(normalizeLanguage(undefined)).toBe("http");
    expect(normalizeLanguage("  ")).toBe("http");
  });

  it("keeps an unknown label as a slug and falls back when nothing remains", () => {
    expect(normalizeLanguage("Kotlin")).toBe("kotlin");
    expect(normalizeLanguage("---")).toBe("http");
  });
});

describe("selectSample", () => {
  it("falls back to the HTTP sample and says which language was missing", () => {
    const codes = { http: "curl search", js: "client.search()" };
    expect(selectSample(codes, "Python")).toEqual({
      language: "http",
      code: "curl search",
      note: "No Python sample for this route. Showing the HTTP request.",
    });
    expect(selectSample(codes, "JS")).toEqual({ language: "js", code: "client.search()", note: null });
    expect(selectSample(codes, null)).toEqual({ language: "http", code: "curl search", note: null });
  });

  it("returns an empty HTTP sample when the route has no code", () => {
    expect(selectSample(undefined, "JS")).toEqual({
      language: "http",
      code: "",
      note: "No JavaScript sample for this route. Showing the HTTP request.",
    });
  });
});

describe("lookupCandidates", () => {
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

  it("keeps a value that looks like a URL but does not parse", () => {
    expect(lookupCandidates("http://[")).toEqual(["http://["]);
  });
});

describe("methodCandidates", () => {
  it("extracts the last SDK method name and ignores paths, slugs, and URLs", () => {
    expect(methodCandidates("updateEmbedders")).toEqual(["updateEmbedders"]);
    expect(methodCandidates("update_embedders")).toEqual(["update_embedders"]);
    expect(methodCandidates("updateEmbedders()")).toEqual(["updateEmbedders"]);
    expect(methodCandidates("SearchAsync<Movie>()")).toEqual(["SearchAsync"]);
    expect(methodCandidates("client.index('m').updateEmbedders()")).toEqual(["updateEmbedders"]);
    expect(methodCandidates("$client->index('movies')->search('q')")).toEqual(["search"]);
    expect(methodCandidates('client.index("movies").SearchAsync<Movie>("American ninja")')).toEqual(["SearchAsync"]);
    expect(methodCandidates("POST /indexes/{index_uid}/search")).toEqual([]);
    expect(methodCandidates("search-with-post")).toEqual([]);
    expect(methodCandidates("https://www.meilisearch.com/docs/reference/api/search/search-with-post")).toEqual([]);
    expect(methodCandidates("")).toEqual([]);
    expect(methodCandidates("   ")).toEqual([]);
  });

  it("strips a trailing call whose arguments contain dots and quotes", () => {
    expect(methodCandidates(`client.index("a.b").updateEmbedders("x.y")`)).toEqual(["updateEmbedders"]);
    expect(methodCandidates("client.updateEmbedders('say \\'hi\\'')")).toEqual(["updateEmbedders"]);
  });

  it("ignores a method that is not an identifier", () => {
    expect(methodCandidates("client.123bad()")).toEqual([]);
  });
});

describe("fenceLanguage and filters", () => {
  it("maps http and cli fences to bash and leaves other languages alone", () => {
    expect(fenceLanguage("http")).toBe("bash");
    expect(fenceLanguage("cli")).toBe("bash");
    expect(fenceLanguage("js")).toBe("javascript");
    expect(fenceLanguage("python")).toBe("python");
  });

  it("names a known language and title-cases an unknown one", () => {
    expect(languageName("csharp")).toBe("C#");
    expect(languageName("kotlin")).toBe("Kotlin");
  });

  it("escapes quotes and backslashes in filter values", () => {
    expect(quoteFilter('say "hi" \\ bye')).toBe('"say \\"hi\\" \\\\ bye"');
  });
});
