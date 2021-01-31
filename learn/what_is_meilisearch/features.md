# Features

![search demo gif](/search-synonyms-typo.gif)

> MeiliSearch in action with `batman` and `joker` being defined as synonyms.

All of MeiliSearch's features are provided out-of-the-box and can be easily [configured](/guides/advanced_guides/search_parameters.md). Here is a few of them that you should try out:

## Search as you type

Also called instant search, results are displayed while you are still inputting your query. Showed results are changed in real-time whenever you type additional text in the search box.

## Typo tolerance

Instead of letting typos ruin your search experience, MeiliSearch will find the results you expect.
Read more about [typo tolerance in this dedicated guide](/guides/advanced_guides/typotolerance.md).

## Synonyms

Search should not be limited by some specific words.
Read more about [synonyms in this dedicated guide](/guides/advanced_guides/synonyms.md).

## Languages support

MeiliSearch supports Latin-based languages, English, and Kanji characters.

## Highlighting

Search results can contain [highlighted](/guides/advanced_guides/search_parameters.md#attributes-to-highlight) queried terms to further enhance usability. Users don't need to read the entire text. The terms are highlighted and thus catch their eye.

## Filters

Meilisearch allows you to define [filters](/guides/advanced_guides/filtering.md) so you can filter through the results based on criteria.

## Faceting

[Faceted search](/guides/advanced_guides/faceted_search.md) is a feature provided out-of-the-box by MeiliSearch. It allows you to classify search results into categories and to build intuitive navigation interfaces.

## Placeholder Search

If you make a search without inputting any query words, MeiliSearch will return all the documents in that index sorted by its [custom ranking rules](/guides/advanced_guides/settings.md#custom-ranking-rule). This feature is called **placeholder search**. It is particularly effective when used with other features such as [faceting or filtering](/guides/advanced_guides/faceted_search.md#filters-or-facets), which allow users to narrow their searches and browse by category.

Placeholder search is not affected by MeiliSearch's [default ranking rules](/guides/advanced_guides/settings.md#ranking-rules)—only custom rules added by a user. If no custom rules have been set, the results are displayed in the order of their internal database position.

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