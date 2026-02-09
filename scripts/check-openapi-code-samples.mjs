#!/usr/bin/env node
/**
 * Checks OpenAPI Mintlify file for code samples.
 * Usage:
 *   node check-openapi-code-samples.mjs curl-check [path-to-openapi]
 *   node check-openapi-code-samples.mjs info [path-to-openapi]
 *
 * curl-check: Exits 1 if any route (method + path) has no cURL code sample.
 * info: Prints report of missing code sample langs per route (never exits with error).
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const OPENAPI_PATH = resolve(
  process.cwd(),
  process.argv[3] || 'assets/open-api/meilisearch-openapi-mintlify.json'
);

const spec = JSON.parse(readFileSync(OPENAPI_PATH, 'utf8'));
const paths = spec.paths || {};
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];

function getOperations() {
  const ops = [];
  for (const [path, pathItem] of Object.entries(paths)) {
    if (typeof pathItem !== 'object' || pathItem === null) continue;
    for (const method of HTTP_METHODS) {
      const op = pathItem[method];
      if (op && typeof op === 'object') {
        ops.push({ path, method, operation: op });
      }
    }
  }
  return ops;
}

function getLangs(samples) {
  if (!Array.isArray(samples)) return [];
  return samples.map((s) => s?.lang).filter(Boolean);
}

function hasCurl(samples) {
  return getLangs(samples).some((lang) => String(lang) === 'cURL');
}

// --- curl-check mode: fail if any route has no cURL sample
function runCurlCheck() {
  const missing = [];
  for (const { path, method, operation } of getOperations()) {
    const samples = operation['x-codeSamples'];
    if (!hasCurl(samples)) {
      missing.push(`${method.toUpperCase()} ${path}`);
    }
  }
  if (missing.length > 0) {
    console.error('Routes missing a "cURL" code sample:\n');
    missing.forEach((r) => console.error('  -', r));
    process.exit(1);
  }
  console.log('OK: Every route includes a cURL code sample.');
}

// --- info mode: list all routes and missing code sample langs (never fail)
function runInfo() {
  const allLangs = new Set();
  for (const { operation } of getOperations()) {
    const samples = operation['x-codeSamples'];
    if (Array.isArray(samples)) {
      for (const s of samples) {
        if (s?.lang) allLangs.add(String(s.lang));
      }
    }
  }
  const sortedLangs = [...allLangs].sort();

  const rows = [];
  for (const { path, method, operation } of getOperations()) {
    const samples = operation['x-codeSamples'];
    const route = `${method.toUpperCase()} ${path}`;
    if (!Array.isArray(samples) || samples.length === 0) {
      rows.push({
        route,
        missing: sortedLangs.length ? sortedLangs : [],
        note: 'no x-codeSamples',
      });
      continue;
    }
    const present = new Set(getLangs(samples));
    const missing = sortedLangs.filter((lang) => !present.has(lang));
    if (missing.length > 0) {
      rows.push({ route, missing, note: null });
    }
  }

  console.log('OpenAPI code samples – missing languages per route (informational only):\n');
  if (rows.length === 0) {
    console.log('No routes with missing code samples.');
    return;
  }
  console.log('Reference languages in file:', sortedLangs.join(', '));
  console.log('');

  // 1. Routes and their missing code samples
  console.log('--- Routes and missing code samples ---\n');
  for (const { route, missing, note } of rows) {
    if (note) {
      console.log(`${route}`);
      console.log(`  → ${note}`);
    } else {
      console.log(`${route}`);
      console.log(`  → missing: ${missing.join(', ')}`);
    }
  }

  // 2. Routes missing per language
  const routesByMissingLang = new Map();
  for (const lang of sortedLangs) {
    routesByMissingLang.set(lang, []);
  }
  for (const { route, missing, note } of rows) {
    for (const lang of missing) {
      routesByMissingLang.get(lang).push(route);
    }
  }
  console.log('\n--- Routes missing per language ---\n');
  for (const lang of sortedLangs) {
    const routeList = routesByMissingLang.get(lang);
    if (routeList.length === 0) continue;
    console.log(`${lang}: ${routeList.length} examples missing`);
    for (const r of routeList) {
      console.log(`  - ${r}`);
    }
    console.log('');
  }
}

const mode = process.argv[2];
if (mode === 'curl-check') {
  runCurlCheck();
} else if (mode === 'info') {
  runInfo();
} else {
  console.error('Usage: check-openapi-code-samples.mjs <curl-check|info> [path-to-openapi]');
  process.exit(2);
}
