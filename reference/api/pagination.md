# Pagination

_Child route of the [settings route](/reference/api/settings.md)._

This route allows you to configure the pagination settings for an index.

Pagination settings can also be updated directly through the [global settings route](/reference/api/settings.md#update-settings) along with the other settings.

To learn more about paginating search results with Meilisearch,, refer to our [dedicated guide](/learn/advanced/pagination.md).

::: warning
Updating the settings means overwriting the default settings of Meilisearch. You can reset to default values using the `DELETE` routes.
:::

## Get pagination settings

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/pagination"/>

Get the pagination settings of an index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Example

<CodeSamples id="get_pagination_settings_1" />

#### Response: `200 OK`

```json
{

}
```

### Returned fields

#### `field_name`

[field explanation]

## Update pagination settings

<RouteHighlighter method="POST" route="/indexes/{index_uid}/settings/typo-tolerance"/>

Partially update the pagination settings for an index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Body

#### `field_name`

[field explanation]

#### Example

<CodeSamples id="update_pagination_settings_1" />

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

## Reset pagination settings

Reset an index's pagination settings to their default value. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

#### Example

<CodeSamples id="reset_pagination_settings_1" />

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

