# Tasks

The `/tasks` route gives information about the progress of [asynchronous operations](/learn/advanced/asynchronous_operations.md).

## Task object

```json
{
  "uid": 4,
  "indexUid" :"movie",
  "status": "failed",
  "type": "indexDeletion",
  "details": {
    "deletedDocuments": 0
  },
    "error": {
      "message": "Index `movie` not found.",
      "code": "index_not_found",
      "type": "invalid_request",
      "link": "https://docs.meilisearch.com/errors#index_not_found"
    },
      "duration": "PT0.001192S",
      "enqueuedAt": "2022-08-04T12:28:15.159167Z",
      "startedAt": "2022-08-04T12:28:15.161996Z",
      "finishedAt": "2022-08-04T12:28:15.163188Z"
}
```

### `uid`

**Type**: Integer
**Description**: Unique sequential identifier of the task

:::note
The task `uid` is incremented **globally.**
:::

### `indexUid`

**Type**: String
**Description**:  Unique identifier of the targeted index

::: note
This value is always `null` for `dumpCreation` tasks.
:::

### `status`

**Type**: String
**Description**: Status of the task. Possible values are `enqueued`, `processing`, `succeeded`, `failed`

### `type`

**Type**: String
**Description**: Type of operation performed by the task. Possible values are `indexCreation`, `indexUpdate`, `indexDeletion`, `documentAdditionOrUpdate`, `documentDeletion`, `settingsUpdate`, `dumpCreation`

### `details`

**Type**: Object
**Description**: Detailed information on the task payload. This object's contents depend on the task's `type`

#### `documentAdditionOrUpdate`

| Name                    | Description                  |
| :---------------------- | :--------------------------- |
| **`receivedDocuments`** | Number of documents received |
| **`indexedDocuments`**  | Number of documents indexed  |

#### `documentDeletion`

| Name                      | Description                     |
| :------------------------ | :------------------------------ |
| **`receivedDocumentIds`** | Number of document ids received |
| **`deletedDocuments`**    | Number of documents deleted     |

#### `indexCreation`

| Name             | Description                                                                                    |
| :--------------- | :--------------------------------------------------------------------------------------------- |
| **`primaryKey`** | Value of the `primaryKey` field supplied during index creation. `null` if it was not specified |

#### `indexUpdate`

| Name             | Description                                                                                  |
| :--------------- | :------------------------------------------------------------------------------------------- |
| **`primaryKey`** | Value of the `primaryKey` field supplied during index update. `null` if it was not specified |

#### `indexDeletion`

| Name                   | Description                                                                                       |
| :--------------------- | :------------------------------------------------------------------------------------------------ |
| **`deletedDocuments`** | Number of deleted documents. This should equal the total number of documents in the deleted index |

#### `settingsUpdate`

| Name                       | Description                   |
| :------------------------- | :---------------------------- |
| **`rankingRules`**         | List of ranking rules         |
| **`filterableAttributes`** | List of filterable attributes |
| **`distinctAttribute`**    | The distinct attribute        |
| **`searchableAttributes`** | List of searchable attributes |
| **`displayedAttributes`**  | List of displayed attributes  |
| **`sortableAttributes`**   | List of sortable attributes   |
| **`stopWords`**            | List of stop words            |
| **`synonyms`**             | List of synonyms              |
| **`typoTolerance`**        | The `typoTolerance` object    |
| **`pagination`**           | The `pagination` object       |
| **`faceting`**             | The `faceting` object         |

#### `dumpCreation`

| Name          | Description                                                                       |
| :------------ | :-------------------------------------------------------------------------------- |
| **`dumpUid`** | The generated `uid` of the dump. This is also the name of the generated dump file |

#### `taskDeletion`

