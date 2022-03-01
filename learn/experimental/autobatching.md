# Auto-batching

If enabled, this feature automatically combines multiple document addition requests ([`POST`](/reference/api/documents.md#add-or-replace-documents) or [`PUT`](/reference/api/documents.md#add-or-update-documents)) into batches to speed up indexation.

If you try this feature, we would like your feedback! [Join the discussion](https://github.com/meilisearch/meilisearch/discussions/2070).

## Enable auto-batching

To enable auto-batching, start Meilisearch while supplying the `--enable-autobatching` CLI flag:

```
./meilisearch --enable-autobatching
```

## Customize auto-batching behavior

There are three options allowing you to customize auto-batching behavior:

- `debounce-duration-sec`: the number of seconds to wait between receiving a document addition task and beginning the batching and indexation process. **Default: `0`**
- `max-batch-size`: the maximum number of tasks per batch. **Default: unlimited**
- `max-documents-per-batch`: the maximum number of documents in a batch. **Default: unlimited**

::: tip

In general, users with memory overhead problems should add documents in small batches, while users with plenty of memory who want the fastest indexation possible should add documents in large batches. In other words:

- To reduce memory use during indexation, use a smaller number for `max-documents-per-batch`
- To increase speed during indexation, use a larger number for `max-documents-per-batch`

:::
