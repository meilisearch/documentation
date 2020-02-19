# Stop words

Stop words is a list of words that will be ignored in search queries. So if you add `the` as a stop word and you make a search on `the mask` you will only have matching documents with `mask`.

Child route of the [Settings route](/references/settings.md).

Stop words can also be updated directly through the [add settings route](/references/settings.md#add-settings) at the same time than the other settings.

## Get stop-words list

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/stop-words" />

Get the list [stop-words](/guides/advanced_guides/stop_words.md) of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |


### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/12345678/settings/stop-words'
```


#### Response: `200 Ok`

```json
["of","the","to"]
```


## Add or replace stop-words list

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/stop-words" />

Add or replace the list of [stop-words](/guides/advanced_guides/stop_words.md) of an index.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

#### Body

An array of strings containing the [stop-words](/guides/advanced_guides/stop_words.md).

If a list of stop-words already exist it will be overwritten (*replaced*).

### Example

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/12345678/settings/stop-words' \
  --data '["the", "of", "to"]'
```


#### Response: `202 Accepted`

```json
{
  "updateId": 1,
}
```
This `updateId` allows you to [track the current update](/references/updates.md).

## Delete stop-words list

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/stop-words" />

Delete the list of [stop-words](/guides/advanced_guides/stop_words.md) of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |


### Example

```bash
$ curl \
  -X DELETE 'http://localhost:7700/indexes/12345678/settings/stop-words' \
```


#### Response: `202 Accepted`

```json
{
  "updateId": 1,
}
```
This `updateId` allows you to [track the current update](/references/updates.md).
