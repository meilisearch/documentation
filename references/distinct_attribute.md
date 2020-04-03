# Distinct attribute

_Child route of the [settings route](/references/settings.md)._

[Distinct attribute](/guides/advanced_guides/distinct.md) is a field whose value will always be unique in the returned documents.

Distinct attribute can also be updated directly through the [global settings route](/references/settings.md#update-settings) at the same time than the other settings.

::: note
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

## Get distinct attribute

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/distinct-attribute" />

Get the distinct attribute field of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/distinct-attribute'
```

#### Response: `200 Ok`

```json
"movie_id"
```

## Update distinct attribute

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/distinct-attribute" />

Update the distinct attribute field of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

String of the field's name.

### Examples

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/distinct-attribute' \
  --data 'movie_id'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Reset distinct attribute

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/distinct-attribute"/>

Reset the distinct attribute field of an index to its default value.

**Default value**: `null`

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

```bash
$ curl \
  -X DELETE 'http://localhost:7700/indexes/movies/settings/distinct-attribute'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).
