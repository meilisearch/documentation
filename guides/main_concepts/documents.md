# Documents

Documents are objects composed of fields containing any data.</br>
A `field` is composed of an `attribute` and its associated data.

```json
{
  "id": 3205,
  "title": "Interstellar",
  "description": "This is a great movie.",
  "type": ["sci fi", "space"]
}
```

#### Wording
In the above document, **attributes** are `"id"`, `"title"`, `"description"` and `"type"`.</br>
The **fields** are the combination of attributes and data (i.e, `"title": "Interstellar"`).

## Documents structure

A **document must contain** [one identifier field](/guides/main_concepts/documents.md#documents-identifiers) to be indexed in MeiliSearch.

A document is added to MeiliSearch in `JSON format`.<br/>

When using the [route to add new documents](/references/documents.md#add-or-update-documents), all documents should be sent in an array. And this, even if there is only one document.

## Documents identifiers

To be indexed by MeiliSearch, a document must have an **identifier**. A document without an identifier will be ignored by MeiliSearch.

### Identifier name

The **attribute name** of the identifier must contain the string `id` case insensitively.
#### Examples
Good : `id`, `Id`, `123kjl12iD`, `uuid`

Bad : `ihd`, `iuud`



### Identifier value

The identifier **value** may contain only `A-Z a-z 0-0` and `-_` characters.
#### Examples
Good :
```
"id" : "_Aabc012_"
```
Bad :
```
"id" : "@BI+* ^5h2%"
```
::: warning
if no good identifier field is found, the document will be ignored by MeiliSearch.
:::
