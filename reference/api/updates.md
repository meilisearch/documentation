# Updates

The `updates` route gives information about the progress of the [asynchronous processes](/learn/advanced/asynchronous_updates.md).

## Get an update status

<RouteHighlighter method="GET" route="/indexes/:index_uid/updates/:uid"/>

Get the status of an [update](/learn/advanced/asynchronous_updates.md) in a given [index](/learn/core_concepts/indexes.md).

#### Path variables

| Variable      | Description           |
| ------------- | --------------------- |
| **index_uid** | The index UID         |
| **uid**  | The update identifier |

### Example

<CodeSamples id="get_update_1" />

#### Response: `200 Ok`

Here is an example response representing [an update that has already been processed](/learn/advanced/asynchronous_updates.md#understanding-tasks).

```json
{
  "status": "processed",
  "uid": 1,
  "type": {
    "name": "DocumentsAddition",
    "number": 4
  },
  "duration": 0.076980613,
  "enqueuedAt": "2019-12-07T21:16:09.623944Z",
  "processedAt": "2019-12-07T21:16:09.703509Z"
}
```

## Get all update status

<RouteHighlighter method="GET" route="/indexes/:index_uid/updates"/>

Get the status of all [updates](/learn/advanced/asynchronous_updates.md) in a given [index](/learn/core_concepts/indexes.md).

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="get_all_updates_1" />

#### Response: `200 Ok`

Here is an example response representing an [enqueued update](/learn/advanced/asynchronous_updates.md#understanding-tasks).

```json
[
    {
        "status": "enqueued",
        "uid": 0,
        "type": {
            "name": "DocumentsAddition",
            "number": 30
        },
        "enqueuedAt": "2021-02-14T14:07:09.364505700Z"
    }
]
```
