# Documents
 
A **document** is an object composed of one or more **fields**. Each **<clientGlossary word="field" />** consists of an **<clientGlossary word="attribute" />** and its associated **value**.<br />
Documents function as **containers for organizing data**, and are the basic building blocks of a MeiliSearch database. To search for a document, it must first be added to an **[index][indexes]**.

## Structure

![document structure](/document_structure.svg)

**Important Terms:**

- **Document**: an object which contains a list of fields enclosed by curly brackets.
- **[Field][fields]**: a set of two data items that are linked together: an **attribute** and a **value**.
- **Attribute**: the first part of a field. Acts as a name or description for its associated value.
- **Value**: the second part of a field, consisting of data of any valid `JSON` type.
- **[Primary Key][primary-key]**: the only required attribute. **All documents in the same index must possess the same primary key.** Its associated value is the document identifier.
- **[Document Identifier][document-id]**: the value associated with the primary key. **Every document in a given index must have a unique id**.

Documents are sent to MeiliSearch in `JSON format`. As such, any rule that applies to formatting `JSON objects` also applies to formatting MeiliSearch documents. For example, **an attribute must be a string**, and **a value must be a valid `JSON` data type**.

A document can have as many fields as necessary, but must have at minimum one field containing the **[primary key][primary-key]** and the document's **[unique id][document-id]**. If you try to index a document without a primary key, or without [the correct one for a given index](/guides/main_concepts/indexes.md#primary-key), it will cause an error and no documents will be added.

#### Example:

Let's say you are making an **[index][indexes]** that contains information about movies.
A sample document might have attributes like `"id"`, `"title"`, `"genre"`, and `"release-year"`.
Each of those attributes must be associated with a value, e.g. `"title": "Kung fu Panda"`.
At minimum, the document must contain a field with a **[primary key][primary-key]** attribute and a **[document id][document-id]** as its associated value. For example: `"id": "123456"`

## Fields

A field is a set of two data items linked together: an **attribute** and a **value**. Documents are made up of fields.

- **[Data type](/guides/advanced_guides/datatypes.md)**: A field's data type determines what kind of data can be stored in that field.
- **[Field properties](/guides/advanced_guides/field_properties.md)**: Field properties determine the characteristics and behavior of the data added to that field.

At this time, there are two field properties: [<clientGlossary word="searchable" />](/guides/advanced_guides/field_properties.md#searchable-fields) and [<clientGlossary word="displayed" />](/guides/advanced_guides/field_properties.md#displayed-fields). A field can have one, both, or neither of these properties. By default, **all fields in a document are both displayed and searchable.**

**To clarify, a field may be:**
* searchable but not displayed
* displayed but not searchable
* both displayed and searchable (default)
* neither displayed nor searchable

In the latter case, the field will be completely ignored when a search is performed. However, it will still be [stored](/guides/advanced_guides/field_properties.md#data-storing) in the document.

You can also apply [<clientGlossary word="ranking rules" />](/guides/main_concepts/relevancy.md#ranking-rules) to some fields. For example, you may decide recent movies should be more relevant than older ones.

If you would like to adjust how a field gets handled by MeiliSearch, you can do so in the [settings](/guides/advanced_guides/settings.md#settings).

## Primary key

The primary key is a **mandatory** <clientGlossary word="attribute" /> which contains a unique value: the [document id][document-id]. This <clientGlossary word="field" /> uniquely identifies each of the documents of a given index in order to store them; therefore, every document in the same index **must have a different value** in this field.

Each index recognizes **only one** primary key attribute. Once a [primary key has been set for an index](/guides/main_concepts/documents.md#setting-the-primary-key), it **cannot be changed anymore**.

If no primary key is found in a document, **the document will not be stored.**

#### Example:

Suppose we have an index called `movie` that contains 200,000 `documents`. As shown below, each document is identified by a primary key named `movie_id` whose value is unique.

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

There are several ways for MeiliSearch to know which field is the `primary key`.

- You set it manually [on index creation](/references/indexes.md#create-an-index)
- You set it manually [on document addition](/references/documents.md#add-or-replace-documents)
- MeiliSearch [automatically infers the primary key](/guides/main_concepts/documents.md#meilisearch-infers-your-primary-key) based on your first document.

#### MeiliSearch infers your primary key

If the primary key has neither been set at index creation nor as a parameter of the add documents route, MeiliSearch will search your first document for an attribute that contains the string `id` in a case-insensitive manner (e.g., `uid`, `MovieId`, `ID`, `123id123`) and set it as that index's primary key.
If no corresponding attribute is found, the index will have no known primary key, and therefore, **no documents will be added**.

#### Missing primary key error

❗️ If you get the `Could not infer a primary key` error, the primary key was not recognized. This means **your primary key is wrongly formatted.** Sending the [primary key's name as a query parameter](/references/documents.md#add-or-replace-documents) or [updating your index to add the primary key's name](/references/indexes.md#create-an-index) as explained in [setting the primary key](/guides/main_concepts/documents.md#primary-key) should solve this issue.

## Document Id

The document id is the **value** associated to the <clientGlossary word="primary key"/>. It acts as a unique identifier for each of the documents of a given index.

The document id ensures that no two documents in the same index can be exactly alike. If two documents have the same id, then they are treated as the same document and the most recent one will replace the older.

The document id must contain only `A-Z a-z 0-9` and `-_` characters.

#### Example:

Good:

```json
"id": "_Aabc012_"
```

Bad:

```json
"id": "@BI+* ^5h2%"
```

Take note that the document addition request in MeiliSearch is <!-- prettier-ignore -->[atomic](https://en.wikipedia.org/wiki/Atomicity_(database_systems)). This means that if even a single document id is incorrectly formatted, an error will occur and none of your documents will be added.

## Upload

By default, MeiliSearch limits the size of `JSON` payloads—and therefore document uploads—to 10MB.

To upload more documents in one go, it is possible to [change the payload size limit](/guides/advanced_guides/configuration.md#payload-limit-size) during the setup of your MeiliSearch instance using the `http-payload-size-limit` option.

```bash
$ ./meilisearch --http-payload-size-limit=100000000
```

> The payload limit is now +-100MB instead of 10MB

**MeiliSearch uses a lot of RAM when indexing documents**. Be aware of your RAM availability as you increase the size of your batch as this could result in a MeiliSearch crash.

When using the [route to add new documents](/references/documents.md#add-or-update-documents), all documents must be sent in an array **even if there is only one document**.

[primary-key]: /guides/main_concepts/documents.md#primary-key
[document-id]: /guides/main_concepts/documents.md#document-id
[fields]: /guides/main_concepts/documents.md#fields
[indexes]: /guides/main_concepts/indexes.md