# Contributing to the documentation

This guide covers how to set up your environment and run the docs locally, rebuild the staging search index, run tests, and work with code samples and the OpenAPI spec.

## Table of contents

- [Technical requirements](#technical-requirements)
- [Install](#install)
- [Docs writing](#docs-writing)
- [Run the docs locally](#run-the-docs-locally)
- [Documentation search](#documentation-search)
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

Before writing or editing documentation content, read our guide on [Contributing to our documentation](https://www.meilisearch.com/docs/resources/help/contributing_docs).

## Run the docs locally

To preview the documentation site and see your changes as you edit:

1. Start the dev server:

```bash
npx mintlify dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser. The preview updates automatically when you save MDX files.

## Documentation search

Local preview and Mintlify preview URLs search the `mintlify-staging` index. meilisearch.com searches `mintlify-production`, which the [scraper workflow](.github/workflows/scraper.yml) rebuilds on every push to `main`. A merge does not update staging.

Run the rebuild when you change the search config and need that change in local search or in a preview. It rebuilds the shared `mintlify-staging` index, so every local preview and every Mintlify preview picks up the new index.

You need Docker, `jq`, and a `.env` file at the repository root. `.env` is gitignored.

```bash
MEILISEARCH_API_KEY=your-master-key
# Optional. Defaults to the docs search instance.
MEILISEARCH_HOST_URL=https://ms-909f535664f8-173.lon.meilisearch.io
# Optional. Leave unset unless you are testing embeddings.
OPENAI_API_KEY=your-openai-key
```

`MEILISEARCH_API_KEY` is the master key of the docs search instance. The public search-only key is not enough.

```bash
npm run rebuild-search-staging
```

### Search index fields

The scraper config is [docs-scraper.config.json](docs-scraper.config.json). After each scrape, [scripts/search/post-scrape-edit.sh](scripts/search/post-scrape-edit.sh) adds fields derived from the URL:

- `section`: one of the five docs sections (`getting_started`, `capabilities`, `reference`, `resources`, `changelog`). `search.js` shows a filter chip for each section that has results. When you add a section, update both the script and `SECTION_LABELS` in [search.js](search.js).
- `is_page`: 1 for a page, 0 for a heading inside a page. Used by the `is_page:desc` ranking rule.
- `is_error`: 1 for the error pages. Their results rank lower.

A field used in a search filter must be in `filterableAttributes` in the scraper config. The scraper skips the Mintlify page chrome listed in `selectors_exclude`. This includes card titles, whose anchors are generated IDs (`_R_...`) instead of real headings, and the "Was this page helpful?" feedback widget.

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
| `npm run check-unused-sdk-samples` | Fetches the CLI’s and each SDK’s `.code-samples.meilisearch.yaml` and reports samples that are not used in this repo (candidates for removal in the CLI and SDKs). |
| `npm run check-missing-sdk-samples` | Informational only. Compares doc snippet imports to the CLI’s and each SDK’s samples and lists, per repo, which imported keys are missing on the SDK side. |

## Code samples

### What they are

Code samples are stored in [`.code-samples.meilisearch.yaml`](/.code-samples.meilisearch.yaml) (and in the [CLI repo](https://github.com/meilisearch/cli) and each SDK repo). They map operation names (e.g. `get_indexes`) to code snippets in multiple languages. The docs use them in the API reference (via the OpenAPI Mintlify file) and in guides (via generated MDX snippets).

**When adding a cURL example in `/learn/` or `/reference/api/`:** prefer adding a new entry in `.code-samples.meilisearch.yaml`, then running the snippet generator and importing the generated snippet in the page, rather than writing the example inline in the MDX.

### Update or generate code sample snippets

- **Edit samples for the docs (cURL):** update [`.code-samples.meilisearch.yaml`](/.code-samples.meilisearch.yaml) in this repo. Keys should match OpenAPI operation IDs or be referenced explicitly in MDX.
- **Regenerate the MDX snippets** used in the site (e.g. in `snippets/generated-code-samples/`):

```bash
npm run generate-code-sample-snippets-file
```

This script reads the local [`.code-samples.meilisearch.yaml`](/.code-samples.meilisearch.yaml) and fetches the CLI’s and each SDK’s `.code-samples.meilisearch.yaml` from GitHub, then generates one MDX file per operation in `snippets/generated-code-samples/` with a `<CodeGroup>` for all languages. The CLI tab comes right after cURL.

## OpenAPI Mintlify file

The API reference is built from a Mintlify-ready OpenAPI file that includes injected code samples and cleaned metadata.

### Where the base OpenAPI file comes from

The base spec is **Meilisearch’s OpenAPI file** from the [latest Meilisearch GitHub release](https://github.com/meilisearch/meilisearch/releases/latest). It is shipped as the asset `meilisearch-openapi.json` in that release.

### Generate the OpenAPI Mintlify and error code files

1. **Fetch the latest OpenAPI and error code files** from the Meilisearch release (writes `meilisearch-*.json` in `assets/release-assets/`):

```bash
npm run fetch-meilisearch-release-assets
```

Optional: set `GITHUB_PAT` or `GH_TOKEN` for higher API rate limits.

2. **Generate the Mintlify-ready file** (reads `assets/release-assets/meilisearch-openapi.json`, injects code samples from this repo, the CLI repo and SDK repos, cleans null descriptions; writes `assets/release-assets/meilisearch-openapi-mintlify.json`):

```bash
npm run generate-mintlify-openapi-file
```
3. **Generate the error code mdx file** (reads `assets/release-assets/meilisearch-error-codes.json` and outputs `reference/errors/error_codes.mdx`):

```bash
npm run generate-error-codes
```

Optional: set `GITHUB_PAT` or `GH_TOKEN` when the script fetches SDK code sample files from GitHub.

## Deployment

The docs are deployed by Mintlify when changes are pushed to `main`. After each deployment, the [post-deployment workflow](.github/workflows/post-deployment.yml) runs (on every push to `main`, on [workflow_dispatch](https://docs.github.com/en/actions/using-workflows/manually-running-a-workflow), and daily at 23:00 UTC).

It does the following:

1. **Build code samples** — Runs `generate-code-sample-snippets-file`. If `snippets/` has changes, it commits and pushes them to `main` (which triggers a new Mintlify deployment). This keeps generated snippets in sync with `.code-samples.meilisearch.yaml` and the SDK repos.

2. **Fetch OpenAPI file** — Fetches the latest `meilisearch-openapi.json` from the Meilisearch GitHub release. If the file changed, it commits and pushes to `main`.

3. **Generate and check Mintlify OpenAPI** — Runs `generate-mintlify-openapi-file`, validates with `npx mint openapi-check`, then commits and pushes `meilisearch-openapi-mintlify.json` if it changed.

Each step commits separately so the history stays clear. Contributors don’t need to run these steps manually for normal edits; the workflow keeps code samples and OpenAPI files up to date after merges to `main`.

A concurrency group ensures only one run executes at a time, so multiple triggers (many commits merged on `main`) do not run in parallel and cause conflicting commits.

The docs search index is separate from this workflow. See [Documentation search](#documentation-search).
