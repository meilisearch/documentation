# Search

## Finding documents

When a query input is received, MeiliSearch constructs a more complex query by taking into account configured settings: _typo_, n-grams, and _synonyms_.

## Sorting documents

> It would not be a search engine if there was not a notion of relevancy in the results returned.

When all documents matching the request have been collected, MeiliSearch sorts them using a **bucket sort** and a list of **built-in [ranking rules](/guides/main_concepts/relevancy.md#ranking-rules)**.

#### Bucket sort

A **bucket sort** can be described as an ordered set of sorting rules. All documents are sorted within the first rule, then documents that can not be distinguished will be sorted using the second rule, and so on. Thus, every document is not sorted for every rule, which induces a reduced compute time.

[Learn more about the bucket sort](/guides/advanced_guides/bucket_sort.md)

#### Ranking rules

Search responses are sorted according to a set of consecutive built-in rules called **ranking rules**. The ranking rules are applied to the search results from the most impactful rule to the least impactful rule. **This order can be changed in the settings**. The ranking rules are also **customizable** which means **existing rules can be deleted and new ones can be added**.

[Learn more about ranking rules](/guides/main_concepts/relevancy.md)

## Search parameters

A lot of configuration can be made at _query-time_.

Here are some usage examples:

#### Pagination

Results can be paginated using the query params `limit` and `offset`.

### Try it out!

Once you have added your data to Meilisearch, **give it a try**! Open your web browser and enter MeiliSearch address to visit the [web interface](/guides/advanced_guides/web_interface.md).
