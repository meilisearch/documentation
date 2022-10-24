# API reference

Welcome to the Meilisearch API documentation.

::: tip

Check out [the FAQ](/resources/faq.md) for answers to some common questions 💡

:::

## Headers

### Recommended headers

#### Content type

Any API request with a payload (`--data-binary`) requires a `Content-Type` header. Meilisearch currently supports the following formats:

- `Content-Type: application/json` for JSON
- `Content-Type: application/x-ndjson` for NDJSON
- `Content-Type: text/csv` for CSV

The only endpoints which currently accept NDJSON and CSV `Content-Type` are the [add documents](/reference/api/documents.md#add-or-replace-documents) and [update documents](/reference/api/documents.md#add-or-update-documents) endpoints. For all others, use `Content-Type: application/json`.

#### Authorization

For almost all routes, you need to be recognized by the server to check your permissions. Add your API key to your headers.

<CodeSamples id="authorization_header_1" />

Please read about [security keys](/learn/security/master_api_keys.md) and [how to manage them](/reference/api/keys.md) for more information.

`Authorization: Bearer $API_KEY`

::: note
 v0.24 and below use the `X-MEILI-API-KEY: apiKey` authorization header.
:::

If you're having trouble understanding an error, take a look at the [complete list](/reference/errors/error_codes.md) of `code` values and descriptions.

## Asynchronous operations

Meilisearch is an **asynchronous API**. This means that in response to most write requests, you will receive a summarized version of the `task` object:

```json
{
    "taskUid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "indexUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

See more information about [asynchronous operations](/learn/advanced/asynchronous_operations.md).
