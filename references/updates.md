# Updates

## Get an update status

<RouteHighlighter method="GET" route="/indexes/:uid/updates/:updateId"/>

Get the status of an [update](/advanced_guides/asynchronous_updates.md) in a given [index](/main_concepts/indexes.md).


#### Path Variables

| Variable      | Description           |
|---------------|-----------------------|
| **uid**     | The index UID |
| **updateId**  | An update identifier  |

### Example

```bash
curl \
  --request GET 'http://localhost:7700/indexes/12345678/updates/1'
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

<RouteHighlighter method="GET" route="/indexes/:uid/updates"/>

Get the status of all [updates](/advanced_guides/asynchronous_updates.md) in a given [index](/main_concepts/indexes.md).


#### Path Variables

| Variable      | Description           |
|---------------|-----------------------|
| **uid**     | The index UID |

### Example

```bash
curl \
  --request GET 'http://localhost:7700/indexes/12345678/updates'
```

#### Response: `200 Ok`

Here is an example response of updates that have been processed.

```json
[
  {
    "status": "processed",
    "updateId": 0,
    "type": {
      "name": "Schema"
    },
    "duration": 0.000066131,
    "enqueuedAt": "2019-12-07T21:16:09.623198Z",
    "processedAt": "2019-12-07T21:16:09.624601Z"
  },
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
