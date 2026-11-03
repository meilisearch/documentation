import * as fs from "fs";
import * as path from "path";

export const GITHUB_OWNER = "meilisearch";
export const GITHUB_REPO = "meilisearch";

export const CARD_COUNT = 10;
export const CARD_GROUP_START = "{/* changelog:cards:start */}";
export const CARD_GROUP_END = "{/* changelog:cards:end */}";

export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
}

export interface VersionEntry {
  label: string;
  date: string;
  slug: string;
}

export function getProjectPaths(projectRoot: string) {
  return {
    projectRoot,
    indexMdx: path.join(projectRoot, "changelog.mdx"),
    versionsDir: path.join(projectRoot, "changelog"),
    navJson: path.join(projectRoot, "config", "navigation.json"),
  };
}

export function parseVersion(tag: string): ParsedVersion | null {
  const match = tag.match(/^v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

export function getMinorVersion(version: ParsedVersion): string {
  return `v${version.major}.${version.minor}`;
}

export function compareMinorLabels(a: string, b: string): number {
  const vA = parseVersion(`${a}.0`);
  const vB = parseVersion(`${b}.0`);
  if (!vA || !vB) return 0;
  if (vA.major !== vB.major) return vB.major - vA.major;
  return vB.minor - vA.minor;
}

export function versionPagePath(versionsDir: string, label: string): string {
  return path.join(versionsDir, `${label}.mdx`);
}

export function versionNavSlug(label: string): string {
  return `changelog/${label}`;
}

export function listExistingVersions(versionsDir: string): VersionEntry[] {
  if (!fs.existsSync(versionsDir)) return [];

  const entries: VersionEntry[] = [];
  for (const file of fs.readdirSync(versionsDir)) {
    const match = file.match(/^(v\d+\.\d+)\.mdx$/);
    if (!match) continue;

    const label = match[1];
    const content = fs.readFileSync(path.join(versionsDir, file), "utf-8");
    const dateMatch = content.match(/^description:\s*"Released\s+([^"]+)"/m);
    entries.push({
      label,
      date: dateMatch?.[1] || "Unknown",
      slug: versionNavSlug(label),
    });
  }

  entries.sort((a, b) => compareMinorLabels(a.label, b.label));
  return entries;
}

export function versionPageTitle(label: string): string {
  return `Meilisearch ${label} release notes`;
}

export function buildVersionPageFile(label: string, date: string, body: string): string {
  const trimmed = body.trim();
  return `---
title: "${versionPageTitle(label)}"
sidebarTitle: "${label}"
description: "Released ${formatEnglishDate(date)}"
---

${trimmed}

`;
}

const englishDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatEnglishDate(isoDate: string): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return isoDate;

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return englishDateFormat.format(date);
}

export function buildCardGroup(entries: VersionEntry[]): string {
  const cards = entries
    .slice(0, CARD_COUNT)
    .map(
      (entry) => `  <Card title="Meilisearch ${entry.label}" href="/changelog/${entry.label}">
    ${formatEnglishDate(entry.date)}
  </Card>`
    )
    .join("\n");

  return `<CardGroup cols={1}>
${cards}
</CardGroup>`;
}

export const INDEX_INTRO = `Browse the latest Meilisearch engine releases below, or open a version in the sidebar for full release notes.

`;

export const INDEX_OUTRO = `Older releases are listed in the sidebar under this section.
`;

export const INDEX_FRONTMATTER = `---
title: "Changelog"
description: "New features and improvements in Meilisearch"
rss: true
---
`;

export function buildIndexContent(allVersions: VersionEntry[]): string {
  const cardBlock = buildCardGroup(allVersions);
  return `${INDEX_FRONTMATTER}

${INDEX_INTRO}
${CARD_GROUP_START}
${cardBlock}
${CARD_GROUP_END}

${INDEX_OUTRO}`;
}

export function regenerateIndexCards(indexMdx: string, allVersions: VersionEntry[]): void {
  const cardBlock = buildCardGroup(allVersions);

  if (!fs.existsSync(indexMdx)) {
    fs.writeFileSync(indexMdx, buildIndexContent(allVersions));
    return;
  }

  let content = fs.readFileSync(indexMdx, "utf-8");
  if (content.includes(CARD_GROUP_START) && content.includes(CARD_GROUP_END)) {
    const start = content.indexOf(CARD_GROUP_START);
    const end = content.indexOf(CARD_GROUP_END) + CARD_GROUP_END.length;
    content = content.slice(0, start) + `${CARD_GROUP_START}\n${cardBlock}\n${CARD_GROUP_END}` + content.slice(end);
  } else {
    content = buildIndexContent(allVersions);
  }

  fs.writeFileSync(indexMdx, content);
}

interface NavTab {
  tab?: string;
  pages?: unknown[];
  groups?: unknown[];
}

export function syncChangelogNavigation(navJsonPath: string, versionLabels: string[]): void {
  const raw = fs.readFileSync(navJsonPath, "utf-8");
  const nav = JSON.parse(raw) as { tabs: NavTab[] };

  const pages = versionLabels.map((label) => versionNavSlug(label));
  const changelogGroup = {
    group: "Changelog",
    root: "changelog",
    expanded: false,
    pages,
  };

  let found = false;
  for (const tab of nav.tabs) {
    if (tab.tab !== "Changelog") continue;
    tab.pages = [changelogGroup];
    found = true;
    break;
  }

  if (!found) {
    throw new Error('Changelog tab not found in config/navigation.json');
  }

  fs.writeFileSync(navJsonPath, `${JSON.stringify(nav, null, 2)}\n`);
}
