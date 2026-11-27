import { chunkPage, type ChunkPageOptions } from "../chunk/mdx-chunker.ts";
import type { Chunk, ChunkingConfig, RawPage } from "../types.ts";
import { loadPages } from "./mdx.ts";

const VERSION_PAGE = /^changelog\/(v\d+\.\d+)$/;
const RELEASED = /^Released ([A-Za-z]+) (\d{1,2}), (\d{4})$/;
const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export type ReleasePage = RawPage & {
  versionLabel: string;
  releasedOn: string;
};

/** "Released August 4, 2025" → "2025-08-04". Null when the description is missing or not a real date. */
export function parseReleasedOn(description: string | undefined): string | null {
  const match = RELEASED.exec(description?.trim() ?? "");
  if (!match) return null;
  const month = MONTHS.indexOf(match[1].toLowerCase());
  const day = Number(match[2]);
  const year = Number(match[3]);
  if (month < 0) return null;
  const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const parsed = new Date(`${iso}T00:00:00Z`);
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month || parsed.getUTCDate() !== day) return null;
  return iso;
}

export async function loadReleases(options: {
  rootDir: string;
  navigation: string;
  chunking: ChunkingConfig;
  only?: string[];
}): Promise<ReleasePage[]> {
  const only = options.only ?? [];
  const pages = await loadPages({
    rootDir: options.rootDir,
    navigation: options.navigation,
    exclude: [],
    only: only.length > 0 ? only : ["changelog/v*"],
    chunking: options.chunking,
    codeSamples: false,
  });
  const releases: ReleasePage[] = [];
  for (const page of pages) {
    const match = VERSION_PAGE.exec(page.page);
    if (!match) continue;
    const releasedOn = parseReleasedOn(page.frontmatter.description);
    if (!releasedOn) {
      throw new Error(
        `Changelog page "${page.page}" description must be "Released Month D, YYYY" (got ${JSON.stringify(page.frontmatter.description ?? "")})`,
      );
    }
    releases.push({ ...page, versionLabel: match[1], releasedOn });
  }
  return releases;
}

export function chunkRelease(page: ReleasePage, options: ChunkPageOptions): Chunk[] {
  return chunkPage(page, options).map((chunk) => {
    const section = chunk.hierarchy[1];
    return {
      ...chunk,
      version_label: page.versionLabel,
      released_on: page.releasedOn,
      ...(section ? { release_section: section } : {}),
    };
  });
}
