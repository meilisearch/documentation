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

### Path variables

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

Create an [index](/learn/core_concepts/indexes.md). This route accepts two arguments: `index_uid` and `primaryKey`.

`index_uid` is mandatory. It should be a unique string identifying your new index.

`primaryKey` is optional and indicates the field containing your documents' [primary key](/learn/core_concepts/indexes.md#primary-key). If you do not supply a value for `primaryKey`, MeiliSearch will do its best to infer it once you add your first document to the index.

::: note
If you try to add [documents](/reference/api/documents.md) or [settings](/reference/api/settings.md) to an index that does not exist, MeiliSearch will automatically create it for you. This is called implicit index creation.
:::

Creating an index is an asynchronous task. [You can read more about asynchronous processes in our dedicated guide.](/learn/advanced/asynchronous_updates.md)

### Body

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

<CodeSamples id='create_an_index_1' />

#### Response: `202 Accepted`

```json
{
  "uid": 0,
  "indexUid": "movies",
  "status": "enqueued",
  "type": "indexCreation",
  "enqueuedAt": "2021-08-12T10:00:00.000000Z"
}
```

You can use the response's `uid` to track the status of your request.

## Update an index

<RouteHighlighter method="PUT" route="/indexes/:index_uid"/>

Update an [index's](/learn/core_concepts/indexes.md) [primary key](/learn/core_concepts/documents.md#primary-key).

If a primary key wasn't explicitly chosen during index creation, you can use this route to configure it. If you are unsure whether an index's primary key has already been configured, you can use [the get index route](/reference/api/indexes.md#get-one-index) to verify it.

::: note
It is not possible to change an index's `uid`.
:::

This is an asynchronous task. [You can read more about asynchronous processes in our dedicated guide.](/learn/advanced/asynchronous_updates.md)

### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Body

| Variable       | Description                                                |
| -------------- | ---------------------------------------------------------- |
| **primaryKey** | The <clientGlossary word="primary key" /> of the documents |

### Example

<CodeSamples id='update_an_index_1' />

#### Response: `202 Accepted`

```json
{
  "uid": 1,
  "indexUid": "movie_review",
  "status": "enqueued",
  "type": "indexUpdate",
  "enqueuedAt": "2021-08-12T10:00:00.000000Z"
}
```

You can use the response's `uid` to track the status of your request.

## Delete an index

<RouteHighlighter method="DELETE" route="/indexes/:index_uid"/>

Delete an [index](/learn/core_concepts/indexes.md).

This is an asynchronous task. [You can read more about asynchronous processes in our dedicated guide.](/learn/advanced/asynchronous_updates.md)

### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id='delete_an_index_1' />

#### Response: `202 Accepted`

```json
{
  "uid": 1,
  "indexUid": "movies",
  "status": "enqueued",
  "type": "indexDeletion",
  "enqueuedAt": "2021-08-12T10:00:00.000000Z"
}
```

You can use the response's `uid` to track the status of your request.
