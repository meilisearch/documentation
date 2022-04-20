# Filterable attributes

_Child route of the [settings route](/reference/api/settings.md)._

Filterable attributes can also be updated through the [global settings route](/reference/api/settings.md#update-settings).

Attributes that can be used as filters for filtering and faceted search. To learn more about filterable attributes, refer to our [dedicated guide](/learn/advanced/filtering_and_faceted_search.md).

::: warning
Updating the settings means overwriting the default settings of Meilisearch. You can reset to default values using the `DELETE` routes.
:::

## Get filterable attributes

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/filterable-attributes" />

Get an index's [`filterableAttributes`](/learn/advanced/filtering_and_faceted_search.md). The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Example

<CodeSamples id="get_filterable_attributes_1" />

#### Response: `200 Ok`

List the settings.

```json
[
  "genres",
  "director",
  "release_date.year"
]
```

## Update filterable attributes

<RouteHighlighter method="POST" route="/indexes/{index_uid}/settings/filterable-attributes" />

Update an index's [filterable attributes list](/learn/advanced/filtering_and_faceted_search.md). This will re-index all documents in the index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

If your dataset contains nested structures, you can use dot notation to set a nested field as a filterable attribute.

### Body

An array of strings containing the attributes that can be used as filters at query time.

[You can read more about this setting at the feature reference page.](/learn/configuration/settings.md#filterable-attributes)

### Example

<CodeSamples id="update_filterable_attributes_1" />

#### Response: `202 Accepted`

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "settingsUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `uid` to get more details on [the status of the task](/reference/api/tasks.md#get-task).

## Reset filterable attributes

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings/filterable-attributes"/>

Reset an index's [filterable attributes list](/learn/advanced/filtering_and_faceted_search.md) back to its default value. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Default value

An empty array (`[]`).

### Example

<CodeSamples id="reset_filterable_attributes_1" />

#### Response: `202 Accepted`

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "settingsUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `uid` to get more details on [the status of the task](/reference/api/tasks.md#get-task).
