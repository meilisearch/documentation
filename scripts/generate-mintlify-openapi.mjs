#!/usr/bin/env node

/**
 * Generates a Mintlify-ready OpenAPI file from assets/open-api/meilisearch-openapi.json.
 *
 * - Fetches code samples from the docs repo and SDK repos (.code-samples.meilisearch.yaml),
 *   maps them to OpenAPI operation keys (e.g. get_indexes), and injects x-codeSamples.
 * - Removes null or "null" description fields in tags (and nested objects) for Mintlify.
 *
 * Output: assets/open-api/meilisearch-openapi-mintlify.json
 *
 * Optional: set GITHUB_PAT or GH_TOKEN for higher rate limits when fetching SDK samples.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const OPENAPI_DIR = path.join(REPO_ROOT, "assets", "open-api");
const SOURCE_OPENAPI = path.join(OPENAPI_DIR, "meilisearch-openapi.json");
const TARGET_OPENAPI = path.join(OPENAPI_DIR, "meilisearch-openapi-mintlify.json");
const LOCAL_CODE_SAMPLES = path.join(REPO_ROOT, ".code-samples.meilisearch.yaml");

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];

const CODE_SAMPLES_ORDER = [
  "cURL",
  "JS",
  "PHP",
  "Python",
  "Java",
  "Ruby",
  "Go",
  "C#",
  "Rust",
  "Dart",
  "Swift",
];

const DOCS_LANG = "cURL";

const CODE_SAMPLES_SOURCES = [
  {
    url: "https://raw.githubusercontent.com/meilisearch/documentation/refs/heads/main/.code-samples.meilisearch.yaml",
    lang: "cURL",
  },
  {
    url: "https://raw.githubusercontent.com/meilisearch/meilisearch-dotnet/refs/heads/main/.code-samples.meilisearch.yaml",
    lang: "C#",
  },
  {
    url: "https://raw.githubusercontent.com/meilisearch/meilisearch-dart/refs/heads/main/.code-samples.meilisearch.yaml",
    lang: "Dart",
  },
  {
    url: "https://raw.githubusercontent.com/meilisearch/meilisearch-go/refs/heads/main/.code-samples.meilisearch.yaml",
    lang: "Go",
  },
  {
    url: "https://raw.githubusercontent.com/meilisearch/meilisearch-java/refs/heads/main/.code-samples.meilisearch.yaml",
    lang: "Java",
  },
  {
    url: "https://raw.githubusercontent.com/meilisearch/meilisearch-js/refs/heads/main/.code-samples.meilisearch.yaml",
    lang: "JS",
  },
  {
    url: "https://raw.githubusercontent.com/meilisearch/meilisearch-php/refs/heads/main/.code-samples.meilisearch.yaml",
    lang: "PHP",
  },
  {
    url: "https://raw.githubusercontent.com/meilisearch/meilisearch-python/refs/heads/main/.code-samples.meilisearch.yaml",
    lang: "Python",
  },
  {
    url: "https://raw.githubusercontent.com/meilisearch/meilisearch-ruby/refs/heads/main/.code-samples.meilisearch.yaml",
    lang: "Ruby",
  },
  {
    url: "https://raw.githubusercontent.com/meilisearch/meilisearch-rust/refs/heads/main/.code-samples.meilisearch.yaml",
    lang: "Rust",
  },
  {
    url: "https://raw.githubusercontent.com/meilisearch/meilisearch-swift/refs/heads/main/.code-samples.meilisearch.yaml",
    lang: "Swift",
  },
];

function getHeaders() {
  const token = process.env.GITHUB_PAT || process.env.GH_TOKEN;
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchUrl(url) {
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

function isHttpMethodPrefixed(word) {
  return HTTP_METHODS.some(
    (method) => word.startsWith(method) && word.slice(method.length).startsWith("_")
  );
}

/**
 * Builds mapping from OpenAPI key (e.g. get_indexes) to code sample ID (e.g. list_all_indexes_1)
 * from the documentation .code-samples file.
 * Lines starting with "# " (hash + space), single word (no spaces) starting with HTTP method + underscore.
 * Next line: first word before ":" is the sample ID. Only first match per key.
 */
