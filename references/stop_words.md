# Stop-words

_Child route of the [settings route](/references/settings.md)._

The stop-words route lets you add a list of words that will be ignored in search queries. So if you add `the` as a stop word and you make a search on `the mask` you will only have matching documents with `mask`.

Stop-words can also be updated directly through the [global settings route](/references/settings.md#update-settings) at the same time than the other settings.

::: note
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

## Get stop-words

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/stop-words" />

Get the [stop-words](/guides/advanced_guides/stop_words.md) list of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/stop-words'
```

#### Response: `200 Ok`

```json
["of", "the", "to"]
```

## Update stop-words

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/stop-words" />

Update the list of [stop-words](/guides/advanced_guides/stop_words.md) of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

An array of strings containing the [stop-words](/guides/advanced_guides/stop_words.md).

If a list of stop-words already exists it will be overwritten (_replaced_).

### Example

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/settings/stop-words' \
  --data '["the", "of", "to"]'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Reset stop-words

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/stop-words" />

Reset the list of [stop-words](/guides/advanced_guides/stop_words.md) of an index to its default value.

#### Default value

Empty array: `[]`

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

```bash
$ curl \
  -X DELETE 'http://localhost:7700/indexes/movies/settings/stop-words' \
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).
