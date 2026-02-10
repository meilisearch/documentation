#!/usr/bin/env node
/**
 * For each SDK, fetches its .code-samples.meilisearch.yaml from GitHub and
 * checks if it contains sample keys that do NOT exist in the local
 * .code-samples.meilisearch.yaml.
 *
 * Such samples are useless (the documentation does not reference them) and
 * can be removed from the SDK.
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
  const unused = remoteKeys.filter((key) => !localKeys.has(key));

  if (unused.length > 0) {
    hasUnused = true;
    console.error(
      `\n${sdk.label} (${sdk.project}): ${unused.length} sample(s) not in local .code-samples.meilisearch.yaml:`
    );
    for (const key of unused.sort()) {
      console.error(`  - ${key}`);
    }
  }
}

if (!hasUnused) {
  console.log(
    'OK: All SDK code samples exist in the local .code-samples.meilisearch.yaml.'
  );
  process.exit(0);
}

console.error(
  '\nThe samples listed above exist in SDK repos but NOT in the local ' +
    '.code-samples.meilisearch.yaml. They are unused and can be removed from the SDKs.'
);
process.exit(1);
