# GET visual reference 2

## The `task` object

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

## Get task

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

## The stats object

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

## Get status of an index

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
