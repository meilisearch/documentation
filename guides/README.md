# MeiliSearch Guides

## 🧘‍♀️ Philosophy & usage of MeiliSearch

MeiliSearch aims to be your go-to search backend when you want to build a great search experience for your end-users.
MeiliSearch is designed for end-user search in a not-so-big data collection (< 10M documents).
MeiliSearch is made for [type-as-you-search](https://en.wikipedia.org/wiki/Incremental_search) and [prefix-search](https://en.wikipedia.org/wiki/Trie).

## ⛔️ Anti-pattern

MeiliSearch should **not be your main data store**. MeiliSearch should contain only the data you want your users to search through. The more data MeiliSearch contains, the less relevant it is.

MeiliSearch queries should be sent directly from the front-end. The more proxy there is between MeiliSearch and the end-user, the less fast queries and thus search-experience will be.

## 🎲 Guides

The aim of these guides is to provide an overview of MeiliSearch. For each important notion, pages to detailed and expanded explanations have been linked.

Content:

- [🚀 Introduction](/guides/introduction/): Starting with MeiliSearch!
- [💡 Main Concepts](/guides/main_concepts/): Understanding the basics like indexes, documents and searches.
- [📚 Advanced Guides](/guides/advanced_guides/): Deep diving into the advanced but accessible concepts of MeiliSearch.

::: note
This [documentation is completely open-source](https://github.com/meilisearch/documentation). We keep it up-to-date but you might find some typos or mistakes. Help us make it a better guide by submitting a pull request or [an issue](https://github.com/meilisearch/documentation/issues) 😁
:::
