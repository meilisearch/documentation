# What Is MeiliSearch?

MeiliSearch is a **RESTful search API**. It aims to be a **ready-to-go solution** for everyone who wants a **fast and relevant search experience** for their end-users ⚡️🔎

Efficient search engines often require a significant investment of resources. They are only accessible to companies with the means necessary to develop a bespoke search solution that fits their needs.

Small-to-medium-sized businesses commonly resort to subpar search engines that incur invisible costs on their user experience and retention due to poor search fulfillment.

That's why we created MeiliSearch: An open source solution accessible to everyone, designed to meet a vast majority of needs. Requiring very little configuration to be installed, yet highly customizable.

Our solution delivers an **instant search experience** including **typo handling**, **filters**, **custom rankings**, and many more [features](#features). Read on to learn more.

## Demo

![crates.io demo gif](/crates-io-demo.gif)

> Meilisearch helps the Rust community find crates on [crates.meilisearch.com](https://crates.meilisearch.com)

## Features

- **Blazing fast** (answers < 50 milliseconds): Priority is given to fast answers for a smooth search experience.
- [Search as you type](/learn/what_is_meilisearch/features.md#search-as-you-type): Results are updated on each keystroke. To make this possible, we use [prefix-search](/reference/under_the_hood/prefix.md#prefix-search).
- [Typo tolerance](/learn/what_is_meilisearch/features.md#typo-tolerance): Understands typoes and misspellings.
- [Tokenization](/reference/under_the_hood/tokenization.md) in **English**, **Chinese**, and **all languages that uses space as a word divider**.
- **Return the whole document**: The entire document is returned upon search.
- **Highly customizable search and indexation**:
  - [Custom ranking](/learn/core_concepts/relevancy.md): Customize the relevancy of the search engine and the ranking of the search results.
  - [Stop words](/reference/features/stop_words.md): Ignore common non-relevant words like `of` or `the`.
  - [Highlighting](/learn/what_is_meilisearch/features.md#highlighting): Highlighted search results in documents
  - [Synonyms](/learn/what_is_meilisearch/features.md#synonyms): define synonyms for a better search experience.
- **RESTful API**
- [Integrated web interface](/reference/features/web_interface.md): allows you to test your search settings without implementing a front-end

## Philosophy

MeiliSearch is committed to providing **open source**, **easy to use**, **customizable** instant search that **focuses on the needs of end-users**.

Read more about [the philosophy of our search engine](/learn/what_is_meilisearch/philosophy.md).

## SDKs and Integrations

Our team and community have worked hard to bring MeiliSearch to almost all popular web development languages, frameworks, and deployment options—and new integrations are constantly in development. Check out [the full list of our integrations](/learn/what_is_meilisearch/sdks.md).

## Alternatives

Why should you use MeiliSearch instead of any other existing solution? We try to answer this question in this [comparison to alternatives](/learn/what_is_meilisearch/comparison_to_alternatives.md). In short, MeiliSearch most closely compares with Algolia. MeiliSearch stands out by being open source (while commercial), and aims to be simpler to deploy and maintain than other competitors.

## Give it a try!

Instead of showing you examples, why not just invite you to test MeiliSearch interactively in the **out-of-the-box web interface** we deliver?

There's no need to write a single line of front-end code. All you need to do is follow [this guide](/reference/features/web_interface.md) to give the search engine a try!

![web interface](/web-interface.png)
