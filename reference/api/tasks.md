# Tasks

The `/tasks` route gives information about the progress of [asynchronous operations](/learn/advanced/asynchronous_operations.md).

:::note
The task `uid` is incremented **globally.**
:::

## Get tasks

<RouteHighlighter method="GET" route="/tasks"/>

List all tasks globally, regardless of index. The `task` objects are contained in the `results` array.

Tasks are always returned in descending order of `uid`. This means that by default, **the most recently created `task` objects appear first**.

Task results are paginated and can be filtered. To learn more, refer to our [asynchronous operations](/learn/advanced/asynchronous_operations.md#filtering-tasks) guide.

#### Query parameters

| Query Parameter   | Description                                                                                                    |         Default Value          |
|-------------------|----------------------------------------------------------------------------------------------------------------|:------------------------------:|
| **`limit`**       | number of tasks to return                                                                                      |               20               |
| **`from`**        | `uid` of the first task returned                                                                               | `uid` of the last created task |
| **`status`**      | [filter tasks](/learn/advanced/asynchronous_operations.md#filtering-tasks) by their `status`                   |          all statuses          |
| **`type`**        | [filter tasks](/learn/advanced/asynchronous_operations.md#filtering-tasks) by their `type`                     |           all types            |
| **`indexUid`**    | [filter tasks](/learn/advanced/asynchronous_operations.md#filtering-tasks) by their `indexUid`. Case-sensitive |          all indexes           |

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
            "type": "documentAdditionOrUpdate",
            "duration": null,
            "enqueuedAt": "2021-08-12T10:00:00.000000Z",
            "startedAt": null,
            "finishedAt": null
        },
        {
            "uid": 0,
            "indexUid": "movies",
            "status": "succeeded",
            "type": "documentAdditionOrUpdate",
            "details": { 
                    "receivedDocuments": 100,
                    "indexedDocuments": 100
            },
            "duration": "PT16S",
            "enqueuedAt": "2021-08-11T09:25:53.000000Z",
            "startedAt": "2021-08-11T10:03:00.000000Z",
            "finishedAt": "2021-08-11T10:03:16.000000Z"
        }
    ],
    "limit": 20,
    "from": 1,
    "next": null
}
```

## Get one task

<RouteHighlighter method="GET" route="/tasks/{task_uid}"/>

Get a single [task](/learn/advanced/asynchronous_operations.md). The task `uid` is required.

### Example

<CodeSamples id="get_task_1" />

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
