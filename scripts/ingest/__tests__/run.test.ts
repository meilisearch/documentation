import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resolveConfig } from "../config.ts";
import { runIngest } from "../run.ts";
import { JsonlSink } from "../sinks/jsonl.ts";
import type { Chunk, IngestConfig } from "../types.ts";

const FIXTURE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../__fixtures__/docs");

const ALL_PAGES = [
  "getting_started/overview",
  "getting_started/first_project",
  "getting_started/sdks/javascript",
  "reference/api/overview",
  "changelog/changelog",
];

let rootDir: string;
let config: IngestConfig;
let sink: JsonlSink;

beforeEach(async () => {
  rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "ingest-run-"));
  await fs.cp(FIXTURE_DIR, rootDir, { recursive: true });
  const output = path.join(rootDir, ".ingest/chunks.jsonl");
  config = resolveConfig({ rootDir, navigation: "navigation.json", dryRunOutput: output });
  sink = new JsonlSink(output);
});

afterEach(async () => {
  await fs.rm(rootDir, { recursive: true, force: true });
});

async function storedChunks(): Promise<Chunk[]> {
  const text = await fs.readFile(config.dryRunOutput, "utf8");
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

describe("runIngest", () => {
  it("adds every page on the first run", async () => {
    const summary = await runIngest({ config, sink });

    expect(summary.added).toEqual(ALL_PAGES);
    expect([...new Set((await storedChunks()).map((chunk) => chunk.page))]).toEqual(ALL_PAGES);
  });

  it("changes nothing on a second run over the same docs", async () => {
    await runIngest({ config, sink });
    const before = await fs.readFile(config.dryRunOutput, "utf8");

    const summary = await runIngest({ config, sink });

    expect(summary).toMatchObject({ added: [], updated: [], removed: [], unchanged: 5, chunks: [] });
    expect(await fs.readFile(config.dryRunOutput, "utf8")).toBe(before);
  });

  it("re-syncs only the page whose content changed", async () => {
    await runIngest({ config, sink });
    const untouched = (await storedChunks()).filter((chunk) => chunk.page !== "getting_started/first_project");
    const file = path.join(rootDir, "getting_started/first_project.mdx");
    await fs.appendFile(file, "\n## Troubleshooting\n\nRestart the instance when the dashboard shows a stale index list after an upgrade.\n");

    const summary = await runIngest({ config, sink });

    expect(summary).toMatchObject({ added: [], updated: ["getting_started/first_project"], removed: [], unchanged: 4 });
    const stored = await storedChunks();
    expect(stored.filter((chunk) => chunk.page !== "getting_started/first_project")).toEqual(untouched);
    expect(stored.some((chunk) => chunk.content.includes("stale index list"))).toBe(true);
  });

  it("removes the chunks of a page dropped from the navigation", async () => {
    await runIngest({ config, sink });
    const navigationFile = path.join(rootDir, "navigation.json");
    const navigation = JSON.parse(await fs.readFile(navigationFile, "utf8"));
    navigation.tabs = navigation.tabs.filter((tab: { tab: string }) => tab.tab !== "Changelog");
    await fs.writeFile(navigationFile, JSON.stringify(navigation));

    const summary = await runIngest({ config, sink });

    expect(summary.removed).toEqual(["changelog/changelog"]);
    expect((await storedChunks()).some((chunk) => chunk.page === "changelog/changelog")).toBe(false);
  });

  it("limits a run to pages matching `only` without removing the others", async () => {
    await runIngest({ config, sink });
    await fs.appendFile(path.join(rootDir, "getting_started/first_project.mdx"), "\nOne more sentence.\n");
    await fs.appendFile(path.join(rootDir, "changelog/changelog.mdx"), "\nOne more sentence.\n");

    const summary = await runIngest({ config, sink, only: ["getting_started/**"] });

    expect(summary).toMatchObject({ updated: ["getting_started/first_project"], removed: [], unchanged: 2 });
    expect([...new Set((await storedChunks()).map((chunk) => chunk.page))]).toContain("changelog/changelog");
  });

  it("re-syncs every page when forced, even if nothing changed", async () => {
    await runIngest({ config, sink });

    const summary = await runIngest({ config, sink, force: true });

    expect(summary).toMatchObject({ added: [], updated: ALL_PAGES, unchanged: 0 });
    expect([...new Set((await storedChunks()).map((chunk) => chunk.page))]).toEqual(ALL_PAGES);
  });
});
