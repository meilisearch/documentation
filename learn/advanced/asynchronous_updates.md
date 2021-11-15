# Asynchronous updates

Index updates are processed **asynchronously**. This means that update requests are not handled as soon as they are received—instead, MeiliSearch places these operations in a queue and processes them in the order they were received.

## Which operations are async?

Every operation that might take a long time to be processed is handled asynchronously.

For example, updating the `filterableAttributes` index setting will require as much time as re-indexing all the documents in this index. Because of that, MeiliSearch adds your update request to the update queue and processes it as soon as possible.

Currently, these are MeiliSearch's asynchronous operations:

- Updating index settings
- Adding documents to an index
- Updating documents in an index
- Deleting documents from an index

## Update workflow

1. When you make an update request, MeiliSearch puts it in the update queue, sets the request `status` to `enqueued` and returns an `updateId`
2. When the queue reaches your update request, MeiliSearch begins processing it and changes the request `status` to `processing`
3. Once the update has been finalized, MeiliSearch marks it as `processed`, if it was successful, or `failed`, in case the update failed
4. Requests marked as `processed` are not deleted and will remain visible in [the operation list](/reference/api/updates.md#get-all-update-status)

<mermaid>
sequenceDiagram
  participant C as Client
  participant Q as Queue
  participant M as MeiliSearch
  C->>Q: enqueue first update
  Q-->>C: return updateId: 1
  Q-->>+M: begin update 1
  C->>Q: enqueue second update
  Q-->>C: return updateId: 2
  M->>-Q: dequeue update 1
  Q-->>+M: begin update 2
  M->>-Q: dequeue update 2
</mermaid>

### Dumps

While dumps and updates are both asynchronous processes, they use separate queues and behave differently. For instance, creating a new dump will freeze the update queue until the dump has been generated.

[You can read more about dumps in our dedicated guide.](/reference/features/dumps.md)

## Understanding updates

After you have requested an update, you can use the [update API endpoint](/reference/api/updates.md) to find out the status of your request. To do so, you will need your request's `updateId`.

### Response

The response you get from the [update API endpoint](/reference/api/updates.md) will always include the following fields:

- `status`: the state of the operation (`enqueued`, `processing`, `processed`, or `failed`)
- `updateId`: the id of the update
- `type`: the type of the operation, including its name and number
- `enqueuedAt`: the date when the operation was added to the queue

Updates marked as `processed` return additional fields:

- `duration`: the number of seconds taken to complete the operation
- `processedAt`: the date when the operation was processed

Finally, if an update fails due to an error, all error fields will be appended to the response.

### Update `status`

Update responses always contain a field indicating the request's current `status`. This field can have one of four possible values:

- `enqueued`: the update request has been received and will be processed soon
- `processing`: the update is being processed
- `processed`: the update has been successfully processed
- `failed`: a failure occurred when processing the update

### Examples

Suppose you add a new document to your instance using the [documents API endpoint](/reference/api/documents.md#add-or-replace-documents) and receive an `updateId`.

When you query the update endpoint using this id, you see that it has been enqueued:

```json
{
  "status": "enqueued",
  "updateId": 1,
  "type": { "name": "DocumentsAddition" },
  "enqueuedAt": "2019-12-07T21:10:07.607581330Z"
}
```

Later, you check the request's status one more time. It was successfully processed:

```json
{
  "status": "processed",
  "updateId": 1,
  "type": {
    "name": "DocumentsAddition",
    "number": 19653
  },
  "enqueuedAt": "2019-12-07T21:10:07.607581330Z",
  "duration": 12.757581815,
  "processedAt": "2019-12-07T21:10:20.511525620Z"
}
```

Had the update failed, the response would have included an error object:

```json
{
  "status": "failed",
  "updateId": 0,
  "type": { "name": "DocumentsAddition" },
  "error": {
    "message": "The primary key inference process failed because the engine did not find any fields containing `id` substring in their name. If your document identifier does not contain any `id` substring, you can set the primary key of the index.",
    "code": "primary_key_inference_failed",
    "type": "invalid_request",
    "link": "https://docs.meilisearch.com/errors#primary_key_inference_failed"
  },
  "duration": 0,
  "enqueuedAt": "2021-11-11T13:31:12.051786Z",
  "processedAt": "2021-11-11T13:31:12.052899Z"
}
```

## Terminate MeiliSearch while a task is being processed

**Terminating a MeiliSearch instance in the middle of an update is completely safe** and will never adversely affect the database.

MeiliSearch's asynchronous tasks are atomic. This means that all operations concerning a specific task are bundled in one transaction. If any of those operations fails or is interrupted before reaching its end, nothing is committed to the database.

What happens to an update task when MeiliSearch is terminated changes depending on the request's `status`:

- `enqueued`: the task will remain enqueued and will be processed as usual
- `processing`: there will be no consequences, since no part of the task has been committed to the database. After restarting, MeiliSearch will treat the task as `enqueued`
- `processed`: there will be no data loss since the request was successfully completed
- `failed`: the update failed and nothing has been added to the database

You can use [the update route](/reference/api/updates.md) to determine an update's `status`.

### Example

Suppose you have used the update documents endpoint to add 100 documents in one batch to MeiliSearch.

If you terminate the instance after 99 documents have been successfully added, none of the 100 documents will be present in the dataset when you restart MeiliSearch. The same is true if the 100th document raises an error. **Either all documents are added, or none are.**
