# Auto-batching

If enabled, this feature automatically combines multiple document addition requests ([`POST`](/reference/api/documents.md#add-or-replace-documents) or [`PUT`](/reference/api/documents.md#add-or-update-documents)) into batches to speed up indexation.

## What does "experimental" mean?

This is an experimental feature added in `v0.26` of Meilisearch, meaning that it has not been tested to the same standards as our other features and may be reworked or removed in a future Meilisearch release.

We would like your feedback! [Join the discussion](https://github.com/meilisearch/meilisearch/discussions/2070) (GitHub account required).

## Enable auto-batching

To enable auto-batching, start Meilisearch while supplying the `--enable-autobatching` CLI flag:

```
./meilisearch --enable-autobatching
```

## Customize auto-batching behavior

There are three options for customizing auto-batching behavior:

- `debounce-duration-sec`: the number of seconds to wait between receiving a document addition task and beginning the batching and indexation process. **Default: `0`**
- `max-batch-size`: the maximum number of tasks per batch. **Default: unlimited**
- `max-documents-per-batch`: the maximum number of documents in a batch. **Default: unlimited**

::: tip

In general, users with memory overhead problems should add documents in smaller batches, while users who want the fastest indexation possible should add documents in larger batches. In other words:

- If your priority is reducing memory use during indexation, use smaller batches
- If your priority is increasing speed during indexation, use larger batches

:::
