# Stop-words

_Child route of the [settings route](/reference/api/settings.md)._

The stop-words route lets you add a list of words that will be ignored in search queries. So if you add `the` as a stop word and you make a search on `the mask` you will only have matching documents with `mask`.

Stop-words can also be updated directly through the [global settings route](/reference/api/settings.md#update-settings) along with the other settings.

To learn more about stop words, refer to our [dedicated guide](/reference/features/stop_words.md).

::: warning
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

## Get stop-words

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/stop-words" />

Get the [stop-words](/reference/features/stop_words.md) list of an index.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="get_stop_words_1" />

#### Response: `200 Ok`

```json
["of", "the", "to"]
```

## Update stop-words

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/stop-words" />

Update the list of [stop-words](/reference/features/stop_words.md) of an index.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

An array of strings that contains the [stop-words](/reference/features/stop_words.md).

If a list of stop-words already exists it will be overwritten (_replaced_).

[More information about the body](/reference/features/settings.md#stop-words).

### Example

<CodeSamples id="update_stop_words_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/reference/api/updates.md).

## Reset stop-words

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/stop-words" />

Reset the list of [stop-words](/reference/features/stop_words.md) of an index to its default value.

#### Default value

Empty array: `[]`

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="reset_stop_words_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/reference/api/updates.md).
