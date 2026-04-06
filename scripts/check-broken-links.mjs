#!/usr/bin/env node

/**
 * Checks for broken internal links in MDX documentation files.
 *
 * Scans all .mdx files for internal links (markdown syntax and href attributes),
 * then verifies each target path exists as either:
 *   - A local MDX page
 *   - An OpenAPI-generated reference page (derived from the OpenAPI spec)
 *   - A redirect source (which resolves to a valid page)
 *
 * No external API calls or secrets required — runs entirely from local files.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Resolve $ref in docs.json
// ---------------------------------------------------------------------------
function resolveRef(value) {
  if (value && typeof value === "object" && "$ref" in value) {
    const refPath = path.resolve(REPO_ROOT, value["$ref"]);
    try {
      return JSON.parse(fs.readFileSync(refPath, "utf-8"));
    } catch (err) {
      throw new Error(`Failed to resolve $ref "${value["$ref"]}" (${refPath}): ${err.message}`);
    }
  }
  return value;
}

// ---------------------------------------------------------------------------
// Build the set of valid /docs/* paths
// ---------------------------------------------------------------------------

/**
 * Slugify a string the same way Mintlify does when generating URLs from
 * OpenAPI operation summaries: strip apostrophes, then replace non-alphanumeric
 * runs with hyphens.
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[`']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildValidPaths() {
  const valid = new Set();

  // 1. Local MDX files → /docs/<relative-path-without-.mdx>
  const IGNORED_DIRS = new Set([".git", "node_modules", "assets", "snippets", "api_v0", ".mintlify"]);

  function walkMdx(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) walkMdx(path.join(dir, entry.name));
      } else if (entry.name.endsWith(".mdx")) {
        const rel = path.relative(REPO_ROOT, path.join(dir, entry.name));
        valid.add("/docs/" + rel.replace(/\.mdx$/, "").replace(/\\/g, "/"));
      }
    }
  }
  walkMdx(REPO_ROOT);

  // 2. OpenAPI-generated reference pages
  //    Mintlify generates one page per operation: /docs/reference/api/<tag-slug>/<summary-slug>
  //    This matches the pattern observed in the live sitemap.
  const openapiPath = path.join(REPO_ROOT, "assets/open-api/meilisearch-openapi-mintlify.json");
  if (fs.existsSync(openapiPath)) {
    const openapi = JSON.parse(fs.readFileSync(openapiPath, "utf-8"));
    for (const [, methods] of Object.entries(openapi.paths || {})) {
      for (const [, operation] of Object.entries(methods)) {
        if (!operation || typeof operation !== "object") continue;
        const tags = Array.isArray(operation.tags) ? operation.tags : ["untagged"];
        const summary = operation.summary || "";
        if (!summary) continue;
        const tag = tags[0] || "untagged";
        valid.add(`/docs/reference/api/${slugify(tag)}/${slugify(summary)}`);
      }
    }
  }

  // 3. Redirect sources — visiting a redirect source is valid (it just redirects)
  const docsJson = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "docs.json"), "utf-8"));
  const redirects = resolveRef(docsJson.redirects);
  if (Array.isArray(redirects)) {
    for (const r of redirects) {
      if (r.source) valid.add("/docs" + r.source);
    }
  }

  return valid;
}

// ---------------------------------------------------------------------------
// Extract internal links from MDX content
// ---------------------------------------------------------------------------

const INTERNAL_LINK_RE = /(?:\[(?:[^\]]*)\]\(|href=")(\/?[^)"#?\s][^)"#?\s]*)/g;

function extractInternalLinks(content) {
  const links = [];
  let match;
  while ((match = INTERNAL_LINK_RE.exec(content)) !== null) {
    const href = match[1];
    // Only absolute internal paths (start with /)
    if (!href.startsWith("/")) continue;
    // Skip external URLs
    if (href.startsWith("//") || href.startsWith("/http")) continue;
    // Skip asset paths — those are static files, not doc pages
    if (href.startsWith("/assets/")) continue;
    links.push(href);
  }
  return links;
}

// ---------------------------------------------------------------------------
// Scan all MDX files for broken links
// ---------------------------------------------------------------------------

function scanMdxFiles(validPaths) {
  const broken = []; // { file, link, line }
  const IGNORED_DIRS = new Set([".git", "node_modules", "assets", "snippets", ".mintlify"]);

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) walk(path.join(dir, entry.name));
      } else if (entry.name.endsWith(".mdx")) {
        const filePath = path.join(dir, entry.name);
        const content = fs.readFileSync(filePath, "utf-8");
        const lines = content.split("\n");

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          let match;
          // Reset regex state for each line
          const re = /(?:\[(?:[^\]]*)\]\(|href=")(\/?[^)"#?\s][^)"#?\s]*)/g;
          while ((match = re.exec(line)) !== null) {
            const href = match[1];
            if (!href.startsWith("/")) continue;
            if (href.startsWith("//")) continue;
            if (href.startsWith("/assets/")) continue;

            // Normalize: strip trailing slash, anchor, query string
            const normalized = href.split("?")[0].split("#")[0].replace(/\/$/, "");
            if (!normalized || normalized === "/") continue;

            // The link target is relative to /docs — add prefix if missing
            const fullPath = normalized.startsWith("/docs/")
              ? normalized
              : "/docs" + normalized;

            if (!validPaths.has(fullPath)) {
              broken.push({
                file: path.relative(REPO_ROOT, filePath),
                link: href,
                line: i + 1,
              });
            }
          }
        }
      }
    }
  }

  walk(REPO_ROOT);
  return broken;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("Building valid path set from local MDX files and OpenAPI spec...");
const validPaths = buildValidPaths();
console.log(`  ${validPaths.size} valid paths found\n`);

console.log("Scanning MDX files for broken internal links...");
const broken = scanMdxFiles(validPaths);

if (broken.length === 0) {
  console.log("No broken internal links found.");
  process.exit(0);
}

// Group by file for readable output
const byFile = new Map();
for (const { file, link, line } of broken) {
  if (!byFile.has(file)) byFile.set(file, []);
  byFile.get(file).push({ link, line });
}

const sortedFiles = [...byFile.entries()].sort(([a], [b]) => a.localeCompare(b));

console.log(`\nFound ${broken.length} broken internal link(s) across ${byFile.size} file(s):\n`);
const outputLines = [`${broken.length} broken internal link(s) across ${byFile.size} file(s):\n`];

for (const [file, links] of sortedFiles) {
  console.log(`  ${file}`);
  outputLines.push(`  ${file}`);
  for (const { link, line } of links) {
    console.log(`    line ${String(line).padStart(4)}: ${link}`);
    outputLines.push(`    line ${String(line).padStart(4)}: ${link}`);
  }
  console.log();
  outputLines.push("");
}

// Write report
const outputPath = path.join(REPO_ROOT, "broken-links.txt");
fs.writeFileSync(outputPath, outputLines.join("\n"), "utf-8");
console.log(`Report written to ${path.relative(REPO_ROOT, outputPath)}`);

process.exit(1);
