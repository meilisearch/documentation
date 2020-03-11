# MeiliSearch Documentation

MeiliSearch is a **RESTful search API** that is the **ready-to-go solution** for everyone wanting a **powerful, fast, and relevant search experience** for their end-users ⚡️🔎

<linkButton method="GET" text="🚀 GETTING STARTED" url="/guides/getting_started/quick_start_guide.html"/>

Efficient search engines are often only accessible to companies with the financial means and resources necessary to develop a search solution adapted to their needs. The majority of other companies that do not have the means or do not realize that the lack of relevance of a search greatly impacts the pleasure of navigation on their application,
end up with poor solutions that are more frustrating than effective, for both the developer and the user.

That's why we created MeiliSearch, an open-source solution accessible to everyone, meeting the vast majority of needs, even specific ones. Installable very easily with little or no configuration required but with a high capacity for customization.

Our solution is **instant**; it **accepts typos**; it understands **filters**, **custom rankings**, and a lot of other [features](/#features).

## Open-source

MeiliSearch is open-source. You can **support the project by starring** it on [our GitHub](https://github.com/meilisearch/MeiliSearch)!

<a class="github-button" href="https://github.com/meilisearch/MeiliSearch" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star meilisearch/MeiliSearch on GitHub">Star</a>
<a class="github-button" href="https://github.com/meilisearch/MeiliSearch/fork" data-icon="octicon-repo-forked" data-size="large" data-show-count="false" aria-label="Fork meilisearch/MeiliSearch on GitHub">Fork</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

## Demo

![crates.io demo gif](/crates-io-demo.gif)
> Meili helps the Rust community find crates on [crates.meilisearch.com](https://crates.meilisearch.com)

## Features

* **Instant Search** (answers < 50ms): Priority on fast answers for smooth search experience.
* **Search as you type** (*prefix search*): Results are updated on each keystroke. To make this possible, we use a [prefix-search](/guides/advanced_guides/prefix.md#prefix-search).
* [Typo tolerance](/guides/advanced_guides/typotolerance.md#typo-tolerance): Understands typo and spelling mistakes.
* [Tokenization](https://en.wikipedia.org/wiki/Lexical_analysis#Tokenization) in English, kanji and latin based languages.
* **Return the whole document**: The entire document is returned upon search.
* **Highly customizable search and indexation**:
    - [Custom ranking](/guides/main_concepts/relevancy.md): Customize the relevancy of the search engine and the ranking of the search results.
    - [Stop-words](/guides/advanced_guides/stop_words.md): Ignore common non-relevant words like `of`, `the`, ..
    - [Highlights](/guides/advanced_guides/search_parameters.md#attributes-to-highlight): Highlighted search results in documents
    - Ability to create [synonyms](/guides/advanced_guides/synonyms.md) for a better search experience.
* **RESTful API**
* **Friendly web interface**: [Integrated web interface](/guides/advanced_guides/web_interface) in MeiliSearch that lets you try the search engine when developing.
