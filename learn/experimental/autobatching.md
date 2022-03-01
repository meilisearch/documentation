# Auto-batching

If enabled, multiple document addition requests will be automatically combined into a batch and processed together to speed up indexation.

We would like your feedback on this feature! [Join the discussion](https://github.com/meilisearch/meilisearch/discussions/2070).

## Enable auto-batching

To enable auto-batching, start Meilisearch while supplying the `--enable-autobatching` CLI flag:

```
./meilisearch --enable-autobatching
```

For document addition requests to be added to the same batch, they need to:

- Target the same index
- Have the same update method (e.g. [POST](/reference/api/documents.md#add-or-replace-documents) or [PUT](/reference/api/documents.md#add-or-update-documents)
- Be immediately consecutive

After enabling autobatching, the field `batchUid` will appear in all [Task API](/reference/api/tasks.md) responses.

::: warning

If even a single task in a batch fails, the entire batch will fail.

:::

## Customization options

There are three command-line options allowing you to customize auto-batching behavior:

- `--debounce-duration-sec`: the number of seconds to wait between receiving a document addition task and beginning the batching and indexation process. **Default: `0`**
- `--max-batch-size`: the maximum number of tasks per batch. **Default: unlimited**
- `--max-documents-per-batch`: the maximum number of documents in a batch. **Default: unlimited**

::: tip

- Giving a smaller number for `max-documents-per-batch` will reduce memory use, but slow down indexation
- Giving a larger number for `max-documents-per-batch` will increase memory use, but speed up indexation

:::
