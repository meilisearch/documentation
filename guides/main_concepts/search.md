# Search

## Finding documents

When a query input is received, MeiliSearch constructs a more complex query by taking into account configured settings: _typo_, n-grams, and _synonyms_.

#### Typo Tolerance

MeiliSearch handles spelling errors and return the correct results to users. For example, if the query string is `botman`, documents containing `batman` will be returned.

[Learn more about typo tolerance](/guides/advanced_guides/typotolerance.md)

#### N-grams

MeiliSearch is set to merge multi-words queries into a single word when searching for matching documents. For example, if the query string is `bat mobile` documents containing `batmobile` will be returned. Each word of the query will be split in the same way.

[Learn more about concatenating and splitting queries](/guides/advanced_guides/concat.md)

#### Synonyms

MeiliSearch will return documents containing `batman` when searching for `the dark knight`. Synonyms are not set by default since they are domain-specific.

[Learn more about synonyms](/guides/advanced_guides/synonyms.md)

## Sorting documents

> It would not be a search engine if there was not a notion of relevancy in the results returned.

When all documents matching the request have been collected, _MeiliSearch sorts them_ using a [bucket sort](/guides/advanced_guides/bucket_sort.md) and a list of built-in [ranking rules](/guides/main_concepts/relevancy.md#ranking-rules).

A bucket sort can be described as an ordered set of sorting rules. All the documents are sorted within the first rule, then documents that can not be distinguished will be sorted using the second rule, and so on. Thus, every document is not sorted for every rule, which induces a reduced compute time.

Here is the ordered list of the default ranking rules used in MeiliSearch:

#### 1. Typo

The fewer typos there are between the query words and the document words, the better is the document.

#### 2. Words

A document containing more of the query words will be more important than one that contains less.

#### 3. Proximity

The closer the query words are in the document, the better is the document.

#### 4. Attribute

A document containing the query words in a more important attribute than another document is considered better.

#### 5. Words Position

A document containing the query words at the start of an attribute is considered better than a document that contains them at the end.

#### 6. Exactness

A document containing the query words in their exact form, not only a prefix of them, is considered better.

You can change the order of these rules, but you should know that these work well for a majority of use-cases. You can also add your own rules for domains specific needs. For example, you could add a date sorting criterion when searching into documents where the date of publication is essential.

To learn how to add custom rules, see [this page about ranking rules](/guides/main_concepts/relevancy.md).

## Search options

A lot of configuration can be made at _query-time_ using the [search parameters](/guides/advanced_guides/search_parameters.md). Here are some usage examples:

#### Pagination

Results can be paginated using the query params `limit` and `offset`.

```bash
$ curl -X GET 'http://localhost:7700/indexes/4eb345y7/search?q=batman&limit=5&offset=10'
```

#### Filters

You can build a faceted search using the query param `filter`. It will only return the specific filtered documents.

```bash
$ curl -X GET 'https://localhost:7700/indexes/4eb345y7/search?q=batman&filters=director:Christopher%20Nolan'
```

### Try it out!

Once you have added your data to Meilisearch, **give it a try**! Open your web browser and enter MeiliSearch address to visit the [web interface](/guides/advanced_guides/web_interface.md).
