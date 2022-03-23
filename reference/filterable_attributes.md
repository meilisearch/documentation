# Filterable attributes

_Child route of the [settings route](/reference/settings.md)._

Filterable attributes can also be updated through the [global settings route](/reference/settings.md#update-settings).

Attributes that can be used as filters for filtering and faceted search. To learn more about filterable attributes, refer to our [dedicated guide](/learn/advanced/filtering_and_faceted_search.md).

::: warning
Updating the settings means overwriting the default settings of Meilisearch. You can reset to default values using the `DELETE` routes.
:::

## Get filterable attributes

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/filterable-attributes" />

Get an index's [`filterableAttributes`](/learn/advanced/filtering_and_faceted_search.md).

### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="get_filterable_attributes_1" />

#### Response: `200 Ok`

List the settings.

```json
[
  "genres",
  "director"
]
```

## Update filterable attributes

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/filterable-attributes" />

Update an index's [filterable attributes list](/learn/advanced/filtering_and_faceted_search.md). This will re-index all documents in the index.

### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

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

You can use this `uid` to get more details on [the status of the task](/reference/tasks.md#get-task).

## Reset filterable attributes

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/filterable-attributes"/>

Reset an index's [filterable attributes list](/learn/advanced/filtering_and_faceted_search.md) back to its default value.

### Default value

An empty array (`[]`).

### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

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

You can use this `uid` to get more details on [the status of the task](/reference/tasks.md#get-task).
