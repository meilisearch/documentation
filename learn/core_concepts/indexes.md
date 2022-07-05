# Indexes

An index is a group of documents with associated settings. It is comparable to a table in `SQL` or a collection in MongoDB.

An index is defined by a `uid` and contains the following information:

- One [primary key](#primary-key)
- Customizable [settings](#index-settings)
- An arbitrary number of documents

#### Example

Suppose you manage a database that contains information about movies, similar to [IMDb](https://imdb.com/). You would probably want to keep multiple types of documents, such as movies, TV shows, actors, directors, and more. Each of these categories would be represented by an index in Meilisearch.

Using an index's settings, you can customize search behavior for that index. For example, a `movies` index might contain documents with fields like `movie_id`, `title`, `genre`, `overview`, and `release_date`. Using settings, you could make a movie's `title` have a bigger impact on search results than its `overview`, or make the `movie_id` field non-searchable.

One index's settings do not impact other indexes. For example, you could use a different list of synonyms for your `movies` index than for your `costumes` index, even if they're on the same server.

## Index creation

Meilisearch automatically creates an index the first time you add a document. You can also create one manually using the [create index endpoint](/reference/api/indexes.md#create-an-index).

## Index UID

The `uid` is the **unique identifier** of an index. It is set when creating the index and must be an integer or string containing only alphanumeric characters `a-z A-Z 0-9`, hyphens `-` and underscores `_`.

**Once defined, the `uid` cannot be changed**, and you cannot create another index with the same `uid`.

```json
{
  "uid": "movies",
  "name": "movies",
  "createdAt": "2019-11-20T09:40:33.711324Z",
  "updatedAt": "2019-11-20T10:16:42.761858Z"
}
```

## Primary key

Every index has a primary key: a required attribute that must be present in all documents in the index. Each document must have a unique value associated with this attribute.

The primary key serves to identify each document, such that two documents in an index can never be completely identical. If you add two documents with the same value for the primary key, they will be treated as the same document: one will overwrite the other. If you try adding documents, and even a single one is missing the primary key, none of the documents will be stored.

You can set the primary key for an index or let it be inferred by Meilisearch. Read more about [setting the primary key](/learn/core_concepts/primary_key.md#setting-the-primary-key).

[Learn more about the primary field](/learn/core_concepts/primary_key.md)

## Index settings

Index settings can be thought of as a JSON object containing many different options for customizing search behavior.

You can customize the following index settings:

- [Ranking rules](#ranking-rules)
- [Distinct attribute](#distinct-attribute)
- [Synonyms](#synonyms)
- [Filterable attributes](#filterable-attributes)
- [Sortable attributes](#sortable-attributes)
- [Stop words](#stop-words)
- [Displayed and searchable attributes](#displayed-and-searchable-attributes)
- [Typo tolerance](#typo-tolerance)
- [Pagination](#pagination)

To change index settings, use the [update settings endpoint](/reference/api/settings.md#update-settings) or any of the [child routes](/reference/api/settings.md#all-settings).

### Ranking rules

Meilisearch uses ranking rules to sort matching documents so that the most relevant documents appear at the top. All indexes are created with the same built-in ranking rules executed in default order. The order of these rules matters: the first rule has the most impact, and the last rule has the least.

You can alter this order or define custom ranking rules to return certain results first. This can be done using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update ranking rules endpoint](/reference/api/ranking_rules.md#update-ranking-rules).

[Learn more about ranking rules](/learn/core_concepts/relevancy.md)

### Distinct attribute

If your dataset contains multiple similar documents, you may want to return only one on search. Suppose you have numerous black jackets in different sizes in your `costumes` index; setting `costume_name` as the distinct attribute will mean Meiliserch will not return more than one black jacket with the same `costume_name`.

Designate the distinct attribute using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update distinct attribute endpoint](/reference/api/distinct_attribute.md#update-distinct-attribute). **You can only set one field as the distinct attribute per index.**

[Learn more about distinct attribute](/learn/configuration/distinct.md)

### Synonyms

Your dataset may contain words with similar meanings. For these, you can define a list of synonyms: words that will be treated as the same or similar for search purposes.

Since synonyms are defined for a given index, they won't apply to any other index on the same Meilisearch instance. You can create your list of synonyms using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update synonyms endpoint](/reference/api/synonyms.md#update-synonyms).

[Learn more about synonyms](/learn/configuration/synonyms.md)

### Filterable attributes

Filtering allows you to refine your search based on different categories. For example, you could search for all movies of a certain `genre`, e.g., `Science Fiction`, with a `rating` above `8`.

Before filtering on any document attribute, you must add it to `filterableAttributes` using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update filterable attributes endpoint](/reference/api/filterable_attributes.md#update-filterable-attributes). Then, make a search query using the [`filter` search parameter](/reference/api/search.md#filter).

[Learn more about filtering](/learn/advanced/filtering_and_faceted_search.md)

### Sortable attributes

By default, Meilisearch orders results according to their relevancy. You can alter this sorting behavior to show certain results first.

Add the attributes you'd like to sort by to `sortableAttributes` using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update sortable attributes endpoint](/reference/api/sortable_attributes.md#update-sortable-attributes). You can then use the [`sort` search parameter](/reference/api/search.md#sort) to sort your results in ascending or descending order.

[Learn more about sorting](/learn/advanced/sorting.md)

### Stop words

Your dataset may contain words you want to ignore during search because, for example, they don't add semantic value or occur too frequently (e.g., `the` or `of` in English). You can add these words to the [stop words list](/reference/api/stop_words.md) and Meilisearch will ignore them during search.

Change your index's stop words list using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update stop words endpoint](/reference/api/stop_words.md#update-stop-words). In addition to improving relevancy, designating common words as stop words greatly improves performance.

[Learn more about stop words](/reference/api/stop_words.md)

### Displayed and searchable attributes

By default, every document field is searchable and displayed in response to search queries. However, you can choose to set some fields as non-searchable, non-displayed, or both.

You can update these field attributes using the [update settings endpoint](/reference/api/settings.md#update-settings), or the respective endpoints for [displayed attributes](/reference/api/displayed_attributes.md#update-displayed-attributes) and [searchable attributes](/reference/api/searchable_attributes.md#update-searchable-attributes).

[Learn more about displayed and searchable attributes](/learn/configuration/displayed_searchable_attributes.md)

### Typo tolerance

Typo tolerance is a built-in feature that helps you find relevant results even when your search queries contain spelling mistakes or typos, e.g., typing `chickne` instead of `chicken`. This setting allows you to do the following for your index:

- Enable or disable typo tolerance
- Configure the minimum word size for typos
- Disable typos on specific words
- Disable typos on specific document attributes

You can update the typo tolerance settings using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update typo tolerance endpoint](/reference/api/typo_tolerance.md#update-typo-tolerance).

[Learn more about typo tolerance](/learn/configuration/typo_tolerance.md)

### Pagination

To protect your database from malicious scraping, Meilisearch only returns up to `1000` results for a search query. You can change this limit using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update pagination settings endpoint](/reference/api/pagination.md#update-pagination-settings).

[Learn more about pagination](/learn/advanced/pagination.md)
