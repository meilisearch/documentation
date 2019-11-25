# Updates

Since many of the meilisearch actions are asynchronous, their route returns an update identifier. This makes it possible to track the progress of the action. 

Updates returns the following information : 
* **status** : State of the action (enqueued, processed )
* **update_id** : Id of the update
* **update_type** : Information about the action type
* **enqueued_at** : Date at which the action has been added to the queue 
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