# Synonyms

_Child route of the [settings route](/reference/settings.md)._

`Synonyms` is an object containing words and their respective synonyms. A synonym in Meilisearch is considered equal to its associated word in a search query.

Synonyms can also be updated directly through the [global settings route](/reference/settings.md#update-settings) along with the other settings.

To learn more about synonyms, refer to our [dedicated guide](/learn/configuration/synonyms.md).

::: warning
Updating the settings means overwriting the default settings of Meilisearch. You can reset to default values using the `DELETE` routes.
:::

## Get synonyms

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/synonyms"/>

Get the list of [synonyms](/learn/configuration/synonyms.md) of an index.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<CodeSamples id="get_synonyms_1" />

#### Response: `200 OK`

```json
{
  "wolverine": [
    "xmen",
    "logan"
  ],
  "logan": [
    "wolverine",
    "xmen"
  ],
  "wow": [
    "world of warcraft"
  ]
}
```

## Update synonyms

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/synonyms"/>

Update the list of [synonyms](/learn/configuration/synonyms.md) of an index. Synonyms are [normalized](/learn/configuration/synonyms.md#normalization).

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

An object that contains all synonyms and their associated words.

[More information about the body](/learn/configuration/settings.md#synonyms).

#### Example

<CodeSamples id="update_synonyms_1" />

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

You can use this `uid` to get more details on [the status of the task](/reference/tasks.md#get-task).

## Reset synonyms

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/synonyms"/>

Reset the list of [synonyms](/learn/configuration/synonyms.md) of an index to its default value.

#### Default value

Empty object : `{}`

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<CodeSamples id="reset_synonyms_1" />

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

You can use this `uid` to get more details on [the status of the task](/reference/tasks.md#get-task).
