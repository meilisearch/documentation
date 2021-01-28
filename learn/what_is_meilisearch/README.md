# What Is MeiliSearch?

MeiliSearch is a **RESTful search API**. It aims to be a **ready-to-go solution** for everyone who wants a **fast and relevant search experience** for their end-users ⚡️🔎

Efficient search engines often require a significant investment of resources. They are only accessible to companies with the means necessary to develop a bespoke search solution that fits their needs.

Small-to-medium-sized businesses commonly resort to subpar search engines that incur invisible costs on their user experience and retention due to poor search fulfillment.

That's why we created MeiliSearch: An open source solution accessible to everyone, designed to meet a vast majority of needs. Requiring very little configuration to be installed, yet highly customizable.

Our solution delivers an **instant search experience** including **typo handling**, **filters**, **custom rankings**, and many more [features](#features).

## Demo

![crates.io demo gif](/crates-io-demo.gif)

> Meilisearch helps the Rust community find crates on [crates.meilisearch.com](https://crates.meilisearch.com)

## Alternatives

Why should you use MeiliSearch instead of any other existing solution? We try to answer this question in this [comparison to alternatives](/resources/comparison_to_alternatives.md). In short, Meilisearch most closely compares with Algolia. Meilisearch stands out by being open source (while commercial) and aims to be simpler to deploy and maintain.

## Features

- **Instant Search** (answers < 50 milliseconds): Priority is given to fast answers for smooth search experience.
- **Search as you type** (_prefix search_): Results are updated on each keystroke. To make this possible, we use a [prefix-search](/guides/advanced_guides/prefix.md#prefix-search).
- [Typo tolerance](/guides/advanced_guides/typotolerance.md#typo-tolerance): Understands typo and miss-spelling.
- [Tokenization](/guides/advanced_guides/tokenization.md) in **English**, **Chinese**, and **all languages that uses space as a word divider**.
- **Return the whole document**: The entire document is returned upon search.
- **Highly customizable search and indexation**:
  - [Custom ranking](/guides/main_concepts/relevancy.md): Customize the relevancy of the search engine and the ranking of the search results.
  - [Stop words](/guides/advanced_guides/stop_words.md): Ignore common non-relevant words like `of` or `the`.
  - [Highlights](/guides/advanced_guides/search_parameters.md#attributes-to-highlight): Highlighted search results in documents
  - Ability to create [synonyms](/guides/advanced_guides/synonyms.md) for a better search experience.
- **RESTful API**
- **Friendly web interface**: [Integrated web interface](/guides/advanced_guides/web_interface.md) in MeiliSearch that allows to try the search engine out during development.

## 🧘‍♀️ Philosophy & usage of MeiliSearch

MeiliSearch aims to be your go-to search backend when you want to build a great search experience for your end-users.
MeiliSearch is designed for end-user search in a not-so-big data collection (< 10M documents).
MeiliSearch is made for [type-as-you-search](https://en.wikipedia.org/wiki/Incremental_search) and [prefix-search](https://en.wikipedia.org/wiki/Trie).

## ⛔️ Anti-pattern

MeiliSearch should **not be your main data store**. MeiliSearch should contain only the data you want your users to search through. The more data MeiliSearch contains, the less relevant it is.

MeiliSearch queries should be sent directly from the front-end. The more proxy there is between MeiliSearch and the end-user, the less fast queries and thus search-experience will be.