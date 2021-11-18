# Indexes

An index is an entity that gathers a set of [documents](/learn/core_concepts/documents.md) with its own settings.

[Learn more about indexes](/learn/core_concepts/indexes.md).

## List all indexes

<RouteHighlighter method="GET" route="/indexes"/>

List all [indexes](/learn/core_concepts/indexes.md).

### Example

<CodeSamples id='list_all_indexes_1' />

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

Get information about an [index](/learn/core_concepts/indexes.md).

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id='get_one_index_1' />

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

Create an [index](/learn/core_concepts/indexes.md).

This route takes as parameter an unique `uid` and **optionally** the [primary key](/learn/core_concepts/indexes.md#primary-key).

::: note
An index is automatically created when adding [documents](/reference/api/documents.md) or [settings](/reference/api/settings.md) to an index that does not already exist.
:::

#### Body

| Variable       | Description                                                |
| -------------- | ---------------------------------------------------------- |
| **index_uid**  | The index unique identifier (_mandatory_)                  |
| **primaryKey** | The primary key of the documents |

```json
{
  "uid": "movies",
  "primaryKey": "movie_id"
}
```

### Example

<CodeSamples id='create_an_index_1' />

#### Response: `201 created`

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "indexCreation",
    "enqueuedAt": "2021-08-12T10:00:00.000000Z"
}

```

## Update an index

<RouteHighlighter method="PUT" route="/indexes/:index_uid"/>

Update an [index](/learn/core_concepts/indexes.md).

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

| Variable       | Description                                                |
| -------------- | ---------------------------------------------------------- |
| **primaryKey** | The primary key of the documents |

The `uid` of an index cannot be changed.
The `primaryKey` can be added if it does not already exist (to know if it has been set, use [the get index route](/reference/api/indexes.md#get-one-index)).

[There are many ways in MeiliSearch to set the primary key](/learn/core_concepts/documents.md#primary-key).

### Example

<CodeSamples id='update_an_index_1' />

#### Response: `200 Ok`

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "indexUpdate",
    "enqueuedAt": "2021-08-12T10:00:00.000000Z"
}
```

## Delete an index

<RouteHighlighter method="DELETE" route="/indexes/:index_uid"/>

Delete an [index](/learn/core_concepts/indexes.md).

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id='delete_an_index_1' />

#### Response: `200 Ok`

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "indexDeletion",
    "enqueuedAt": "2021-08-12T10:00:00.000000Z"
}
```
