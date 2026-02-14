#!/usr/bin/env node
/**
 * For each SDK, fetches its .code-samples.meilisearch.yaml from GitHub and
 * checks if it contains sample keys that are neither in the local
 * .code-samples.meilisearch.yaml nor used in the docs as a snippet.
 *
 * A sample is considered used if it is:
 * - present in the local .code-samples.meilisearch.yaml, OR
 * - referenced in the documentation (import or path to code_samples_<key>.mdx).
 *
 * Samples that are unused can be removed from the SDKs.
 *
 * Exits with code 1 if any unused SDK samples are found.
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

const LOCAL_YAML = path.join(
  process.cwd(),
  '.code-samples.meilisearch.yaml'
);

// Load local sample keys
const localSamples = yaml.load(fs.readFileSync(LOCAL_YAML, 'utf-8'));
const localKeys = new Set(Object.keys(localSamples));

/**
 * Collect all code sample keys referenced in the documentation (snippets).
 * Scans .mdx and .md files for paths like code_samples_<key>.mdx.
 */
function getDocSnippetKeys() {
  const keys = new Set();
  const snippetRe = /code_samples_([a-z0-9_]+)\.mdx/gi;
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
      let m;
      while ((m = snippetRe.exec(content)) !== null) {
        keys.add(m[1]);
      }
    }
  }

  walk(root);
  return keys;
}

const docSnippetKeys = getDocSnippetKeys();
const usedKeys = new Set([...localKeys, ...docSnippetKeys]);

async function fetchYaml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return yaml.load(await res.text());
}

let hasUnused = false;

for (const sdk of SDK) {
  const url = `https://raw.githubusercontent.com/meilisearch/${sdk.project}/main/.code-samples.meilisearch.yaml`;

  let remoteSamples;
  try {
    remoteSamples = await fetchYaml(url);
  } catch (err) {
    console.warn(`⚠ Could not fetch samples for ${sdk.label} (${sdk.project}): ${err.message}`);
    continue;
  }

  const remoteKeys = Object.keys(remoteSamples);
  const unused = remoteKeys.filter((key) => !usedKeys.has(key));

  if (unused.length > 0) {
    hasUnused = true;
    console.error(
      `\n${sdk.label} (${sdk.project}): ${unused.length} unused sample(s) (not in local .code-samples.meilisearch.yaml nor referenced as snippet in docs):`
    );
    for (const key of unused.sort()) {
      console.error(`  - ${key}`);
    }
  }
}

if (!hasUnused) {
  console.log(
    'OK: All SDK code samples are used (in local .code-samples.meilisearch.yaml or referenced as snippet in docs).'
  );
  process.exit(0);
}

console.error(
  '\nThe samples listed above exist in SDK repos but are neither in the local ' +
    '.code-samples.meilisearch.yaml nor referenced as snippets in the docs. They can be removed from the SDKs.'
);
process.exit(1);
