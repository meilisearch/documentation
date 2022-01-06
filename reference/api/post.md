# POST

## Create an index

<RouteHighlighter method="POST" route="/indexes"/>

Create an [index](/learn/core_concepts/indexes.md).

This route takes as parameter an unique `uid` and **optionally** the [primary key](/learn/core_concepts/indexes.md#primary-key).

::: note
An index is automatically created when adding [documents](/reference/api/documents.md) or [settings](/reference/api/settings.md) to an index that does not already exist.
:::

### Request body

| Variable        | Description                                                       | Type     |
| --------------- | ----------------------------------------------------------------- |----------|
| `index_uid` *   | The unique index identifier                                       | `string` |
| `primaryKey`    | The primary key of the documents                                  | `string` |

```json
{
  "uid": "movies",
  "primaryKey": "movie_id"
}
```

### Example

<CodeSamples id='create_an_index_1' />

#### Response

:::: tabs

::: tab 201 created

```json
{
   "uid":5,
   "indexUid":"books2",
   "status":"succeeded",
   "type":"documentAddition",
   "details":{
      "receivedDocuments":5,
      "indexedDocuments":5
   },
   "duration":"PT0.024959S",
   "enqueuedAt":"2021-12-27T12:41:17.095632Z",
   "startedAt":"2021-12-27T12:41:17.096141Z",
   "finishedAt":"2021-12-27T12:41:17.120591Z"
}
```

:::

::: tab failure1

```json
{
   "uid":4,
   "indexUid":"books",
   "status":"failed",
   "type":"documentAddition",
   "details":{
      "receivedDocuments":5,
      "indexedDocuments":null
   },
   "error":{
      "message":"Document doesn't have a `id` attribute: `{\"title\":\"The Parable of the Sower\",\"author\":\"Octavia E. Butler\",\"genres\":[\"science fiction\"],\"price\":10.0,\"priority\":1}`.",
      "code":"missing_document_id",
      "type":"invalid_request",
      "link":"https://docs.meilisearch.com/errors#missing_document_id"
   },
   "duration":"PT0.015680S",
   "enqueuedAt":"2021-12-27T12:35:57.706393Z",
   "startedAt":"2021-12-27T12:35:57.709537Z",
   "finishedAt":"2021-12-27T12:35:57.722073Z"
}
```

:::

::: tab failure2

```json
{
   "message":"The `json` payload provided is malformed. `Couldn't serialize document value: expected `,` or `}` at line 12 column 5`.",
   "code":"malformed_payload",
   "type":"invalid_request",
   "link":"https://docs.meilisearch.com/errors#malformed_payload"
}
```

:::

::::
