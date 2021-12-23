# Features

All of MeiliSearch's features are provided right out of the box, and can be easily [configured](/reference/features/search_parameters.md). Here are a few of them that you should try out!

[[toc]]

## Search as you type

Also called "instant search". Results are delivered while you're still inputting your query. Displayed results are changed in real-time whenever you type additional text into the search box.

## Ultra relevant

MeiliSearch's default [relevancy rules](/learn/core_concepts/relevancy.md) are designed to deliver an intuitive search experience with zero setup. They can be [customized](/reference/api/ranking_rules.md) to ensure perfect results for your dataset.

## Typo tolerant

Instead of letting typos ruin your search experience, MeiliSearch will always find the results you expect.
Read more about typo tolerance in [this dedicated guide](/learn/advanced/typotolerance.md).

## Synonyms

![search demo gif](/search-synonyms-typo.gif)

MeiliSearch in action with `batman` and `joker` defined as synonyms.

Defining synonyms lets you craft a more tailored, intuitive search experience.
Read more about synonyms in [this dedicated guide](/reference/features/synonyms.md).

## Highlighting

[Highlight](/reference/features/search_parameters.md#attributes-to-highlight) query terms so that matches pop out to the eye. Users don't need to read the entire text to find the match.

## Filters

MeiliSearch allows you to define [filters](/reference/features/filtering_and_faceted_search.md) so you can filter through the results based on user-defined criteria.

## Faceting

[Faceted search](/reference/features/filtering_and_faceted_search.md) allows you to classify search results into categories and to build intuitive navigation interfaces.

## Sorting

[Sort search results](/reference/features/sorting.md) at query time and let users choose which types of results they want to see first.

## Placeholder search

If you make a search without inputting any query words, MeiliSearch will return all the documents in that index sorted by its [custom ranking rules](/reference/features/settings.md#custom-ranking-rule) and [sorting rules](https://docs.meilisearch.com/reference/features/sorting.html#sorting). This feature is called **placeholder search**.

Placeholder searches are particularly effective when used with other features such as [faceting or filtering](/reference/features/filtering_and_faceted_search.md#filters-or-facets), which allow users to narrow their searches and browse by category. You can read more about this feature in our article on [search parameters](https://docs.meilisearch.com/reference/features/search_parameters.html#placeholder-search).

## Phrase search

If you enclose search terms in double quotes (`"`), MeiliSearch will only return documents that contain those terms in the order they were given. This gives users the option to make more precise search queries.

Phrase search is particularly useful when looking for a single result, such as searching for a book by ISBN. It is also possible to combine phrase searches with MeiliSearch's basic syntax so only parts of a query are matched strictly.

## Comprehensive language support

[MeiliSearch is multilingual](/reference/features/language.md)! We aim to support every language represented in our global community.
