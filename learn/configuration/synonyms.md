# Synonyms

If multiple words have an equivalent meaning in your dataset, you can [create a list of synonyms](/reference/api/settings.md#update-synonyms). This will make your search results more relevant.

Words set as synonyms won't always return the same results. With the default settings, the `movies` dataset should return 547 results for `great` and 66 for `fantastic`. Let's set them as synonyms:

<CodeSamples id="synonyms_guide_1" />

With the new settings, searching for `great` returns 595 results and `fantastic` returns 423 results. This is due to various factors like [typos](/learn/configuration/typo_tolerance.md#minwordsizefortypos) and [splitting the query](/learn/advanced/concat.md#split-queries) to find relevant documents. The search for `great` will allow only one typo (for example, `create`) and take into account all variations of `great` (for instance, `greatest`) along with `fantastic`.

::: warning
The number of search results may vary depending on changes to the `movies` dataset.
:::

## Normalization

All synonyms are **lowercased** and **de-unicoded** during the indexing process.

#### Example

Consider a situation where `Résumé` and `CV` are set as synonyms.

```json
{
  "Résumé": [
    "CV"
  ],
  "CV": [
    "Résumé"
  ]
}
```

A search for `cv` would return any documents containing `cv` or `CV`, in addition to any that contain `Résumé`, `resumé`, `resume`, etc., unaffected by case or accent marks.

## One-way association

Use this when you want one word to be synonymous with another, but not the other way around.

```
phone => iphone
```

A search for `phone` will return documents containing `iphone` as if they contained the word `phone`.

However, if you search for `iphone`, documents containing `phone` will be ranked lower in the results due to [the typo rule](/learn/core_concepts/relevancy.md#ranking-rules).

#### Example

To create a one-way synonym list, this is the JSON syntax that should be [added to the settings](/reference/api/settings.md#update-synonyms).

```json
{
  "phone": [
    "iphone"
  ]
}
```

## Mutual association

By associating one or more synonyms with each other, they will be considered the same in both directions.

```
shoe <=> boot <=> slipper <=> sneakers
```

When a search is done with one of these words, all synonyms will be considered as the same word and will appear in the search results.

#### Example

To create a mutual association between four words, this is the JSON syntax that should be [added to the settings](/reference/api/settings.md#update-synonyms).

```json
{
  "shoe": [
    "boot",
    "slipper",
    "sneakers"
  ],
  "boot": [
    "shoe",
    "slipper",
    "sneakers"
  ],
  "slipper": [
    "shoe",
    "boot",
    "sneakers"
  ],
  "sneakers": [
    "shoe",
    "boot",
    "slipper"
  ]
}
```

## Multi-word synonyms

Meilisearch treats multi-word synonyms as [phrases](/reference/api/search.md#phrase-search-2).

Take note that **multi-word phrases are treated differently** than associations between individual words.

When a multi-word phrase is considered the synonym of another word or phrase, the **exact search query will always take precedence over its synonym(s)**.

::: note
Multi-word synonyms are limited to a maximum of **three words**.
For example, although you could make `League of Legends` and `LOL` into synonyms, you could not do the same for `The Lord of the Rings` and `LOTR`.
:::

#### Example

Suppose you set `San Francisco` and `SF` as synonyms with a [mutual association](#mutual-association)

```json
{
  "san francisco": [
    "sf"
  ],
  "sf": [
    "san francisco"
  ]
}
```

If you input `SF` as a search query, Meilisearch will also return results containing the phrase `San Francisco`. However, depending on the ranking rules, they might be considered less [relevant](/learn/core_concepts/relevancy.md) than those containing `SF`. The reverse is also true: if your query is `San Francisco`, documents containing `San Francisco` may rank higher than those containing `SF`.
