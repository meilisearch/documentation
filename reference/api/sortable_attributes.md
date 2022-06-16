# Sortable attributes

_Child route of the [settings route](/reference/api/settings.md)._

Sortable attributes can also be updated through the [global settings route](/reference/api/settings.md#update-settings).

Attributes that can be used together with the [`sort` search parameter](/reference/api/search.md#sort). To learn more about sortable attributes, refer to our [dedicated guide](/learn/advanced/sorting.md)

::: warning
Updating the settings means overwriting the default settings of Meilisearch. You can reset to default values using the `DELETE` routes.
:::

## Get sortable attributes

<RouteHighlighter method="GET" route="/indexes/{index_uid}/settings/sortable-attributes" />

Get an index's [`sortableAttributes`](/learn/advanced/sorting.md). The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Example

<CodeSamples id="get_sortable_attributes_1" />

#### Response: `200 Ok`

List the settings.

```json
[
  "price", 
  "author.surname"
]
```

## Update sortable attributes

<RouteHighlighter method="PUT" route="/indexes/{index_uid}/settings/sortable-attributes" />

Update an index's sortable attributes list. This will re-index all documents in the index. This will re-index all documents in the index. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

If an attribute contains an object, you can use dot notation to set one or more of its keys as a value for this setting: `"sortableAttributes": ["author.surname"]`.

[You can read more about sorting at query time on our dedicated guide.](/learn/advanced/sorting.md)

### Body

An array of strings containing the attributes that can be used to sort search results at query time.

[You can read more about this setting at the feature reference page.](/learn/configuration/settings.md#sortable-attributes)

### Example

<CodeSamples id="update_sortable_attributes_1" />

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

## Reset sortable attributes

<RouteHighlighter method="DELETE" route="/indexes/{index_uid}/settings/sortable-attributes"/>

Reset an index's sortable attributes list back to its default value. The index [`uid`](/learn/core_concepts/indexes.md#index-uid) is required.

### Default value

An empty array (`[]`).

### Example

<CodeSamples id="reset_sortable_attributes_1" />

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
