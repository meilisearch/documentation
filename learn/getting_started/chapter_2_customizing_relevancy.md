# Chapter 2: Fine-tuning search results

Meilisearch is designed to offer a great search experience out of the box, but sometimes you need to customize it to better fit your needs. You can alter the search behavior for each index using the `settings` object.

For this chapter, we will be using a collection of movies as our dataset.

If you have already downloaded the dataset and created the `movies` index, you can skip to [the next section](#ranking-rules).

To follow along, first click this link to download the file: <a id="downloadMovie" href="/movies.json" download="movies.json">movies.json</a>. Then, move it into your working directory and run the following command:

<CodeSamples id="getting_started_add_documents_md" />

## Ranking rules

Meilisearch sorts search responses based on an array of strings called `rankingRules`, which is part of the `settings` object.

The order of the `rankingRules` array matters: the first rule has the most impact and the last rule has the least. This is the default order:

```
"rankingRules": [
  "words",
  "typo",
  "proximity",
  "attribute",
  "sort",
  "exactness",
]
```

You can read more about each ranking rule and what it does in our [dedicated guide](/learn/core_concepts/relevancy.md#built-in-rules).

In this example, we change the order of the ranking rules for the `meteors` index by moving `exactness` to the top:

<CodeSamples id= "getting_started_update_rankingRules_md" />

You can read more about ranking rules in our [dedicated guide](/learn/core_concepts/relevancy.md).

## Displayed attributes

By default, all attributes are displayed in search results but the `displayedAttributes` array in the `settings` object allows you to change that.

If you only want to display the `title`, `poster`, and `overview` for the `movies` index:

<CodeSamples id= "getting_started_update_displayedAttributes_md" />

You can read more about displayed attributes in our [dedicated guide](/reference/features/field_properties.md#displayed-fields).

## Distinct attribute

If you have many documents that are almost identical, you may wish to only return one of them per search. `distinctAttribute` is a tool in the `settings` object that allows you to do just that.

When you set one of your attributes as the `distinctAttribute`, Meilisearch will not return more than one document with the same value associated to that attribute.

Suppose you have an e-commerce dataset with an index on jackets. There are several identical items with minor variations in color.

```json
[
  {
    "id": 1,
    "description": "Leather jacket",
    "brand": "Lee jeans",
    "color": "brown",
    "product_id": "123456"
  },
  {
    "id": 2,
    "description": "Leather jacket",
    "brand": "Lee jeans",
    "color": "black",
    "product_id": "123456"
  },
  {
    "id": 3,
    "description": "Leather jacket",
    "brand": "Lee jeans",
    "color": "blue",
    "product_id": "123456"
  }
]
```

If you searched for `lee leather jacket` with the default settings, you would get all three documents. But if you set `product_id` as the `distinctAttribute`, Meilisearch will only return one of those jackets.

You can read more about displayed attributes in our [dedicated guide](/reference/features/distinct.md).

## Searchable attributes

[Documents](/learn/core_concepts/documents.md) in Meilisearch are composed of multiple fields. By default, Meilisearch looks for matches in every field, but the `searchableAttributes` array in the `settings` object allows you to change that.

For example, if you search the `movies` index for `2012`, Meilisearch searches for `2012` in every field: the `title`, `overview`, `release_year`, etc.. If you just want to search in the `title` field:

<CodeSamples id= "getting_started_update_searchableAttributes_md" />

Meilisearch will now only consider `title` during search and you will see fewer results.

::: note

Meilisearch will still highlight matches in other fields, but they won’t be used to compute results.

:::

### The order of `searchableAttributes`

The order of the `searchableAttributes` array corresponds to the order of importance of the attributes.

```json
  [
    "overview",
    "title", 
  ]
```

With the above order, matching words found in the `overview` field will have a higher impact on relevancy than the same words found in `title`. You can read more about this in our [relevancy guide](/learn/core_concepts/relevancy.md#attribute-ranking-order).

## Stop words

Meilisearch allows you to ignore certain words in your search queries by adding them to the `stopWords` array. A good example is the word `the` in English.

<CodeSamples id= "getting_started_update_stop_words_md" />

If you search for `the cat` after running the above command, Meilisearch will consider your search query to be `cat`, improving the speed and relevancy of your search.

You can read more about stop words in the [API reference](/reference/features/stop_words.md).

## Synonyms

The `synonyms` array lets you associate certain words in your dataset, making your search more relevant.

<CodeSamples id= "getting_started_synonyms_md" />

This will set `winnie` and `piglet` as synonyms; searching for either word will show the same results.

You can read more about it in our [dedicated guide](/reference/features/synonyms.md).
