# Documents

A **document** is an object composed of one or more **<clientGlossary word="field" label="fields"/>**. Each field consists of an **<clientGlossary word="attribute" />** and its associated **<clientGlossary word="value" />**.

Documents function as **containers for organizing data**, and are the basic building blocks of a MeiliSearch database. To search for a document, it must first be added to an [index][indexes].

## Structure

![document structure](/document_structure.svg =573x400)

### Important terms

- **Document**: an object which contains data in the form of one or more fields.
- **[Field][fields]**: a set of two data items that are linked together: an **attribute** and a **value**.
- **Attribute**: the first part of a field. Acts as a name or description for its associated value.
- **Value**: the second part of a field, consisting of data of any valid JSON type.
- **[Primary Field][primary-field]**: A special field that is mandatory in all documents. It contains the primary key and document identifier.
- **[Primary Key][primary-key]**: the attribute of the primary field. **All documents in the same index must possess the same primary key.** Its associated value is the document identifier.
- **[Document Identifier][document-id]**: the value of the primary field. **Every document in a given index must have a unique identifier**.

### Dataset format

You can provide your dataset in the following formats:

- [JSON](#json)
- [NDJSON](#ndjson)
- [CSV](#csv)

#### JSON

Documents represented as JSON objects are key-value pairs enclosed by curly brackets. As such, [any rule that applies to formatting JSON objects](https://www.w3schools.com/js/js_json_objects.asp) also applies to formatting MeiliSearch documents. For example, **an attribute must be a string**, while **a value must be a valid [JSON data type](https://www.w3schools.com/js/js_json_datatypes.asp)**.

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

#### NDJSON

NDJSON objects consist of individual lines where each individual line is valid JSON text and each line is delimited with a newline character. Any [rules that apply to formatting NDJSON](http://ndjson.org/) also apply to MeiliSearch documents.

Compared to JSON, NDJSON has better writing performance and is less CPU and memory intensive. It is easier to validate and, unlike CSV, can handle nested structures.  

The above JSON document would look like this in NDJSON:

```json

{ 
  "id": "1564saqw12ss", 
  "title": "Kung Fu Panda", 
  "genre": "Children's Animation", 
  "release-year": 2008, 
  "cast": [ {"Jack Black": "Po"}, {"Jackie Chan": "Monkey"} ]
  }
```

#### CSV

CSV files express data as a sequence of values separated by a delimiter character. Currently, MeiliSearch **only supports the comma (`,`) delimiter**. Any [rules that apply to formatting CSV](https://datatracker.ietf.org/doc/html/rfc4180) also apply to MeiliSearch documents.

Compared to JSON, CSV has better writing performance and is less CPU and memory intensive.  

The above JSON document would look like this in CSV:

```csv
  "id:string","title:string","genre:string","release-year:number"
  "1564saqw12ss","Kung Fu Panda","Children's Animation","2008"
```

Since CSV does not support arrays or nested objects, `cast` cannot be converted to CSV.

::: tip
If you don't specify the data type for an attribute, it will default to `:string`.
:::

### Limitations and requirements

Documents have a **soft maximum of 1000 fields**; beyond that the [<clientGlossary word="ranking rules" />](/learn/core_concepts/relevancy.md#ranking-rules) may no longer be effective, leading to undefined behavior.

Additionally, every document must have at minimum one field containing the **[<clientGlossary word="primary key" />][primary-key]** and a **[unique id][document-id]**.

If you try to [index a document](/learn/getting_started/quick_start.md#add-documents) that's incorrectly formatted, missing a primary key, or possessing the [wrong primary key for a given index](/learn/core_concepts/indexes.md#primary-key), it will cause an error and no documents will be added.

## Fields

A <clientGlossary word="field" /> is a set of two data items linked together: an <clientGlossary word="attribute" /> and a value. Documents are made up of fields.

An attribute functions a bit like a variable in most programming languages, i.e. it is a name that allows you to store, access, and describe some data. That data is the attribute's **value**.

Every field has a [data type](/reference/under_the_hood/datatypes.md) dictated by its value. Every value must be a valid [JSON data type](https://www.w3schools.com/js/js_json_datatypes.asp).

Take note that in the case of strings, the value **[can contain at most 1000 words](/reference/features/known_limitations.md#maximum-words-per-attribute)**. If it contains more than 1000 words, only the first 1000 will be indexed.

You can also apply [<clientGlossary word="ranking rules" />](/learn/core_concepts/relevancy.md#ranking-rules) to some fields. For example, you may decide recent movies should be more relevant than older ones.

If you would like to adjust how a field gets handled by MeiliSearch, you can do so in the [settings](/reference/features/settings.md#settings).

### Field properties

A field may also possess **[field properties](/reference/features/field_properties.md)**. Field properties determine the characteristics and behavior of the data added to that field.

At this time, there are two field properties: [<clientGlossary word="searchable" />](/reference/features/field_properties.md#searchable-fields) and [<clientGlossary word="displayed" />](/reference/features/field_properties.md#displayed-fields). A field can have one, both, or neither of these properties. **By default, all fields in a document are both displayed and searchable.**

To clarify, a field may be:

- searchable but not displayed
- displayed but not searchable
- both displayed and searchable (default)
- neither displayed nor searchable

In the latter case, the field will be completely ignored when a search is performed. However, it will still be [stored](/reference/features/field_properties.md#data-storing) in the document.

## Primary field

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

### Primary key

The <clientGlossary word="primary key" />  is a **mandatory <clientGlossary word="attribute" /> linked to a unique <clientGlossary word="value" />:** the [<clientGlossary word="document id" />][document-id]. It is part of the [<clientGlossary word="primary field" />][primary-field].

Each index recognizes **only one** primary key attribute. Once a primary key has been set for an index, it **cannot be changed anymore**. If no primary key is found in a document, **the document will not be stored.**

#### Setting the primary key

There are several ways to set the primary key for an index:

- You can set it manually [on index creation](/reference/api/indexes.md#create-an-index)
- You can set it manually [on document addition](/reference/api/documents.md#add-or-replace-documents)
- If no primary key is set, MeiliSearch automatically [guesses the primary key](/learn/core_concepts/documents.md#meilisearch-guesses-your-primary-key) when you add documents.

#### MeiliSearch guesses your primary key

If the primary key has neither been set at index creation nor as a parameter of the add documents route, MeiliSearch will search your first document for an attribute that contains the string `id` in a case-insensitive manner (e.g., `uid`, `MovieId`, `ID`, `123id123`) and set it as that index's primary key.

If no corresponding attribute is found, the index will have no known primary key, and therefore, **no documents will be added**.

#### Missing primary key error

❗️ If you get the `Could not infer a primary key` error, the primary key was not recognized. This means **your primary key is wrongly formatted or absent**.

Manually adding the primary key can be accomplished by using its name as a parameter for [the add document route](/reference/api/documents.md#add-or-replace-documents) or [the update index route](/reference/api/indexes.md#create-an-index).

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

By default, MeiliSearch limits the size of all payloads—and therefore document uploads—to 100MB.

To upload more documents in one go, it is possible to [change the payload size limit](/reference/features/configuration.md#payload-limit-size) at runtime using the `http-payload-size-limit` option.

```bash
./meilisearch --http-payload-size-limit=1048576000
```

> The above code sets the payload limit to 1GB, instead of the 100MB default.

**MeiliSearch uses a lot of RAM when indexing documents**. Be aware of your [RAM availability](/resources/faq.md#what-are-the-recommended-requirements-for-hosting-a-meilisearch-instance) as you increase the size of your batch as this could cause MeiliSearch to crash.

When using the [route to add new documents](/reference/api/documents.md#add-or-update-documents), all documents must be sent in an array **even if there is only one document**.

<CodeSamples id="documents_guide_add_movie_1" />

[primary-field]: /learn/core_concepts/documents.md#primary-field
[primary-key]: /learn/core_concepts/documents.md#primary-key
[document-id]: /learn/core_concepts/documents.md#document-id
[fields]: /learn/core_concepts/documents.md#fields
[indexes]: /learn/core_concepts/indexes.md
