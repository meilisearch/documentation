# Settings

It is possible to update all the settings in one go or individually with the dedicated route.

Here are the reference pages with the didicated routes:
- [Synonymn](/references/synonyms)
- [Stop-words](/references/stop_words)


## Get settings

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings" />

Get settings for a given index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |


### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings'
```


#### Response: `200 Ok`

List the settings.

```json
{

}
```

## Add settings

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings" />

Add or replace the following settings of an index:
* Create [custom ranking rules](/guides/advanced_guides/ranking.md#custom-ranking-rules)
* Change [ranking rules order](/guides/advanced_guides/ranking.md#ranking-order)
* Create distinct field


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

#### Body

| Variable          | Description           |
|-------------------|-----------------------|
| **rankingRules**         | All [custom ranking rules](/guides/advanced_guides/ranking.md#custom-ranking-rules)      |
| **rankingOrder**         | [Ranking order](/guides/advanced_guides/ranking.md#ranking-order) of all rules, custom and default     |
| **distinct**         | Field to which [distinct](/guides/advanced_guides/distinct.md) will be applied    |

#### Ranking rules

An objet containing document attributes as keys and  `asc` ascending or `dsc` descending as value of this key. More information about [custom ranking rules](/guides/advanced_guides/ranking.md#custom-ranking-rules).


#### Ranking order

A list of ranking rules ordered by importance for the [bucket sort](/guides/advanced_guides/bucket_sort.md). The first rule being the most important.

#### Distinct field

A string containing the attribute that needs to be [distinct](/guides/advanced_guides/distinct.md).

::: note
None of the 3 settings parameters are mandatory
:::

### Examples

#### Add settings

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings' \
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
  "rankingRules": {
    "release_date": "dsc"
  }
}'
```

#### Set back the default MeiliSearch settings

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings' \
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
This `updateId` allows you to [track the current update](/references/updates.md).

## Delete settings
