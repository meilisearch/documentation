# Philosophy

Finding a high-quality search engine can be difficult. We decided to create Meilisearch because we noticed that no search engine on the market was powerful, simple, and accessible to individuals and small companies. **Ease of use** was our primary goal starting out, and continues to drive the development of Meilisearch today.

### Simple and intuitive

We always aim for a simple and intuitive experience for both developers and end-users.

For developers, we're proud to say that Meilisearch requires very little configuration to get up and running. Communication to the server is done through a [RESTful API](/reference/api/overview.md).

For end-users, Meilisearch aims to provide an intuitive search-as-you-type experience, with a response time under 50 milliseconds. This helps users spend less time tinkering with search queries, and more time looking at results.

### Highly customizable

Meilisearch works out-of-the-box with default settings that meet the needs of most projects. However, searching is still highly customizable.

It wouldn't be a search engine if there wasn't a notion of relevancy in the results returned.

The returned results are **sorted according to a set of consecutive rules called [ranking rules](/learn/core_concepts/relevancy.md#ranking-rules)**. You can delete existing rules, add new ones, or even change the order in which they are executed.

You can also **configure the [search parameters](/reference/api/search.md)** to refine your search even further. We support [filters](/learn/advanced/filtering_guide.md) and [faceting](/learn/advanced/faceted_search.md#faceted-search).

### Front-facing search

Meilisearch aims to be your go-to search backend when you want to build a great search experience for your end-users.

Meilisearch is designed for front-facing search, search for users of your site, app, or product. As a result, we are fully committed to the philosophy of [prefix search](https://en.wikipedia.org/wiki/Trie).

### Anti-pattern

Meilisearch should **not be your main data store**. Meilisearch should contain only the data you want your users to search through. If you must add data that is irrelevant to search, be sure to [make those fields non-searchable](/learn/configuration/displayed_searchable_attributes.md#searchable-fields) to improve relevancy and response time.

Meilisearch queries should be sent directly from the front-end. The more proxies there are between Meilisearch and the end-user, the slower the queries and search experience will be.
