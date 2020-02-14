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
    "name": "movie",
    "identifier": "movie_id",
    "createdAt": "2019-11-20T09:40:33.711324Z",
    "updatedAt": "2019-11-20T10:16:42.761858Z"
  },
  {
    "name": "movie_reviews",
    "identifier": null,
    "createdAt": "2019-11-20T09:40:33.711324Z",
    "updatedAt": "2019-11-20T10:16:42.761858Z"
  }

]
```

## Get one index

<RouteHighlighter method="GET" route="/indexes/:index"/>

Get information about an index.


#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
| **uid** | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movie'
```

#### Response: `200 Ok`

```json
{
  "name": "movie",
  "identifier": "movie_id",
  "createdAt": "2019-11-20T09:40:33.711324Z",
  "updatedAt": "2019-11-20T10:16:42.761858Z"
}
```

## Create an index

<RouteHighlighter method="POST" route="/indexes"/>

Create an index.

Takes as parameter a unique `uid` and **optionnaly** the name of the <glossary word="document identifier"/>: `identifier`.

#### Body


| Variable  | Description           |
|-----------|-----------------------|
| **uid** | The index unique identifier |
| **identifier** | the document <glossary word="attribute" /> of his unique identifier |

The body take at least an index uid. The document identifier is optionnal.

```json
{
  "uid": "movie",
  "identifier": "movie_id"
}
```

### Example

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes' \
  --data '{
  "uid": "movie",
}'
```

#### Response: `201 created`
```json
{
  "uid": "movie",
  "identifier": "movie_id",
  "createdAt": "2019-11-20T09:40:33.711476Z",
  "updatedAt": "2019-11-20T09:40:33.711476Z"
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Update an index

<RouteHighlighter method="PUT" route="/indexes/:index"/>

Update an index.


#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
| **uid** | The index UID |


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

<RouteHighlighter method="DELETE" route="/indexes/:index"/>

Delete an index.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID        |

### Example

```bash
$ curl \
  -X DELETE 'http://localhost:7700/indexes/movie'
```

#### Response: `204 No Content`

