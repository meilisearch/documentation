# Stop-words

_Child route of the [settings route](/reference/api/settings.md)._

The stop-words route allows you to add a list of words ignored in your search queries. During a search, the stop words contained in your search query will be ignored by the sorting algorithm.

When you add a common English word such as `the` to the stop-words list, Meilisearch will not take it into consideration when calculating how relevant a result is.

::: note
Stop-words are strongly related to the language used in your dataset. For example, most datasets containing English documents will have countless occurrences of `the` and `of`. Italian datasets, instead, will benefit from ignoring words like `a`, `la`, or `il`.
:::

Stop-words can also be updated directly through the [global settings route](/reference/api/settings.md#update-settings) along with the other settings.

::: warning
Updating the settings means overwriting the default settings of Meilisearch. You can reset to default values using the `DELETE` routes.
:::

## Get stop-words

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/stop-words" />

Get the stop-words list of an index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Example

<CodeSamples id="get_stop_words_1" />

#### Response: `200 Ok`

```json
[
  "of",
  "the",
  "to"
]
```

## Update stop-words

<RouteHighlighter method="POST" route="/indexes/{index_uid}/settings/stop-words" />

Update the list of stop-words of an index. This will re-index all documents in the index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

#### Body

An array of strings that contains the stop-words.

If a list of stop-words already exists it will be overwritten (_replaced_).

[More information about the body](/learn/configuration/settings.md#stop-words).

### Example

<CodeSamples id="update_stop_words_1" />

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

You can use this `uid` to get more details on [the status of the task](/reference/api/tasks.md#get-task).

## Reset stop-words

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings/stop-words" />

Reset the list of stop-words of an index to its default value. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

#### Default value

Empty array: `[]`

### Example

<CodeSamples id="reset_stop_words_1" />

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

You can use this `uid` to get more details on [the status of the task](/reference/api/tasks.md#get-task).
