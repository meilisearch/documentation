# Typo Tolerance

Meilisearch **implements [typo tolerance](/advanced_guides/typotolerance.html#typo-tolerance-rules)**. This means **it understands your search even if there are typos or spelling mistakes** to a certain extend.

#### Example

On a movie dataset, let's search for `botman`
```json
{
  "hits": [
    {
      "title": "Batman: Hush",
      ...
    },
    {
      "title": "Batman vs. Teenage Mutant Ninja Turtles",
      ...
    },
    {
      "title": "Batman Ninja",
      ...
    },
    {
      "title": "Batman: Gotham by Gaslight",
      ...
    },
    ...
  ],
  "offset": 0,
  "limit": 20,
  "processingTimeMs": 1,
  "query": "botman"
}
```

## Typo tolerance rules

The typo rules are used before sorting the documents. They are used to aggregate them, to choose which documents contain words similar to the queried words.

We use a prefix [Levenshtein algorithm](https://en.wikipedia.org/wiki/Levenshtein_distance) to check if the words match. The only difference with a Levenshtein algorithm is that it accepts every word that **starts with the query words** too. Therefore words are accepted if they start with or have equal length.

The Levenshtein distance between two words _M_ and _P_ is called "the minimum cost of transforming _M_ into _P_" by performing the following elementary operations:

- substitution of a character of _M_ by a character other than _P_. (e.g. **k**itten → **s**itten)
- insertion in _M_ of a character of _P_. (e.g. siting → sit**t**ing)
- deletion of a character from _M_. (e.g. satu**r**day → satuday)

There are some rules about what can be considered "similar". These rules are **by word** and not for the whole query string.

- If the query word is between 1 and 4 characters long therefore **no typo** is allowed, only documents that contains words that **starts with** or are of **equal length** with this query word are considered valid for this request.
- If the query word is between 5 and 8 characters long, **one typo** is allowed. Documents that contains words that match with **one typo** are retained for the next steps.
- If the query word contains more than 8 characters, we accept a maximum of **two typos**.

This means that "saturday", which is 7 characters long uses the second rule and every document containing words that only have **one typo** will match. For example:

- "saturday" is accepted because it is exactly the same word.
- "sat" is not accepted because the query word is not a prefix of it (it is the opposite).
- "satuday" is accepted because it contains **one typo**.
- "s**u**tuday" is not accepted because it contains **two typos**.

