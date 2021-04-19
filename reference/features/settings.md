# Settings

This page describes all the **settings** available in MeiliSearch and how to **configure** them.

| Variable                                                                              | Description                                                                      | Default value                                                                                     |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **[synonyms](/reference/features/settings.md#synonyms)**                          | List of associated words treated similarly                                       | `{}`                                                                                              |
| **[stopWords](/reference/features/settings.md#stop-words)**                       | List of words ignored by MeiliSearch when present in search queries              | `[]`                                                                                              |
| **[attributesForFaceting](/reference/features/settings.md#attributes-for-faceting)** | Attributes to use as facets                                 |    `null`     |
| **[rankingRules](/reference/features/settings.md#ranking-rules)**                 | List of ranking rules sorted by order of importance                              | [A list of ordered built-in ranking rules](/learn/core_concepts/relevancy.md#order-of-the-rules) |
| **[distinctAttribute](/reference/features/settings.md#distinct-attribute)**       | Search returns documents with distinct (different) values of the given field     | `null`                                                                                            |
| **[searchableAttributes](/reference/features/settings.md#searchable-attributes)** | Fields in which to search for matching query words sorted by order of importance | All attributes found in the documents                                                             |
| **[displayedAttributes](/reference/features/settings.md#displayed-attributes)**   | Fields displayed in the returned documents                                       | All attributes found in the documents                                                             |

## Synonyms

A set of words defined for an index. Synonyms are **different words that have the same meaning**, and thus are treated similarly. If either of the associated words is searched, the same results will be displayed.

`synonyms=<Object>`

- `<Object>` (Object, defaults to `{}`) : `{ <String>: [<String>, <String>, ...], ... }`

  An object that contains words with a list of their associated synonyms. Synonym strings are [normalized](/reference/features/synonyms.md#normalization).

[Learn more about synonyms](/reference/features/synonyms.md)

#### Example

Suppose you have an e-commerce dataset. For an index that contains information about tops, you decide to create synonyms for `sweater` and `jumper` since these two items are very similar.

<CodeSamples id="settings_guide_synonyms_1" />

By doing so, when searching for `black sweater`, results for `black jumper` will also be returned.

## Stop words

A set of words defined for an index. Because some words neither add semantic value nor context, you may want to ignore them from your search. Stop words are **ignored during search**.

`stopWords=[<String>, <String>, ...]`

- `[<String>, <String>, ...]` (Array of strings, defaults to `[]`)

  An array of strings that contains the stop words.

[Learn more about stop words](/reference/features/stop_words.md)

#### Example

To add `the`, `a` and `an` to the stop words list, send:

<CodeSamples id="settings_guide_stop_words_1" />

With the settings in the example above, `the`, `a` and `an` are now ignored by the sorting algorithm if they are present in search queries.

Suppose you would like to search `the mask` in a movie database. Since `the` is ignored during search, MeiliSearch will look for every movie containing `mask` and not the millions ones containing `the`. `the` is a less relevant term than `mask` and also a very frequent word in English. By adding `the` to the stop words list, MeiliSearch will ignore this word, and thus be faster to answer without losing in relevancy.

## Attributes For Faceting

Faceted <clientGlossary word="attribute" label="attributes"/> are the attributes used as facets. They **must be added to the settings to be usable as [facet filters](/reference/features/search_parameters.md#facet-filters)**.

`attributesForFaceting=[<Attribute>, ...]`

- `[<Attribute>, ...]` (Array of strings, defaults to `null`)

  An array of strings that contains the attributes to use as facets.

::: warning
  Only fields of data type **string** or **array of strings** can be used for faceting.
  A `null` value will be ignored. In any other case, an error will be thrown.
:::

[Learn more about faceted attributes](/reference/features/faceted_search.md)

#### Example

To be able to facet search on `director` and `genres` in a movie database, you would declare faceted attributes as follows:

<CodeSamples id="faceted_search_update_settings_1" />

## Ranking rules

Built-in ranking rules that **ensure relevancy in search results**. Ranking rules are applied in a default order which can be changed in the settings. You can add or remove rules and change their order of importance.

`rankingRules=[<String>, <String>, ...]`

- `[<String>, <String>, ...]` (Array of strings, see default value below)

  An array of strings that contains the ranking rules sorted by order of importance (arranged from the most important rule to the least important rule).

Default value (the ranking rules in the default order):

```json
["typo", "words", "proximity", "attribute", "wordsPosition", "exactness"]
```

[Read this guide to know more about what each ranking rules does](/learn/core_concepts/relevancy.md)

### Custom ranking rule

You can add a custom ranking rule anywhere in the list of ranking rules. A custom ranking rule is composed of an attribute and an ascending or descending order. The attribute **must have a numeric value** in the documents.

::: warning

If some documents do not contain the attribute defined in a custom ranking rule, the application of the ranking rule is undefined and the search results might not be sorted as you expected.

We recommend that all your documents contain any attribute used in a custom ranking rule. For example, if you set the custom ranking rule `desc(year)`, make sure that all your documents contain the attribute `year`.

:::

#### Example

To add your ranking rules to the settings, send:

<CodeSamples id="settings_guide_ranking_rules_1" />

With the settings in the example above, documents will be sorted by number of typos first. If too many documents have the same number of typos, the `words` rule will be applied. This operation will be repeated with the next rules until the requested number of documents has been reached (default: 20).

## Distinct attribute

The **value of a field** whose attribute is set as a distinct attribute will always be **unique** in the returned documents.

`distinctAttribute=<String>`

- `<String>` (String, defaults to `null`)

  The field name.

[Learn more about the distinct attribute](/reference/features/distinct.md)

#### Example

Suppose you have an e-commerce dataset. For an index that contains information about jackets, you may have several identical items in different variations (color or size).

As shown below, you have 2 documents that contain information about the same jacket. One of the jackets is brown and the other one is black.

```json
[
  {
    "id": 1,
    "description": "Leather jacket",
    "brand": "Lee jeans",
    "color": "brown",
    "product_id": "123456"
  },
  {
    "id": 2,
    "description": "Leather jacket",
    "brand": "Lee jeans",
    "color": "black",
    "product_id": "123456"
  }
]
```

You may want to ignore the different colors of an item. To do so, you can set `product_id` as a `distinctAttribute`.

<CodeSamples id="settings_guide_distinct_1" />

With the settings in the example above, only one of the two documents will be returned if you search `Lee leather jacket`.

## Searchable attributes

The content of the fields whose attributes are added to the [searchable-attributes list](/reference/api/searchable_attributes.md) are **searched for matching query words**.

`searchableAttributes=[<String>, <String>, ...]`

- `[<String>, <String>, ...]` (Array of strings, defaults to all attributes found in the documents)

  An array of strings that contains searchable attributes ordered by importance (arranged from the most important attribute to the least important attribute).

[Learn more about searchable attributes](/reference/features/field_properties.md#searchable-fields)

#### Example

By adding the following settings, the fields `title`, `description` and `genre` will be searched.

<CodeSamples id="settings_guide_searchable_1" />

## Displayed attributes

The fields whose attributes are added to the [displayed-attributes list](/reference/features/field_properties.md) are **contained in each matching document**.

Documents returned upon search contain only displayed fields.

`displayedAttributes=[<String>, <String>, ...]`

- `[<String>, <String>, ...]` (Array of strings, defaults to all attributes found in the documents)

  An array of strings that contains attributes of an index to display.

[Learn more about displayed attributes](/reference/features/field_properties.md#displayed-fields)

#### Example

By adding the following settings, documents returned upon search will contain the fields `title`, `description`, `genre` and `release_date`.

<CodeSamples id="settings_guide_displayed_1" />
