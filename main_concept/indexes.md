# Indexes

With the notion of index, that can be called table in SQL, we also have the notion of schema.

A schema is a correspondence between all fields present in your documents and how these fields will be understood by our database.
We have some tags that should be associated with fields in the schema:

* **identifier**: The unique identifier of a document, must only be set on one field. This field is must be unique between documents.
* **indexed**: Indexed fields feed our search engine.
* **stored**: Displayed fields can be showed during searches. A non-displayed field will never appear in the search response.
* **ranked**: Ranked fields are used to sort documents. <Badge text="soon" type="warn"/>

Take for example a movie collection. We have several fields:

* **id**: The unique identifier of a movie (tag: identifier).
* **title**: The most important field (tag: indexed). Surely printed on the front (tag: displayed).
* **description**: Give much information about the movie (tag: indexed), perhaps we will show the first line of the description on the front (tag: displayed).
* **release_date**: The release date can be used to sort movies (tag: ranked), but nobody will search precisely the release date of a film. It will be shown on the website (tag: displayed).
* **cover**: The URL of the poster or the image related to the movie. Will be showed on the front (tag: displayed).

::: warning
The order of the document fields has a huge impact on the relevancy. So please order fields from the most important to the less.
You can read more about that on [the documents page](/documents.md).
:::

Our schema will be:

```json
{
    "id": ["identifier", "indexed", "displayed"],
    "title": ["indexed", "displayed"],
    "description": ["indexed", "displayed"],
    "release_date": ["ranked", "displayed"],
    "cover": ["displayed"]
}
```
