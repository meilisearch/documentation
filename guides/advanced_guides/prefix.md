# Prefix Search

In MeiliSearch, **the search is possible even with a single letter sent**.

A prefix search is when the documents sorting starts by comparing your search query with the start of each word in your dataset.

All words beginning with this letter are added to the [bucket sort](/guides/advanced_guides/bucket_sort.md), and then the other [ranking rules](/guides/main_concepts/relevancy.md) are applied.

::: note
Searching by prefix has a significant impact on search time. The shorter the word, the more possible matches in the documents increase.
:::

### Example

Given a set of words in a dataset:

`film` `cinema` `movies` `show` `harry` `potter` `shine` `musical`

If the search query is `s` only the documents containing the following words are returned:

- `show`
- `shine`

but not

- `movies`
- `musical`

Even if, as you can observe, there is an `s` in `movies` and `musical`. The prefix search begins searching at **the start of the word**. Notice that a prefix search is only done for the last word of a query, other words must be of the same length but can contain typos.

If the query is `sho`, only the documents containing `show` will be returned. MeiliSearch also handles typos while performing the prefix search. You can [read more about the typo rules on the dedicated page](/guides/advanced_guides/typotolerance.md#typo-tolerance-rules).

::: tip
We also [apply splitting and concatenating on search queries](/guides/advanced_guides/concat.md).
:::
