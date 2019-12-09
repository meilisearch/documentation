# Synonyms

To make your search more relevant there is the possibility of creating synonyms.

Thus, if your database contains a lot of a word that has on or more popular synonyms, by configuring the synonyms the words can be associated. **This allows the same results if you write one or the other word**.

Synonyms are considered to be exactly the same.
A search on a word or its synonym will return the same search result.

::: warning
However, when a sentence is considered the synonym of another word or sentence, when searching the word or sentence will always be more relevant than its synonym. It will still be in the search results in the absence of a more relevant result.
:::

There are several ways to associate words with each other.

## The One-way association

This makes it possible to determine that a word will be synonymous with another but not the other way around.

example :
```
phone => iphone
```

By searching `phone` you will get all results containing `iphone` with the same relevance. However, if you search for `iphone`, the data containing `phone` will not change your results.

## The multi-way association

By associating one or more synonyms with each other, they will be considered the same in both directions.

example :
```
Shoe <=> boot <=> slipper <=> sneakers
```

When a search is done with one of these words, all the others will be considered as exactly the same word and will appear in the search results.

However, consider the case of `word => sentence` or `sentence => sentence,` the search engine will find the results less relevant than in a matter of `word => word` where it considers the words to be exactly the same.

example :
```
"San Fransisco" <=> SF
```

The "San Fransisco" search will be considered less relevant than the "SF" search but will still be considered an acceptable search result in the absence of more relevant results.
