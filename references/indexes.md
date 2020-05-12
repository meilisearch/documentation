# Indexes

An index is an entity that gathers a set of [documents](/guides/main_concepts/documents.md) with its own settings.

[Learn more about indexes](/guides/main_concepts/indexes.md).

## List all indexes

<RouteHighlighter method="GET" route="/indexes"/>

List all [indexes](/guides/main_concepts/indexes.md).

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes'
```

#### Response: `200 Ok`

```json
[
  {
    "uid": "movies",
    "primaryKey": "movie_id",
    "createdAt": "2019-11-20T09:40:33.711324Z",
    "updatedAt": "2019-11-20T10:16:42.761858Z"
  },
  {
    "uid": "movie_reviews",
    "primaryKey": null,
    "createdAt": "2019-11-20T09:40:33.711324Z",
    "updatedAt": "2019-11-20T10:16:42.761858Z"
  }
]
```

## Get one index

<RouteHighlighter method="GET" route="/indexes/:index_uid"/>

Get information about an [index](/guides/main_concepts/indexes.md).

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies'
```

#### Response: `200 Ok`

```json
{
  "uid": "movies",
  "primaryKey": "movie_id",
  "createdAt": "2019-11-20T09:40:33.711324Z",
  "updatedAt": "2019-11-20T10:16:42.761858Z"
}
```

## Create an index

<RouteHighlighter method="POST" route="/indexes"/>

Create an [index](/guides/main_concepts/indexes.md).

This route takes as parameter an unique `uid` and **optionally** the [primary key](/guides/main_concepts/indexes.md#primary-key).

#### Body

| Variable       | Description                                                |
| -------------- | ---------------------------------------------------------- |
| **index_uid**  | The index unique identifier (_mandatory_)                  |
| **primaryKey** | The <clientGlossary word="primary key" /> of the documents |

```json
{
  "uid": "movies",
  "primaryKey": "movie_id"
}
```

### Example

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes' \
  --data '{
    "uid": "movies",
    "primaryKey": "movie_id"
  }'
```

#### Response: `201 created`

```json
{
  "uid": "movies",
  "primaryKey": "movie_id",
  "createdAt": "2019-11-20T09:40:33.711476Z",
  "updatedAt": "2019-11-20T09:40:33.711476Z"
}
```

## Update an index

<RouteHighlighter method="PUT" route="/indexes/:index_uid"/>

Update an [index](/guides/main_concepts/indexes.md).

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

| Variable       | Description                                                |
| -------------- | ---------------------------------------------------------- |
| **primaryKey** | The <clientGlossary word="primary key" /> of the documents |

The `uid` of an index cannot be changed.
The `primaryKey` can be added if it does not already exist (to know if it has been set, use [the get index route](/references/indexes.md#get-one-index)).

[There are many ways in MeiliSearch to set the primary key](/guides/main_concepts/documents.md#primary-key).

### Example

```bash
$ curl \
  -X PUT 'http://localhost:7700/indexes/movie_review' \
  --data '{
      "primaryKey" : "movie_review_id"
  }'
```

#### Response: `200 Ok`

```json
{
  "uid": "movie_review",
  "primaryKey": "movie_review_id",
  "createdAt": "2019-11-20T09:40:33.711324Z",
  "updatedAt": "2019-11-20T10:16:42.761858Z"
}
```

## Delete an index

<RouteHighlighter method="DELETE" route="/indexes/:index_uid"/>

Delete an [index](/guides/main_concepts/indexes.md).

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

```bash
$ curl \
  -X DELETE 'http://localhost:7700/indexes/movie'
```

#### Response: `204 No Content`
