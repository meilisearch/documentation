# Documents

A **document** is an object composed of one or more **<clientGlossary word="field" label="fields"/>**. Each field consists of an **<clientGlossary word="attribute" />** and its associated **<clientGlossary word="value" />**.

Documents function as **containers for organizing data**, and are the basic building blocks of a MeiliSearch database. To search for a document, it must first be added to an [index][indexes].

## Structure

![document structure](/document_structure.svg =573x400)

### Important Terms

- **Document**: an object which contains data in the form of one or more fields.
- **[Field][fields]**: a set of two data items that are linked together: an **attribute** and a **value**.
- **Attribute**: the first part of a field. Acts as a name or description for its associated value.
- **Value**: the second part of a field, consisting of data of any valid `JSON` type.
- **[Primary Field][primary-field]**: A special field that is mandatory in all documents. It contains the primary key and document identifier.
- **[Primary Key][primary-key]**: the attribute of the primary field. **All documents in the same index must possess the same primary key.** Its associated value is the document identifier.
- **[Document Identifier][document-id]**: the value of the primary field. **Every document in a given index must have a unique identifier**.

### Formatting

Documents are represented as `JSON objects`: key-value pairs enclosed by curly brackets. As such, [any rule that applies to formatting `JSON objects`](https://www.w3schools.com/js/js_json_objects.asp) also applies to formatting MeiliSearch documents. For example, **an attribute must be a string**, while **a value must be a valid [`JSON` data type](https://www.w3schools.com/js/js_json_datatypes.asp)**.

As an example, let's say you are making an **[index][indexes]** that contains information about movies. A sample document might look like this:

```json
{
  "id": "1564saqw12ss",
  "title": "Kung Fu Panda",
  "genre": "Children's Animation",
  "release-year": 2008,
  "cast": [ {"Jack Black": "Po"}, {"Jackie Chan": "Monkey"} ]
}
```

In the above example, `"id"`, `"title"`, `"genre"`, `"release-year"`, and `"cast"` are **attributes**.
Each attribute must be associated with a **value**, e.g. `"Kung Fu Panda"` is the value of `"title"`.
At minimum, the document must contain one field with the **[primary key][primary-key]** attribute and a unique **[document id][document-id]** as its value. Above, that's: `"id": "1564saqw12ss"`.

### Limitations and Requirements

Documents have a **soft maximum of 1000 fields**; beyond that the [<clientGlossary word="ranking rules" />](/guides/main_concepts/relevancy.md#ranking-rules) may no longer be effective, leading to undefined behavior.

Additionally, every document must have at minimum one field containing the **[<clientGlossary word="primary key" />][primary-key]** and a **[unique id][document-id]**.

If you try to [index a document](/guides/introduction/quick_start_guide.md#add-documents) that's incorrectly formatted, missing a primary key, or possessing the [wrong primary key for a given index](/guides/main_concepts/indexes.md#primary-key), it will cause an error and no documents will be added.

## Fields

A <clientGlossary word="field" /> is a set of two data items linked together: an <clientGlossary word="attribute" /> and a value. Documents are made up of fields.

An attribute functions a bit like a variable in most programming languages, i.e. it is a name that allows you to store, access, and describe some data. That data is the attribute's **value**.

Every field has a [data type](/guides/advanced_guides/datatypes.md) dictated by its value. Every value must be a valid [`JSON` data type](https://www.w3schools.com/js/js_json_datatypes.asp).

Take note that in the case of strings, the value **[can contain at most 1000 words](/guides/advanced_guides/known_limitations.md#maximum-words-per-attribute)**. If it contains more than 1000 words, only the first 1000 will be indexed.

You can also apply [<clientGlossary word="ranking rules" />](/guides/main_concepts/relevancy.md#ranking-rules) to some fields. For example, you may decide recent movies should be more relevant than older ones.

If you would like to adjust how a field gets handled by MeiliSearch, you can do so in the [settings](/guides/advanced_guides/settings.md#settings).

### Field properties

A field may also possess **[field properties](/guides/advanced_guides/field_properties.md)**. Field properties determine the characteristics and behavior of the data added to that field.

At this time, there are two field properties: [<clientGlossary word="searchable" />](/guides/advanced_guides/field_properties.md#searchable-fields) and [<clientGlossary word="displayed" />](/guides/advanced_guides/field_properties.md#displayed-fields). A field can have one, both, or neither of these properties. **By default, all fields in a document are both displayed and searchable.**

To clarify, a field may be:

- searchable but not displayed
- displayed but not searchable
- both displayed and searchable (default)
- neither displayed nor searchable

In the latter case, the field will be completely ignored when a search is performed. However, it will still be [stored](/guides/advanced_guides/field_properties.md#data-storing) in the document.

## Primary Field

The <clientGlossary word="primary field" /> is a special <clientGlossary word="field" /> that must be present in all documents. Its attribute is the [<clientGlossary word="primary key" />][primary-key] and its value is the [<clientGlossary word="document id" />][document-id].

The primary field serves the important role of uniquely identifying each document stored in an index, ensuring that **it is impossible to have two exactly identical documents** present in the same index.

Therefore, every document in the same index **must possess the exact same primary key** associated with a unique **document id** as value.

#### Example:

Suppose we have an index called `movie` that contains 200,000 documents. As shown below, each document is identified by a **primary field** containing the **primary key** `movie_id` and a **unique value** (the document id).
Aside from the primary key, **documents in the same index are not required to share attributes**, e.g. you could have a document in this index without the "title" attribute.

```json
[
  {
    "movie_id": "1564saqw12ss",
    "title": "Kung fu Panda",
    "runtime": 95
  },
  {
    "movie_id": "15k1j2kkw223s",
    "title": "Batman Begins",
    "gritty reboot": true
  }
]
```

### Primary Key

The <clientGlossary word="primary key" />  is a **mandatory <clientGlossary word="attribute" /> linked to a unique <clientGlossary word="value" />:** the [<clientGlossary word="document id" />][document-id]. It is part of the [<clientGlossary word="primary field" />][primary-field].

Each index recognizes **only one** primary key attribute. Once a primary key has been set for an index, it **cannot be changed anymore**. If no primary key is found in a document, **the document will not be stored.**

#### Setting the primary key

There are several ways for MeiliSearch to know which field is the primary key.

- You can set it manually [on index creation](/references/indexes.md#create-an-index)
- You can set it manually [on document addition](/references/documents.md#add-or-replace-documents)
- MeiliSearch can [automatically infer the primary key](/guides/main_concepts/documents.md#meilisearch-infers-your-primary-key) based on your first document.

#### MeiliSearch infers your primary key

If the primary key has neither been set at index creation nor as a parameter of the add documents route, MeiliSearch will search your first document for an attribute that contains the string `id` in a case-insensitive manner (e.g., `uid`, `MovieId`, `ID`, `123id123`) and set it as that index's primary key.
If no corresponding attribute is found, the index will have no known primary key, and therefore, **no documents will be added**.

#### Missing primary key error

❗️ If you get the `Could not infer a primary key` error, the primary key was not recognized. This means **your primary key is wrongly formatted or absent**.
Manually adding the primary key can be accomplished by using its name as a parameter for [the add document route](/references/documents.md#add-or-replace-documents) or [the update index route](/references/indexes.md#create-an-index).

### Document Id

The <clientGlossary word="document id" /> is the <clientGlossary word="value" /> associated to the <clientGlossary word="primary key"/>. It is part of the <clientGlossary word="primary field" />, and acts as a unique identifier for each of the documents of a given index.

This unique value ensures that two documents in the same index cannot be exactly alike. If two documents in the same index have the same id, then they are treated as the same document and the more recent one will replace the older.

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

Take note that the document addition request in MeiliSearch is <clientGlossary word="atomic"/>. This means that **if even a single document id is incorrectly formatted, an error will occur and none of your documents will be added**.

## Upload

By default, MeiliSearch limits the size of `JSON` payloads—and therefore document uploads—to 10MB.

To upload more documents in one go, it is possible to [change the payload size limit](/guides/advanced_guides/configuration.md#payload-limit-size) during the setup of your MeiliSearch instance using the `http-payload-size-limit` option. The new limit must be given in bytes.

```bash
$ ./meilisearch --http-payload-size-limit= 1048576000
```

> The above code sets the payload limit to approximately 1GB, instead of the 10MB default.

**MeiliSearch uses a lot of RAM when indexing documents**. Be aware of your RAM availability as you increase the size of your batch as this could result in a MeiliSearch crash.

When using the [route to add new documents](/references/documents.md#add-or-update-documents), all documents must be sent in an array **even if there is only one document**.

<CodeSamples id="documents_guide_add_movie_1" />

[primary-field]: /guides/main_concepts/documents.md#primary-field
[primary-key]: /guides/main_concepts/documents.md#primary-key
[document-id]: /guides/main_concepts/documents.md#document-id
[fields]: /guides/main_concepts/documents.md#fields
[indexes]: /guides/main_concepts/indexes.md
