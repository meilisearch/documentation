import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const OPENAPI_DIR = path.join(REPO_ROOT, "assets", "open-api");
const SOURCE_ERROR_CODES = path.join(OPENAPI_DIR, "meilisearch-error-codes.json");
const TARGET_ERROR_CODES = path.join(REPO_ROOT, "reference", "errors", "error_codes.mdx");

async function main() {
    const debug = process.argv.includes("--debug");

    if (!fs.existsSync(SOURCE_ERROR_CODES)) {
        throw new Error(`Source error codes file not found: ${SOURCE_ERROR_CODES}`)
    }

    console.log("Reading error codes...");
    const error_codes = JSON.parse(fs.readFileSync(SOURCE_ERROR_CODES, "utf8"));

    const formatted_error_codes = Object.entries(error_codes).map(([name, description]) => {
        return `## \`${name}\`

${description}
`
    });

    const error_codes_text = formatted_error_codes.join("\n");

    fs.writeFileSync(TARGET_ERROR_CODES, `---
title: Error codes
sidebarTitle: Error codes
description: Consult this page for an exhaustive list of errors you may encounter when using the Meilisearch API.
---

This page is an exhaustive list of Meilisearch API errors.

${error_codes_text}`, "utf8");
    console.log(`Written: ${TARGET_ERROR_CODES}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});