# Indexes

## List all indexes

<RouteHighlighter method="GET" route="/indexes"/>

List all indexes names.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |

### Example

```bash
curl \
  --location \
  --request GET 'https://4eb345y7.getmeili.com/indexes' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

```json
["movie"]
```




## Get an index schema

<RouteHighlighter method="GET" route="/indexes/:index"/>

Get the schema of a specific index.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |

#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
| **index** | The index UID |

### Example

```bash
curl \
  --location \
  --request GET 'https://4eb345y7.getmeili.com/indexes/4eb345y7' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

```json
{
  "id": ["identifier", "indexed", "stored"],
  "title": ["stored", "indexed"],
  "overview": ["stored", "indexed"],
  "release_date": ["stored"],
  "poster": ["stored"],
  "objectId": ["stored", "indexed"]
}
```




## Get an update status

<RouteHighlighter method="GET" route="/indexes/:index/updates/:update-id"/>

Get the status of an update which have been returned by [an update method](/documents.md#add-or-update-documents).

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
  --request GET 'https://4eb345y7.getmeili.com/indexes/4eb345y7/updates/27' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

Here is an example response of an update that have been processed.

```json
{
  "status": "processed",
  "data": {
    "update_id": 27,
    "update_type": {
      "DocumentsAddition": {
        "number": 1
      }
    },
    "result": {
      "Ok": null
    },
    "detailed_duration": {
      "main": {
        "secs": 0,
        "nanos": 30798318
      }
    }
  }
}
```

#### Response: `200 Ok`

Here is an example response of an update which is enqueued and will processed later.

```json
{
  "status": "enqueued",
}
```

#### Response: `404 Not Found`

Here is an example response of an update which is unknown to the engine.

```json
{
  "message": "unknown update id"
}
```
