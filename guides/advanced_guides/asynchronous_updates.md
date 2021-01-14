# Asynchronous Updates

MeiliSearch is an **asynchronous API**. It means that the API does not behave as you would typically expect when handling the request's responses.

Some operations are put in a queue and will be executed in turn (asynchronously). In this case, the server response contains the identifier to track the execution of the operation.

### Async flow

- When making a write request (_create/update/delete_) against the search engine, it stores the operation received in a queue and returns an `updateId`. With this id, the operation update is trackable.
- Each update received is treated following the order it has been received.
- You can get the update status on the [`/updates`](/references/updates.md) route.
- Processed updates are marked as processed and kept in the operation list (available at `/indexes/:index_uid/updates`). They won't be deleted.

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

Every operation which could be compute-expensive is asynchronous. These include:

- Update index settings
- Add/update/delete documents

### Understanding updates

Updates returns the following information:

- **status**: The state of the operation (enqueued, processed, or failed).
- **updateId**: The id of the update.
- **type**: The type of the operation.
- **enqueuedAt**: The date at which the operation has been added to the queue.
- **processedAt**: The date at which the operation has been processed.

### Examples

Adding documents:

```json
{
  "status": "processed",
  "updateId": 1,
  "type": {
    "name": "DocumentsAddition",
    "number": 19653
  },
  "duration": 12.757581815,
  "enqueuedAt": "2019-12-07T21:10:07.607581330Z",
  "processedAt": "2019-12-07T21:10:20.511525620Z"
}
```

Failing to upload document:

```json
{
  "status": "failed",
  "updateId": 3,
  "type": {
    "name": "DocumentsAddition",
    "number": 1
  },
  "error": "document id is missing",
  "duration": 0.000048524,
  "enqueuedAt": "2019-12-07T20:23:50.156433207Z",
  "processedAt": "2019-12-07T20:23:50.157436246Z"
}
```

### Killing MeiliSearch While a Task is Processing

Since in MeiliSearch asynchronous tasks are [atomic](https://en.wikipedia.org/wiki/Atomicity_(database_systems)), killing MeiliSearch in the middle of a process does not corrupt or alter the database.

> An atomic transaction is an indivisible and irreducible series of database operations such that either all occur, or nothing occurs.

Essentially, tasks are done in transactions. If the transaction fails or is killed for any reason before completing, none of the tasks will be committed to your database.

You can use the `status` field returned by [the update route](/references/updates.md) to determine if a process has been committed to MeiliSearch or not.

- status: `enqueued` => Not yet begun. If MeiliSearch is killed and then restarted, the task will remain enqueued and be processed eventually.
- status `processing` => In progress. If MeiliSearch is killed, there will be no consequences, since no part of the task has been committed to MeiliSearch. After restarting, Meilisearch will treat the task as `enqueued`.
- status `done` => Completed. This action is done and is permanently added to your MeiliSearch instance. If you kill MeiliSearch, there will be no data loss; your database will remain exactly the same as before you killed MeiliSearch.

#### Example

Imagine that you're adding 100 documents in one batch to MeiliSearch. If you kill the process after 99 documents have successfully been added, then none of the 100 documents will be present in the dataset when you restart MeiliSearch. The same is true if the 100th document raises an error. Either all documents are added, or none are.

Thus, **killing MeiliSearch is always safe!**
