# Ranking rules

_Child route of the [settings route](/references/settings.md)._

Ranking rules are predefined rules applied to the search results in order to improve their relevance. They are customizable so the results meet your user's needs as close as possible. Ranking rules are applied in a default order which can be changed in the settings.

Ranking rules can also be updated directly through the [global settings route](/references/settings.md#update-settings) at the same time than the other settings.

::: note
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

## Get ranking rules

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/ranking-rules" />

Get the ranking rules of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/ranking-rules'
```

#### Response: `200 Ok`

List the settings.

```json
[
  "typo",
  "words",
  "proximity",
  "attribute",
  "wordsPosition",
  "exactness",
  "dsc(release_date)"
]
```

## Update ranking rules

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/ranking-rules" />

Update the ranking rules of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

An array that contain ranking rules sorted by order of importance.

To add your own ranking rule, you have to communicate either `asc` for ascending order or `dsc` for descending order followed by the field name in brackets.

- To apply an **ascending sort**: `asc(attribute_name)`

- To apply a **descending sort**: `desc(attribute_name)`

### Examples

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/settings/ranking-rules' \
  --data '[
      "typo",
      "words",
      "proximity",
      "attribute",
      "wordsPosition",
      "exactness",
      "dsc(release_date)",
      "dsc(rank)"
  ]'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Reset ranking rules

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/ranking-rules"/>

Reset the [ranking rules](/guides/main_concepts/relevancy.md#ranking-rules) of an index to its default value.

#### Default value

An array that contain [built-in ranking rules](/guides/main_concepts/relevancy.md#order-of-the-rules) sorted by order of importance.

```json
["typo", "words", "proximity", "attribute", "wordsPosition", "exactness"]
```

To remove all ranking rules, which is not recommended in any case, you would send an empty array to the [add or replace ranking rules route](/references/ranking_rules.md#update-ranking-rules).

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

```bash
$ curl \
  -X DELETE 'http://localhost:7700/indexes/movies/settings/ranking-rules'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).
