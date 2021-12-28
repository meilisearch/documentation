# Samples

## Get one index (GET)

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

## Get stats of an index

<RouteHighlighter method="GET" route="/indexes/:index_uid/stats"/>

Get stats of an index.

### Path variables

| Variable        | Description                                                       | Type   |
| --------------- | ----------------------------------------------------------------- |--------|
| `index_uid`*    | The unique index identifier                                       |`string`|

### Fields returned

| Variable              | Description                                                       | Type    |
| --------------------- | ----------------------------------------------------------------- |---------|
| `numberOfDocuments`   | The total number of documents in an index                         |`integer`|
| `isIndexing`          | If true, the index is still processing documents and attempts to search will result in undefined behavior. If false, the index has finished processing and you can start searching.                       |`boolean`|
| `fieldDistribution`   | Shows every field in the individual index or the entire database along with the total number of documents in the index that contain that field                                                               |`object` |

## Get status of a task

The `tasks` route gives information about the progress of [asynchronous operations](/learn/advanced/asynchronous_operations.md).

### Path variables

| Variable      | Description           | Type    |
| ------------- | --------------------- |---------|
| `uid`*        | The task identifier   |`integer`|

### Fields returned

| Field        | Type      | Description                                                                                                      |
|--------------|-----------|--------------                                                                                                  |
| `uid`        | `integer` | The unique sequential identifier of the task                                                                     |
| `indexUid`   | `string`  | The unique index identifier                                                                                                                                  |
| `status`     | `string`  | The status of the task. Possible values are `enqueued`, `processing`, `succeeded`, `failed`                                                                                                                                    |
| `type`       | `string`  | The type of task. Possible values are `indexCreation`, `indexUpdate`, `indexDeletion`, `documentAddition`, `documentPartial`, `documentDeletion`, `settingsUpdate`, `clearAll`                                                                         |
| `details`    | `object`  | Detailed information on the task payload                                                                       |
| `error`      | `object`  | Error details and context. Only present when a task has the `failed` status                                                                                                                                      |
| `duration`   | `string`  | The total elapsed time the task spent in the `processing` state, in ISO 8601 format                            |
| `enqueuedAt` | `string`  | The date and time when the task was first `enqueued`, in ISO 8601 format                                       |
| `startedAt`  | `string`  | The date and time when the task began `processing`, in ISO 8601 format                                                                                                                                      |
| `finishedAt` | `string`  | The date and time when the task finished processing, whether `failed` or `succeeded`, in ISO 8601 format.                                                                                                                                     |

## Tasks

The `tasks` route gives information about the progress of [asynchronous operations](/learn/advanced/asynchronous_operations.md).

### The `task` object

`uid`
**Description:** The unique sequential identifier of the task
**Type:** `integer`

***

`indexUid`
**Description:** The unique index identifier
**Type:** `string`

***

`status`
**Description:** The status of the task
**Type:** `string`
**Possible values:** `enqueued`, `processing`, `succeeded`, `failed`

***

`type`
**Description:** The type of task
**Type:** `string`
**Possible values:** `indexCreation`, `indexUpdate`, `indexDeletion`, `documentAddition`, `documentPartial`, `documentDeletion`, `settingsUpdate`, `clearAll`

***

`details`
**Description:** Detailed information on the task payload
**Type:** `object`

***

`error`
**Description:** Error details and context. Only present when a task has the `failed` status
**Type:** `object`

***

`duration`
**Description:** The total elapsed time the task spent in the `processing` state, in ISO 8601 format
**Type:** `string`

***

`enqueuedAt`
**Description:** The date and time when the task was first `enqueued`, in ISO 8601 format
**Type:** `string`

***

`startedAt`
**Description:** The date and time when the task began `processing`, in ISO 8601 format
**Type:** `string`

***

`finishedAt`
**Description:** The date and time when the task finished processing, whether `failed` or `succeeded`, in ISO 8601 format
**Type:** `string`

### Get task

<RouteHighlighter method="GET" route="/tasks/:uid"/>

Get a single task.

#### Path variables

| Variable      | Description           | Type    |
| ------------- | --------------------- |---------|
| `uid`         | The task identifier   |`integer`|

#### Example

Returns the `task` object:

##### Response

:::: tabs

::: tab 200 Ok

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

## Stats

The `/stats` route gives extended information and metrics about indexes and the MeiliSearch database.

### The stats objects (is this the correct?)

#### `numberOfDocuments`

**Description**: The total number of documents in an index
**Type**: `string`

***

#### `isIndexing`

**Description**: If true, the index is still processing documents and attempts to search will result in undefined behavior. If false, the index has finished processing and you can start searching.
**Type**: `boolean`

***

#### `fieldDistribution`

**Description**: Shows every field in the individual index or the entire database along with the total number of documents in the index that contain that field
**Type**: `object`

### Get status of an index

<RouteHighlighter method="GET" route="/indexes/:index_uid/stats"/>

Get stats of an index.

### Path variables

| Variable        | Description                                                       | Type   |
| --------------- | ----------------------------------------------------------------- |--------|
| `index_uid`*    | The unique index identifier                                       |`string`|

### Example

<CodeSamples id="get_index_stats_1" />

#### Response

Returns the stats object:

```json
{
  "numberOfDocuments": 19654,
  "isIndexing": false,
  "fieldDistribution": {
    "poster": 19654,
    "release_date": 19654,
    "title": 19654,
    "id": 19654,
    "overview": 19654
  }
}
```

## Create an index (POST)

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

## Update an index (PUT)

<RouteHighlighter method="PUT" route="/indexes/:index_uid"/>

Update an [index](/learn/core_concepts/indexes.md).

### Path variables

| Variable        | Description                                                       | Type   |
| --------------- | ----------------------------------------------------------------- |--------|
| `index_uid`*    | The unique index identifier                                       |`string`|

### Request body

| Variable        | Description                                                       | Type     |
| --------------- | ----------------------------------------------------------------- |----------|
| `primaryKey`    | The primary key of the documents                                  | `string` |

### Example

<CodeSamples id='update_an_index_1' />

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

## Update a key (PATCH)

<RouteHighlighter method="PATCH" route="/keys/:key"/>

Update the description, permissions, or expiration date of an API key. To learn more about the variables sent in the body of the request, see the create key endpoint.

Updates to keys are **partial**. This means you should provide only the fields you intend to update, as any fields not present in the payload will remain unchanged.

#### Path variables

| Variable        | Description                                                                  | Type |
| --------------- | ---------------------------------------------------------------------------- |------|
|   `key`         | Alphanumeric value generated by MeiliSearch                                  |      |

### Example

#### Response

:::: tabs

::: tab 200 Ok

```json
{
    "description": "Manage documents: Products/Reviews API key",
    "key": "d0552b41536279a0ad88bd595327b96f01176a60c2243e906c52ac02375f9bc4",
    "actions": [
        "documents.add",
        "documents.delete"
    ],
    "indexes": [
        "products",
        "reviews"
    ],
    "expiresAt": "2021-12-31T23:59:59Z",
    "createdAt": "2021-11-12T10:00:00Z",
    "updatedAt": "2021-10-12T15:00:00Z"
}
```

:::

::: tab failure1

:::

::: tab failure2

:::

::::

## Delete an index (DELETE)

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
