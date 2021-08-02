# All settings

[Index](/learn/core_concepts/indexes.md) settings are represented as a [JSON object literal](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON), containing a field for each possible customization option.

It is possible to modify all the settings at once using the [`update settings` endpoint](#update-settings), or individually using the dedicated routes.

These are the reference pages for the dedicated routes:

- [Synonyms](/reference/api/synonyms.md)
- [Stop-words](/reference/api/stop_words.md)
- [Ranking rules](/reference/api/ranking_rules.md)
- [Filterable attributes](/reference/api/filterable_attributes.md)
- [Distinct attribute](/reference/api/distinct_attribute.md)
- [Searchable attributes](/reference/api/searchable_attributes.md)
- [Displayed attributes](/reference/api/displayed_attributes.md)

[Learn more about the settings in this guide.](/reference/features/settings.md)

::: note
When you update a setting, you overwrite its default value. Use the `DELETE` route to reset any setting to its original value.
:::

## Get settings

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings" />

Get the settings of an index.

[Learn more about the settings.](/reference/features/settings.md)

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Response body

| Variable                  | Type      | Description                                                                      | Default value                                                                                     |
| ------------------------  | --------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **synonyms**              | Object    | List of associated words treated similarly                                       | `{}`                                                                                              |
| **stopWords**             | [Strings] | List of words ignored by MeiliSearch when present in search queries              | `[]`                                                                                              |
| **rankingRules**          | [Strings] | List of ranking rules sorted by order of importance                              | [A list of ordered built-in ranking rules](/learn/core_concepts/relevancy.md#default-order) |
| **filterableAttributes** | [Strings] | Attributes to use as [filters and facets](/reference/features/filtering_and_faceted_search.md)         | `[]`                                                                                              |
| **distinctAttribute**     | String    | Search returns documents with distinct (different) values of the given field     | `null`                                                                                            |
| **searchableAttributes**  | [Strings] | Fields in which to search for matching query words sorted by order of importance | `["*"]` (all attributes)                                                                          |
| **displayedAttributes**   | [Strings] | Fields displayed in the returned documents                                       | `["*"]` (all attributes)                                                                                         |

[Learn more about the settings in this guide.](/reference/features/settings.md)

### Example

<CodeSamples id="get_settings_1" />

#### Response: `200 Ok`

List the settings.

```json
{
  "rankingRules": [
    "typo",
    "words",
    "proximity",
    "attribute",
    "wordsPosition",
    "exactness",
    "desc(release_date)"
  ],
  "filterableAttributes": ["genres"],
  "distinctAttribute": null,
  "searchableAttributes": ["title", "description", "genre"],
  "displayedAttributes": [
    "title",
    "description",
    "genre",
    "release_date"
  ],
  "stopWords": null,
  "synonyms": {
    "wolverine": ["xmen", "logan"],
    "logan": ["wolverine", "xmen"]
  }
}
```

## Update settings

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings" />

Update the settings of an index.

Passing `null` to an index setting will reset it to its default value.

Updates in the settings route are **partial**. This means that any parameters not provided in the body will be left unchanged.

If the provided index does not exist, it will be created.

[Learn more about the settings in this guide.](/reference/features/settings.md)

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

| Variable                  | Type      | Description                                                                      | Default value                                                                                     |
| ------------------------  | --------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **synonyms**              | Object    | List of associated words treated similarly                                       | `{}`                                                                                              |
| **stopWords**             | [Strings] | List of words ignored by MeiliSearch when present in search queries              | `[]`                                                                                              |
| **rankingRules**          | [Strings] | List of ranking rules sorted by order of importance                              | [A list of ordered built-in ranking rules](/learn/core_concepts/relevancy.md#default-order) |
| **filterableAttributes** | [Strings] | Attributes to use as [filters and facets](/reference/features/filtering_and_faceted_search.md)         | `[]`                                                                                              |
| **distinctAttribute**     | String    | Search returns documents with distinct (different) values of the given field     | `null`                                                                                            |
| **searchableAttributes**  | [Strings] | Fields in which to search for matching query words sorted by order of importance | `["*"]` (all attributes)                                                                                          |
| **displayedAttributes**   | [Strings] | Fields displayed in the returned documents                                       | `["*"]` (all attributes)                                                                                                                                |

### Example

<CodeSamples id="update_settings_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/reference/api/updates.md).

## Reset settings

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings"/>

Reset the settings of an index.

All settings will be reset to their default value.

| Variable                  | Description                                                                      | Default value                                                                                     |
| ------------------------  | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **synonyms**              | List of associated words treated similarly                                       | `{}`                                                                                              |
| **stopWords**             | List of words ignored by MeiliSearch when present in search queries              | `[]`                                                                                              |
| **rankingRules**          | List of ranking rules sorted by order of importance                              | [A list of ordered built-in ranking rules](/learn/core_concepts/relevancy.md#default-order) |
| **filterableAttributes** | Attributes to use as [filters and facets](/reference/features/filtering_and_faceted_search.md)         | `[]`                                                                                              |
| **distinctAttribute**     | Search returns documents with distinct (different) values of a given field       | `null`                                                                                            |
| **searchableAttributes**  | Fields in which to search for matching query words sorted by order of importance | `["*"]` (all attributes)                                                                          |
| **displayedAttributes**   | Fields displayed in the returned documents documents                             | `["*"]` (all attributes)                                                                          |

[Learn more about the settings](/reference/features/settings.md).

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<CodeSamples id="reset_settings_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/reference/api/updates.md).
