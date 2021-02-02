# Features

All of MeiliSearch's features are provided right out of the box, and can be easily [configured](/reference/features/search_parameters.md). Here are a few of them that you should try out!

## Search-as-you-type

Also called "instant search". Results are delivered while you're still inputting your query. Displayed results are changed in real-time whenever you type additional text into the search box.

## Typo Tolerance

Instead of letting typos ruin your search experience, MeiliSearch will always find the results you expect.
Read more about typo tolerance in [this dedicated guide](/reference/under_the_hood/typotolerance.md).

## Synonyms

![search demo gif](/search-synonyms-typo.gif)

> MeiliSearch in action with `batman` and `joker` defined as synonyms.

Defining synonyms lets you craft a more tailored, intuitive search experience.
Read more about synonyms in [this dedicated guide](/reference/features/synonyms.md).

## Highlighting

[Highlight](/reference/features/search_parameters.md#attributes-to-highlight) query terms so that matches pop out to the eye. Users don't need to read the entire text to find the match.

## Filters

Meilisearch allows you to define [filters](/reference/features/filtering.md) so you can filter through the results based on criteria.

## Faceting

[Faceted search](/reference/features/faceted_search.md) allows you to classify search results into categories and to build intuitive navigation interfaces.

## Placeholder Search

If you make a search without inputting any query words, MeiliSearch will return all the documents in that index sorted by its [custom ranking rules](/reference/features/settings.md#custom-ranking-rule). This feature is called **placeholder search**. It is particularly effective when used with other features such as [faceting or filtering](/reference/features/faceted_search.md#filters-or-facets), which allow users to narrow their searches and browse by category.

Placeholder search is not affected by MeiliSearch's [default ranking rules](/reference/features/settings.md#ranking-rules)—only custom rules added by a user. If no custom rules have been set, the results are displayed in the order of their internal database position.
