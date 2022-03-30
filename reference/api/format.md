# Random API

Explain what  the random API does.

## The random object (simple)

|Name|Type|Description|
|---|-----|-----------|
|`varA`|string|lalal|
|`varB`|integer|lall|
|`varC`|integer|lall|

```json
{
    "varA": "Hello",
    "varB": 10,
    "varC": "Hi"
}
```

## The random object (complex)

### `Complex1`

**Type**: String
**Description**: lalala

***

### `Complex2`

**Type**: Object
**Description**: lalala

|Name|Type|Description|
|---|-----|-----------|
|`varA`|string|lalal|
|`varB`|integer|lall|
|`varC`|integer|lall|

***

### `Complex3`

**Type**: Integer
**Description**: lalala

***

### `Complex4`

**Type**: Object
**Description**: lalala

|Name|Type|Description|
|---|-----|-----------|
|`varX`|string|lalal|
|`varY`|integer|lall|
|`varZ`|integer|lall|

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

### Response: `200 Ok`

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

## List one

<RouteHighlighter method="GET" route="/random/:random"/>

Returns a [random object](#the-random-object-simple).

### Response: `200 Ok`

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

### Request body (simple)

|Name|Type|Description|Default value|
|---|-----|-----------|-------------|
|`varA` |string | lala|`null`|
|`varB` *|integer|lalal|None|

### Example

Code sample

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
**Description**: lalala

***

#### `Complex2`

**Type**: Object
**Default value**: None
**Description**: lalala

|Name|Type|Description|
|---|-----|-----------|
|`varA`|string|lalal|
|`varB`|integer|lall|
|`varC`|integer|lall|

***

#### `Complex3`

**Type**: Integer
**Default value**: 10
**Description**: lalala

***

#### `Complex4`

**Type**: Object
**Default value**: None
**Description**: lalala

|Name|Type|Description|
|---|-----|-----------|
|`varX`|string|lalal|
|`varY`|integer|lall|
|`varZ`|integer|lall|

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
|`varA` |string | lala|`null`|
|`varB` *|integer|lalal|None|

### Example

Code sample

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
**Description**: lalala

***

#### `Complex2`

**Type**: Object
**Default value**: None
**Description**: lalala

|Name|Type|Description|
|---|-----|-----------|
|`varA`|string|lalal|
|`varB`|integer|lall|
|`varC`|integer|lall|

***

#### `Complex3`

**Type**: Integer
**Default value**: 10
**Description**: lalala

***

#### `Complex4`

**Type**: Object
**Default value**: None
**Description**: lalala

|Name|Type|Description|
|---|-----|-----------|
|`varX`|string|lalal|
|`varY`|integer|lall|
|`varZ`|integer|lall|

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

Code sample

#### Response: `204 No Content`
