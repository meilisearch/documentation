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

When one word is associated with another one word (i.e. smartphone = iPhone) the two words are exactly considered equal, it means that documents matching even one or the other word are considered equal.

But, if we are in the case where multiple words are associated to a one/multiple words or a one word is associated with multiple words, In other words, all other cases than one to one word, we do not consider the synonyms at the same level (i.e. SF = San Fransisco). It means that if we find a document with SF it is considered better than a document containing San Fransisco.
