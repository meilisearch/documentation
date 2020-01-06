# Stop words

The stop-word list is part of the [settings][1] category.

[1]: /references/settings.md
::: tip
The stop-words list is considered as one resource and has the REST routes in line with this logic.
:::

## Get stop-words list

<RouteHighlighter method="GET" route="/indexes/:uid/settings/stop-words" />

Get the list [stop-words](/advanced_guides/stop_words).


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID         |


### Example

```bash
curl \
  -X GET 'http://localhost:7700/indexes/12345678/settings/stop-words'
```


#### Response: `200 Ok`

List of all the stop-words in the index.

```json
["of","the","to"]
```


## Create stop-words list

<RouteHighlighter method="POST" route="/indexes/:uid/settings/stop-words" />

Create the list of [stop-words](/advanced_guides/stop_words).

::: warning
**If one already exists, it will be overridden.**
:::

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID         |

#### Body

An array of strings containing the [stop-words](/advanced_guides/stop_words).

### Example

```bash
curl \
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

<RouteHighlighter method="DELETE" route="/indexes/:uid/settings/stop-words" />

Delete the list of [stop-words](/advanced_guides/stop_words).

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID         |


### Example

```bash
curl \
  -X DELETE 'http://localhost:7700/indexes/12345678/settings/stop-words' \
```


#### Response: `202 Accepted`

```json
{
  "updateId": 1,
}
```
This `updateId` allows you to [track the current update](/references/updates.md).
