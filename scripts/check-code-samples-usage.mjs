#!/usr/bin/env node
/**
 * Checks that every code sample in .code-samples.meilisearch.yaml is properly used.
 *
 * 1. Samples preceded by a "# <word>" comment (single word on its own line):
 *    → verify the word maps to an existing {method}/{path} route in the OpenAPI spec.
 *      Underscores in the word correspond to "/" and "-" in the OpenAPI path.
 *      e.g. "get_indexes_indexUid_settings_stop_words"
 *         → GET /indexes/{indexUid}/settings/stop-words
 *
 * 2. Samples without such a comment:
 *    → verify the associated snippet (code_samples_<key>.mdx) is imported
 *      somewhere in the documentation .mdx pages.
 *
 * Exits with code 1 if any issues are found.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const YAML_PATH = path.join(ROOT, '.code-samples.meilisearch.yaml');
const OPENAPI_PATH = path.join(
  ROOT,
  'assets',
  'open-api',
  'meilisearch-openapi-mintlify.json'
);

const HTTP_METHODS = new Set([
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
  'options',
  'trace',
]);

// ──────────────────────────────────────────────────────────────
// 1. Parse the raw YAML to extract keys and their preceding comments
// ──────────────────────────────────────────────────────────────
const yamlLines = fs.readFileSync(YAML_PATH, 'utf-8').split('\n');

const withComment = []; // { key, commentWord }
const withoutComment = []; // key[]

for (let i = 0; i < yamlLines.length; i++) {
  // Top-level YAML key: starts at column 0 with a word followed by ":"
  const keyMatch = yamlLines[i].match(/^(\w+)\s*:/);
  if (!keyMatch) continue;

  const key = keyMatch[1];

  // Check the immediately preceding line for a single-word comment
  // Format: "# <single_word>" and nothing else on the line
  let commentWord = null;
  if (i > 0) {
    const prev = yamlLines[i - 1];
    const cm = prev.match(/^#\s+(\S+)\s*$/);
    if (cm) commentWord = cm[1];
  }

  if (commentWord) {
    withComment.push({ key, commentWord });
  } else {
    withoutComment.push(key);
  }
}

console.log(
  `Found ${withComment.length} sample(s) with route comment, ` +
    `${withoutComment.length} sample(s) without.\n`
);

// ──────────────────────────────────────────────────────────────
// 2. Build the set of route identifiers from the OpenAPI spec
// ──────────────────────────────────────────────────────────────
const openapi = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf-8'));

/**
 * Normalizes an OpenAPI path + HTTP method into the identifier format used
 * in the YAML comments.
 *
 *   ("get", "/indexes/{indexUid}/settings/stop-words")
 *   → "get_indexes_indexUid_settings_stop_words"
 */
function routeId(method, pathStr) {
  const normalized = pathStr
    .replace(/^\//, '') // strip leading /
    .replace(/[{}]/g, '') // {indexUid} → indexUid
    .replace(/[/-]/g, '_'); // / and - → _
  return `${method}_${normalized}`;
}

const routeIds = new Set();

for (const [pathStr, methods] of Object.entries(openapi.paths)) {
  for (const method of Object.keys(methods)) {
    if (HTTP_METHODS.has(method)) {
      routeIds.add(routeId(method, pathStr));
    }
  }
}

// ──────────────────────────────────────────────────────────────
// 3. Validate route-tagged samples
// ──────────────────────────────────────────────────────────────
const badRoutes = [];

for (const { key, commentWord } of withComment) {
  if (!routeIds.has(commentWord)) {
    badRoutes.push({ key, commentWord });
  }
}

if (badRoutes.length > 0) {
  console.error(
    `❌ ${badRoutes.length} sample(s) reference a route not found in the OpenAPI spec:\n`
  );
  for (const { key, commentWord } of badRoutes) {
    console.error(`  ${key}  →  # ${commentWord}`);
  }
  console.error('');
} else {
  console.log('✅ All route-tagged samples match a valid OpenAPI path.\n');
}

// ──────────────────────────────────────────────────────────────
// 4. For samples without a route comment, check snippet usage in docs
// ──────────────────────────────────────────────────────────────
function collectFiles(dir, extensions, excludeDirs) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        excludeDirs.has(full) ||
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === '.next' ||
        entry.name === '.mintlify'
      ) {
        continue;
      }
      results = results.concat(collectFiles(full, extensions, excludeDirs));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

// Exclude the generated snippet files themselves — we want to find where
// snippets are *used*, not where they are *defined*.
const excludeDirs = new Set([path.join(ROOT, 'snippets', 'samples')]);
const docFiles = collectFiles(ROOT, ['.mdx', '.md'], excludeDirs);

// Build a combined string of all doc content for fast substring search
const allDocsContent = docFiles
  .map((f) => fs.readFileSync(f, 'utf-8'))
  .join('\n');

const unusedSnippets = [];

for (const key of withoutComment) {
  const snippetRef = `code_samples_${key}`;
  if (!allDocsContent.includes(snippetRef)) {
    unusedSnippets.push(key);
  }
}

if (unusedSnippets.length > 0) {
  console.error(
    `❌ ${unusedSnippets.length} sample(s) without route comment are not referenced in any doc page.\n`
  );
  console.error(
    'These code samples can be removed from .code-samples.meilisearch.yaml\n'
  );
  for (const key of unusedSnippets) {
    console.error(`  - ${key}`);
  }
  console.error('');
} else {
  console.log(
    '✅ All non-route-tagged samples are referenced in the documentation.\n'
  );
}

// ──────────────────────────────────────────────────────────────
// 5. Exit
// ──────────────────────────────────────────────────────────────
if (badRoutes.length > 0 || unusedSnippets.length > 0) {
  process.exit(1);
}

console.log(
  'All code samples in .code-samples.meilisearch.yaml are properly used.'
);
process.exit(0);
