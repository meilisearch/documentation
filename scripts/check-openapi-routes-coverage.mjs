#!/usr/bin/env node
/**
 * Checks that every route in the OpenAPI spec is listed in docs.json's API Routes pages.
 *
 * Usage:
 *   node scripts/check-openapi-routes-coverage.mjs [path-to-openapi] [path-to-docs-json]
 *
 * Exits with code 1 if any OpenAPI routes are missing from docs.json.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const OPENAPI_PATH = resolve(
  process.cwd(),
  process.argv[2] || "assets/open-api/meilisearch-openapi-mintlify.json"
);
const DOCS_JSON_PATH = resolve(
  process.cwd(),
  process.argv[3] || "docs.json"
);

const HTTP_METHODS = ["get", "post", "put", "patch", "delete", "head", "options"];

// --- Extract all routes from OpenAPI spec ---
function getOpenapiRoutes(spec) {
  const routes = new Set();
  const paths = spec.paths || {};
  for (const [path, pathItem] of Object.entries(paths)) {
    if (typeof pathItem !== "object" || pathItem === null) continue;
    for (const method of HTTP_METHODS) {
      if (pathItem[method]) {
        routes.add(`${method.toUpperCase()} ${path}`);
      }
    }
  }
  return routes;
}

// --- Recursively collect all page strings from a pages array ---
function collectPageStrings(pages) {
  const strings = new Set();
  if (!Array.isArray(pages)) return strings;
  for (const entry of pages) {
    if (typeof entry === "string") {
      strings.add(entry);
    } else if (typeof entry === "object" && entry !== null) {
      if (entry.pages) {
        for (const s of collectPageStrings(entry.pages)) {
          strings.add(s);
        }
      }
    }
  }
  return strings;
}

// --- Find the API Routes group with openapi config in docs.json ---
function getDocsJsonRoutes(docsJson) {
  // Walk the entire docs.json tree to find objects with "openapi" and "pages" keys
  const routes = new Set();

  function walk(obj) {
    if (Array.isArray(obj)) {
      obj.forEach(walk);
    } else if (typeof obj === "object" && obj !== null) {
      // Found an API Routes block with openapi config and pages
      if (obj.openapi && obj.pages) {
        for (const s of collectPageStrings(obj.pages)) {
          routes.add(s);
        }
      }
      // Keep walking nested structures
      for (const value of Object.values(obj)) {
        walk(value);
      }
    }
  }

  walk(docsJson);
  return routes;
}

// --- Normalize route strings for comparison ---
// OpenAPI uses {param_name} with underscores, docs.json uses {paramName} camelCase
// e.g. OpenAPI: GET /indexes/{index_uid} vs docs.json: GET /indexes/{indexUid}
function normalizeRoute(route) {
  return route.replace(/\{([^}]+)\}/g, (_, param) => {
    // Convert snake_case to camelCase
    const camel = param.replace(/_([a-z])/g, (__, c) => c.toUpperCase());
    return `{${camel}}`;
  });
}

// --- Main ---
const spec = JSON.parse(readFileSync(OPENAPI_PATH, "utf8"));
const docsJson = JSON.parse(readFileSync(DOCS_JSON_PATH, "utf8"));

const openapiRoutes = getOpenapiRoutes(spec);
const docsJsonRoutes = getDocsJsonRoutes(docsJson);

// Normalize both sets for comparison
const normalizedDocsRoutes = new Set([...docsJsonRoutes].map(normalizeRoute));

const missing = [];
const extra = [];

for (const route of [...openapiRoutes].sort()) {
  const normalized = normalizeRoute(route);
  if (!normalizedDocsRoutes.has(normalized)) {
    missing.push(route);
  }
}

for (const route of [...docsJsonRoutes].sort()) {
  const normalized = normalizeRoute(route);
  const normalizedOpenapi = new Set([...openapiRoutes].map(normalizeRoute));
  if (!normalizedOpenapi.has(normalized)) {
    extra.push(route);
  }
}

// --- Report ---
console.log(`OpenAPI routes: ${openapiRoutes.size}`);
console.log(`docs.json routes: ${docsJsonRoutes.size}`);
console.log("");

if (missing.length > 0) {
  console.error(
    `⚠  ${missing.length} OpenAPI route(s) missing from docs.json:\n`
  );
  for (const route of missing) {
    console.error(`  - ${route}`);
  }
  console.error("");
}

if (extra.length > 0) {
  console.warn(
    `ℹ  ${extra.length} docs.json route(s) not found in OpenAPI spec:\n`
  );
  for (const route of extra) {
    console.warn(`  - ${route}`);
  }
  console.warn("");
}

if (missing.length === 0 && extra.length === 0) {
  console.log("✓ All OpenAPI routes are covered in docs.json and vice versa.");
}

if (missing.length > 0) {
  process.exit(1);
}
