#!/usr/bin/env node

/**
 * Checks for missing redirects and unused redirects by comparing URLs visited
 * on meilisearch.com/docs/* (from Fathom Analytics, last 90 days) against the
 * current docs pages and redirects in docs.json.
 *
 * Required env vars (can be set in .env at repo root):
 *   FATHOM_API_KEY  - Fathom Analytics API token
 *   FATHOM_SITE_ID  - Fathom site ID for meilisearch.com
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const MIN_VIEWS = 1;

// ---------------------------------------------------------------------------
// Load .env manually (no external dependency)
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = path.join(REPO_ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const FATHOM_API_KEY = process.env.FATHOM_API_KEY;
const FATHOM_SITE_ID = process.env.FATHOM_SITE_ID;

if (!FATHOM_API_KEY || !FATHOM_SITE_ID) {
  console.error(
    "Missing FATHOM_API_KEY or FATHOM_SITE_ID. Set them in .env or as environment variables."
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Fathom API
// ---------------------------------------------------------------------------
const FATHOM_API = "https://api.usefathom.com/v1";

async function fetchDocsPaths() {
  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const dateFrom = ninetyDaysAgo.toISOString().slice(0, 19).replace("T", " ");
  const dateTo = now.toISOString().slice(0, 19).replace("T", " ");

  const params = new URLSearchParams({
    entity: "pageview",
    entity_id: FATHOM_SITE_ID,
    aggregates: "pageviews",
    field_grouping: "pathname",
    sort_by: "pageviews:desc",
    date_from: dateFrom,
    date_to: dateTo,
    timezone: "UTC",
    limit: "10000",
  });

  const filters = JSON.stringify([
    { property: "pathname", operator: "is like", value: "/docs/*" },
  ]);
  params.set("filters", filters);

  const url = `${FATHOM_API}/aggregations?${params}`;

  console.log("Fetching page view data from Fathom Analytics (last 90 days)...");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${FATHOM_API_KEY}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Fathom API error ${res.status}: ${body}`);
  }

  const result = await res.json();

  if (!Array.isArray(result)) {
    throw new Error(`Unexpected Fathom response format: ${JSON.stringify(result).slice(0, 200)}`);
  }

  // Return ALL paths (no min filter) so we can check redirects too
  const paths = new Map();
  for (const row of result) {
    const views = parseInt(row.pageviews, 10) || 0;
    paths.set(row.pathname, views);
  }

  console.log(`Fetched ${result.length} unique paths from Fathom\n`);
  return paths;
}

// ---------------------------------------------------------------------------
// Local docs pages + sitemap
// ---------------------------------------------------------------------------
const SITEMAP_URL = "https://www.meilisearch.com/docs/sitemap.xml";

async function getDocsPages() {
  const pages = new Set();

  // 1. Local .mdx files
  function walk(dir, prefix) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        if (
          entry.name.startsWith(".") ||
          entry.name === "node_modules" ||
          entry.name === "assets" ||
          entry.name === "snippets" ||
          entry.name === "api_v0"
        ) {
          continue;
        }
        walk(fullPath, relPath);
      } else if (entry.name.endsWith(".mdx")) {
        const urlPath = "/docs/" + relPath.replace(/\.mdx$/, "");
        pages.add(urlPath);
      }
    }
  }

  walk(REPO_ROOT, "");

  // 2. Production sitemap (includes OpenAPI-generated routes)
  console.log("Fetching production sitemap...");
  try {
    const res = await fetch(SITEMAP_URL);
    if (res.ok) {
      const xml = await res.text();
      const locRegex = /<loc>https:\/\/www\.meilisearch\.com(\/docs\/[^<]+)<\/loc>/g;
      let match;
      while ((match = locRegex.exec(xml)) !== null) {
        pages.add(match[1]);
      }
      console.log(`Sitemap loaded (${pages.size} total known pages)\n`);
    } else {
      console.log(`Warning: could not fetch sitemap (${res.status}), using local files only\n`);
    }
  } catch (err) {
    console.log(`Warning: could not fetch sitemap (${err.message}), using local files only\n`);
  }

  return pages;
}

function resolveRef(value) {
  if (value && typeof value === "object" && "$ref" in value) {
    const refPath = path.resolve(REPO_ROOT, value["$ref"]);
    return JSON.parse(fs.readFileSync(refPath, "utf-8"));
  }
  return value;
}

function getRedirects() {
  const docsJsonPath = path.join(REPO_ROOT, "docs.json");
  const docsJson = JSON.parse(fs.readFileSync(docsJsonPath, "utf-8"));
  const redirects = []; // { source, destination }

  const rawRedirects = resolveRef(docsJson.redirects);

  if (Array.isArray(rawRedirects)) {
    for (const r of rawRedirects) {
      redirects.push({
        source: r.source,
        sourceFull: "/docs" + r.source,
        destination: r.destination,
      });
    }
  }

  return redirects;
}

// ---------------------------------------------------------------------------
// Suggest destination for a missing redirect
// ---------------------------------------------------------------------------
const NOISE_WORDS = new Set([
  "learn", "guides", "reference", "api", "docs", "the", "and", "for",
  "with", "how", "to", "a", "an", "of", "in", "on", "at", "get", "set",
  "use", "using", "what", "is", "are", "overview", "guide", "tutorial",
]);

function tokenize(urlPath) {
  return urlPath
    .split(/[\/\-_]/)
    .map((t) => t.toLowerCase())
    .filter((t) => t.length > 1 && !NOISE_WORDS.has(t));
}

function suggestDestination(missingPath, docsPages) {
  const queryTokens = new Set(tokenize(missingPath));
  if (queryTokens.size === 0) return null;

  // For old /reference/api/... paths, prefer new /reference/api/... destinations
  // by boosting pages that share the same top-level section.
  const isRefPath = missingPath.includes("/reference/");

  let bestScore = 0;
  let bestPage = null;

  for (const page of docsPages) {
    const pageTokens = new Set(tokenize(page));
    let score = 0;
    for (const t of queryTokens) {
      if (pageTokens.has(t)) score++;
    }

    // Boost reference-to-reference matches to avoid capability pages winning on ties
    if (isRefPath && page.includes("/docs/reference/")) {
      score += 0.5;
    }

    if (score > bestScore) {
      bestScore = score;
      bestPage = page;
    }
  }

  if (bestScore === 0) return null;
  // Return as a docs-relative path (strip /docs prefix)
  return bestPage.replace(/^\/docs/, "");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const fathomPaths = await fetchDocsPaths();
  const docsPages = await getDocsPages();
  const redirects = getRedirects();

  const redirectSourceSet = new Set(redirects.map((r) => r.sourceFull));

  // -------------------------------------------------------------------------
  // 1. Missing redirects: URLs with traffic but no page or redirect
  // -------------------------------------------------------------------------
  const missingRedirects = [];

  for (const [pathname, views] of fathomPaths) {
    if (!pathname.startsWith("/docs/")) continue;
    if (views < MIN_VIEWS) continue;

    let normalized = pathname.split("#")[0].split("?")[0];
    if (normalized.endsWith("/")) normalized = normalized.slice(0, -1);

    if (docsPages.has(normalized)) continue;
    if (redirectSourceSet.has(normalized)) continue;

    if (normalized.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|json|xml|woff2?|ttf|eot)$/i)) continue;

    // Skip junk paths (broken URLs, internal framework paths, bot injections, double /docs/)
    if (normalized.match(/\.(Version|Database|html)$/i)) continue;
    if (normalized.endsWith(".")) continue;
    if (normalized.includes("/src/_props/")) continue;
    if (normalized.startsWith("/docs/docs/")) continue;
    if (normalized.startsWith("/docs/error/")) continue;
    if (normalized.startsWith("/docs/create/")) continue;
    if (normalized.startsWith("/docs/_next")) continue;
    if (normalized.startsWith("/docs/_mintlify")) continue;
    if (normalized.includes(" ")) continue; // paths with spaces are malformed/bot traffic
    if (normalized.includes("<")) continue; // HTML injection attempts
    if (normalized.match(/[*")\]\\(]$/)) continue; // trailing special chars (malformed URLs)
    if (normalized.match(/\.\w{0,3}[^a-z0-9]$/i)) continue; // trailing dot+non-alphanum (e.g. ".(")

    missingRedirects.push({ path: normalized, views });
  }

  // Deduplicate
  const dedupedMissing = new Map();
  for (const { path: p, views } of missingRedirects) {
    dedupedMissing.set(p, Math.max(dedupedMissing.get(p) || 0, views));
  }

  const sortedMissing = [...dedupedMissing.entries()]
    .map(([p, views]) => ({ path: p, views }))
    .sort((a, b) => b.views - a.views);

  // -------------------------------------------------------------------------
  // 2. Unused redirects: existing redirects with zero traffic
  // -------------------------------------------------------------------------
  const unusedRedirects = [];

  for (const r of redirects) {
    const views = fathomPaths.get(r.sourceFull) || 0;
    if (views === 0) {
      unusedRedirects.push(r);
    }
  }

  // -------------------------------------------------------------------------
  // Output
  // -------------------------------------------------------------------------
  const outputLines = [
    `Redirects report - ${new Date().toISOString().slice(0, 10)}`,
    "",
  ];

  // Missing redirects
  console.log(`=== MISSING REDIRECTS ===`);
  console.log(`URLs with >= ${MIN_VIEWS} views but no page or redirect: ${sortedMissing.length}\n`);

  if (sortedMissing.length > 0) {
    console.log("Views  | Path  ->  Suggested destination");
    console.log("-------|-----");
    for (const { path: p, views } of sortedMissing) {
      const suggestion = suggestDestination(p, docsPages);
      const hint = suggestion ? `  ->  ${suggestion}` : "";
      console.log(`${String(views).padStart(6)} | ${p}${hint}`);
    }
  }

  outputLines.push(
    `=== MISSING REDIRECTS ===`,
    `URLs with >= ${MIN_VIEWS} views in the last 90 days that have no matching page or redirect.`,
    `Count: ${sortedMissing.length}`,
    "",
    "Views  | Path",
    "-------|-----",
    ...sortedMissing.map(({ path: p, views }) => `${String(views).padStart(6)} | ${p}`),
    "",
  );

  // Unused redirects
  console.log(`\n=== UNUSED REDIRECTS ===`);
  console.log(`Redirects with zero traffic in the last 90 days: ${unusedRedirects.length} / ${redirects.length} total\n`);

  if (unusedRedirects.length > 0) {
    console.log("Source -> Destination");
    console.log("------------------");
    for (const r of unusedRedirects) {
      console.log(`${r.source} -> ${r.destination}`);
    }
  }

  outputLines.push(
    `=== UNUSED REDIRECTS ===`,
    `Redirects in docs.json with zero traffic in the last 90 days (candidates for removal).`,
    `Count: ${unusedRedirects.length} / ${redirects.length} total`,
    "",
    "Source -> Destination",
    "---------------------",
    ...unusedRedirects.map((r) => `${r.source} -> ${r.destination}`),
  );

  const outputPath = path.join(REPO_ROOT, "missing-redirects.txt");
  fs.writeFileSync(outputPath, outputLines.join("\n") + "\n");
  console.log(`\nReport written to ${outputPath}`);

  if (unusedRedirects.length > 0 && sortedMissing.length === 0) {
    console.log(`\n::warning::${unusedRedirects.length} unused redirect(s) found with zero traffic in 90 days. Consider removing them from config/redirects.json.`);
  }

  if (sortedMissing.length > 0) {
    console.error(`\nERROR: ${sortedMissing.length} missing redirect(s) found. Add them to config/redirects.json before merging.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
