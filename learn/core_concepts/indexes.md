# Indexes

An index is an entity that gathers a set of documents with its own settings.

It can be comparable to a table in `SQL`, or a collection in MongoDB.

An index is defined by a `uid` and contains the following information:

- One primary key
- Default settings that can be configured as needed: relevancy rules, synonyms, stop words, and field properties.

#### Example

Suppose you manage [a database that contains information about movies](https://imdb.com/). You would probably want to keep multiple types of documents, such as movies, TV shows, actors, directors, and more. Each of these categories would be represented by an index in Meilisearch.

Each index holds information about the fields found in the documents, including how they are handled by Meilisearch and their order of importance. In addition, each has its own set of synonyms, relevancy rules, and stop words. **The settings of one index don't impact other indexes.**

For example, it means you could create on the same server synonyms for a `movie` index and different synonyms for a `costumes` index.

## Index creation

An index is created the first time documents are added to it or manually using the [create index endpoint](/reference/indexes.md#create-an-index).

#### Example

Let's use the [add or replace documents endpoint](/reference/documents.md#add-or-replace-documents) to add documents to a new Meilisearch instance without an index.

We will create an index called `movies`. The code below will create the `movies` index and add a sample document to it.

<CodeSamples id="add_or_replace_documents_1" />

## Index UID

The `uid` is the **unique** identifier of a given index. It is used on every `indexes/:index_uid` route as the `:index_uid` parameter.

The `uid` is set at [index creation time](/reference/indexes.md#create-an-index). Once a `uid` has been defined for an index, you cannot create another index with the same `uid` and the identifier **cannot be changed anymore**.

```json
{
  "uid": "movie",
  "createdAt": "2019-11-20T09:40:33.711324Z",
  "updatedAt": "2019-11-20T10:16:42.761858Z"
}
```

## Primary key

An index is a collection of documents. All documents have a primary key, which is a mandatory field. This field is composed of a primary key attribute name and a unique value. All documents in a given index share the same primary key attribute but a different unique value.

The primary key's attribute name **must** be known by the index. You can [set a primary key for an index or let it be inferred by Meilisearch](/learn/core_concepts/documents.md#setting-the-primary-key).

[Learn more about document primary key](/learn/core_concepts/documents.md#primary-key)

## Relevancy rules

Each index applies its own relevancy rules. All indexes are created with the same built-in ranking rules executed in a default order. Once your first document has been added, the index will record how the attributes must be sorted. Their order of importance will be deduced from their order of appearance in the document.

For example, suppose your first document lists attributes in the following order:

```
id, title, overview, release_date
```

A document containing matches in its `title` field will be considered more relevant than a document only containing matches in  its `overview`.

You can alter the order in which ranking rules take effect, or define custom ranking rules to return certain results first.

[Learn more about ranking rules](/learn/core_concepts/relevancy.md)

## Synonyms

In your dataset, you may decide to create synonyms for words which have the same meaning. To do so, **a set of synonyms can be defined for an index**. Even though they are different, they should be treated similarly. If either of the associated words is searched, the same results shall be displayed.

Since synonyms are linked to a given index, they won't apply to any other index on the same Meilisearch instance.

[Learn more about synonyms](/learn/configuration/synonyms.md)

## Stop words

Sometimes you may want to ignore certain words in documents and search queries. To do so, **a set of stop words can be defined for an index**. Unless you actually need them, some words neither add semantic value nor context. Besides, they are often too frequent (for example, `the` or `of` in English).

Words added to the [stop words list](/reference/stop_words.md) will be ignored during search. In addition to improving relevancy, designating common words as stop words also greatly improves performance.

For example, suppose you want to search for `the great gatsby`. You would prefer to receive documents containing the terms `great gatsby`, rather than documents containing the terms `the great`, or just `the`. In this case, adding `the` to the stop word list would improve performance and make search results more relevant.

[Learn more about stop words](/reference/stop_words.md)

## Field properties

By default, every document field is searchable and returned on search queries.

Fields can have either or both or none of the following properties that can be modified in the [settings](/reference/settings.md):

- **Searchable**: The content of searchable fields is used by Meilisearch to assess the relevancy of a document.
- **Displayed**: Documents returned upon search contain only displayed fields.

By default, each field is stored and this behavior cannot be changed.

[Learn more about field properties](/learn/configuration/displayed_searchable_attributes.md)
