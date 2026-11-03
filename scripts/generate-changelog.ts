import { Octokit } from "@octokit/rest";
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import {
  GITHUB_OWNER,
  GITHUB_REPO,
  buildVersionPageFile,
  getMinorVersion,
  getProjectPaths,
  listExistingVersions,
  parseVersion,
  regenerateIndexCards,
  syncChangelogNavigation,
  versionPagePath,
} from "./changelog-utils.js";

const octokit = new Octokit();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const paths = getProjectPaths(path.dirname(SCRIPT_DIR));

interface Release {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
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
      preamble = preamble ? `${preamble}\n\n${part.trim()}` : part.trim();
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

function githubReleaseUrl(minorVersion: string): string {
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/tag/${minorVersion}.0`;
}

function appendGithubLink(content: string, minorVersion: string): string {
  const url = githubReleaseUrl(minorVersion);
  const link = `[Find more information on GitHub](${url})`;
  if (content.includes(link)) return content;
  return `${content}\n\n${link}`;
}

function getExistingVersionLabels(): Set<string> {
  return new Set(listExistingVersions(paths.versionsDir).map((v) => v.label));
}

async function fetchNewReleases(existingVersions: Set<string>): Promise<Release[]> {
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

    let allKnown = true;
    for (const release of data) {
      if (release.draft || release.prerelease) continue;

      const version = parseVersion(release.tag_name);
      if (!version) continue;

      if (version.major < 1) continue;

      const minorKey = getMinorVersion(version);
      if (existingVersions.has(minorKey)) continue;

      allKnown = false;
      releases.push({
        tag_name: release.tag_name,
        name: release.name || release.tag_name,
        body: release.body || "",
        published_at: release.published_at || "",
      });
    }

    if (allKnown) break;

    page++;
  }

  console.log(`Found ${releases.length} new release(s)`);
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
  fs.mkdirSync(paths.versionsDir, { recursive: true });

  const existingVersions = getExistingVersionLabels();
  console.log(`Changelog already has ${existingVersions.size} version(s)`);

  const releases = await fetchNewReleases(existingVersions);
  const releasesByMinor = new Map<string, Release[]>();

  for (const release of releases) {
    const version = parseVersion(release.tag_name);
    if (!version) continue;

    const minorKey = getMinorVersion(version);
    if (!releasesByMinor.has(minorKey)) {
      releasesByMinor.set(minorKey, []);
    }
    releasesByMinor.get(minorKey)!.push(release);
  }

  if (releasesByMinor.size === 0) {
    console.log("\nNo new versions to process.");
  }

  const sortedMinors = [...releasesByMinor.entries()].sort((a, b) => {
    const vA = parseVersion(`${a[0]}.0`);
    const vB = parseVersion(`${b[0]}.0`);
    if (!vA || !vB) return 0;
    if (vA.major !== vB.major) return vB.major - vA.major;
    return vB.minor - vA.minor;
  });

  console.log(`\n--- Processing ${sortedMinors.length} new version(s) ---`);

  let added = 0;
  for (const [minorVersion, patches] of sortedMinors) {
    console.log(`\nProcessing ${minorVersion}...`);

    patches.sort((a, b) => {
      const vA = parseVersion(a.tag_name);
      const vB = parseVersion(b.tag_name);
      if (!vA || !vB) return 0;
      return vA.patch - vB.patch;
    });

    const releaseDate = patches[0].published_at?.split("T")[0] || "Unknown";
    const mergedBody = patches
      .map((p) => `## ${p.tag_name}\n\n${p.body}`)
      .join("\n\n---\n\n");

    const rawContent = await extractChangelog(mergedBody);
    const cleaned = cleanContent(rawContent);

    if (!cleaned.trim()) {
      console.log(`  Skipped (no notable changes): ${minorVersion}`);
      continue;
    }

    const content = appendGithubLink(cleaned, minorVersion);

    const pagePath = versionPagePath(paths.versionsDir, minorVersion);
    const tmpPath = `${pagePath}.tmp`;
    fs.writeFileSync(tmpPath, buildVersionPageFile(minorVersion, releaseDate, content));
    fs.renameSync(tmpPath, pagePath);
    console.log(`  Wrote: ${pagePath}`);
    added++;
  }

  if (added === 0) {
    console.log("\nNo new changelog content to add. Syncing index and navigation anyway.");
  }

  const allVersions = listExistingVersions(paths.versionsDir);
  regenerateIndexCards(paths.indexMdx, allVersions);
  syncChangelogNavigation(
    paths.navJson,
    allVersions.map((v) => v.label)
  );

  console.log(`\nUpdated index: ${paths.indexMdx}`);
  console.log(`Added ${added} new version(s)`);
}

main().catch(console.error);