| Name                | Description                                                                                                                                                                                         |
| :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`matchedTasks`**  | The number of tasks that can be deleted based on the request. If the API key doesn’t have access to any of the indexes specified in the request, those tasks will not be included in `matchedTasks` |
| **`canceledTasks`** | The number of tasks successfully deleted. If the task fails, this will be `0`                                                                                                                       |
| **`originalQuery`** | The filter used in the [`/tasks`](#delete-tasks) request                                                                                                                                            |

### `error`

**Type**: Object
**Description**: Error details and context. Only present when a task has the `failed` [status](#status)

| Name          | Description                                            |
| :------------ | :----------------------------------------------------- |
| **`message`** | A human-readable description of the error              |
| **`code`**    | The [error code](/reference/errors/error_codes.md)     |
| **`type`**    | The [error type](/reference/errors/overview.md#errors) |
| **`link`**    | A link to the relevant section of the documentation    |

### `duration`

**Type**: String
**Description**: The total elapsed time the task spent in the `processing` state, in [ISO 8601](https://www.ionos.com/digitalguide/websites/web-development/iso-8601/) format

### `enqueuedAt`

**Type**: String
**Description**: The date and time when the task was first `enqueued`, in RFC 3339 format

### `startedAt`

**Type**: String
**Description**: The date and time when the task began `processing`, in RFC 3339 format

### `finishedAt`

**Type**: String
**Description**: The date and time when the task finished `processing`, whether `failed` or `succeeded`, in RFC 3339 format

## Get tasks

<RouteHighlighter method="GET" route="/tasks"/>

List all tasks globally, regardless of index. The `task` objects are contained in the `results` array.

Tasks are always returned in descending order of `uid`. This means that by default, **the most recently created `task` objects appear first**.

Task results are [paginated](/learn/advanced/asynchronous_operations.md#paginating-tasks) and can be [filtered](/learn/advanced/asynchronous_operations.md#filtering-tasks).

### Query parameters

| Query Parameter | Default Value                  | Description                                                                                                    |
| :-------------- | :----------------------------- | :------------------------------------------------------------------------------------------------------------- |
| **`limit`**     | `20`                           | Number of tasks to return                                                                                      |
| **`from`**      | `uid` of the last created task | `uid` of the first task returned                                                                               |
| **`status`**    | `*` (all statuses)             | [Filter tasks](/learn/advanced/asynchronous_operations.md#filtering-tasks) by their `status`                   |
| **`type`**      | `*` (all types)                | [Filter tasks](/learn/advanced/asynchronous_operations.md#filtering-tasks) by their `type`                     |
| **`indexUid`**  | `*` (all indexes)              | [Filter tasks](/learn/advanced/asynchronous_operations.md#filtering-tasks) by their `indexUid`. Case-sensitive |

### Response

| Name          | Type    | Description                                                                                                                    |
| :------------ | :------ | :----------------------------------------------------------------------------------------------------------------------------- |
| **`results`** | Array   | An array of [task objects](#task-object)                                                                                       |
| **`limit`**   | Integer | Number of tasks returned                                                                                                       |
| **`from`**    | Integer | `uid` of the first task returned                                                                                               |
| **`next`**    | Integer | Value passed to `from` to view the next "page" of results. When the value of `next` is `null`, there are no more tasks to view |

### Example

<CodeSamples id="get_all_tasks_1" />

#### Response: `200 Ok`

```json
{
  "results":[
    {
      "uid":1,
      "indexUid":"movies_reviews",
      "status":"enqueued",
      "type":"documentAdditionOrUpdate",
      "duration":null,
      "enqueuedAt":"2021-08-12T10:00:00.000000Z",
      "startedAt":null,
      "finishedAt":null
    },
    {
      "uid":0,
      "indexUid":"movies",
      "status":"succeeded",
      "type":"documentAdditionOrUpdate",
      "details":{
        "receivedDocuments":100,
        "indexedDocuments":100
      },
      "duration":"PT16S",
      "enqueuedAt":"2021-08-11T09:25:53.000000Z",
      "startedAt":"2021-08-11T10:03:00.000000Z",
      "finishedAt":"2021-08-11T10:03:16.000000Z"
    }
  ],
  "limit": 20,
  "from": 1,
  "next":null
}
```

## Get one task

<RouteHighlighter method="GET" route="/tasks/{task_uid}"/>

Get a single task.

### Path parameters

| Name             | Type   | Description                         |
| :--------------- | :----- | :---------------------------------- |
| **`task_uid`** * | String | [`uid`](#uid) of the requested task |

### Example

<CodeSamples id="get_task_1" />

#### Response: `200 Ok`

```json
{
  "uid":1,
  "indexUid":"movies",
  "status":"succeeded",
  "type":"settingsUpdate",
  "details":{
    "rankingRules":[
      "typo",
      "ranking:desc",
      "words",
      "proximity",
      "attribute",
      "exactness"
    ]
  },
  "duration":"PT1S",
  "enqueuedAt":"2021-08-10T14:29:17.000000Z",
  "startedAt":"2021-08-10T14:29:18.000000Z",
  "finishedAt":"2021-08-10T14:29:19.000000Z"
}
```

## Cancel tasks

## Delete tasks

<RouteHighlighter method="DELETE" route="/tasks/cancel?{task_uid_or_status_or_type_indexUid_or_afterXAt_or_beforeXAt}"/>

Delete a finished (`succeeded`, `failed`, or `canceled` task based on `uid`, `status`, `type`, `indexUid`, and date. If a user tries deleting a processing task (`enqueued` or `processing`), it won’t throw an error. Task deletion is an atomic transaction, either all tasks are successfully deleted, or none are.

Meilisearch will return a [`task_not_found`](/reference/errors/error_codes.md#task-not-found) if you try retrieving a deleted task.

::: warning
Using this route without any filters (DELETE `/tasks`) will result in the [`missing_task_filters`](/reference/errors/error_codes.md#missing-task-filters) error.
:::
