---

sidebarDepth: 2

---
# Asynchronous operations

All index writes are processed **asynchronously**. This means that task requests are not handled as soon as they are received—instead, Meilisearch places these operations in a queue and processes them in the order they were received.

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

All of Meilisearch's asynchronous operations belong to a category called "tasks". After you have requested an asynchronous operation, you can use the [task API](/reference/api/tasks.md) to find the detailed status of your request. To do so, you will need the task's unique identifier.

### Summarized task objects

All asynchronous operations return a summarized version of [the full `task` object](/reference/api/tasks.md#task-object). It contains the following fields in the stated order:

| Field            | Type    | Description                                                                                                                   |
| :--------------- | :------ | :---------------------------------------------------------------------------------------------------------------------------- |
| **`taskUid`**    | Integer | Unique sequential identifier                                                                                                  |
| **`indexUid`**   | String  | Unique index identifier (always `null` for [global tasks](#global-tasks))                                                     |
| **`status`**     | String  | Status of the task. Value is `enqueued`                                                                                       |
| **`type`**       | String  | Type of task                                                                                                                  |
| **`enqueuedAt`** | String  | Represents the date and time in the [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format when the task has been `enqueued` |

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

### Global tasks

Some task types are not associated with a particular index but apply to the entire instance. These tasks are called global tasks. Global tasks always display `null` for the `indexUid` field.

Meilisearch considers the following task types as global:

- [`dumpCreation`](/reference/api/tasks.md#dumpcreation)
- [`taskCancelation`](/reference/api/tasks.md#taskcancelation)
- [`taskDeletion`](/reference/api/tasks.md#taskdeletion)
- [`indexSwap`](/reference/api/tasks.md#indexswap)
- [`snapshotCreation`](/reference/api/tasks.md#snapshotcreation)

::: note
Your API key must have access to all indexes (`"indexes": [*]`) in order to access global tasks.
:::

### Task `status`

Task responses always contain a field indicating the request's current `status`. This field has one of the following possible values:

- **`enqueued`**: the task request has been received and will be processed soon
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

Later, you check the request's status one more time. It was successfully processed and the status is `succeeded`:

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

If the task had been [canceled](/reference/api/tasks.md#cancel-tasks) while it was `enqueued` or `processing`, it would have the `canceled` status and a non-`null` value for the `canceledBy` field:

```json
{
  "uid": 1,
  "indexUid": null,
  "status": "canceled",
  "type": "settingsUpdate",
  "canceledBy": 5,
  "details": {
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
  "duration": "PT1S",
  "enqueuedAt": "2021-08-10T14:29:17.000000Z",
  "startedAt": "2021-08-10T14:29:18.000000Z",
  "finishedAt": "2021-08-10T14:29:19.000000Z"
}
```

Once a task is [deleted](/reference/api/tasks.md#delete-tasks), Meilisearch returns a [`task_not_found`](/reference/errors/error_codes.md#task-not-found) error.

### Filtering tasks

You can filter tasks based on `uid`, `status`, `type`, `indexUid`, `canceledBy`, or date.

#### Filter by `uid`

The following code sample returns tasks with `uid`s `5`, `10`, and `13`:

<CodeSamples id="async_guide_filter_by_ids_1" />

#### Filter by `status`

The following code sample returns tasks with the `failed` and `canceled` statuses:

<CodeSamples id="async_guide_filter_by_statuses_1" />

#### Filter by `type`

The following code sample returns `dumpCreation` and `indexSwap` tasks:

<CodeSamples id="async_guide_filter_by_types_1" />

#### Filter by `indexUid`

The following command returns all tasks belonging to the index `movies`. Note that the `indexUid` is case-sensitive:

<CodeSamples id="async_guide_filter_by_index_uids_1" />

#### Filter by `canceledBy`

You can use the `canceledBy` filter to get the tasks canceled by one or more `taskCancelation` tasks.

The code sample below filters all tasks canceled by the tasks with `uid`s `9` and `15`:

<CodeSamples id="async_guide_canceled_by_1" />

#### Filter by date

You can filter tasks using `beforeXAt` and `afterXAt` with the `enqueuedAt`, `startedAt`, and `finishedAt` fields:

- `enqueuedAt` → `beforeEnqueuedAt` or `afterEnqueuedAt`
- `startedAt` → `beforeStartedAt` or `afterStartedAt`
- `finishedAt` →`beforeFinishedAt`  or `afterFinishedAt`

This filter accepts the [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format. The following date syntaxes are valid:

- `YYYY-MM-DD`
- `YYYY-MM-DDTHH:MM:SSZ`
- `YYYY-MM-DDTHH:MM:SS+01:00`

<CodeSamples id="async_guide_filter_by_date_1" />

The above code sample will return all tasks `enqueued` **after** 11:49:53 am on 11 Oct 2020. It will start with the tasks `enqueued` at 11:49:54 am on 11 Oct 2020.

::: note
Date filters are equivalent to `<` or `>` operations. At this time, there is no way to perform a `≤` or `≥` operations with a date filter.
:::

#### Combine filters

You can combine the above mentioned filters to get tasks meeting specific requirements. Use the ampersand character (`&`) to combine filters, equivalent to a logical `AND`. Use the comma character (`,`) to add multiple filter values for a single field, equivalent to a logical `OR`.

The following code sample will return all `documentAdditionOrUpdate` and `documentDeletion` type tasks with `processing` status in the `movies` index:

<CodeSamples id="async_guide_multiple_filters_1" />

At this time, `OR` operations between different filters are not supported. For example, you cannot view only tasks which have a type of `documentAddition` **or** a status of `failed`.

### Paginating tasks

The task list is paginated, by default returning 20 tasks at a time. You can adjust the number of documents returned using the `limit` parameter, and control where the list begins using the `from` parameter.

For each call to this endpoint, the response will include the `next` field: this value should be passed to `from` to view the next "page" of results. When the value of `next` is `null`, there are no more tasks to view.

This command returns tasks two at a time, starting from task `uid` `10`.

<CodeSamples id="get_all_tasks_paginating_1" />

**Response:**

```json
{
  "results": [
    {
      "uid": 10,
      "indexUid": "elements",
      "status": "succeeded",
      "type": "indexCreation",
      "canceledBy": null,
      "details": {
        "primaryKey": null
      },
      "error": null,
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
      "canceledBy": null,
      "details": {
        "primaryKey": null
      },
      "error": null,
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

<CodeSamples id="get_all_tasks_paginating_2" />

When the returned value of `next` is `null`, you have reached the final page of results.

## Task workflow

1. When you make an [asynchronous request](#which-operations-are-async), Meilisearch puts it in the task queue, sets the task's `status` to `enqueued` and returns a [summarized `task` object](/learn/advanced/asynchronous_operations.md#summarized-task-objects)
2. When your task reaches the front of the queue, Meilisearch begins working on it and changes the request `status` to `processing`
3. You can cancel a task while it is in the `enqueued` or `processing` states. If canceled, it will have the `canceled` status  
4. Once the task has completed processing, Meilisearch marks it as `succeeded`, if it was successful, or `failed`, if there was an error
5. Tasks marked as `succeeded`, `failed`, or `canceled` are not automatically deleted and will remain visible in [the task list](/reference/api/tasks.md#get-tasks). They can be deleted manually using the [delete tasks route](/reference/api/tasks.md#delete-tasks)

### Task priority

Tasks are processed in the order they were enqueued, with the exception of `taskCancelation` which is processed in reverse order.

`taskCancelation`, `taskDeletion`, `snapshotCreation`, and `dumpCreation` are prioritized over all other tasks in the queue. Their task `uid`s still reflect when they were enqueued relative to other tasks.

The following list shows different task types in decreasing order of priority:

1. `taskCancelation`
2. `taskDeletion`
3. `snapshotCreation`
4. `dumpCreation`
5. All other task types in the order they were enqueued

## Terminate Meilisearch while a task is being processed

**Terminating a Meilisearch instance in the middle of an asynchronous operation is completely safe** and will never adversely affect the database.

Meilisearch's asynchronous tasks are atomic. This means that all operations concerning a specific task are bundled in one transaction. If any of those operations fails or is interrupted before reaching its end, nothing is committed to the database.

What happens to an asynchronous operation when Meilisearch is terminated changes depending on the request's `status`:

- `enqueued`: the task will remain enqueued and will be processed as usual once Meilisearch has been restarted
- `processing`: there will be no consequences, since no part of the task has been committed to the database. After restarting, the task will be treated as `enqueued`
- `succeeded`: there will be no data loss since the request was successfully completed
- `failed`: the task failed and nothing has been altered in the database
- `canceled`: the task was canceled and nothing has been altered in the database

You can use [the `/tasks` route](/reference/api/tasks.md) to determine a task's `status`.

### Example

Suppose you have used the update documents endpoint to add 100 documents in one batch to Meilisearch.

If you terminate the instance after 99 documents have been successfully added, none of the 100 documents will be present in the dataset when you restart Meilisearch. The same is true if the 100th document raises an error. **Either all documents are added, or none are.**
