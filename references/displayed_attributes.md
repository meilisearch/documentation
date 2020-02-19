# Displayed attributes

Displayed attributes are the fields contained in each matching document.

Child route of the [Settings route](/references/settings.md).

Displayed attributes can also be updated directly through the [add settings route](/references/settings.md#add-settings) at the same time than the other settings.

## Get searchable attributes

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/displayed-attributes" />

Get the displayed attributes of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/displayed-attributes'
```

#### Response: `200 Ok`

List the settings.

```json
[
    "title",
    "description",
    "release_date",
    "rank",
    "poster"
]
```

## Add or replace displayed attributes

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/displayed-attributes" />

Add or replace the displayed attributes of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

#### Body

List of displayed attributes of an index.

### Examples

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/displayed-attributes' \
  --data '[
    "title",
    "description",
    "release_date",
    "rank",
    "poster"
]'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).

## Delete displayed attributes

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/displayed-attributes"/>

Delete the displayed attributes of the index.

::: warning
By deleting the displayed attributes you will have no attributes left in the returned documents, which is not recommended.
:::
<!-- By deleting the displayed attributes you reset it to its default value that is a list of all the known fields in the documents.

To remove all displayed attributes, which is not recommended for any use-case, you should send an empty array on the [add or replace displayed attributes route](/references/displayed_attributes.html#add-or-replace-displayed-attributes). -->

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

#### Example
```bash
$ curl \
  -X DELETE 'http://localhost:7700/indexes/movies/settings/displayed-attributes'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).
