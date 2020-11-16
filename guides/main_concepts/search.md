# Search

MeiliSearch has been designed to improve your search experience.

Today, finding a high-quality search engine may be complicated. Because we realized there was a lack of both powerful and simple solutions, we decided to create MeiliSearch. The **simplicity of use** is our philosophy and it keeps driving the development of MeiliSearch.

## Simple and Intuitive

We aimed for a simple and intuitive experience for both developers and end-users.

For developers, it requires very little configuration to be up and running. Communication to the server is done through a [RESTful API](/references/README.md).

For users, the search experience aims to feel simple so they can focus on the results. MeiliSearch delivers an intuitive search-as-you-type experience; which means a response time lower than 50 milliseconds.

## Highly Customizable

MeiliSearch works out-of-the-box with default settings that meet the needs of most projects.

However, searching is highly customizable.

> It would not be a search engine if there wasn't a notion of relevancy in the results returned.

The returned results are **sorted according to a set of consecutive rules called [ranking rules](/guides/main_concepts/relevancy.md#ranking-rules)**. You can delete existing rules, add new ones, or even change the order in which they are executed.

You can also **configure the [search parameters](/guides/advanced_guides/search_parameters.md)** to refine your search even further. We support [filters](/guides/advanced_guides/filtering.md) and [faceting](/guides/advanced_guides/faceted_search.md).

## Features

![search demo gif](/search-synonyms-typo.gif)

> MeiliSearch in action with `batman` and `joker` being defined as synonyms.

All of MeiliSearch's features are provided out-of-the-box and can be easily [configured](/guides/advanced_guides/search_parameters.md). Here is a few of them that you should try out:

### Search as you type

Also called instant search, results are displayed while you are still inputting your query. Showed results are changed in real-time whenever you type additional text in the search box.

### Typo tolerance

Instead of letting typos ruin your search experience, MeiliSearch will find the results you expect.
Read more about [typo tolerance in this dedicated guide](/guides/advanced_guides/typotolerance.md).

### Synonyms

Search should not be limited by some specific words.
Read more about [synonyms in this dedicated guide](/guides/advanced_guides/synonyms.md).

### Languages support

MeiliSearch supports Latin-based languages, English, and Kanji characters.

### Highlighting

Search results can contain [highlighted](/guides/advanced_guides/search_parameters.md#attributes-to-highlight) queried terms to further enhance usability. Users don't need to read the entire text. The terms are highlighted and thus catch their eye.

### Filters

Meilisearch allows you to define [filters](/guides/advanced_guides/filtering.md) so you can filter through the results based on criteria.

### Faceting

[Faceted search](/guides/advanced_guides/faceted_search.md) is a feature provided out-of-the-box by MeiliSearch. It allows you to classify search results into categories and to build intuitive navigation interfaces.

### Placeholder Search

If you make a search without inputting any query words, MeiliSearch will return all the documents in that index sorted by its [custom ranking rules](guides/advanced_guides/settings.html#custom-ranking-rule). This feature is called **placeholder search**. It is particularly effective when used with other features such as [faceting or filtering](guides/advanced_guides/faceted_search.html#filters-or-facets), which allow users to narrow their searches and browse by category.

Placeholder search is not affected by MeiliSearch's [default ranking rules](guides/advanced_guides/settings.html#ranking-rules)—only custom rules added by a user. If no custom rules have been set, the results are displayed in the order of their internal database position.

### Examples

Here are a few examples of what can be achieved with the [search parameters](/guides/advanced_guides/search_parameters.md):

Results can be paginated using the `limit` and `offset` query parameters.

<CodeSamples id="search_guide_1" />

You can filter results using the `filters` query parameter.

<CodeSamples id="search_guide_2" />

## Give it a try!

Instead of showing you examples, why not just invite you to test MeiliSearch interactively in the **out-of-the-box web interface** we deliver?

There's no need to write a single line of front-end code. All you need to do is follow [this guide](/guides/advanced_guides/web_interface.md) to give the search engine a try!

![web interface](/web-interface.png)
