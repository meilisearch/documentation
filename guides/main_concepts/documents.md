# Documents

**Documents** are objects composed of fields containing any type of data.</br>
A **field** is composed of an **attribute** and its associated data.

```json
{
  "id": 3205,
  "title": "Interstellar",
  "description": "This is a great movie.",
  "type": ["sci fi", "space"]
}
```

#### Wording

- **Attribute**: `"id"`, `"title"`, `"description"` and `"type"`.
- **Field**: the combination of attributes and data (i.e, `"title": "Interstellar"`)
- **Document**: The combination of all the fields between brackets.

## Structure

A document is added to MeiliSearch in `JSON format`.<br/>
When using the [route to add new documents](/references/documents.md#add-or-update-documents), all documents should be sent in an array. And this, even if there is only one document.

```bash
curl -X POST `http://localhost:7700/indexes/movie/documents` \
--data '[
  {
    "movie_id": "123sq178",
    "title": "Amelie Poulain"
  }
]'
```

A **document must contain** [the primary key field](/guides/main_concepts/documents.md#primary-key) to be indexed in MeiliSearch.

## Fields

All fields present in a document are automaticly <glossary word="searchable" /> and <glossary word="displayed" />.
The way MeiliSearch handles a field is customizable in the settings <Badge text="soon" type="warn"/>. You can make a field only searchable, or only displayed, or none, in this case MeiliSearch will completely ignore the field when it is send on document addition.

You can also add <glossary word="ranking rules" /> on a field, to, for example, add a rule that makes recent movies more relevant than older ones.

## Primary key

A primary key is an <glossary word="attribute" /> with a unique value found in each document of a given index. It is used to store the document in the index.

Each index recognizes **only one** primary key attribute. Once the [primary key is set on the index](/guides/main_concepts/documents.md#setting-the-primary-key), it **cannot be changed**.

**Example:**

In an index called `movie` there are 200k `documents`. Each of these 200k documents has a primary key called `movie_id` whose value is unique.

```json
[
  {
    "movie_id" : "1564saqw12ss",
    "title" : "Kung fu Panda"
  },
  {
    "movie_id" : "15k1j2kkw223s",
    "title" : "Batman"
  }
]
```

If the **primary key** is not found in a document, the document will not be added.

### Setting the primary key

MeiliSearch has several ways of knowing which field is the `primary key`.

- MeiliSearch [automaticly infers the primary key](/guides/main_concepts/documents.md#meilisearch-infers-your-primary-key) based on your first document.
- Set it [on index creation](/references/indexes.md#create-an-index)
- Set it [on document addition](/references/documents.md#add-or-replace-documents)

#### MeiliSearch infers your primary key

If no primary key has been given through the index creation or through document additions, MeiliSearch will search for the primary key in the first document sent.

MeiliSearch will search for an attribute that contains the string `id` in any way case-insensitively. (i.e, `uid`, `MovieId`, `ID`, `123id123`).
If none has been found, no documents will be added.

#### Missing primary key error

❗️ If you get the `missing primary key` error, it means MeiliSearch could not recognize your primary key. This means your primary key does not answer the formatting explained above. To solve this error, you could send the [primary-key's name as a query parameter](/references/documents.md#add-or-replace-documents) or [update your index  to add the primary key's name](/references/indexes.md#create-an-index) as explained in: [setting the primary key](/guides/main_concepts/documents.md#primary-key).

### Primary key value format

The primary key **value** may contain only `A-Z a-z 0-0` and `-_` characters.

#### Examples

Good:
```
"id": "_Aabc012_"
```
Bad:
```
"id": "@BI+* ^5h2%"
```


The document addition request in MeiliSearch is [atomic](https://en.wikipedia.org/wiki/Atomicity_(database_systems)). Thus, if you add 200 documents in one go and if one of the documents has a badly formatted primary key, an error will occur, and none of the documents will be added.
