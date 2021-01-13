# Searchable attributes

_Child route of the [settings route](/references/settings.md)._

The values associated with attributes in the `searchableAttributes` list are **searched for matching query words**. The order of the list also determines the [attribute ranking order](/guides/main_concepts/relevancy.md#attribute-ranking-order).

Searchable attributes can also be updated directly through the [global settings route](/references/settings.md#update-settings) along with the other settings.

::: note
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

[Learn more about searchable fields](/guides/advanced_guides/field_properties.md#searchable-fields).

## Get searchable attributes

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/searchable-attributes" />

Get the [searchable attributes](/guides/advanced_guides/field_properties.md#searchable-fields) of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="get_searchable_attributes_1" />

#### Response: `200 Ok`

List the settings.

```json
["title", "description", "uid"]
```

## Update searchable attributes

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/searchable-attributes" />

Update the [searchable attributes](/guides/advanced_guides/field_properties.md#searchable-fields) of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

An array of strings that contains searchable attributes sorted by order of importance (arranged from the most important attribute to the least important attribute).

This means that a document with a match in an attribute at the start of the array will be considered more relevant than a document with a match in an attribute at the end of the array.

[More information about the body](/guides/advanced_guides/settings.md#searchable-attributes).

### Example

<CodeSamples id="update_searchable_attributes_1" />

A match in title will make a document more relevant than another document with a match in description.

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Reset searchable attributes

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/searchable-attributes"/>

Reset the [searchable attributes](/guides/advanced_guides/field_properties.md#searchable-fields) of the index to the default value.

#### Default value

All attributes found in the documents added to the index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<CodeSamples id="reset_searchable_attributes_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).
