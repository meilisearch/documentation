#!/usr/bin/env node

/**
 * Generates a Mintlify-ready OpenAPI file from a source OpenAPI spec (JSON or YAML).
 *
 * Usage: node scripts/generate-mintlify-openapi.mjs <openapi-file> [--with-code-samples] [--debug]
 *
 * - Removes null or "null" description fields anywhere in the document for
 *   Mintlify, except inside example and default values, where a description
 *   field is payload data (e.g. an API key's null description), not metadata.
 * - With --with-code-samples: fetches code samples from the docs repo and SDK repos
 *   (.code-samples.meilisearch.yaml), maps them to OpenAPI operation keys
 *   (e.g. get_indexes), and injects x-codeSamples. Used for the engine OpenAPI
 *   file, not for the Meilisearch Cloud one.
 *
 * Output: written next to the source file, with a -mintlify suffix and the same
 * format (e.g. meilisearch-openapi.json -> meilisearch-openapi-mintlify.json).
 *
 * Optional: set GITHUB_TOKEN, GITHUB_PAT, or GH_TOKEN for higher rate limits when fetching SDK samples.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const LOCAL_CODE_SAMPLES = path.join(REPO_ROOT, ".code-samples.meilisearch.yaml");

const USAGE =
  "Usage: node scripts/generate-mintlify-openapi.mjs <openapi-file> [--with-code-samples] [--debug]";

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
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT || process.env.GH_TOKEN;
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
 * Parses code samples from a YAML file (e.g. .code-samples.meilisearch.yaml).
 * Uses js-yaml so that both YAML value styles are handled correctly:
 * - Block scalar (e.g. "key: |-" with indented multi-line value)
 * - Quoted scalar on the same line (e.g. "key: \"string with \\n\"")
 * Only string values are kept; keys with non-string values are skipped.
 * On parse error, logs a warning (with optional context) and returns null so the caller can skip this source.
 */
function parseCodeSamplesFromFile(content, context = {}) {
  const samples = new Map();
  let data;
  try {
    data = yaml.load(content);
  } catch (err) {
    const ctx = [context.lang, context.url].filter(Boolean).join(" ");
    console.warn(
      `Warning: Failed to parse code samples YAML${ctx ? ` (${ctx})` : ""}: ${err.message}`
    );
    return null;
  }
  if (data != null && typeof data === "object" && !Array.isArray(data)) {
    for (const [id, value] of Object.entries(data)) {
      if (typeof value === "string") {
        samples.set(id, value.trimEnd());
      }
    }
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

    const sampleIdToCode = parseCodeSamplesFromFile(content, { lang, url });
    if (sampleIdToCode === null) continue;

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

// Keys whose values hold payload data rather than OpenAPI metadata: a
// "description" field inside them is real data (e.g. an API key's null
// description in a response example) and must be kept.
const DATA_KEYS = new Set(["example", "examples", "default"]);

function removeNullDescriptionsRecursive(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    if ("description" in value) {
      const d = value.description;
      if (d == null || (typeof d === "string" && d === "null")) {
        delete value.description;
      }
    }
    for (const k of Object.keys(value)) {
      if (DATA_KEYS.has(k)) continue;
      removeNullDescriptionsRecursive(value[k]);
    }
  } else if (Array.isArray(value)) {
    value.forEach(removeNullDescriptionsRecursive);
  }
}

function cleanNullDescriptions(openapi) {
  removeNullDescriptionsRecursive(openapi);
}

async function main() {
  const args = process.argv.slice(2);
  const flags = args.filter((a) => a.startsWith("--"));
  const positional = args.filter((a) => !a.startsWith("--"));

  const unknownFlags = flags.filter((f) => !["--with-code-samples", "--debug"].includes(f));
  if (unknownFlags.length > 0) {
    throw new Error(`Unknown option(s): ${unknownFlags.join(", ")}\n${USAGE}`);
  }
  if (positional.length !== 1) {
    throw new Error(`Expected exactly one source OpenAPI file path.\n${USAGE}`);
  }
  const withCodeSamples = flags.includes("--with-code-samples");
  const debug = flags.includes("--debug");

  const sourcePath = path.resolve(positional[0]);
  const ext = path.extname(sourcePath).toLowerCase();
  if (![".json", ".yaml", ".yml"].includes(ext)) {
    throw new Error(`Unsupported file extension "${ext}" (expected .json, .yaml or .yml).\n${USAGE}`);
  }
  const baseName = path.basename(sourcePath, ext);
  if (baseName.endsWith("-mintlify")) {
    throw new Error(`Source file looks like a generated Mintlify file: ${sourcePath}`);
  }
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source OpenAPI file not found: ${sourcePath}`);
  }
  const targetPath = path.join(path.dirname(sourcePath), `${baseName}-mintlify${ext}`);

  console.log(`Reading OpenAPI spec from ${sourcePath}...`);
  const raw = fs.readFileSync(sourcePath, "utf8");
  const openapi = ext === ".json" ? JSON.parse(raw) : yaml.load(raw);

  if (withCodeSamples) {
    console.log("Fetching code samples...");
    const codeSamples = await fetchAllCodeSamples({ debug });
    addCodeSamplesToOpenapi(openapi, codeSamples, { debug });
  }

  console.log("Cleaning null descriptions for Mintlify...");
  cleanNullDescriptions(openapi);

  const output =
    ext === ".json"
      ? JSON.stringify(openapi, null, 2)
      : yaml.dump(openapi, { lineWidth: -1 });
  fs.writeFileSync(targetPath, output, "utf8");
  console.log(`Written: ${targetPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
