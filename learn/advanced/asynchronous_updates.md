# Asynchronous updates

MeiliSearch updates are processed **asynchronously**. This means that requests are not handled as soon as they are received—instead, MeiliSearch places these operations in a queue and processes them in the order they were requested.

## Async flow

1. When you make a write request (_create/update/delete_), MeiliSearch stores the received operation in a queue and returns an `updateId`
2. Each write request is processed in the order it has been received
3. You can check your request's status by using the [`/updates`](/reference/api/updates.md) route and the `updateId` you received when you made the write request
4. Once the request has been properly handled and finalized, MeiliSearch marks it as `processed`
5. Requests marked as `processed` are not deleted and will remain visible in [the operation list](reference/api/updates.md#get-all-update-status)

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

### Which operations are async?

Every operation that might take a long time to be processed (that is, every potentially compute-expensive operation) is asynchronous. These include:

- Updating index settings
- Adding, updating, and deleting documents

### Dumps

While dumps and updates are both asynchronous processes, they use separate queues and behave differently. For instance, creating a new dump will freeze the update queue until the dump has been generated.

[You can read more about dumps in our dedicated guide.](/reference/features/dump.md)

## Understanding updates

After you have requested an update operation, you can use the update API endpoint to query the status of your request.

### Response

The response will always include the following fields:

- `status`: the state of the operation (`enqueued`, `processing`, `processed`, or `failed`)
- `updateId`: the id of the update
- `type`: the type of the operation, including its name and number
- `enqueuedAt`: the date when the operation was added to the queue

Updates marked as `processed` return additional fields:

- `duration`: the number of seconds taken to complete the operation
- `processedAt`: the date when the operation was processed

Finally, failed updates contain an extra `error` field:

- `error`: a string describing [the error that occurred](https://docs.meilisearch.com/errors/)

### Request `status`

Update responses always contain a field indicating the request's current `status`. This field can have one of four possible values:

- `enqueued`: the update request has been received and will be processed soon
- `processing`: the update is being processed
- `processed`: the update has been successfully processed
- `failed`: a failure occurred when processing the update

### Examples

You add a new document to your instance using the documents API endpoint and receive an `updateId`.

When you query the update endpoint using this id, you get the following message:

```json
{
  "status": "enqueued",
  "updateId": 1,
  "type": {
    "name": "DocumentsAddition",
    "number": 19653
  },
  "enqueuedAt": "2019-12-07T21:10:07.607581330Z"
}
```

Later, you use check the request's status one more time. It was successfully processed:

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

Had the update failed, the response would have included an error message:

```json
{
  "status": "failed",
  "updateId": 1,
  "type": {
    "name": "DocumentsAddition",
    "number": 19653
  },
  "enqueuedAt": "2019-12-07T21:10:07.607581330Z",
  "duration": 0.000048524,
  "processedAt": "2019-12-07T21:10:20.511525620Z",
  "error": "document id is missing"
}
```

## Terminate MeiliSearch while a task is being processed

Terminating a MeiliSearch instance in the middle of an update is completely safe and will never adversely affect the database.

MeiliSearch's asynchronous tasks are <clientGlossary word="atomic"/>. This means that all operations concerning a specific task are bundled in one transaction. If any of those operations fails or if the transaction is interrupted before reaching its end, nothing is committed to the database.

You can use the `status` field returned by [the update route](/reference/api/updates.md) to determine if a process has been committed to an instance or not.

What happens to an update request when MeiliSearch is terminated changes slightly depending on the request's `status`:

- `enqueued`: if MeiliSearch is killed and then restarted, the task will remain enqueued and be processed eventually
- `processing`: if MeiliSearch is killed, there will be no consequences, since no part of the task has been committed to the database. After restarting, MeiliSearch will treat the task as `enqueued`
- `processed`: this request was successfully completed and has been permanently added to the instance. If MeiliSearch is terminated, there will be no data loss
- `failed`: the update failed and nothing has been added to the database

### Example

Suppose you have use the update documents endpoint to add 100 documents in one batch to MeiliSearch.

If you terminate the instance after 99 documents have successfully been added, then none of the 100 documents will be present in the dataset when you restart MeiliSearch. The same is true if the 100th document raises an error. Either all documents are added, or none are.
