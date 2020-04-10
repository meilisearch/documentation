# Search

Once your documents have been ingested into MeiliSearch, you can search them.

Searching is highly customizable. You can configure the [search parameters](/guides/advanced_guides/search_parameters.md) to refine your search even further.

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

### Give it a try!

We also deliver an **out-of-the-box web interface** in which you can test MeiliSearch interactively.

Follow [this guide](/guides/advanced_guides/web_interface.md) to give the search engine a try!
