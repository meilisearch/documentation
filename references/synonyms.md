# Synonyms

Synonyms is an object containing words and their respective synonyms. A synonym in Meilisearch is considered equal as its associated word in a search query.

Child route of the [Settings route](/references/settings.md).

Synonyms can also be updated directly through the [add settings route](/references/settings.md#add-settings) at the same time than the other settings.

## Get synonyms

<RouteHighlighter method="GET" route="/indexes/:uid/settings/synonyms"/>

Get the list of [synonyms][1] of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID |

#### Example
```bash
 curl \
  -X GET 'http://localhost:7700/indexes/12345678/settings/synonyms'
```

#### Response: `200 OK`

```json
{
 "wolverine": [
   "xmen",
   "logan"
  ],
  "logan": [
    "wolverine",
    "xmen"
  ],
  "wow": [
    "World of warcraft"
  ]
}
```

## Add or replace synonyms

<RouteHighlighter method="POST" route="/indexes/:uid/settings/synonyms"/>

Add or replace the list of [synonyms][1] of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID |

#### Body

An object with every synonym and its associated words.

#### Example
```bash
 curl \
  -X POST 'http://localhost:7700/indexes/12345678/settings/synonyms' \
  --data '{
    "wolverine": ["xmen", "logan"],
    "logan": ["wolverine", "xmen"],
    "wow": ["World of warcraft"]
  }'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).

## Delete synonyms

<RouteHighlighter method="DELETE" route="/indexes/:uid/settings/synonyms"/>

Delete the list of [synonyms][/guides/advanced_guides/synonyms.md] of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID |

#### Example
```bash
 curl \
  -X DELETE 'http://localhost:7700/indexes/12345678/settings/synonyms'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).
