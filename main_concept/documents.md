# Documents

`Documents` are objects composed of fields containing any data, a `field` is composed of an `attribute` and its associated data.

```json
{
  "id": 3205,
  "title": "Interstellar",
  "description": "This is a great movie.",
  "type": ["sci fi", "space"]
}
```

In this document, **attributes** are `"id"`, `"title"`, `"description"` and `"type"`.</br>
The **fields** are the combination of attributes and data (i.e. `"title": "Interstellar"`).

## Documents structure

A document is added to MeiliSearch in `JSON format`. Each document should be composed of the fields that has been defined in the [index schema](/main_concept/indexes.md#schema-definition).

::: danger
Documents fields which do not correspond to the schema fields are ignored.
:::

When using the [route to add new documents](/references/documents.html#add-or-update-documents) all documents should be sent in an array. Even if there is only one document.





