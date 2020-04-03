# Accept new fields

_Child route of the [settings route](/references/settings.md)._

This setting takes a Boolean value and defines whether new fields should be added to the searchable-attributes and the displayed-attributes lists. It can take the value of **true** or **false** and defaults to **true**.

- If set to `true`, which is the _default_ value, all new fields are automatically added to the [searchable-attributes](/references/searchable_attributes.md) and the [displayed-attributes](/references/displayed_attributes.md) lists.

- If set to `false`, fields are stored but neither searchable nor displayed in returned documents.

::: tip

When `accept-new-fields` is set to **false**, the fields are still stored. This means you can add them to the [searchable attributes](/references/searchable_attributes.md) list or the [displayed attributes](/references/displayed_attributes.md) list at any time.

:::

The `accept-new-fields` value can also be updated directly through the [global settings route](/references/settings.md#update-settings) at the same time than the other settings.

::: note
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

## Get the accept-new-fields value

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/accept-new-fields" />

Get if MeiliSearch accepts new fields for an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/accept-new-fields'
```

#### Response: `200 Ok`

```json
false
```

## Update the accept-new-fields value

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/accept-new-fields" />

Update if MeiliSearch should accept new fields for an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

This field takes a **boolean value**, `true` or `false`, and defaults to `true`.

If `true`, each field found in the newly added documents will be [searchable](/references/searchable_attributes.md) and [displayed](/references/displayed_attributes.md).

Otherwise, if `false`, fields will only be stored.

### Examples

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/accept-new-fields' \
  --data 'false'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).
