---
sidebarDepth:  2
---

# Settings

The `/settings` route allows you to customize search settings for the given index. You can either modify all of an index's settings at once using the [update settings endpoint](#update-settings), or modify each one individually using the child routes.

For a conceptual overview of index settings, refer to our [indexes guide](/learn/core_concepts/indexes.md#index-settings).

## Settings object

By default, the settings object looks like this. All fields are modifiable.

```json
{
  "displayedAttributes": [
    "*"
  ],
  "searchableAttributes": [
    "*"
  ],
  "filterableAttributes": [],
  "sortableAttributes": [],
  "rankingRules":
  [
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness"
  ],
  "stopWords": [],
  "synonyms": {},
  "distinctAttribute": null,
  "typoTolerance": {
    "enabled": true,
    "minWordSizeForTypos": {
      "oneTypo": 5,
      "twoTypos": 9
    },
    "disableOnWords": [],
    "disableOnAttributes": []
  },
  "faceting": {
    "maxValuesPerFacet": 100
  },
  "pagination": {
    "maxTotalHits": 1000
  }
}
```

## All settings

This route allows you to retrieve, configure, or reset all of an index's settings at once.

### Get settings

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings" />

Get the settings of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="get_settings_1" />

##### Response: `200 Ok`

```json
{
  "displayedAttributes": [
    "*"
  ],
  "searchableAttributes": [
    "*"
  ],
  "filterableAttributes": [],
  "sortableAttributes": [],
  "rankingRules":
  [
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness"
  ],
  "stopWords": [],
  "synonyms": {},
  "distinctAttribute": null,
  "typoTolerance": {
    "enabled": true,
    "minWordSizeForTypos": {
      "oneTypo": 5,
      "twoTypos": 9
    },
    "disableOnWords": [],
    "disableOnAttributes": []
  },
  "faceting": {
    "maxValuesPerFacet": 100
  },
  "pagination": {
    "maxTotalHits": 1000
  }
}
```

### Update settings

<RouteHighlighter method="PATCH" route="/indexes/{index_uid}/settings" />

Update the settings of an index.

Passing `null` to an index setting will reset it to its default value.

Updates in the settings route are **partial**. This means that any parameters not provided in the body will be left unchanged.

If the provided index does not exist, it will be created.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

| Name                                                 | Type             | Default value                                                                                                                                            | Description                                                                      |
| :--------------------------------------------------- | :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| **[`displayedAttributes`](#displayed-attributes)**   | Array of strings | All attributes: `["*"]`                                                                                                                                  | Fields displayed in the returned documents                                       |
| **[`distinctAttribute`](#distinct-attribute)**       | String           | `null`                                                                                                                                                   | Search returns documents with distinct (different) values of the given field     |
| **[`faceting`](#faceting)**                          | Object           | Empty                                                                                                                                                    | Faceting settings                                                                |
| **[`filterableAttributes`](#filterable-attributes)** | Array of strings | Empty                                                                                                                                                    | Attributes to use as filters and facets                                          |
| **[`pagination`](#pagination)**                      | Object           | Empty                                                                                                                                                    | Pagination settings                                                              |
| **[`rankingRules`](#ranking-rules)**                 | Array of strings | `["words",`</br>`"typo",`</br>`"proximity",`</br>`"attribute",`</br>`"sort",`</br>`"exactness"]`                                                         | List of ranking rules in order of importance                                     |
| **[`searchableAttributes`](#searchable-attributes)** | Array of strings | All attributes: `["*"]`                                                                                                                                  | Fields in which to search for matching query words sorted by order of importance |
| **[`sortableAttributes`](#sortable-attributes)**     | Array of strings | Empty                                                                                                                                                    | Attributes to use when sorting search results                                    |
| **[`stopWords`](#stop-words)**                       | Array of strings | Empty                                                                                                                                                    | List of words ignored by Meilisearch when present in search queries              |
| **[`synonyms`](#synonyms)**                          | Object           | Empty                                                                                                                                                    | List of associated words treated similarly                                       |
| **[`typoTolerance`](#typo-tolerance)**               | Object           | `{"enabled": true,`</br>`"minWordSizeForTypos":`</br>`{"oneTypo": 5,`</br>`"twoTypos": 9},`</br>`"disableOnWords": [],`</br>`"disableOnAttributes": []}` | Typo tolerance settings                                                          |

#### Example

<CodeSamples id="update_settings_1" />

##### Response: `202 Accepted`

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

### Reset settings

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings"/>

Reset all the settings of an index to their [default value](#settings-object).

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="reset_settings_1" />

##### Response: `202 Accepted`

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

## Displayed attributes

The attributes added to the `displayedAttributes` list are displayed in search results. `displayedAttributes` only affects the search endpoints; it has no impact on the [GET documents endpoint](/reference/api/documents.md#get-documents).

By default, all fields are considered to be `displayedAttributes`. This behavior is represented by the `*` in the settings. Setting `displayedAttributes` to an empty array `[]` will reset the setting to its default value.

To learn more about displayed attributes, refer to our [dedicated guide](/learn/configuration/displayed_searchable_attributes.md#displayed-fields).

### Get displayed attributes

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/displayed-attributes" />

Get the displayed attributes of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="get_displayed_attributes_1"/>

##### Response: `200 Ok`

```json
[
  "title",
  "overview",
  "genres",
  "release_date.year"
]
```

### Update displayed attributes

<RouteHighlighter method="PUT" route="/indexes/{index_uid}/settings/displayed-attributes" />

Update the displayed attributes of an index.

If an attribute contains an object, you can use dot notation to specify one or more of its keys, e.g., `"displayedAttributes": ["release_date.year"]`.

::: note
`displayedAttributes` only impacts search results. It has no effect on other methods of retrieving or copying documents, such as the [GET documents endpoint](/reference/api/documents.md#get-documents), [dumps](/learn/advanced/dumps.md), or [snapshots](/learn/advanced/snapshots.md).
:::

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

An array of strings that contains attributes of an index to display.

[To learn more about displayed attributes, refer to our dedicated guide.](/learn/configuration/displayed_searchable_attributes.md#displayed-fields)

#### Example

<CodeSamples id="update_displayed_attributes_1"/>

##### Response: `202 Accepted`

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

### Reset displayed attributes

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings/displayed-attributes"/>

Reset the displayed attributes of the index to the default value.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="reset_displayed_attributes_1"/>

##### Response: `202 Accepted`

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

## Distinct attribute

Distinct attribute is a field whose value will always be unique in the returned documents.

To learn more about distinct attributes, refer to our [dedicated guide](/learn/configuration/distinct.md).

### Get distinct attribute

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/distinct-attribute" />

Get the distinct attribute field of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="get_distinct_attribute_1" />

##### Response: `200 Ok`

```json
"skuid"
```

### Update distinct attribute

<RouteHighlighter method="PUT" route="/indexes/{index_uid}/settings/distinct-attribute" />

Update the distinct attribute field of an index. This will re-index all documents in the index.

If an attribute contains an object, you can use dot notation to set one or more of its keys as a value for this setting, e.g., `"distinctAttribute": "product.skuid"`.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

A string: the field name.

::: warning
If the field does not exist, no error will be thrown.
:::

[To learn more about the distinct attribute, refer to our dedicated guide.](/learn/configuration/distinct.md)

#### Example

<CodeSamples id="update_distinct_attribute_1" />

##### Response: `202 Accepted`

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

### Reset distinct attribute

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings/distinct-attribute"/>

Reset the distinct attribute field of an index to its default value.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="reset_distinct_attribute_1" />

##### Response: `202 Accepted`

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

## Faceting

In Meilisearch, facets are a specific use-case of filters. This route allows you to define the maximum value returned for all facets.

To learn more about filtering and faceting, refer to our [dedicated guide](/learn/advanced/filtering_and_faceted_search.md).

### Faceting object

| Name                    | Type    | Default value | Description                                                                                                  |
| :---------------------- | :------ | :------------ | :----------------------------------------------------------------------------------------------------------- |
| **`maxValuesPerFacet`** | Integer | `100`         | Maximum number of facet values returned for each facet. Values are sorted in ascending lexicographical order |

### Get faceting settings

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/faceting"/>

Get the faceting settings of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="get_faceting_settings_1" />

##### Response: `200 OK`

```json
{
  "maxValuesPerFacet": 100
}
```

### Update faceting settings

<RouteHighlighter method="PATCH" route="/indexes/{index_uid}/settings/faceting"/>

Partially update the faceting settings for an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

| Name                    | Type    | Default value | Description                                                                                                  |
| :---------------------- | :------ | :------------ | :----------------------------------------------------------------------------------------------------------- |
| **`maxValuesPerFacet`** | Integer | `100`         | Maximum number of facet values returned for each facet. Values are sorted in ascending lexicographical order |

For example, suppose a query's search results contain a total of three values for a `colors` facet: `blue`, `green`, and `red`. If you set `maxValuesPerFacet` to `2`, Meilisearch will only return `blue` and `green` in the response body's `facetDistribution` object.

::: note
Setting `maxValuesPerFacet` to a high value might negatively impact performance.
:::

#### Example

<CodeSamples id="update_faceting_settings_1" />

##### Response: `202 Accepted`

```json
{
  "taskUid": 1,
  "indexUid": "books",
  "status": "enqueued",
  "type": "settingsUpdate",
  "enqueuedAt": "2022-04-14T20:56:44.991039Z"
}
```

You can use the returned `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

### Reset faceting settings

Reset an index's faceting settings to their [default value](#faceting-object).

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="reset_faceting_settings_1" />

##### Response: `200 OK`

```json
{
  "taskUid": 1,
  "indexUid": "books",
  "status": "enqueued",
  "type": "settingsUpdate",
  "enqueuedAt": "2022-04-14T20:53:32.863107Z"
}
```

You can use the returned `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

## Filterable attributes

Attributes in the `filterableAttributes` list can be used as filters for filtering and faceted search.

To learn more about filterable attributes, refer to our [dedicated guide](/learn/advanced/filtering_and_faceted_search.md).

### Get filterable attributes

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/filterable-attributes" />

Get the filterable attributes for an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="get_filterable_attributes_1" />

##### Response: `200 Ok`

List the settings.

```json
[
  "genres",
  "director",
  "release_date.year"
]
```

### Update filterable attributes

<RouteHighlighter method="PUT" route="/indexes/{index_uid}/settings/filterable-attributes" />

Update an index's filterable attributes list. This will re-index all documents in the index.

If an attribute contains an object, you can use dot notation to set one or more of its keys as a value for this setting: `"filterableAttributes": ["release_date.year"]`.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

An array of strings containing the attributes that can be used as filters at query time.

[To learn more about filterable attributes, refer to our dedicated guide.](/learn/advanced/filtering_and_faceted_search.md)

#### Example

<CodeSamples id="update_filterable_attributes_1" />

##### Response: `202 Accepted`

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

### Reset filterable attributes

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings/filterable-attributes"/>

Reset an index's filterable attributes list back to its default value.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="reset_filterable_attributes_1" />

##### Response: `202 Accepted`

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

## Pagination

To protect your database from malicious scraping, Meilisearch only returns 1000 results per search. This route allows you to configure the maximum number of results Meilisearch can return for an index.

To learn more about paginating search results with Meilisearch, refer to our [dedicated guide](/learn/advanced/pagination.md).

### Pagination object

| Name               | Type    | Default value | Description                                          |
| :----------------- | :------ | :------------ | :--------------------------------------------------- |
| **`maxTotalHits`** | Integer | `1000`        | The maximum number of results Meilisearch can return |

### Get pagination settings

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/pagination"/>

Get the pagination settings of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="get_pagination_settings_1" />

##### Response: `200 OK`

```json
{
  "maxTotalHits": 1000
}
```

### Update pagination settings

<RouteHighlighter method="PATCH" route="/indexes/{index_uid}/settings/pagination"/>

Partially update the pagination settings for an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

| Name               | Type    | Default value | Description                                          |
| :----------------- | :------ | :------------ | :--------------------------------------------------- |
| **`maxTotalHits`** | Integer | `1000`        | The maximum number of results Meilisearch can return |

`maxTotalHits` takes priority over search parameters such as `limit` and `offset`.

For example, if you set `maxTotalHits` to 100, you will not be able to access search results beyond 100 no matter the value configured for `offset`.

::: note
Setting `maxTotalHits` to a high value might negatively impact performance and expose instance data to malicious scraping.
:::

#### Example

<CodeSamples id="update_pagination_settings_1" />

##### Response: `202 Accepted`

```json
{
  "taskUid": 1,
  "indexUid": "books",
  "status": "enqueued",
  "type": "settingsUpdate",
  "enqueuedAt": "2022-04-14T20:56:44.991039Z"
}
```

You can use the returned `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

### Reset pagination settings

Reset an index's pagination settings to their [default value](#pagination-object).

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="reset_pagination_settings_1" />

##### Response: `202 Accepted`

```json
{
  "taskUid": 1,
  "indexUid": "books",
  "status": "enqueued",
  "type": "settingsUpdate",
  "enqueuedAt": "2022-04-14T20:53:32.863107Z"
}
```

You can use the returned `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

## Ranking rules

Ranking rules are built-in rules that allow you to customize the relevancy of your search results. They are stored in an array and applied in order of appearance.

To learn more about ranking rules, refer to our [dedicated guide](/learn/core_concepts/relevancy.md).

### Ranking rules array

| Name              | Description                                                                     |
| :---------------- | :------------------------------------------------------------------------------ |
| **`"words"`**     | Sorts results by decreasing number of matched query terms                       |
| **`"typo"`**      | Sorts results by increasing number of typos                                     |
| **`"proximity"`** | Sorts results by increasing distance between matched query terms                |
| **`"attribute"`** | Sorts results based on the attribute ranking order                              |
| **`"sort"`**      | Sorts results based on parameters decided at query time                         |
| **`"exactness"`** | Sorts results based on the similarity of the matched words with the query words |

#### Default order

```json
[
  "words",
  "typo",
  "proximity",
  "attribute",
  "sort",
  "exactness"
]
```

### Get ranking rules

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/ranking-rules" />

Get the ranking rules of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="get_ranking_rules_1" />

##### Response: `200 Ok`

List the settings.

```json
[
  "words",
  "typo",
  "proximity",
  "attribute",
  "sort",
  "exactness",
  "release_date:desc"
]
```

### Update ranking rules

<RouteHighlighter method="PUT" route="/indexes/{index_uid}/settings/ranking-rules" />

Update the ranking rules of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

An array that contain ranking rules sorted by order of importance.

To add your own ranking rule, you have to communicate an attribute followed by a colon (`:`) and either `asc` for ascending order or `desc` for descending order.

- To apply an **ascending sort** (results sorted by increasing value): `attribute_name:asc`

- To apply a **descending sort** (results sorted by decreasing value): `attribute_name:desc`

[To learn more about ranking rules, refer to our dedicated guide.](/learn/core_concepts/relevancy.md#ranking-rules)

#### Example

<CodeSamples id="update_ranking_rules_1" />

##### Response: `202 Accepted`

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

### Reset ranking rules

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings/ranking-rules" />

Reset the ranking rules of an index to their [default value](#default-order).

::: tip
Note that resetting the ranking rules is not the same as removing them.
To remove a ranking rule, use the [add or replace ranking rules route](#update-ranking-rules).
:::

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="reset_ranking_rules_1" />

##### Response: `202 Accepted`

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

## Searchable attributes

The values associated with attributes in the `searchableAttributes` list are searched for matching query words. The order of the list also determines the [attribute ranking order](/learn/core_concepts/relevancy.md#attribute-ranking-order).

To learn more about searchable attributes, refer to our [dedicated guide](/learn/configuration/displayed_searchable_attributes.md#searchable-fields).

### Get searchable attributes

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/searchable-attributes" />

Get the searchable attributes of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="get_searchable_attributes_1" />

##### Response: `200 Ok`

List the settings.

```json
[
  "title",
  "overview",
  "genres",
  "release_date.year"
]
```

### Update searchable attributes

<RouteHighlighter method="PUT" route="/indexes/{index_uid}/settings/searchable-attributes" />

Update the searchable attributes of an index. This will re-index all documents in the index.

If an attribute contains an object, you can use dot notation to set one or more of its keys as a value for this setting: `"searchableAttributes": ["release_date.year"]`.

::: warning
Due to an implementation bug, manually updating `searchableAttributes` will change the displayed order of document fields in the JSON response. This behavior is inconsistent and will be fixed in a future release.
:::

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

An array of strings that contains searchable attributes sorted by order of importance (arranged from the most important attribute to the least important attribute).

This means that a document with a match in an attribute at the start of the array will be considered more relevant than a document with a match in an attribute at the end of the array.

[To learn more about searchable attributes, refer to our dedicated guide.](/learn/configuration/displayed_searchable_attributes.md#searchable-fields)

#### Example

<CodeSamples id="update_searchable_attributes_1" />

A match in title will make a document more relevant than another document with a match in overview.

##### Response: `202 Accepted`

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

### Reset searchable attributes

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings/searchable-attributes"/>

Reset the searchable attributes of the index to the default value.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="reset_searchable_attributes_1" />

##### Response: `202 Accepted`

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

## Sortable attributes

Attributes used when sorting search results. `sortableAttributes` can be used together with the [`sort` search parameter](/reference/api/search.md#sort).

To learn more about sortable attributes, refer to our [dedicated guide](/learn/advanced/sorting.md).

### Get sortable attributes

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/sortable-attributes" />

Get the sortable attributes of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="get_sortable_attributes_1" />

##### Response: `200 Ok`

List the settings.

```json
[
  "price", 
  "author.surname"
]
```

### Update sortable attributes

<RouteHighlighter method="PUT" route="/indexes/{index_uid}/settings/sortable-attributes" />

Update an index's sortable attributes list. This will re-index all documents in the index.

If an attribute contains an object, you can use dot notation to set one or more of its keys as a value for this setting: `"sortableAttributes": ["author.surname"]`.

[You can read more about sorting at query time on our dedicated guide.](/learn/advanced/sorting.md)

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

An array of strings containing the attributes that can be used to sort search results at query time.

[To learn more about sortable attributes, refer to our dedicated guide.](/learn/advanced/sorting.md)

#### Example

<CodeSamples id="update_sortable_attributes_1" />

##### Response: `202 Accepted`

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

### Reset sortable attributes

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings/sortable-attributes"/>

Reset an index's sortable attributes list back to its default value.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="reset_sortable_attributes_1" />

##### Response: `202 Accepted`

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

## Stop words

Adding words to the stop words list causes them to be ignored in future search queries. Small words that appear in almost all of a dataset's documents are prime candidates for this list.

::: note
Stop words are strongly related to the language used in your dataset. For example, most datasets containing English documents will have countless occurrences of `the` and `of`. Italian datasets, instead, will benefit from ignoring words like `a`, `la`, or `il`.
:::

### Get stop words

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/stop-words" />

Get the stop words list of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="get_stop_words_1" />

##### Response: `200 Ok`

```json
[
  "of",
  "the",
  "to"
]
```

### Update stop words

<RouteHighlighter method="PUT" route="/indexes/{index_uid}/settings/stop-words" />

Update the list of stop words of an index. This will re-index all documents in the index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

An array of strings that contains the stop words.

If a list of stop-words already exists it will be overwritten (_replaced_).

#### Example

<CodeSamples id="update_stop_words_1" />

##### Response: `202 Accepted`

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

### Reset stop words

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings/stop-words" />

Reset the list of stop words of an index to its default value.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="reset_stop_words_1" />

##### Response: `202 Accepted`

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

## Synonyms

The `synonyms` object contains words and their respective synonyms. A synonym in Meilisearch is considered equal to its associated word for the purposes of calculating search results.

To learn more about synonyms, refer to our [dedicated guide](/learn/configuration/synonyms.md).

### Get synonyms

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/synonyms"/>

Get the list of synonyms of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="get_synonyms_1" />

##### Response: `200 OK`

```json
{
  "wolverine": [
    "xmen",
    "logan"
  ],
  "logan": [
    "wolverine",
    "xmen"
  ],
  "wow": [
    "world of warcraft"
  ]
}
```

### Update synonyms

<RouteHighlighter method="PUT" route="/indexes/{index_uid}/settings/synonyms"/>

Update the list of synonyms of an index. Synonyms are [normalized](/learn/configuration/synonyms.md#normalization).

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

An object that contains all synonyms and their associated words.

[To learn more about synonyms, refer to our dedicated guide.](/learn/configuration/synonyms.md)

#### Example

<CodeSamples id="update_synonyms_1" />

##### Response: `202 Accepted`

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

### Reset synonyms

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings/synonyms"/>

Reset the list of synonyms of an index to its default value.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="reset_synonyms_1" />

##### Response: `202 Accepted`

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

## Typo tolerance

Typo tolerance helps users find relevant results even when their search queries contain spelling mistakes or typos. It also allows you to set the minimum word size for typos and disable it for specific words or attributes.

To learn more about typo tolerance, refer to our [dedicated guide](/learn/configuration/typo_tolerance.md).

### Typo tolerance object

| Name                               | Type             | Default Value | Description                                                                      |
| :--------------------------------- | :--------------- | :------------ | :------------------------------------------------------------------------------- |
| **`enabled`**                      | Boolean          | `true`        | Whether typo tolerance is enabled or not                                         |
| **`minWordSizeForTypos.oneTypo`**  | Integer          | `5`           | The minimum word size for accepting 1 typo; must be between `0` and `twoTypos`   |
| **`minWordSizeForTypos.twoTypos`** | Integer          | `9`           | The minimum word size for accepting 2 typos; must be between `oneTypo` and `255` |
| **`disableOnWords`**               | Array of strings | `[]`          | An array of words for which the typo tolerance feature is disabled               |
| **`disableOnAttributes`**          | Array of strings | `[]`          | An array of attributes for which the typo tolerance feature is disabled          |

### Get typo tolerance

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/typo-tolerance"/>

Get the typo tolerance settings of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="get_typo_tolerance_1" />

##### Response: `200 OK`

```json
{
  "enabled": true,
  "minWordSizeForTypos": {
    "oneTypo": 5,
    "twoTypos": 9
  },
  "disableOnWords": [],
  "disableOnAttributes": []
}
```

### Update typo tolerance

<RouteHighlighter method="PATCH" route="/indexes/{index_uid}/settings/typo-tolerance"/>

Partially update the typo tolerance settings for an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

| Name                               | Type             | Default Value | Description                                                                      |
| :--------------------------------- | :--------------- | :------------ | :------------------------------------------------------------------------------- |
| **`enabled`**                      | Boolean          | `true`        | Whether typo tolerance is enabled or not                                         |
| **`minWordSizeForTypos.oneTypo`**  | Integer          | `5`           | The minimum word size for accepting 1 typo; must be between `0` and `twoTypos`   |
| **`minWordSizeForTypos.twoTypos`** | Integer          | `9`           | The minimum word size for accepting 2 typos; must be between `oneTypo` and `255` |
| **`disableOnWords`**               | Array of strings | Empty         | An array of words for which the typo tolerance feature is disabled               |
| **`disableOnAttributes`**          | Array of strings | Empty         | An array of attributes for which the typo tolerance feature is disabled          |

#### Example

<CodeSamples id="update_typo_tolerance_1" />

##### Response: `202 Accepted`

```json
{
  "taskUid": 1,
  "indexUid": "books",
  "status": "enqueued",
  "type": "settingsUpdate",
  "enqueuedAt": "2022-04-14T20:56:44.991039Z"
}
```

You can use the returned `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

### Reset typo tolerance

Reset an index's typo tolerance settings to their [default value](#typo-tolerance-object).

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Example

<CodeSamples id="reset_typo_tolerance_1" />

##### Response: `202 Accepted`

```json
{
  "taskUid": 1,
  "indexUid": "books",
  "status": "enqueued",
  "type": "settingsUpdate",
  "enqueuedAt": "2022-04-14T20:53:32.863107Z"
}
```

You can use the returned `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).
