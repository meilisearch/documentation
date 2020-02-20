# Searchable attributes

Searchable attributes are the fields in which to search for matching query words.

Child route of the [settings route](/references/settings.md).

Searchable attributes can also be updated directly through the [add settings route](/references/settings.md#add-settings) at the same time than the other settings.

## Get searchable attributes

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/searchable-attributes" />

Get the searchable attributes of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/searchable-attributes'
```

#### Response: `200 Ok`

List the settings.

```json
[
    "title",
    "description",
    "uid",
]
```

## Add or replace searchable attributes

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/searchable-attributes" />

Add or replace the searchable attributes of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

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

## Delete searchable attributes

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/searchable-attributes"/>

Delete the searchable attributes of the index.

::: warning
By deleting the searchable attributes you will have no attributes left to search in, which is not recommended.
:::
<!-- By deleting the searchable attributes you reset it to its default value that is a list of all the known fields in the documents. -->

<!-- To remove all searchable attributes, which is not recommended for any use-case, you should send an empty array on the add or replace searchable attributes route. -->

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

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
