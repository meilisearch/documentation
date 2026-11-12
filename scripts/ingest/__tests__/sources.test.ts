import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_CHUNKING } from "../config.ts";
import { loadPages } from "../sources/mdx.ts";

const FIXTURE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../__fixtures__/docs");

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

async function makeDocs(navigation: unknown, pages: string[]): Promise<string> {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "ingest-sources-"));
  tempDirs.push(rootDir);
  await fs.writeFile(path.join(rootDir, "navigation.json"), JSON.stringify(navigation));
  for (const page of pages) {
    const file = path.join(rootDir, `${page}.mdx`);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, `---\ntitle: ${page}\n---\n\nSome content.\n`);
  }
  return rootDir;
}

function locations(pages: { page: string; tab: string; group: string }[]) {
  return pages.map(({ page, tab, group }) => ({ page, tab, group }));
}

describe("loadPages", () => {
  it("returns pages in navigation order with their tab and group", async () => {
    const rootDir = await makeDocs(
      {
        tabs: [
          { tab: "Guides", groups: [{ group: "Basics", pages: ["guides/a", "guides/b"] }] },
          { tab: "Learn", groups: [{ group: "Advanced", pages: ["learn/c"] }] },
        ],
      },
      ["guides/a", "guides/b", "learn/c"],
    );

    const pages = await loadPages({ rootDir, navigation: "navigation.json", chunking: DEFAULT_CHUNKING });

    expect(locations(pages)).toEqual([
      { page: "guides/a", tab: "Guides", group: "Basics" },
      { page: "guides/b", tab: "Guides", group: "Basics" },
      { page: "learn/c", tab: "Learn", group: "Advanced" },
    ]);
  });

  it("joins nested group names with ' > ' and leaves group empty for pages directly under a tab", async () => {
    const rootDir = await makeDocs(
      {
        tabs: [
          {
            tab: "Guides",
            groups: [
              {
                group: "Basics",
                pages: ["guides/a", { group: "SDKs", pages: [{ group: "Back-end", pages: ["guides/sdks/js"] }] }, "guides/b"],
              },
            ],
          },
          { tab: "Changelog", pages: ["changelog/changelog"] },
        ],
      },
      ["guides/a", "guides/sdks/js", "guides/b", "changelog/changelog"],
    );

    const pages = await loadPages({ rootDir, navigation: "navigation.json", chunking: DEFAULT_CHUNKING });

    expect(locations(pages)).toEqual([
      { page: "guides/a", tab: "Guides", group: "Basics" },
      { page: "guides/sdks/js", tab: "Guides", group: "Basics > SDKs > Back-end" },
      { page: "guides/b", tab: "Guides", group: "Basics" },
      { page: "changelog/changelog", tab: "Changelog", group: "" },
    ]);
  });

  it("includes the root page of a group before its pages and keeps it once if it is also listed", async () => {
    const rootDir = await makeDocs(
      {
        tabs: [
          {
            tab: "Changelog",
            pages: [{ group: "Changelog", root: "changelog", pages: ["changelog/v1.2", "changelog", "changelog/v1.1"] }],
          },
        ],
      },
      ["changelog", "changelog/v1.2", "changelog/v1.1"],
    );

    const pages = await loadPages({ rootDir, navigation: "navigation.json", chunking: DEFAULT_CHUNKING });

    expect(locations(pages)).toEqual([
      { page: "changelog", tab: "Changelog", group: "Changelog" },
      { page: "changelog/v1.2", tab: "Changelog", group: "Changelog" },
      { page: "changelog/v1.1", tab: "Changelog", group: "Changelog" },
    ]);
  });

  it("skips OpenAPI route entries and keeps only the first occurrence of a duplicated page", async () => {
    const pages = await loadPages({ rootDir: FIXTURE_DIR, navigation: "navigation.json", chunking: DEFAULT_CHUNKING });

    expect(locations(pages)).toEqual([
      { page: "getting_started/overview", tab: "Getting started", group: "Introduction" },
      { page: "getting_started/first_project", tab: "Getting started", group: "Introduction" },
      { page: "getting_started/sdks/javascript", tab: "Getting started", group: "Introduction > SDKs" },
      { page: "reference/api/overview", tab: "Reference", group: "API routes" },
      { page: "changelog/changelog", tab: "Changelog", group: "" },
    ]);
  });

  it("parses frontmatter, strips it from the body, and falls back to sidebarTitle for the title", async () => {
    const pages = await loadPages({ rootDir: FIXTURE_DIR, navigation: "navigation.json", chunking: DEFAULT_CHUNKING });
    const overview = pages.find((p) => p.page === "getting_started/overview")!;
    const javascript = pages.find((p) => p.page === "getting_started/sdks/javascript")!;

    expect(overview.frontmatter).toEqual({
      title: "Overview",
      description: "Discover what Meilisearch is and how it fits in your application.",
    });
    expect(overview.body.startsWith("import CodeSamplesSearch1 from")).toBe(true);
    expect(overview.body).toContain("## What is Meilisearch?");
    expect(javascript.frontmatter).toEqual({ title: "JavaScript", sidebarTitle: "JavaScript" });
    expect(javascript.body.startsWith("The Meilisearch JavaScript SDK lets you")).toBe(true);
  });

  it("uses the last path segment as the title when the page has no frontmatter", async () => {
    const rootDir = await makeDocs({ tabs: [{ tab: "Guides", pages: ["guides/no_frontmatter"] }] }, []);
    await fs.mkdir(path.join(rootDir, "guides"));
    await fs.writeFile(path.join(rootDir, "guides/no_frontmatter.mdx"), "\n\nJust a paragraph.\n");

    const [page] = await loadPages({ rootDir, navigation: "navigation.json", chunking: DEFAULT_CHUNKING });

    expect(page.frontmatter).toEqual({ title: "no_frontmatter" });
    expect(page.body).toBe("Just a paragraph.\n");
  });

  it("skips pages matching an exclude glob and keeps only pages matching an only glob", async () => {
    const excluded = await loadPages({
      rootDir: FIXTURE_DIR,
      navigation: "navigation.json",
      exclude: ["changelog/**", "getting_started/sdks/*"],
      chunking: DEFAULT_CHUNKING,
    });
    const onlyGettingStarted = await loadPages({
      rootDir: FIXTURE_DIR,
      navigation: "navigation.json",
      only: ["getting_started/**"],
      exclude: ["getting_started/first_project"],
      chunking: DEFAULT_CHUNKING,
    });

    expect(excluded.map((p) => p.page)).toEqual([
      "getting_started/overview",
      "getting_started/first_project",
      "reference/api/overview",
    ]);
    expect(onlyGettingStarted.map((p) => p.page)).toEqual(["getting_started/overview", "getting_started/sdks/javascript"]);
  });

  it("throws a clear error when a listed page has no MDX file", async () => {
    const rootDir = await makeDocs({ tabs: [{ tab: "Guides", pages: ["guides/a", "guides/missing"] }] }, ["guides/a"]);

    await expect(loadPages({ rootDir, navigation: "navigation.json", chunking: DEFAULT_CHUNKING })).rejects.toThrow(
      'Page "guides/missing" is listed in navigation.json but guides/missing.mdx was not found',
    );
  });

  it("computes a page hash that is stable but changes with content, location, and chunking config", async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "ingest-sources-"));
    tempDirs.push(rootDir);
    await fs.cp(FIXTURE_DIR, rootDir, { recursive: true });
    const load = async (chunking = DEFAULT_CHUNKING) => {
      const pages = await loadPages({ rootDir, navigation: "navigation.json", chunking });
      return new Map(pages.map((p) => [p.page, p.pageHash]));
    };

    const first = await load();
    const second = await load();

    const overviewFile = path.join(rootDir, "reference/api/overview.mdx");
    await fs.appendFile(overviewFile, "\nA new paragraph.\n");
    const afterEdit = await load();

    const navigationFile = path.join(rootDir, "navigation.json");
    const navigation = await fs.readFile(navigationFile, "utf8");
    await fs.writeFile(navigationFile, navigation.replace('"group": "SDKs"', '"group": "Libraries"'));
    const afterMove = await load();

    const afterChunkingChange = await load({ ...DEFAULT_CHUNKING, maxChars: DEFAULT_CHUNKING.maxChars + 1 });

    expect(first.get("getting_started/overview")).toMatch(/^[0-9a-f]{40}$/);
    expect(second).toEqual(first);
    expect(afterEdit.get("reference/api/overview")).not.toBe(first.get("reference/api/overview"));
    expect(afterEdit.get("getting_started/overview")).toBe(first.get("getting_started/overview"));
    expect(afterMove.get("getting_started/sdks/javascript")).not.toBe(afterEdit.get("getting_started/sdks/javascript"));
    expect(afterMove.get("getting_started/overview")).toBe(afterEdit.get("getting_started/overview"));
    expect(afterChunkingChange.get("getting_started/overview")).not.toBe(afterMove.get("getting_started/overview"));
  });

  it("mounts aliased snippets and changes the page hash when a snippet file changes", async () => {
    const rootDir = await makeDocs({ tabs: [{ tab: "Guides", pages: ["guides/joins"] }] }, ["guides/joins"]);
    const snippetDir = path.join(rootDir, "snippets/generated-code-samples");
    await fs.mkdir(snippetDir, { recursive: true });
    const snippet = path.join(snippetDir, "code_samples_joins_define_relationship_1.mdx");
    const writeSnippet = (curl: string) =>
      fs.writeFile(
        snippet,
        `<CodeGroup>\n\n\`\`\`bash cURL\n${curl}\n\`\`\`\n\n\`\`\`javascript JS\nclient.update()\n\`\`\`\n\n</CodeGroup>\n`,
      );
    await writeSnippet("curl one");
    await fs.writeFile(
      path.join(rootDir, "guides/joins.mdx"),
      [
        "---",
        "title: Joins",
        "---",
        "",
        "import JoinsDefineRelationship1 from '/snippets/generated-code-samples/code_samples_joins_define_relationship_1.mdx'",
        "",
        "Use <JoinsUnused /> in prose, then mount the sample.",
        "",
        "<JoinsDefineRelationship1 />",
        "",
      ].join("\n"),
    );

    const load = () => loadPages({ rootDir, navigation: "navigation.json", chunking: DEFAULT_CHUNKING });
    const [first] = await load();
    expect(first.samples).toEqual([
      {
        alias: "JoinsDefineRelationship1",
        key: "joins_define_relationship_1",
        codes: { http: "curl one", js: "client.update()" },
      },
    ]);

    await writeSnippet("curl two");
    const [second] = await load();
    expect(second.pageHash).not.toBe(first.pageHash);
    expect(second.samples?.[0].codes.http).toBe("curl two");

    const [withoutSamples] = await loadPages({
      rootDir,
      navigation: "navigation.json",
      chunking: DEFAULT_CHUNKING,
      codeSamples: false,
    });
    expect(withoutSamples.samples).toEqual([]);
  });
});
