import { Octokit } from "@octokit/rest";
import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";

const GITHUB_OWNER = "meilisearch";
const GITHUB_REPO = "meilisearch";

const octokit = new Octokit();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Paths relative to project root (documentation/)
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_ROOT = path.dirname(SCRIPT_DIR);
const RELEASES_DIR = path.join(PROJECT_ROOT, "changelog", "releases");
const MINOR_DIR = path.join(PROJECT_ROOT, "changelog", "minor");
const CHANGELOG_MDX = path.join(PROJECT_ROOT, "changelog", "changelog.mdx");
const CHANGELOG_JSON = path.join(PROJECT_ROOT, "changelog", "changelog.json");
const CACHE_PATH = path.join(PROJECT_ROOT, "changelog", ".cache.json");

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

interface FeatureEntry {
  feature: string;
  version: string;
  date: string;
}

interface CacheData {
  releases: Record<string, boolean>;
  changelogs: Record<string, { content: string; date: string }>;
  features: FeatureEntry[];
}

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
  // Find all ```json blocks and reformat them
  return content.replace(/```json\n([\s\S]*?)```/g, (match, jsonContent) => {
    try {
      // Try to parse and reformat the JSON
      const parsed = JSON.parse(jsonContent.trim());
      return "```json\n" + JSON.stringify(parsed, null, 2) + "\n```";
    } catch {
      // If parsing fails, return original
      return match;
    }
  });
}

function reorderSections(content: string): string {
  // Extract sections and reorder them: New Features > Improvements > Other
  const sections: { [key: string]: string } = {};
  const sectionOrder = ["## New Features", "## Improvements", "## Other"];

  // Split content by ## headers
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
      // Content before any section header
      preamble = part.trim();
    }
  }

  // Rebuild in correct order
  const orderedParts: string[] = [];
  if (preamble) orderedParts.push(preamble);

  for (const header of sectionOrder) {
    if (sections[header]) {
      orderedParts.push(sections[header]);
    }
  }

  return orderedParts.join("\n\n");
}

