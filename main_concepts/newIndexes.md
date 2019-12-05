# Indexes

With the notion of index, that can be called table in SQL, we also have the notion of schema.

The creation of an index requires the a schema definition for this index. For the moment no other information than a name and a schema are required for the creation of an index.

## Schema definition

A schema is a correspondence between all fields present in your documents and how these fields will be understood by our database.
We have some tags that should be associated with fields in the schema:

* **identifier**: The unique identifier of a document, must only be set on one field. This field is must be unique between documents.
* **indexed**: Indexed fields feed our search engine.
* **stored**: Displayed fields can be showed during searches. A non-displayed field will never appear in the search response.
* **ranked**: Ranked fields are used to sort documents. <Badge text="soon" type="warn"/>

When no schema is given at the creation of an index the schema is inferred. [Inference follows strict rules to index correctly](/main_concepts/indexes.md#schema-definition).

### Example

Take for example a movie collection. We have several fields:

* **id**: The unique identifier of a movie (tag: identifier).
* **title**: The most important field (tag: indexed). Surely printed on the front (tag: displayed).
* **description**: Give much information about the movie (tag: indexed), perhaps we will show the first line of the description on the front (tag: displayed).
* **release_date**: The release date can be used to sort movies (tag: ranked), but nobody will search precisely the release date of a film. It will be shown on the website (tag: displayed).
* **cover**: The URL of the poster or the image related to the movie. Will be showed on the front (tag: displayed).

::: warning
The order of the document fields has a huge impact on the relevancy. So please order fields from the most important to the less.
You can read more about that on [the documents page](/main_concepts/documents.md).
:::

**This is the schema**:

```json
{
    "id": ["identifier", "indexed", "displayed"],
    "title": ["indexed", "displayed"],
    "description": ["indexed", "displayed"],
    "release_date": ["ranked", "displayed"],
    "cover": ["displayed"]
}
```

## Updates

Since many of the MeiliSearch actions are asynchronous, their route returns an update identifier. This makes it possible to track the progress of the action.

La mise à jour renvoie les informations suivantes :
* **status** : State of the action (enqueued, processed )
* **update_id** : Id of the update
* **update_type** : Information about the action type
* **enqueued_at** : Date at which the action has been added to the queue
* **processed_at**: Date ate which the action has done processing.

### Examples

Adding documents :
```json
{
  "status": "enqueued",
  "update_id": 3,
  "update_type": {
    "name": "DocumentsAddition",
    "number": 19652
  },
  "enqueued_at": "2019-11-13T14:51:22.857056Z"
}
```

Updating a schema :
```json
{
  "status": "processed",
  "update_id": 2,
  "type": {
    "name": "Schema"
  },
  "duration": 0.006275499,
  "enqueued_at": "2019-11-13T14:22:50.162113Z",
  "processed_at": "2019-11-13T14:22:50.169012Z"
}
```
