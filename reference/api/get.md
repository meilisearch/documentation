# GET

## Get one index

<RouteHighlighter method="GET" route="/indexes/:index_uid"/>

Get information about an index.

### Path variables

| Variable        | Description                                                       | Type   |
| --------------- | ----------------------------------------------------------------- |--------|
| **index_uid***  | The unique index identifier                                       | string |
| `index_uid`*    | The unique index identifier                                       |`string`|

> We can have a default value column where needed but not in all tables

### Example

<CodeSamples id='get_one_index_1' />

#### Response

:::: tabs

::: tab 200 Ok

```json
{
  "uid": "movies",
  "primaryKey": "movie_id",
  "createdAt": "2019-11-20T09:40:33.711324Z",
  "updatedAt": "2019-11-20T10:16:42.761858Z"
}
```

:::

::: tab failure1

```json
{
  "message":"Index `moviess` not found.",
  "code":"index_not_found",
  "type":"invalid_request",
  "link":"https://docs.meilisearch.com/errors#index_not_found"
}
```

:::

::: tab failure2

:::

::::
