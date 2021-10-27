# Sortable attributes

_Child route of the [settings route](/reference/api/settings.md)._

Attributes that can be used together with the [`sort` search parameter](/reference/features/search_parameters.md#sort). [You can learn more about sorting in our dedicated guide.](/reference/features/sorting.md)

Sortable attributes can also be updated through the [global settings route](/reference/api/settings.md#update-settings).

## Get sortable attributes

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/sortable-attributes" />

Get an index's [`sortableAttributes`](/reference/features/sorting.md).

### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="get_sortable_attributes_1" />

#### Response: `200 Ok`

List the settings.

```json
[
  "price", 
  "author"
]
```

## Update sortable attributes

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/sortable-attributes" />

Update an index's sortable attributes list. This will re-index all documents in the index.

[You can read more about sorting at query time on our dedicated guide.](/reference/features/sorting.md)

### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Body

An array of strings containing the attributes that can be used to sort search results at query time.

[You can read more about this setting at the feature reference page.](/reference/features/settings.md#sortable-attributes)

### Example

<CodeSamples id="update_sortable_attributes_1" />

#### Response: `202 Accepted`

```json
{ "updateId": 1 }
```

This `updateId` allows you to [track the current update](/reference/api/updates.md).

## Reset sortable attributes

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/sortable-attributes"/>

Reset an index's sortable attributes list back to its default value.

### Default value

An empty array (`[]`).

### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="reset_sortable_attributes_1" />

#### Response: `202 Accepted`

```json
{ "updateId": 1 }
```

This `updateId` allows you to [track the current update](/reference/api/updates.md).