function buildOpenapiKeyMapping(content) {
  const mapping = new Map();
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    const afterHash = line.startsWith("# ") ? line.slice(2).trim() : null;
    if (afterHash == null) continue;
    if (afterHash.includes(" ") || !isHttpMethodPrefixed(afterHash)) continue;

    const sampleId = nextLine.split(":")[0]?.trim();
    if (!sampleId) continue;

    if (!mapping.has(afterHash)) {
      mapping.set(afterHash, sampleId);
    }
  }

  return mapping;
}

/**
 * Parses code samples from a YAML-like file.
 * Sample: line containing ": |-", ID is first word before ":".
 * Value: lines until next ": |-" or line starting with "#" at column 0 or EOF.
 * Dedent by first line's indentation.
 */
function parseCodeSamplesFromFile(content) {
  const samples = new Map();
  let currentSampleId = null;
  const currentLines = [];
  let baseIndent = null;

  const flush = () => {
    if (currentSampleId) {
      const value = currentLines.join("\n").trimEnd();
      samples.set(currentSampleId, value);
    }
    currentSampleId = null;
    currentLines.length = 0;
    baseIndent = null;
  };

  for (const line of content.split(/\r?\n/)) {
    if (line.includes(": |-")) {
      flush();
      const id = line.split(":")[0]?.trim();
      if (id) currentSampleId = id;
      continue;
    }

    if (line.startsWith("#")) {
      flush();
      continue;
    }

    if (currentSampleId != null) {
      if (line.trim() === "") {
        if (currentLines.length > 0) currentLines.push("");
        continue;
      }
      const indent = line.length - line.trimStart().length;
      if (baseIndent == null) baseIndent = indent;
      const dedented = indent >= baseIndent ? line.slice(baseIndent) : line.trimStart();
      currentLines.push(dedented);
    }
  }

  // Save last sample
  if (currentSampleId) {
    const value = currentLines.join("\n").trimEnd();
    samples.set(currentSampleId, value);
  }

  return samples;
}

function toCamelCase(s) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * OpenAPI path + method -> code sample key.
 * e.g. /indexes/{index_uid}/documents, GET -> get_indexes_indexUid_documents
 */
