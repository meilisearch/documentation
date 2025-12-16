/**
 * Download the latest Meilisearch OpenAPI spec and fix validation errors.
 *
 * This script:
 * 1. Fetches the latest Meilisearch release version from GitHub
 * 2. Downloads the OpenAPI spec from the release assets
 * 3. Fixes known validation issues (null descriptions in externalDocs)
 * 4. Saves the fixed spec to reference/openapi.json
 */

import * as fs from "fs";
import * as path from "path";

const GITHUB_API_URL = "https://api.github.com/repos/meilisearch/meilisearch/releases/latest";
const OPENAPI_URL_TEMPLATE = "https://github.com/meilisearch/meilisearch/releases/download/{version}/meilisearch-openapi.json";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const OUTPUT_PATH = path.join(SCRIPT_DIR, "..", "reference", "openapi.json");

interface GitHubRelease {
  tag_name: string;
}

interface OpenAPISpec {
  info?: {
    version?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  tags?: Array<{
    name?: string;
    externalDocs?: {
      url?: string;
      description?: string | null;
    };
  }>;
  paths?: Record<string, Record<string, {
    externalDocs?: {
      url?: string;
      description?: string | null;
    };
  }>>;
}

async function getLatestVersion(): Promise<string> {
  console.log("Fetching latest release from GitHub...");

  const response = await fetch(GITHUB_API_URL, {
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Meilisearch-Docs"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch latest release: ${response.statusText}`);
  }

  const data = await response.json() as GitHubRelease;
  const version = data.tag_name;
  console.log(`Latest version: ${version}`);
  return version;
}

async function downloadOpenAPI(version: string): Promise<OpenAPISpec> {
  const url = OPENAPI_URL_TEMPLATE.replace("{version}", version);
  console.log(`Downloading OpenAPI spec from ${url}...`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download OpenAPI spec: ${response.statusText}`);
  }

  return await response.json() as OpenAPISpec;
}

function fixOpenAPI(spec: OpenAPISpec): { spec: OpenAPISpec; fixesApplied: number } {
  let fixesApplied = 0;

  // Fix 1: Update servers to use absolute URLs (required for code sample generation)
  spec.servers = [
    {
      url: "https://your-instance.meilisearch.io",
      description: "Meilisearch Cloud"
    },
    {
      url: "http://localhost:7700",
      description: "Local server"
    }
  ];
  fixesApplied++;
  console.log("  Fixed: Updated servers with absolute URLs for code sample generation");

  // Fix 2: Remove null descriptions in externalDocs (tags)
  if (spec.tags) {
    for (const tag of spec.tags) {
      if (tag.externalDocs && tag.externalDocs.description === null) {
        delete tag.externalDocs.description;
        fixesApplied++;
        console.log(`  Fixed: Removed null description from tag '${tag.name || "unknown"}'`);
      }
    }
  }

  // Fix 3: Remove null descriptions in externalDocs (paths)
  if (spec.paths) {
    for (const [pathKey, methods] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        if (operation && typeof operation === "object" && "externalDocs" in operation) {
          if (operation.externalDocs?.description === null) {
            delete operation.externalDocs.description;
            fixesApplied++;
            console.log(`  Fixed: Removed null description from ${method.toUpperCase()} ${pathKey}`);
          }
        }
      }
    }
  }

  return { spec, fixesApplied };
}

function saveOpenAPI(spec: OpenAPISpec, outputPath: string): void {
  const dir = path.dirname(outputPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
  console.log(`Saved fixed OpenAPI spec to ${outputPath}`);
}

async function main(): Promise<void> {
  console.log("=".repeat(60));
  console.log("Meilisearch OpenAPI Spec Updater");
  console.log("=".repeat(60));

  // Get latest version
  const version = await getLatestVersion();

  // Download
  const spec = await downloadOpenAPI(version);
  const specVersion = spec.info?.version || "unknown";
  console.log(`OpenAPI spec version: ${specVersion}`);

  // Fix
  console.log("\nApplying fixes...");
  const { spec: fixedSpec, fixesApplied } = fixOpenAPI(spec);
  console.log(`Total fixes applied: ${fixesApplied}`);

  // Save
  console.log();
  saveOpenAPI(fixedSpec, OUTPUT_PATH);

  console.log("\nDone!");
  console.log("You can now use this spec in docs.json:");
  console.log('  "openapi": "reference/openapi.json"');
}

main().catch(console.error);
