# MeiliSearch Documentation

MeiliSearch is a **RESTful search API**. It aims to be a **ready-to-go solution** for everyone who wants a **fast and relevant search experience** for their end-users ⚡️🔎

[<linkButton text="🚀 GETTING STARTED"/>](/guides/introduction/quick_start_guide.md)

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
- [Tokenization](https://en.wikipedia.org/wiki/Lexical_analysis#Tokenization) in English, Kanji and Latin based languages.
- **Return the whole document**: The entire document is returned upon search.
- **Highly customizable search and indexation**:
  - [Custom ranking](/guides/main_concepts/relevancy.md): Customize the relevancy of the search engine and the ranking of the search results.
  - [Stop words](/guides/advanced_guides/stop_words.md): Ignore common non-relevant words like `of` or `the`.
  - [Highlights](/guides/advanced_guides/search_parameters.md#attributes-to-highlight): Highlighted search results in documents
  - Ability to create [synonyms](/guides/advanced_guides/synonyms.md) for a better search experience.
- **RESTful API**
- **Friendly web interface**: [Integrated web interface](/guides/advanced_guides/web_interface.md) in MeiliSearch that allows to try the search engine out during development.

## Technical features

- Provides [6 default ranking criteria](https://github.com/meilisearch/MeiliSearch/blob/3ea5aa18a209b6973b921542d46a79e1c753c163/meilisearch-core/src/criterion/mod.rs#L106-L111) used to [bucket sort](https://en.wikipedia.org/wiki/Bucket_sort) documents
- Accepts [custom criteria](https://github.com/meilisearch/MeiliSearch/blob/3ea5aa18a209b6973b921542d46a79e1c753c163/meilisearch-core/src/criterion/mod.rs#L20-L29) and can apply them in any custom order
- Supports [ranged queries](https://github.com/meilisearch/MeiliSearch/blob/3ea5aa18a209b6973b921542d46a79e1c753c163/meilisearch-core/src/query_builder.rs#L342), useful for paginating results
- Can [distinct](https://github.com/meilisearch/MeiliSearch/blob/3ea5aa18a209b6973b921542d46a79e1c753c163/meilisearch-core/src/query_builder.rs#L324-L329) and [filter](https://github.com/meilisearch/MeiliSearch/blob/3ea5aa18a209b6973b921542d46a79e1c753c163/meilisearch-core/src/query_builder.rs#L313-L318) returned documents based on context defined rules
- Searches for [concatenated](https://github.com/meilisearch/MeiliSearch/pull/164) and [splitted query words](https://github.com/meilisearch/MeiliSearch/pull/232) to improve the search quality.
- Can store complete documents or only [user schema specified fields](https://github.com/meilisearch/MeiliSearch/blob/3ea5aa18a209b6973b921542d46a79e1c753c163/datasets/movies/schema.toml)
- The [default tokenizer](https://github.com/meilisearch/MeiliSearch/blob/3ea5aa18a209b6973b921542d46a79e1c753c163/meilisearch-tokenizer/src/lib.rs) can index Latin based languages and Kanji characters
- Returns [the matching text areas](https://github.com/meilisearch/MeiliSearch/blob/3ea5aa18a209b6973b921542d46a79e1c753c163/meilisearch-types/src/lib.rs#L49-L65), useful to highlight matched words in results
- Accepts query time search config like the [searchable attributes](https://github.com/meilisearch/MeiliSearch/blob/3ea5aa18a209b6973b921542d46a79e1c753c163/meilisearch-core/src/query_builder.rs#L331-L336)
- Supports [runtime incremental indexing](https://github.com/meilisearch/MeiliSearch/blob/3ea5aa18a209b6973b921542d46a79e1c753c163/meilisearch-core/src/store/mod.rs#L143-L212)


## Performance

When processing a dataset composed of 5M books, each with their own titles and authors, MeiliSearch is able to carry out more than 553 req/sec with an average response time of 21 ms on an Intel i7-7700 (8) @ 4.2GHz.

Requests are made using wrk and scripted to simulate real users' queries.
```
Running 10s test @ http://1.2.3.4:7700
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    21.45ms   15.64ms 214.10ms   85.95%
    Req/Sec   256.48     37.66   330.00     69.50%
  5132 requests in 10.05s, 2.31MB read
Requests/sec:    510.46
Transfer/sec:    234.77KB
```
We also indexed a dataset containing about 12 millions cities names in 24 minutes on a 8 cores, 64 GB of RAM, and a 300 GB NMVe SSD machine.
The size of the resulting database reached 16 GB and search results were presented between 30 ms and 4 seconds for short prefix queries.
