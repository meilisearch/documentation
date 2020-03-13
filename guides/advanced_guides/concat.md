# Concatenate and Split Queries

## Concatenated Queries

When your search contains several words, MeiliSearch applies a concatenation algorithm to it.

When searching for multiple words, a search is also done on the concatenation of those words. When concatenation is done on a search query containing multiple words, it will concatenate the words following each other. Thus, the first and third words will not be concatenated without the second word.

#### Example

A search on `The news paper` will also search for the following concatenated queries:
- `Thenews paper`
- `the newspaper`
- `Thenewspaper`

::: warning
This concatenation is done on a **maximum of 3 words**.
:::

## Split Queries

When you do a search, it **applies the splitting algorithm to every word** (*string separated by a space*).

This consists of finding the most interesting place to separate the words and to create a parallel search query with this proposition.

This is achieved by finding the best frequency of the separate words in the dictionary of all words in the dataset. It will look out that both words have a minimum of interesting results, and not just one of them.

Splitted words are not considered as multiple words in a search query because they must stay next to each other, this behavior is called **Phrase Queries**.

#### Example

On a search on `newspaper`, it will split into `news` and `paper` and not into `new` and `spaper`.
A document containing `news` and `paper` separated by other words will not be relevant to the search.
