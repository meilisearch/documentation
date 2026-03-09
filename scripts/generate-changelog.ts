import { Octokit } from "@octokit/rest";
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

const GITHUB_OWNER = "meilisearch";
const GITHUB_REPO = "meilisearch";

const octokit = new Octokit();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Paths relative to project root (documentation/)
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_ROOT = path.dirname(SCRIPT_DIR);
const RELEASES_DIR = path.join(PROJECT_ROOT, "changelog", "releases");
const CHANGELOG_MDX = path.join(PROJECT_ROOT, "changelog", "changelog.mdx");
const CACHE_PATH = path.join(PROJECT_ROOT, "changelog", ".cache.json");

const CHANGELOG_HEADER = `---
title: "Changelog"
description: "New features and improvements in Meilisearch"
---

`;

interface Release {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
}

interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
  raw: string;
}

// Cache only tracks which minor versions have already been processed
type CacheData = Record<string, boolean>;

function parseVersion(tag: string): ParsedVersion | null {
  const match = tag.match(/^v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3]),
    raw: tag,
  };
}

function getMinorVersion(version: ParsedVersion): string {
  return `v${version.major}.${version.minor}`;
}

function formatJsonBlocks(content: string): string {
  return content.replace(/```json\n([\s\S]*?)```/g, (match, jsonContent) => {
    try {
      const parsed = JSON.parse(jsonContent.trim());
      return "```json\n" + JSON.stringify(parsed, null, 2) + "\n```";
    } catch {
      return match;
    }
  });
}

