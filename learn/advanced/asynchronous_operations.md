# Asynchronous operations

All index writes are processed **asynchronously**. This means that task requests are not handled as soon as they are received—instead, Meilisearch places these operations in a queue and processes them in the order they were received.

## Which operations are async?

Every operation that might take a long time to be processed is handled asynchronously.

For example, updating the `filterableAttributes` index setting will require as much time as re-indexing all the documents in this index. Because of that, Meilisearch adds your update request to the task queue and processes it as soon as possible.

Currently, these are Meilisearch's asynchronous operations:

- Updating index settings
- Adding documents to an index
- Updating documents in an index
- Creating an index
- Updating an index
- Deleting an index
- Updating index settings
- Adding documents to an index
- Updating documents in an index
- Deleting documents from an index
- [Creating a dump](#dumps)

## Understanding tasks

Most of Meilisearch's asynchronous operations belong to a category called "tasks". After you have requested an asynchronous operation, you can use the [task API](/reference/tasks.md) to find the detailed status of your request. To do so, you will need your task's `uid`.

### Response

The response from the [task API](/reference/tasks.md) will always include the following fields in the stated order:

| Field        | Type    | Description                                                                                                      |
|--------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `uid`        | integer | The unique sequential identifier of the task                                                                     |
| `indexUid`   | string  | The unique index identifier                                                                                      |
| `status`     | string  | The status of the task. Possible values are `enqueued`, `processing`, `succeeded`, `failed`                                                                                                                                    |
| `type`       | string  | The type of task. Possible values are `indexCreation`, `indexUpdate`, `indexDeletion`, `documentAddition`, `documentPartial`, `documentDeletion`, `settingsUpdate`, `clearAll`                                                                       |
| `details`    | object  | Detailed information on the task payload                                                               |
| `error`      | object  | Error details and context. Only present when a task has the `failed` status                                                |
| `duration`   | string  | The total elapsed time the task spent in the `processing` state, in ISO 8601 format     |
| `enqueuedAt` | string  | The date and time when the task was first `enqueued`, in RFC 3339 format                           |
| `startedAt`  | string  | The date and time when the task began `processing`, in RFC 3339 format                                                                                                                       |
| `finishedAt` | string  | The date and time when the task finished processing, whether `failed` or `succeeded`, in RFC 3339 format.                                                                                                                          |

If a task fails due to an error, all error fields will be appended to the task response in an `error` object.

### Summarized task objects

All asynchronous operations return a summarized version of the [`task` object](#response). It contains the following fields in the stated order:

| Field      | Type    | Description                              |
|------------|---------|---------------------------------         |
| `uid`        | integer | Unique sequential identifier             |
| `indexUid`   | string  | Unique index identifier                  |
| `status`     | string  | Status of the task. Value is `enqueued`  |
| `type`       | string  | Type of task                             |
| `enqueuedAt` | string  | Represents the date and time in the RFC 3339 format when the task has been `enqueued`                                                        |

You can use this `uid` to get more details on [the status of the task](/reference/tasks.md#get-task).

### Task `status`

Task responses always contain a field indicating the request's current `status`. This field has four possible values:

- `enqueued`: the task request has been received and will be processed soon
- `processing`: the task is being processed
- `succeeded`: the task has been successfully processed
- `failed`: a failure occurred when processing the task. No changes were made to the database

### Examples

Suppose you add a new document to your instance using the [add documents endpoint](/reference/documents.md#add-or-replace-documents) and receive a `uid` in response.

When you query the task endpoint using this `uid`, you see that it has been enqueued:

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentAddition",
    "details": { 
        "receivedDocuments": 67493,
        "indexedDocuments": null
    },
    "duration": null,
    "enqueuedAt": "2021-08-10T14:29:17.000000Z",
    "startedAt": null,
    "finishedAt": null
}
```

Later, you check the request's status one more time. It was successfully processed:

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "succeeded",
    "type": "documentAddition",
    "details": { 
            "receivedDocuments": 67493,
            "indexedDocuments": 67493
    },
    "duration": "PT1S",
    "enqueuedAt": "2021-08-10T14:29:17.000000Z",
    "startedAt": "2021-08-10T14:29:18.000000Z",
    "finishedAt": "2021-08-10T14:29:19.000000Z"
}
```

Had the task failed, the response would have included an `error` object:

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "failed",
    "type": "documentAddition",
    "details": { 
            "receivedDocuments": 67493,
            "indexedDocuments": 0
    },
    "error": {
        "message": "Document does not have a `:primaryKey` attribute: `:documentRepresentation`.",
        "code": "internal",
        "type": "missing_document_id",
        "link": "https://docs.meilisearch.com/errors#missing-document-id",
    },
    "duration": "PT1S",
    "enqueuedAt": "2021-08-10T14:29:17.000000Z",
    "startedAt": "2021-08-10T14:29:18.000000Z",
    "finishedAt": "2021-08-10T14:29:19.000000Z"
}
```

## Task workflow

1. When you make a task request, Meilisearch puts it in the task queue, sets the task's `status` to `enqueued` and returns a [`task` object](/learn/advanced/asynchronous_operations.md#response)
2. When your task reaches the front of the queue, Meilisearch begins working on it and changes the request `status` to `processing`
3. Once the task has completed processing, Meilisearch marks it as `succeeded`, if it was successful, or `failed`, if there was an error.
4. Tasks marked as `succeeded` or `failed` are not deleted and will remain visible in [the task list](/reference/tasks.md#get-all-tasks)

### Dumps

While dumps and tasks are both asynchronous operations, they use separate queues and behave differently. For instance, creating a new dump will freeze the task queue until the dump has been generated.

[You can read more about dumps in our dedicated guide.](/learn/advanced/dumps.md)

## Terminate Meilisearch while a task is being processed

**Terminating a Meilisearch instance in the middle of an asynchronous operation is completely safe** and will never adversely affect the database.

Meilisearch's asynchronous tasks are atomic. This means that all operations concerning a specific task are bundled in one transaction. If any of those operations fails or is interrupted before reaching its end, nothing is committed to the database.

What happens to an asynchronous operation when Meilisearch is terminated changes depending on the request's `status`:

- `enqueued`: the task will remain enqueued and will be processed as usual once  is restarted
- `processing`: there will be no consequences, since no part of the task has been committed to the database. After restarting,  will treat the task as `enqueued`
- `succeeded`: there will be no data loss since the request was successfully completed
- `failed`: the task failed and nothing has been altered in the database

You can use [the `/tasks` route](/reference/tasks.md) to determine a task's `status`.

### Example

Suppose you have used the update documents endpoint to add 100 documents in one batch to Meilisearch.

If you terminate the instance after 99 documents have been successfully added, none of the 100 documents will be present in the dataset when you restart Meilisearch. The same is true if the 100th document raises an error. **Either all documents are added, or none are.**
