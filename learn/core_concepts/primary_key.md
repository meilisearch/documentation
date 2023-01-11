# Primary key

## Primary field

An [index](/learn/core_concepts/indexes.md) in Meilisearch is a collection of [documents](/learn/core_concepts/documents.md). Documents are composed of fields, each field containing an attribute and a value.

The primary field is a special field that must be present in all documents. Its attribute is the **[primary key](#primary-key-2)** and its value is the **[document id](#document-id)**. It uniquely identifies each document in an index, ensuring that **it is impossible to have two exactly identical documents** present in the same index.

### Example

Suppose we have an index of books. Each document contains a number of fields with data on the book's `author`, `title`, and `price`. More importantly, each document contains a **primary field** consisting of the index's **primary key** `id` and a **unique id**.

```json
[
  {
    "id": 1,
    "title": "Diary of a Wimpy Kid: Rodrick Rules",
    "author": "Jeff Kinney",
    "genres": ["comedy","humor"],
    "price": 5.00
  },
  {
    "id": 2,
    "title": "Black Leopard, Red Wolf",
    "author": "Marlon James",
    "genres": ["fantasy","drama"],
    "price": 5.00
  }
]
```

Aside from the primary key, **documents in the same index are not required to share attributes**. A book in this dataset could be missing the `title` or `genre` attribute and still be successfully indexed by Meilisearch, provided it has the `id` attribute.

### Primary key

The primary key is the attribute of the primary field.

Every index has a primary key, an attribute that must be shared across all documents in that index. If you attempt to add documents to an index and even a single one is missing the primary key, **none of the documents will be stored.**

#### Example

```json
{
    "id": 1,
    "title": "Diary of a Wimpy Kid",
    "author": "Jeff Kinney",
    "genres": ["comedy","humor"],
    "price": 5.00
  }
```

Each document in the above index is identified by a primary field containing the primary key `id` and a unique document id value.

### Document id

The document id is the value associated with the primary key. It is part of the primary field and acts as a unique identifier for each document in a given index.

Two documents in an index can have the same values for all attributes except the primary key. If two documents in the same index have the same id, then they are treated as the same document and **the preceding document will be overwritten**.

Document addition requests in Meilisearch are atomic. This means that **if the primary field value of even a single document in a batch is incorrectly formatted, an error will occur, and Meilisearch will not index documents in that batch.**

#### Example

Good:

```json
"id": "_Aabc012_"
```

Bad:

```json
"id": "@BI+* ^5h2%"
```

#### Formatting the document id

The document id must be an integer or a string. If the id is a string, it can only contain alphanumeric characters (`a-z`, `A-Z`, `0-9`), hyphens (`-`), and underscores (`_`).

## Setting the primary key

You can set the primary key explicitly or let Meilisearch infer it from your dataset. Whatever your choice, an index can have only one primary key at a time, and the primary key cannot be changed while documents are present in the index.

### Setting the primary key on index creation

When creating an index manually, you can explicitly indicate the primary key you want that index to use.

The code below creates an index called `books` and sets `reference_number` as its primary key:

<CodeSamples id="primary_field_guide_create_index_primary_key" />

```json
{
  "taskUid": 1,
  "indexUid": "books",
  "status": "enqueued",
  "type": "indexCreation",
  "enqueuedAt": "2022-09-20T12:06:24.364352Z"
}
```

### Setting the primary key on document addition

When adding documents to an empty index, you can explicitly set the index's primary key as part of the document addition request.

The code below adds a document to the `books` index and sets `reference_number` as that index's primary key:

<CodeSamples id="primary_field_guide_add_document_primary_key" />

**Response:**

```json
{
  "taskUid": 1,
  "indexUid": "books",
  "status": "enqueued",
  "type": "documentAdditionOrUpdate",
  "enqueuedAt": "2022-09-20T12:08:55.463926Z"
}
```

### Changing your primary key with the update index endpoint

The primary key cannot be changed while documents are present in the index. To change the primary key of an index that already contains documents, you must therefore [delete all documents](/reference/api/documents.md#delete-all-documents) from that index, [change the primary key](/reference/api/indexes.md#update-an-index), then [add them](/reference/api/documents.md#add-or-replace-documents) again.

The code below updates the primary key to `title`:

<CodeSamples id="primary_field_guide_update_document_primary_key" />

**Response:**

```json
{
  "taskUid": 1,
  "indexUid": "books",
  "status": "enqueued",
  "type": "indexUpdate",
  "enqueuedAt": "2022-09-20T12:10:06.444672Z"
}
```

### Meilisearch guesses your primary key

Suppose you add documents to an index without previously setting its primary key. In this case, Meilisearch will automatically look for an attribute ending with the string `id` in a case-insensitive manner (for example, `uid`, `BookId`, `ID`) in your first document and set it as the index's primary key. If it finds multiple attributes ending with `id`, it will throw an error and ask you to manually set the primary key.

If Meilisearch cannot find a suitable attribute, the document addition process will be interrupted and no documents will be added to your index.

## Primary key errors

This section covers some primary key errors and how to resolve them.

### `primary_key_inference_failed`

This error occurs when you add documents for the first time and Meilisearch [fails to guess your primary key](#meilisearch-guesses-your-primary-key). It can be resolved by [manually setting the index's primary key](#setting-the-primary-key-on-document-addition), or ensuring that all documents you add possess an `id` attribute.

```json
{
    "uid":1,
    "indexUid": "books",
    "status": "failed",
    "type": "documentAdditionOrUpdate",
    "canceledBy": null,
    "details":{
        "receivedDocuments":5,
        "indexedDocuments":null
        },
    "error":{
        "message": "The primary key inference process failed because the engine did not find any fields containing `id` substring in their name. If your document identifier does not contain any `id` substring, you can set the primary key of the index.",
        "code": "primary_key_inference_failed",
        "type": "invalid_request",
        "link": "https://docs.meilisearch.com/errors#primary_key_inference_failed"
        },
    "duration": "PT0.007479S",
    "enqueuedAt": "2021-12-30T11:17:49.708824Z",
    "startedAt": "2021-12-30T11:17:49.709934Z",
    "finishedAt": "2021-12-30T11:17:49.716303Z"
}
```

### `missing_document_id`

This error occurs when your index already has a primary key, but one of the documents you are trying to add is missing this attribute.

```json
{
    "uid":1,
    "indexUid": "books",
    "status": "failed",
    "type": "documentAdditionOrUpdate",
    "canceledBy": null,
    "details":{
        "receivedDocuments":1,
        "indexedDocuments":null
        },
    "error":{
        "message": "Document doesn't have a `id` attribute: `{\"title\":\"Solaris\",\"author\":\"Stanislaw Lem\",\"genres\":[\"science fiction\"],\"price\":5.0.",
        "code": "missing_document_id",
        "type": "invalid_request",
        "link": "https://docs.meilisearch.com/errors#missing_document_id"
        },
    "duration": "PT0.007899S",
    "enqueuedAt": "2021-12-30T11:23:52.304689Z",
    "startedAt": "2021-12-30T11:23:52.307632Z",
    "finishedAt": "2021-12-30T11:23:52.312588Z"
}
```

### `invalid_document_id`

This happens when your document id does not have the correct [format](#formatting-the-document-id). The document id can only be of type integer or string, composed of alphanumeric characters `a-z A-Z 0-9`, hyphens `-`, and underscores `_`.

```json
{
    "uid":1,
    "indexUid": "books",
    "status": "failed",
    "type": "documentAdditionOrUpdate",
    "canceledBy": null,
    "details":{
        "receivedDocuments":5,
        "indexedDocuments":null
        },
    "error":{
        "message": "Document identifier `1@` is invalid. A document identifier can be of type integer or string, only composed of alphanumeric characters (a-z A-Z 0-9), hyphens (-) and underscores (_).",
        "code": "invalid_document_id",
        "type": "invalid_request",
        "link": "https://docs.meilisearch.com/errors#invalid_document_id"
        },
    "duration": "PT0.009738S",
    "enqueuedAt": "2021-12-30T11:28:59.075065Z",
    "startedAt": "2021-12-30T11:28:59.076144Z",
    "finishedAt": "2021-12-30T11:28:59.084803Z"
}
```
