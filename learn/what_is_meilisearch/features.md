---

sidebarDepth: 2

---

# Features

Meilisearch is a flexible and powerful user-focused search engine. Here are some of its major features.

## Search as you type

Also called "instant search". Results are delivered while you're still inputting your query. Displayed results are changed in real-time whenever you type additional text into the search box.

## Ultra relevant

Meilisearch's default [relevancy rules](/learn/core_concepts/relevancy.md) are designed to deliver an intuitive search experience with zero setup. They can be [customized](/reference/api/settings.md#ranking-rules) to ensure perfect results for your dataset.

## Typo tolerant

Instead of letting typos ruin your search experience, Meilisearch will always find the results you expect. Read more about typo tolerance in [this dedicated guide](/learn/configuration/typo_tolerance.md).

## Synonyms

[Define synonyms](/learn/configuration/synonyms.md) and craft a tailored, intuitive search experience.

## Highlighting

[Highlight](/reference/api/search.md#attributes-to-highlight) query terms and help users immediately find the matched text in a document.

## Geosearch

Search in the real world. [Geosearch](/learn/advanced/geosearch.md), also known as location-based search, allows you to filter and sort results based on their geographic location.

## Filtering

Create [filters](/learn/advanced/filtering_guide.md) to refine results based on user-defined criteria.

## Faceting

Classify search results into categories and build intuitive navigation interfaces with [faceted search](/learn/advanced/faceted_search.md).

## Sorting

[Sort search results](/learn/advanced/sorting.md) at query time and let users choose which results they want to see first.

## API key management

Protect your instance with [API keys](/learn/security/master_api_keys.md). Set expiration dates and control access to indexes and endpoints so that your data is always safe.

## Multitenancy

Manage complex multi-user applications. [Tenant tokens](/learn/security/tenant_tokens.md) help you decide which documents each one of your users can search.

## Index swapping

Use [index swapping](/learn/core_concepts/indexes.md#swapping-indexes) to deploy major database updates with zero search downtime.

## Comprehensive language support

[Meilisearch is multilingual](/learn/what_is_meilisearch/language.md)! We aim to support every language represented in our global community.

## Phrase search

[Wrap search terms in double quotes (`"`) for strict queries](/reference/api/search.md#phrase-search) that only return exact matches.

## Multi-index search

Perform [multiple search queries on one or more indexes with a single HTTP request](/reference/api/multi_search.md).
