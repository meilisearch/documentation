#!/usr/bin/env node

/**
 * Fetches the latest Meilisearch release from GitHub and replaces
 * assets/open-api/meilisearch-openapi.json with the one from that release.
 *
 * Optional: set GITHUB_PAT or GH_TOKEN for higher API rate limits.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const OPENAPI_DIR = path.join(REPO_ROOT, "assets", "open-api");

const OPENAPI_ASSET_NAMES = ["meilisearch-openapi.json"];

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

  if (!fs.existsSync(OPENAPI_DIR)) {
    fs.mkdirSync(OPENAPI_DIR, { recursive: true });
  }

  const assetNames = release.assets?.map((a) => a.name) ?? [];
  for (const filename of OPENAPI_ASSET_NAMES) {
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
    const targetPath = path.join(OPENAPI_DIR, filename);
    fs.writeFileSync(targetPath, content, "utf8");
    console.log(`Written to ${targetPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
