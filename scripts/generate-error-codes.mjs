import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const RELEASE_ASSETS_DIR = path.join(REPO_ROOT, "assets", "engine-release-assets");
const SOURCE_ERROR_CODES = path.join(RELEASE_ASSETS_DIR, "meilisearch-error-codes.json");
const TARGET_ERROR_CODES = path.join(REPO_ROOT, "reference", "errors", "error_codes.mdx");

async function main() {
    const debug = process.argv.includes("--debug");

    if (!fs.existsSync(SOURCE_ERROR_CODES)) {
        throw new Error(`Source error codes file not found: ${SOURCE_ERROR_CODES}`)
    }

    console.log("Reading error codes...");
    const error_codes = JSON.parse(fs.readFileSync(SOURCE_ERROR_CODES, "utf8"));

    const formatted_error_codes = Object.entries(error_codes).map(([name, description]) => {
        return `### \`${name}\`

${description}
`
    });

    const error_codes_text = formatted_error_codes.join("\n");

    fs.writeFileSync(TARGET_ERROR_CODES, `---
title: Errors
sidebarTitle: Errors
description: Consult this page for an overview of how Meilisearch reports and formats errors, and an exhaustive list of error codes.
---

Meilisearch uses the following standard HTTP codes for a successful or failed API request:

| Status code | Description                                                                                |
| :---------- | :----------------------------------------------------------------------------------------- |
| 200         | ✅ **Ok** Everything worked as expected.                                                   |
| 201         | ✅ **Created** The resource has been created (synchronous)                                 |
| 202         | ✅  **Accepted** The task has been added to the queue (asynchronous)                       |
| 204         | ✅ **No Content** The resource has been deleted or no content has been returned            |
| 205         | ✅ **Reset Content** All the resources have been deleted                                   |
| 400         | ❌ **Bad Request** The request was unacceptable, often due to missing a required parameter |
| 401         | ❌ **Unauthorized** No valid API key provided                                              |
| 403         | ❌ **Forbidden** The API key doesn't have the permissions to perform the request           |
| 404         | ❌ **Not Found** The requested resource doesn't exist                                      |

## Error types

All detailed task responses contain an [\`error\`](/reference/api/tasks/get-task) field. When a task fails, it is always accompanied by a JSON-formatted error response. Meilisearch errors can be of one of the following types:

| Type                  | Description                                                                                                                                                                                     |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **\`invalid_request\`** | This is due to an error in the user input. It is accompanied by the HTTP code \`4xx\`                                                                                                             |
| **\`internal\`**        | This is due to machine or configuration constraints. It is accompanied by the HTTP code \`5xx\`                                                                                                   |
| **\`auth\`**            | This type of error is related to authentication and authorization. It is accompanied by the HTTP code \`4xx\`                                                                                     |
| **\`system\`**          | This indicates your system has reached or exceeded its limit for disk size, index size, open files, or the database doesn't have read or write access. It is accompanied by the HTTP code \`5xx\` |

## Error format

\`\`\`json
{
  "message": "Index \`movies\` not found.",
  "code": "index_not_found",
  "type": "invalid_request",
  "link": "https://docs.meilisearch.com/errors#index_not_found"
}
\`\`\`

| Field         | Description                                       |
| :------------ | :------------------------------------------------ |
| **\`message\`** | Human-readable description of the error           |
| **\`code\`**    | [Error code](#error-codes)                        |
| **\`type\`**    | [Type](#error-types) of error returned            |
| **\`link\`**    | Link to the relevant section of the documentation |

## Error codes

This is an exhaustive list of Meilisearch API errors.

${error_codes_text}`, "utf8");
    console.log(`Written: ${TARGET_ERROR_CODES}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});