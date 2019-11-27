# Synonyms

## List one synonym

<RouteHighlighter method="GET" route="/indexes/:uid/synonyms/:synonym"/>

List one sequence and his synonyms inside an index.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index UID |
| **synonym**         | Sequence of which the synonyms will be returned |


#### Example
```bash
 curl \
  --request GET 'http://localhost:8080/indexes/12345678/synonyms/magician'
```

#### Response: `200 OK`


```json
["harry","merlin"]
```
array of synonyms of the given sequence in the path variable.

## List all synonyms

<RouteHighlighter method="GET" route="/indexes/:uid/synonyms"/>

List all sequences and their synonyms inside an index.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index UID |


#### Example
```bash
 curl \
  --request GET 'http://localhost:8080/indexes/12345678/synonyms'
```

#### Response: `200 OK`

```json
{
  "potter": [
    "harry"
  ],
  "magician": [
    "harry",
    "merlin"
  ],
  "harry": [
    "potter"
  ]
}
```


## Create synonyms

<RouteHighlighter method="POST" route="/indexes/:uid/synonyms"/>

Create synonyms.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index UID |

#### Body

| key          | Value description           |
|-------------------|-----------------------|
| **input**         | the [one-way string](/advanced_guides/synonyms.md#the-one-way-association) that is gonna be associated with the synonyms array |
| **synonyms**         | array of words to associate together in [a multi-way](/advances_guides/synonymss.md##the-multi-way-association) |

An object with either multi-way string associations or one-way string association.

#### One-way Example
```bash
 curl \
  --request POST 'http://localhost:8080/indexes/12345678/synonyms' \
  --data '{ "input": "magician", "synonyms": ["harry potter", "merlin"]}'
```

#### Multi-way Example
```bash
 curl \
  --request POST 'http://localhost:8080/indexes/12345678/synonyms' \
  --data '{ "synonyms": ["harry potter", "hp"]}'
```

#### Response: `202 Accepted`

```json
{
  "updateId" : 1
}
```
This [update id allows you to track](/references/updates) the current action.

## Update a synonym

<RouteHighlighter method="PUT" route="/indexes/:uid/synonyms/:synonym"/>

Update a synonym.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index UID |
| **synonym**         | Sequence of which the synonyms will be updated |

#### Body

An array of string containing all synonyms of the given sequence.

::: warning
This will **override** the previous synonyms of the given sequence. Don't forget to add them if you dont want to lose them.
:::

#### Example
```bash
 curl \
  --request PUT 'http://localhost:8080/indexes/12345678/synonyms/magician' \
  --data '["harry potter", "merlin", "Illusionist"]'
```

#### Response: `200 Ok`

```json
{
  "updateId" : 1
}
```
This [update id allows you to track](/references/updates) the current action.

## Delete a synonym

<RouteHighlighter method="DELETE" route="/indexes/:uid/synonyms/:synonym"/>

Delete a synonym.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index UID |
| **synonym**         | Sequence of which the synonyms will be deleted |


#### Example
```bash
 curl \
  --request DELETE 'http://localhost:8080/indexes/12345678/synonyms/magician'
```

#### Response: `200 Ok`

```json
{
  "updateId" : 1
}
```
This [update id allows you to track](/references/updates) the current action.

## Batch write synonyms

<RouteHighlighter method="POST" route="/indexes/:uid/synonyms/batch"/>

Batch write synonyms.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index UID |

#### Body

| key          | Value description           |
|-------------------|-----------------------|
| **input**         | the [one-way string](/advanced_guides/synonymss.md#the-one-way-association) that is gonna be associated with the synonyms array |
| **synonyms**         | array of words to associate together in [a multi-way](/advances_guides/synonymss.md##the-multi-way-association) |

An object with either multi-way string associations or one-way string association.

#### Example
```bash
 curl \
  --request POST 'http://localhost:8080/indexes/12345678/synonyms/batch' \
  --data '[
    {
      "input": "magician",
      "synonyms": ["harry potter", "merlin", "illusionist"]
    },
    {
      "synonyms" : ["mickey", "mouse"]
    }
  ]'
```

#### Response: `202 Accepted`

```json
{
  "updateId" : 1
}
```
This [update id allows you to track](/references/updates) the current action.


## Clear synonyms

<RouteHighlighter method="DELETE" route="/indexes/:uid/synonyms"/>

Delete all synonyms


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index UID |


#### Example
```bash
 curl \
  --request DELETE 'http://localhost:8080/indexes/12345678/synonyms'
```

#### Response: `202 Accepted`

```json
{
  "updateId" : 1
}
```
This [update id allows you to track](/references/updates) the current action.