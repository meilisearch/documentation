import { describe, expect, it } from "vitest";
import { chunkPage } from "../chunk/mdx-chunker.ts";
import type { ChunkingConfig, RawPage } from "../types.ts";

const BASE_URL = "https://www.meilisearch.com/docs";

const chunking: ChunkingConfig = {
  splitDepth: 3,
  maxChars: 2000,
  minChars: 0,
  overlapChars: 0,
};

function makePage(body: string, overrides: Partial<RawPage> = {}): RawPage {
  return {
    page: "capabilities/personalization/overview",
    tab: "Capabilities",
    group: "Personalization",
    frontmatter: { title: "Personalization", description: "Tailor results to users." },
    body,
    pageHash: "hash-123",
    ...overrides,
  };
}

describe("chunkPage", () => {
  it("turns a page with only prose into a single chunk carrying page metadata", () => {
    const page = makePage("Meilisearch can **personalize** results.\n\nIt uses user context.\n");

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(chunks).toEqual([
      {
        id: "capabilities__personalization__overview-0",
        page: "capabilities/personalization/overview",
        page_hash: "hash-123",
        url: "https://www.meilisearch.com/docs/capabilities/personalization/overview",
        anchor: null,
        title: "Personalization",
        description: "Tailor results to users.",
        tab: "Capabilities",
        group: "Personalization",
        hierarchy: ["Personalization"],
        breadcrumb: "Capabilities > Personalization > Personalization",
        content: "Meilisearch can **personalize** results.\n\nIt uses user context.",
        content_type: "prose",
        chunk_index: 0,
      },
    ]);
  });

  it("splits a page into one chunk per h2 section and keeps h4 headings inside the content", () => {
    const page = makePage(
      [
        "Intro text.",
        "## Getting started",
        "Install the SDK.",
        "#### Requirements",
        "Node 20.",
        "## Configure ranking",
        "Set ranking rules.",
      ].join("\n\n"),
    );

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(
      chunks.map(({ id, chunk_index, anchor, url, hierarchy, breadcrumb, content }) => ({
        id,
        chunk_index,
        anchor,
        url,
        hierarchy,
        breadcrumb,
        content,
      })),
    ).toEqual([
      {
        id: "capabilities__personalization__overview-0",
        chunk_index: 0,
        anchor: null,
        url: "https://www.meilisearch.com/docs/capabilities/personalization/overview",
        hierarchy: ["Personalization"],
        breadcrumb: "Capabilities > Personalization > Personalization",
        content: "Intro text.",
      },
      {
        id: "capabilities__personalization__overview-1",
        chunk_index: 1,
        anchor: "getting-started",
        url: "https://www.meilisearch.com/docs/capabilities/personalization/overview#getting-started",
        hierarchy: ["Personalization", "Getting started"],
        breadcrumb: "Capabilities > Personalization > Personalization > Getting started",
        content: "Install the SDK.\n\n#### Requirements\n\nNode 20.",
      },
      {
        id: "capabilities__personalization__overview-2",
        chunk_index: 2,
        anchor: "configure-ranking",
        url: "https://www.meilisearch.com/docs/capabilities/personalization/overview#configure-ranking",
        hierarchy: ["Personalization", "Configure ranking"],
        breadcrumb: "Capabilities > Personalization > Personalization > Configure ranking",
        content: "Set ranking rules.",
      },
    ]);
  });

  it("nests h3 sections under their h2 and drops sections without content of their own", () => {
    const page = makePage(
      [
        "## Search modes",
        "### Keyword search",
        "Matches words.",
        "### Semantic search",
        "Matches meaning.",
        "## Limits",
        "Ten indexes.",
      ].join("\n\n"),
    );

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(chunks.map(({ hierarchy, anchor, content }) => ({ hierarchy, anchor, content }))).toEqual([
      {
        hierarchy: ["Personalization", "Search modes", "Keyword search"],
        anchor: "keyword-search",
        content: "Matches words.",
      },
      {
        hierarchy: ["Personalization", "Search modes", "Semantic search"],
        anchor: "semantic-search",
        content: "Matches meaning.",
      },
      {
        hierarchy: ["Personalization", "Limits"],
        anchor: "limits",
        content: "Ten indexes.",
      },
    ]);
  });

  it("gives duplicate headings distinct anchors the way Mintlify does", () => {
    const page = makePage(
      ["## Movies", "### Example", "First example.", "## Books", "### Example", "Second example."].join("\n\n"),
    );

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(chunks.map(({ anchor, url }) => ({ anchor, url }))).toEqual([
      {
        anchor: "example",
        url: "https://www.meilisearch.com/docs/capabilities/personalization/overview#example",
      },
      {
        anchor: "example-1",
        url: "https://www.meilisearch.com/docs/capabilities/personalization/overview#example-1",
      },
    ]);
  });

  it("removes imports, exports, expressions, code blocks, definitions, and generated code samples but keeps inline code", () => {
    const page = makePage(
      [
        "import CodeSamplesSearch1 from '/snippets/generated-code-samples/code_samples_search_1.mdx'",
        "export const limit = 20",
        "Call the `search` route.{' '}",
        "```bash\ncurl -X POST 'MEILISEARCH_URL/indexes/movies/search'\n```",
        "<CodeSamplesSearch1 />",
        "{/* editor note */}",
        "[docs]: https://www.meilisearch.com/docs",
        "Results are ranked.",
      ].join("\n\n"),
    );

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(chunks.map(({ content }) => content)).toEqual(["Call the `search` route.\n\nResults are ranked."]);
  });

  it("unwraps components into their text and shows block component titles in bold", () => {
    const page = makePage(
      [
        "<Note>\nPersonalization requires an API key.\n</Note>",
        '<Card title="Hybrid search" href="/capabilities/hybrid_search">\nCombine keyword and semantic search.\n</Card>',
        '<Tip>\nUse **filters** with <Tooltip title="Definition" tip="A filter expression">filter expressions</Tooltip> too.\n</Tip>',
      ].join("\n\n"),
    );

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(chunks.map(({ content }) => content)).toEqual([
      "Personalization requires an API key.\n\n**Hybrid search**\n\nCombine keyword and semantic search.\n\nUse **filters** with filter expressions too.",
    ]);
  });

  it("drops components that only contain code, including their title", () => {
    const page = makePage(
      [
        "Send this request:",
        '<Accordion title="Full example">\n\n```json\n{ "q": "batman" }\n```\n\n</Accordion>',
        "<CodeGroup>\n\n```js\nclient.search('batman')\n```\n\n</CodeGroup>",
        "The response lists hits.",
      ].join("\n\n"),
    );

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(chunks.map(({ content }) => content)).toEqual(["Send this request:\n\nThe response lists hits."]);
  });

  it("keeps link text without URLs and replaces images with their alt text", () => {
    const page = makePage(
      [
        "Read the [ranking guide](/learn/ranking) and the [API reference][api].",
        "![Search results dashboard](/assets/dashboard.png)",
        "![](/assets/decorative.png)",
        "Done.",
        "[api]: /reference/api",
      ].join("\n\n"),
    );

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(chunks.map(({ content }) => content)).toEqual([
      "Read the ranking guide and the API reference.\n\nSearch results dashboard\n\nDone.",
    ]);
  });

  it("replaces image components with their alt text and drops images without one", () => {
    const page = makePage(
      [
        '<Frame>\n  <img src="/assets/ranking.png" alt="Ranking rules diagram" />\n</Frame>',
        '<Image src="/assets/logo.png" />',
        'Click <img src="/assets/icon.png" alt="the gear icon" /> to open settings.',
      ].join("\n\n"),
    );

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(chunks.map(({ content }) => content)).toEqual([
      "Ranking rules diagram\n\nClick the gear icon to open settings.",
    ]);
  });

  it("turns labeled components that wrap headings into a parent heading, like changelog releases", () => {
    const page = makePage(
      [
        '<Update label="v1.56" description="2026-10-26">',
        "## New Features",
        "### Sampled facet counts",
        "Faster facet distribution.",
        "## Bug Fixes",
        "### Quantization state",
        "Fixed after embedder deletion.",
        "</Update>",
        '<Update label="v1.55" description="2026-10-12">',
        "## New Features",
        "### Sampled facet counts",
        "Earlier wording.",
        "</Update>",
      ].join("\n\n"),
      { page: "changelog/changelog", tab: "Changelog", group: "", frontmatter: { title: "Changelog" } },
    );

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(
      chunks.map(({ hierarchy, anchor, breadcrumb, content }) => ({ hierarchy, anchor, breadcrumb, content })),
    ).toEqual([
      {
        hierarchy: ["Changelog", "v1.56", "New Features", "Sampled facet counts"],
        anchor: "sampled-facet-counts",
        breadcrumb: "Changelog > Changelog > v1.56 > New Features > Sampled facet counts",
        content: "Faster facet distribution.",
      },
      {
        hierarchy: ["Changelog", "v1.56", "Bug Fixes", "Quantization state"],
        anchor: "quantization-state",
        breadcrumb: "Changelog > Changelog > v1.56 > Bug Fixes > Quantization state",
        content: "Fixed after embedder deletion.",
      },
      {
        hierarchy: ["Changelog", "v1.55", "New Features", "Sampled facet counts"],
        anchor: "sampled-facet-counts-1",
        breadcrumb: "Changelog > Changelog > v1.55 > New Features > Sampled facet counts",
        content: "Earlier wording.",
      },
    ]);
  });

  it("merges a section shorter than minChars into the previous section", () => {
    const page = makePage(
      [
        "Hi.",
        "## Setup",
        "Install the package with npm.",
        "### Note",
        "Tiny.",
        "## Usage",
        "Call search on the index you created.",
      ].join("\n\n"),
    );

    const chunks = chunkPage(page, { chunking: { ...chunking, minChars: 20 }, baseUrl: BASE_URL });

    expect(chunks.map(({ id, hierarchy, anchor, content }) => ({ id, hierarchy, anchor, content }))).toEqual([
      {
        id: "capabilities__personalization__overview-0",
        hierarchy: ["Personalization"],
        anchor: null,
        content: "Hi.",
      },
      {
        id: "capabilities__personalization__overview-1",
        hierarchy: ["Personalization", "Setup"],
        anchor: "setup",
        content: "Install the package with npm.\n\n### Note\n\nTiny.",
      },
      {
        id: "capabilities__personalization__overview-2",
        hierarchy: ["Personalization", "Usage"],
        anchor: "usage",
        content: "Call search on the index you created.",
      },
    ]);
  });

  it("keeps a small section on its own when merging it would exceed maxChars", () => {
    const page = makePage(["## Setup", "Install the package with npm.", "### Note", "Tiny."].join("\n\n"));

    const chunks = chunkPage(page, {
      chunking: { ...chunking, minChars: 20, maxChars: 40 },
      baseUrl: BASE_URL,
    });

    expect(chunks.map(({ hierarchy, content }) => ({ hierarchy, content }))).toEqual([
      { hierarchy: ["Personalization", "Setup"], content: "Install the package with npm." },
      { hierarchy: ["Personalization", "Setup", "Note"], content: "Tiny." },
    ]);
  });

  // Blocks are packed greedily up to maxChars. Each later part then starts with the last
  // overlapChars characters of the previous part (moved forward to the next word start),
  // followed by a blank line, so a part can exceed maxChars by the overlap.
  it("splits a section longer than maxChars at paragraph boundaries with overlapping context", () => {
    const page = makePage(
      [
        "## Indexes",
        "Meilisearch stores documents in indexes.",
        "Each index has its own settings.",
        "Settings control ranking and filtering.",
      ].join("\n\n"),
    );

    const chunks = chunkPage(page, {
      chunking: { ...chunking, maxChars: 60, overlapChars: 15 },
      baseUrl: BASE_URL,
    });

    expect(
      chunks.map(({ id, chunk_index, hierarchy, anchor, content }) => ({ id, chunk_index, hierarchy, anchor, content })),
    ).toEqual([
      {
        id: "capabilities__personalization__overview-0",
        chunk_index: 0,
        hierarchy: ["Personalization", "Indexes"],
        anchor: "indexes",
        content: "Meilisearch stores documents in indexes.",
      },
      {
        id: "capabilities__personalization__overview-1",
        chunk_index: 1,
        hierarchy: ["Personalization", "Indexes"],
        anchor: "indexes",
        content: "in indexes.\n\nEach index has its own settings.",
      },
      {
        id: "capabilities__personalization__overview-2",
        chunk_index: 2,
        hierarchy: ["Personalization", "Indexes"],
        anchor: "indexes",
        content: "own settings.\n\nSettings control ranking and filtering.",
      },
    ]);
  });

  it("splits a single paragraph longer than maxChars between words", () => {
    const page = makePage("Ranking rules sort documents by relevance before any custom sort is applied.");

    const chunks = chunkPage(page, { chunking: { ...chunking, maxChars: 30 }, baseUrl: BASE_URL });

    expect(chunks.map(({ content }) => content)).toEqual([
      "Ranking rules sort documents",
      "by relevance before any custom",
      "sort is applied.",
    ]);
  });

  it("serializes tables without padding cells to align columns", () => {
    const page = makePage(["| Field | Description |", "| --- | --- |", "| `id` | Primary key of the document |"].join("\n"));

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(chunks[0].content).toBe("| Field | Description |\n| - | - |\n| `id` | Primary key of the document |");
  });

  it("splits a table longer than maxChars between rows", () => {
    const page = makePage(
      ["| Field | Type |", "| --- | --- |", "| `uid` | string |", "| `primaryKey` | string |", "| `createdAt` | date |"].join("\n"),
    );

    const chunks = chunkPage(page, { chunking: { ...chunking, maxChars: 50 }, baseUrl: BASE_URL });

    expect(chunks.map(({ content }) => content)).toEqual([
      "| Field | Type |\n| - | - |\n| `uid` | string |",
      "| `primaryKey` | string |\n| `createdAt` | date |",
    ]);
  });

  it("reports which page failed to parse and keeps the original error as the cause", () => {
    const page = makePage("<Note>\n\nThis callout is never closed.");

    let error: unknown;
    try {
      chunkPage(page, { chunking, baseUrl: BASE_URL });
    } catch (caught) {
      error = caught;
    }

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toMatch(
      /^Failed to parse capabilities\/personalization\/overview: Expected a closing tag for `<Note>`/,
    );
    expect((error as Error).cause).toBeInstanceOf(Error);
  });

  it("builds ids that only use characters Meilisearch accepts in document ids", () => {
    const page = makePage("Server-side rendering.", { page: "getting_started/frameworks/next.js" });

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(chunks.map(({ id, url }) => ({ id, url }))).toEqual([
      {
        id: "getting_started__frameworks__next_js-0",
        url: "https://www.meilisearch.com/docs/getting_started/frameworks/next.js",
      },
    ]);
  });

  it("uses an empty description when the frontmatter has none", () => {
    const page = makePage("Some text.", { frontmatter: { title: "Personalization" } });

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(chunks.map(({ description }) => description)).toEqual([""]);
  });

  it("uses the title of a component wrapping headings as their parent, and ignores untitled wrappers", () => {
    const page = makePage(
      [
        "<Steps>",
        "### Create an index",
        "Name it movies.",
        "</Steps>",
        "<Tabs>",
        '<Tab title="npm">',
        "### Install",
        "Run npm install.",
        "</Tab>",
        "</Tabs>",
      ].join("\n\n"),
    );

    const chunks = chunkPage(page, { chunking, baseUrl: BASE_URL });

    expect(chunks.map(({ hierarchy, anchor, content }) => ({ hierarchy, anchor, content }))).toEqual([
      { hierarchy: ["Personalization", "Create an index"], anchor: "create-an-index", content: "Name it movies." },
      { hierarchy: ["Personalization", "npm", "Install"], anchor: "install", content: "Run npm install." },
    ]);
  });
});
