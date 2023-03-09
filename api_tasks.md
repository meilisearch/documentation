# Tasks

The `/tasks` route gives information about the progress of [asynchronous operations](/learn/advanced/asynchronous_operations.md).

## Task object

```json
{
  "uid": 4,
  "indexUid" :"movie",
  "status": "failed",
  "type": "indexDeletion",
  "canceledBy": null,
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
This value is always `null` for [global tasks](/learn/advanced/asynchronous_operations.md#global-tasks).
:::

### `status`

**Type**: String
**Description**: Status of the task. Possible values are `enqueued`, `processing`, `succeeded`, `failed`, and `canceled`

### `type`

**Type**: String
**Description**: Type of operation performed by the task. Possible values are `indexCreation`, `indexUpdate`, `indexDeletion`, `indexSwap`, `documentAdditionOrUpdate`, `documentDeletion`, `settingsUpdate`, `dumpCreation`, `taskCancelation`, `taskDeletion`, and `snapshotCreation`

### `canceledBy`

**Type**: Integer
**Description**: If the task was canceled, `canceledBy` contains the `uid` of a `taskCancelation` task. If the task was not canceled, `canceledBy` is always `null`

### `details`

**Type**: Object
**Description**: Detailed information on the task payload. This object's contents depend on the task's `type`

#### `documentAdditionOrUpdate`

| Name                    | Description                                                                             |
| :---------------------- | :-------------------------------------------------------------------------------------- |
| **`receivedDocuments`** | Number of documents received                                                            |
| **`indexedDocuments`**  | Number of documents indexed. `null` while the task status is `enqueued` or `processing` |

#### `documentDeletion`

| Name                   | Description                                                                             |
| :--------------------- | :-------------------------------------------------------------------------------------- |
| **`providedIds`**      | Number of documents queued for deletion                                                 |
| **`deletedDocuments`** | Number of documents deleted. `null` while the task status is `enqueued` or `processing` |

#### `indexCreation`

| Name             | Description                                                                                    |
| :--------------- | :--------------------------------------------------------------------------------------------- |
| **`primaryKey`** | Value of the `primaryKey` field supplied during index creation. `null` if it was not specified |

#### `indexUpdate`

| Name             | Description                                                                                  |
| :--------------- | :------------------------------------------------------------------------------------------- |
| **`primaryKey`** | Value of the `primaryKey` field supplied during index update. `null` if it was not specified |

#### `indexDeletion`

| Name                   | Description                                                                                                                                                   |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`deletedDocuments`** | Number of deleted documents. This should equal the total number of documents in the deleted index. `null` while the task status is `enqueued` or `processing` |

#### `indexSwap`

| Name        | Description                                            |
| :---------- | :----------------------------------------------------- |
| **`swaps`** | Object containing the payload for the `indexSwap` task |

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

| Name          | Description                                                                                                                                                         |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`dumpUid`** | The generated `uid` of the dump. This is also the name of the generated dump file. `null` when the task status is `enqueued`, `processing`, `canceled`, or `failed` |

#### `taskCancelation`

| Name                 | Description                                                                                                                                                           |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`matchedTasks`**   | The number of matched tasks. If the API key used for the request doesn’t have access to an index, tasks relating to that index will not be included in `matchedTasks` |
| **`canceledTasks`**  | The number of tasks successfully canceled. If the task cancelation fails, this will be `0`. `null` when the task status is `enqueued` or `processing`                 |
| **`originalFilter`** | The filter used in the [cancel task](#cancel-tasks) request                                                                                                           |

::: note
Task cancelation can be successful and still have `canceledTasks: 0`. This happens when `matchedTasks` matches finished tasks (`succeeded`, `failed`, or `canceled`).
:::

#### `taskDeletion`

| Name                 | Description                                                                                                                                                           |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`matchedTasks`**   | The number of matched tasks. If the API key used for the request doesn’t have access to an index, tasks relating to that index will not be included in `matchedTasks` |
| **`deletedTasks`**   | The number of tasks successfully deleted. If the task deletion fails, this will be `0`. `null` when the task status is `enqueued` or `processing`                     |
| **`originalFilter`** | The filter used in the [delete task](#delete-tasks) request                                                                                                           |

::: note
Task deletion can be successful and still have `deletedTasks: 0`. This happens when `matchedTasks` matches `enqueued` or `processing` tasks.
:::

#### `snapshotCreation`

The `details` object is set to `null` for `snapshotCreation` tasks.

### `error`

**Type**: Object
**Description**: If the task has the `failed` [status](#status), then this object contains the error definition. Otherwise, set to `null`

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
**Description**: The date and time when the task was first `enqueued`, in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format

### `startedAt`

**Type**: String
**Description**: The date and time when the task began `processing`, in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format

### `finishedAt`

**Type**: String
**Description**: The date and time when the task finished `processing`, whether `failed`, `succeeded`, or `canceled`, in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format

### Summarized task object

When an API request triggers an asynchronous process, Meilisearch returns a summarized task object. This object contains the following fields:

| Field            | Type    | Description                                                                                                                   |
| :--------------- | :------ | :---------------------------------------------------------------------------------------------------------------------------- |
| **`taskUid`**    | Integer | Unique sequential identifier                                                                                                  |
| **`indexUid`**   | String  | Unique index identifier (always `null` for [global tasks](/learn/advanced/asynchronous_operations.md#global-tasks))           |
| **`status`**     | String  | Status of the task. Value is `enqueued`                                                                                       |
| **`type`**       | String  | Type of task                                                                                                                  |
| **`enqueuedAt`** | String  | Represents the date and time in the [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format when the task has been `enqueued` |

You can use this `taskUid` to get more details on [the status of the task](#get-one-task).

## Get tasks

<RouteHighlighter method="GET" route="/tasks"/>

List all tasks globally, regardless of index. The `task` objects are contained in the `results` array.

Tasks are always returned in descending order of `uid`. This means that by default, **the most recently created `task` objects appear first**.

Task results are [paginated](/learn/advanced/asynchronous_operations.md#paginating-tasks) and can be [filtered](/learn/advanced/asynchronous_operations.md#filtering-tasks).

### Query parameters

| Query Parameter        | Default Value                  | Description                                                                                                                                                           |
| :--------------------- | :----------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`limit`**            | `20`                           | Number of tasks to return                                                                                                                                             |
| **`from`**             | `uid` of the last created task | `uid` of the first task returned                                                                                                                                      |
| **`uids`**             | `*` (all uids)                 | [Filter tasks](/learn/advanced/asynchronous_operations.md#filtering-tasks) by their `uid`. Separate multiple task `uids` with a comma (`,`)                           |
| **`statuses`**         | `*` (all statuses)             | [Filter tasks](/learn/advanced/asynchronous_operations.md#filtering-tasks) by their `status`. Separate multiple task `statuses` with a comma (`,`)                    |
| **`types`**            | `*` (all types)                | [Filter tasks](/learn/advanced/asynchronous_operations.md#filtering-tasks) by their `type`. Separate multiple task `types` with a comma (`,`)                         |
| **`indexUids`**        | `*` (all indexes)              | [Filter tasks](/learn/advanced/asynchronous_operations.md#filtering-tasks) by their `indexUid`. Separate multiple task `indexUids` with a comma (`,`). Case-sensitive |
| **`canceledBy`**       | N/A                            | [Filter tasks](/learn/advanced/asynchronous_operations.md#filter-by-canceledby) by their `canceledBy` field. Separate multiple task `uids` with a comma (`,`)         |
| **`beforeEnqueuedAt`** | `*` (all tasks)                | [Filter tasks](/learn/advanced/asynchronous_operations.md#filter-by-date) by their `enqueuedAt` field                                                                 |
| **`beforeStartedAt`**  | `*` (all tasks)                | [Filter tasks](/learn/advanced/asynchronous_operations.md#filter-by-date) by their `startedAt` field                                                                  |
| **`beforeFinishedAt`** | `*` (all tasks)                | [Filter tasks](/learn/advanced/asynchronous_operations.md#filter-by-date) by their `finishedAt` field                                                                 |
| **`afterEnqueuedAt`**  | `*` (all tasks)                | [Filter tasks](/learn/advanced/asynchronous_operations.md#filter-by-date) by their `enqueuedAt` field                                                                 |
| **`afterStartedAt`**   | `*` (all tasks)                | [Filter tasks](/learn/advanced/asynchronous_operations.md#filter-by-date) by their `startedAt` field                                                                  |
| **`afterFinishedAt`**  | `*` (all tasks)                | [Filter tasks](/learn/advanced/asynchronous_operations.md#filter-by-date) by their `finishedAt` field                                                                 |

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
      "status":"failed",
      "type":"documentAdditionOrUpdate",
      "canceledBy": null,
      "details":{
        "receivedDocuments":100,
        "indexedDocuments":0
      },
      "error": null,
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
      "canceledBy": null,
      "details":{
        "receivedDocuments":100,
        "indexedDocuments":100
      },
      "error": null,
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

::: note
If you try retrieving a deleted task, Meilisearch will return a [`task_not_found`](/reference/errors/error_codes.md#task-not-found) error.
:::

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
  "canceledBy": null,
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
  "error": null,
  "duration":"PT1S",
  "enqueuedAt":"2021-08-10T14:29:17.000000Z",
  "startedAt":"2021-08-10T14:29:18.000000Z",
  "finishedAt":"2021-08-10T14:29:19.000000Z"
}
```