function cleanContent(content: string): string {
  let cleaned = content
    // Remove GitHub usernames (@username)
    .replace(/\s+by\s+@[\w-]+/gi, "")
    .replace(/@[\w-]+/g, "")
    // Remove GitHub PR/issue links (full URLs)
    .replace(/\s+in\s+https:\/\/github\.com\/[^\s)]+/gi, "")
    .replace(/https:\/\/github\.com\/[\w-]+\/[\w-]+\/(pull|issues|discussions)\/\d+/g, "")
    // Remove short GitHub references (#1234)
    .replace(/\s+in\s+#\d+/gi, "")
    .replace(/\(#\d+\)/g, "")
    .replace(/#\d+/g, "")
    // Clean up leftover artifacts
    .replace(/\s+in\s*$/gm, "")
    .replace(/\s+by\s*$/gm, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\[\s*\]/g, "")
    // Clean up multiple spaces and empty lines
    .replace(/  +/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Format JSON blocks with proper indentation
  cleaned = formatJsonBlocks(cleaned);

  // Reorder sections: New Features > Improvements > Other
  cleaned = reorderSections(cleaned);

  return cleaned;
}

function loadCache(): CacheData {
  if (fs.existsSync(CACHE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
    } catch {
      console.log("Cache file corrupted, starting fresh");
    }
  }
  return { releases: {}, changelogs: {}, features: [] };
}

function saveCache(cache: CacheData): void {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
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

async function extractChangelogOnly(body: string): Promise<string> {
  if (!body.trim()) return "";

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a changelog writer for end users. Transform release notes into a clean, user-friendly changelog.

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
    - Example of good curl + JSON formatting:
      \`\`\`bash
      curl -X POST 'http://localhost:7700/indexes/movies/search' \\
        -H 'Content-Type: application/json' \\
        --data-binary @- << EOF
      {
        "q": "search query",
        "limit": 10
      }
      EOF
      \`\`\`
      OR show JSON separately after the endpoint description

EXCLUDE completely:
- Bug fixes (unless they change behavior significantly)
- Internal maintenance, refactoring, CI/CD changes
- Documentation-only changes
- Dependency updates
- Security patches (unless they add new features)

EXAMPLE OUTPUT:
## New Features

### Vector Search Support
You can now perform vector similarity searches on your documents. This enables semantic search capabilities using embeddings.

To perform a vector search, send a POST request to the search endpoint:

\`\`\`bash
curl -X POST 'http://localhost:7700/indexes/movies/search' \\
  -H 'Content-Type: application/json' \\
  --data-binary @- << EOF
{
  "vector": [0.1, 0.2, 0.3],
  "limit": 10
}
EOF
\`\`\`

The response will include matched documents:

\`\`\`json
{
  "hits": [
    {
      "id": 1,
      "title": "Example Movie"
    }
  ],
  "processingTimeMs": 2
}
\`\`\`

### Custom Metadata for Tasks
Attach metadata to track your document operations:

\`\`\`http
POST /indexes/{indexUid}/documents?customMetadata=my-batch-id
\`\`\`

Sample task response:

\`\`\`json
{
  "uid": 42,
  "status": "succeeded",
  "customMetadata": "my-batch-id"
}
\`\`\`

## Improvements

### Faster Indexing Performance
Indexing large datasets is now up to 2x faster thanks to optimized batch processing. Set the \`MEILI_MAX_INDEXING_MEMORY\` environment variable to control memory usage.

If there's no relevant changelog content (only bug fixes, maintenance, etc.), return an empty string.`,
      },
      {
        role: "user",
        content: body,
      },
    ],
    temperature: 0,
  });

  return response.choices[0]?.message?.content || "";
}

async function extractFeatures(body: string, version: string, date: string): Promise<FeatureEntry[]> {
  if (!body.trim()) return [];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a feature extractor. Given release notes, extract individual features as a JSON array.
Each feature should be a short, descriptive string that could be used to determine what UI to show based on API version.

Focus on:
- New API endpoints
- New search features
- New configuration options
- New capabilities
- Breaking changes that affect functionality

Return a JSON array of strings, each being a feature name/description.
Example: ["vector search", "hybrid search", "facet search", "geosearch radius filter", "sortable attributes"]

If no features found, return an empty array: []
Return ONLY the JSON array, nothing else.`,
      },
      {
        role: "user",
        content: body,
      },
    ],
    temperature: 0,
  });

  const content = response.choices[0]?.message?.content || "[]";
  try {
    const features = JSON.parse(content);
    return features.map((feature: string) => ({
      feature,
      version,
      date,
    }));
  } catch {
    console.warn(`Failed to parse features for ${version}`);
    return [];
  }
}

async function main() {
  // Create directories
  fs.mkdirSync(RELEASES_DIR, { recursive: true });
  fs.mkdirSync(MINOR_DIR, { recursive: true });

  // Load cache
  const cache = loadCache();

  // Fetch all releases
  const releases = await fetchAllReleases();

  // Sort by version (newest first for processing, but we'll reverse for output)
  releases.sort((a, b) => {
    const vA = parseVersion(a.tag_name);
    const vB = parseVersion(b.tag_name);
    if (!vA || !vB) return 0;
    if (vA.major !== vB.major) return vB.major - vA.major;
    if (vA.minor !== vB.minor) return vB.minor - vA.minor;
    return vB.patch - vA.patch;
  });

  // Step 1: Save individual release files
  console.log("\n--- Saving individual release files ---");
  for (const release of releases) {
    const version = parseVersion(release.tag_name);
    if (!version) continue;

    const filename = `${release.tag_name.replace(/^v/, "")}.md`;
    const filepath = path.join(RELEASES_DIR, filename);

    // Skip if already processed
    if (cache.releases[release.tag_name] && fs.existsSync(filepath)) {
      console.log(`  Skipped (cached): ${filename}`);
      continue;
    }

    const content = `# ${release.name}\n\nReleased: ${release.published_at?.split("T")[0] || "Unknown"}\n\n${release.body}`;
    fs.writeFileSync(filepath, content);
    cache.releases[release.tag_name] = true;
    console.log(`  Saved: ${filename}`);
  }

  // Step 2: Group by minor version and create changelog files
  console.log("\n--- Creating changelog files by minor version ---");
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

  // Process each minor version
  const allFeatures: FeatureEntry[] = [...cache.features];
  const mintlifyEntries: { version: string; date: string; content: string }[] = [];

  for (const [minorVersion, minorReleases] of minorVersions) {
    // Sort patches within minor (newest first)
    minorReleases.sort((a, b) => {
      const vA = parseVersion(a.tag_name);
      const vB = parseVersion(b.tag_name);
      if (!vA || !vB) return 0;
      return vB.patch - vA.patch;
    });

    // Get the first release date (oldest patch = first release of this minor)
    const firstRelease = minorReleases[minorReleases.length - 1];
    const releaseDate = firstRelease.published_at?.split("T")[0] || "Unknown";

    // Check if already cached
    if (cache.changelogs[minorVersion]) {
      console.log(`\nSkipped (cached): ${minorVersion}`);
      mintlifyEntries.push({
        version: minorVersion,
        date: cache.changelogs[minorVersion].date,
        content: cache.changelogs[minorVersion].content,
      });
      continue;
    }

    console.log(`\nProcessing ${minorVersion}...`);

    // Merge all bodies
    const mergedBody = minorReleases
      .map((r) => `## ${r.tag_name}\n\n${r.body}`)
      .join("\n\n---\n\n");

    // Extract changelog only using ChatGPT
    console.log(`  Extracting changelog content...`);
    const rawChangelogContent = await extractChangelogOnly(mergedBody);
    const changelogContent = cleanContent(rawChangelogContent);

    if (changelogContent.trim()) {
      // Save changelog file
      const filename = `${minorVersion.replace(/^v/, "")}.md`;
      const filepath = path.join(MINOR_DIR, filename);

      const content = `# ${minorVersion}\n\nFirst released: ${releaseDate}\n\n${changelogContent}`;
      fs.writeFileSync(filepath, content);
      console.log(`  Saved: ${filename}`);

      // Cache the changelog
      cache.changelogs[minorVersion] = { content: changelogContent, date: releaseDate };

      // Add to Mintlify entries
      mintlifyEntries.push({
        version: minorVersion,
        date: releaseDate,
        content: changelogContent,
      });

      // Extract features for JSON
      console.log(`  Extracting features...`);
      const features = await extractFeatures(changelogContent, minorVersion, releaseDate);
      allFeatures.push(...features);

      // Save cache after each version (in case of interruption)
      cache.features = allFeatures;
      saveCache(cache);
    }
  }

  // Step 3: Generate Mintlify changelog.mdx
  console.log("\n--- Generating Mintlify changelog.mdx ---");

  // Sort entries by date (newest first)
  mintlifyEntries.sort((a, b) => b.date.localeCompare(a.date));

  let mintlifyContent = `---
title: "Changelog"
description: "New features and improvements in Meilisearch"
---

`;

  for (const entry of mintlifyEntries) {
    mintlifyContent += `<Update label="${entry.version}" description="${entry.date}">

${entry.content}

</Update>

`;
  }

  fs.writeFileSync(CHANGELOG_MDX, mintlifyContent);
  console.log(`Saved: ${CHANGELOG_MDX}`);

  // Step 4: Generate changelog.json
  console.log("\n--- Generating changelog.json ---");

  // Group features by feature name, keeping the earliest version
  const featureMap = new Map<string, { version: string; date: string }>();

  // Sort all features by version (oldest first) so we get the first introduction
  allFeatures.sort((a, b) => {
    const vA = parseVersion(a.version);
    const vB = parseVersion(b.version);
    if (!vA || !vB) return 0;
    if (vA.major !== vB.major) return vA.major - vB.major;
    if (vA.minor !== vB.minor) return vA.minor - vB.minor;
    return 0;
  });

  for (const feature of allFeatures) {
    const key = feature.feature.toLowerCase();
    if (!featureMap.has(key)) {
      featureMap.set(key, { version: feature.version, date: feature.date });
    }
  }

  const changelogJson = {
    generated_at: new Date().toISOString(),
    features: Array.from(featureMap.entries()).map(([feature, data]) => ({
      feature,
      introduced_in: data.version,
      release_date: data.date,
    })),
  };

  fs.writeFileSync(CHANGELOG_JSON, JSON.stringify(changelogJson, null, 2));
  console.log(`Saved: ${CHANGELOG_JSON}`);

  // Final cache save
  saveCache(cache);

  console.log("\n--- Done! ---");
  console.log(`Total releases processed: ${releases.length}`);
  console.log(`Minor versions: ${minorVersions.size}`);
  console.log(`Features extracted: ${featureMap.size}`);
}

main().catch(console.error);
