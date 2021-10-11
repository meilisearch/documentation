# Sorting

By default, MeiliSearch focuses on ordering results according to their relevancy. You can alter this sorting behavior so users can decide at search time what type of results they want to see first.

This can be useful in many situations, such as when a user wants to see the cheapest products available in a webshop.

::: tip
Sorting at search time can be particularly effective when combined with [placeholder searches](/learn/what_is_meilisearch/features.md#placeholder-search).
:::

## Configuring MeiliSearch for sorting at search time

To allow your users to sort results at search time you must:

1. Decide which attributes you want to use for sorting
2. Add those attributes to the `sortableAttributes` index setting
3. Update MeiliSearch's [ranking rules](/learn/core_concepts/relevancy.md) (optional)

### Select attributes for sorting

MeiliSearch allows you to sort results based on document fields. Only fields containing numbers, strings, arrays of numeric values, and arrays of string values can be used for sorting.

Currently, fields containing nested arrays and objects will be silently ignored.

::: warning
If a field has values of different types across documents, MeiliSearch will give precedence to numbers over strings. This means documents with numeric field values will be ranked higher than those with string values.

This can lead to unexpected behavior when sorting, so we strongly recommend you only allow sorting at query time on fields containing the same type of value.
:::

### Adding attributes to `sortableAttributes`

After you have decided which fields you will allow your users to sort on, you must add their attributes to the [`sortableAttributes` index setting](/reference/api/sortable_attributes.md).

`sortableAttributes` accepts an array of strings, each corresponding to one attribute. Note that the attribute order in `sortableAttributes` has no impact on sorting.

#### Example

Suppose you have collection of books containing the following fields:

```json
[
  {
    "id": 1,
    "title": "Solaris",
    "author": "Stanislaw Lem",
    "genres": [
      "science fiction"
    ],
    "price": 5.00
  },
  {
    "id": 2,
    "title": "The Parable of the Sower",
    "author": "Octavia E. Butler",
    "genres": [
      "science fiction"
    ],
    "price": 10.00
  },
  {
    "id": 3,
    "title": "Gender Trouble",
    "author": "Judith Butler",
    "genres": [
      "feminism",
      "philosophy"
    ],
    "price": 10.00
  },
  {
    "id": 4,
    "title": "Wild Seed",
    "author": "Octavia E. Butler",
    "genres": [
      "fantasy"
    ],
    "price": 5.00
  },
  …
]
```

If you are using this dataset in a webshop, you might want to allow your users to sort on `author` and `price`:

<CodeSamples id="sorting_guide_update_sortable_attributes_1" />

### Customize ranking rule order (optional)

When users sort results at search time, [MeiliSearch's ranking rules](/learn/core_concepts/relevancy.md) are set up so the top matches emphasize relevant results over sorting order. You might need to alter this behavior depending on your application's needs.

This is the default configuration of MeiliSearch's ranking rules:

```json
[
  "words",
  "typo",
  "proximity",
  "attribute",
  "sort",
  "exactness"
]
```

`"sort"` is in fifth place. This means it acts as a tie-breaker rule: MeiliSearch will first place results closely matching search terms at the top of the returned documents list and only then will apply the `"sort"` parameters as requested by the user. In other words, by default MeiliSearch provides a very relevant sorting.

Placing `"sort"` ranking rule higher in the list will emphasize exhaustive sorting over relevant sorting: your results will more closely follow the sorting order your user chose, but will not be as relevant.

#### Example

If your users care more about finding cheaper books than they care about finding specific matches to their queries, you can place `sort` much higher in the ranking rules:

<CodeSamples id="sorting_guide_update_ranking_rules_1" />

## Sorting results at search time

After configuring `sortableAttributes`, you can use the [`sort` search parameter](/reference/features/search_parameters.md#sort) to control the sorting order of your search results.

### Using `sort`

`sort` expects a list of attributes that have been added to the `sortableAttributes` list.

**Attributes must be given as** `attribute:sorting_order`. In other words, each attribute must be followed by a colon (`:`) and a sorting order: either ascending (`asc`) or descending (`desc`).

When using the `POST` route, `sort` expects an array of strings:

```json
"sort": [
  "price:asc",
  "author:desc"
]
```

When using the `GET` route, `sort` expects a comma-separated string:

```
sort="price:desc,author:asc"
```

We strongly recommend using `POST` over `GET` routes whenever possible.

The order of `sort` values matter: the higher an attribute is in the search parameter value, the more MeiliSearch will prioritize it over attributes placed lower. In our example, if multiple documents have the same value for `price`, MeiliSearch will decide the order between these similarly-priced documents based on their `author`.

#### Example

Suppose you are searching for books in a webshop and want to see the cheapest science fiction titles. This query searches for `"science fiction"` books sorted from cheapest to most expensive:

<CodeSamples id="sorting_guide_sort_parameter_1" />

With our example dataset, the results look like this:

```json
[
  {
    "id": 1,
    "title": "Solaris",
    "author": "Stanislaw Lem",
    "genres": [
      "science fiction"
    ],
    "price": 5.00
  },
  {
    "id": 2,
    "title": "The Parable of the Sower",
    "author": "Octavia E. Butler",
    "genres": [
      "science fiction"
    ],
    "price": 10.00
  }
]
```

It is common to search books based on an author's name. `sort` can help grouping results from the same author. This query would only return books matching the query term `"butler"` and group results according to their  authors:

<CodeSamples id="sorting_guide_sort_parameter_2" />

```json
[
  {
    "id": 2,
    "title": "The Parable of the Sower",
    "author": "Octavia E. Butler",
    "genres": [
      "science fiction"
    ],
    "price": 10.00
  },
  {
    "id": 5,
    "title": "Wild Seed",
    "author": "Octavia E. Butler",
    "genres": [
      "fantasy"
    ],
    "price": 5.00
  },
  {
    "id": 4,
    "title": "Gender Trouble",
    "author": "Judith Butler",
    "genres": [
      "feminism",
      "philosophy"
    ],
    "price": 10.00
  }
]
```

## Sorting and custom ranking rules

There is a lot of overlap between sorting and configuring [custom ranking rules](/learn/core_concepts/relevancy.md#custom-rules), as both can greatly influence which results a user will see first.

Sorting is most useful when you want your users to be able to alter the order of returned results at query time. For example, webshop users might want to order results by price depending on what they are searching and to change whether they see the most expensive or the cheapest products first.

Custom ranking rules, instead, establish a default sorting rule that is enforced in every search. This approach can be useful when you want to promote certain results above all others, regardless of a user's preferences. For example, you might want a webshop to always feature discounted products first, no matter what a user is searching for.

## Sorting with `_geoPoint`

If your documents contain `_geo` data, you can use `_geoPoint` to sort results based on their distance from a geographic position.

`_geoPoint` is a sorting function that requires two floating point numbers indicating a location's latitude and longitude. You must also specify whether the sort should be ascending (`asc`) or descending (`desc`):

```json
{
  "sort": ["_geoPoint(0.0, 0.0):asc"]
}
```

Queries using `_geoPoint` will always include a `geoDistance` field containing the distance in meters between the document location and the `_geoPoint`:

```json
[
  {
    "id": 1,
    "name": "Nàpiz' Milano",
    "_geo": {
      "lat": 45.4777599, 
      "lng": 9.1967508
    },
    "_geoDistance": 1532
  }
]
```

[You can read more about location-based sorting in our geosearch guide.](/reference/features/geosearch.md#sorting-results-with-geopoint)

### Example

The following query will sort results based on how close they are to the Eiffel Tower:

<CodeSamples id="geosearch_guide_sort_usage_1" />
