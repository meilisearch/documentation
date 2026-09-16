#!/usr/bin/env node

/**
 * Fetches the external assets the documentation is generated from:
 *
 * 1. The latest Meilisearch release assets (OpenAPI spec and error codes)
 *    from GitHub, written to assets/engine-release-assets/.
 * 2. The Meilisearch Cloud OpenAPI spec from the private
 *    meilisearch/meilisearch-cloud repository, written to assets/cloud-assets/.
 *
 * Token: set GITHUB_PAT or GH_TOKEN.
 * - Optional for the release assets (higher API rate limits).
 * - Required for the Cloud OpenAPI spec (private repository). Without a
 *   token, the Cloud spec fetch is skipped with a warning.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

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

function getToken() {
  return process.env.GITHUB_PAT || process.env.GH_TOKEN;
}

function getHeaders(extra = {}) {
  const token = getToken();
  const headers = { ...extra };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(url, { asJson = false, accept, errorContext = "Request" } = {}) {
  const headers = getHeaders(accept ? { Accept: accept } : {});
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `${errorContext} failed: ${res.status} ${res.statusText}${body ? `\n${body}` : ""}`
    );
  }
  return asJson ? res.json() : res.text();
}

function writeFile(dir, filename, content) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const targetPath = path.join(dir, filename);
  fs.writeFileSync(targetPath, content, "utf8");
  console.log(`Written to ${targetPath}`);
}

async function fetchReleaseAssets() {
  console.log("Fetching latest Meilisearch release...");
  const release = await request(GITHUB_API_LATEST, {
    asJson: true,
    accept: "application/vnd.github+json",
    errorContext: "GitHub API",
  });
  const tag = release.tag_name;
  console.log(`Latest release: ${tag}`);

  const assetNames = release.assets?.map((a) => a.name) ?? [];
  for (const filename of RELEASE_ASSET_NAMES) {
    const asset = release.assets?.find((a) => a.name === filename);
    if (!asset) {
      throw new Error(
        `Asset "${filename}" not found in release ${tag}. Available: ${assetNames.join(", ") || "none"}`
      );
    }

    console.log(`Downloading ${filename}...`);
    const content = await request(asset.browser_download_url, {
      errorContext: "Download asset",
    });
    writeFile(RELEASE_TARGET_DIR, filename, content);
  }
}

async function fetchCloudOpenapi() {
  if (!getToken()) {
    console.warn(
      "Warning: no GITHUB_PAT or GH_TOKEN set. Skipping the Meilisearch Cloud OpenAPI spec (private repository)."
    );
    return;
  }

  console.log("Fetching Meilisearch Cloud OpenAPI spec...");
  const content = await request(CLOUD_OPENAPI_URL, {
    accept: "application/vnd.github.raw+json",
    errorContext: "Download Cloud OpenAPI spec",
  });

  // Sanity check: make sure the fetched content is a valid OpenAPI YAML document
  // before replacing the local copy.
  let spec;
  try {
    spec = yaml.load(content);
  } catch (err) {
    throw new Error(`Cloud OpenAPI spec is not valid YAML: ${err.message}`);
  }
  if (spec == null || typeof spec !== "object" || !spec.openapi || !spec.paths) {
    throw new Error(
      "Cloud OpenAPI spec does not look like an OpenAPI document (missing 'openapi' or 'paths')."
    );
  }

  writeFile(CLOUD_TARGET_DIR, CLOUD_OPENAPI_FILENAME, content);
}

async function main() {
  await fetchReleaseAssets();
  await fetchCloudOpenapi();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
