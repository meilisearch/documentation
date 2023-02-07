# Documents

The `/documents` route allows you to create, manage, and delete documents.

[Learn more about documents.](/learn/core_concepts/documents.md)

## Get documents

<RouteHighlighter method="GET" route="/indexes/{index_uid}/documents"/>

Get a set of documents.

Using the query parameters `offset` and `limit`, you can browse through all your documents.

::: note
Documents are ordered by Meilisearch depending on the hash of their id.
:::

### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

### Query parameters

| Query Parameter | Default Value | Description                                                   |
| :-------------- | :------------ | :------------------------------------------------------------ |
| **`offset`**    | `0`           | Number of documents to skip                                   |
| **`limit`**     | `20`          | Number of documents to return                                 |
| **`fields`**    | `*`           | Document attributes to show (case-sensitive, comma-separated) |

### Response

| Name          | Type    | Description                            |
| :------------ | :------ | :------------------------------------- |
| **`results`** | Array   | An array of documents                  |
| **`offset`**  | Integer | Number of documents skipped            |
| **`limit`**   | Integer | Number of documents returned           |
| **`total`**   | Integer | Total number of documents in the index |

### Example

<CodeSamples id="get_documents_1" />

#### Response: `200 Ok`

```json
{
  "results": [
    {
      "id": 25684,
      "release_date": "1993-01-01",
      "poster": "https://image.tmdb.org/t/p/w1280/iuAQVI4mvjI83wnirpD8GVNRVuY.jpg",
      "title": "American Ninja 5",
      "overview": "When a scientists daughter is kidnapped, American Ninja, attempts to find her, but this time he teams up with a youngster he has trained in the ways of the ninja."
    },
    {
      "id": 468219,
      "title": "Dead in a Week (Or Your Money Back)",
      "release_date": "2018-09-12",
      "poster": "https://image.tmdb.org/t/p/w1280/f4ANVEuEaGy2oP5M0Y2P1dwxUNn.jpg",
      "overview": "William has failed to kill himself so many times that he outsources his suicide to aging assassin Leslie. But with the contract signed and death assured within a week (or his money back), William suddenly discovers reasons to live... However Leslie is under pressure from his boss to make sure the contract is completed."
    }
  ],
  "offset": 0,
  "limit": 2,
  "total": 500134
}
```

## Get one document

<RouteHighlighter method="GET" route="/indexes/{index_uid}/documents/{document_id}"/>

Get one document using its unique id.

### Path parameters

