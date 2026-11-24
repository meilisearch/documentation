#!/usr/bin/env node

/**
 * Fetches the external assets the documentation is generated from:
 *
 * 1. The latest Meilisearch release assets (OpenAPI spec and error codes)
 *    from GitHub, written to assets/engine-release-assets/.
 * 2. The Meilisearch Cloud OpenAPI spec and error messages from the private
 *    meilisearch/meilisearch-cloud repository, written to assets/cloud-assets/.
 *
 * Token: set GITHUB_TOKEN, GITHUB_PAT or GH_TOKEN.
 * - Optional for the release assets (higher API rate limits).
 * - Required for the Cloud assets (private repository). Without a token,
 *   the Cloud fetches are skipped with a warning.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

// Meilisearch release assets
const RELEASE_TARGET_DIR = path.join(REPO_ROOT, "assets", "engine-release-assets");
const RELEASE_ASSET_NAMES = ["meilisearch-openapi.json", "meilisearch-error-codes.json"];
const GITHUB_API_LATEST =
  "https://api.github.com/repos/meilisearch/meilisearch/releases/latest";

// Meilisearch Cloud OpenAPI spec (private repository)
const CLOUD_TARGET_DIR = path.join(REPO_ROOT, "assets", "cloud-assets");
const CLOUD_OPENAPI_FILENAME = "meilisearch-cloud-openapi.yaml";
const CLOUD_OPENAPI_URL =
  "https://api.github.com/repos/meilisearch/meilisearch-cloud/contents/api/swagger/v2/swagger.yaml?ref=main";

// Meilisearch Cloud error messages. The Management API builds every error
// response from the `api_v2_errors` section of the API's i18n locale file, and
// falls back to the legacy `messages` section for codes not migrated yet, so
// both sections are the source of truth for its error codes.
const CLOUD_ERROR_CODES_FILENAME = "meilisearch-cloud-error-codes.json";
const CLOUD_ERROR_CODES_URL =
  "https://api.github.com/repos/meilisearch/meilisearch-cloud/contents/api/config/locales/en.yml?ref=main";

function getToken() {
  return process.env.GITHUB_TOKEN || process.env.GITHUB_PAT || process.env.GH_TOKEN;
}

async function request(url, { accept, errorContext = "Request" } = {}) {
  const token = getToken();
  const headers = {};
  if (accept) headers.Accept = accept;
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `${errorContext} failed: ${res.status} ${res.statusText}${body ? `\n${body}` : ""}`
    );
  }
  return res.text();
}

function writeFile(dir, filename, content) {
  fs.mkdirSync(dir, { recursive: true });
  const targetPath = path.join(dir, filename);
  fs.writeFileSync(targetPath, content, "utf8");
  console.log(`Written to ${targetPath}`);
}

async function fetchReleaseAssets() {
  console.log("Fetching latest Meilisearch release...");
  const release = JSON.parse(
    await request(GITHUB_API_LATEST, {
      accept: "application/vnd.github+json",
      errorContext: "GitHub API",
    })
  );
  const tag = release.tag_name;
  console.log(`Latest release: ${tag}`);

  const assets = RELEASE_ASSET_NAMES.map((filename) => {
    const asset = release.assets?.find((a) => a.name === filename);
    if (!asset) {
      throw new Error(
        `Asset "${filename}" not found in release ${tag}. Available: ${release.assets?.map((a) => a.name).join(", ") || "none"}`
      );
    }
    return asset;
  });

  // Download everything before writing, so a failed download leaves no
  // half-updated set of release assets.
  const contents = await Promise.all(
    assets.map((asset) => request(asset.browser_download_url, { errorContext: "Download asset" }))
  );
  assets.forEach((asset, i) => writeFile(RELEASE_TARGET_DIR, asset.name, contents[i]));
}

// Returns the raw content and the parsed document of a YAML file of the
// private meilisearch-cloud repository.
async function fetchCloudYaml(url, label) {
  console.log(`Fetching ${label}...`);
  const content = await request(url, {
    accept: "application/vnd.github.raw+json",
    errorContext: `Download ${label}`,
  });
  try {
    return { content, document: yaml.load(content) };
  } catch (err) {
    throw new Error(`${label} is not valid YAML: ${err.message}`);
  }
}

async function fetchCloudOpenapi() {
  const { content, document: spec } = await fetchCloudYaml(
    CLOUD_OPENAPI_URL,
    "Meilisearch Cloud OpenAPI spec"
  );

  // Make sure the fetched content is an OpenAPI document before replacing the
  // local copy.
  if (spec == null || typeof spec !== "object" || !spec.openapi || !spec.paths) {
    throw new Error(
      "Cloud OpenAPI spec does not look like an OpenAPI document (missing 'openapi' or 'paths')."
    );
  }

  writeFile(CLOUD_TARGET_DIR, CLOUD_OPENAPI_FILENAME, content);
}

async function fetchCloudErrorCodes() {
  const { document: locale } = await fetchCloudYaml(
    CLOUD_ERROR_CODES_URL,
    "Meilisearch Cloud locale file"
  );

  for (const section of ["messages", "api_v2_errors"]) {
    if (locale?.en?.[section] == null || typeof locale.en[section] !== "object") {
      throw new Error(`Cloud locale file has no 'en.${section}' section.`);
    }
  }
  const { messages, api_v2_errors: apiV2Errors } = locale.en;

  // Only keep the errors and the fields describing the response: the locale
  // file is a Rails i18n file and may grow other keys over time. An
  // `api_v2_errors` entry wins over the legacy one with the same code, as the
  // API does.
  const errorCodes = {};
  for (const [code, entry] of Object.entries(messages)) {
    if (entry?.status !== "error") continue;
    errorCodes[code] = {
      statusCode: entry.status_http,
      title: entry.message_title,
      description: entry.message_description,
    };
  }
  for (const [code, entry] of Object.entries(apiV2Errors)) {
    if (entry == null || typeof entry !== "object") continue;
    errorCodes[code] = { statusCode: entry.status, title: entry.message, apiV2: true };
  }

  const sorted = Object.fromEntries(
    Object.keys(errorCodes)
      .sort()
      .map((code) => [code, errorCodes[code]])
  );

  writeFile(
    CLOUD_TARGET_DIR,
    CLOUD_ERROR_CODES_FILENAME,
    `${JSON.stringify(sorted, null, 2)}\n`
  );
}

async function main() {
  const tasks = [fetchReleaseAssets()];
  if (getToken()) {
    tasks.push(fetchCloudOpenapi(), fetchCloudErrorCodes());
  } else {
    console.warn(
      "Warning: no GITHUB_TOKEN, GITHUB_PAT or GH_TOKEN set. Skipping the Meilisearch Cloud assets (private repository)."
    );
  }
  await Promise.all(tasks);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
