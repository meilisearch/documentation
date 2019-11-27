#  Asynchronous Updates

MeiliSearch is an **asynchronous API**. It means that the API does not behave as you would typically expect when handling the request's responses.

### Async flow

- When making an update request against the search engine, it stores the update received in a queue and returns a `update_id`.
- Each update received is treated following the order it has been received.
- You can get the update status on the [`/updates`](/references/updates) route.

<mermaid>
sequenceDiagram
  participant C as Client
  participant Q as Queue
  participant M as MeiliSearch
  C->>Q: enqueue first update
  Q-->>C: return update_id: 1
  Q-->>+M: begin update 1
  C->>Q: enqueue second update
  Q-->>C: return update_id: 2
  M->>-Q: dequeue update 1
  Q-->>+M: begin update 2
  M->>-Q: dequeue update 2
</mermaid>

### Which actions are async?

Every action which could be compute-expensive is asynchronous. These include:
- Create/update a schema
- Update index settings
- Add/update/delete documents

### Understanding updates

Updates returns the following informations: 
* **status**: State of the action (enqueued, processed)
* **update_id**: Id of the update
* **update_type**: Information about the action type
* **enqueued_at**: Date at which the action has been added to the queue 
* **processed_at**: Date ate which the action has done processing.

### Examples 

Adding documents : 
```json
{
  "status": "enqueued",
  "update_id": 3,
  "update_type": {
    "name": "DocumentsAddition",
    "number": 19652
  },
  "enqueued_at": "2019-11-13T14:51:22.857056Z"
}
```

Updating a schema : 
```json 
{
  "status": "processed",
  "update_id": 2,
  "type": {
    "name": "Schema"
  },
  "duration": 0.006275499,
  "enqueued_at": "2019-11-13T14:22:50.162113Z",
  "processed_at": "2019-11-13T14:22:50.169012Z"
}
```
