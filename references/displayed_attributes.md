# Displayed attributes

_Child route of the [settings route](/references/settings.md)._

The fields whose attributes are added to the displayed-attributes list are **displayed in each matching document**.

Displayed attributes can also be updated directly through the [global settings route](/references/settings.md#update-settings) at the same time than the other settings.

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

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/displayed-attributes'
```

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

### Examples

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/displayed-attributes' \
  --data '[
      "title",
      "description",
      "release_date",
      "rank",
      "poster"
  ]'
```

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

```bash
$ curl \
  -X DELETE 'http://localhost:7700/indexes/movies/settings/displayed-attributes'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).
