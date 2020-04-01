# MeiliSearch Documentation

MeiliSearch is a **RESTful search API**. It aims to be the reference **ready-to-go solution** for everyone who wants a **powerful, fast, and relevant search experience** for their end-users ⚡️🔎

[<linkButton text="🚀 GETTING STARTED"/>](/guides/introduction/quick_start_guide.md)

Efficient search engines often require a significant investment of money. Therefore, they are only accessible to companies which have huge financial resources and the means necessary to develop a search solution that fits their needs. Other businesses that lack financial means or do not realize how much the irrelevancy of a search integrated into their application can negatively impact the user experience, end up with poor solutions that are more frustrating than effective, for both the developer and the user.

That's the reason why we created MeiliSearch: an open-source solution accessible to everyone, designed to meet a vast majority of needs, even specific ones. Requiring very little or no configuration to be installed, however highly customizable.

Our solution delivers an **instant search experience**; it handles **typos**; it understands **filters**, **custom rankings**, and many other [features](#features).

[<linkButton text="💡 FAQ"/>](/resources/faq.md)

## Open-source

MeiliSearch is open-source. You can **support the project by starring** [our GitHub repository](https://github.com/meilisearch/MeiliSearch)!

<a class="github-button" href="https://github.com/meilisearch/MeiliSearch" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star meilisearch/MeiliSearch on GitHub">Star</a>
<a class="github-button" href="https://github.com/meilisearch/MeiliSearch/fork" data-icon="octicon-repo-forked" data-size="large" data-show-count="false" aria-label="Fork meilisearch/MeiliSearch on GitHub">Fork</a><!-- prettier-ignore
--><script async defer src="https://buttons.github.io/buttons.js"></script>

## Demo

![crates.io demo gif](/crates-io-demo.gif)

> Meili helps the Rust community find crates on [crates.meilisearch.com](https://crates.meilisearch.com)

## Alternatives

Why should you use MeiliSearch instead of any other existing solution? If it is clear to us, it may not be for you. We try to answer this question in this [comparison to alternatives](/resources/comparison_to_alternatives.md).

## Features

- **Instant Search** (answers < 50 milliseconds): Priority is given to fast answers for smooth search experience.
- **Search as you type** (_prefix search_): Results are updated on each keystroke. To make this possible, we use a [prefix-search](/guides/advanced_guides/prefix.md#prefix-search).
- [Typo tolerance](/guides/advanced_guides/typotolerance.md#typo-tolerance): Understands typo and miss-spelling.
- [Tokenization](https://en.wikipedia.org/wiki/Lexical_analysis#Tokenization) in English, Kanji and Latin based languages.
- **Return the whole document**: The entire document is returned upon search.
- **Highly customizable search and indexation**:
  - [Custom ranking](/guides/main_concepts/relevancy.md): Customize the relevancy of the search engine and the ranking of the search results.
  - [Stop words](/guides/advanced_guides/stop_words.md): Ignore common non-relevant words like `of` or `the`.
  - [Highlights](/guides/advanced_guides/search_parameters.md#attributes-to-highlight): Highlighted search results in documents
  - Ability to create [synonyms](/guides/advanced_guides/synonyms.md) for a better search experience.
- **RESTful API**
- **Friendly web interface**: [Integrated web interface](/guides/advanced_guides/web_interface) in MeiliSearch that allows to try the search engine out during development.
