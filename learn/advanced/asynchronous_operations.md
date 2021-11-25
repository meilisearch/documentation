# Asynchronous operations

All index writes are processed **asynchronously**. This means that task requests are not handled as soon as they are received—instead, MeiliSearch places these operations in a queue and processes them in the order they were received.

## Which operations are async?

Every operation that might take a long time to be processed is handled asynchronously.

For example, updating the `filterableAttributes` index setting will require as much time as re-indexing all the documents in this index. Because of that, MeiliSearch adds your update request to the task queue and processes it as soon as possible.

Currently, these are MeiliSearch's asynchronous operations:

- Updating index settings
- Adding documents to an index
- Updating documents in an index
- Deleting documents from an index

## Understanding tasks

After you have requested an asynchronous operation, you can use the [task API endpoint](/reference/api/tasks.md) to find the detailed status of your request. To do so, you will need your request's `uid`.

### Response

The response from the [task API endpoint](/reference/api/tasks.md) will always include the following fields in the stated order:

| Field        | Type    | Description                                                                                                      |
|--------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `uid`        | integer | The unique sequential identifier of the task                                                                     |
| `indexUid`   | string  | The unique index identifier                                                                                      |
| `status`     | string  | The status of the task, possible values are `enqueued`, `processing`, `succeeded`, `failed`                                                                                                                                    |
| `type`       | string  | The type of task, possible values are `indexCreation`, `indexUpdate`, `indexDeletion`, `documentsAddition`, `documentsPartial`, `documentsDeletion`, `settingsUpdate`, `clearAll`                                                                       |
| `details`    | object  |  Contains detailed information on the task payload                                                               |
| `error`      | object  | Shows error details and context when a task has a `failed` status                                                |
| `duration`   | string  | Represents the total elapsed time the engine was in the `processing` state in the ISO 8601 duration format     |
| `enqueuedAt` | string  | Represents the date and time in the ISO 8601 format when the task has been `enqueued`                          |
| `startedAt`  | string  | Represents the date and time in the ISO 8601 format when the task has been dequeued and started being processed. The default is `null`.                                                                                                                      |
| `finishedAt` | string  | Represents the date and time in the ISO 8601 format when the task has the `failed` or `succeeded` status. The default is `null`.                                                                                                                          |

If a task fails due to an error, all error fields will be appended to the task response in an `error` object.

### Task `status`

Task responses always contain a field indicating the request's current `status`. This field can have one of four possible values:

- `enqueued`: the task request has been received and will be processed soon
- `processing`: the task is being processed
- `processed`: the task has been successfully processed
- `failed`: a failure occurred when processing the task

The **final status of a `processed` task is `succeeded` or `failed`.**

### Examples

Suppose you add a new document to your instance using the [documents API endpoint](/reference/api/documents.md#add-or-replace-documents) and receive a `uid`.

When you query the task endpoint using this id, you see that it has been enqueued:

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentsAddition",
    "details": { "numberOfDocuments": 67493},
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
    "type": "documentsAddition",
    "details": { "numberOfDocuments": 67493},
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
    "type": "documentsAddition",
    "details": { "numberOfDocuments": 67493},
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

1. When you make a task request, MeiliSearch puts it in the task queue, sets the request `status` to `enqueued` and returns a [`task` object](/learn/advanced/asynchronous_operations.md#response)
2. When the queue reaches your task request, MeiliSearch begins processing it and changes the request `status` to `processing`
3. Once the task has been finalized, MeiliSearch marks it as `succeeded`, if it was successful, or `failed`, in case the task failed. The final status of a `processed` task is `succeeded` or `failed`.
4. Requests marked as `processed` are not deleted and will remain visible in [the operation list](/reference/api/tasks.md#get-all-tasks)

### Dumps

While dumps and tasks are both asynchronous operations, they use separate queues and behave differently. For instance, creating a new dump will freeze the task queue until the dump has been generated.

[You can read more about dumps in our dedicated guide.](/reference/features/dumps.md)

## Terminate MeiliSearch while a task is being processed

**Terminating a MeiliSearch instance in the middle of an asynchronous operation is completely safe** and will never adversely affect the database.

MeiliSearch's asynchronous tasks are atomic. This means that all operations concerning a specific task are bundled in one transaction. If any of those operations fails or is interrupted before reaching its end, nothing is committed to the database.

What happens to an asynchronous operation when MeiliSearch is terminated changes depending on the request's `status`:

- `enqueued`: the task will remain enqueued and will be processed as usual
- `processing`: there will be no consequences, since no part of the task has been committed to the database. After restarting, MeiliSearch will treat the task as `enqueued`
- `processed`: there will be no data loss since the request was successfully completed
- `failed`: the update failed and nothing has been added to the database

You can use [the task route](/reference/api/tasks.md) to determine a task's `status`.

### Example

Suppose you have used the update documents endpoint to add 100 documents in one batch to MeiliSearch.

If you terminate the instance after 99 documents have been successfully added, none of the 100 documents will be present in the dataset when you restart MeiliSearch. The same is true if the 100th document raises an error. **Either all documents are added, or none are.**
