# Displayed attributes

_Child route of the [settings route](/reference/settings.md)._

The fields whose attributes are added to the displayed-attributes list are **displayed in each matching document**.
By default, all fields are considered to be `displayedAttributes`. This behavior is represented by the `*` in the settings.  Setting `displayedAttributes` to an empty array `[]` will reset the setting to its default value.

Displayed attributes can also be updated directly through the [global settings route](/reference/settings.md#update-settings) along with the other settings.

To learn more about displayed attributes, refer to our [dedicated guide](/learn/configuration/displayed_searchable_attributes.md#displayed-fields).

::: warning
Updating the settings means overwriting the default settings of Meilisearch. You can reset to default values using the `DELETE` routes.
:::

## Get displayed attributes

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/displayed-attributes" />

Get the [displayed attributes](/learn/configuration/settings.md#displayed-attributes) of an index.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<CodeSamples id="get_displayed_attributes_1"/>

#### Response: `200 Ok`

List the settings.

```json
[
  "title",
  "overview",
  "genres",
  "release_date"
]
```

## Update displayed attributes

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/displayed-attributes" />

Update the [displayed attributes](/learn/configuration/settings.md#displayed-attributes) of an index.

::: note
`displayedAttributes` only impacts search results. It has no effect on other methods of retrieving or copying documents, such as the [GET documents endpoint](/reference/documents.md#get-documents), [dumps](/learn/advanced/dumps.md), or [snapshots](/learn/advanced/snapshots.md).
:::

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

An array of strings that contains attributes of an index to display.

[More information about the body](/learn/configuration/settings.md#displayed-attributes).

#### Example

<CodeSamples id="update_displayed_attributes_1"/>

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

## Reset displayed attributes

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/displayed-attributes"/>

Reset the [displayed attributes](/learn/configuration/settings.md#displayed-attributes) of the index to the default value.

#### Default value

All attributes found in the documents added to the index.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<CodeSamples id="reset_displayed_attributes_1"/>

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