| Name                | Type           | Description                                                                              |
| :------------------ | :------------- | :--------------------------------------------------------------------------------------- |
| **`index_uid`** *   | String         | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index                |
| **`document_id`** * | String/Integer | [Document id](/learn/core_concepts/primary_key.md#document-id) of the requested document |

### Query parameters

| Query Parameter | Default Value | Description                                                   |
| :-------------- | :------------ | :------------------------------------------------------------ |
| **`fields`**    | `*`           | Document attributes to show (case-sensitive, comma-separated) |

### Example

<CodeSamples id="get_one_document_1" />

#### Response: `200 Ok`

```json
{
  "id": 25684,
  "title": "American Ninja 5",
  "poster": "https://image.tmdb.org/t/p/w1280/iuAQVI4mvjI83wnirpD8GVNRVuY.jpg",
  "release_date": "1993-01-01"
}
```

## Add or replace documents

<RouteHighlighter method="POST" route="/indexes/{index_uid}/documents"/>

Add an array of documents or replace them if they already exist. If the provided index does not exist, it will be created.

If you send an already existing document (same [document id](/learn/core_concepts/primary_key.md#document-id)) the **whole existing document** will be overwritten by the new document. Fields that are no longer present in the new document are removed. For a partial update of the document see the [add or update documents](/reference/api/documents.md#add-or-update-documents) endpoint.

This endpoint accepts the following content types:

- `application/json`
- `application/x-ndjson`
- `text/csv`

### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

### Query parameters

| Query Parameter  | Default Value | Description                                                                   |
| :--------------- | :------------ | :---------------------------------------------------------------------------- |
| **`primaryKey`** | `null`        | [Primary key](/learn/core_concepts/primary_key.md#primary-key-2) of the index |

If you want to [set the primary key of your index on document addition](/learn/core_concepts/primary_key.md#setting-the-primary-key-on-document-addition), it can only be done **the first time you add documents** to the index. After this, the `primaryKey` parameter will be ignored if given.

### Body

An array of documents. Each document is represented as a JSON object.

```json
[
  {
    "id": 287947,
    "title": "Shazam",
    "poster": "https://image.tmdb.org/t/p/w1280/xnopI5Xtky18MPhK40cZAGAOVeV.jpg",
    "overview": "A boy is given the ability to become an adult superhero in times of need with a single magic word.",
    "release_date": "2019-03-23"
  }
]
```

### Example

<CodeSamples id="add_or_replace_documents_1" />

#### Response: `202 Accepted`

```json
{
    "taskUid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentAdditionOrUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

## Add or update documents

<RouteHighlighter method="PUT" route="/indexes/{index_uid}/documents"/>

Add a list of documents or update them if they already exist. If the provided index does not exist, it will be created.

If you send an already existing document (same [document id](/learn/core_concepts/primary_key.md#document-id)) the old document will be only partially updated according to the fields of the new document. Thus, any fields not present in the new document are kept and remain unchanged.

To completely overwrite a document, check out the [add or replace documents route](/reference/api/documents.md#add-or-replace-documents).

If you want to set the [**primary key** of your index](/learn/core_concepts/primary_key.md#setting-the-primary-key-on-document-addition) through this route, you may only do so **the first time you add documents** to the index. If you try to set the primary key after having added documents to the index, the task will return an error.

This endpoint accepts the following content types:

- `application/json`
- `application/x-ndjson`
- `text/csv`

### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

### Query parameters

| Query Parameter  | Default Value | Description                                                                       |
| :--------------- | :------------ | :-------------------------------------------------------------------------------- |
| **`primaryKey`** | `null`        | [Primary key](/learn/core_concepts/primary_key.md#primary-key-2) of the documents |

### Body

An array of documents. Each document is represented as a JSON object.

```json
[
  {
    "id": 287947,
    "title": "Shazam ⚡️"
  }
]
```

### Example

<CodeSamples id="add_or_update_documents_1" />

This document is an update of the document found in [add or replace document](/reference/api/documents.md#add-or-replace-documents).

The documents are matched because they have the same [primary key](/learn/core_concepts/documents.md#primary-field) value `id: 287947`. This route will update the `title` field as it changed from `Shazam` to `Shazam ⚡️` and add the new `genres` field to that document. The rest of the document will remain unchanged.

#### Response: `202 Accepted`

```json
{
    "taskUid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentAdditionOrUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

## Delete all documents

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/documents"/>

Delete all documents in the specified index.

### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

### Example

<CodeSamples id="delete_all_documents_1" />

#### Response: `202 Accepted`

```json
{
    "taskUid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentDeletion",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

## Delete one document

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/documents/{document_id}"/>

Delete one document based on its unique id.

### Path parameters

| Name                | Type           | Description                                                                              |
| :------------------ | :------------- | :--------------------------------------------------------------------------------------- |
| **`index_uid`** *   | String         | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index                |
| **`document_id`** * | String/Integer | [Document id](/learn/core_concepts/primary_key.md#document-id) of the requested document |

### Example

<CodeSamples id="delete_one_document_1" />

#### Response: `202 Accepted`

```json
{
    "taskUid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentDeletion",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

## Delete documents by batch

<RouteHighlighter method="POST" route="/indexes/{index_uid}/documents/delete-batch"/>

Delete a selection of documents based on an array of document id's.

### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

### Body

An array of numbers containing the unique id's of the documents to be deleted.

```json
[23488, 153738, 437035, 363869]
```

### Example

<CodeSamples id="delete_documents_1" />

#### Response: `202 Accepted`

```json
{
    "taskUid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentDeletion",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).
