# Synonyms

_Child route of the [settings route](/reference/api/settings.md)._

`Synonyms` is an object containing words and their respective synonyms. A synonym in Meilisearch is considered equal to its associated word in a search query.

Synonyms can also be updated directly through the [global settings route](/reference/api/settings.md#update-settings) along with the other settings.

To learn more about synonyms, refer to our [dedicated guide](/learn/configuration/synonyms.md).

::: warning
Updating the settings means overwriting the default settings of Meilisearch. You can reset to default values using the `DELETE` routes.
:::

## Get synonyms

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/synonyms"/>

Get the list of [synonyms](/learn/configuration/synonyms.md) of an index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

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

<RouteHighlighter method="POST" route="/indexes/{index_uid}/settings/synonyms"/>

Update the list of [synonyms](/learn/configuration/synonyms.md) of an index. Synonyms are [normalized](/learn/configuration/synonyms.md#normalization). The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

#### Body

An object that contains all synonyms and their associated words.

[More information about the body](/learn/configuration/settings.md#synonyms).

#### Example

<CodeSamples id="update_synonyms_1" />

#### Response: `202 Accepted`

```json
{
    "taskUid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "settingsUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

## Reset synonyms

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings/synonyms"/>

Reset the list of [synonyms](/learn/configuration/synonyms.md) of an index to its default value. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

#### Default value

Empty object : `{}`

#### Example

<CodeSamples id="reset_synonyms_1" />

#### Response: `202 Accepted`

```json
{
    "taskUid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "settingsUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).
