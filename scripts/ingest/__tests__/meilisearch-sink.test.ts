import { describe, expect, it } from "vitest";
import { buildSettings } from "../sinks/meilisearch.ts";

describe("buildSettings", () => {
  it("configures a Voyage REST embedder when an embedder is given", () => {
    const settings = buildSettings("docs", { name: "voyage", model: "voyage-3.5", apiKey: "secret", documentTemplateMaxBytes: 4000 });

    expect(settings).toEqual({
      filterableAttributes: ["page", "tab", "group", "content_type", "code_language"],
      searchableAttributes: ["title", "hierarchy", "description", "content", "code_text"],
      sortableAttributes: ["chunk_index"],
      embedders: {
        voyage: {
          source: "rest",
          apiKey: "secret",
          url: "https://api.voyageai.com/v1/embeddings",
          request: { model: "voyage-3.5", input: ["{{text}}", "{{..}}"] },
          response: { data: [{ embedding: "{{embedding}}" }, "{{..}}"] },
          documentTemplate: "{{doc.breadcrumb}}\n{{doc.content}}{% if doc.code_text %}\n{{doc.code_text}}{% endif %}",
          documentTemplateMaxBytes: 8000,
        },
      },
    });
  });

  it("keeps route identifiers and SDK method names exact by disabling typos on them", () => {
    const settings = buildSettings("routes");

    expect(settings.filterableAttributes).toEqual(["page", "lookup_keys", "sdk_methods"]);
    expect(settings.searchableAttributes).toEqual(["title", "content", "sdk_methods", "lookup_keys"]);
    expect(settings.sortableAttributes).toEqual(["chunk_index"]);
    expect(settings.typoTolerance).toEqual({ disableOnAttributes: ["lookup_keys", "sdk_methods"] });
  });

  it("ranks changelog releases by date and keeps version numbers exact", () => {
    const settings = buildSettings("changelog", {
      name: "voyage",
      model: "voyage-4",
      apiKey: "secret",
      documentTemplateMaxBytes: 4000,
    });

    expect(settings.searchableAttributes).toEqual(["version_label", "title", "hierarchy", "description", "content"]);
    expect(settings.filterableAttributes).toEqual(["page", "release_section", "content_type"]);
    expect(settings.sortableAttributes).toEqual(["released_on", "chunk_index"]);
    expect(settings.rankingRules).toEqual([
      "words",
      "typo",
      "proximity",
      "attributeRank",
      "sort",
      "wordPosition",
      "exactness",
      "released_on:desc",
    ]);
    expect(settings.typoTolerance).toEqual({ disableOnNumbers: true });
    expect(settings.embedders?.voyage).toMatchObject({
      documentTemplate: "{{doc.version_label}} — released {{doc.released_on}}. {{doc.breadcrumb}}\n{{doc.content}}",
      documentTemplateMaxBytes: 8000,
    });
  });
});
