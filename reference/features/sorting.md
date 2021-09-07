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

MeiliSearch allows you to sort results based on document fields. Only fields  containing numbers or strings can be used for sorting.

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
    "genres": ["science fiction"],
    "price": 5.00
  },
  {
    "id": 2,
    "title": "The Parable of the Sower",
    "author": "Octavia E. Butler",
    "genres": ["science fiction"],
    "price": 10.00
  },
  {
    "id": 3,
    "title": "The Dispossessed",
    "author": "Ursula K. Le Guin",
    "genres": ["science fiction", "anarchism"],
    "price": 3.00
  },
  {
    "id": 4,
    "title": "Gender Trouble",
    "author": "Judith Butler",
    "genres": ["feminism", "philosophy"],
    "price": 10.00
  },
  {
    "id": 5,
    "title": "Wild Seed",
    "author": "Octavia E. Butler",
    "genres": ["fantasy"],
    "price": 5.00
  },
  …
]
```

If you are using this dataset in a webshop, you might want to allow your users to sort on `author` and `price`:

<CodeSamples id="sorting_guide_update_sortable_attributes_1" />

### Customize ranking rule order (optional)

When users sort results at search time, [MeiliSearch's ranking rules](/learn/core_concepts/relevancy.md) are set up so the top matches balance following the requested sorting order while still remaining very relevant. You might need to alter this behavior depending on your application's needs.

This is the default configuration of MeiliSearch's ranking rules:

```json
[
  "words",
  "typo",
  "sort",
  "proximity",
  "attribute",
  "exactness"
]
```

`"sort"` is in third place. This means MeiliSearch will first look for results matching all search terms, then results with fewer typos and only after that will take `"sort"` in consideration.

You can use the `rankingRules` index setting to change this order.

Placing the `sort` ranking rule higher in the list will emphasize exhaustive sorting over relevant sorting: your results will more closely follow the sorting order your user chose, but might not be as relevant.

Placing the `sort` ranking rule lower in the list will emphasize relevant sorting over exhaustive sorting: your first results will be more relevant, but they might not follow the desired sorting order as closely.

#### Example

If your users care more about finding the exact book they are searching for than they care about finding cheaper products, you can place `sort` lower in the ranking rules:

<CodeSamples id="sorting_guide_update_ranking_rules_1" />

## Sorting results at search time

After configuring `sortableAttributes`, you can use the [`sort` search parameter](/reference/features/search_parameters.md#sort) to control the sorting order of your search results.

`sort` expects a list of attributes that have been added to the `sortableAttributes` list. The attribute must be followed by a colon (`:`) and the sorting order: either ascending (`asc`) or descending (`desc`):

```json
"sort": [
  "price:asc",
  "author:desc"
]
```

When using the `POST` route, `sort` expects an array of strings. We strongly recommend using `POST` over `GET` routes.

When using the `GET` route, `sort` expects a comma-separated string: `sort="price:desc,author:asc"`.

The order of `sort` values matter: the higher an attribute is in the search parameter value, the more MeiliSearch will prioritize it over attributes placed lower. In our example, if multiple documents have the same value for `price`, MeiliSearch will decide the order between these similarly-priced documents based on their `author`.

#### Example

Suppose you are searching for books in a webshop and want to see the cheapest science fiction titles. This query searches for `"science fiction"` books ordered from cheapest to most expensive:

<CodeSamples id="sorting_guide_sort_parameter_1" />

With our example dataset, the results look like this:

```json
[
  {
    "id": 3,
    "title": "The Dispossessed",
    "author": "Ursula K. Le Guin",
    "genres": ["science fiction", "anarchism"],
    "price": 3.00
  },
  {
    "id": 1,
    "title": "Solaris",
    "author": "Stanislaw Lem",
    "genres": ["science fiction"],
    "price": 5.00
  },
  {
    "id": 2,
    "title": "The Parable of the Sower",
    "author": "Octavia E. Butler",
    "genres": ["science fiction"],
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
    "genres": ["science fiction"],
    "price": 10.00
  },
  {
    "id": 5,
    "title": "Wild Seed",
    "author": "Octavia E. Butler",
    "genres": ["fantasy"],
    "price": 5.00
  },
  {
    "id": 4,
    "title": "Gender Trouble",
    "author": "Judith Butler",
    "genres": ["feminism", "philosophy"],
    "price": 10.00
  },
]
```

## Sorting and custom ranking rules

There is a lot of overlap between sorting and configuring [custom ranking rules](/learn/core_concepts/relevancy.md#custom-rules), as both can greatly influence which results a user will see first.

Sorting is most useful when you want your users to be able to alter the order of returned results at query time. For example, webshop users might want to order results by price depending on what they are searching and to change whether they see the most expensive or the cheapest products first.

Custom ranking rules, instead, establish a default sorting rule that is enforced in every search. This approach can be useful when you want to promote certain results above all others, regardless of a user's preferences. For example, you might want a webshop to always feature discounted products first, no matter what a user is searching for.
