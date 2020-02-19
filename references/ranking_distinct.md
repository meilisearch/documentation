# Ranking distinct

Ranking distinct is a field where its value will always be unique in the returned document.

Child route of the [Settings route](/references/settings.md).

Ranking distinct can also be updated directly through the [add settings route](/references/settings.md#add-settings) at the same time than the other settings.

## Get ranking distinct

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/ranking-distinct" />

Get the ranking distinct field of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/ranking-distinct'
```

#### Response: `200 Ok`

```json
"movie_id"
```

## Add or replace ranking distinct

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/ranking-distinct" />

Add or replace the ranking distinct field of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

#### Body

String of the field's name.

### Examples

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings/ranking-distinct' \
  --data 'movie_id'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).

## Delete ranking distinct

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/ranking-distinct"/>

Delete the ranking distinct field of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

#### Example
```bash
$ curl \
  -X DELETE 'http://localhost:7700/indexes/movies/settings/ranking-distinct'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).
