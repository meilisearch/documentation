# Indexes

An index is an entity, like a table in `SQL`, or a collection in `mongoDb`, that collects a set of documents.

A index is defined by an `uid` and is composed of the following:
- One document identifier
- A set of relevancy rules (based on presets and customization)
- Synonyms, stop-words, and other customizable addons
- Rules for each field of a document

#### Example
An index will typically be the collection of a certain type of data. For example a `movie` index with documents containing each information about a movie. On the same server you could have another index containing all the movie reviews, where each document contains information about a review.

Each of the index will have the information about the fields found in the documents. What should be done with each field, and their order of importance. Different synonyms, relevancy rules, stop-words, could be set on both indexes based on the context.

## Index UID and name

The `uid` of an index is its **unique** identifier. It is the `:uid` parameter on every `indexes/:uid` route.

The uid is set on [index creation](/references/indexes.md#create-an-index). After which you cannot create another index with the same `uid`.


```json
{
    "uid": "movie",
    "createdAt": "2019-11-20T09:40:33.711324Z",
    "updatedAt": "2019-11-20T10:16:42.761858Z"
  }
```

## Document identifier

The document identifier is a
<tooltip text="field">A field is composed of an **attribute** and its associated data. <br><br> Ex: `attribute: 'data'` <br><br> The collection of fields is a document.
</tooltip>in a document. This field is composed of an identifier <tooltip text="attribute">The key associated to some data in a field  <br><br> Ex:  `title: 'batman'` <br> title is the attribute in this example.</tooltip> name and it's unique value. All documents in a given index have the same identifier [attribute](#) with each an unique value. The identifier's attribute name **must** be know by the index. There are [multiple ways to set your identifier](#).





[More information about the document identifier](#)
