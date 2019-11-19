# Search

## A query's life

To better understand how does Meili returns results for a given query, let's dive into a query's lifetime.
Syntax:

### Finding documents

When the query input is received, meilisearch is building a more complex query taking into account *typos*, n-grams and *synonyms* if configured.

- _Typos_ - For example, if the query string is `botman`, meilisearch will returns documents containing `batman`. You can read more about the typo rules in the [Advanced Guides](#advance_guide)
- _N-grams_ - Meilisearch is set to merge multi words query into a single word. Ex: Searching for `bat mobile` will returns document containing `batmobile`. Each words of the query will also be splitted in many ways so meilisearch can returns documents containing `new york` when searching for `newyork`
- _Synonyms_ - Meilisearch will return documents containing `batman` when searching for `the dark knight`. Synonyms are not set by default because they are domain specific. You can find more about synonyms in the [Advanced Guide](#advance_guide)


### Sorting documents

> It would not be a search engine if there was not a notion of relevancy in the results returned.

When all documents corresponding to the request have been collected, *meilisearch sort the documents* using a bucket sort.

A bucket sort can be described as a ordered set of sorting criteria. All the documents are sorted within the first criterion, then documents that can not be distinguished will be sorted using the second criterion, and so on. Thus, every documents are not sorted for every criterion wich induce a reduced compute time.
Here is the ordered list of the default criteria used in meilisearch:

- _Number of Typos_ - The less typos there are beween the query words and the document words, the better is the document.
- _Number of Words_ - A document containing more of the query words will be more important than one that contains less.
- _Words Proximity_ - The closer the query words are in the document the better is the document.
- _Attribute_ - A document containing the query words in a more important attribute than another document is considered better.
- _Position_ - A document containing the query words at the start of an attribute is considered better than a document that contains them at the end.
- _Exact_ - A document containing the query words in their exact form, not only a prefix of them, is considered better.

You can change the order of these criteria but you should know that these work well for a majority of use-cases. You can also add you own criteria using the [ranking feature](#ranking_features) for domains specific needs. For example, you could add a date sorting criterion when searching into documents where the date of publication is important. Check the 'Advanced Guides' on ranking to see how to add this kind of criterion.


### Search options

A lot of configuration can be made at *query-time*. Here is some usage examples

- _Pagination_ - Results can be paginated using the query params `limit` and `offset`

```bash
curl --request GET 'http://localhost:8080/indexes/4eb345y7/search?q=batman&limit=5&offset=10'
```

- _Search only in specific attributes_ - Search can be configured at query time, for example you can search in only selected attributes

```bash
curl --request GET 'https://localhost:8080/indexes/4eb345y7/search?q=moliere&attributesToSearchIn=title'
```

