# Prefix Search

In MeiliSearch, **the search is possible even with a single letter sent**.

All words starting with this letter are added to the [bucket sort](/advanced_guides/bucket_sort.md) and then the other [ranking rules](/advanced_guides/ranking.md#ranking-rules) are applied.

::: tip
Since there is so many possible relevant documents with only one letter, the longer the search query is the fastest it will respond.
:::