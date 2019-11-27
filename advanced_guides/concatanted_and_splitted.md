# Concatenate and split queries

## Concatenated queries

When your search contains several words, MeiliSearch applies a concatenation algorithm to it.

This means that a search is also done on the concatenation of those words.

#### Example

A search on `news paper` searches with the following queries :
- News paper
- Newspaper

::: warning
This concatenation is done on a **maximum of 3 words**.
:::

## Splitted queries

When you do a search, it **applies the splitting algorithm to every word** (*string separated by a space*).

This consists of finding the most interesting place to separate the words and to create a parallel search query with this proposition.

This is achieved by finding the best frequency of the separate words in the dictionary of all words in the dataset. It will look out that both words have a minimum of interesting results, and not just one of them.
#### Example

On a search on "newspaper", it will splits into "news" and "paper" and not into "new" and "spaper".


