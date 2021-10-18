# Tasks

The `tasks` route gives information about the progress of the [asynchronous processes](/learn/advanced/asynchronous_updates.md).

## Get task status

<RouteHighlighter method="GET" route="/indexes/:index_uid/tasks/:uid"/>

Get the status of a [task](/learn/advanced/asynchronous_updates.md) in a given [index](/learn/core_concepts/indexes.md).

#### Path variables

| Variable      | Description           |
| ------------- | --------------------- |
| **index_uid** | The index UID         |
| **uid**  | The task identifier |

### Example

<CodeSamples id="get_task_1" />

#### Response: `200 Ok`

Here is an example response representing [a task that has already been processed](/learn/advanced/asynchronous_updates.md#understanding-tasks).

```json
{
    "uid": 0,
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

## Get all task status

<RouteHighlighter method="GET" route="/indexes/:index_uid/tasks"/>

Get the status of all [tasks](/learn/advanced/asynchronous_updates.md) in a given [index](/learn/core_concepts/indexes.md).

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="get_all_tasks_1" />

#### Response: `200 Ok`

Here is an example response representing an [enqueued task](/learn/advanced/asynchronous_updates.md#understanding-tasks).

```json
{
    "uid": 0,
    "indexUid": "movies",
    "status": "enqueued",
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
    "duration": null,
    "enqueuedAt": "2021-08-10T14:29:17.000000Z",
    "startedAt": null,
    "finishedAt": null
}
```
