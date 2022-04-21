# Typo tolerance

Typo tolerance allows users to make mistakes when typing and still find results close to their query, e.g., typing `phnoe` instead of `phone`. Meilisearch allows you to [configure the typo tolerance feature for each index](/reference/api/typo_tolerance.md#update-typo-tolerance).

:::note
Meilisearch considers a typo on a query's first character as two typos. This increases performance during search.
:::

:::note
Concatenating two strings will count as one typo.
:::

## Configuring typo tolerance

Typo tolerance is enabled by default, but you can disable it if needed:

<CodeSamples id="typo_tolerance_guide_1" />

Disabling typo tolerance will mean Meilisearch no longer applies typo tolerance to match queries at search time. However, it will still [sort results by increasing number of typos](#impact-of-typo-tolerance-on-the-typo-ranking-rule).

### `minWordSizeForTypos`

By default, Meilisearch applies typo tolerance to a query term if its length is at least 5 characters. To accept two typos, the query term should be at least 9 characters.

If your dataset contains `seven`, searching for `sevem` or `sevan` will match `seven`. But `tow` won't match `two` as it's less than 5 characters.

You can override these default settings using the `minWordSizeForTypos` object. The code sample below sets the minimum word size for one typo to `4` and the minimum word size for two typos to `10`.

<CodeSamples id="typo_tolerance_guide_4" />

When updating the `minWordSizeForTypos` object, keep in mind that:

- the value of `twoTypos` should be greater or equal to `oneTypo`
- the value for both `oneTypo` and `twoTypos` should be between `0` and `255`

We recommend keeping the value of `oneTypo` between `2` and `8` and the value of `twoTypos` between `4` and `14`. If the value is too small, you will get a lot of false-positive results. A bigger value will mean the typo tolerance feature is rarely used to match documents.

### `disableOnWords`

You can disable typo tolerance for a list of query terms by adding them to `disableOnWords`.

<CodeSamples id="typo_tolerance_guide_3" />

Meilisearch won't apply typo tolerance on the query term `Shrek` or `shrek` at search time to match documents.

:::note
`disableOnWords` is case insensitive.
:::

### `disableOnAttributes`

You can disable the typo tolerance feature for a specific document attribute by adding it to `disableOnAttributes`. The code sample below disables typo tolerance for `title`:

<CodeSamples id="typo_tolerance_guide_2" />

If you type `Dunbo` instead of `Dumbo` with the above settings, Meilisearch won't match any documents.

## Impact of typo tolerance on the `typo` ranking rule

The [`typo` ranking rule](/learn/core_concepts/relevancy.md#_2-typo) sorts the results by increasing number of typos on matched query words. Documents with 0 typos will rank highest. This rule does not impact the typo tolerance setting.

If you don't use the `typo` ranking rule but enable typo tolerance for an index, Meilisearch will use typo tolerance to match documents but won't sort them based on increasing number of typos.

## How are typos calculated

Meilisearch uses the Levenshtein algorithm to check if words match. You can find more details in our [dedicated guide](/learn/advanced/levenshtein_algorithm.md).
