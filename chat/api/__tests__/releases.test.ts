import { describe, expect, it } from "vitest";
import { groupReleases, resolvePage, type ReleaseChunk } from "../releases.ts";

function chunk(
  page: string,
  version: string,
  releasedOn: string,
  url = `https://www.meilisearch.com/docs/${page}#section`,
): ReleaseChunk {
  return { page, version_label: version, released_on: releasedOn, url };
}

describe("groupReleases", () => {
  it("collapses chunks of one release and orders newest first", () => {
    const releases = groupReleases([
      chunk("changelog/v1.2", "v1.2", "2023-06-05"),
      chunk("changelog/v1.2", "v1.2", "2023-06-05", "https://www.meilisearch.com/docs/changelog/v1.2#other"),
      chunk("changelog/v1.58", "v1.58", "2026-11-23"),
      chunk("changelog/v1.56", "v1.56", "2026-10-26"),
      { page: "changelog/v1.1" },
    ]);

    expect(releases).toEqual([
      {
        version: "v1.58",
        released_on: "2026-11-23",
        url: "https://www.meilisearch.com/docs/changelog/v1.58",
      },
      {
        version: "v1.56",
        released_on: "2026-10-26",
        url: "https://www.meilisearch.com/docs/changelog/v1.56",
      },
      {
        version: "v1.2",
        released_on: "2023-06-05",
        url: "https://www.meilisearch.com/docs/changelog/v1.2",
      },
    ]);
  });
});

describe("resolvePage", () => {
  it.each([
    ["v1.58", "changelog/v1.58"],
    ["1.58", "changelog/v1.58"],
    [" v1.58 ", "changelog/v1.58"],
    ["changelog/v1.58", "changelog/v1.58"],
    ["capabilities/personalization/overview", "capabilities/personalization/overview"],
  ])("%s -> %s", (input, page) => {
    expect(resolvePage(input)).toBe(page);
  });
});
