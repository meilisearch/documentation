# Stop words

## Get the list of stop-words

<RouteHighlighter method="GET" route="/indexes/:index/stop-words" />

Get the list [stop-words](/advanced_guides/stop_words).


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index UID         |


### Example

```bash
curl \
  --request GET 'http://localhost:8080/indexes/12345678/stop-words' \
```


#### Response: `200 Ok`

List of all the stop-words in the index.

```json
["of","the","to"]
```


## Add stop-words

<RouteHighlighter method="PATCH" route="/indexes/:index/stop-words" />

Add [stop-words](/advanced_guides/stop_words) to the list.



#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index UID         |

#### Body

An array of strings containing the [stop-words](/advanced_guides/stop_words).

### Example

```bash
curl \
  --request PATCH 'http://localhost:8080/indexes/12345678/stop-words' \
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



#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index UID         |

#### Body

An array of strings containing the [stop-words](/advanced_guides/stop_words) to delete.

### Example

```bash
curl \
  --request POST 'http://localhost:8080/indexes/12345678/stop-words' \
  --data '["the"]'
```


#### Response: `202 Accepted`

```json
{
  "updateId": 1,
}
```
This [update id allows you to track](/references/updates) the current action.