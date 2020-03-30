# Ranking rules

_Child route of the [settings route](/references/settings.md)._

Ranking rules is a list of all the rules that contributes to the relevancy of your search. It is possible to add your own and to change the order of the rules based on your needs.

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

List of ranking rules in order of importance.

To add your own ranking rule you need to communicate the field and if its value is descending or ascending.

For ascending it would be: `asc(price)`

For descending it would be: `dsc(release_date)`

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

Array with the [built-in ranking rules](/guides/main_concepts/relevancy.md#order-of-the-rules) ordered by importance.

```json
["typo", "words", "proximity", "attribute", "wordsPosition", "exactness"]
```

To remove all ranking rules, which is not recommended for any use-case, you should send an empty array on the [add or replace ranking rules route](/references/ranking_rules.md#update-ranking-rules).

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
