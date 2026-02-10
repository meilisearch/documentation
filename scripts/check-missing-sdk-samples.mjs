#!/usr/bin/env node
/**
 * Informational check – never fails.
 *
 * Compares the sample keys in the local .code-samples.meilisearch.yaml with
 * each SDK's .code-samples.meilisearch.yaml (fetched from GitHub).
 *
 * Lists, per SDK, which local sample keys are missing on the SDK side.
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
const localKeys = Object.keys(localSamples).sort();

async function fetchYaml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return yaml.load(await res.text());
}

console.log(
  `Local .code-samples.meilisearch.yaml contains ${localKeys.length} sample(s).\n`
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
  const missing = localKeys.filter((key) => !remoteKeys.has(key));

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
