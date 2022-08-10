# Documents

A document is an object composed of one or more fields. Each field consists of an **attribute** and its associated **value**. Documents function as containers for organizing data, and are the basic building blocks of a Meilisearch database. To search for a document, you must first add it to an [index](/learn/core_concepts/indexes.md).

## Structure

![Diagram illustration Meilisearch's document structure](/document_structure.svg =573x400)

### Important terms

- **Document**: an object which contains data in the form of one or more fields
- **[Field](#fields)**: a set of two data items that are linked together: an attribute and a value
- **Attribute**: the first part of a field. Acts as a name or description for its associated value
- **Value**: the second part of a field, consisting of data of any valid JSON type
- **[Primary Field](#primary-field)**: a special field that is mandatory in all documents. It contains the primary key and document identifier

## Fields

A field is a set of two data items linked together: an attribute and a value. Documents are made up of fields.

An attribute functions a bit like a variable in most programming languages, i.e., it is a name that allows you to store, access, and describe some data. That data is the attribute's value. In the case of strings, a value **[can contain at most 65535 positions](/learn/advanced/known_limitations.md#maximum-number-of-words-per-attribute)**. Words exceeding the 65535 position limit will be ignored.

Every field has a data type dictated by its value. Every value must be a valid [JSON data type](https://www.w3schools.com/js/js_json_datatypes.asp).

If a field contains an object, Meilisearch flattens it during indexation using dot notation and brings the object's keys and values to the root level of the document itself. This flattened object is only an intermediary representation—you will get the original structure upon search. You can read more about this in our [dedicated guide](/learn/advanced/datatypes.md#objects).

With [ranking rules](/learn/core_concepts/relevancy.md#ranking-rules), you can decide what fields are more relevant than others. For example, you may decide recent movies should be more relevant than older ones. You can also configure how Meilisearch handles certain fields at an [index level](/learn/configuration/settings.md) in the settings.

### Displayed and searchable fields

By default, all fields in a document are both displayed and searchable. Displayed fields are contained in each matching document, while searchable fields are searched for matching query words.

You can modify this behavior using the [update settings endpoint](/reference/api/settings.md#update-settings), or the respective update endpoints for [displayed attributes](/reference/api/displayed_attributes.md#update-displayed-attributes), and [searchable attributes](/reference/api/searchable_attributes.md#update-searchable-attributes) so that a field is:

- Searchable but not displayed
- Displayed but not searchable
- Neither displayed nor searchable

In the latter case, the field will be completely ignored during search. However, it will still be [stored](/learn/configuration/displayed_searchable_attributes.md#data-storing) in the document.

## Primary field

The primary field is a special field that must be present in all documents. Its attribute is the [primary key](/learn/core_concepts/primary_key.md#primary-key-2) and its value is the [document id](/learn/core_concepts/primary_key.md#document-id). If you try to [index a document](/learn/getting_started/quick_start.md#add-documents) that's missing a primary key or possessing the wrong primary key for a given index, it will cause an error and no documents will be added.

To learn more, refer to the [primary key explanation](/learn/core_concepts/primary_key.md).

## Upload

By default, Meilisearch limits the size of all payloads—and therefore document uploads—to 100MB. You can [change the payload size limit](/learn/configuration/instance_options.md#payload-limit-size) at runtime using the `http-payload-size-limit` option.

Meilisearch uses a lot of RAM when indexing documents. Be aware of your [RAM availability](/resources/faq.md#what-are-the-recommended-requirements-for-hosting-a-meilisearch-instance) as you increase your batch size as this could cause Meilisearch to crash.

When using the [add new documents endpoint](/reference/api/documents.md#add-or-update-documents), ensure:

- The payload format is correct. There are no extraneous commas, mismatched brackets, missing quotes, etc.
- All documents are sent in an array, even if there is only one document

### Dataset format

Meilisearch accepts datasets in the following formats:

- [JSON](#json)
- [NDJSON](#ndjson)
- [CSV](#csv)

#### JSON

Documents represented as JSON objects are key-value pairs enclosed by curly brackets. As such, [any rule that applies to formatting JSON objects](https://www.w3schools.com/js/js_json_objects.asp) also applies to formatting Meilisearch documents. For example, an attribute must be a string, while a value must be a valid [JSON data type](https://www.w3schools.com/js/js_json_datatypes.asp).

Meilisearch will only accept JSON documents when it receives the `application/json` content-type header.

As an example, let's say you are creating an index that contains information about movies. A sample document might look like this:

```json
{
  "id": 1564,
  "title": "Kung Fu Panda",
  "genres": "Children's Animation",
  "release-year": 2008,
  "cast": [
    { "Jack Black": "Po" },
    { "Jackie Chan": "Monkey" }
  ]
}
```

In the above example:

- `"id"`, `"title"`, `"genres"`, `"release-year"`, and `"cast"` are attributes
- Each attribute is associated with a value, e.g., `"Kung Fu Panda"` is the value of `"title"`
- The document contains a field with the primary key attribute and a unique document id as its value: `"id": "1564saqw12ss"`

#### NDJSON

NDJSON or jsonlines objects consist of individual lines where each individual line is valid JSON text and each line is delimited with a newline character. Any [rules that apply to formatting NDJSON](http://ndjson.org/) also apply to Meilisearch documents.

Meilisearch will only accept NDJSON documents when it receives the `application/x-ndjson` content-type header.

Compared to JSON, NDJSON has better writing performance and is less CPU and memory intensive. It is easier to validate and, unlike CSV, can handle nested structures.  

The above JSON document would look like this in NDJSON:

```json
{ "id": 1564, "title": "Kung Fu Panda", "genres": "Children's Animation", "release-year": 2008, "cast": [{ "Jack Black": "Po" }, { "Jackie Chan": "Monkey" }] }
```

#### CSV

CSV files express data as a sequence of values separated by a delimiter character. Currently, Meilisearch **only supports the comma (`,`) delimiter**. Any [rules that apply to formatting CSV](https://datatracker.ietf.org/doc/html/rfc4180) also apply to Meilisearch documents.

Meilisearch will only accept CSV documents when it receives the `text/csv` content-type header.

Compared to JSON, CSV has better writing performance and is less CPU and memory intensive.  

The above JSON document would look like this in CSV:

```csv
  "id:number","title:string","genres:string","release-year:number"
  "1564","Kung Fu Panda","Children's Animation","2008"
```

Since CSV does not support arrays or nested objects, `cast` cannot be converted to CSV.

::: note
If you don't specify the data type for an attribute, it will default to `:string`.
:::
