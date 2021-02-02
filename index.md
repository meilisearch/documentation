# MeiliSearch Documentation

Welcome to the new MeiliSearch documentation! While it might look similar, you may find that some things have changed.

For starters, our helpful content is now grouped into three categories: **learn**, **create**, and **reference**.

If it's your first time using MeiliSearch or you want a refresher, we recommend starting with some [learning](insert link here). School's back in session!

If you already know the basics of MeiliSearch but could use some help building your site or application, you'll find dozens of useful guides in [create](insert link here).

Finally, if you just want the facts and none of the fluff--believe us, we get it--you should enjoy our [reference-style documentation](insert link here).

## What is MeiliSearch?

MeiliSearch is a **RESTful search API**. It aims to be a **ready-to-go solution** for everyone who wants a **fast and relevant search experience** for their end-users ⚡️🔎

Efficient search engines often require a significant investment of resources. They are only accessible to companies with the means necessary to develop a bespoke search solution that fits their needs.

Small to medium sized businesses commonly resort to subpar search engines that incur invisible costs on their user experience and retention due to poor search fulfillment.

That's why we created MeiliSearch: An open source solution accessible to everyone, designed to meet a vast majority of needs. Requiring very little configuration to be installed, yet highly customizable.

Our solution delivers an **instant search experience**; it handles **typos**; it understands **filters**, **custom rankings**, and many other [features](#features).

## Open-source

MeiliSearch is open source. You can **support the project by starring** [our GitHub repository](https://github.com/meilisearch/MeiliSearch)!

<a class="github-button" href="https://github.com/meilisearch/MeiliSearch" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star meilisearch/MeiliSearch on GitHub">Star</a>
<a class="github-button" href="https://github.com/meilisearch/MeiliSearch/fork" data-icon="octicon-repo-forked" data-size="large" data-show-count="false" aria-label="Fork meilisearch/MeiliSearch on GitHub">Fork</a><!-- prettier-ignore
--><script async defer src="https://buttons.github.io/buttons.js"></script>

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
