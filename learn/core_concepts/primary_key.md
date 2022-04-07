# Primary key

## Primary field

[Documents](/learn/core_concepts/documents.md) in Meilisearch are composed of fields. A field is a set of two data items linked together: an attribute and a value.

The primary field is a special field that must be present in all documents. Its attribute is the **[primary key](#primary-key-2)** and its value is the **[document id](#document-id)**. It uniquely identifies each document in an index, ensuring that **it is impossible to have two exactly identical documents** present in the same index.

### Example

Suppose we have a dataset containing several books. Each document contains a number fields with data on the book's `author`, `title`, and `price`. More importantly, each document contains a **primary field** indicating the books'  **primary key** `id` and a **document id**.

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

Aside from the primary key, **documents in the same index are not required to share attributes**. A book in this dataset could be missing a `title` or `genre` attribute and still be successfully indexed by Meilisearch.

### Primary key

The primary key is the attribute of the primary field and it must be shared across all documents in an index. If no primary key is found in one document, **none of the documents will be stored.**

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

The document id is the value associated with the primary key. It is part of the primary field, and acts as a unique identifier for each documents in a given index.

Two documents in an index can have the same values for all attributes except the primary key. If two documents in the same index have the same id, then they are treated as the same document and **the preceding document will be overwritten**.

The document id must be an integer or a string. If the id is a string, it can only contain alphanumeric characters (`a-z`, `A-Z`, `0-9`), hyphens (`-`), and underscores (`_`).

#### Example

Good:

```json
"id": "_Aabc012_"
```

Bad:

```json
"id": "@BI+* ^5h2%"
```

Document addition requests in Meilisearch are atomic. This means that **if the primary field value of even a single document in a batch is incorrectly formatted, an error will occur and Meilisearch will not index documents in that batch.**

## Setting the primary key

You can set the primary key explicitly or let Meilisearch infer it from your dataset—whatever your choice, an index can only one primary key. If you try to index a document that has no primary key, Meilisearch will immediately interrupt the process and no documents will be added to your index.

### Setting the primary key on index creation

When creating an index manually, you can explicitly indicate the primary key you want this index to use. The code below creates an index called `books` and sets `reference_number` as its primary key:

<CodeSamples id="document_guide_create_index_primary_key" />

```json
{
    "uid":1,
    "indexUid":"books",
    "status":"succeeded",
    "type":"indexCreation",
    "details":{
        "primaryKey":"reference_number"
        },
    "duration":"PT0.006751S",
    "enqueuedAt":"2021-12-30T10:19:00.318884Z",
    "startedAt":"2021-12-30T10:19:00.320177Z",
    "finishedAt":"2021-12-30T10:19:00.325635Z"
}    
```

Once a primary key has been explicitly set for an index, it cannot be changed.

### Setting the primary key on document addition

You can also explicitly state your documents' primary key by including it in your document addition request. The code below adds a document and sets `reference_number` as the index's primary key:

<CodeSamples id="document_guide_add_document_primary_key" />

```json
{
    "uid":1,
    "indexUid":"books",
    "status":"succeeded",
    "type":"documentAddition",
    "details":{
        "receivedDocuments":1,
        "indexedDocuments":1
        },
    "duration":"PT0.010418S",
    "enqueuedAt":"2021-12-30T10:38:22.331502Z",
    "startedAt":"2021-12-30T10:38:22.332686Z",
    "finishedAt":"2021-12-30T10:38:22.341920Z"
}
```

Once a primary key has been explicitly set for an index, it cannot be changed.

### Meilisearch guesses your primary key

If the primary key has neither been set at index creation nor as a parameter of the [add documents](/reference/api/documents.md#add-or-replace-documents) route, Meilisearch will search your first document for an attribute that contains the string `id` in a case-insensitive manner (e.g., `uid`, `BookId`, `ID`, `123id123`) and set it as that index's primary key.

If Meilisearch cannot find a suitable attribute, the document addition process will be interrupted and no documents will be added to your index.

## Primary key errors

This section will cover some primary key errors and how to resolve them.

### `primary_key_inference_failed`

This happens when you add documents for the first time and none of them have a primary key attribute.

```json
{
    "uid":1,
    "indexUid":"books",
    "status":"failed",
    "type":"documentAddition",
    "details":{
        "receivedDocuments":5,
        "indexedDocuments":null
        },
    "error":{
        "message":"The primary key inference process failed because the engine did not find any fields containing `id` substring in their name. If your document identifier does not contain any `id` substring, you can set the primary key of the index.",
        "code":"primary_key_inference_failed",
        "type":"invalid_request",
        "link":"https://docs.meilisearch.com/errors#primary_key_inference_failed"
        },
    "duration":"PT0.007479S",
    "enqueuedAt":"2021-12-30T11:17:49.708824Z",
    "startedAt":"2021-12-30T11:17:49.709934Z",
    "finishedAt":"2021-12-30T11:17:49.716303Z"
}
```

### `missing_document_id`

This happens when your index already has a primary key, but one of the documents you are currently trying to add is missing this attribute.

```json
{
    "uid":1,
    "indexUid":"books",
    "status":"failed",
    "type":"documentAddition",
    "details":{
        "receivedDocuments":1,
        "indexedDocuments":null
        },
    "error":{
        "message":"Document doesn't have a `id` attribute: `{\"title\":\"Solaris\",\"author\":\"Stanislaw Lem\",\"genres\":[\"science fiction\"],\"price\":5.0.",
        "code":"missing_document_id",
        "type":"invalid_request",
        "link":"https://docs.meilisearch.com/errors#missing_document_id"
        },
    "duration":"PT0.007899S",
    "enqueuedAt":"2021-12-30T11:23:52.304689Z",
    "startedAt":"2021-12-30T11:23:52.307632Z",
    "finishedAt":"2021-12-30T11:23:52.312588Z"
}
```

### `invalid_document_id`

This happens when your document id does not have the correct format. The document id can only be of type integer or string, composed of alphanumeric characters `a-z A-Z 0-9`, hyphens `-`, and underscores `_`.

```json
{
    "uid":1,
    "indexUid":"books",
    "status":"failed",
    "type":"documentAddition",
    "details":{
        "receivedDocuments":5,
        "indexedDocuments":null
        },
    "error":{
        "message":"Document identifier `1@` is invalid. A document identifier can be of type integer or string, only composed of alphanumeric characters (a-z A-Z 0-9), hyphens (-) and underscores (_).",
        "code":"invalid_document_id",
        "type":"invalid_request",
        "link":"https://docs.meilisearch.com/errors#invalid_document_id"
        },
    "duration":"PT0.009738S",
    "enqueuedAt":"2021-12-30T11:28:59.075065Z",
    "startedAt":"2021-12-30T11:28:59.076144Z",
    "finishedAt":"2021-12-30T11:28:59.084803Z"
}
```
