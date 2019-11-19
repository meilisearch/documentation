# Indexes

## Glossary

MeiliSearch uses the following terms inside the documentation. The reader should become familiar with them before continuing.

* **Index** : Like a table in `SQL`. It's the entity that gathers all the documents of a given structure.
* **Schema** : The definition of the index. The `schema` describes the structure of the `document`.
* **Document** : Object containing the defined attributed with their associated data.

No other information than a **name and a schema are required for the [creation of an index](/references/indexes.md#create-an-index)**. The schema can also be inferred if none is given.

## Schema definition

**A schema is a representation of the attributes of the document and how MeiliSearch will handle these fields.**

In the schema definition, each attribute has one or multiple of the following tags :

* **identifier**: The unique identifier of a document (e.g `id`)
* **indexed**: the search engine will search inside those fields.
* **displayed**: Fields that will appear in the returned documents.
* **ranked**: Ranked fields are used to create ranking rules. 

As a result, it is possible to have indexed fields that are not displayed or displayed fields that are not indexed. Depending on your documents and your needs, this could be useful.

### Fields order

The **order of the fields represents their relevance** in the search engine.

Thus, if a `title` field is defined before a `description` field, its content will be considered more relevant to a search query than that of a "description" field.
<!-- <Badge text="soon" type="warn"/> -->

<!-- TODO change doc link -->
::: warning
The order of the document fields has a huge impact on the relevancy. So please order fields from the most important to the less.
You can read more about that on [the documents page](/main_concept/documents.md).
:::

### Example

Take, for example, a movie collection. We have several fields:

* **id**: The unique identifier of a movie.
* **title**: Title of the movie, will be showcased 
* **description**: A description of the movie.
* **release_date**: The release date of the movies.
* **poster**: The URL of the poster or the image related to the movie.

This is the **schema**:

```json
{
    "id": ["identifier", "indexed", "displayed"],
    "title": ["indexed", "displayed"],
    "description": ["indexed", "displayed"],
    "release_date": ["ranked", "displayed"],
    "poster": ["displayed"]
}
```

The fields are [sorted by relevancy importance](/main_concept/indexes.md#fields-order).

The `id` field is the unique identifier of a movie document. We want to display it (*displayed*) and give the possibility to users to search for the movie using his ID (*indexed*).

The `title` field is an important field, which is why it is ranked second in the order of fields. We want 
our search queries to search inside this field (*indexed*), and we also want to showcase it to the user (*displayed*).

The `description` field is exactly like the title field. Its 3rd position in the order of the fields puts it after `Title` in relevancy.

The `release_date` field is not indexed because user does not usually search by date. With the *ranked* tag, we can create a custom ranking rule
that will make the recent movies more relevant than the older ones in the search engine.

Finaly, the `poster` field contains the image URL to the movie's poster. We do not want to search inside the URL, that's why we omitted the `indexed` tag.

When no schema is given at the creation of an index, the schema is inferred. [Inferrence follows strict rules to index correctly](/main_concept/documents.html#schemas).

## Identifier

This tag is given to the attribute that contains the **unique key of each document**. 

If two documents added at the same time have the same ID, MeiliSearch will only save the last one.

If a document is added when there is already a document with the same ID in MeiliSearch, it will be updated.

## Indexed

It defines the fields that will be used to find the documents.

For example, an `url` field is not necessarily interesting for the search engine. So by omitting this tag, the `url` will not be indexed but can still be returned inside the documents with the `displayed` tag.

## Displayed

This defines the fields that will be returned when querying meiliSearch. A non-displayed field will never appear in the search response.

For example, if the field contains a large amount of data, returning it would slow down server returns. By not storing it but still indexing it, the data will be used by the search engine but not returned in the documents.

## Ranked

This tag allows the creation of a custom ranking rule. See [custom ranking rules](/advanced_guides/ranking.md#custom-ranking-rules) for more information.

## Inferred Schema

When creating an index, meiliSearch expects a name for the index and a schema definition. **If no schema is defined before adding documents, the schema will be inferred**.

The inference of the schema is based on the first document added to MeiliSearch. Then, by following the inference rules, the schema will be created.

### Inference rules

To be able to infer a schema based on your first document MeiliSearch will look for **an identifier** and **the order of the fields** inside the document.

To determine the identifier, an attribute that contains the case insensitive string `id` is expected. Thus, `_id`, `myId`, for example, are correct keys. 

This field will receieve the [identifier](/main_concept/indexes.md#identifier) tag, so it should contain the unique identifier of a document.
If **the `identifier` field is missing**, the inference will not be completed, and the **documents will not be added**.


The order of the fields inside the document will [determine their relevance in the search engine](/main_concept/indexes.md#fields-order). 

