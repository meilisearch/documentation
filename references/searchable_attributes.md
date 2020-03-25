# Searchable attributes

_Child route of the [settings route](/references/settings.md)._

Searchable attributes are the fields in which to search for matching query words.

Searchable attributes can also be updated directly through the [global settings route](/references/settings.md#update-settings) at the same time than the other settings.

::: note
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

## Get searchable attributes

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/searchable-attributes" />

Get the searchable attributes of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/searchable-attributes'
```

#### Response: `200 Ok`

List the settings.

```json
["title", "description", "uid"]
```

## Update searchable attributes

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/searchable-attributes" />

Update the searchable attributes of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

List of searchable attributes in order of importance.

This means that a document with a match in an attribute at the start of the array will be considered more relevant than a document with a match in an attribute at the end of the array.

### Examples

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/searchable-attributes' \
  --data '[
  "title",
  "description",
  "uid",
]'
```

A match in title will make a document more relevant than another document with a match in description.

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Reset searchable attributes

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/searchable-attributes"/>

Reset the searchable attributes of the index to the default value.

#### Default value

All attributes found in the documents added to the index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

```bash
$ curl \
  -X DELETE 'http://localhost:7700/indexes/movies/settings/searchable-attributes'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).
