# Searchable attributes

_Child route of the [settings route](/reference/settings.md)._

The values associated with attributes in the `searchableAttributes` list are **searched for matching query words**. The order of the list also determines the [attribute ranking order](/learn/core_concepts/relevancy.md#attribute-ranking-order).

Searchable attributes can also be updated directly through the [global settings route](/reference/settings.md#update-settings) along with the other settings.

To learn more about searchable attributes, refer to our [dedicated guide](/learn/configuration/displayed_searchable_attributes.md#searchable-fields).

::: warning
Updating the settings means overwriting the default settings of Meilisearch. You can reset to default values using the `DELETE` routes.
:::

## Get searchable attributes

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/searchable-attributes" />

Get the [searchable attributes](/learn/configuration/displayed_searchable_attributes.md#searchable-fields) of an index.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="get_searchable_attributes_1" />

#### Response: `200 Ok`

List the settings.

```json
[
  "title",
  "overview",
  "genres"
]
```

## Update searchable attributes

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/searchable-attributes" />

Update the [searchable attributes](/learn/configuration/displayed_searchable_attributes.md#searchable-fields) of an index.

::: warning
Due to an implementation bug, manually updating `searchableAttributes` will change the displayed order of document fields in the JSON response. This behavior is inconsistent and will be fixed in a future release.
:::

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

An array of strings that contains searchable attributes sorted by order of importance (arranged from the most important attribute to the least important attribute).

This means that a document with a match in an attribute at the start of the array will be considered more relevant than a document with a match in an attribute at the end of the array.

[More information about the body](/learn/configuration/settings.md#searchable-attributes).

### Example

<CodeSamples id="update_searchable_attributes_1" />

A match in title will make a document more relevant than another document with a match in overview.

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

## Reset searchable attributes

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/searchable-attributes"/>

Reset the [searchable attributes](/learn/configuration/displayed_searchable_attributes.md#searchable-fields) of the index to the default value.

#### Default value

All attributes found in the documents added to the index.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<CodeSamples id="reset_searchable_attributes_1" />

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
