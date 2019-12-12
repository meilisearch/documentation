#  Asynchronous Updates

MeiliSearch is an **asynchronous API**. It means that the API does not behave as you would typically expect when handling the request's responses.

Some updates are put in a queue and will be executed in turn (asynchronously). In this case, the server response contains the identifier to track the execution of the update.

### Async flow

- When making a write request (*create/update/delete*) against the search engine, it stores the writing udpate received in a queue and returns an `updateId`. With this id, the specific update execution is trackable.
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

### Which updates are async?

Every update which could be compute-expensive is asynchronous. These include:
- Create/update a schema
- Update index settings
- Add/update/delete documents

### Understanding updates

Updates returns the following information:
* **status**: The state of the update (enqueued, processed, or failed).
* **updateId**: The id of the update.
* **type**: An information about the update type.
* **enqueuedAt**: The date at which the update has been added to the queue.
* **processedAt**: The date at which the update has been processed.

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

Updating a schema:
```json
{
  "status": "processed",
  "updateId": 0,
  "type": {
    "name": "Schema"
  },
  "duration": 0.000041072,
  "enqueuedAt": "2019-12-07T21:10:07.506281864Z",
  "processedAt": "2019-12-07T21:10:07.684496732Z"
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