function pathToKey(pathStr, method) {
  const methodLower = method.toLowerCase();
  const segments = pathStr
    .replace(/^\//, "")
    .split("/")
    .map((seg) => {
      if (seg.startsWith("{") && seg.endsWith("}")) {
        const param = seg.slice(1, -1);
        return toCamelCase(param);
      }
      return seg.replace(/-/g, "_");
    });
  const pathPart = segments.join("_");
  return pathPart ? `${methodLower}_${pathPart}` : methodLower;
}

/**
 * Fetches all code samples and returns a Map: openapiKey -> [{ lang, source }, ...]
 */
async function fetchAllCodeSamples(options = {}) {
  const { debug = false } = options;

  // Documentation repo (cURL): always use local .code-samples.meilisearch.yaml
  if (!fs.existsSync(LOCAL_CODE_SAMPLES)) {
    throw new Error(
      `Local code samples file not found: ${LOCAL_CODE_SAMPLES}. Run this script from the documentation repository root.`
    );
  }
  const docsContent = fs.readFileSync(LOCAL_CODE_SAMPLES, "utf8");

  const openapiKeyToSampleId = buildOpenapiKeyMapping(docsContent);
  const allSamples = new Map(); // openapiKey -> [{ lang, source }]

  for (const { url, lang } of CODE_SAMPLES_SOURCES) {
    let content;
    if (lang === DOCS_LANG) {
      content = docsContent;
    } else {
      try {
        content = await fetchUrl(url);
      } catch (err) {
        console.warn(`Warning: Failed to fetch code samples for ${lang}: ${err.message}`);
        continue;
      }
    }

    const sampleIdToCode = parseCodeSamplesFromFile(content);
    for (const [openapiKey, sampleId] of openapiKeyToSampleId) {
      const source = sampleIdToCode.get(sampleId);
      if (source !== undefined) {
        if (!allSamples.has(openapiKey)) allSamples.set(openapiKey, []);
        allSamples.get(openapiKey).push({ lang, source });
      }
    }
  }

  if (debug) {
    console.error("\n=== OpenAPI Key to Sample ID Mapping ===\n");
    for (const key of [...openapiKeyToSampleId.keys()].sort()) {
      console.error(`  ${key} -> ${openapiKeyToSampleId.get(key)}`);
    }
    console.error("\n=== Code Samples ===\n");
    for (const key of [...allSamples.keys()].sort()) {
      const langs = allSamples.get(key).map((s) => s.lang);
      console.error(`  ${key} -> ${langs.join(", ")}`);
    }
  }

  return allSamples;
}

function addCodeSamplesToOpenapi(openapi, codeSamples, options = {}) {
  const { debug = false } = options;
  const paths = openapi.paths;
  if (!paths || typeof paths !== "object") throw new Error("OpenAPI spec missing 'paths' object");

  const routesWithSamples = [];
  const routesWithoutSamples = [];

  for (const [pathStr, pathItem] of Object.entries(paths)) {
    if (pathItem == null || typeof pathItem !== "object") continue;

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (operation == null) continue;

      const key = pathToKey(pathStr, method);
      const samples = codeSamples.get(key);

      if (samples && samples.length > 0) {
        routesWithSamples.push(key);
        const sorted = [...samples].sort((a, b) => {
          const posA = CODE_SAMPLES_ORDER.indexOf(a.lang);
          const posB = CODE_SAMPLES_ORDER.indexOf(b.lang);
          const idxA = posA === -1 ? CODE_SAMPLES_ORDER.length : posA;
          const idxB = posB === -1 ? CODE_SAMPLES_ORDER.length : posB;
          return idxA - idxB || a.lang.localeCompare(b.lang);
        });
        operation["x-codeSamples"] = sorted.map(({ lang, source }) => ({ lang, source }));
      } else {
        routesWithoutSamples.push(key);
      }
    }
  }

  if (debug) {
    routesWithoutSamples.sort();
    if (routesWithoutSamples.length > 0) {
      console.error("=== Routes without code samples ===\n");
      routesWithoutSamples.forEach((k) => console.error(`  ${k}`));
    }
    const total =
      routesWithSamples.length + routesWithoutSamples.length;
    const pct = total > 0 ? ((routesWithSamples.length / total) * 100).toFixed(1) : "0";
    console.error("\n=== Summary ===\n");
    console.error(`  Total routes: ${total}`);
    console.error(`  With code samples: ${routesWithSamples.length} (${pct}%)`);
    console.error(`  Missing code samples: ${routesWithoutSamples.length}\n`);
  }
}

function removeNullDescriptionsRecursive(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    if ("description" in value) {
      const d = value.description;
      if (d == null || (typeof d === "string" && d === "null")) {
        delete value.description;
      }
    }
    for (const k of Object.keys(value)) {
      removeNullDescriptionsRecursive(value[k]);
    }
  } else if (Array.isArray(value)) {
    value.forEach(removeNullDescriptionsRecursive);
  }
}

function cleanNullDescriptions(openapi) {
  const tags = openapi.tags;
  if (Array.isArray(tags)) {
    tags.forEach(removeNullDescriptionsRecursive);
  }
}

async function main() {
  const debug = process.argv.includes("--debug");

  if (!fs.existsSync(SOURCE_OPENAPI)) {
    throw new Error(`Source OpenAPI file not found: ${SOURCE_OPENAPI}`);
  }

  console.log("Reading OpenAPI spec...");
  const openapi = JSON.parse(fs.readFileSync(SOURCE_OPENAPI, "utf8"));

  console.log("Fetching code samples...");
  const codeSamples = await fetchAllCodeSamples({ debug });
  addCodeSamplesToOpenapi(openapi, codeSamples, { debug });

  console.log("Cleaning null descriptions for Mintlify...");
  cleanNullDescriptions(openapi);

  if (!fs.existsSync(OPENAPI_DIR)) {
    fs.mkdirSync(OPENAPI_DIR, { recursive: true });
  }

  fs.writeFileSync(TARGET_OPENAPI, JSON.stringify(openapi, null, 2), "utf8");
  console.log(`Written: ${TARGET_OPENAPI}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
