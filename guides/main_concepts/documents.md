# Documents

**Documents** are objects composed of fields which can store any type of data.</br>
Each **field** contains an **attribute** and its associated **value**.

![document structure](/document_structure.svg)

#### Wording

- **Document**: A document is an object which contains a list of fields in curly brackets.
- **[Field](/guides/main_concepts/documents.md#fields)**: A field, or a key-value pair, is a set of two data items linked together: an attribute and its corresponding value.
- **Attribute**: An attribute is the name of a field, like a key.
- **[Primary key](/guides/main_concepts/documents.md#primary-key)**: The attribute of the field which contains the unique identifier of the documents.
- **[Document id](/guides/main_concepts/documents.md#document-id)**: A document id is the value associated to the primary key attribute. Values in that field must always be **unique**.

#### Example

Given an **index** that contains information about movies. There would be **documents** with the following **attributes**:`"id"`, `"title"`, `"description"` and `"type"`, a **field** is the association of an attribute and its **value**: `"title": "Kung fu Panda"`.

Each document contains at least the **primary key** attribute : `id` with its associated value, the **document id**: `"id": "123456"`

## Structure

Documents are sent to MeiliSearch in `JSON format`.
When using the [route to add new documents](/references/documents.md#add-or-update-documents), all documents must be sent in an array **even if there is only one document**.

<code-samples id="documents_guide_add_movie_1" />

In order to be indexed, each **document must contain** [the primary key field](/guides/main_concepts/documents.md#primary-key).

## Upload

By default, MeiliSearch limits the size of `JSON` payload to 10Mb. This affects the upload of documents.
To upload more document in one go, it is possible to [change the payload size](/guides/advanced_guides/configuration.md#payload-limit-size) limit during the setup of the MeiliSearch instance using the `http-payload-size-limit` option.

```bash
$ ./meilisearch http-payload-size-limit=100000000
```

> The payload limit is now +-100MB instead of 10MB

**MeiliSearch uses a lot of RAM when indexing documents**, be aware of your RAM availability as you increase the size of your batch as this could result in a MeiliSearch crash.

## Fields

- **[Data type](/guides/advanced_guides/datatypes.md)**: A field's data type determines what kind of data can be stored in that field.
- **[Field properties](/guides/advanced_guides/field_properties.md)**: Field properties determines the characteristics and behavior of the data added to that field.

By default, all fields included in a document are <clientGlossary word="searchable" /> and <clientGlossary word="displayed" />.
You can adjust how a field get handled by MeiliSearch in the settings. It can either be searchable or displayed, both, or none of both. In the latter case, the field will be completely ignored when a document is sent.

You can also apply <clientGlossary word="ranking rules" /> to some fields. For example, you may decide recent movies should be more relevant than older ones.

## Primary key

A primary key is an <clientGlossary word="attribute" /> which contains a unique value. It uniquely identifies each of the documents of a given index in order to store them. Therefore, values in that field must always be **unique**.

Each index recognizes **only one** primary key attribute. Once a [primary key has been set for an index](/guides/main_concepts/documents.md#setting-the-primary-key), it **cannot be changed anymore**.

If no **primary key** is found in a document, the document will not be stored.

**Example:**

Suppose we have an index of 200k `documents` called `movie`. Each document is identified by a primary key named `movie_id` whose value is unique as shown below.

```json
[
  {
    "movie_id": "1564saqw12ss",
    "title": "Kung fu Panda"
  },
  {
    "movie_id": "15k1j2kkw223s",
    "title": "Batman"
  }
]
```

### Setting the primary key

There are several ways for MeiliSearch to know which field is the `primary key` in several ways.

- MeiliSearch [automatically infers the primary key](/guides/main_concepts/documents.md#meilisearch-infers-your-primary-key) based on your first document.
- Set it [on index creation](/references/indexes.md#create-an-index)
- Set it [on document addition](/references/documents.md#add-or-replace-documents)

#### MeiliSearch infers your primary key

If no primary key has been given either when the index was created or as a parameter of the add documents route, the primary key will be searched in the first document sent.

MeiliSearch will search for an attribute that contains the string `id` in a case-insensitive manner (i.e, `uid`, `MovieId`, `ID`, `123id123`).
If no corresponding attribute has been found, the index will have no known primary key, and therefore, no documents will be added.

#### Missing primary key error

❗️ If you get the `Could not infer a primary key` error, the primary key was not recognized. This means your primary key is wrongly formatted. Sending the [primary key's name as a query parameter](/references/documents.md#add-or-replace-documents) or [updating your index to add the primary key's name](/references/indexes.md#create-an-index) as explained in [setting the primary key](/guides/main_concepts/documents.md#primary-key) should solve this issue.

### Document Id

The document id is the **value** associated to the <clientGlossary word="primary key"/>.

The document id must contain only `A-Z a-z 0-9` and `-_` characters.

#### Examples

Good:

```json
"id": "_Aabc012_"
```

Bad:

```json
"id": "@BI+* ^5h2%"
```

The document addition request in MeiliSearch is <!-- prettier-ignore -->[atomic](https://en.wikipedia.org/wiki/Atomicity_(database_systems)). Thus, for example, if you submit 200 documents in one go and it happens one of them contains a wrongly formatted document id, an error will occur and result in no additions.
