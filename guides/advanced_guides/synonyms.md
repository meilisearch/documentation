# Synonyms

To make your search more relevant, you can [create a list of synonyms](/references/synonyms.md#update-synonyms).

If multiples words have an equivalent meaning in your dataset, you can decide to create a synonym list for these words. The search engine will give the same search results for any search with one of the associated words as a query.

Synonyms are considered to be the same.
A search on a word or its synonym will return the same search result.

::: warning
However, when a sentence is considered the synonym of another word or sentence, when searching the word or sentence will always be more relevant than its synonym. It will still be in the search results in the absence of a more relevant result.
:::

There are several ways to associate words with each other.

## The One-way association

This makes it possible to determine that a word will be synonymous with another but not the other way around.

example:

```
phone => iphone
```

By searching `phone` you will get all results containing `iphone` with the same relevance. However, if you search for `iphone`, documents containing `phone` will not be shown in your results.

#### Example

To create a one-way synonym list this is the JSON that should be [added to the settings](/references/synonyms.md#update-synonyms).

```json
{
  "phone": ["iphone"]
}
```

## The multi-way association

By associating one or more synonyms with each other, they will be considered the same in both directions.

example:

```
shoe <=> boot <=> slipper <=> sneakers
```

When a search is done with one of these words, all the others will be considered as the same word and will appear in the search results.

However, in the case of word to sentence or sentence to sentence

example:

```
"San Fransisco" <=> SF
```

The "San Fransisco" search will be considered less relevant than the "SF" search but will still be considered an acceptable search result in the absence of a more relevant result.

#### Example

To create a multi-way synonym list this is the JSON that should be [added to the settings](/references/synonyms.md#update-synonyms).

```json
{
  "san francisco": ["sf"],
  "sf": ["san francisco"]
}
```
