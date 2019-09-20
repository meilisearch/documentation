# Indexes

With the notion of index, that can be called table in SQL, we also have the notion of schema.

A schema is a correspondence between all fields present in your documents and how these fields will be understood by our database.
We have some tags that should be associated with fields in the schema:

* **identifier**: The unique identifier of a document, must only be set on one field. This field is must be unique between documents.
* **indexed**: Indexed fields feed our search engine.
* **stored**: Displayed fields can be showed during searches. A non-displayed field will never appear in the search response.
* **ranked**: Ranked fields are used to sort documents. <Badge text="soon" type="warn"/>

Take for example a movie collection. We have several fields:

* **id**: The unique identifier of a movie (tag: identifier).
* **title**: The most important field (tag: indexed). Surely printed on the front (tag: displayed).
* **description**: Give much information about the movie (tag: indexed), perhaps we will show the first line of the description on the front (tag: displayed).
* **release_date**: The release date can be used to sort movies (tag: ranked), but nobody will search precisely the release date of a film. It will be shown on the website (tag: displayed).
* **cover**: The URL of the poster or the image related to the movie. Will be showed on the front (tag: displayed).

::: warning
The order of the document fields has a huge impact on the relevancy. So please order fields from the most important to the less.
You can read more about that on [the documents page](/documents.md).
:::

Our schema will be:

```json
{
    "id": ["identifier", "displayed"],
    "title": ["indexed", "displayed"],
    "description": ["indexed", "displayed"],
    "release_date": ["ranked", "displayed"],
    "cover": ["displayed"]
}
```




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
  --request GET 'https://localhost:8080/indexes' \
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
| **index** | The name of the index |

### Example

```bash
curl \
  --location \
  --request GET 'https://localhost:8080/indexes/movie' \
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
| **index**     | The name of the index |
| **update-id** | An update identifier  |

### Example

```bash
curl \
  --location \
  --request GET 'https://localhost:8080/indexes/movie/updates/27' \
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
