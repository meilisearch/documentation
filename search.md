# Search

Meili provide a fast and relevant search engine. You can access it via the API described below.

It follows some basic typo and rules to sort documents. This is an explanation of the default rules used in Meili.
First we have to explain some terms that are used in this reading.

- A query string is the full list of all the words that the end user is searching for (i.e. "saturday night fever").
- A query word is one of the words that compose the query string (i.e "night")

### Typo rules

The typo rules are used before sorting the documents. They are used to aggregate them, to choose which documents contain words similar to the queried words.

We use a prefix [Levenshtein algorithm] to check if the words match. The only difference with a Levenshtein algorithm is that it accepts every word that **starts with the query words** too. Therefore words are accepted if they start with or have equal length.

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

### Ranking rules

All the documents that have been aggregated using the typo rules above can now be sorted. Meili uses a [bucket sort].

What is a bucket sort? We sort all the documents with the first rule, we group all the documents that can't be distinguished with it and sort this group using the second rule, and so on.

Here is the list of all the default rules that are executed in this specific order by default:

- _Number of Typos_ - The less typos there are beween the query words and the document words, the better is the document.
- _Number of Words_ - A document containing more of the query words will be more important than one that contains less.
- _Words Proximity_ - The closer the query words are in the document the better is the document.
- _Attribute_ - A document containing the query words in a more important attribute than another document is considered better.
- _Position_ - A document containing the query words at the start of an attribute is considered better than a document that contains them at the end.
- _Exact_ - A document containing the query words in their exact form, not only a prefix of them, is considered better.

[bucket sort]: https://en.wikipedia.org/wiki/Bucket_sort
[Levenshtein algorithm]: https://en.wikipedia.org/wiki/Levenshtein_distance

## Search in an index

<RouteHighlighter method="GET" route="/indexes/:index/search"/>

Search for documents matching a specific query in the given index.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **Accept-encoding** | gzip, deflate |

#### Path Variables

| Variable  | Description   |
|-----------|---------------|
| **index** | The index UID |

#### Query Parameters

| Query Parameter           | Description                                        | Default Value |
|---------------------------|----------------------------------------------------|:-------------:|
| **q**                     | query string _(mandatory)_                         |               |
| **offset**                | number of documents to skip                        | 0             |
| **limit**                 | number of documents to take                        | 20            |
| **attributesToRetrieve**  | document attributes to show                        | *             |
| **attributesToSearchIn**  | which attributes are used to match documents       | *             |
| **attributesToCrop**      | which attributes to crop                           | none          |
| **cropLength**            | limit length at which to crop specified attributes | 200           |
| **attributesToHighlight** | which attributes to highlight                      | none          |
| **matches**               | whether to return the raw matches or not           | false         |

### Example

```bash
curl \
  --location \
  --request GET 'https://4eb345y7.getmeili.com/indexes/4eb345y7/search?q=american%20ninja%205'
```

#### Response: `200 Ok`

```json
[
  {
    "id": 25684,
    "title": "American Ninja 5",
    "poster": "https://image.tmdb.org/t/p/w1280/iuAQVI4mvjI83wnirpD8GVNRVuY.jpg",
    "overview": "When a scientists daughter is kidnapped, American Ninja, attempts to find her, but this time he teams up with a youngster he has trained in the ways of the ninja.",
    "release_date": "1993-01-01"
  },
  {
    "id": 25682,
    "title": "American Ninja 3: Blood Hunt",
    "poster": "https://image.tmdb.org/t/p/w1280/c7oNrk8bRg0BlmtvidhVD8ivPYT.jpg",
    "overview": "Jackson is back, and now he has a new partner, karate champion Sean, as they must face a deadly terrorist known as 'The Cobra', who has infected Sean with a virus. Sean and Jackson have no choice but to fight the Cobra and his bands of ninjas.",
    "release_date": "1989-02-24"
  }
]
```
