# Asynchronous Updates

MeiliSearch is an **asynchronous API**. It means that the API does not behave as you would typically expect when handling the request's responses.

Some operations are put in a queue and will be executed in turn (asynchronously). In this case, the server response contains the identifier to track the execution of the operation.

### Async flow

- When making a write request (_create/update/delete_) against the search engine, it stores the operation received in a queue and returns an `updateId`. With this id, the operation update is trackable.
- Each update received is treated following the order it has been received.
- You can get the update status on the [`/updates`](/references/updates.md) route.

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
