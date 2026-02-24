# Contributing to the documentation

This guide covers how to set up your environment and run the docs locally, run tests, and work with code samples and the OpenAPI spec.

## Table of contents

- [Technical requirements](#technical-requirements)
- [Install](#install)
- [Docs writing](#docs-writing)
- [Run the docs locally](#run-the-docs-locally)
- [Tests](#tests)
- [Code samples](#code-samples)
- [OpenAPI Mintlify file](#openapi-mintlify-file)
- [Deployment](#deployment)

## Technical requirements

- **Node.js** 18+ (LTS recommended)
- **npm** (comes with Node.js)

## Install

From the root of the repository:

```bash
npm install
```

## Docs writing

Before writing or editing documentation content:

- **If you use a generative AI tool:** an [AGENTS.md](AGENTS.md) file exists in this repo with instructions for agents. Point your AI tool to it so that it follows our documentation philosophy, quality checklist, and writing-style rules.
- **Otherwise:** read [AGENTS.md](AGENTS.md) carefully. In particular, use the **documentation philosophy** and **quality checklist** when writing or reviewing docs, and follow the **prose and writing-style rules** (spelling, terminology, grammar, style, and wording).

## Run the docs locally

To preview the documentation site and see your changes as you edit:

1. Start the dev server:

```bash
npx mintlify dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser. The preview updates automatically when you save MDX files.

## Tests

### Broken links

Check for broken links in the doc site:

```bash
npx mint broken-links
```

### Other test scripts

| Script | What it does |
|--------|----------------|
| `npm run check-code-samples-usage` | Ensures every entry in `.code-samples.meilisearch.yaml` is either mapped to an OpenAPI route or used in an MDX snippet. Exits with error if not. |
| `npm run check-openapi-code-samples` | Checks the Mintlify OpenAPI file for missing cURL code samples per route. Use with `curl-check` or `info` (see script header). |
| `npm run check-unused-sdk-samples` | Fetches each SDK’s `.code-samples.meilisearch.yaml` and reports samples that are not used in this repo (candidates for removal in SDKs). |
| `npm run check-missing-sdk-samples` | Informational only. Compares doc snippet imports to each SDK’s samples and lists, per SDK, which imported keys are missing on the SDK side. |

## Code samples

### What they are

Code samples are stored in [`.code-samples.meilisearch.yaml`](/.code-samples.meilisearch.yaml) (and in each SDK repo). They map operation names (e.g. `get_indexes`) to code snippets in multiple languages. The docs use them in the API reference (via the OpenAPI Mintlify file) and in guides (via generated MDX snippets).

**When adding a cURL example in `/learn/` or `/reference/api/`:** prefer adding a new entry in `.code-samples.meilisearch.yaml`, then running the snippet generator and importing the generated snippet in the page, rather than writing the example inline in the MDX.

### Update or generate code sample snippets

- **Edit samples for the docs (cURL):** update [`.code-samples.meilisearch.yaml`](/.code-samples.meilisearch.yaml) in this repo. Keys should match OpenAPI operation IDs or be referenced explicitly in MDX.
- **Regenerate the MDX snippets** used in the site (e.g. in `snippets/generated-code-samples/`):

```bash
npm run generate-code-sample-snippets-file
```

This script reads the local [`.code-samples.meilisearch.yaml`](/.code-samples.meilisearch.yaml) and fetches each SDK’s `.code-samples.meilisearch.yaml` from GitHub, then generates one MDX file per operation in `snippets/generated-code-samples/` with a `<CodeGroup>` for all languages.

## OpenAPI Mintlify file

The API reference is built from a Mintlify-ready OpenAPI file that includes injected code samples and cleaned metadata.

### Where the base OpenAPI file comes from

The base spec is **Meilisearch’s OpenAPI file** from the [latest Meilisearch GitHub release](https://github.com/meilisearch/meilisearch/releases/latest). It is shipped as the asset `meilisearch-openapi.json` in that release.

### Generate the OpenAPI Mintlify file

1. **Fetch the latest OpenAPI file** from the Meilisearch release (writes to `assets/open-api/meilisearch-openapi.json`):

```bash
npm run fetch-meilisearch-openapi-file
```

Optional: set `GITHUB_PAT` or `GH_TOKEN` for higher API rate limits.

2. **Generate the Mintlify-ready file** (reads `assets/open-api/meilisearch-openapi.json`, injects code samples from this repo and SDK repos, cleans null descriptions; writes `assets/open-api/meilisearch-openapi-mintlify.json`):

```bash
npm run generate-mintlify-openapi-file
```

Optional: set `GITHUB_PAT` or `GH_TOKEN` when the script fetches SDK code sample files from GitHub.

## Deployment

The docs are deployed by Mintlify when changes are pushed to `main`. After each deployment, the [post-deployment workflow](.github/workflows/post-deployment.yml) runs (on every push to `main`, on [workflow_dispatch](https://docs.github.com/en/actions/using-workflows/manually-running-a-workflow), and daily at 23:00 UTC).

It does the following:

1. **Build code samples** — Runs `generate-code-sample-snippets-file`. If `snippets/` has changes, it commits and pushes them to `main` (which triggers a new Mintlify deployment). This keeps generated snippets in sync with `.code-samples.meilisearch.yaml` and the SDK repos.

2. **Fetch OpenAPI file** *(only if `docs.json` has `internal-meili-fetch-automation: true`)* — Fetches the latest `meilisearch-openapi.json` from the Meilisearch GitHub release. If the file changed, it commits and pushes to `main`. To disable this (e.g. if the latest release OpenAPI causes issues), set the flag to `false` or update the OpenAPI file manually.

3. **Generate and check Mintlify OpenAPI** *(same condition)* — Runs `generate-mintlify-openapi-file`, validates with `npx mint openapi-check`, then commits and pushes `meilisearch-openapi-mintlify.json` if it changed.

Each step commits separately so the history stays clear. Contributors don’t need to run these steps manually for normal edits; the workflow keeps code samples and OpenAPI files up to date after merges to `main`.

A concurrency group ensures only one run executes at a time, so multiple triggers (many commits merged on `main`) do not run in parallel and cause conflicting commits.
