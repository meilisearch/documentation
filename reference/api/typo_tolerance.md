# Typo tolerance

_Child route of the [settings route](/reference/api/settings.md)._

The `typo-tolerance` route allows you to configure the typo tolerance settings for an index.

Typo tolerance settings can also be updated directly through the [global settings route](/reference/api/settings.md#update-settings) along with the other settings.

To learn more about typo tolerance, refer to our [dedicated guide](/learn/configuration/typo_tolerance.md).

::: warning
Updating the settings means overwriting the default settings of Meilisearch. You can reset to default values using the `DELETE` routes.
:::

## Get typo tolerance

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/typo-tolerance"/>

Get the typo tolerance settings of an index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Example

<CodeSamples id="get_typo_tolerance_1" />

#### Response: `200 OK`

```json
 {
        "enabled": true,
        "minWordSizeForTypos": {
            "oneTypo": 5,
            "twoTypos": 9
        },
        "disableOnWords": [],
        "disableOnAttributes": []
    }
```

### Returned fields

#### `enabled`

Whether typo tolerance is enabled or not.

#### `minWordSizeForTypos`

Customize the minimum word length for accepting 1 or 2 typos.

| Name       | Description                                  |
|------------|----------------------------------------------|
| `oneTypo`  | The minimum word size for accepting 1 typo  |
| `twoTypos` | The minimum word size for accepting 2 typos |

#### `disableOnWords`

An array of words on which the typo tolerance feature is disabled.

#### `disableOnAttributes`

An array of attributes on which the typo tolerance feature is disabled.

## Update typo tolerance

<RouteHighlighter method="POST" route="/indexes/{index_uid}/settings/typo-tolerance"/>

Partially update the typo tolerance settings for an index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Body

#### `enabled`

**Type:** boolean
**Default value:** `true`

Whether typo tolerance is enabled or not.

#### `minWordSizeForTypos`

**Type:** object

Customize the minimum word length for accepting 1 or 2 typos.

| Name       | Description                                                                       | Type    | Default value |
|------------|-----------------------------------------------------------------------------------|---------|---------------|
| `oneTypo`  | The minimum word size for accepting 1 typo, must be between `0` and `twoTypos`    | integer | `5`           |
| `twoTypos` | The minimum word size for accepting 2 typos, must be between `oneTypo` and `255`  | integer | `9`           |

#### `disableOnWords`

**Type:** array
**Default value:** `[]`

An array of words on which the typo tolerance feature is disabled.

#### `disableOnAttributes`

**Type:** array
**Default value:** `[]`

An array of attributes on which the typo tolerance feature is disabled.

#### Example

<CodeSamples id="update_typo_tolerance_1" />

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

You can use this `uid` to get more details on [the status of the task](/reference/api/tasks.md#get-task).

## Reset typo tolerance

Reset an index's typo tolerance settings to their default value. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

#### Example

<CodeSamples id="reset_typo_tolerance_1" />

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

You can use this `uid` to get more details on [the status of the task](/reference/api/tasks.md#get-task).
