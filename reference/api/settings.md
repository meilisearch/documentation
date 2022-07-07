# All settings

The `/settings` route allows you to customize search settings for the given index. It is possible to modify all of an index's settings at once using the [`update settings` endpoint](#update-settings), or modify each one individually using the child routes.

These are the reference pages for the child routes:

- [Displayed attributes](/reference/api/displayed_attributes.md)
- [Distinct attribute](/reference/api/distinct_attribute.md)
- [Faceting](/reference/api/faceting.md)
- [Filterable attributes](/reference/api/filterable_attributes.md)
- [Pagination](/reference/api/pagination.md)
- [Ranking rules](/reference/api/ranking_rules.md)
- [Searchable attributes](/reference/api/searchable_attributes.md)
- [Sortable attributes](/reference/api/sortable_attributes.md)
- [Stop-words](/reference/api/stop_words.md)
- [Synonyms](/reference/api/synonyms.md)
- [Typo tolerance](/reference/api/typo_tolerance.md)

To learn more about settings, refer to our [dedicated guide.](/learn/configuration/settings.md)

::: warning
When you update a setting, you overwrite its default value. Use the `DELETE` route to reset any setting to its original value.
:::

## Get settings

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings" />

Get the settings of an index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

[Learn more about the settings.](/learn/configuration/settings.md)

### Response body

| Variable                 | Type      | Description                                                                                | Default value                                                                                |
| ------------------------ | --------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **displayedAttributes**  | [Strings] | Fields displayed in the returned documents                                                 | `["*"]` (all attributes)                                                                     |
| **distinctAttribute**    | String    | Search returns documents with distinct (different) values of the given field               | `null`                                                                                       |
| **faceting**             | Object    | Faceting settings                                                                          | `{}`                                                                                         |
| **filterableAttributes** | [Strings] | Attributes to use as [filters and facets](/learn/advanced/filtering_and_faceted_search.md) | `[]`                                                                                         |
| **pagination**           | Object    | Pagination settings                                                                        | `{}`                                                                                         |
| **rankingRules**         | [Strings] | List of ranking rules sorted by order of importance                                        | [A list of ordered built-in ranking rules](/learn/core_concepts/relevancy.md#built-in-rules) |
| **searchableAttributes** | [Strings] | Fields in which to search for matching query words sorted by order of importance           | `["*"]` (all attributes)                                                                     |
| **sortableAttributes**   | [Strings] | Attributes to use when [sorting](/learn/advanced/sorting.md) search results                | `[]`                                                                                         |
| **stopWords**            | [Strings] | List of words ignored by Meilisearch when present in search queries                        | `[]`                                                                                         |
| **synonyms**             | Object    | List of associated words treated similarly                                                 | `{}`                                                                                         |
| **typoTolerance**        | Object    | Typo tolerance settings                                                                    | `{}`                                                                                         |

[Learn more about the settings in this guide.](/learn/configuration/settings.md)

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
    "words",
    "exactness",
    "desc(release_date)"
  ],
  "filterableAttributes": [
    "genres"
  ],
  "distinctAttribute": null,
  "searchableAttributes": [
    "title",
    "overview",
    "genres"
  ],
  "displayedAttributes": [
    "title",
    "overview",
    "genres",
    "release_date"
  ],
  "stopWords": null,
  "synonyms": {
    "wolverine": [
      "xmen",
      "logan"
    ],
    "logan": [
      "wolverine",
      "xmen"
    ]
  },
  "typoTolerance": {
    "enabled": true, 
    "minWordSizeForTypos": {
        "oneTypo": 5,
        "twoTypos": 10
      },
    "disableOnWords": [],
    "disableOnAttributes": []
  },
  "pagination": {
    "maxTotalHits": 1000
  },
  "faceting": {
    "maxValuesPerFacet": 100
  }
}
```

## Update settings

<RouteHighlighter method="PATCH" route="/indexes/{index_uid}/settings" />

Update the settings of an index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

Passing `null` to an index setting will reset it to its default value.

Updates in the settings route are **partial**. This means that any parameters not provided in the body will be left unchanged.

If the provided index does not exist, it will be created.

[Learn more about the settings in this guide.](/learn/configuration/settings.md)

### Body

| Variable                 | Type      | Description                                                                                | Default value                                                                                |
| ------------------------ | --------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **displayedAttributes**  | [Strings] | Fields displayed in the returned documents                                                 | `["*"]` (all attributes)                                                                     |
| **distinctAttribute**    | String    | Search returns documents with distinct (different) values of the given field               | `null`                                                                                       |
| **faceting**             | Object    | Faceting settings                                                                          | `{}`                                                                                         |
| **filterableAttributes** | [Strings] | Attributes to use as [filters and facets](/learn/advanced/filtering_and_faceted_search.md) | `[]`                                                                                         |
| **pagination**           | Object    | Pagination settings                                                                        | `{}`                                                                                         |
| **rankingRules**         | [Strings] | List of ranking rules sorted by order of importance                                        | [A list of ordered built-in ranking rules](/learn/core_concepts/relevancy.md#built-in-rules) |
| **searchableAttributes** | [Strings] | Fields in which to search for matching query words sorted by order of importance           | `["*"]` (all attributes)                                                                     |
| **sortableAttributes**   | [Strings] | Attributes to use when [sorting](/learn/advanced/sorting.md) search results                | `[]`                                                                                         |
| **stopWords**            | [Strings] | List of words ignored by Meilisearch when present in search queries                        | `[]`                                                                                         |
| **synonyms**             | Object    | List of associated words treated similarly                                                 | `{}`                                                                                         |
| **typoTolerance**        | Object    | Typo tolerance settings                                                                    | `{}`                                                                                         |

### Example

<CodeSamples id="update_settings_1" />

#### Response: `202 Accepted`

```json
{
    "taskUid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "settingsUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

## Reset settings

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings"/>

Reset the settings of an index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

All settings will be reset to their default value.

| Variable                 | Type      | Description                                                                                | Default value                                                                                |
| ------------------------ | --------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **displayedAttributes**  | [Strings] | Fields displayed in the returned documents                                                 | `["*"]` (all attributes)                                                                     |
| **distinctAttribute**    | String    | Search returns documents with distinct (different) values of the given field               | `null`                                                                                       |
| **faceting**             | Object    | Faceting settings                                                                          | `{}`                                                                                         |
| **filterableAttributes** | [Strings] | Attributes to use as [filters and facets](/learn/advanced/filtering_and_faceted_search.md) | `[]`                                                                                         |
| **pagination**           | Object    | Pagination settings                                                                        | `{}`                                                                                         |
| **rankingRules**         | [Strings] | List of ranking rules sorted by order of importance                                        | [A list of ordered built-in ranking rules](/learn/core_concepts/relevancy.md#built-in-rules) |
| **searchableAttributes** | [Strings] | Fields in which to search for matching query words sorted by order of importance           | `["*"]` (all attributes)                                                                     |
| **sortableAttributes**   | [Strings] | Attributes to use when [sorting](/learn/advanced/sorting.md) search results                | `[]`                                                                                         |
| **stopWords**            | [Strings] | List of words ignored by Meilisearch when present in search queries                        | `[]`                                                                                         |
| **synonyms**             | Object    | List of associated words treated similarly                                                 | `{}`                                                                                         |
| **typoTolerance**        | Object    | Typo tolerance settings                                                                    | `{}`                                                                                         |
[Learn more about the settings](/learn/configuration/settings.md).

#### Example

<CodeSamples id="reset_settings_1" />

#### Response: `202 Accepted`

```json
{
    "taskUid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "settingsUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).
