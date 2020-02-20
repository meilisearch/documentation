# Accept new fields

`AcceptNewFields` determines what MeiliSearch should do with new fields found during documents addition.

When `AcceptNewFields` is set to **true** (*default*), every new field will be added to the [searchable-attributes](/references/searchable_attributes.md) and the [displayed-attributes](/references/displayed_attributes.md) list.<br>
When `AcceptNewFields` set to **false**, they will be stored but neither searchable or displayed on the returned documents.

::: tip

When `AcceptNewFields` is false, the fields are still stored. This means you can add them to the [searchable attributes](/references/searchable_attributes.md) list or the [displayed attributes](/references/displayed_attributes.md) list at any time.

:::

Child route of the [settings route](/references/settings.md).

Stop-words can also be updated directly through the [add settings route](/references/settings.md#add-settings) at the same time than the other settings.

## Get accept new fields

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/accept-new-fields" />

Get if MeiliSearch accepts new fields for an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/accept-new-fields'
```

#### Response: `200 Ok`

List the settings.

```json
false
```

## Update accept new fields

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/accept-new-fields" />

Update if MeiliSearch should accept new fields for an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

#### Body

**Boolean** when set to `true`, each field found in the newly added documents will be [searchable](/references/searchable_attributes.md) and [displayed](/references/displayed_attributes.md). When set to `false`, they will only be stored.

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

## Reset accept new fields

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/accept-new-fields"/>

Reset the `acceptNewFields` back to its default value of `true`.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

#### Example
```bash
$ curl \
  -X DELETE 'http://localhost:7700/indexes/movies/settings/accept-new-fields'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).
