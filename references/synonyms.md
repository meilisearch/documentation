# Synonyms

The synonyms list is part of the [settings][1] category.

[1]: /references/settings.md

::: tip
The synonyms list is considered as one resource and has the REST routes in line with this logic.
:::

## Get synonyms list

<RouteHighlighter method="GET" route="/indexes/:uid/settings/synonyms"/>

Get the list of [synonyms][1]

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
  "potter": [
    "harry",
    "hp"
  ],
  "magician": [
    "Harry Potter",
    "merlin"
  ],
  "harry": [
    "potter",
    "hp"
  ]
}
```

## Create synonyms list

<RouteHighlighter method="POST" route="/indexes/:uid/settings/synonyms"/>

Create the list of [synonyms][1].

::: warning
**If one already exists, it will be overridden.**
:::

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID |

#### Body

An object with every synonym to every term.

#### Example
```bash
 curl \
  -X POST 'http://localhost:7700/indexes/12345678/settings/synonyms' \
  --data '{
    "Potter" : ["Harry", "hp"],
    "Harry" : ["Potter", "hp"],
    "Magician": ["Harry Potter", "Merlin"]
  }'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).

## Delete synonyms list

<RouteHighlighter method="DELETE" route="/indexes/:uid/settings/synonyms"/>

Delete the list of [synonyms][1].

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

[1]: /advanced_guides/synonyms.md
