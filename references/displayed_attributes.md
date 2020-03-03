# Displayed attributes

Displayed attributes are the fields contained in each matching document.

Child route of the [settings route](/references/settings.md).

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

## Update displayed attributes

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/displayed-attributes" />

Update the displayed attributes of an index.

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

## Reset displayed attributes

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/displayed-attributes"/>

Reset the displayed attributes of the index to the default value.

#### Default value

All attributes found in the documents added to the index.

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
