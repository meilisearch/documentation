# Search

## Finding documents

When the query input is received, MeiliSearch is building a more complex query taking into account _typos_, n-grams, and _synonyms_ if configured.

- _Typos_ - For example, if the query string is `botman`, MeiliSearch will return documents containing `batman`. [Read more about the typo rules](/guides/advanced_guides/typotolerance.md).
- _N-grams_ - MeiliSearch is set to merge multi-words queries into a single word when searching for matching documents. Ex: Searching for `bat mobile` will return documents containing `batmobile`. Each word of the query will also be split in many ways so MeiliSearch can returns documents containing `new york` when querying for `newyork`. [Read more about Concatenate and Split Queries](/guides/advanced_guides/concat.md)
- _Synonyms_ - MeiliSearch will return documents containing `batman` when searching for `the dark knight`. Synonyms are not set by default because they are domain-specific. [Read more about synonyms](/guides/advanced_guides/synonyms.md).

## Sorting documents

> It would not be a search engine if there was not a notion of relevancy in the results returned.

When all documents corresponding to the request have been collected, _MeiliSearch sorts the documents_ using a [bucket sort](/guides/advanced_guides/bucket_sort.md) and a list of built-in [ranking rules](/guides/main_concepts/relevancy.md#ranking-rules).

A bucket sort can be described as an ordered set of sorting rules. All the documents are sorted within the first rule, then documents that can not be distinguished will be sorted using the second rule, and so on. Thus, every document is not sorted for every rule, which induces a reduced compute time.
Here is the ordered list of the default ranking rules used in MeiliSearch:

- _Number of Typos_ - The fewer typos there are between the query words and the document words, the better is the document.
- _Number of Words_ - A document containing more of the query words will be more important than one that contains less.
- _Words Proximity_ - The closer the query words are in the document, the better is the document.
- _Attribute_ - A document containing the query words in a more important attribute than another document is considered better.
- _Position_ - A document containing the query words at the start of an attribute is considered better than a document that contains them at the end.
- _Exactness_ - A document containing the query words in their exact form, not only a prefix of them, is considered better.

You can change the order of these rules, but you should know that these work well for a majority of use-cases. You can also add your own rules for domains specific needs. For example, you could add a date sorting criterion when searching into documents where the date of publication is essential. [Read more about ranking](/guides/main_concepts/relevancy.md) to see how to add custom rules.

## Search options

A lot of configuration can be made at _query-time_ using the [search paramaters](/guides/advanced_guides/search_parameters.md). Here are some usage examples:

- _Pagination_ - Results can be paginated using the query params `limit` and `offset`

```bash
$ curl -X GET 'http://localhost:7700/indexes/4eb345y7/search?q=batman&limit=5&offset=10'
```

- _Filters_ - You can build a faceted search using the query param `filter`. It will only return the specific filtered documents.

```bash
$ curl -X GET 'https://localhost:7700/indexes/4eb345y7/search?q=batman&filters=director:Christopher%20Nolan'
```

### Try out

Once you have added your data to Meilisearch, **try out the search** experience using the available [web interface](/guides/advanced_guides/web_interface.md) at your MeiliSearch address in any browser.
