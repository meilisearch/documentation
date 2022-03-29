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

**Name**: Complex1
**Type**: String
**Description**: lalala

***

**Name**: Complex2
**Type**: Object
**Description**: lalala

|Name|Type|Description|
|---|-----|-----------|
|`varA`|string|lalal|
|`varB`|integer|lall|
|`varC`|integer|lall|

***

**Name**: Complex3
**Type**: Integer
**Description**: lalala

***

**Name**: Complex4
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

Returns a list of [random objects](#the-random-object).

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

Returns a [random object](#the-random-object).

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

Returns a [random object](#the-random-object).

#### Response: `201 Created`

```json
{
    "varA": "Hello",
    "varB": 10,
    "varC": "Hi"
}
```

### Request body (complex)



## Update

<RouteHighlighter method="PATCH" route="/random/:random"/>

Description.

### Request body

|Name|Type|Description|Default value|
|---|-----|-----------|-------------|
|`varA` |string | lala|`null`|
|`varB` *|integer|lalal|None|

### Example

Code sample

Returns a [random object](#the-random-object).

#### Response: `201 Created`

```json
{
    "varA": "Hello",
    "varB": 10,
    "varC": "Hi"
}
```

## Delete all

<RouteHighlighter method="DELETE" route="/random"/>

Deletes all [random objects](#the-random-object).

### Example

Code sample

#### Response: `204 No Content`

## Delete one

<RouteHighlighter method="DELETE" route="/random/:random"/>

Deletes the specified [random object](#the-random-object).

### Example

Code sample

#### Response: `204 No Content`