function reorderSections(content: string): string {
  const sections: { [key: string]: string } = {};
  const sectionOrder = ["## New Features", "## Improvements", "## Other"];
  const parts = content.split(/(?=^## )/m);

  let preamble = "";
  for (const part of parts) {
    if (part.startsWith("## New Features")) {
      sections["## New Features"] = part.trim();
    } else if (part.startsWith("## Improvements")) {
      sections["## Improvements"] = part.trim();
    } else if (part.startsWith("## Other")) {
      sections["## Other"] = part.trim();
    } else if (part.trim()) {
      preamble = part.trim();
    }
  }

  const orderedParts: string[] = [];
  if (preamble) orderedParts.push(preamble);
  for (const header of sectionOrder) {
    if (sections[header]) orderedParts.push(sections[header]);
  }
  return orderedParts.join("\n\n");
}

function cleanContent(content: string): string {
  let cleaned = content
    .replace(/\s+by\s+@[\w-]+/gi, "")
    .replace(/@[\w-]+/g, "")
    .replace(/\s+in\s+https:\/\/github\.com\/[^\s)]+/gi, "")
    .replace(/https:\/\/github\.com\/[\w-]+\/[\w-]+\/(pull|issues|discussions)\/\d+/g, "")
    .replace(/\s+in\s+#\d+/gi, "")
    .replace(/\(#\d+\)/g, "")
    .replace(/#\d+/g, "")
    .replace(/\s+in\s*$/gm, "")
    .replace(/\s+by\s*$/gm, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\[\s*\]/g, "")
    .replace(/  +/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  cleaned = formatJsonBlocks(cleaned);
  cleaned = reorderSections(cleaned);
  return cleaned;
}

function loadCache(): CacheData {
  if (fs.existsSync(CACHE_PATH)) {
    try {
      const raw = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
      // Support old cache format: migrate to simple record
      if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        if ("changelogs" in raw) {
          // Old format had { releases, changelogs, features }
          const migrated: CacheData = {};
          for (const key of Object.keys(raw.changelogs || {})) {
            migrated[key] = true;
          }
          return migrated;
        }
        return raw as CacheData;
      }
    } catch {
      console.log("Cache file corrupted, starting fresh");
    }
  }
  return {};
}

function saveCache(cache: CacheData): void {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function buildUpdateBlock(version: string, date: string, content: string): string {
  return `<Update label="${version}" description="${date}">

${content}

</Update>

`;
}

async function fetchAllReleases(): Promise<Release[]> {
  console.log("Fetching releases from GitHub...");
  const releases: Release[] = [];
  let page = 1;

  while (true) {
    const { data } = await octokit.repos.listReleases({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      per_page: 100,
      page,
    });

    if (data.length === 0) break;

    for (const release of data) {
      if (!release.draft && !release.prerelease) {
        releases.push({
          tag_name: release.tag_name,
          name: release.name || release.tag_name,
          body: release.body || "",
          published_at: release.published_at || "",
          prerelease: release.prerelease,
          draft: release.draft,
        });
      }
    }

    page++;
  }

  console.log(`Found ${releases.length} releases`);
  return releases;
}

async function extractChangelog(body: string): Promise<string> {
  if (!body.trim()) return "";

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: `You are a changelog writer for end users. Transform release notes into a clean, user-friendly changelog.

OUTPUT FORMAT:
Use exactly these section headers IN THIS EXACT ORDER (only include sections that have content):

1. ## New Features
   For brand new capabilities, APIs, or functionality.

2. ## Improvements
   For enhancements to existing features, performance improvements, or better behavior.

3. ## Other
   For breaking changes, deprecations, or other notable changes users should know about.

IMPORTANT: Always maintain this order - New Features first, then Improvements, then Other. Never put Other or Improvements before New Features.

FORMATTING RULES:
1. NO emojis anywhere in the output
2. NO GitHub usernames (@someone), PR numbers (#1234), or GitHub URLs
3. NO attribution phrases like "by someone" or "in PR"
4. Each item should have a clear title and explanation
5. KEEP code examples, API examples, and configuration snippets - these are valuable for users
6. Write in a way that end users (developers using Meilisearch) can understand
7. Focus on WHAT changed and WHY it matters to users, not internal implementation details
8. ALL code blocks MUST have a language identifier. Use:
   - \`\`\`json for JSON data, API responses, and configuration objects
   - \`\`\`bash for shell commands and curl examples
   - \`\`\`http for HTTP request examples (GET /path, POST /path)
   - \`\`\`text for plain text output or routes listings
9. Inline code (single backticks) for: parameter names, field names, values, environment variables, short code references
10. Fix any malformed code blocks - ensure opening and closing backticks match
11. JSON FORMATTING IS CRITICAL:
    - All JSON must be valid and properly indented with 2 spaces
    - JSON inside curl commands: use proper escaping and formatting
    - For curl examples, prefer showing the JSON body separately:
      First show the curl command, then show the JSON body in a separate \`\`\`json block
    - Never use single quotes around JSON in curl, use proper escaping or --data-binary with @-

EXCLUDE completely:
- Bug fixes (unless they change behavior significantly)
- Internal maintenance, refactoring, CI/CD changes
- Documentation-only changes
- Dependency updates
- Security patches (unless they add new features)

If there's no relevant changelog content (only bug fixes, maintenance, etc.), return an empty string.`,
    messages: [
      {
        role: "user",
        content: body,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.text || "";
}

async function main() {
  fs.mkdirSync(RELEASES_DIR, { recursive: true });

  const cache = loadCache();
  const releases = await fetchAllReleases();

  // Save individual release files
  console.log("\n--- Saving individual release files ---");
  for (const release of releases) {
    const version = parseVersion(release.tag_name);
    if (!version) continue;

    const filename = `${release.tag_name.replace(/^v/, "")}.md`;
    const filepath = path.join(RELEASES_DIR, filename);

    if (fs.existsSync(filepath)) {
      continue;
    }

    const content = `# ${release.name}\n\nReleased: ${release.published_at?.split("T")[0] || "Unknown"}\n\n${release.body}`;
    fs.writeFileSync(filepath, content);
    console.log(`  Saved: ${filename}`);
  }

  // Group releases by minor version
  const minorVersions = new Map<string, Release[]>();
  for (const release of releases) {
    const version = parseVersion(release.tag_name);
    if (!version) continue;

    const minorKey = getMinorVersion(version);
    if (!minorVersions.has(minorKey)) {
      minorVersions.set(minorKey, []);
    }
    minorVersions.get(minorKey)!.push(release);
  }

  // Sort minor versions newest first
  const sortedMinorVersions = [...minorVersions.entries()].sort((a, b) => {
    const vA = parseVersion(a[0] + ".0");
    const vB = parseVersion(b[0] + ".0");
    if (!vA || !vB) return 0;
    if (vA.major !== vB.major) return vB.major - vA.major;
    return vB.minor - vA.minor;
  });

  // Find new minor versions that aren't in the cache
  const newVersions: { version: string; date: string; releases: Release[] }[] = [];
  for (const [minorVersion, minorReleases] of sortedMinorVersions) {
    if (cache[minorVersion]) continue;

    // Sort patches (oldest first to get the first release date)
    minorReleases.sort((a, b) => {
      const vA = parseVersion(a.tag_name);
      const vB = parseVersion(b.tag_name);
      if (!vA || !vB) return 0;
      return vA.patch - vB.patch;
    });

    const releaseDate = minorReleases[0].published_at?.split("T")[0] || "Unknown";
    newVersions.push({ version: minorVersion, date: releaseDate, releases: minorReleases });
  }

  if (newVersions.length === 0) {
    console.log("\nNo new versions to process.");
    return;
  }

  console.log(`\n--- Processing ${newVersions.length} new version(s) ---`);

  // Process new versions and build Update blocks
  const newBlocks: string[] = [];
  for (const { version, date, releases: minorReleases } of newVersions) {
    console.log(`\nProcessing ${version}...`);

    const mergedBody = minorReleases
      .map((r) => `## ${r.tag_name}\n\n${r.body}`)
      .join("\n\n---\n\n");

    const rawContent = await extractChangelog(mergedBody);
    const content = cleanContent(rawContent);

    if (content.trim()) {
      newBlocks.push(buildUpdateBlock(version, date, content));
      cache[version] = true;
      saveCache(cache);
      console.log(`  Done: ${version}`);
    } else {
      console.log(`  Skipped (no notable changes): ${version}`);
      cache[version] = true;
      saveCache(cache);
    }
  }

  if (newBlocks.length === 0) {
    console.log("\nNo new changelog content to add.");
    return;
  }

  // Insert new blocks into existing changelog.mdx (right after the header)
  if (fs.existsSync(CHANGELOG_MDX)) {
    const existing = fs.readFileSync(CHANGELOG_MDX, "utf-8");
    // Find the end of the frontmatter + first blank line
    const headerEnd = existing.indexOf("---", existing.indexOf("---") + 3);
    if (headerEnd !== -1) {
      // Find the next newline after closing ---
      let insertPos = existing.indexOf("\n", headerEnd) + 1;
      // Skip blank lines after frontmatter
      while (insertPos < existing.length && existing[insertPos] === "\n") {
        insertPos++;
      }
      const before = existing.slice(0, insertPos);
      const after = existing.slice(insertPos);
      fs.writeFileSync(CHANGELOG_MDX, before + newBlocks.join("") + after);
    } else {
      // No frontmatter found, prepend after header
      fs.writeFileSync(CHANGELOG_MDX, CHANGELOG_HEADER + newBlocks.join("") + existing);
    }
  } else {
    // Create new file from scratch — process all versions
    console.log("\nNo existing changelog.mdx, generating full file...");
    const allBlocks: string[] = [];
    for (const [minorVersion, minorReleases] of sortedMinorVersions) {
      if (newBlocks.length > 0 && newVersions.some((v) => v.version === minorVersion)) {
        // Already processed above
        continue;
      }
      // For existing cached versions, we need to regenerate their blocks
      // This only happens on first run when there's no changelog.mdx
      minorReleases.sort((a, b) => {
        const vA = parseVersion(a.tag_name);
        const vB = parseVersion(b.tag_name);
        if (!vA || !vB) return 0;
        return vA.patch - vB.patch;
      });
      const releaseDate = minorReleases[0].published_at?.split("T")[0] || "Unknown";
      const mergedBody = minorReleases
        .map((r) => `## ${r.tag_name}\n\n${r.body}`)
        .join("\n\n---\n\n");

      const rawContent = await extractChangelog(mergedBody);
      const content = cleanContent(rawContent);
      if (content.trim()) {
        allBlocks.push(buildUpdateBlock(minorVersion, releaseDate, content));
      }
      cache[minorVersion] = true;
      saveCache(cache);
    }
    fs.writeFileSync(CHANGELOG_MDX, CHANGELOG_HEADER + newBlocks.join("") + allBlocks.join(""));
  }

  console.log(`\nUpdated: ${CHANGELOG_MDX}`);
  console.log(`Added ${newBlocks.length} new version(s)`);
}

main().catch(console.error);
