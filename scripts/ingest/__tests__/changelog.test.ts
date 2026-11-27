import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { chunkRelease, loadReleases, parseReleasedOn } from "../sources/changelog.ts";
import { DEFAULT_CHUNKING } from "../config.ts";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

async function writeRelease(body: string, description = "Released August 4, 2025"): Promise<string> {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "ingest-changelog-"));
  tempDirs.push(rootDir);
  const navigation = {
    tabs: [
      {
        tab: "Changelog",
        pages: [{ group: "Changelog", root: "changelog", pages: ["changelog/v1.16", "changelog/v1.2"] }],
      },
    ],
  };
  await fs.writeFile(path.join(rootDir, "navigation.json"), JSON.stringify(navigation));
  await fs.mkdir(path.join(rootDir, "changelog"), { recursive: true });
  await fs.writeFile(
    path.join(rootDir, "changelog.mdx"),
    '---\ntitle: Changelog\ndescription: New features\n---\n\nLatest releases.\n',
  );
  await fs.writeFile(
    path.join(rootDir, "changelog/v1.16.mdx"),
    `---\ntitle: Meilisearch v1.16 release notes\ndescription: "${description}"\n---\n\n${body}`,
  );
  await fs.writeFile(
    path.join(rootDir, "changelog/v1.2.mdx"),
    '---\ntitle: Meilisearch v1.2 release notes\ndescription: "Released March 6, 2023"\n---\n\n## Improvements\n\nFaster indexing.\n',
  );
  return rootDir;
}

describe("parseReleasedOn", () => {
  it("reads the release date as an ISO day", () => {
    expect(parseReleasedOn("Released August 4, 2025")).toBe("2025-08-04");
    expect(parseReleasedOn("Released March 6, 2023")).toBe("2023-03-06");
  });

  it("rejects a description that is not a release date", () => {
    expect(parseReleasedOn("New features and improvements")).toBeNull();
    expect(parseReleasedOn("Released February 31, 2025")).toBeNull();
    expect(parseReleasedOn(undefined)).toBeNull();
  });
});

describe("loadReleases", () => {
  it("loads version pages and skips the changelog index", async () => {
    const rootDir = await writeRelease("## New Features\n\n### Multimodal embeddings\n\nSearch images.\n");

    const releases = await loadReleases({ rootDir, navigation: "navigation.json", chunking: DEFAULT_CHUNKING });

    expect(releases.map((page) => page.page)).toEqual(["changelog/v1.16", "changelog/v1.2"]);
    expect(releases[0]).toMatchObject({ versionLabel: "v1.16", releasedOn: "2025-08-04" });
  });

  it("throws when a version page has no release date", async () => {
    const rootDir = await writeRelease("## New Features\n\nSomething new.\n", "Not a date");

    await expect(loadReleases({ rootDir, navigation: "navigation.json", chunking: DEFAULT_CHUNKING })).rejects.toThrow(
      /changelog\/v1\.16/,
    );
  });
});

describe("chunkRelease", () => {
  it("sets the version, the date, and the section on every feature chunk", async () => {
    const rootDir = await writeRelease(
      ["## New Features", "### Multimodal embeddings", "Search images.", "## Bug Fixes", "### Quantization", "Fixed."].join(
        "\n\n",
      ),
    );
    const [page] = await loadReleases({ rootDir, navigation: "navigation.json", chunking: DEFAULT_CHUNKING });

    const chunks = chunkRelease(page, {
      chunking: { ...DEFAULT_CHUNKING, minChars: 0 },
    });

    expect(chunks.map((chunk) => chunk.release_section)).toEqual(["New Features", "Bug Fixes"]);
    expect(chunks.every((chunk) => chunk.version_label === "v1.16" && chunk.released_on === "2025-08-04")).toBe(true);
    expect(chunks[0].content).toContain("Multimodal embeddings");
    expect(chunks[0].content.startsWith("Released")).toBe(false);
  });
});
