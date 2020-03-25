# Documents

**Documents** are objects composed of fields which can store any type of data.</br>
Each **field** contains an **attribute** and its associated data.

```json
{
  "id": 3205,
  "title": "Interstellar",
  "description": "This is a great movie.",
  "type": ["sci fi", "space"]
}
```

#### Wording

- **Attribute**: An attribute is like a key (`"id"`, `"title"`, `"description"` and `"type"`).
- **Field**: A field, or a key-value pair, is the link of an attribute to a data item (i.e, `"title": "Interstellar"`).
- **Document**: A document is an object which contains a list of fields in curly brackets.

## Structure

Documents are stored in `JSON format`.<br/>
When using the [route to add new documents](/references/documents.md#add-or-update-documents), all documents must be sent in an array even if there is only one document.

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

By default, all fields included in a document are <clientGlossary word="searchable" /> and automatically <clientGlossary word="displayed" />.
You can adjust how a field get handled by MeiliSearch in the settings <Badge text="soon" type="warn"/>. It can either be searchable or displayed, or none of both. In the latter case, the field will be completely ignored when a document is sent.

You can also apply <clientGlossary word="ranking rules" /> to some fields. For example, you may decide recent movies should be more relevant than older ones.

## Primary key

A primary key is an <clientGlossary word="attribute" /> which contains a unique value. It uniquely identifes each document of a given index in order to store them.

Each index recognizes **only one** primary key attribute. Once a [primary key has been set for an index](/guides/main_concepts/documents.md#setting-the-primary-key), it **cannot be changed**.

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

If no **primary key** is found in a document, the document will not be stored.

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

❗️ If you get a `missing primary key` error, the primary key was not recognized. This means your primary key is wrongly formatted. Sending [primary-key's name as a query parameter](/references/documents.md#add-or-replace-documents) or [updating your index to add the primary key's name](/references/indexes.md#create-an-index) as explained [here](/guides/main_concepts/documents.md#primary-key) should solve this issue.

### Primary key value format

Note that the primary key **value** must contain only `A-Z a-z 0-0` and `-_` characters.

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
