# Faceting

_Child route of the [settings route](/reference/api/settings.md)._

This route allows you to configure the faceting settings for an index.

faceting settings can also be updated directly through the [global settings route](/reference/api/settings.md#update-settings) along with the other settings.

To learn more about filtering and faceting, refer to our [dedicated guide](/learn/advanced/filtering_and_faceted_search.md).

::: warning
Updating the settings means overwriting the default settings of Meilisearch. You can reset to default values using the `DELETE` routes.
:::

## Get faceting settings

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/faceting"/>

Get the faceting settings of an index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Example

<CodeSamples id="get_faceting_settings_1" />

#### Response: `200 OK`

```json
{

}
```

### Returned fields

#### `field_name`

[field explanation]

## Update faceting settings

<RouteHighlighter method="POST" route="/indexes/{index_uid}/settings/faceting"/>

Partially update the faceting settings for an index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Body

#### `field_name`

[field explanation]

#### Example

<CodeSamples id="update_faceting_settings_1" />

#### Response: `200 OK`

```json
{
    "uid": 1,
    "indexUid": "books",
    "status": "enqueued",
    "type": "settingsUpdate",
    "enqueuedAt": "2022-04-14T20:56:44.991039Z"
}
```

You can use the returned `uid` to get more details on [the status of the task](/reference/api/tasks.md#get-task).

## Reset faceting settings

Reset an index's faceting settings to their default value. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

#### Example

<CodeSamples id="reset_faceting_settings_1" />

#### Response: `200 OK`

```json
{
    "uid": 1,
    "indexUid": "books",
    "status": "enqueued",
    "type": "settingsUpdate",
    "enqueuedAt": "2022-04-14T20:53:32.863107Z"
}
```

You can use the returned `uid` to get more details on [the status of the task](/reference/api/tasks.md#get-task).


