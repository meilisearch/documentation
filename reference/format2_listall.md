---
sidebarDepth: 2
---

# Random API (List all)

Explain what the random API does.

## The random object (simple)

|Name|Type|Description|
|---|-----|-----------|
|`varA`|string||
|`varB`|integer||
|`varC`|integer||

```json
{
    "varA": "Hello",
    "varB": 10,
    "varC": "Hi"
}
```

## The random object (complex)

#### `Complex1`

**Type**: String
**Description**:

***

### `Complex2`

**Type**: Object
**Description**:

|Name|Type|Description|
|---|-----|-----------|
|`varA`|string||
|`varB`|integer||
|`varC`|integer||

***

### `Complex3`

**Type**: Integer
**Description**:

***

### `Complex4`

**Type**: Object
**Description**:

|Name|Type|Description|
|---|-----|-----------|
|`varX`|string||
|`varY`|integer||
|`varZ`|integer||

***

```json
{
    "Complex1": "la",
    "Complex2": {
          "varA": "Hello",
          "varB": 10,
          "varC": "Hi"
    },
    "Complex3": 11,
    "Complex4": {
        "varX": "Hello",
        "varY": 10,
        "varZ": 3
    }  
}
```

## List all

<RouteHighlighter method="GET" route="/random"/>

Returns a list of [random objects](#the-random-object-simple).

### Query parameters

| Name | Description | Deafult value|
|------|-------------|--------------|
| `parameter1` | Description | 5 |

#### Example

```bash
curl \
  -X GET 'http://localhost:7700/random'
```

#### Response: `200 Ok`

```json
{
    "results":[
        {
            "varA": "Hello",
            "varB": 10,
            "varC": "Hi"
        },
        {
            "varA": "Hello",
            "varB": 10,
            "varC": "Hi"
        }
    ]
    
}
```

### Filtering random

### Paginating random

## List one

<RouteHighlighter method="GET" route="/random/:random"/>

Returns a [random object](#the-random-object-simple).

### Example

```bash
curl \
  -X GET 'http://localhost:7700/random/123'

```

#### Response: `200 Ok`

```json
{
    "varA": "Hello",
    "varB": 10,
    "varC": "Hi"
}
```

## Create

<RouteHighlighter method="POST" route="/random"/>

Description.

#### Example

```bash
  curl \
  -X POST 'http://localhost:7700/random' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "varB": 12
  }'
```

### Request body (simple)

|Name|Type|Description|
|---|-----|-----------|
|`varA` |string | |
|`varB` *|integer||

#### Example

Code sample

Returns a [random object](#the-random-object-simple).

##### Response: `201 Created`

```json
{
    "varA": "Hello",
    "varB": 10,
    "varC": "Hi"
}
```

### Request body (complex)

#### * `Complex1`

**Type**: String
**Default value**: 10
**Description**:

***

#### `Complex2`

**Type**: Object
**Default value**: None
**Description**:

|Name|Type|Description|
|---|-----|-----------|
|`varA`|string||
|`varB`|integer||
|`varC`|integer||

***

#### `Complex3`

**Type**: Integer
**Default value**: 10
**Description**:

***

#### `Complex4`

**Type**: Object
**Default value**: None
**Description**:

|Name|Type|Description|
|---|-----|-----------|
|`varX`|string||
|`varY`|integer||
|`varZ`|integer||

***

### Example

Code sample

Returns a [random object](#the-random-object-complex).

#### Response: `201 Created`

```json
{
    "Complex1": "la",
    "Complex2": {
          "varA": "Hello",
          "varB": 10,
          "varC": "Hi"
    },
    "Complex3": 11,
    "Complex4": {
        "varX": "Hello",
        "varY": 10,
        "varZ": 3
    }  
}
```

## Update

<RouteHighlighter method="PATCH" route="/random/:random"/>

Description.

### Request body (simple)

|Name|Type|Description|Default value|
|---|-----|-----------|-------------|
|`varA` |string | |`null`|
|`varB` *|integer||None|

#### Example

```bash
  curl \
  -X POST 'http://localhost:7700/random' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "varB": 12
  }'
```

Returns a [random object](#the-random-object-simple).

#### Response: `201 Created`

```json
{
    "varA": "Hello",
    "varB": 10,
    "varC": "Hi"
}
```

### Request body (complex)

#### * `Complex1`

**Type**: String
**Default value**: 10
**Description**:

***

#### `Complex2`

**Type**: Object
**Default value**: None
**Description**:

|Name|Type|Description|
|---|-----|-----------|
|`varA`|string||
|`varB`|integer||
|`varC`|integer||

***

#### `Complex3`

**Type**: Integer
**Default value**: 10
**Description**:

***

#### `Complex4`

**Type**: Object
**Default value**: None
**Description**:

|Name|Type|Description|
|---|-----|-----------|
|`varX`|string||
|`varY`|integer||
|`varZ`|integer||

***

#### Example

Code sample

Returns a [random object](#the-random-object-complex).

#### Response: `201 Created`

```json
{
    "Complex1": "la",
    "Complex2": {
          "varA": "Hello",
          "varB": 10,
          "varC": "Hi"
    },
    "Complex3": 11,
    "Complex4": {
        "varX": "Hello",
        "varY": 10,
        "varZ": 3
    }  
}
```

## Delete all

<RouteHighlighter method="DELETE" route="/random"/>

Deletes all [random objects](#the-random-object-simple).

### Example

Code sample

#### Response: `204 No Content`

## Delete one

<RouteHighlighter method="DELETE" route="/random/:random"/>

Deletes the specified [random object](#the-random-object-simple).

### Example

```bash
curl \
  -X DELETE 'http://localhost:7700/random/123'
```

#### Response: `204 No Content`
