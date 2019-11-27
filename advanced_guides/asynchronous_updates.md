#  Asynchronous Updates

<<<<<<< HEAD:advanced_guides/updates.md
Since many of the meilisearch actions are asynchronous, their route returns an update identifier. This makes it possible to track the progress of the action.

Updates returns the following information :
=======
MeiliSearch is an **asynchronous API**. It means that the API will not behave as you would normally expect when handling the request's responses.

### Async flow

- When making a update request against the search engine, it will store the update receive in a queue and returns a `update_id`.
- Each updates received will be treated following the order it has been received.
- You can get the update status on the [`/updates`](/references/updates) route.

### What is async?

Every action which could be compute expensive is asynchronous. This includes:
- Create/update a schema
- Update index settings
- Add/update/delete documents

### Understanding updates

Updates returns the following informations: 
>>>>>>> dc8f675... Rename async update file:advanced_guides/asynchronous_updates.md
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
