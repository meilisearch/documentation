# Documents

`Documents` are objects composed of fields containing any data.</br>
A `field` is composed of an `attribute` and its associated data.

```json
{
  "id": 3205,
  "title": "Interstellar",
  "description": "This is a great movie.",
  "type": ["sci fi", "space"]
}
```

In this document, **attributes** are `"id"`, `"title"`, `"description"` and `"type"`.</br>
The **fields** are the combination of attributes and data (i.e., `"title": "Interstellar"`).

## Documents structure

A document is added to MeiliSearch in `JSON format`.<br/>
Each field in a document should correspond to a field defined in the [schema](/main_concepts/indexes.md#schema-definition) to be taken into account.

A **document must contain** [one identifier field](/main_concepts/documents.md#documents-identifiers) to be indexed in MeiliSearch.

::: danger
Documents fields that do not exist in the schema are ignored.
:::

When using the [route to add new documents](/references/documents.md#add-or-update-documents), all documents should be sent in an array. And this, even if there is only one document.

## Documents identifiers

To be indexed by MeiliSearch, a document must have an **identifier**. A document without an identifier will be ignored when added to MeiliSearch.

The identifier **attribute** can be anything, unless the [schema is inferred when adding documents](/main_concepts/indexes.md#inferred-schema).

The identifier **value** must contain only `A-Z a-z 0-0` and `-_` characters.
#### Examples
Good :
```
"id" : "_Aabc012_"
```
Bad :
```
"id" : "@BI+* ^5h2%"
```
