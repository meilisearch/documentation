# Sorting

Though MeiliSearch focuses in ordering results according to how relevant they are, we also make it easy for you to alter sorting behavior at search time. This can be useful in several contexts, like when a user may want to see the cheapest products in an eshop.

Sorting can be particularly effective when combined with [placeholder searches](/learn/what_is_meilisearch/features.md#placeholder-search).

## Configuring sort

To sort results at search time, there are three main steps to follow:

1. Decide which attributes you want to use for sorting
2. Add those attributes to the `sortableAttributes` index setting
3. Update ranking rules (optional)

#### Example

[one example putting everything together]

### Select attributes

MeiliSearch allows you to sort results based on document fields. Only fields  containing either numbers or strings can be used for sorting.

::: warning
If a sortable attribute has values of different types across documents, MeiliSearch will give precedence to numbers over strings. This can lead to unexpected behavior when sorting, so we recommend you only use sort with whose values will always be of the same type. 
:::

### Adding attributes to `sortableAttributes`

After you have decided which fields you will allow your users to sort on, you must add their attributes to the `sortableAttributes` index setting.

`sortableAttributes` accepts an array of strings, each corresponding to one attribute. Note that the attribute order in `sortableAttributes` has no impact on sorting. Which attribute takes precedence is determined at search time.

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
  …
]
```

If you are using this dataset in a webshop, you might want to allow your users to sort on book author name and price:

```sh
curl \
  -X POST 'http://localhost:7700/indexes/books/settings' \
  --data '{
      "sortableAttributes": [
          "author",
          "price"
      ]
  }'
```

#### Customize ranking rule order

This is an optional step. 

MeiliSearch tries to balance its ranking rules so the top results are both relevant and follow the sorting order requested with the `sort` search parameter. This is the default configuration of MeiliSearch's ranking rules:

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

You can use the `rankingRules` index setting to alter this order. 

Placing the `sort` ranking rule higher in the list will cause results to emphasize sorting over relevancy: your results will more closely follow the sorting order you configured, but might not be as relevant.

Placing the `sort` ranking rule lower in the list will cause results to emphasize relevancy over sorting: your first results will be more relevant, but not follow the desired sorting order as closely.

##### Example

If your users care more about finding the correct book than they care about finding cheaper products, you can place `sort` lower in the ranking rules:

```sh
curl \
  -X POST 'http://localhost:7700/indexes/books/settings/ranking-rules' \
  --data '[
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness"
]'
```

## Sorting results

After configuring `sortableAttributes`, you can use the `sort` search parameter to control the sorting order of your search results.

`sort` expects a list of attributes that have been added to the `sortableAttributes` list. The attribute must be followed by a colon (`:`) and the sorting order: either ascending (`asc`) or descending (`desc`).

When using the `POST` route, `sort` expects an array of strings. We strongly recommend using `POST` over `GET` routes.

When using the `GET` route, `sort` expects a comma-separated string: `sort="price:desc,author:asc"`.

#### Example

Suppose you are searching for books in a webshop and want to see the cheapest science fiction titles:

```sh
curl \
  -X POST 'http://localhost:7700/indexes/books/search' \
  --data '{
    "q": "science fiction",
    "sort": [
      "price:asc"
    ]
  }'
```

This query would make sure you only retrieved science fiction books ordered from cheapest to most expensive:

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

It is common to search books based on an author's name. When an author has a common surname, `sort` can help bringing the author you think you want to the top of the list:

```sh
curl \
  -X POST 'http://localhost:7700/indexes/books/search' \
  --data '{
    "q": "butler",
    "sort": [
      "author:desc"
    ]
  }'
```

This query would only return documents matching the query term `"butler"` and ensure author `"Octavia E. Butler"` is displayed before `"Judith Butler"`:

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
    "id": 4,
    "title": "Gender Trouble",
    "author": "Judith Butler",
    "genres": ["feminism", "philosophy"],
    "price": 10.00
  },
]
```

## Sorting and custom ranking rules

There is a lot of overlap between sorting and configuring custom ranking rules.

Sorting is most useful when you want your users to be able to alter the order of returned results at query time. For example, webshop users might want to be able to order results by price when searching for certain products, but not when searching for others.

Custom ranking rules, instead, establish a default sorting rule that is enforced in every search. This approach can be useful when you want to promote certain results above all others, since a user will have no control over the custom ranking rule. For example, you might want MeiliSearch to always feature discounted products, no matter what a user is searching for.