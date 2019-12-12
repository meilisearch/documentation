# Settings

## Get index settings

<RouteHighlighter method="GET" route="/indexes/:uid/settings" />

Get settings for a given index.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index name        |


### Example

```bash
curl \
  --request GET 'http://localhost:7700/indexes/12345678/settings'
```


#### Response: `200 Ok`

List the settings.

```json
{
  "rankingOrder": [
    "_sum_of_typos",
    "_number_of_words",
    "_word_proximity",
    "_sum_of_words_attribute",
    "_sum_of_words_position",
    "_exact",
    "release_date"
  ],
  "distinctField": "",
  "rankingRules": {
    "release_date": "dsc"
  }
}
```

## Add or replace index settings

<RouteHighlighter method="POST" route="/indexes/:uid/settings" />

Add or replace the following settings:
* Create [custom ranking rules](/advanced_guides/ranking.md#custom-ranking-rules)
* Change [ranking rules order](/advanced_guides/ranking.md#ranking-order)
* Create distinct field


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index name        |

#### Body

| Variable          | Description           |
|-------------------|-----------------------|
| **rankingRules**         | All [custom ranking rules](/advanced_guides/ranking.md#custom-ranking-rules)      |
| **rankingOrder**         | [Ranking order](/advanced_guides/ranking.md#ranking-order) of all rules, custom and default     |
| **distinct**         | Field to which [distinct](/advanced_guides/distinct.md) will be applied    |

#### Ranking rules

An objet containing document attributes as keys and  `asc` ascending or `dsc` descending as value of this key. More information about [custom ranking rules](/advanced_guides/ranking.md#custom-ranking-rules).

::: warning
 To activate a ranking rule on a field, this **field must have the ranked property** in the [schema](/main_concepts/indexes.md#schema-definition) and it **must be in the ranking order**.
:::

#### Ranking order

A list of ranking rules ordered by importance for the [bucket sort](/advanced_guides/bucket_sort.md). The first rule being the most important.

#### Distinct field

A string containing the attribute that needs to be [distinct](/advanced_guides/distinct.md).

::: note
None of the 3 settings parameters are mandatory
:::

### Examples

#### Add settings

```bash
curl \
  --request GET 'http://localhost:7700/indexes/12345678/settings' \
  --data '{
  "rankingOrder": [
    "_sum_of_typos",
    "_number_of_words",
    "_word_proximity",
    "_sum_of_words_attribute",
    "_sum_of_words_position",
    "_exact",
    "release_date"
  ],
  "distinctField": "",
  "rankingRules": {
    "release_date": "dsc"
  }
}'
```

#### Set back the default MeiliSearch settings

```bash
curl \
  --request GET 'http://localhost:7700/indexes/12345678/settings' \
  --data '{
  "rankingOrder": null,
  "distinctField": null,
  "rankingRules": null
}'
```

::: danger
You must set the fields to `null` to reset them and not to the empty value.</br>
Setting the fields to `[]`, `{}` or `""` will erase **all rules**, even the MeiliSearch default behavior.
:::

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current action](/references/updates.md).
