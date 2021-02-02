# Prefix Search

In MeiliSearch, **the search is possible even with a single letter sent**.

A prefix search is when the documents sorting starts by comparing your search query with the start of each word in your dataset.

All words beginning with this letter are added to the [bucket sort](/reference/under_the_hood/bucket_sort.md), and then the other [ranking rules](/learn/core_concepts/relevancy.md) are applied.

::: note
Searching by prefix has a significant impact on search time. The shorter the word, the more possible matches in the documents increase.
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

Notice that a prefix search is only done for the last word of a query, other words must be of the same length but can contain typos.

MeiliSearch also handles typos while performing the prefix search. You can [read more about the typo rules on the dedicated page](/reference/under_the_hood/typotolerance.md#typo-tolerance-rules).

::: tip
We also [apply splitting and concatenating on search queries](/reference/under_the_hood/concat.md).
:::
