---

sidebarDepth: 2

---
# Tasks and asynchronous operations

All index writes are processed **asynchronously**. This means that task requests are not handled immediately—instead, Meilisearch places these operations in a queue and processes them in the order they were received.

## Which operations are async?

Every operation that might take a long time to be processed is handled asynchronously.

For example, updating the `filterableAttributes` index setting will require as much time as re-indexing all the documents in this index. Because of that, Meilisearch adds your update request to the task queue and processes it as soon as possible.

Currently, these are Meilisearch's asynchronous operations:

- Creating an index
- Updating an index
- Deleting an index
- Updating index settings
- Adding documents to an index
- Updating documents in an index
- Deleting documents from an index
- Creating a dump

## Understanding tasks

Meilisearch's asynchronous operations are called "tasks". After you have requested an asynchronous operation, you can use the [task API](/reference/api/tasks.md) to find the detailed status of your request. To do so, you will need the task's unique identifier.

### Summarized task objects

Asynchronous operations return a summarized version of [the full `task` object](/reference/api/tasks.md#task-object). You can use the summarized task's `taskUid` to follow [its status](/reference/api/tasks.md#get-one-task).

### Global tasks

Some task types are not associated with a particular index but apply to the entire instance. These tasks are called global tasks. Global tasks always display `null` for the `indexUid` field.

Meilisearch considers the following task types as global:

- [`dumpCreation`](/reference/api/tasks.md#dumpcreation)
- [`taskCancelation`](/reference/api/tasks.md#taskcancelation)
- [`taskDeletion`](/reference/api/tasks.md#taskdeletion)
- [`indexSwap`](/reference/api/tasks.md#indexswap)
- [`snapshotCreation`](/reference/api/tasks.md#snapshotcreation)

::: note
In a protected instance, your API key must have access to all indexes (`"indexes": [*]`) to view global tasks.
:::

### Task `status`

Task responses always contain a field indicating the task's current `status`. This field has one of the following possible values:

- **`enqueued`**: the task has been received and will be processed soon
- **`processing`**: the task is being processed
- **`succeeded`**: the task has been successfully processed
- **`failed`**: a failure occurred when processing the task. No changes were made to the database
- **`canceled`**: the task was canceled

#### Examples

Suppose you add a new document to your instance using the [add documents endpoint](/reference/api/documents.md#add-or-replace-documents) and receive a `taskUid` in response.

When you query the [get task endpoint](/reference/api/tasks.md#get-one-task) using this value, you see that it has been `enqueued`:

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentAdditionOrUpdate",
    "canceledBy": null,
    "details": { 
        "receivedDocuments": 67493,
        "indexedDocuments": null
    },
    "error": null,
    "duration": null,
    "enqueuedAt": "2021-08-10T14:29:17.000000Z",
    "startedAt": null,
    "finishedAt": null
}
```

Later, you check the request's status one more time. It was successfully processed and its status changed to `succeeded`:

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "succeeded",
    "type": "documentAdditionOrUpdate",
    "canceledBy": null,
    "details": { 
            "receivedDocuments": 67493,
            "indexedDocuments": 67493
    },
    "error": null,
    "duration": "PT1S",
    "enqueuedAt": "2021-08-10T14:29:17.000000Z",
    "startedAt": "2021-08-10T14:29:18.000000Z",
    "finishedAt": "2021-08-10T14:29:19.000000Z"
}
```

Had the task failed, the response would have included a detailed `error` object:

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "failed",
    "type": "documentAdditionOrUpdate",
    "canceledBy": null,
    "details": { 
            "receivedDocuments": 67493,
            "indexedDocuments": 0
    },
    "error": {
        "message": "Document does not have a `:primaryKey` attribute: `:documentRepresentation`.",
        "code": "internal",
        "type": "missing_document_id",
        "link": "https://docs.meilisearch.com/errors#missing-document-id"
    },
    "duration": "PT1S",
    "enqueuedAt": "2021-08-10T14:29:17.000000Z",
    "startedAt": "2021-08-10T14:29:18.000000Z",
    "finishedAt": "2021-08-10T14:29:19.000000Z"
}
```

If the task had been [canceled](/reference/api/tasks.md#cancel-tasks) while it was `enqueued` or `processing`, it would have the `canceled` status and a non-`null` value for the `canceledBy` field.

After a task has been [deleted](/reference/api/tasks.md#delete-tasks), trying to access it returns a [`task_not_found`](/reference/errors/error_codes.md#task-not-found) error.

## Filtering tasks

Querying the tasks endpoint returns all instance tasks that have not been deleted. Use the `filter` query parameter to filter tasks based on `uid`, `status`, `type`, `indexUid`, `canceledBy`, or date.

To filter tasks, pass the selected parameters to the get tasks endpoint, separating multiple values with a comma (`,`):

<CodeSamples id="async_guide_filter_by_ids_1" />

### Filter by `canceledBy`

When cancelling tasks, Meilisearch generates a new `taskCancellation` task. Use the `canceledBy` filter to view all tasks canceled by one or more `taskCancelation` task:

<CodeSamples id="async_guide_canceled_by_1" />

### Filter by date

You can filter tasks by their `enqueuedAt`, `startedAt`, and `finishedAt` fields. To do so, prepend either `before` or `after` to each field name:

- `enqueuedAt` → `beforeEnqueuedAt` or `afterEnqueuedAt`
- `startedAt` → `beforeStartedAt` or `afterStartedAt`
- `finishedAt` →`beforeFinishedAt`  or `afterFinishedAt`

This filter accepts dates formatted according to [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt):

- `YYYY-MM-DD`
- `YYYY-MM-DDTHH:MM:SSZ`
- `YYYY-MM-DDTHH:MM:SS+01:00`

<CodeSamples id="async_guide_filter_by_date_1" />

The above code sample will return all tasks `enqueued` **after** 11:49:53:00 on 11 Oct 2020.

::: note
Date filters are equivalent to `<` or `>` operations and do not include the specified value in the valid time interval. It is not possible to perform `≤` or `≥` operations with a task date filter.
:::

### Combine filters

You can combine task filters to get tasks meeting specific requirements. Use the ampersand character (`&`) to combine filters, equivalent to a logical `AND`.

The following code sample returns all `documentAdditionOrUpdate` and `documentDeletion` type tasks with `processing` status in the `movies` index:

<CodeSamples id="async_guide_multiple_filters_1" />

`OR` operations between different filters are not supported. For example, you cannot view only tasks which have a type of `documentAddition` **or** a status of `failed`.

## Paginating tasks

By default, Meilisearch returns a list of 20 tasks for each request. You can adjust the number of documents returned using the `limit` parameter, and control where the list begins using the `from` parameter.

For each call to this endpoint, the response will include the `next` field. Pass this value to `from` to view the next set of results. It is common to refer to sets of results as pages, and to the process of splitting and fetching these sets as pagination.

When the value of `next` is `null`, there are no more tasks to view.

This command returns tasks two at a time, starting from task `uid` `10`.

<CodeSamples id="get_all_tasks_paginating_1" />

**Response:**

```json
{
  "results": [
    …
  ],
  "limit": 2,
  "from": 10,
  "next": 8
}
```

To view the next set of results, you would repeat the same query, replacing the value of `from` with the value of `next`:

<CodeSamples id="get_all_tasks_paginating_2" />

When the returned value of `next` is `null`, you have reached the final set of results.

## Terminate Meilisearch while a task is being processed

**Terminating a Meilisearch instance in the middle of an asynchronous operation is completely safe** and will never adversely affect the database.

Meilisearch's asynchronous tasks are atomic. This means that all operations concerning a specific task are bundled in one transaction. If any of those operations fails or is interrupted before reaching its end, nothing is committed to the database.

What happens to an asynchronous operation when Meilisearch is terminated changes depending on the request's `status`:

- `enqueued`: the task will remain enqueued and will be processed as usual once Meilisearch has been restarted
- `processing`: there will be no consequences, since nothing has been committed to the database. After restarting, the task will be treated as `enqueued`
- `succeeded`: there will be no data loss since the request was successfully completed
- `failed`: the task failed and nothing has been altered in the database
- `canceled`: the task was canceled and nothing has been altered in the database

You can use [the `/tasks` route](/reference/api/tasks.md) to determine a task's `status`.

### Example

Suppose you have used the update documents endpoint to add a single batch of 100 documents to Meilisearch.

If you terminate the instance after 99 documents have been successfully added, none of the 100 documents will be present in the dataset when you restart Meilisearch. The same is true if the 100th document raises an error. **Either all documents in a batch are added, or none are.**
