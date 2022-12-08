# Indexes

The `/indexes` route allows you to create, manage, and delete your indexes.

[Learn more about indexes](/learn/core_concepts/indexes.md).

## Index object

```json
{
  "uid": "movies",
  "createdAt": "2022-02-10T07:45:15.628261Z",
  "updatedAt": "2022-02-21T15:28:43.496574Z",
  "primaryKey": "id"
}
```

| Name             | Type            | Default value | Description                                                                                                                                                                                                                                                    |
| :--------------- | :-------------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`uid`**        | String          | N/A           | [Unique identifier](/learn/core_concepts/indexes.md#index-uid) of the index. Once created, it cannot be changed                                                                                                                                                |
| **`createdAt`**  | String          | N/A           | Creation date of the index, represented in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format. Auto-generated on index creation                                                                                                                           |
| **`updatedAt`**  | String          | N/A           | Latest date of index update, represented in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format. Auto-generated on index creation or update                                                                                                                |
| **`primaryKey`** | String / `null` | `null`        | [Primary key](/learn/core_concepts/primary_key.md#primary-field) of the index. If not specified, Meilisearch [guesses your primary key](/learn/core_concepts/primary_key.md#meilisearch-guesses-your-primary-key) from the first document you add to the index |

## List all indexes

<RouteHighlighter method="GET" route="/indexes"/>

List all indexes. Results can be paginated by using the `offset` and `limit` query parameters.

### Query parameters

| Query parameter | Description                 | Default value |
| :-------------- | :-------------------------- | :------------ |
| **`offset`**    | Number of indexes to skip   | `0`           |
| **`limit`**     | Number of indexes to return | `20`          |

### Response

| Name          | Type    | Description                          |
| :------------ | :------ | :----------------------------------- |
| **`results`** | Array   | An array of [indexes](#index-object) |
| **`offset`**  | Integer | Number of indexes skipped            |
| **`limit`**   | Integer | Number of indexes returned           |
| **`total`**   | Integer | Total number of indexes              |

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

Get information about an index.

### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

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

Create an index.

### Body

| Name             | Type            | Default value | Description                                                                               |
| :--------------- | :-------------- | :------------ | :---------------------------------------------------------------------------------------- |
| **`uid`** *      | String          | N/A           | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index                 |
| **`primaryKey`** | String / `null` | `null`        | [`Primary key`](/learn/core_concepts/primary_key.md#primary-field) of the requested index |

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
  "taskUid": 0,
  "indexUid": "movies",
  "status": "enqueued",
  "type": "indexCreation",
  "enqueuedAt": "2021-08-12T10:00:00.000000Z"
}
```

You can use the response's `taskUid` to [track the status of your request](/reference/api/tasks.md#get-one-task).

## Update an index

<RouteHighlighter method="PATCH" route="/indexes/{index_uid}"/>

Update an index's [primary key](/learn/core_concepts/primary_key.md#primary-key). You can freely update the primary key of an index as long as it contains no documents.

To change the primary key of an index that already contains documents, you must first delete all documents in that index. You may then change the primary key and index your dataset again.

::: note
It is not possible to change an index's `uid`.
:::

### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

### Body

| Name               | Type            | Default value | Description                                                                               |
| :----------------- | :-------------- | :------------ | :---------------------------------------------------------------------------------------- |
| **`primaryKey`** * | String / `null` | N/A           | [`Primary key`](/learn/core_concepts/primary_key.md#primary-field) of the requested index |

### Example

<CodeSamples id='update_an_index_1' />

#### Response: `202 Accepted`

```json
{
  "taskUid": 1,
  "indexUid": "movies",
  "status": "enqueued",
  "type": "indexUpdate",
  "enqueuedAt": "2021-08-12T10:00:00.000000Z"
}
```

You can use the response's `taskUid` to [track the status of your request](/reference/api/tasks.md#get-one-task).

## Delete an index

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}"/>

Delete an index.

### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

### Example

<CodeSamples id='delete_an_index_1' />

#### Response: `202 Accepted`

```json
{
  "taskUid": 1,
  "indexUid": "movies",
  "status": "enqueued",
  "type": "indexDeletion",
  "enqueuedAt": "2021-08-12T10:00:00.000000Z"
}
```

You can use the response's `taskUid` to [track the status of your request](/reference/api/tasks.md#get-one-task).

## Swap indexes

<RouteHighlighter method="POST" route="/swap-indexes"/>

Swap the documents, settings, and task history of two or more indexes. **You can only swap indexes in pairs.** However, a single request can swap as many index pairs as you wish.

Swapping indexes is an atomic transaction: **either all indexes are successfully swapped, or none are.**

Swapping `indexA` and `indexB` will also replace every mention of `indexA` by `indexB` and vice-versa in the task history. `enqueued` tasks are left unmodified.

[To learn more about index swapping, refer to this short guide.](/learn/core_concepts/indexes.md#swapping-indexes)

### Body

An array of objects. Each object has only one key: `indexes`.

| Name           | Type             | Default value | Description                                |
| :------------- | :--------------- | :------------ | :----------------------------------------- |
| **`indexes`*** | Array of strings | N/A           | Array of the two `indexUid`s to be swapped |

Each `indexes` array must contain only two elements: the `indexUid`s of the two indexes to be swapped. Sending an empty array (`[]`) is valid, but no swap operation will be performed.

::: note
You can swap multiple pairs of indexes with a single request. To do so, there must be one object for each pair of indexes to be swapped.
:::

### Example

<CodeSamples id='swap_indexes_1' />

#### Response

```json
{
  "taskUid": 3,
  "indexUid": null,
  "status": "enqueued",
  "type": "indexSwap",
  "enqueuedAt": "2021-08-12T10:00:00.000000Z"
}
```

::: note
Since `indexSwap` is a [global task](/learn/advanced/asynchronous_operations.md#global-tasks), the `indexUid` is always `null`.
:::

You can use the response's `taskUid` to [track the status of your request](/reference/api/tasks.md#get-one-task).
