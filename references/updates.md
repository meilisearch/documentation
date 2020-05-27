# Updates

The `updates` route gives information about the progress of the [asynchronous processes](/guides/advanced_guides/asynchronous_updates.md).

## Get an update status

<RouteHighlighter method="GET" route="/indexes/:index_uid/updates/:updateId"/>

Get the status of an [update](/guides/advanced_guides/asynchronous_updates.md) in a given [index](/guides/main_concepts/indexes.md).

#### Path Variables

| Variable      | Description           |
| ------------- | --------------------- |
| **index_uid** | The index UID         |
| **updateId**  | The update identifier |

### Example

<code-samples id="get_update_1" />

#### Response: `200 Ok`

Here is an example response of an update that has been processed.

```json
{
  "status": "processed",
  "updateId": 1,
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

Get the status of all [updates](/guides/advanced_guides/asynchronous_updates.md) in a given [index](/guides/main_concepts/indexes.md).

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<code-samples id="get_all_updates_1" />

#### Response: `200 Ok`

Here is an example response of updates that have been processed.

```json
[
  {
    "status": "processed",
    "updateId": 1,
    "type": {
      "name": "DocumentsAddition",
      "number": 4
    },
    "duration": 0.076980613,
    "enqueuedAt": "2019-12-07T21:16:09.623944Z",
    "processedAt": "2019-12-07T21:16:09.703509Z"
  }
]
```
