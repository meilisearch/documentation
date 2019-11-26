# Prefix Search

In MeiliSearch, **the search is possible even with a single letter sent**.

A prefix search is when the sorting of documents starts by comparing your search query with the start of each word in your dataset.



All words starting with this letter are added to the [bucket sort](/advanced_guides/bucket_sort.md) and then the other [ranking rules](/advanced_guides/ranking.md#ranking-rules) are applied.

::: tip
Since there is so many possible relevant documents with only one letter, the longer the search query is the fastest it will respond.
:::

#### Example

Given a set of word in your dataset : 

`film` `cinema` `movies` `show` `harry` `potter` `shine` `musical`

If my search query is `s` i will recieve the documents containing the following words :

- `show`
- `shine` 

but not 

- `movies`
- `musical`

Even if, as you can observe, there is an `s` in `movies` and `musical`. The prefix search begin searching at the **start** of the word.

When I will search for `sho` only the documents containing `show` will be returned.

::: tip
Don't worry, we also [enabled splitted and concatenated search queries]() to search inside words.
:::