# Auto-batching

::: warning

🚨 This is an experimental feature 🚨
Using it may result in unexpected crashes, bugs, or holes in the space-time continuum.
You have been warned.

:::

Auto-batching is an experimental feature designed to improve indexing speed.

When auto-batching is enabled, consecutive document addition requests may be automatically combined into a batch and processed together, significantly speeding up the indexing process.

We would appreciate your feedback on this feature. [Join the discussion](https://github.com/meilisearch/meilisearch/discussions/2070).

## Enable auto-batching

To enable auto-batching, start Meilisearch while supplying the `--enable-auto-batching` CLI flag:

```
./meilisearch --enable-auto-batching
```

For document addition requests to be added to the same batch, they need to:

- Target the same index
- Have the same update method (i.e., [POST](/reference/api/documents.md#add-or-replace-documents) or [PUT](/reference/api/documents.md#add-or-update-documents))
- Be immediately consecutive

By default, **auto-batching will not delay processing a request in order to batch multiple requests together.** If it can process the request immediately, it will. [This behavior can be altered using a command-line option](#customization-options).

After enabling autobatching, the field `batchUid` will appear in all [task API](/reference/api/tasks.md) responses.

::: warning

If even a single task in a batch fails, the entire batch will fail.

:::

## Customization options

There are three command-line options allowing you to customize auto-batching behavior:

- `--debounce-duration-sec`: the number of seconds to wait between receiving a document addition task and beginning batching and indexing. **Default: `0`**
- `--max-batch-size`: the maximum number of tasks per batch. **Default: unlimited**
- `--max-documents-per-batch`: the maximum number of documents in a batch. **Default: unlimited**

::: tip

- Giving a smaller number for `max-documents-per-batch` will reduce memory use, but slow down indexing
- Giving a larger number for `max-documents-per-batch` will increase memory use, but speed up indexing

:::
