# Indexes

An index is an entity that gathers a set of documents with its own settings. It is comparable to a table in `SQL` or a collection in MongoDB.

An index is defined by a `uid` and contains the following information:

- One [primary key](#primary-key)
- Customizable [settings](index-settings)
- Some number of documents

#### Example

Suppose you manage a database that contains information about movies, similar to [IMDb](https://imdb.com/). You would probably want to keep multiple types of documents, such as movies, TV shows, actors, directors, and more. Each of these categories would be represented by an index in Meilisearch.

Each index holds information about the fields found in the documents, you would have fields like `movie_id`, `title`, `genre`, `overview`, `release_date`, etc., for a `movies` index. Some of these fields will be more important than others, e.g., `title` would be more meaningful to a movie search than `overview` or `release_date`. You might want exact matches for `movie_id` or `genre` but not for `release_date`. All of this is controlled by an index's settings. The settings of one index don't impact other indexes, meaning you can create different synonyms for a `movies` and `costumes` index on the same server.

## Index creation

Meilisearch automatically creates an index for you the first time you add a document. You can also create one manually using the [create index endpoint](/reference/api/indexes.md#create-an-index).

## Index UID

The `uid` is the **unique identifier** of a given index. It is set at index creation time and must be an integer or a string containing only alphanumeric characters `a-z A-Z 0-9`, hyphens `-` and underscores `_`.

**Once defined, the `uid` cannot be changed anymore**, and you cannot create another index with the same `uid`.

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

## Index settings

Index settings can be thought of as a JSON object containing different options for customizing search behavior.

Meilisearch allows you to customize the following index settings:

- Ranking rules
- Synonyms
- Filterable attributes
- Sortable attributes
- Stop words
- Displayed and searchable attributes
- Typo tolerance

These settings are what differentiate between indexes even if they have the same documents. You can make these changes using the [settings route](/reference/api/settings.md) or the [dedicated settings child route](/reference/api/settings.md#all-settings).

### Ranking rules

Each index applies its own relevancy rules. All indexes are created with the same built-in ranking rules executed in default order. Once your first document has been added, the index will record how the attributes must be sorted. Their order of importance is based on their order of appearance in the document.

Suppose your first document lists attributes in the following order:

```
id, title, overview, release_date
```

A document containing matches in its `title` field will be considered more relevant than a document only containing matches in its `overview`.

You can alter the order in which ranking rules take effect or define custom ranking rules to return certain results first. This can be done using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update ranking rules endpoint](/reference/api/ranking_rules.md#update-ranking-rules).

[Learn more about ranking rules](/learn/core_concepts/relevancy.md)

### Synonyms

Your dataset may contain words with similar meanings. For these, you can define a list of synonyms: words that will be treated as the same or similar for search purposes.

Since synonyms are defined for a given index, they won't apply to any other index on the same Meilisearch instance. You can create your list of synonyms using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update synonyms endpoint](/reference/api/synonyms.md#update-synonyms).

[Learn more about synonyms](/learn/configuration/synonyms.md)

### Filterable attributes

Filtering allows you to refine your search based on different categories, in our case, document attributes; these can include a movie genre, a price range, or location. To filter by any document attribute, you need to add it to `filterableAttributes` using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update filterable attributes endpoint](/reference/api/filterable_attributes.md#update-filterable-attributes).

Adding an attribute to `filterableAttributes` will not impact search. You need it to use the [`filter` search parameter](/reference/api/search.md#filter) to refine your results.

[Learn more about filtering](/learn/advanced/filtering_and_faceted_search.md)

### Sortable attributes

By default, Meilisearch orders results according to their relevancy. You can alter this sorting behavior to show certain results first by adding attributes to the `sortableAttributes` array using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update sortable attributes endpoint](/reference/api/sortable_attributes.md#update-sortable-attributes). You can then use the [`sort` search parameter](/reference/api/search.md#sort) to sort your results in ascending or descending oder.

[Learn more about sorting](/learn/advanced/sorting.md)

### Stop words

Your dataset may contain words you want to ignore during search. These may include words that don't add semantic value or context or are too frequent (e.g., `the` or `of` in English). You can add such words to the [stop words list](/reference/api/stop_words.md) and Meilisearch will ignore them during search. In addition to improving relevancy, designating common words as stop words also greatly improves performance.

You can create your list of stop words for your index using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update stop words endpoint](/reference/api/stop_words.md#update-stop-words).

[Learn more about stop words](/reference/api/stop_words.md)

### Displayed and searchable attributes

By default, every document field is searchable and displayed in response to search queries. However, you can choose to set some fields as non-searchable, non-displayed, or both.

You can update these field attributes using the [update settings endpoint](/reference/api/settings.md#update-settings), or the respective update endpoints for [displayed attributes](/reference/api/displayed_attributes.md#update-displayed-attributes), and [searchable attributes](/reference/api/searchable_attributes.md#update-searchable-attributes).

[Learn more about displayed and searchable attributes](/learn/configuration/displayed_searchable_attributes.md)

### Typo tolerance

Typo tolerance is a built-in feature that helps you find relevant results even when your search queries contain spelling mistakes or typos, e.g., typing `chickne` instead of `chicken`. The setting allows you to configure the following for an index:

- Enable or disable typo tolerance
- Configure the minimum word size for typos
- Disable typos on specific words
- Disable typos on specific document attributes

You can update the typo tolerance settings for an index using the [update settings endpoint](/reference/api/settings.md#update-settings) or the [update typo tolerance endpoint](/reference/api/typo_tolerance.md#update-typo-tolerance).

[Learn more about typo tolerance](/learn/configuration/typo_tolerance.md)
