# Settings 

## Get the list of settings

<RouteHighlighter method="GET" route="/indexes/:index/settings" />

Get the list [settings](/advanced_guides/settings).

#### Headers

| Header              | Value            |
|---------------------|------------------|
| **X-Meili-API-Key** | `$API_KEY`       |
| **Content-Type**    | application/json |
| **Accept-encoding** | gzip, deflate    |

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index name        |


### Example

```bash
curl \
  --location \
  --request GET 'http://localhost:8080/indexes/12345678/settings' \
  --header 'Content-Type: application/json' \
  --header "X-Meili-API-Key: $API_KEY" \
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

## Add or update settings

<RouteHighlighter method="POST" route="/indexes/:index/settings" />

Add or update the following settings :
* Create [custom ranking rules](/advanced_guides/ranking.md#custom-ranking-rules)
* Change [ranking rules order](/advanced_guides/ranking.md#ranking-order)
* Create distinct field

#### Headers

| Header              | Value            |
|---------------------|------------------|
| **X-Meili-API-Key** | `$API_KEY`       |
| **Content-Type**    | application/json |
| **Accept-encoding** | gzip, deflate    |

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index name        |

#### Body

| Variable          | Description           |
|-------------------|-----------------------|
| **rankingRules**         | All [custom ranking rules](/advanced_guides/ranking.md#custom-ranking-rules)      |
| **rankingOrder**         | [Ranking order](/advanced_guides/ranking.md#ranking-order) of all rules, custom and default     |
| **distinct**         | Field to which [distinct](/advanded_guides/distinct) will be applied    |

#### Ranking rules

An objet containing document attributes as keys and  `asc` ascending or `dsc` descending as value of this key. More information about [custom ranking rules](/advanced_guides/ranking.md#custom-ranking-rules).

#### Ranking order

A list of ranking rules ordered by importance for the [bucket sort](/advanced_guides/bucket_sort). The first rule being the most important.

#### Distinct

A string containing the attribute that needs to be [distinct](/advanced_guides/distinct).

::: warning
None of the 3 settings parameters is mandatory
:::

### Example

```bash
curl \
  --location \
  --request GET 'http://localhost:8080/indexes/12345678/settings' \
  --header 'Content-Type: application/json' \
  --header "X-Meili-API-Key: $API_KEY" \
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


#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This [update id allows you to track](/references/updates) the current action.