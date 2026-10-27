---
name: curl-code-samples
description: cURL code samples for Meilisearch docs. Use when adding or changing a cURL example on a page, adding or changing the cURL for an API route, or when another skill needs this.
---

# cURL code samples

A page mounts a **snippet**. The curl lives in `.code-samples.meilisearch.yaml` and is the language-neutral source of the sample: SDK repos translate it under the same key, so readers see their preferred SDK, usually not curl. The generator writes `snippets/generated-code-samples/code_samples_<key>.mdx`, a `<CodeGroup>` of that curl plus the SDK samples. A fenced curl in MDX is a **hard miss**.

Done when every curl on the page is a mounted snippet, and every route sample is the key bound to that route.

## Reuse

Search `.code-samples.meilisearch.yaml` and the snippets under `snippets/generated-code-samples/` for a sample that already shows the call this page needs. Reuse it. When it nearly fits, improve it. A new key shows only curl until every SDK repo adds its translation, while an existing key already has them.

SDK repos match on the key, so keep keys stable. Rename a key, or change the call it makes, only on purpose: a renamed key loses its SDK samples, and a changed call leaves them stale. Name the SDK follow-up in the change.

Done when each curl this change needs is an existing key (improved if needed), or marked new because no existing sample fits, and each key renamed or re-purposed has its SDK follow-up named.

## Write

Add each new key as `key: |-` with the curl indented under it. Write one plain request, a single call with a literal body, so every SDK can express it. Match the curl shape already in that file, including `MEILISEARCH_URL` and `API_KEY`. The key is unique snake_case.

- **Route sample.** Inside `## BEGIN /reference/api` … `## END /reference/api`. The line above the key is `# <route id>`. The route id is the value `routeId` in `scripts/check-code-samples-usage.mjs` returns for that method and path. `GET /indexes/{indexUid}/settings/stop-words` → `get_indexes_indexUid_settings_stop_words`. That comment binds the key on the next line, and the API reference shows that key. A second example of the same route is a page sample.
- **Page sample.** After `## END /reference/api`. The line above the key is the previous sample's body or a blank line.

Done when each new key is in that home.

## Generate

Run `npm run generate-code-sample-snippets-file` when a key was added or its curl changed. The script rewrites every `code_samples_*.mdx` under `snippets/generated-code-samples/` and fetches SDK samples from GitHub. Leave those files as the script wrote them. When a key was added, run `npm run check-missing-sdk-samples` (informational, never fails) and name the SDKs it lists as follow-up.

Done when `code_samples_<key>.mdx` exists for each key this change mounts, and the SDKs missing each new key are named as follow-up.

## Mount

```mdx
import CodeSamplesAddOrReplaceDocuments1 from '/snippets/generated-code-samples/code_samples_add_or_replace_documents_1.mdx';
```

`<CodeSamplesAddOrReplaceDocuments1 />` sits where the example is shown.

The API reference reads a route sample from its route comment. Mount a snippet on a page that shows the example. A page sample's `code_samples_<key>` appears in an MDX page; `npm run check-code-samples-usage` is the check.

Done when every curl this change shows is a mounted snippet, and `npm run check-code-samples-usage` exits 0.
