# Stop words

## Get the list of stop-words

<RouteHighlighter method="GET" route="/indexes/:uid/stop-words" />

Get the list [stop-words](/advanced_guides/stop_words).


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID         |


### Example

```bash
curl \
  --request GET 'http://localhost:7700/indexes/12345678/stop-words'
```


#### Response: `200 Ok`

List of all the stop-words in the index.

```json
["of","the","to"]
```


## Add stop-words

<RouteHighlighter method="PATCH" route="/indexes/:uid/stop-words" />

Add [stop-words](/advanced_guides/stop_words) to the list.



#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID         |

#### Body

An array of strings containing the [stop-words](/advanced_guides/stop_words).

### Example

```bash
curl \
  --request PATCH 'http://localhost:7700/indexes/12345678/stop-words' \
  --data '["the", "of", "to"]'
```


#### Response: `202 Accepted`

```json
{
  "updateId": 1,
}
```
This `updateId` allows you to [track the current action](/references/updates.md).

## Delete stop-words

<RouteHighlighter method="POST" route="/indexes/:uid/stop-words" />

Delete a list of [stop-words](/advanced_guides/stop_words) from the list.



#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID         |

#### Body

An array of strings containing the [stop-words](/advanced_guides/stop_words) to delete.

### Example

```bash
curl \
  --request POST 'http://localhost:7700/indexes/12345678/stop-words' \
  --data '["the"]'
```


#### Response: `202 Accepted`

```json
{
  "updateId": 1,
}
```
This `updateId` allows you to [track the current action](/references/updates.md).
