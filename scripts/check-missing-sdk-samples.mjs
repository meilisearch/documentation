#!/usr/bin/env node
/**
 * Informational check – never fails.
 *
 * Collects code sample keys from doc imports that start with "CodeSamples"
 * (e.g. "import CodeSamplesTenantTokenGuideSearchSdk1 from '...'"), then
 * compares with each SDK's .code-samples.meilisearch.yaml (fetched from GitHub).
 *
 * Lists, per SDK, which imported sample keys are missing on the SDK side.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import fetch from 'node-fetch';

const SDK = [
  { label: 'JS', project: 'meilisearch-js' },
  { label: 'Python', project: 'meilisearch-python' },
  { label: 'PHP', project: 'meilisearch-php' },
  { label: 'Java', project: 'meilisearch-java' },
  { label: 'Ruby', project: 'meilisearch-ruby' },
  { label: 'Go', project: 'meilisearch-go' },
  { label: 'C#', project: 'meilisearch-dotnet' },
  { label: 'Rust', project: 'meilisearch-rust' },
  { label: 'Swift', project: 'meilisearch-swift' },
  { label: 'Dart', project: 'meilisearch-dart' },
];

/** Keys that are not expected in SDKs (e.g. no-SDK / curl-only samples). Never reported as missing. */
const NOT_MISSING_IN_SDK = new Set(['tenant_token_guide_search_no_sdk_1']);

/**
 * Convert a CodeSamples* component name to the YAML key (snake_case).
 * e.g. CodeSamplesTenantTokenGuideSearchSdk1 → tenant_token_guide_search_sdk_1
 *      CodeSamplesCreateAKey1 → create_a_key_1
 */
function componentNameToKey(name) {
  if (!name.startsWith('CodeSamples') || name.length <= 'CodeSamples'.length) {
    return null;
  }
  const rest = name.slice('CodeSamples'.length);
  let out = '';
  for (let i = 0; i < rest.length; i++) {
    const c = rest[i];
    const prev = i > 0 ? rest[i - 1] : '';
    const prevLetter = (prev >= 'a' && prev <= 'z') || (prev >= 'A' && prev <= 'Z');
    const currUpper = c >= 'A' && c <= 'Z';
    const currDigit = c >= '0' && c <= '9';
    if (i > 0) {
      if (currUpper) out += '_'; // _ before every uppercase (e.g. CreateAKey → create_a_key)
      else if (currDigit && prevLetter) out += '_'; // _ before digit after letter (e.g. Sdk1 → sdk_1)
    }
    out += c.toLowerCase();
  }
  return out;
}

/**
 * Collect code sample keys from doc imports starting with "CodeSamples".
 * Scans .mdx and .md files for import lines and extracts component names.
 */
function getCodeSampleKeysFromDocImports() {
  const keys = new Set();
  const componentRe = /CodeSamples[A-Za-z0-9]+/g;
  const root = process.cwd();
  const skipDirs = new Set(['node_modules', 'generated-code-samples', '.git']);

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!skipDirs.has(e.name)) walk(full);
        continue;
      }
      if (!e.name.endsWith('.mdx') && !e.name.endsWith('.md')) continue;
      const content = fs.readFileSync(full, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        if (!line.includes('import') || !line.includes('from')) continue;
        let m;
        while ((m = componentRe.exec(line)) !== null) {
          const key = componentNameToKey(m[0]);
          if (key) keys.add(key);
        }
      }
    }
  }

  walk(root);
  return [...keys].sort();
}

const expectedKeys = getCodeSampleKeysFromDocImports();

if (expectedKeys.length === 0) {
  console.warn(
    '⚠ No "CodeSamples*" imports found in the documentation.'
  );
  process.exit(0);
}

async function fetchYaml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return yaml.load(await res.text());
}

console.log(
  `Doc imports (CodeSamples*) reference ${expectedKeys.length} code sample key(s).\n`
);

// Per-sample tracking: which SDKs are missing each sample
const missingByKey = new Map();

for (const sdk of SDK) {
  const url = `https://raw.githubusercontent.com/meilisearch/${sdk.project}/main/.code-samples.meilisearch.yaml`;

  let remoteSamples;
  try {
    remoteSamples = await fetchYaml(url);
  } catch (err) {
    console.warn(
      `⚠ Could not fetch samples for ${sdk.label} (${sdk.project}): ${err.message}`
    );
    continue;
  }

  const remoteKeys = new Set(Object.keys(remoteSamples));
  const missing = expectedKeys.filter(
    (key) => !NOT_MISSING_IN_SDK.has(key) && !remoteKeys.has(key)
  );

  if (missing.length > 0) {
    console.log(
      `${sdk.label} (${sdk.project}): ${missing.length} missing sample(s)`
    );
    for (const key of missing) {
      console.log(`  - ${key}`);
      if (!missingByKey.has(key)) missingByKey.set(key, []);
      missingByKey.get(key).push(sdk.label);
    }
    console.log('');
  } else {
    console.log(
      `${sdk.label} (${sdk.project}): all samples present`
    );
  }
}

// Summary: samples missing per SDK count
if (missingByKey.size > 0) {
  console.log('\n--- Summary: samples missing and which SDKs lack them ---\n');
  for (const [key, sdks] of [...missingByKey.entries()].sort()) {
    console.log(`${key}: missing in ${sdks.join(', ')}`);
  }
}

// This script is informational only – always exit 0
process.exit(0);
