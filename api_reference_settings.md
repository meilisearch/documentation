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

| Name                                                 | Type             | Default value                                                                                    | Description                                                                      |
| :--------------------------------------------------- | :--------------- | :----------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| **[`displayedAttributes`](#displayed-attributes)**   | Array of strings | All attributes: `["*"]`                                                                          | Fields displayed in the returned documents                                       |
| **[`distinctAttribute`](#distinct-attribute)**       | String           | `null`                                                                                           | Search returns documents with distinct (different) values of the given field     |
| **[`faceting`](#faceting)**                          | Object           | [Default object](#faceting-object)                                                               | Faceting settings                                                                |
| **[`filterableAttributes`](#filterable-attributes)** | Array of strings | Empty                                                                                            | Attributes to use as filters and facets                                          |
| **[`pagination`](#pagination)**                      | Object           | [Default object](#pagination-object)                                                             | Pagination settings                                                              |
| **[`rankingRules`](#ranking-rules)**                 | Array of strings | `["words",`</br>`"typo",`</br>`"proximity",`</br>`"attribute",`</br>`"sort",`</br>`"exactness"]` | List of ranking rules in order of importance                                     |
| **[`searchableAttributes`](#searchable-attributes)** | Array of strings | All attributes: `["*"]`                                                                          | Fields in which to search for matching query words sorted by order of importance |
| **[`sortableAttributes`](#sortable-attributes)**     | Array of strings | Empty                                                                                            | Attributes to use when sorting search results                                    |
| **[`stopWords`](#stop-words)**                       | Array of strings | Empty                                                                                            | List of words ignored by Meilisearch when present in search queries              |
| **[`synonyms`](#synonyms)**                          | Object           | Empty                                                                                            | List of associated words treated similarly                                       |
| **[`typoTolerance`](#typo-tolerance)**               | Object           | [Default object](#typo-tolerance-object)                                                         | Typo tolerance settings                                                          |

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

The attributes added to the `displayedAttributes` list appear in search results. `displayedAttributes` only affects the search endpoints. It has no impact on the [GET documents endpoint](/reference/api/documents.md#get-documents).

By default, the `displayedAttributes` array is equal to all fields in your dataset. This behavior is represented by the value `["*"]`.

[To learn more about displayed attributes, refer to our dedicated guide.](/learn/configuration/displayed_searchable_attributes.md#displayed-fields)

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

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

```
[<String>, <String>, …]
```

An array of strings. Each string should be an attribute that exists in the selected index.

If an attribute contains an object, you can use dot notation to specify one or more of its keys, for example, `"displayedAttributes": ["release_date.year"]`.

::: warning
If the field does not exist, no error will be thrown.
:::

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

The distinct attribute is a field whose value will always be unique in the returned documents.

::: warning
Updating distinct attributes will re-index all documents in the index, which can take some time. We recommend updating your index settings first and then adding documents as this reduces RAM consumption.
:::

[To learn more about the distinct attribute, refer to our dedicated guide.](/learn/configuration/distinct.md)

### Get distinct attribute

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/distinct-attribute" />

Get the distinct attribute of an index.

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

Update the distinct attribute field of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

```
<String>
```

A string. The string should be an attribute that exists in the selected index.

If an attribute contains an object, you can use dot notation to set one or more of its keys as a value for this setting, for example, `"distinctAttribute": "product.skuid"`.

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

Reset the distinct attribute of an index to its default value.

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

With Meilisearch, you can create [faceted search interfaces](/learn/advanced/filtering_and_faceted_search.md#faceted-search). This setting allows you to define the maximum number of values returned by the `facets` search parameter.

[To learn more about filtering and faceting, refer to our dedicated guide.](/learn/advanced/filtering_and_faceted_search.md)

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

Partially update the faceting settings for an index. Any parameters not provided in the body will be left unchanged.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

```
{maxValuesPerFacet: <Integer>}
```

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

Attributes in the `filterableAttributes` list can be used as filters or facets.

::: warning
Updating filterable attributes will re-index all documents in the index, which can take some time. We recommend updating your index settings first and then adding documents as this reduces RAM consumption.
:::

[To learn more about filterable attributes, refer to our dedicated guide.](/learn/advanced/filtering_and_faceted_search.md)

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

```json
[
  "genres",
  "director",
  "release_date.year"
]
```

### Update filterable attributes

<RouteHighlighter method="PUT" route="/indexes/{index_uid}/settings/filterable-attributes" />

Update an index's filterable attributes list.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

```
[<String>, <String>, …]
```

An array of strings containing the attributes that can be used as filters at query time.

If an attribute contains an object, you can use dot notation to set one or more of its keys as a value for this setting: `"filterableAttributes": ["release_date.year"]`.

::: warning
If the field does not exist, no error will be thrown.
:::

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

To protect your database from malicious scraping, Meilisearch has a default limit of 1000 results per search. This setting allows you to configure the maximum number of results returned per search.

`maxTotalHits` takes priority over search parameters such as `limit`, `offset`, `hitsPerPage`, and `page`.

For example, if you set `maxTotalHits` to 100, you will not be able to access search results beyond 100 no matter the value configured for `offset`.

[To learn more about paginating search results with Meilisearch, refer to our dedicated guide.](/learn/advanced/pagination.md)

### Pagination object

| Name               | Type    | Default value | Description                                                 |
| :----------------- | :------ | :------------ | :---------------------------------------------------------- |
| **`maxTotalHits`** | Integer | `1000`        | The maximum number of search results Meilisearch can return |

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

```
{maxTotalHits: <Integer>}
```

| Name               | Type    | Default value | Description                                                 |
| :----------------- | :------ | :------------ | :---------------------------------------------------------- |
| **`maxTotalHits`** | Integer | `1000`        | The maximum number of search results Meilisearch can return |

::: warning
Setting `maxTotalHits` to a value higher than the default will negatively impact search performance. Setting `maxTotalHits` to values over `20000` may result in queries taking seconds to complete.
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

Ranking rules are built-in rules that rank search results according to certain criteria. They are applied in the same order in which they appear in the `rankingRules` array.

[To learn more about ranking rules, refer to our dedicated guide.](/learn/core_concepts/relevancy.md)

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

```
[<String>, <String>, …]
```

An array that contains ranking rules in order of importance.

To create a custom ranking rule, give an attribute followed by a colon (`:`) and either `asc` for ascending order or `desc` for descending order.

- To apply an **ascending sort** (results sorted by increasing value): `attribute_name:asc`
- To apply a **descending sort** (results sorted by decreasing value): `attribute_name:desc`

::: warning
If some documents do not contain the attribute defined in a custom ranking rule, the application of the ranking rule is undefined and the search results might not be sorted as you expected.

Make sure that any attribute used in a custom ranking rule is present in all of your documents. For example, if you set the custom ranking rule `desc(year)`, make sure that all your documents contain the attribute `year`.
:::

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
Resetting ranking rules is not the same as removing them. To remove a ranking rule, use the [update ranking rules endpoint](#update-ranking-rules).
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

By default, the `searchableAttributes` array is equal to all fields in your dataset. This behavior is represented by the value `["*"]`.

::: warning
Updating searchable attributes will re-index all documents in the index, which can take some time. We recommend updating your index settings first and then adding documents as this reduces RAM consumption.
:::

[To learn more about searchable attributes, refer to our dedicated guide.](/learn/configuration/displayed_searchable_attributes.md#searchable-fields)

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

Update the searchable attributes of an index.

::: warning
Due to an implementation bug, manually updating `searchableAttributes` will change the displayed order of document fields in the JSON response. This behavior is inconsistent and will be fixed in a future release.
:::

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

```
[<String>, <String>, …]
```

An array of strings. Each string should be an attribute that exists in the selected index. The array should be given in [order of importance](/learn/core_concepts/relevancy.md#attribute-ranking-order): from the most important attribute to the least important attribute.

If an attribute contains an object, you can use dot notation to set one or more of its keys as a value for this setting: `"searchableAttributes": ["release_date.year"]`.

::: warning
If the field does not exist, no error will be thrown.
:::

[To learn more about searchable attributes, refer to our dedicated guide.](/learn/configuration/displayed_searchable_attributes.md#searchable-fields)

#### Example

<CodeSamples id="update_searchable_attributes_1" />

In this example, a document with a match in `title` will be more relevant than another document with a match in `overview`.

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

Attributes that can be used when sorting search results using the [`sort` search parameter](/reference/api/search.md#sort).

::: warning
Updating sortable attributes will re-index all documents in the index, which can take some time. We recommend updating your index settings first and then adding documents as this reduces RAM consumption.
:::

[To learn more about sortable attributes, refer to our dedicated guide.](/learn/advanced/sorting.md)

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

```json
[
  "price", 
  "author.surname"
]
```

### Update sortable attributes

<RouteHighlighter method="PUT" route="/indexes/{index_uid}/settings/sortable-attributes" />

Update an index's sortable attributes list.

[You can read more about sorting at query time on our dedicated guide.](/learn/advanced/sorting.md)

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

```
[<String>, <String>, …]
```

An array of strings. Each string should be an attribute that exists in the selected index.

If an attribute contains an object, you can use dot notation to set one or more of its keys as a value for this setting: `"sortableAttributes": ["author.surname"]`.

::: warning
If the field does not exist, no error will be thrown.
:::

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

Words added to the `stopWords` list are ignored in future search queries.

::: warning
Updating stop words will re-index all documents in the index, which can take some time. We recommend updating your index settings first and then adding documents as this reduces RAM consumption.
:::

::: tip
Stop words are strongly related to the language used in your dataset. For example, most datasets containing English documents will have countless occurrences of `the` and `of`. Italian datasets, instead, will benefit from ignoring words like `a`, `la`, or `il`.

[This website maintained by a French developer](https://sites.google.com/site/kevinbouge/stopwords-lists) offers lists of possible stop words in different languages. Note that, depending on your dataset and use case, you will need to tweak these lists for optimal results.
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

Update the list of stop words of an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

```
[<String>, <String>, …]
```

An array of strings. Each string should be a single word.

If a list of stop words already exists, it will be overwritten (_replaced_).

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

[To learn more about synonyms, refer to our dedicated guide.](/learn/configuration/synonyms.md)

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

```
{
  <String>: [<String>, <String>, …],
  …
}
```

An object that contains all synonyms and their associated words. Add the associated words in an array to set a synonym for a word.

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

Typo tolerance helps users find relevant results even when their search queries contain spelling mistakes or typos. This setting allows you to configure the minimum word size for typos and disable typo tolerance for specific words or attributes.

[To learn more about typo tolerance, refer to our dedicated guide.](/learn/configuration/typo_tolerance.md)

### Typo tolerance object

| Name                               | Type             | Default Value | Description                                                                      |
| :--------------------------------- | :--------------- | :------------ | :------------------------------------------------------------------------------- |
| **`enabled`**                      | Boolean          | `true`        | Whether typo tolerance is enabled or not                                         |
| **`minWordSizeForTypos.oneTypo`**  | Integer          | `5`           | The minimum word size for accepting 1 typo; must be between `0` and `twoTypos`   |
| **`minWordSizeForTypos.twoTypos`** | Integer          | `9`           | The minimum word size for accepting 2 typos; must be between `oneTypo` and `255` |
| **`disableOnWords`**               | Array of strings | Empty         | An array of words for which the typo tolerance feature is disabled               |
| **`disableOnAttributes`**          | Array of strings | Empty         | An array of attributes for which the typo tolerance feature is disabled          |

### Get typo tolerance settings

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

### Update typo tolerance settings

<RouteHighlighter method="PATCH" route="/indexes/{index_uid}/settings/typo-tolerance"/>

Partially update the typo tolerance settings for an index.

#### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

#### Body

```
{
  "enabled": <Boolean>,
  "minWordSizeForTypos": {
    "oneTypo": <Integer>,
    "twoTypos": <Integer>
  },
  "disableOnWords": [<String>, <String>, …],
  "disableOnAttributes": [<String>, <String>, …]
}
```

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

### Reset typo tolerance settings

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings/typo-tolerance"/>

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
