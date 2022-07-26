# Faceting

_Child route of the [settings route](/reference/api/settings.md)._

This route allows you to configure the faceting settings for an index.

Faceting settings can also be updated directly through the [global settings route](/reference/api/settings.md#update-settings) along with the other settings.

To learn more about filtering and faceting, refer to our [dedicated guide](/learn/advanced/filtering_and_faceted_search.md).

::: warning
Updating the settings means overwriting the default settings of Meilisearch. You can reset to default values using the `DELETE` routes.
:::

## Get faceting settings

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/faceting"/>

Get the [faceting settings](/reference/api/settings_object.md#faceting) of an index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

#### Example

<CodeSamples id="get_faceting_settings_1" />

#### Response: `200 OK`

```json
{
  "maxValuesPerFacet": 100
}
```

## Update faceting settings

<RouteHighlighter method="PATCH" route="/indexes/{index_uid}/settings/faceting"/>

Partially update the [faceting settings](/reference/api/settings_object.md#faceting) for an index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Body

| Name                | Type    | Description                                                                                                  | Default value |
|---------------------|---------|--------------------------------------------------------------------------------------------------------------|---------------|
| `maxValuesPerFacet` | Integer | Maximum number of facet values returned for each facet. Values are sorted in ascending lexicographical order | `100`         |

For example, suppose a query's search results contain a total of three values for a `colors` facet: `blue`, `green`, and `red`. If you set `maxValuesPerFacet` to `2`, Meilisearch will only return `blue` and `green` in the response body's `facetDistribution` object.

::: note
Setting `maxValuesPerFacet` to a high value might negatively impact performance.
:::

#### Example

<CodeSamples id="update_faceting_settings_1" />

#### Response: `202 Accepted`

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

## Reset faceting settings

Reset an index's [faceting settings](/reference/api/settings_object.md#faceting) to their default value. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Default value

```json
{
  "maxValuesPerFacet": 100
}
```

#### Example

<CodeSamples id="reset_faceting_settings_1" />

#### Response: `200 OK`

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
