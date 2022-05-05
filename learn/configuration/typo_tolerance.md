# Typo tolerance

Typo tolerance helps users find relevant results even when their search queries contain spelling mistakes or typos, e.g. typing `phnoe` instead of `phone`. Meilisearch allows you to [configure the typo tolerance feature for each index](/reference/api/typo_tolerance.md#update-typo-tolerance).

::: note
Meilisearch considers a typo on a query's first character as two typos. This increases performance during search.
:::

## Configuring typo tolerance

Typo tolerance is enabled by default, but you can disable it if needed:

<CodeSamples id="typo_tolerance_guide_1" />

Disabling typo tolerance will mean Meilisearch no longer applies typo tolerance to match queries at search time. However, it will still [sort results by increasing number of typos](#impact-of-typo-tolerance-on-the-typo-ranking-rule).

### `minWordSizeForTypos`

By default, Meilisearch accepts one typo for query terms containing five or more characters, and up to two typos if the term is at at least nine characters long.

::: note
Concatenating two query terms will count as one typo.

If you type `La tableau`, Meilisearch will concatenate it to `Letableau`. This concatenation will count as one typo. This rule applies to all [space separators](/learn/advanced/datatypes.md#string).
:::

If your dataset contains `seven`, searching for `sevem` or `sevan` will match `seven`. But `tow` won't match `two` as it's less than `5` characters.

You can override these default settings using the `minWordSizeForTypos` object. The code sample below sets the minimum word size for one typo to `4` and the minimum word size for two typos to `10`.

<CodeSamples id="typo_tolerance_guide_4" />

When updating the `minWordSizeForTypos` object, keep in mind that:

- the value of `twoTypos` should be greater or equal to `oneTypo`
- the value for both `oneTypo` and `twoTypos` should be between `0` and `255`

We recommend keeping the value of `oneTypo` between `2` and `8` and the value of `twoTypos` between `4` and `14`. If either value is too low, you may get a large number of false-positive results. On the other hand, if both values are set too high, many search queries may not benefit from typo tolerance.

### `disableOnWords`

You can disable typo tolerance for a list of query terms by adding them to `disableOnWords`.

<CodeSamples id="typo_tolerance_guide_3" />

Meilisearch won't apply typo tolerance on the query term `Shrek` or `shrek` at search time to match documents.

::: note
`disableOnWords` is case insensitive.
:::

### `disableOnAttributes`

You can disable typo tolerance for a specific [document attribute](/learn/core_concepts/documents.md) by adding it to `disableOnAttributes`. The code sample below disables typo tolerance for `title`:

<CodeSamples id="typo_tolerance_guide_2" />

With the above settings, matches in the `title` attribute will not tolerate any typos. For example, a search for `beautiful` (9 characters) will not match the movie "Biutiful" starring Javier Bardem. With the default settings, this would be a match.

## Impact of typo tolerance on the `typo` ranking rule

The [`typo` ranking rule](/learn/core_concepts/relevancy.md#_2-typo) sorts the results by increasing number of typos on matched query words. Documents with 0 typos will rank highest. This rule does not impact the typo tolerance setting.

If you don't use the `typo` ranking rule but enable typo tolerance for an index, Meilisearch will use typo tolerance to match documents but won't sort them based on increasing number of typos.

## How are typos calculated

Typo tolerance is applied before sorting documents. It aggregates them and chooses which documents contain words similar to the queried words. Meilisearch then uses a prefix [Levenshtein algorithm](https://en.wikipedia.org/wiki/Levenshtein_distance) to check if the words match. It accepts every word that **starts with the query words or has the same length**.

The Levenshtein distance between two words _M_ and _P_ is called "the minimum cost of transforming _M_ into _P_" by performing the following elementary operations:

- substitution of a character of _M_ by a character other than _P_ (e.g., **k**itten → **s**itten)
- insertion in _M_ of a character of _P_ (e.g., siting → sit**t**ing)
- deletion of a character from _M_ (e.g., satu**r**day → satuday)

By default, Meilisearch uses the following rules for matching documents, you can configure them using the [update typo tolerance endpoint](/reference/api/typo_tolerance.md#update-typo-tolerance). These rules are **by word** and not for the whole query string.

- If the query word is between `1` and `4` characters, **no typo** is allowed. Only documents that contain words that **start with** or are of the **same length** with this query word are considered valid
- If the query word is between `5` and `8` characters, **one typo** is allowed. Documents that contain words that match with **one typo** are retained for the next steps.
- If the query word contains more than `8` characters, we accept a maximum of **two typos**

This means that "saturday" which is `7` characters long, uses the second rule and matches every document containing **one typo**. For example:

- "saturday" is accepted because it is the same word
- "satuday" is accepted because it contains **one typo**
- "s**u**tuday" is not accepted because it contains **two typos**
- "**c**aturday" is not accepted because it contains **two typos**
