import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Meilisearch } from "meilisearch";
import { MeilisearchSink, buildSettings } from "../sinks/meilisearch.ts";
import type { Chunk } from "../types.ts";

function chunk(page: string, pageHash: string, index: number): Chunk {
  return {
    id: `${page}-${index}`,
    page,
    page_hash: pageHash,
    url: `https://example.com/${page}`,
    anchor: null,
    title: page,
    description: "",
    tab: "Docs",
    group: "",
    hierarchy: [page],
    breadcrumb: page,
    content: `Content ${index} of ${page}`,
    content_type: "prose",
    chunk_index: index,
  };
}

describe("buildSettings", () => {
  it("configures a Voyage REST embedder when an embedder is given", () => {
    const settings = buildSettings("docs", { name: "voyage", model: "voyage-3.5", apiKey: "secret", documentTemplateMaxBytes: 4000 });

    expect(settings).toEqual({
      filterableAttributes: ["page", "tab", "group", "content_type", "code_language"],
      searchableAttributes: ["title", "hierarchy", "description", "content", "codes"],
      sortableAttributes: ["chunk_index"],
      embedders: {
        voyage: {
          source: "rest",
          apiKey: "secret",
          url: "https://api.voyageai.com/v1/embeddings",
          request: { model: "voyage-3.5", input: ["{{text}}", "{{..}}"] },
          response: { data: [{ embedding: "{{embedding}}" }, "{{..}}"] },
          documentTemplate: "{{doc.breadcrumb}}\n{{doc.content}}",
          documentTemplateMaxBytes: 4000,
        },
      },
    });
  });

  it("keeps route identifiers exact by disabling typos on lookup keys", () => {
    const settings = buildSettings("routes");

    expect(settings.filterableAttributes).toEqual(["page", "lookup_keys"]);
    expect(settings.searchableAttributes).toEqual(["title", "content", "lookup_keys"]);
    expect(settings.sortableAttributes).toEqual(["chunk_index"]);
    expect(settings.typoTolerance).toEqual({ disableOnAttributes: ["lookup_keys"] });
  });
});

