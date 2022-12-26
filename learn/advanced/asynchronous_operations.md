---

sidebarDepth: 2

---
# Tasks and asynchronous operations

Many operations in Meilisearch are processed **asynchronously**. These API requests are not handled immediately—instead, Meilisearch places them in a queue and processes them in the order they were received.

## Which operations are asynchronous?

Every operation that might take a long time to be processed is handled asynchronously. Processing operations asynchronously allows Meilisearch to handle resource-intensive tasks without impacting search performance.

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

When an API request triggers an asynchronous process, Meilisearch creates a task and places it in a [task queue](#task-queue).

### Task objects

Tasks are objects containing information that allow you to track their progress and troubleshoot problems when things go wrong.

A [task object](/reference/api/tasks.md#task-object) includes data not present in the original request, such as when the request was enqueued, the type of request, and an error code when the task fails:

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

For a comprehensive description of each task object field, consult the [task API reference](/reference/api/tasks.md).

#### Summarized task objects

When you make an API request for an asynchronous operation, Meilisearch returns a [summarized version](/reference/api/tasks.md#summarized-task-object) of the full `task` object.

```json
{
  "taskUid": 0,
  "indexUid": "movies",
  "status": "enqueued",
  "type": "indexCreation",
  "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

Use the summarized task's `taskUid` to [track the progress of a task](/reference/api/tasks.md#get-one-task).

#### Task `status`

Tasks always contain a field indicating the task's current `status`. This field has one of the following possible values:

- **`enqueued`**: the task has been received and will be processed soon
- **`processing`**: the task is being processed
- **`succeeded`**: the task has been successfully processed
- **`failed`**: a failure occurred when processing the task. No changes were made to the database
- **`canceled`**: the task was canceled

#### Global tasks

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

### Task queue

After creating a task, Meilisearch places it in a queue. Enqueued tasks are processed one at a time, following the order in which they were requested.

#### Task queue priority

Meilisearch considers certain tasks high-priority and always places them at the front of the queue.

The following types of tasks are always processed as soon as possible:

1. `taskCancelation`
2. `taskDeletion`
3. `snapshotCreation`
4. `dumpCreation`

All other tasks are processed in the order they were enqueued.

## Task workflow

When you make a [request for an asynchronous operation](#which-operations-are-asynchronous), Meilisearch processes all tasks following the same steps:

1. Meilisearch creates a task, puts it in the task queue, and returns a [summarized `task` object](/learn/advanced/asynchronous_operations.md#summarized-task-objects). Task `status` set to `enqueued`
2. When your task reaches the front of the queue, Meilisearch begins working on it. Task `status` set to `processing`
3. Meilisearch finishes the task. Status set to `succeeded` if task was successfully processed, or `failed` if there was an error

### Canceling and deleting tasks

You can cancel a task while it is `enqueued` or `processing` by using [the cancel tasks endpoint](/reference/api/tasks.md#cancel-tasks). Doing so changes a task's `status` to `canceled`.

Meilisearch does not automatically delete tasks once their status is `succeeded`, `failed`, or `canceled`. These tasks remain visible in [the task list](/reference/api/tasks.md#get-tasks). To delete them, use the [delete tasks route](/reference/api/tasks.md#delete-tasks).

::: note
**Terminating a Meilisearch instance in the middle of an asynchronous operation is completely safe** and will never adversely affect the database.

Tasks are not canceled when you terminate a Meilisearch instance. Meilisearch discards all progress made on `processing` tasks and resets them to `enqueued`. Task handling proceeds as normal once the instance is relaunched.
:::

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

Later, you check the task's progress one more time. It was successfully processed and its `status` changed to `succeeded`:

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

Querying the [get tasks endpoint](/reference/api/tasks.md#get-tasks) returns all tasks that have not been deleted. Use query parameters to filter tasks based on `uid`, `status`, `type`, `indexUid`, `canceledBy`, or date. Separate multiple values with a comma (`,`).

### Filter by `uid`

The following code sample returns tasks with `uid`s `5`, `10`, and `13`:

<CodeSamples id="async_guide_filter_by_ids_1" />

### Filter by `status`

The following code sample returns tasks with the `failed` and `canceled` statuses:

<CodeSamples id="async_guide_filter_by_statuses_1" />

### Filter by `type`

The following code sample returns `dumpCreation` and `indexSwap` tasks:

<CodeSamples id="async_guide_filter_by_types_1" />

### Filter by `indexUid`

The following command returns all tasks belonging to the index `movies`. Note that the `indexUid` is case-sensitive:

<CodeSamples id="async_guide_filter_by_index_uids_1" />

### Filter by `canceledBy`

Use the `canceledBy` filter to view all tasks canceled by one or more `taskCancelation` tasks:

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
Date filters are equivalent to `<` or `>` operations and do not include the specified value. It is not possible to perform `≤` or `≥` operations with a task date filter.
:::

### Combine filters

You can combine task filters. Use the ampersand character (`&`) to combine filters, equivalent to a logical `AND`.

The following code sample returns all tasks in the `movies` index that have the type `documentAdditionOrUpdate` or `documentDeletion` and have the `status` of `processing`.

<CodeSamples id="async_guide_multiple_filters_1" />

**`OR` operations between different filters are not supported.** For example, you cannot view only tasks which have a type of `documentAddition` **or** a status of `failed`.

## Paginating tasks

By default, Meilisearch returns a list of 20 tasks for each request. You can adjust the number of tasks returned using the `limit` parameter, and control where the list begins using the `from` parameter.

For each call to this endpoint, the response will include the `next` field. When you call the endpoint again, pass this value as the `from` parameter to view the next set of results.

The following command returns two tasks at a time, starting from task `uid` `10`:

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
