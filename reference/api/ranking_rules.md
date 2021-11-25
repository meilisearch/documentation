# Ranking rules

_Child route of the [settings route](/reference/api/settings.md)._

Ranking rules are built-in rules that allow you to **customize the relevancy of your search results**. They are stored in an array and applied in order of appearance.

Ranking rules can also be updated directly through the [global settings route](/reference/api/settings.md#update-settings) along with the other settings.

To learn more about ranking rules, refer to our [dedicated guide](/learn/core_concepts/relevancy.md).

::: warning
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

## Get ranking rules

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/ranking-rules" />

Get the [ranking rules](/learn/core_concepts/relevancy.md#ranking-rules) of an index.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Default value

An array that contains [ranking rules](/learn/core_concepts/relevancy.md#default-order) in order of importance.

### Example

<CodeSamples id="get_ranking_rules_1" />

#### Response: `200 Ok`

List the settings.

```json
[
  "words",
  "typo",
  "proximity",
  "attribute",
  "sort",
  "exactness",
  "release_date:desc"
]
```

## Update ranking rules

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/ranking-rules" />

Update the [ranking rules](/learn/core_concepts/relevancy.md#ranking-rules) of an index.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

An array that contain ranking rules sorted by order of importance.

To add your own ranking rule, you have to communicate an attribute followed by a colon (`:`) and either `asc` for ascending order or `desc` for descending order.

- To apply an **ascending sort** (results sorted by increasing value): `attribute_name:asc`

- To apply a **descending sort** (results sorted by decreasing value): `attribute_name:desc`

[More information about the body](/reference/features/settings.md#ranking-rules).

### Example

<CodeSamples id="update_ranking_rules_1" />

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

You can use this `uid` to get more details on [the status of the task](/reference/api/tasks.md#get-task-status-by-uid).

## Reset ranking rules

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/ranking-rules" />

Reset the [ranking rules](/learn/core_concepts/relevancy.md#ranking-rules) of an index to their default value.

::: tip
Note that resetting the ranking rules is not the same as removing them.
To remove a ranking rule, use the [add or replace ranking rules route](/reference/api/ranking_rules.md#update-ranking-rules).
:::

#### Default value

An array that contains the [built-in ranking rules](/learn/core_concepts/relevancy.md#built-in-rules) in the following order:

```json
[
  "words", 
  "typo", 
  "proximity", 
  "attribute", 
  "sort",
  "exactness"
]
```

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<CodeSamples id="reset_ranking_rules_1" />

#### Response: `202 Accepted`

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "indexUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `uid` to get more details on [the status of the task](/reference/api/tasks.md#get-task-status-by-uid).
