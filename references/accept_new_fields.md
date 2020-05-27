# Accept new fields

_Child route of the [settings route](/references/settings.md)._

This setting takes a **Boolean value** (`true` or `false`) and defines whether new fields should be automatically added to the [searchable-attributes](/references/searchable_attributes.md) and the [displayed-attributes](/references/displayed_attributes.md).

- If set to `true`, which is the _default_ value, all new fields are automatically added to the [searchable-attributes](/references/searchable_attributes.md) and the [displayed-attributes](/references/displayed_attributes.md) lists.

- If set to `false`, fields are stored but neither searchable nor displayed in returned documents.

::: tip

When `accept-new-fields` is set to **false**, the fields are still stored. This means you can add them to the [searchable attributes](/references/searchable_attributes.md) list or the [displayed attributes](/references/displayed_attributes.md) list at any time.

:::

The `accept-new-fields` value can also be updated directly through the [global settings route](/references/settings.md#update-settings) at the same time than the other settings.

::: note
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

[Learn more about accept new fields](/guides/advanced_guides/settings.md#accept-new-fields)

## Get the accept-new-fields value

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/accept-new-fields" />

Get if MeiliSearch [accepts new fields](/guides/advanced_guides/settings.md#accept-new-fields) for an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<code-samples id="get_accept_new_fields_1"/>

#### Response: `200 Ok`

```json
false
```

## Update the accept-new-fields value

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/accept-new-fields" />

Update if MeiliSearch should [accepts new fields](/guides/advanced_guides/settings.md#accept-new-fields) for an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

This setting takes a **Boolean value**, `true` or `false`, and defaults to `true`.

If `true`, each field found in the newly added documents are searchable and displayed in returned documents.

Otherwise, if `false`, fields are stored but neither searchable nor displayed in returned documents.

### Example

<code-samples id="update_accept_new_fields_1"/>

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).
