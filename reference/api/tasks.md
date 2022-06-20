# Tasks

The `/tasks` route gives information about the progress of [asynchronous operations](/learn/advanced/asynchronous_operations.md).

:::note
The task `uid` is incremented **globally.**
:::

## Get tasks

<RouteHighlighter method="GET" route="/tasks"/>

List all tasks globally, regardless of index. The `task` objects are contained in the `results` array. Tasks are always returned in descending order of `uid`.

Task results are paginated and can be filtered.

#### Query parameters

| Query Parameter | Description                          |           Default Value            |
|-----------------|--------------------------------------|:----------------------------------:|
| **limit**       | number of tasks to return            |                 20                 |
| **from**        | the `uid` of the first task returned | the `uid` of the last created task |

### Filtering tasks

You can filter the task list by the value of the `status`, `type`, or `indexUid` fields. For example, this command would return only `enqueued` tasks:

```bash
curl -X GET 'http://localhost:7700/tasks?status=enqueued'
```

Use the ampersand character `&` to combine filters, equivalent to a logical `AND`. For example, the following command would return all `finished` tasks that also belong to the `movies` index:

```bash
curl -X GET 'http://localhost:7700/tasks?status=finished&indexUid=movies'
```

Use the comma character `,` to add multiple filter values for a single field. For example, to get all tasks whose `type` is either `indexUpdate` or `documentAdditionOrUpdate`, you would run the following command:

```bash
curl -X GET 'http://localhost:7700/tasks?type=indexUpdate,documentAdditionOrUpdate'
```

[Read more about the possible values of these fields in our asynchronous operations guide.](/learn/advanced/asynchronous_operations.md)

### Paginating tasks

The task list is paginated, by default returning 20 tasks at a time. You can adjust the number of documents returned using the `limit` parameter, and control where the list begins using the `from` parameter.

For each call to this endpoint, the response will include the `next` field: this value should be passed to `from` to view the next "page" of results. When the value of `next` is `null`, there are no more tasks to view.

This command returns tasks two at a time starting from task `uid` `10`.

```bash
curl -X GET 'http://localhost:7700/tasks?limit=2&from=10
```

**Response:**

```json
{
  "results": [
    {
      "uid": 10,
      "indexUid": "elements",
      "status": "succeeded",
      "type": "indexCreation",
      "details": {
        "primaryKey": null
      },
      "duration": "PT0.006034S",
      "enqueuedAt": "2022-06-20T13:41:42.446908Z",
      "startedAt": "2022-06-20T13:41:42.447477Z",
      "finishedAt": "2022-06-20T13:41:42.453511Z"
    },
    {
      "uid": 9,
      "indexUid": "particles",
      "status": "succeeded",
      "type": "indexCreation",
      "details": {
        "primaryKey": null
      },
      "duration": "PT0.007317S",
      "enqueuedAt": "2022-06-20T13:41:31.841575Z",
      "startedAt": "2022-06-20T13:41:31.842116Z",
      "finishedAt": "2022-06-20T13:41:31.849433Z"
    }
  ],
  "limit": 2,
  "from": 10,
  "next": 8
}
```

To view the next page of results, you would repeat the same query, replacing the value of `from` with the value of `next`:

```bash
curl -X GET 'http://localhost:7700/tasks?limit=2&from=8
```

You have reached the final page when the returned value of `next` is `null`.

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
            "type": "documentAddition",
            "duration": null,
            "enqueuedAt": "2021-08-12T10:00:00.000000Z",
            "startedAt": null,
            "finishedAt": null
        },
        {
            "uid": 0,
            "indexUid": "movies",
            "status": "succeeded",
            "type": "documentAddition",
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
