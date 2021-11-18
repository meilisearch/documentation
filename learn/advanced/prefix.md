# Prefix search

In MeiliSearch, **you can perform a search with only a single letter as your query**. This is because we follow the philosophy of **prefix search**.

Prefix search is when document sorting starts by comparing the search query against the beginning of each word in your dataset. All documents with words that match the query term are added to the [bucket sort](/reference/under_the_hood/bucket_sort.md), before the [ranking rules](/learn/core_concepts/relevancy.md#ranking-rules) are applied sequentially.

In other words, prefix search means that it's not necessary to type a word in its entirety to find documents containing that word—you can just type the first one or two letters.

Note that prefix search is only performed on the last word in a search query—prior words must be typed out fully in order to get accurate results.

::: note
Searching by prefix (rather than using complete words) has a significant impact on search time. The shorter the query term, the more possible matches in the dataset.
:::

### Example

Given a set of words in a dataset:

`film` `cinema` `movies` `show` `harry` `potter` `shine` `musical`

query: `s`:
response:

- `show`
- `shine`

but not

- `movies`
- `musical`

query: `sho`:
response:

- `show`

MeiliSearch also handles typos while performing the prefix search. You can [read more about the typo rules on the dedicated page](/reference/under_the_hood/typotolerance.md#typo-tolerance-rules).

::: tip
We also [apply splitting and concatenating on search queries](/reference/under_the_hood/concat.md).
:::