## Cancel tasks

<RouteHighlighter method="POST" route="/tasks/cancel?{query_parameter}"/>

Cancel any number of `enqueued` or `processing` tasks based on their `uid`, `status`, `type`, `indexUid`, or the date at which they were enqueued, processed, or completed.

Task cancelation is an atomic transaction: **either all tasks are successfully canceled or none are**.

::: warning
To prevent users from accidentally canceling all enqueued and processing tasks, Meilisearch throws the [`missing_task_filters`](/reference/errors/error_codes.md#missing-task-filters) error if this route is used without any filters (`POST /tasks/cancel`).
:::

::: tip Did you know?
You can also cancel `taskCancelation` type tasks as long as they are in the `enqueued` or `processing` state. This is possible because `taskCancelation` type tasks are processed in reverse order, such that the last one you enqueue will be processed first.
:::

### Query parameters

A valid `uids`, `statuses`, `types`, `indexUids`, or date(`beforeXAt` or `afterXAt`) parameter is required.

| Query Parameter        | Description                                                                                                                          |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **`uids`**             | Cancel tasks based on `uid`. Separate multiple `uids` with a comma (`,`). Use `uids=*` for all `uids`                                |
| **`statuses`**         | Cancel tasks based on `status`. Separate multiple `statuses` with a comma (`,`). Use `statuses=*` for all `statuses`                 |
| **`types`**            | Cancel tasks based on `type`. Separate multiple `types` with a comma (`,`). Use `types=*` for all `types`                            |
| **`indexUids`**        | Cancel tasks based on `indexUid`. Separate multiple `uids` with a comma (`,`). Use `indexUids=*` for all `indexUids`. Case-sensitive |
| **`beforeEnqueuedAt`** | Cancel tasks **before** a specified `enqueuedAt` date. Use `beforeEnqueuedAt=*` to cancel all tasks                                  |
| **`beforeStartedAt`**  | Cancel tasks **before** a specified `startedAt` date. Use `beforeStartedAt=*` to cancel all tasks                                    |
| **`afterEnqueuedAt`**  | Cancel tasks **after** a specified `enqueuedAt` date. Use `afterEnqueuedAt=*` to cancel all tasks                                    |
| **`afterStartedAt`**   | Cancel tasks **after** a specified `startedAt` date. Use `afterStartedAt=*` to cancel all tasks                                      |

::: note
Date filters are equivalent to `<` or `>` operations. At this time, there is no way to perform a `≤` or `≥` operations with a date filter.
:::

[To learn more about filtering tasks, refer to our dedicated guide.](/learn/advanced/asynchronous_operations.md#filtering-tasks)

### Example

<CodeSamples id="cancel_tasks_1" />

#### Response: `200 Ok`

```json
{
  "taskUid": 3,
  "indexUid": null,
  "status": "enqueued",
  "type": "taskCancelation",
  "enqueuedAt": "2021-08-12T10:00:00.000000Z"
}
```

::: note
Since `taskCancelation` is a [global task](/learn/advanced/asynchronous_operations.md#global-tasks), its `indexUid` is always `null`.
:::

You can use this `taskUid` to get more details on the [status of the task](#get-one-task).

### Cancel all tasks

You can cancel all `processing` and `enqueued` tasks using the following filter:

<RouteHighlighter method="POST" route="/tasks/cancel?statuses=processing,enqueued" />

The API key used must have access to all indexes (`"indexes": [*]`) and the [`task.cancel`](/reference/api/keys.md#actions) action.

## Delete tasks

<RouteHighlighter method="DELETE" route="/tasks?{query_parameter}"/>

Delete a finished (`succeeded`, `failed`, or `canceled`) task based on `uid`, `status`, `type`, `indexUid`, `canceledBy`, or date. Task deletion is an atomic transaction: **either all tasks are successfully deleted, or none are**.

::: warning
To prevent users from accidentally deleting the entire task history, Meilisearch throws the [`missing_task_filters`](/reference/errors/error_codes.md#missing-task-filters) error if this route is used without any filters (DELETE `/tasks`).
:::

### Query parameters

A valid `uids`, `statuses`, `types`, `indexUids`, `canceledBy`, or date(`beforeXAt` or `afterXAt`) parameter is required.

| Query Parameter        | Description                                                                                                                          |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **`uids`**             | Delete tasks based on `uid`. Separate multiple `uids` with a comma (`,`). Use `uids=*` for all `uids`                                |
| **`statuses`**         | Delete tasks based on `status`. Separate multiple `statuses` with a comma (`,`). Use `statuses=*` for all `statuses`                 |
| **`types`**            | Delete tasks based on `type`. Separate multiple `types` with a comma (`,`). Use `types=*` for all `types`                            |
| **`indexUids`**        | Delete tasks based on `indexUid`. Separate multiple `uids` with a comma (`,`). Use `indexUids=*` for all `indexUids`. Case-sensitive |
| **`canceledBy`**       | Delete tasks based on the `canceledBy` field                                                                                         |
| **`beforeEnqueuedAt`** | Delete tasks **before** a specified `enqueuedAt` date. Use `beforeEnqueuedAt=*` to delete all tasks                                  |
| **`beforeStartedAt`**  | Delete tasks **before** a specified `startedAt` date. Use `beforeStartedAt=*` to delete all tasks                                    |
| **`beforeFinishedAt`** | Delete tasks **before** a specified `finishedAt` date. Use `beforeFinishedAt=*` to delete all tasks                                  |
| **`afterEnqueuedAt`**  | Delete tasks **after** a specified `enqueuedAt` date. Use `afterEnqueuedAt=*` to delete all tasks                                    |
| **`afterStartedAt`**   | Delete tasks **after** a specified `startedAt` date. Use `afterStartedAt=*` to delete all tasks                                      |
| **`afterFinishedAt`**  | Delete tasks **after** a specified `finishedAt` date. Use `afterFinishedAt=*` to delete all tasks                                    |

::: note
Date filters are equivalent to `<` or `>` operations. At this time, there is no way to perform a `≤` or `≥` operations with a date filter.
:::

[To learn more about filtering tasks, refer to our dedicated guide.](/learn/advanced/asynchronous_operations.md#filtering-tasks)

### Example

<CodeSamples id="delete_tasks_1" />

#### Response: `200 Ok`

```json
{
  "taskUid": 3,
  "indexUid": null,
  "status": "enqueued",
  "type": "taskDeletion",
  "enqueuedAt": "2021-08-12T10:00:00.000000Z"
}
```

::: note
Since `taskDeletion` is a [global task](/learn/advanced/asynchronous_operations.md#global-tasks), its `indexUid` is always `null`.
:::

You can use this `taskUid` to get more details on the [status of the task](#get-one-task).

### Delete all tasks

You can delete all finished tasks by using the following filter:

<RouteHighlighter method="DELETE" route="/tasks?statuses=failed,canceled,succeeded" />

The API key used must have access to all indexes (`"indexes": [*]`) and the [`task.delete`](/reference/api/keys.md#actions) action.
