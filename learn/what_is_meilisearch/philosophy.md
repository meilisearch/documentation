---
sidebarDepth: 0
---
# Philosophy

Finding a high-quality search engine can be difficult. We decided to create MeiliSearch because we noticed that no search engine on the market was powerful, simple, and accessible to individuals and small companies. **Ease of use** was our primary goal starting out, and continues to drive the development of MeiliSearch today.

### Simple and Intuitive

We always aim for a simple and intuitive experience for both developers and end-users.

For developers, we're proud to say that MeiliSearch requires very little configuration to get up and running. Communication to the server is done through a [RESTful API](/reference/api).

For end-users, the search experience aims to feel simple so they can focus on the results. MeiliSearch aims to deliver an intuitive search-as-you-type experience, with a response time lower than 50 milliseconds.

### Highly Customizable

MeiliSearch works out-of-the-box with default settings that meet the needs of most projects. However, searching is still highly customizable.

> It wouldn't be a search engine if there wasn't a notion of relevancy in the results returned.

The returned results are **sorted according to a set of consecutive rules called [ranking rules](/learn/core_concepts/relevancy.md#ranking-rules)**. You can delete existing rules, add new ones, or even change the order in which they are executed.

You can also **configure the [search parameters](/reference/features/search_parameters.md)** to refine your search even further. We support [filters](/reference/features/filtering.md) and [faceting](/reference/features/faceted_search.md).

### Front-Facing Search

MeiliSearch aims to be your go-to search backend when you want to build a great search experience for your end-users.

It's not designed for searching through large data collections (> 10M documents) or industrial applications.

As a result, we are fully committed to the philosophy of [prefix search](https://en.wikipedia.org/wiki/Trie).

### Anti-pattern

MeiliSearch should **not be your main data store**. MeiliSearch should contain only the data you want your users to search through. The more data MeiliSearch contains, the less relevant it is.

MeiliSearch queries should be sent directly from the front-end. The more proxy there is between MeiliSearch and the end-user, the less fast queries and thus search-experience will be.
