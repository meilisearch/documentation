# Documents

**Documents** are objects composed of fields which can store any type of data.</br>
Each **field** contains an **attribute** and its associated value.

![document structure](/document_structure.svg)

#### Wording

- **Attribute**: An attribute is like a key (`"id"`, `"title"`, `"description"` and `"type"`).
- **Field**: A field, or a key-value pair, is a set of two data items linked together. Here, an attribute and its corresponding data (i.e, `"title": "Interstellar"`).
- # **Document**: A document is an object which contains a list of fields in curly brackets.
- **Attribute**: An attribute is the name of a field, like a key.
- **[Field](/guides/main_concepts/documents.md#fields)**: A field, or a key-value pair, is a set of two data items linked together: an attribute and its corresponding data
- **Document**: A document is an object which collects a list of fields between curly brackets.
- **[Primary key](/guides/main_concepts/documents.md#primary-key)**: The attribute of the field which contains the unique identifier of the documents.
- **[Document id](/guides/main_concepts/documents.md#document-id)**: The unique value of a document.

## Structure

Documents are sent to MeiliSearch in `JSON format`.<br/>
When using the [route to add new documents](/references/documents.md#add-or-update-documents), all documents must be sent in an array **even if there is only one document**.

```bash
curl -X POST `http://localhost:7700/indexes/movies/documents` \
--data '[
  {
    "movie_id": "123sq178",
    "title": "Amelie Poulain"
  }
]'
```

In order to be indexed, each **document must contain** [the primary key field](/guides/main_concepts/documents.md#primary-key).

## Fields

By default, all fields included in a document are <clientGlossary word="searchable" /> and <clientGlossary word="displayed" />.
You can adjust how a field get handled by MeiliSearch in the settings <Badge text="soon" type="warn"/>. It can either be searchable or displayed, both, or none of both. In the latter case, the field will be completely ignored when a document is sent.

You can also apply <clientGlossary word="ranking rules" /> to some fields. For example, you may decide recent movies should be more relevant than older ones.

## Primary key

A primary key is an <clientGlossary word="attribute" /> which contains a unique value. It uniquely identifies each of the documents of a given index in order to store them.

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

MeiliSearch will search for an attribute that contains the string `id` in a case-insensitive manner (i.e, `uid`, `MovieId`, `ID`, `123id123`).<br>
If no corresponding attribute has been found, the index will have no known primary key, and therefore, no documents will be added.

#### Missing primary key error

❗️ If you get the `Could not infer a primary key` error, the primary key was not recognized. This means your primary key is wrongly formatted. Sending the [primary key's name as a query parameter](/references/documents.md#add-or-replace-documents) or [updating your index to add the primary key's name](/references/indexes.md#create-an-index) as explained in [setting the primary key](/guides/main_concepts/documents.md#primary-key) should solve this issue.

### Document Id

The document id is the value associated to the primary key.

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
