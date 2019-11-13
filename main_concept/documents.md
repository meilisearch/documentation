# Documents

Documents are objects composed of fields containing any data, a field is composed of an attribute **and** its associated data.
This object form is used by most of the Meili API endpoints.

::: tip
Documents identifiers are always converted into strings and only strings and integers are valid identifiers.
It means that it is forbidden to use arrays or objects as identifier for example.
:::

```json
{
  "id": 3205,
  "title": "Interstellar",
  "description": "This is a great movie.",
  "type": ["sci fi", "space"]
}
```

In this document example, **attributes** are `"id"`, `"title"`, `"description"` and `"type"`.</br>
The **fields** are the combination of attributes and data (i.e. `"title": "Interstellar"`).

## Schemas

A schema is a representation of the documents attributes.
It is used by Meili to know how to handle documents like which fields to display and which fields to index.

- **Indexed** attributes are used by the search engine.
- **Displayed** attributes will be shown when a document is returned.

::: tip
By default the Meili dashboard infers the schema from the **first** document sent.
:::

::: danger
Documents fields which do not correspond to the schema fields are ignored.
The only mandatory document field is the **identifier**.
:::

If you upload a file via the dashboard the schema is infered this way:
  - the order of the first document fields is the order of the schema fields
  - the identifier is the first field containing "id" (case insensitive)
  - every field is indexed and displayed

::: tip
The order of the schema fields determines the precedence:
a field which is declared before another one is more important.
:::

```json
{
  "id": ["identifier", "indexed", "displayed"],
  "title": ["indexed", "displayed"],
  "description": ["indexed", "displayed"],
  "type": ["indexed", "displayed"]
}
```

In this schema example we can see that every field is indexed and displayed.
This is the typical schema that would be infered by uploading the previous document via the dashboard.

We can also deduct that the "id" attribute is more important than the "title", "description" and "type".
Which means that if you search for something that matches in the "description" of the document _A_ and in the "title" of the document _B_,
the document _B_ will be considered better than the document _A_. You can read more about these rules [in the search section][1].

[1]: /search.md#ranking-rules

