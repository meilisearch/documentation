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
let routesSink: JsonlSink;
let changelogSink: JsonlSink;

beforeEach(async () => {
  rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "ingest-run-"));
  await fs.cp(FIXTURE_DIR, rootDir, { recursive: true });
  const output = path.join(rootDir, ".ingest/chunks.jsonl");
  config = resolveConfig({
    rootDir,
    navigation: "navigation.json",
    dryRunOutput: output,
    exclude: ["changelog/v*"],
  });
  sink = new JsonlSink(output);
  routesSink = new JsonlSink(path.join(rootDir, ".ingest/routes.jsonl"));
  changelogSink = new JsonlSink(path.join(rootDir, ".ingest/changelog.jsonl"));
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
    const summary = await runIngest({ config, sinks: { docs: sink, routes: routesSink, changelog: changelogSink } });

    expect(summary.docs.added).toEqual(ALL_PAGES);
    expect(summary.routes.added).toEqual(["reference/api/indexes/list-indexes"]);
    expect([...new Set((await storedChunks()).map((chunk) => chunk.page))]).toEqual(ALL_PAGES);
  });

  it("changes nothing on a second run over the same docs", async () => {
    await runIngest({ config, sinks: { docs: sink, routes: routesSink, changelog: changelogSink } });
    const before = await fs.readFile(config.dryRunOutput, "utf8");

    const summary = await runIngest({ config, sinks: { docs: sink, routes: routesSink, changelog: changelogSink } });

    expect(summary.docs).toMatchObject({ added: [], updated: [], removed: [], unchanged: 5, chunks: [] });
    expect(await fs.readFile(config.dryRunOutput, "utf8")).toBe(before);
  });

  it("re-syncs only the page whose content changed", async () => {
    await runIngest({ config, sinks: { docs: sink, routes: routesSink, changelog: changelogSink } });
    const untouched = (await storedChunks()).filter((chunk) => chunk.page !== "getting_started/first_project");
    const file = path.join(rootDir, "getting_started/first_project.mdx");
    await fs.appendFile(file, "\n## Troubleshooting\n\nRestart the instance when the dashboard shows a stale index list after an upgrade.\n");

    const summary = await runIngest({ config, sinks: { docs: sink, routes: routesSink, changelog: changelogSink } });

    expect(summary.docs).toMatchObject({ added: [], updated: ["getting_started/first_project"], removed: [], unchanged: 4 });
    const stored = await storedChunks();
    expect(stored.filter((chunk) => chunk.page !== "getting_started/first_project")).toEqual(untouched);
    expect(stored.some((chunk) => chunk.content.includes("stale index list"))).toBe(true);
  });

  it("removes the chunks of a page dropped from the navigation", async () => {
    await runIngest({ config, sinks: { docs: sink, routes: routesSink, changelog: changelogSink } });
    const navigationFile = path.join(rootDir, "navigation.json");
    const navigation = JSON.parse(await fs.readFile(navigationFile, "utf8"));
    navigation.tabs = navigation.tabs.filter((tab: { tab: string }) => tab.tab !== "Changelog");
    await fs.writeFile(navigationFile, JSON.stringify(navigation));

    const summary = await runIngest({ config, sinks: { docs: sink, routes: routesSink, changelog: changelogSink } });

    expect(summary.docs.removed).toEqual(["changelog/changelog"]);
    expect((await storedChunks()).some((chunk) => chunk.page === "changelog/changelog")).toBe(false);
  });

  it("limits a run to pages matching `only` without removing the others", async () => {
    await runIngest({ config, sinks: { docs: sink, routes: routesSink, changelog: changelogSink } });
    await fs.appendFile(path.join(rootDir, "getting_started/first_project.mdx"), "\nOne more sentence.\n");
    await fs.appendFile(path.join(rootDir, "changelog/changelog.mdx"), "\nOne more sentence.\n");

    const summary = await runIngest({ config, sinks: { docs: sink, routes: routesSink, changelog: changelogSink }, only: ["getting_started/**"] });

    expect(summary.docs).toMatchObject({ updated: ["getting_started/first_project"], removed: [], unchanged: 2 });
    expect([...new Set((await storedChunks()).map((chunk) => chunk.page))]).toContain("changelog/changelog");
  });

  it("re-syncs every page when forced, even if nothing changed", async () => {
    await runIngest({ config, sinks: { docs: sink, routes: routesSink, changelog: changelogSink } });

    const summary = await runIngest({ config, sinks: { docs: sink, routes: routesSink, changelog: changelogSink }, force: true });

    expect(summary.docs).toMatchObject({ added: [], updated: ALL_PAGES, unchanged: 0 });
    expect([...new Set((await storedChunks()).map((chunk) => chunk.page))]).toEqual(ALL_PAGES);
  });

  it("stores release notes in the changelog index and leaves them out of the docs", async () => {
    const navigationFile = path.join(rootDir, "navigation.json");
    const navigation = JSON.parse(await fs.readFile(navigationFile, "utf8"));
    const changelog = navigation.tabs.find((tab: { tab: string }) => tab.tab === "Changelog");
    changelog.pages.push("changelog/v1.2");
    await fs.writeFile(navigationFile, JSON.stringify(navigation));
    await fs.writeFile(
      path.join(rootDir, "changelog/v1.2.mdx"),
      [
        "---",
        'title: "Meilisearch v1.2 release notes"',
        'description: "Released March 4, 2024"',
        "---",
        "",
        "## New Features",
        "",
        "### Geosearch",
        "",
        "Filter by location.",
        "",
        "```bash",
        "curl -X POST search",
        "```",
        "",
      ].join("\n"),
    );

    const summary = await runIngest({ config, sinks: { docs: sink, routes: routesSink, changelog: changelogSink } });

    expect(summary.docs.added).toEqual(ALL_PAGES);
    expect(summary.docs.added).not.toContain("changelog/v1.2");
    expect(summary.changelog.added).toEqual(["changelog/v1.2"]);
    expect((await storedChunks()).some((chunk) => chunk.page === "changelog/v1.2")).toBe(false);
    const releases = (await fs.readFile(path.join(rootDir, ".ingest/changelog.jsonl"), "utf8"))
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Chunk);
    expect(releases[0]).toMatchObject({
      page: "changelog/v1.2",
      version_label: "v1.2",
      released_on: "2024-03-04",
      release_section: "New Features",
    });
    expect(releases.some((chunk) => chunk.content.includes("```bash"))).toBe(true);
  });
});
