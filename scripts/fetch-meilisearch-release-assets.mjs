#!/usr/bin/env node

/**
 * Fetches the latest Meilisearch release from GitHub and replaces
 * the local copies of its assets (OpenAPI spec and error codes)
 * in assets/release-assets/.
 *
 * Optional: set GITHUB_PAT or GH_TOKEN for higher API rate limits.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const TARGET_DIR = path.join(REPO_ROOT, "assets", "release-assets");

const RELEASE_ASSET_NAMES = ["meilisearch-openapi.json", "meilisearch-error-codes.json"];

const GITHUB_API_LATEST =
  "https://api.github.com/repos/meilisearch/meilisearch/releases/latest";

function getHeaders(extra = {}) {
  const token = process.env.GITHUB_PAT || process.env.GH_TOKEN;
  const headers = { ...extra };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(url, { asJson = false, errorContext = "Request" } = {}) {
  const headers = getHeaders(
    asJson ? { Accept: "application/vnd.github+json" } : {}
  );
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `${errorContext} failed: ${res.status} ${res.statusText}${body ? `\n${body}` : ""}`
    );
  }
  return asJson ? res.json() : res.text();
}

async function main() {
  console.log("Fetching latest Meilisearch release...");
  const release = await request(GITHUB_API_LATEST, {
    asJson: true,
    errorContext: "GitHub API",
  });
  const tag = release.tag_name;
  console.log(`Latest release: ${tag}`);

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

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
    const targetPath = path.join(TARGET_DIR, filename);
    fs.writeFileSync(targetPath, content, "utf8");
    console.log(`Written to ${targetPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
