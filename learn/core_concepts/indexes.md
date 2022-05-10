# Indexes

An index is an entity that gathers a set of documents with its own settings. It can be comparable to a table in `SQL` or a collection in MongoDB.

An index is defined by a `uid` and contains the following information:

- One primary key
- Default settings that can be [configured](/reference/api/settings.md#update-settings) as needed: relevancy rules, filterable and sortable attributes, synonyms, stop words, displayed and searchable attributes, typo tolerance.

#### Example

Suppose you manage [a database that contains information about movies](https://imdb.com/). You would probably want to keep multiple types of documents, such as movies, TV shows, actors, directors, and more. Each of these categories would be represented by an index in Meilisearch.

Each index holds information about the fields found in the documents, including how they are handled by Meilisearch and their order of importance. In addition, each has its own set of synonyms, relevancy rules, and stop words. **The settings of one index don't impact other indexes**, meaning you can create different synonyms for a `movies` and `costumes` index on the same server.

## Index creation

An index is created the first time documents are added to it or manually using the [create index endpoint](/reference/api/indexes.md#create-an-index).

#### Example

Let's use the [add or replace documents endpoint](/reference/api/documents.md#add-or-replace-documents) to add documents to a new Meilisearch instance without an index. The code below will create the `movies` index and add a sample document to it.

<CodeSamples id="add_or_replace_documents_1" />

## Index UID

The `uid` is the **unique** identifier of a given index. It is set at [index creation time](/reference/api/indexes.md#create-an-index) and must be an integer or a string containing only alphanumeric characters `a-z A-Z 0-9`, hyphens `-` and underscores `_`. Once defined, the `uid` **cannot be changed anymore**, and you cannot create another index with the same `uid`.

It is used on every `indexes/{index_uid}` route as the `{index_uid}` parameter.

```json
{
  "uid": "movies",
  "name": "movies",
  "createdAt": "2019-11-20T09:40:33.711324Z",
  "updatedAt": "2019-11-20T10:16:42.761858Z"
}
```

## Primary key

An index is a collection of documents. All documents have a primary key, which is a mandatory field. This field is composed of a primary key attribute name and a unique value. All documents in a given index share the same primary key attribute but a different unique value.

The primary key's attribute name **must** be known by the index. You can [set a primary key for an index or let it be inferred by Meilisearch](/learn/core_concepts/primary_key.md#setting-the-primary-key).

[Learn more about document primary key](/learn/core_concepts/primary_key.md#primary-key-2)

## Relevancy rules

Each index applies its own relevancy rules. All indexes are created with the same built-in ranking rules executed in default order. Once your first document has been added, the index will record how the attributes must be sorted. Their order of importance is based on their order of appearance in the document.

Suppose your first document lists attributes in the following order:

```
id, title, overview, release_date
```

A document containing matches in its `title` field will be considered more relevant than a document only containing matches in its `overview`.

You can alter the order in which ranking rules take effect or define custom ranking rules to return certain results first. This can be done using the [update settings endpoint](reference/api/settings.md#update-settings) or the [update ranking rules endpoint](/reference/api/ranking_rules.md#update-ranking-rules).

[Learn more about ranking rules](/learn/core_concepts/relevancy.md)

## Synonyms

You can create a list of synonyms for words with the same meaning in your index. Even though they are different, they should be treated similarly. If either of the associated words is searched, the same results shall be displayed.

Since synonyms are defined for a given index, they won't apply to any other index on the same Meilisearch instance. You can create your list of synonyms using the [update settings endpoint](reference/api/settings.md#update-settings) or the [update synonyms endpoint](/reference/api/synonyms.md#update-synonyms).

[Learn more about synonyms](/learn/configuration/synonyms.md)

## Filterable attributes

To filter by any document attribute, you need to add it to `filterableAttributes` using the using the [update settings endpoint](reference/api/settings.md#update-settings) or the [update filterable attributes endpoint](/reference/api/filterable_attributes.md#update-filterable-attributes). You can then use the [`filter` search parameter](/reference/api/search.md#filter) to refine your results.

The code sample below will only show you meteorites that weigh less than 200g:

<CodeSamples id="getting_started_filtering" />

[Learn more about filtering](/learn/advanced/filtering_and_faceted_search.md)

## Sortable attributes

By default, Meilisearch orders results according to their relevancy. You can alter this sorting behavior to show certain results first by adding attributes to the `sortableAttributes` array using the [update settings endpoint](reference/api/settings.md#update-settings) or the [update sortable attributes endpoint](/reference/api/sortable_attributes.md#update-sortable-attributes). You can then use the [`sort` search parameter](/reference/api/search.md#sort) to sort your results in ascending or descending oder.

The code sample below will only show you meteorites that weigh less than 200g sorted by increasing mass:

<CodeSamples id="getting_started_sorting" />

[Learn more about sorting](/learn/advanced/sorting.md)

## Stop words

Sometimes you may want to ignore certain words in documents and search queries. You can do that by defining a list of stop words for your index using the [update settings endpoint](reference/api/settings.md#update-settings) or the [update stop words endpoint](/reference/api/stop_words.md#update-stop-words). 

Unless you actually need them, some words neither add semantic value nor context. Besides, they are often too frequent (for example, `the` or `of` in English). Words added to the [stop words list](/reference/api/stop_words.md) will be ignored during search. In addition to improving relevancy, designating common words as stop words also greatly improves performance.

Suppose you want to search for `the great gatsby`. You would prefer to receive documents containing the terms `great gatsby`, rather than documents containing the terms `the great`, or just `the`. In this case, adding `the` to the stop word list would improve performance and make search results more relevant.

[Learn more about stop words](/reference/api/stop_words.md)

## Displayed and searchable attributes

By default, every document field is searchable and returned on search queries.

Fields can have either or both or none of the following properties:

- **Searchable**: Field attributes searched for matching query words. Meilisearch also uses the content of searchable fields to assess the relevancy of a document
- **Displayed**: Field attributes returned upon search

You can update these field attributes using the [update settings endpoint](reference/api/settings.md#update-settings), or the respective update endpoints for [displayed attributes](/reference/api/displayed_attributes.md#update-displayed-attributes), and [searchable attributes](/reference/api/searchable_attributes.md#update-searchable-attributes).

[Learn more about displayed and searchable attributes](/learn/configuration/displayed_searchable_attributes.md)

## Typo tolerance

By default, typo tolerance is enabled in Meilisearch. This allows you to find relevant results even when your search queries contain spelling mistakes or typos, e.g. typing `chickne` instead of `chicken`. You can update the typo tolerance settings for an index using the [update settings endpoint](reference/api/settings.md#update-settings) or the [update typo tolerance endpoint](/reference/api/typo_tolerance.md#update-typo-tolerance).

The `typoTolerance` object allows you configure the following for an index:

- Enable or disable the typo tolerance feature with the `enabled` field
- Configure the minimum word size for typos to be handled with `minWordSizeForTypos`
- Disable typos on specific words with `disableOnWords`
- Disable typos on specific document attributes with `disableOnAttributes`

[Learn more about typo tolerance](/learn/configuration/typo_tolerance.md)
