# Index new fields



## Get index new fields

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/index-new-fields" />

Get if an index indexes new fields.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/index-new-fields'
```

#### Response: `200 Ok`

List the settings.

```json
false
```

## Update index new fields

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/index-new-fields" />

Update if an index should index new fields.

Index new fields is a Boolean, when set to true, each fields found in the newly added documents will be added in MeiliSearch.
When false will be ignored.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

#### Body

Boolean that will determine if new fields found during document addition should be indexed or ignored.

True is the default value and will index all new fields, false will ignore all new fields.

### Examples

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/index-new-fields' \
  --data 'false'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).

## Delete index new fields

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/index-new-fields"/>

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
  -X DELETE 'http://localhost:7700/indexes/movies/settings/index-new-fields'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).

