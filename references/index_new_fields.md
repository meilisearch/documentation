# Index new fields

Index new fields determines if MeiliSearch should index new fields found during document addition.
Once the first document has been added to MeiliSearch, a list of known fields is stored. After which any other field found in the other documents will be stored by default. This can be disabled by setting the `indexNewField` boolean to `false`.

Child route of the [settings route](/references/settings.md).

Stop-words can also be updated directly through the [add settings route](/references/settings.md#add-settings) at the same time than the other settings.

## Get index new fields

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/index-new-fields" />

Get if MeiliSearch indexes new fields for an index.

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

Set the index new fields back to its default value of `true`.

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
