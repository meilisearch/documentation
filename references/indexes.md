# Indexes

## List all indexes

<RouteHighlighter method="GET" route="/indexes"/>

List all indexes.


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
    "identifier": "movie_id",
    "createdAt": "2019-11-20T09:40:33.711324Z",
    "updatedAt": "2019-11-20T10:16:42.761858Z"
  },
  {
    "uid": "movie_reviews",
    "identifier": null,
    "createdAt": "2019-11-20T09:40:33.711324Z",
    "updatedAt": "2019-11-20T10:16:42.761858Z"
  }

]
```

## Get one index

<RouteHighlighter method="GET" route="/indexes/:index_uid"/>

Get information about an index.


#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
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
  "identifier": "movie_id",
  "createdAt": "2019-11-20T09:40:33.711324Z",
  "updatedAt": "2019-11-20T10:16:42.761858Z"
}
```

## Create an index

<RouteHighlighter method="POST" route="/indexes"/>

Create an index.

This route takes as parameter an unique `uid` and **optionally** the name of the <glossary word="document identifier"/>.

#### Body


| Variable  | Description           |
|-----------|-----------------------|
| **index_uid** | The index unique identifier |
| **identifier** | The document <glossary word="attribute" /> of its unique identifier |

The body takes at least an index uid. The document identifier is optional.

```json
{
  "uid": "movies",
  "identifier": "movie_id"
}
```

### Example

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes' \
  --data '{
  "uid": "movies",
}'
```

#### Response: `201 created`
```json
{
  "uid": "movies",
  "identifier": "movie_id",
  "createdAt": "2019-11-20T09:40:33.711476Z",
  "updatedAt": "2019-11-20T09:40:33.711476Z"
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Update an index

<RouteHighlighter method="PUT" route="/indexes/:index_uid"/>

Update an index.


#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
| **index_uid** | The index UID |


#### Body

| Variable          | Description           |
|-------------------|-----------------------|
| **identifier** | the document <glossary word="attribute" /> of his unique identifier |

The `uid` of an index cannot be changed. The document identifier `identifier` can be added if it does not already exist (to now if it has ben set, use [the get index route](/references/indexes.md#get-one-index)).

[There are many ways in MeiliSearch to set the identifier](/guides/main_concepts/documents.md#identifier).

### Example

```bash
$ curl \
  -X PUT 'http://localhost:7700/indexes/movie_review' \
  --data '{
  "identifier" : "movie_review_id"
}'
```

#### Response: `200 Ok`

```json
{
  "uid": "movie_review",
  "identifier" : "movie_review_id",
  "createdAt": "2019-11-20T09:40:33.711324Z",
  "updatedAt": "2019-11-20T10:16:42.761858Z"
}
```


## Delete an index

<RouteHighlighter method="DELETE" route="/indexes/:index_uid"/>

Delete an index.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID        |

### Example

```bash
$ curl \
  -X DELETE 'http://localhost:7700/indexes/movie'
```

#### Response: `204 No Content`
