# Synonyms

To make your search more relevant there is the possibility of creating synonyms.

Your database might contain a lot of a term that has one or more popular synonyms. By creating a synonym list, these terms can be associated. **This allows the same search results if you query one or the other terms**.

Synonyms are considered to be exactly the same.
A search on a word or its synonym will return the same search result.

::: warning
However, when a sentence is considered the synonym of another word or sentence, when searching the word or sentence will always be more relevant than its synonym. It will still be in the search results in the absence of a more relevant result.
:::

There are several ways to associate words with each other.

## A is synonym of B but B is not synonym of A

This makes it possible to determine that a word will be synonymous with another but not the other way around.

example:
```
phone => iphone
```

By searching `phone` you will get all results containing `iphone` with the same relevance. However, if you search for `iphone`, the data containing `phone` will not change your results.

## A is synonym of B and B is synonym of A

By associating one or more synonyms with each other, they will be considered the same in both directions.

example:
```
Shoe <=> boot <=> slipper <=> sneakers
```

When a search is made with one of these words all the others will be considered as exactly the same word and will appear in the search results.

However, in the case of word to sentence or sentence to sentence

example:
```
"San Fransisco" <=> SF
```

The "San Fransisco" search will be considered less relevant than the "SF" search but will still be considered an acceptable search result in the absence of a more relevant result.
