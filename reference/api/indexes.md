# Indexes

The `/indexes` route allows you to create, manage, and delete your indexes.

[Learn more about indexes](/learn/core_concepts/indexes.md).

## List all indexes

<RouteHighlighter method="GET" route="/indexes"/>

List all [indexes](/learn/core_concepts/indexes.md). Results can be paginated by using the `offset` and `limit` query parameters.

#### Query parameters

| Query parameter          | Description                 | Default value |
| ------------------------ | --------------------------- | :-----------: |
| **offset**               | Number of indexes to skip   |       0       |
| **limit**                | Number of indexes to return |      20       |

### Example

<CodeSamples id='list_all_indexes_1' />

#### Response: `200 Ok`

```json
{
  "results": [
    {
      "uid": "books",
      "createdAt": "2022-03-08T10:00:27.377346Z",
      "updatedAt": "2022-03-08T10:00:27.391209Z",
      "primaryKey": "id"
    },
    {
      "uid": "meteorites",
      "createdAt": "2022-03-08T10:00:44.518768Z",
      "updatedAt": "2022-03-08T10:00:44.582083Z",
      "primaryKey": "id"
    },
    {
      "uid": "movies",
      "createdAt": "2022-02-10T07:45:15.628261Z",
      "updatedAt": "2022-02-21T15:28:43.496574Z",
      "primaryKey": "id"
    }
  ],
  "offset": 0,
  "limit": 3,
  "total": 5
}  
```

## Get one index

<RouteHighlighter method="GET" route="/indexes/{index_uid}"/>

Get information about an [index](/learn/core_concepts/indexes.md). The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Example

<CodeSamples id='get_one_index_1' />

#### Response: `200 Ok`

```json
{
  "uid": "movies",
  "createdAt": "2022-02-10T07:45:15.628261Z",
  "updatedAt": "2022-02-21T15:28:43.496574Z",
  "primaryKey": "id"
}
```

## Create an index

<RouteHighlighter method="POST" route="/indexes"/>

Create an [index](/learn/core_concepts/indexes.md). This endpoint accepts two arguments: `uid` and `primaryKey`.

If you do not supply a value for `primaryKey`, Meilisearch will try to infer your dataset's unique identifier from the first document you add to the index.

::: note
If you try to add [documents](/reference/api/documents.md) or [settings](/reference/api/settings.md) to an index that does not exist, Meilisearch will automatically create it for you. This is called implicit index creation.
:::

Creating an index is an asynchronous task. [You can read more about asynchronous operations in our dedicated guide.](/learn/advanced/asynchronous_operations.md)

### Body

| Variable       | Description                                                |
| -------------- | ---------------------------------------------------------- |
| **uid**  | The index unique identifier (_mandatory_)                  |
| **primaryKey** | The primary key of the documents |

```json
{
  "uid": "movies",
  "primaryKey": "id"
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

You can use the response's `uid` to [track the status of your request](/reference/api/tasks.md#get-task).

## Update an index

<RouteHighlighter method="PUT" route="/indexes/{index_uid}"/>

Update an [index's](/learn/core_concepts/indexes.md) [primary key](/learn/core_concepts/primary_key.md#primary-key).  The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

You can freely update the primary key of an index as long as it contains no documents.

To change the primary key of an index that already contains documents, you must first delete all documents in that index. You may then change the primary key, and finally, index your dataset again.

::: note
It is not possible to change an index's `uid`.
:::

This is an asynchronous task. [You can read more about asynchronous operations in our dedicated guide.](/learn/advanced/asynchronous_operations.md)

### Body

| Variable       | Description                                                |
| -------------- | ---------------------------------------------------------- |
| **primaryKey** | The primary key of the documents |

### Example

<CodeSamples id='update_an_index_1' />

#### Response: `202 Accepted`

```json
{
  "uid": 1,
  "indexUid": "movies",
  "status": "enqueued",
  "type": "indexUpdate",
  "enqueuedAt": "2021-08-12T10:00:00.000000Z"
}
```

You can use the response's `uid` to [track the status of your request](/reference/api/tasks.md#get-task).

## Delete an index

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}"/>

Delete an [index](/learn/core_concepts/indexes.md).  The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

This is an asynchronous task. [You can read more about asynchronous operations in our dedicated guide.](/learn/advanced/asynchronous_operations.md)

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

You can use the response's `uid` to [track the status of your request](/reference/api/tasks.md#get-task).
