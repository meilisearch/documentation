# Philosophy

MeiliSearch has been designed to improve your search experience.

Today, finding a high-quality search engine may be complicated. Because we realized there was a lack of both powerful and simple solutions, we decided to create MeiliSearch. The **simplicity of use** is our philosophy and it keeps driving the development of MeiliSearch.

## Simple and Intuitive

We aimed for a simple and intuitive experience for both developers and end-users.

For developers, it requires very little configuration to be up and running. Communication to the server is done through a [RESTful API](/references/README.md).

For users, the search experience aims to feel simple so they can focus on the results. MeiliSearch delivers an intuitive search-as-you-type experience; which means a response time lower than 50 milliseconds.

## Highly Customizable

MeiliSearch works out-of-the-box with default settings that meet the needs of most projects.

However, searching is highly customizable.

> It would not be a search engine if there wasn't a notion of relevancy in the results returned.

The returned results are **sorted according to a set of consecutive rules called [ranking rules](/guides/main_concepts/relevancy.md#ranking-rules)**. You can delete existing rules, add new ones, or even change the order in which they are executed.

You can also **configure the [search parameters](/guides/advanced_guides/search_parameters.md)** to refine your search even further. We support [filters](/guides/advanced_guides/filtering.md) and [faceting](/guides/advanced_guides/faceted_search.md).

## 🧘‍♀️ Philosophy & usage of MeiliSearch

MeiliSearch aims to be your go-to search backend when you want to build a great search experience for your end-users.
MeiliSearch is designed for end-user search in a not-so-big data collection (< 10M documents).
MeiliSearch is made for [type-as-you-search](https://en.wikipedia.org/wiki/Incremental_search) and [prefix-search](https://en.wikipedia.org/wiki/Trie).

## ⛔️ Anti-pattern

MeiliSearch should **not be your main data store**. MeiliSearch should contain only the data you want your users to search through. The more data MeiliSearch contains, the less relevant it is.

MeiliSearch queries should be sent directly from the front-end. The more proxy there is between MeiliSearch and the end-user, the less fast queries and thus search-experience will be.