# Documents

Documents are objects composed of fields that can store any type of data.
Each field contains an attribute and its associated value.

[Learn more about documents](/guides/main_concepts/documents.md).

## Get one document

<RouteHighlighter method="GET" route="/indexes/:index_uid/documents/:document_id"/>

Get one [document](/guides/main_concepts/documents.md) using its unique id.

#### Path Variables

| Variable        | Description                                                       |
| --------------- | ----------------------------------------------------------------- |
| **index_uid**   | The index UID                                                     |
| **document_id** | [The document id](/guides/main_concepts/documents.md#primary-key) |

### Example

<code-samples id="get_one_document_1" />

#### Response: `200 Ok`

```json
{
  "id": 25684,
  "title": "American Ninja 5",
  "poster": "https://image.tmdb.org/t/p/w1280/iuAQVI4mvjI83wnirpD8GVNRVuY.jpg",
  "overview": "When a scientists daughter is kidnapped, American Ninja, attempts to find her, but this time he teams up with a youngster he has trained in the ways of the ninja.",
  "release_date": "1993-01-01"
}
```

## Get documents

<RouteHighlighter method="GET" route="/indexes/:index_uid/documents"/>

Get [documents](/guides/main_concepts/documents.md) by batch.

Using the query parameters `offset` and `limit`, you can browse through all your documents.

::: note
Documents are ordered by MeiliSearch depending on the hash of their id.
:::

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Query Parameters

| Query Parameter          | Description                 | Default Value |
| ------------------------ | --------------------------- | :-----------: |
| **offset**               | number of documents to skip |       0       |
| **limit**                | number of documents to take |      20       |
| **attributesToRetrieve** | document attributes to show |      \*       |

### Example

<code-samples id="get_documents_1" />

#### Response: `200 Ok`

```json
[
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
]
```

## Add or replace documents

<RouteHighlighter method="POST" route="/indexes/:index_uid/documents"/>

Add a list of [documents](/guides/main_concepts/documents.md) or replace them if they already exist.

If you send an already existing document (same [id](/guides/main_concepts/documents.md#primary-key)) the **whole existing document** will be overwritten by the new document. Fields previously in the document not present in the new document are removed.

For a partial update of the document see [add or update documents](/references/documents.md#add-or-update-documents).

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Query Parameters

| Query Parameter | Description                                                                                     | Default Value |
| --------------- | ----------------------------------------------------------------------------------------------- | :-----------: |
| **primaryKey**  | The [primary key](/guides/main_concepts/documents.md#primary-key) of the documents _(optional)_ |     none      |

If you want to set the **primary key** of your index through this route, it only has to be done **the first time you add documents** to the index. After which it will be ignored if given.

#### Body

The body is composed of a **JSON array** of documents.

::: warning
Documents fields which are not known to the index schema will be ignored.
:::

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

<code-samples id="add_or_replace_documents_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Add or update documents

<RouteHighlighter method="PUT" route="/indexes/:index_uid/documents"/>

Add a list of documents and update them if they already.

If you send an already existing document (same [id](/guides/main_concepts/documents.md#primary-key)) the old document will be only partially updated according to the fields of the new document. Thus, any fields not present in the new document are kept and remained unchanged.

To completely overwrite a document, check out the [add or replace documents route](/references/documents.md#add-or-replace-documents).

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

If you want to set the **primary key** of your index through this route, it only has to be done **the first time you add documents** to the index. After which it will be ignored if given.

#### Query Parameters

| Query Parameter | Description                                                                                     | Default Value |
| --------------- | ----------------------------------------------------------------------------------------------- | :-----------: |
| **primaryKey**  | The [primary key](/guides/main_concepts/documents.md#primary-key) of the documents _(optional)_ |     none      |

#### Body

The body is composed of a **JSON array** of documents.

```json
[
  {
    "id": 287947,
    "title": "Shazam ⚡️"
  }
]
```

### Example

<code-samples id="add_or_update_documents_1" />
This document is an update of the document found in [add or replace document](/references/documents.md#add-or-replace-documents).
The documents are matched because they have the same `primaryKey` value `id: 287947`. This route will update the `title` field as it changed from `Shazam` to `Shazam ⚡️` and add the new `genre` field to that document. The rest of the document will remain unchanged.

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Delete all documents

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/documents"/>

Delete all documents in the specified index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<code-samples id="delete_all_documents_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Delete one document

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/documents/:document_id"/>

Delete one document based on its unique id.

#### Path Variables

| Variable        | Description                                                       |
| --------------- | ----------------------------------------------------------------- |
| **index_uid**   | The index UID                                                     |
| **document_id** | [The document id](/guides/main_concepts/documents.md#primary-key) |

### Example

<code-samples id="delete_one_document_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Delete documents

<RouteHighlighter method="POST" route="/indexes/:index_uid/documents/delete-batch"/>

Delete a selection of documents based on array of document id's.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

The body must be a **JSON Array** with the unique id's of the documents to delete.

```json
[23488, 153738, 437035, 363869]
```

### Example

<code-samples id="delete_documents_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).
