import { pageHref } from "../src/source.js";

export type ReleaseChunk = {
  page?: string;
  version_label?: string;
  released_on?: string;
};

export type Release = {
  version: string;
  released_on: string;
  url: string;
};

const VERSION_PAGE = /^v?(\d+)\.(\d+)$/;

function textField(value: unknown, key: string): string | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const field = (value as Record<string, unknown>)[key];
  return typeof field === "string" ? field : undefined;
}

/** One entry per page, newest first. Chunks of the same release collapse. */
export function groupReleases(hits: readonly unknown[]): Release[] {
  const byPage = new Map<string, Release>();
  for (const hit of hits) {
    const page = textField(hit, "page");
    const version = textField(hit, "version_label");
    const releasedOn = textField(hit, "released_on");
    if (!page || !version || !releasedOn || byPage.has(page)) continue;
    byPage.set(page, {
      version,
      released_on: releasedOn,
      url: pageHref(page),
    });
  }
  return [...byPage.values()].sort((a, b) => b.released_on.localeCompare(a.released_on));
}

/** "v1.58" | "1.58" | "changelog/v1.58" -> "changelog/v1.58". Anything else is unchanged. */
export function resolvePage(input: string): string {
  const match = VERSION_PAGE.exec(input.trim());
  if (!match) return input;
  return `changelog/v${match[1]}.${match[2]}`;
}
