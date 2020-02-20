# Ranking rules

Ranking rules is a list of all the rules that contributes to the relevancy of your search. It is possible to add your own and to change the order of the rules based on your needs.

Child route of the [settings route](/references/settings.md).

Ranking rules can also be updated directly through the [add settings route](/references/settings.md#add-settings) at the same time than the other settings.

## Get ranking rules

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/ranking-rules" />

Get the ranking rules of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/ranking-rules'
```

#### Response: `200 Ok`

List the settings.

```json
[
    "_typo",
    "_words",
    "_proximity",
    "_attribute",
    "_words_position",
    "_exact",
    "dsc(release_date)",
]
```

## Add or replace ranking rules

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/ranking-rules" />

Add or replace the ranking rules of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

#### Body

List of ranking rules in order of importance.

To add your own ranking rule you need to communicate the field and if its value is descending or ascending.

For ascending it would be : `asc(price)`

For descending it would be : `dsc(release_date)`

### Examples

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/ranking-rules' \
  --data '[
            "_typo",
            "_words",
            "_proximity",
            "_attribute",
            "_words_position",
            "_exact",
            "dsc(release_date)",
            "dsc(rank)",
        ]'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).

## Delete ranking rules

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/ranking-rules"/>

Delete the ranking rules of an index.

By deleting the rules you reset them to their default value.

```json
[
    "_typo",
    "_words",
    "_proximity",
    "_attribute",
    "_words_position",
    "_exact"
]
```
To remove all ranking rules, which is not recommended for any use-case, you should send an empty array on the [add or replace ranking rules route](/references/ranking_rules.md#add-or-replace-ranking-rules).

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

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
