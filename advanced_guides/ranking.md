# Ranking

MeiliSearch uses ranking rules. We talk about one `criterion` (singular) and many `criteria` (plural). They are used in the [bucket sort](/advanced_guides/bucket_sort)

## Ranking rules

MeiliSearch has default `criteria`.

Here is the list of all the `criteria` that are executed in this specific order by default:

- `_typo`: The less typos there are beween the query words and the document words, the better is the document.
- `_words` - A document containing more of the query words will be more important than one that contains less.
- `_proximity` - The closer the query words are in the document the better is the document.
- `_attribute` - A document containing the query words in a more important attribute than another document is considered better.
- `_words_position` - A document containing the query words at the start of an attribute is considered better than a document that contains them at the end.
- `_exact` - A document containing the query words in their exact form, not only a prefix of them, is considered better.


## Custom ranking rules

Custom ranking rules gives you the possibility to add new rules. New rules can be added on attributes that has the `ranked` tag in the [schema](/main_concepts/indexes.md#ranked).

A rule is defined by an **attribute** and a **ascendent** `asc` or **descendent** `dsc` property.

The name of the ranking rule is the name of the attribute on which the rule is made.

For those rules to be applied by MeiliSearch on your search queries, it must be added to the [ranking order](/advanced_guides/ranking.md#ranking-order).

::: warning
If the rule is not added to the rule ranking order, it will be **ignored** by MeiliSearch.
:::

### Example

On the `release_date` attribute of a movie data set, which contains the timestamp of the release date.
```bash
 curl -X POST 'http://localhost:7700/indexes/movies/settings'
  --data '{ "rankingRules": { "release_date": "dsc" } }'
```

We create a custom ranking rule that must have the attribute name as key: `release_date` and we ask it to be `dsc` which means *descending*.

Now if added to the ranking order documents will be ordered by descending release_date.

## Ranking order

The ranking order determine the order of each rule in the [bucket sort](/advanced_guides/bucket_sort).

The default ranking order is as follows ([*see above for more detail about each rule*](/advanced_guides/ranking.md#ranking-rules)):

- `_typo`
- `_words`
- `_proximity`
- `_attribute`
- `_words_position`
- `_exact`

[The ranking order can be changed](/references/settings.md#ranking-rules). Rules can be removed by omitting them in the ranking order list, and custom rules must be added in the ranking order list to be applied.

Each time you create **a new ranking rule it must be added to the existing ranking order to be applied** by the [bucket sort](/advanced_guides/bucket_sort.md).

### Example

To apply the [custom ranking rule added previously](/advanced_guides/ranking.md#custom-ranking-rules), lets add it to the ranking order.

```bash
curl -X POST 'http://localhost:7700/indexes/movies/settings' \
  --data '{
  "rankingOrder": [
    "_typo",
    "_words",
    "_proximity",
    "_attribute",
    "_words__position",
    "_exact",
    "release_date"
  ]
}'
```

Now, our **search results will be ordered by descending date** after all other rules have been applied in the [bucket sort](/advanced_guides/bucket_sort).
