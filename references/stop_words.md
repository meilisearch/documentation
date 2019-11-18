# Stop words

## Get the list of stop-words

<RouteHighlighter method="GET" route="/indexes/:index/stop-words" />

Get the list [stop-words](/advanced_guides/stop_words).

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
  --request GET 'http://localhost:8080/indexes/movies/stop-words' \
  --header 'Content-Type: application/json' \
  --header "X-Meili-API-Key: $API_KEY" \
```


#### Response: `200 Ok`

List of all the stop-words in the index.

```json
["of","the","to"]
```


## Add stop-words

<RouteHighlighter method="PUT" route="/indexes/:index/stop-words" />

Add [stop-words](/advanced_guides/stop_words) to the list.


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

An array of strings containing the [stop-words](/advanced_guides/stop_words).

### Example

```bash
curl \
  --location \
  --request POST 'http://localhost:8080/indexes/movies/stop-words' \
  --header 'Content-Type: application/json' \
  --header "X-Meili-API-Key: $API_KEY" \
  --data '["the", "of", "to"]'
```


#### Response: `202 Accepted`

```json
{
  "updateId": 1,
}
```
This [update id allows you to track](/references/updates) the current action.

## Delete stop-words

<RouteHighlighter method="DELETE" route="/indexes/:index/stop-words" />

Delete a list of [stop-words](/advanced_guides/stop_words) from the list.


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

An array of strings containing the [stop-words](/advanced_guides/stop_words) to delete.

### Example

```bash
curl \
  --location \
  --request POST 'http://localhost:8080/indexes/movies/stop-words' \
  --header 'Content-Type: application/json' \
  --header "X-Meili-API-Key: $API_KEY" \
  --data '["the"]'
```


#### Response: `202 Accepted`

```json
{
  "updateId": 1,
}
```
This [update id allows you to track](/references/updates) the current action.