# Distinct attribute

_Child route of the [settings route](/reference/api/settings.md)._

[Distinct attribute](/reference/features/distinct.md) is a field whose value will always be **unique** in the returned documents.

Distinct attribute can also be updated directly through the [global settings route](/reference/api/settings.md#update-settings) along with the other settings.

To learn more about distinct attributes, refer to our [dedicated guide](/reference/features/settings.md#distinct-attribute).

::: warning
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

## Get distinct attribute

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/distinct-attribute" />

Get the [distinct attribute](/reference/features/settings.md#distinct-attribute) field of an index.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="get_distinct_attribute_1" />

#### Response: `200 Ok`

```json
"skuid"
```

## Update distinct attribute

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/distinct-attribute" />

Update the [distinct attribute](/reference/features/settings.md#distinct-attribute) field of an index.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

A String: the field name.

[More information about the body](/reference/features/settings.md#distinct-attribute).

::: warning
If the field does not exist, no error will be thrown.
:::

### Example

<CodeSamples id="update_distinct_attribute_1" />

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

You can use this `uid` to get more details on [the status of the task](/reference/api/tasks.md#get-task-status-by-uid).

## Reset distinct attribute

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/distinct-attribute"/>

Reset the [distinct attribute](/reference/features/settings.md#distinct-attribute) field of an index to its default value.

**Default value**: `null`

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<CodeSamples id="reset_distinct_attribute_1" />

#### Response: `202 Accepted`

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "indexUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `uid` to get more details on [the status of the task](/reference/api/tasks.md#get-task-status-by-uid).