describe.skipIf(!process.env.MEILI_TEST_URL)("MeilisearchSink", () => {
  let client: Meilisearch;
  let indexUid: string;

  beforeAll(() => {
    client = new Meilisearch({ host: process.env.MEILI_TEST_URL!, apiKey: process.env.MEILI_TEST_KEY });
  });

  beforeEach(() => {
    indexUid = `ingest-test-${crypto.randomUUID()}`;
  });

  afterEach(async () => {
    await client.deleteIndex(indexUid).waitTask();
  });

  function sink(): MeilisearchSink {
    return new MeilisearchSink({ client, indexUid, embedder: null });
  }

  it("returns no hashes when the index does not exist", async () => {
    expect(await sink().existingHashes()).toEqual(new Map());
  });

  it("creates the index with filterable chunk attributes", async () => {
    await sink().ensureSettings();

    const index = await client.getIndex(indexUid);
    expect(index.primaryKey).toBe("id");
    const settings = await index.getSettings();
    expect(settings.filterableAttributes).toEqual(["page", "tab", "group", "content_type", "code_language"]);
    expect(settings.searchableAttributes).toEqual(["title", "hierarchy", "description", "content", "codes"]);
    expect(settings.sortableAttributes).toEqual(["chunk_index"]);
  });

  it("stores chunks and reads back the hash of each page", async () => {
    const target = sink();
    await target.ensureSettings();

    await target.apply({
      deletePages: [],
      chunks: [chunk("a", "hash-a1", 0), chunk("a", "hash-a1", 1), chunk("b", "hash-b1", 0)],
    });

    expect(await target.existingHashes()).toEqual(
      new Map([
        ["a", "hash-a1"],
        ["b", "hash-b1"],
      ]),
    );
  });

  it("replaces every chunk of an updated page and leaves other pages untouched", async () => {
    const target = sink();
    await target.ensureSettings();
    await target.apply({
      deletePages: [],
      chunks: [chunk("a", "hash-a1", 0), chunk("a", "hash-a1", 1), chunk("a", "hash-a1", 2), chunk("b", "hash-b1", 0)],
    });

    await target.apply({ deletePages: ["a"], chunks: [chunk("a", "hash-a2", 5)] });

    expect(await target.existingHashes()).toEqual(
      new Map([
        ["a", "hash-a2"],
        ["b", "hash-b1"],
      ]),
    );
    const documents = await client.index(indexUid).getDocuments({ fields: ["id"], limit: 10 });
    expect(documents.results.map((document) => document.id).sort()).toEqual(["a-5", "b-0"]);
  });

  it("removes a deleted page when no new chunks are given", async () => {
    const target = sink();
    await target.ensureSettings();
    await target.apply({ deletePages: [], chunks: [chunk("a", "hash-a1", 0), chunk("b", "hash-b1", 0)] });

    await target.apply({ deletePages: ["b"], chunks: [] });

    expect(await target.existingHashes()).toEqual(new Map([["a", "hash-a1"]]));
  });

  it("does nothing when there is nothing to delete or add", async () => {
    await sink().apply({ deletePages: [], chunks: [] });

    await expect(client.getIndex(indexUid)).rejects.toMatchObject({ cause: { code: "index_not_found" } });
  });

  it("deletes pages whose names contain quotes and backslashes", async () => {
    const target = sink();
    await target.ensureSettings();
    const tricky = 'say "hi" \\ bye';
    await target.apply({ deletePages: [], chunks: [{ ...chunk(tricky, "hash-t1", 0), id: "tricky-0" }, chunk("a", "hash-a1", 0)] });

    await target.apply({ deletePages: [tricky], chunks: [] });

    expect(await target.existingHashes()).toEqual(new Map([["a", "hash-a1"]]));
  });

  it("reads the hashes of every page when there are more than 1000 chunks", async () => {
    const target = sink();
    await target.ensureSettings();
    const chunks = Array.from({ length: 1200 }, (_, i) => chunk(`page-${i}`, `hash-${i}`, 0));

    await target.apply({ deletePages: [], chunks });

    const hashes = await target.existingHashes();
    expect(hashes.size).toBe(1200);
    expect(hashes.get("page-1199")).toBe("hash-1199");
  });

  it("deletes more than 100 pages at once", async () => {
    const target = sink();
    await target.ensureSettings();
    const pages = Array.from({ length: 150 }, (_, i) => `page-${i}`);
    await target.apply({ deletePages: [], chunks: [...pages.map((page) => chunk(page, "old", 0)), chunk("kept", "hash-k1", 0)] });

    await target.apply({ deletePages: pages, chunks: [] });

    expect(await target.existingHashes()).toEqual(new Map([["kept", "hash-k1"]]));
  });

  it("rejects with the task uid and Meilisearch error when a task fails", async () => {
    const target = sink();
    await target.ensureSettings();

    await expect(target.apply({ deletePages: [], chunks: [{ ...chunk("a", "hash-a1", 0), id: "bad id!" }] })).rejects.toThrow(
      /Meilisearch task \d+ failed: .*bad id!/,
    );
  });

  it("adds chunks in batches of batchSize, keeping batches enqueued before a failing one", async () => {
    const target = new MeilisearchSink({ client, indexUid, embedder: null, batchSize: 2 });
    await target.ensureSettings();

    await expect(
      target.apply({
        deletePages: [],
        chunks: [chunk("a", "hash-a1", 0), chunk("b", "hash-b1", 0), { ...chunk("c", "hash-c1", 0), id: "bad id!" }],
      }),
    ).rejects.toThrow(/Meilisearch task \d+ failed/);

    expect(await target.existingHashes()).toEqual(
      new Map([
        ["a", "hash-a1"],
        ["b", "hash-b1"],
      ]),
    );
  });

  it("explains missing admin permissions when the key can only search", async () => {
    const key = await client.createKey({ actions: ["search"], indexes: ["*"], expiresAt: null });
    try {
      const searchOnlyClient = new Meilisearch({ host: process.env.MEILI_TEST_URL!, apiKey: key.key });
      const target = new MeilisearchSink({ client: searchOnlyClient, indexUid, embedder: null });

      await expect(target.ensureSettings()).rejects.toThrow(
        "MEILISEARCH_API_KEY lacks admin permissions (needs indexes.create, settings.update, documents.*, tasks.get)",
      );
    } finally {
      await client.deleteKey(key.key);
    }
  });
});
