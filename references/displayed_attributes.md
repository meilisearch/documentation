# Displayed attributes

_Child route of the [settings route](/references/settings.md)._

The `displayedAttributes` list is automatically updated when [new field](/guides/advanced_guides/field_properties.md#new-fields-and-known-fields) are found in documents and when `acceptNewFields` is set to true (default).
The fields whose attributes are added to the displayed-attributes list are **displayed in each matching document**.

Displayed attributes can also be updated directly through the [global settings route](/references/settings.md#update-settings) along with the other settings.

::: note
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

[Learn more about displayed fields](/guides/advanced_guides/field_properties.md#displayed-fields).

## Get displayed attributes

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/displayed-attributes" />

Get the [displayed attributes](/guides/advanced_guides/settings.md#displayed-attributes) of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<code-samples id="get_displayed_attributes_1"/>

#### Response: `200 Ok`

List the settings.

```json
["title", "description", "release_date", "rank", "poster"]
```

## Update displayed attributes

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/displayed-attributes" />

Update the [displayed attributes](/guides/advanced_guides/settings.md#displayed-attributes) of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

An array of strings that contains attributes of an index to display.

[More information about the body](/guides/advanced_guides/settings.md#displayed-attributes).

#### Example

<code-samples id="update_displayed_attributes_1"/>

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Reset displayed attributes

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/displayed-attributes"/>

Reset the [displayed attributes](/guides/advanced_guides/settings.md#displayed-attributes) of the index to the default value.

#### Default value

All attributes found in the documents added to the index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<code-samples id="reset_displayed_attributes_1"/>

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).
