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

- **Attribute**: `"id"`, `"title"`, `"description"` and `"type"`</br>
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

A **document must contain** [one identifier field](/guides/main_concepts/documents.md#documents-identifiers) to be indexed in MeiliSearch.

## Identifier

An identifier is an attribute with a unique value, found in each document of a given index.

Each index recognizes **only one** identifier attribute. Once the [identifier is set on the index](/guides/main_concepts/documents.html#setting-the-identifier), it **cannot be changed**.

**Example:**

In a index called `movie` there are 200k `documents`. Each of these 200k documents has an identifier called `movie_id` whose value is unique.

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

If the identifier is not found in a document, it will not be added.

<!-- To be indexed by MeiliSearch, a document must have an **identifier**. A document without an identifier will be ignored by MeiliSearch. -->
<!--  -->
### Setting the identifier

MeiliSearch has several ways of knowing which field is the `identifier`.

- [On index creation](#) <Badge text="soon" type="warn"/>
- [On document addition](#)
- MeiliSearch [finds the id](/guides/main_concepts/documents.html#finding-the-identifier) based on your first document.


#### Finding the identifier

If no identifier has been given through the index creation or through document additions MeiliSearch will search for the identifier field in the first document sent.

MeiliSearch will search for an attribute that contains the string `id` in any way case-insensitvely. (i.e, `uid`, `MovieId`, `ID`, `123id123`).
If none has been found, no documents will be added.


### Identifier value format

The identifier **value** may contain only `A-Z a-z 0-0` and `-_` characters.

#### Examples

Good:
```
"id": "_Aabc012_"
```
Bad:
```
"id": "@BI+* ^5h2%"
```


The document addition request in MeiliSearch is [atomic](https://en.wikipedia.org/wiki/Atomicity_(database_systems)), thus if you add 200 documents in one go, if
one of the documents has a badly formatted identifier, an error will occur and none of the documents will be added.
