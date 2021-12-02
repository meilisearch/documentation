# Tasks

The `tasks` route gives information about the progress of [asynchronous operations](/learn/advanced/asynchronous_operations.md).

:::note
The task `uid` is incremented **globally.**
:::

## Get all tasks

<RouteHighlighter method="GET" route="/tasks"/>

List all tasks globally, regardless of index. The `task` objects are contained in the `results` array.

### Example

<CodeSamples id="get_all_tasks_1" />

#### Response: `200 Ok`

```json
{
    "results": [
        {
            "uid": 1,
            "indexUid": "movies_reviews",
            "status": "enqueued",
            "type": "documentsAddition",
            "duration": null,
            "enqueuedAt": "2021-08-12T10:00:00.000000Z",
            "startedAt": null,
            "finishedAt": null
        },
        {
            "uid": 0,
            "indexUid": "movies",
            "status": "succeeded",
            "type": "documentsAddition",
            "details": { 
                    "receivedDocuments": 100,
                    "indexedDocuments": 100
            },
            "duration": "PT16S",
            "enqueuedAt": "2021-08-11T09:25:53.000000Z",
            "startedAt": "2021-08-11T10:03:00.000000Z",
            "finishedAt": "2021-08-11T10:03:16.000000Z"
        }
    ]
}
```

:::note
Tasks are displayed in descending order by `uid`. This means that **the most recently created `task` objects appear first**.
:::

## Get task

<RouteHighlighter method="GET" route="/tasks/:uid"/>

Get a single [task](/learn/advanced/asynchronous_operations.md).

#### Path variables

| Variable      | Description           |
| ------------- | --------------------- |
| **uid**  | The task identifier |

### Example

<CodeSamples id="get_task_by_uid_1" />

#### Response: `200 Ok`

Here is an example response representing [a processed task](/learn/advanced/asynchronous_operations.md#understanding-tasks).

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "succeeded",
    "type": "settingsUpdate",
    "details": {
        "rankingRules": [
            "typo",
            "ranking:desc",
            "words",
            "proximity",
            "attribute",
            "exactness"
        ]
    },
    "duration": "PT1S",
    "enqueuedAt": "2021-08-10T14:29:17.000000Z",
    "startedAt": "2021-08-10T14:29:18.000000Z",
    "finishedAt": "2021-08-10T14:29:19.000000Z"
}
```

## Get all tasks by index

<RouteHighlighter method="GET" route="/indexes/:indexUid/tasks"/>

List all [tasks](/learn/advanced/asynchronous_operations.md) for a given [index](/learn/core_concepts/indexes.md).

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **indexUid** | The index UID |

### Example

<CodeSamples id="get_all_tasks_in_index_1" />

#### Response: `200 Ok`

Here is an example response representing an [enqueued task](/learn/advanced/asynchronous_operations.md#understanding-tasks).

```json
{
    "results": [
        {
            "uid": 1,
            "indexUid": "movies",
            "status": "enqueued",
            "type": "documentsAddition",
            "duration": null,
            "enqueuedAt": "2021-08-12T10:00:00.000000Z",
            "startedAt": null,
            "finishedAt": null
        },
        {
            "uid": 0,
            "indexUid": "movies",
            "status": "succeeded",
            "type": "documentsAddition",
            "details": { 
                    "receivedDocuments": 100,
                    "indexedDocuments": 100
            },
            "duration": "PT16S",
            "enqueuedAt": "2021-08-11T09:25:53.000000Z",
            "startedAt": "2021-08-11T10:03:00.000000Z",
            "finishedAt": "2021-08-11T10:03:16.000000Z"
        }
    ]
}
```

## Get task by index

<RouteHighlighter method="GET" route="/indexes/:indexUid/tasks/:uid"/>

Get a single [task](/learn/advanced/asynchronous_operations.md) in a given [index](/learn/core_concepts/indexes.md).

#### Path variables

| Variable      | Description           |
| ------------- | --------------------- |
| **indexUid** | The index UID         |
| **uid**  | The task identifier |

### Example

<CodeSamples id="get_task_by_index_1" />

#### Response: `200 Ok`

Here is an example response representing [a processed task](/learn/advanced/asynchronous_operations.md#understanding-tasks).

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "succeeded",
    "type": "settingsUpdate",
    "details": {
        "rankingRules": [
            "typo",
            "ranking:desc",
            "words",
            "proximity",
            "attribute",
            "exactness"
        ]
    },
    "duration": "PT1S",
    "enqueuedAt": "2021-08-10T14:29:17.000000Z",
    "startedAt": "2021-08-10T14:29:18.000000Z",
    "finishedAt": "2021-08-10T14:29:19.000000Z"
}
```
