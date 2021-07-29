# Filterable attributes

_Child route of the [settings route](/reference/api/settings.md)._

Attributes that can be used as filters for filtering and faceted search. [You can learn more about filtering and faceted search in our dedicated guide.](/reference/features/filtering_and_faceted_search.md)

Filterable attributes can also be updated through the [global settings route](/reference/api/settings.md#update-settings).

## Get filterable attributes

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/filterable-attributes" />

Get an index's [`filterableAttributes`](/reference/features/filtering_and_faceted_search.md).

### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="get_filterable_attributes_1" />

#### Response: `200 Ok`

List the settings.

```json
["genres", "director"]
```

## Update filterable attributes

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/filterable-attributes" />

Update an index's [filterable attributes list](/reference/features/filtering_and_faceted_search.md). This will re-index all documents in the index.

### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Body

An array of strings containing the attributes that can be used as filters at query time.

[You can read more about this setting at the feature reference page.](/reference/features/settings.md#filterable-attributes)

### Example

<CodeSamples id="update_filterable_attributes_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/reference/api/updates.md).

## Reset filterable attributes

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/filterable-attributes"/>

Reset an index's [filterable attributes list](/reference/features/filtering_and_faceted_search.md) back to its default value.

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
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/reference/api/updates.md).
