# Updates

## Get an update status

<RouteHighlighter method="GET" route="/indexes/:index_uid/updates/:updateId"/>

Get the status of an [update](/guides/advanced_guides/asynchronous_updates.md) in a given [index](/guides/main_concepts/indexes.md).

#### Path Variables

| Variable      | Description           |
| ------------- | --------------------- |
| **index_uid** | The index UID         |
| **updateId**  | The update identifier |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/updates/1'
```

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

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/updates'
```

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
