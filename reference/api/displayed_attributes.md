# Displayed attributes

_Child route of the [settings route](/reference/api/settings.md)._

The fields whose attributes are added to the displayed-attributes list are **displayed in each matching document**.
By default, all fields are considered to be `displayedAttributes`. This behavior is represented by the `*` in the settings.  Setting `displayedAttributes` to an empty array `[]` will reset the setting to its default value.

Displayed attributes can also be updated directly through the [global settings route](/reference/api/settings.md#update-settings) along with the other settings.

::: note
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

[Learn more about displayed fields](/reference/features/field_properties.md#displayed-fields).

## Get displayed attributes

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/displayed-attributes" />

Get the [displayed attributes](/reference/features/settings.md#displayed-attributes) of an index.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<CodeSamples id="get_displayed_attributes_1"/>

#### Response: `200 Ok`

List the settings.

```json
["title", "description", "genre", "release_date"]
```

## Update displayed attributes

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/displayed-attributes" />

Update the [displayed attributes](/reference/features/settings.md#displayed-attributes) of an index.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

An array of strings that contains attributes of an index to display.

[More information about the body](/reference/features/settings.md#displayed-attributes).

#### Example

<CodeSamples id="update_displayed_attributes_1"/>

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/reference/api/updates.md).

## Reset displayed attributes

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/displayed-attributes"/>

Reset the [displayed attributes](/reference/features/settings.md#displayed-attributes) of the index to the default value.

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
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/reference/api/updates.md).
