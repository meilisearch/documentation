# Asynchronous updates

Index updates are processed **asynchronously**. This means that update requests are not handled as soon as they are received—instead, MeiliSearch places these operations in a queue and processes them in the order they were received.

## Which operations are async?

Every operation that might take a long time to be processed is handled asynchronously.

For example, updating the `filterableAttributes` index setting will require as much time as re-indexing all the documents in this index. Because of that, MeiliSearch adds your update request to the task queue and processes it as soon as possible.

Currently, these are MeiliSearch's asynchronous operations:

- Updating index settings
- Adding documents to an index
- Updating documents in an index
- Deleting documents from an index

## Task workflow

1. When you make an update request, MeiliSearch puts it in the task queue, sets the request `status` to `enqueued` and returns a `uid`
2. When the queue reaches your update request, MeiliSearch begins processing it and changes the request `status` to `processing`
3. Once the update has been finalized, MeiliSearch marks it as `succeeded`, if it was successful, or `failed`, in case the update failed. The final status of a `processed` task is `succeeded` or `failed`.
4. Requests marked as `processed` are not deleted and will remain visible in [the operation list](/reference/api/tasks.md#get-all-task-status)

### Dumps

While dumps and tasks are both asynchronous processes, they use separate queues and behave differently. For instance, creating a new dump will freeze the task queue until the dump has been generated.

[You can read more about dumps in our dedicated guide.](/reference/features/dumps.md)

## Understanding tasks

After you have requested a task, you can use the [task API endpoint](/reference/api/tasks.md) to find out the status of your request. To do so, you will need your request's `uid`.

### Response

The response from the [task API endpoint](/reference/api/tasks.md) will always include the following fields in the stated order:

| Field   | Type    | Description                     |
|---------|---------|---------------------------------|
| `uid`      | integer | The unique sequential identifier of the task          |
| `indexUid` | string | The unique index identifier |
| `status`  | string  | The status of the task. Possible values are `enqueued`, `processing`, `succeeded`, `failed`                                |
| `type`    | string  | The type of the task. Possible values are `indexCreation`, `indexUpdate`, `indexDeletion`, `documentsAddition`, `documentsPartial`, `documentsDeletion`, `settingsUpdate`, `clearAll` |
| `details` | object |  Details information of the task payload. `numberOfDocuments` represents the number of deduplicate documents processed for `documentsAddition`, `documentsPartial` and `documentsDeletion` type. Details contains any settings object depending of the `task` payload for a `settingsUpdate`. `clearAll`, `indexCreation`, `indexUpdate`, `indexDeletion` does not provide a `details` object. |
| `error` | object | The error object containing error details and context when a task has a `failed` status. See <https://github.com/meilisearch/specifications/pull/61>|
 | `duration` | string | The total elapsed time the engine was in the `processing` state expressed as an `ISO-8601` duration format.  |
| `enqueuedAt` | string | Represents the date and time as `ISO-8601` format when the task has been `enqueued` |
| `startedAt` | string | Represents the date and time as `ISO-8601` format when the task has been dequeued and started being `processed`. Default is set to `null`|
| `finishedAt` | string | Represents the date and time as `ISO-8601` format when the task has `failed` or `succeeded`. Default is set to `null` |

Summarized `task` Object for `202 Accepted`

| Field      | Type    | Description                     |
|------------|---------|---------------------------------|
| uid        | integer | Unique sequential identifier           |
| indexUid   | string | Unique index identifier |
| status     | string  | Status of the task. Value is `enqueued` |
| enqueuedAt | string | Represent the date and time as `ISO-8601` format when the task has been enqueued |

Tasks marked as `processed` return additional fields:

- `duration`: the number of seconds taken to complete the operation
- `processedAt`: the date when the operation was processed

Finally, if a task fails due to an [error](https://docs.meilisearch.com/errors/), all error fields will be appended to the response.

### Task `status`

Task responses always contain a field indicating the request's current `status`. This field can have one of four possible values:

- `enqueued`: the update request has been received and will be processed soon
- `processing`: the update is being processed
- `processed`: the update has been successfully processed
- `failed`: a failure occurred when processing the update

The **final status of a `processed` task is `succeeded` or `failed`.**

### Examples

Suppose you add a new document to your instance using the [documents API endpoint](/reference/api/documents.md#add-or-replace-documents) and receive a `uid`.

When you query the task endpoint using this id, you see that it has been enqueued:

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

Later, you check the request's status one more time. It was successfully processed:

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

Had the task failed, the response would have included an error message:

```json
{
    "uid": 0,
    "indexUid": "movies",
    "status": "failed",
    "type": "settingsUpdate",
    "details": {
        "rankingRules": [
            "typo",
            "ranking:desc",
            "words",
            "proximity",
            "attribute",
            "wordsPosition",
            "exactness"
        ]
    },
    "error": {
        "message": "invalid criterion wordsPosition",
        "code": "internal",
        "type": "internal_error",
        "link": "https://docs.meilisearch.com/errors#internal",
    },
    "duration": "PT1S",
    "enqueuedAt": "2021-08-10T14:29:17.000000Z",
    "startedAt": "2021-08-10T14:29:18.000000Z",
    "finishedAt": "2021-08-10T14:29:19.000000Z"
}
```

## Terminate MeiliSearch while a task is being processed

**Terminating a MeiliSearch instance in the middle of a task is completely safe** and will never adversely affect the database.

MeiliSearch's asynchronous tasks are atomic. This means that all operations concerning a specific task are bundled in one transaction. If any of those operations fails or is interrupted before reaching its end, nothing is committed to the database.

What happens to an update task when MeiliSearch is terminated changes depending on the request's `status`:

- `enqueued`: the task will remain enqueued and will be processed as usual
- `processing`: there will be no consequences, since no part of the task has been committed to the database. After restarting, MeiliSearch will treat the task as `enqueued`
- `processed`: there will be no data loss since the request was successfully completed
- `failed`: the update failed and nothing has been added to the database

You can use [the task route](/reference/api/tasks.md) to determine a task's `status`.

### Example

Suppose you have used the update documents endpoint to add 100 documents in one batch to MeiliSearch.

If you terminate the instance after 99 documents have been successfully added, none of the 100 documents will be present in the dataset when you restart MeiliSearch. The same is true if the 100th document raises an error. **Either all documents are added, or none are.**
