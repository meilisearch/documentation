# Attributes for Faceting

_Child route of the [settings route](/references/settings.md)._

The attributes that can be used as [facets for faceted search](/guides/advanced_guides/faceted_search.md).

Attributes for faceting can also be updated directly through the [global settings route](/references/settings.md#update-settings) along with the other settings.

[Learn more about faceted search](/guides/advanced_guides/faceted_search.md).

## Get Attributes for Faceting

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/attributes-for-faceting" />

Get the [attributes for faceting](/guides/advanced_guides/faceted_search.md) of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="get_attributes_for_faceting_1" />

#### Response: `200 Ok`

List the settings.

```json
["genres", "director"]
```

## Update Attributes for Faceting

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/attributes-for-faceting" />

Update the [attributes for faceting](/guides/advanced_guides/faceted_search.md) of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

An array of strings that contains the attributes to use as facets.

[More information about the body](/guides/advanced_guides/settings.md#attributes-for-faceting).

### Example

<CodeSamples id="update_attributes_for_faceting_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Reset Attributes for Faceting

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/attributes-for-faceting"/>

Reset the [attributes for faceting](/guides/advanced_guides/faceted_search.md) of the index to the default value.

#### Default value

An empty array (`[]`).

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<CodeSamples id="reset_attributes_for_faceting_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).
