# Synonyms

To make your search more relevant, you can [create a list of synonyms](/references/synonyms.md#update-synonyms).

If your database contains a lot of a word that has one or more popular synonyms, by configuring the synonyms the words can be associated. **This allows the same search results if you write one or the other word**.

Synonyms are considered to be exactly the same.
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

``` json
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

When a search is made with one of these words all the others will be considered as exactly the same word and will appear in the search results.

However, in the case of word to sentence or sentence to sentence

example:
```
"San Fransisco" <=> SF
```

The "San Fransisco" search will be considered less relevant than the "SF" search but will still be considered an acceptable search result in the absence of a more relevant result.

#### Example

To create a multi-way synonym list this is the JSON that should be [added to the settings](/references/synonyms.md#update-synonyms).

``` json
{
    "san francisco": ["sf"],
    "sf": ["san francisco"]
}
```
