# Indexes

## List all indexes

<RouteHighlighter method="GET" route="/indexes"/>

List all indexes names.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |

### Example

```bash
curl \
  --location \
  --request GET 'http://4eb345y7.getmeili.com/indexes' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

```json
["movie"]
```

## Get an index schema

<RouteHighlighter method="GET" route="/indexes/:index"/>

Get the schema of a specific index.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |

#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
| **index** | The index UID |

### Example

```bash
curl \
  --location \
  --request GET 'http://4eb345y7.getmeili.com/indexes/4eb345y7' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

```json
{
  "id": ["identifier", "indexed", "stored"],
  "title": ["stored", "indexed"],
  "overview": ["stored", "indexed"],
  "release_date": ["stored"],
  "poster": ["stored"],
  "objectId": ["stored", "indexed"]
}
```



## Create an index

<RouteHighlighter method="POST" route="/indexes/:index"/>

Create an index.

The [schema](/main_concept/indexes.md) definition is optionally send through the body.
If no [schema](/main_concept/indexes.md) has been defined when the first document is sent it will be [infered based on that document](/main_concept/documents.md#schemas).

#### Headers

| Header              | Value            |
|---------------------|------------------|
| **X-Meili-API-Key** | `$API_KEY`       |
| **Content-Type**    | application/json |
| **Accept-encoding** | gzip, deflate    |

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index name        |

#### Body

The body accepts a [schema](/main_concept/indexes.md) definition of your documents.

```json
{
    "id": ["identifier", "indexed", "displayed"],
    "title": ["indexed", "displayed"],
    "description": ["indexed", "displayed"],
    "release_date": ["displayed"],
    "cover": ["displayed"]
}
```

The index can be created without any schema.

If no schema has been defined when the first document is added, the schema will be [infered based upon the first document](/main_concept/documents.md#schemas).

### Example

```bash
curl \
  --location \
  --request POST 'http://localhost:8080/indexes/movies' \
  --header 'Content-Type: application/json' \
  --header "X-Meili-API-Key: $API_KEY" \
  --data '{
    "id": ["identifier", "indexed", "displayed"],
    "title": ["indexed", "displayed"],
    "description": ["indexed", "displayed"],
    "release_date": ["displayed"],
    "cover": ["displayed"]
}'
```

If no schema has been defined : 
#### Response: `204 No content`

If schema has been given : 
#### Response: `201 created`


```json
{
  "updateId": 1,
}
```
This [update id allows you to track](/references/updates) the current action.


## Update an index

<RouteHighlighter method="PUT" route="/indexes/:index"/>

Update an index.

#### Headers

| Header              | Value            |
|---------------------|------------------|
| **X-Meili-API-Key** | `$API_KEY`       |
| **Content-Type**    | application/json |
| **Accept-encoding** | gzip, deflate    |

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index name        |

#### Body

The body accepts a new schema for the given index.

```json
{
    "id": ["identifier", "indexed", "displayed"],
    "title": ["indexed", "displayed"],
    "description": ["indexed", "displayed"],
    "release_date": ["displayed"],
    "cover": ["displayed"]
}
```

### Example

```bash
curl \
  --location \
  --request PUT 'http://localhost:8080/indexes/movies' \
  --header 'Content-Type: application/json' \
  --header "X-Meili-API-Key: $API_KEY" \
  --data '{
    "id": ["identifier", "indexed", "displayed"],
    "title": ["indexed", "displayed"],
    "description": ["indexed", "displayed"],
    "release_date": ["displayed"],
    "cover": ["displayed"]
}'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1,
}
```
This [update id allows you to track](/references/updates) the current action.


## Delete an index

<RouteHighlighter method="DELETE" route="/indexes/:index"/>

Delete an index.

#### Headers

| Header              | Value            |
|---------------------|------------------|
| **X-Meili-API-Key** | `$API_KEY`       |
| **Content-Type**    | application/json |
| **Accept-encoding** | gzip, deflate    |

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index name        |

#### Body

no body

### Example

```bash
curl \
  --location \
  --request DELETE 'http://localhost:8080/indexes/movies' \
  --header 'Content-Type: application/json' \
  --header "X-Meili-API-Key: $API_KEY" \
```

#### Response: `200 OK`

```json
{
  "updateId": 1,
}
```
This [update id allows you to track](/references/updates) the current action.






