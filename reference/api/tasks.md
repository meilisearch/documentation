# Tasks

The `tasks` route gives information about the progress of the [asynchronous processes](/learn/advanced/asynchronous_updates.md).

:::note
The task `uid` is incremented **globally.**
:::

## Get all tasks

List all tasks globally regardless of the indexes involved. It is useful for visualizing all the tasks.

#### Path variables

### Example

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
            "startedProcessingAt": null,
            "finishedAt": null
        },
        {
            "uid": 0,
            "indexUid": "movies",
            "status": "succeeded",
            "type": "documentsAddition",
            "details": {
                "numberOfDocuments": 100
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
By default, **task unique identifiers (`uid`) are sorted in `desc` order.** This means that the most recent `task` objects appear first.
:::

## Get task status by `uid`

<RouteHighlighter method="GET" route="/tasks/:uid"/>

Get the status of a [task](/learn/advanced/asynchronous_updates.md) **regardless of [index](/learn/core_concepts/indexes.md).**

#### Path variables

### Example

#### Response: `200 Ok`

Here is an example response representing [a task that has already been processed](/learn/advanced/asynchronous_updates.md#understanding-tasks).

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentsAddition",
    "duration": null,
    "enqueuedAt": "2021-08-12T10:00:00.000000Z",
    "startedAt": null,
    "finishedAt": null
}
```

## Get task status of an index

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
                "numberofDocuments": 100
            },
            "duration": "PT16S",
            "enqueuedAt": "2021-08-11T09:25:53.000000Z",
            "startedAt": "2021-08-11T10:03:00.000000Z",
            "finishedAt": "2021-08-11T10:03:16.000000Z"
        }
    ]
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
    "results": [
        {
            "uid": 1,
            "indexUid": "movies_reviews",
            "status": "enqueued",
            "type": "documentsAddition",
            "duration": null,
            "enqueuedAt": "2021-08-12T10:00:00.000000Z",
            "startedProcessingAt": null,
            "finishedAt": null
        },
        {
            "uid": 0,
            "indexUid": "movies",
            "status": "succeeded",
            "type": "documentsAddition",
            "details": {
                "numberOfDocuments": 100
            },
            "duration": "PT16S",
            "enqueuedAt": "2021-08-11T09:25:53.000000Z",
            "startedAt": "2021-08-11T10:03:00.000000Z",
            "finishedAt": "2021-08-11T10:03:16.000000Z"
        }
    ]
}
```
