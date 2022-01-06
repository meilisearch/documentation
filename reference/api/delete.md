# DELETE

## Delete an index

<RouteHighlighter method="DELETE" route="/indexes/:index_uid"/>

Delete an [index](/learn/core_concepts/indexes.md).

### Path variables

| Variable        | Description                                                       | Type   |
| --------------- | ----------------------------------------------------------------- |--------|
| `index_uid`*    | The unique index identifier                                       |`string`|

### Example

<CodeSamples id='delete_an_index_1' />

#### Response

:::: tabs

::: tab 200 Ok

```json
{
   "uid":7,
   "indexUid":"movies",
   "status":"succeeded",
   "type":"indexDeletion",
   "details":{
      "deletedDocuments":5
   },
   "duration":"PT0.020528S",
   "enqueuedAt":"2021-12-27T14:12:53.078372Z",
   "startedAt":"2021-12-27T14:12:53.080309Z",
   "finishedAt":"2021-12-27T14:12:53.098900Z"
}
```

:::

::: tab failure1

```json
{
   "uid":8,
   "indexUid":"moviesss",
   "status":"failed",
   "type":"indexDeletion",
   "details":{
      "deletedDocuments":null
   },
   "error":{
      "message":"Index `moviesss` not found.",
      "code":"index_not_found",
      "type":"invalid_request",
      "link":"https://docs.meilisearch.com/errors#index_not_found"
   },
   "duration":"PT0.004648S",
   "enqueuedAt":"2021-12-27T14:14:00.182724Z",
   "startedAt":"2021-12-27T14:14:00.185943Z",
   "finishedAt":"2021-12-27T14:14:00.187372Z"
}
```

:::

::: tab failure2

:::

::::