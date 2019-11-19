# Updates

## Get an update status

<RouteHighlighter method="GET" route="/indexes/:index/updates/:update-id"/>

Get the status of an [update](/main_concept/indexes.md#Updates) in a given [index](/main_concept/indexes.md).

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |

#### Path Variables

| Variable      | Description           |
|---------------|-----------------------|
| **index**     | The index UID |
| **update-id** | An update identifier  |

### Example

```bash
curl \
  --location \
  --request GET 'http://localhost:8080/indexes/movies/updates/3' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

Here is an example response of an update that has been processed.

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

## Get all update status

<RouteHighlighter method="GET" route="/indexes/:index/updates"/>

Get the status of all [updates](/main_concept/indexes.md#updates) in a given [index](/main_concept/indexes.md).

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |

#### Path Variables

| Variable      | Description           |
|---------------|-----------------------|
| **index**     | The index UID |
| **update-id** | An update identifier  |

### Example

```bash
curl \
  --location \
  --request GET 'http://localhost:8080/indexes/movies/updates' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

Here is an example response of an update that have been processed.

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