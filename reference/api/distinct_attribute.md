# Distinct attribute

_Child route of the [settings route](/reference/api/settings.md)._

[Distinct attribute](/reference/features/distinct.md) is a field whose value will always be **unique** in the returned documents.

Distinct attribute can also be updated directly through the [global settings route](/reference/api/settings.md#update-settings) along with the other settings.

::: note
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

[Learn more about distinct attribute](/reference/features/settings.md#distinct-attribute).

## Get distinct attribute

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/distinct-attribute" />

Get the [distinct attribute](/reference/features/settings.md#distinct-attribute) field of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="get_distinct_attribute_1" />

#### Response: `200 Ok`

```json
"movie_id"
```

## Update distinct attribute

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/distinct-attribute" />

Update the [distinct attribute](/reference/features/settings.md#distinct-attribute) field of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

A String: the field name.

[More information about the body](/reference/features/settings.md#distinct-attribute).

### Example

<CodeSamples id="update_distinct_attribute_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/reference/api/updates.md).

## Reset distinct attribute

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/distinct-attribute"/>

Reset the [distinct attribute](/reference/features/settings.md#distinct-attribute) field of an index to its default value.

**Default value**: `null`

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<CodeSamples id="reset_distinct_attribute_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/reference/api/updates.md).
