# Indexes

## List all indexes

<RouteHighlighter method="GET" route="/indexes"/>

List all indexes.


### Example

```bash
curl \
  --request GET 'http://localhost:7700/indexes'
```

#### Response: `200 Ok`

```json
[
  {
    "name": "Movie",
    "uid": "12345678",
    "createdAt": "2019-11-20T09:40:33.711324Z",
    "updatedAt": "2019-11-20T10:16:42.761858Z"
  }
]
```

## Get one index

<RouteHighlighter method="GET" route="/indexes/:uid"/>

Get the index relative information.


#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
| **uid** | The index UID |

### Example

```bash
curl \
  --request GET 'http://localhost:7700/indexes/12345678'
```

#### Response: `200 Ok`

```json
{
  "name": "Movie",
  "uid": "12345678",
  "createdAt": "2019-11-20T09:40:33.711324Z",
  "updatedAt": "2019-11-20T10:16:42.761858Z"
}
```



## Create an index

<RouteHighlighter method="POST" route="/indexes"/>

Create an index.

The [schema](/main_concepts/indexes.md) definition is optionally send through the body.
If no [schema](/main_concepts/indexes.md) has been defined when the first document is sent it will be [infered based on that document](/main_concepts/indexes.md#schema-definition).

A randomly generated UID will be returned. It's associated to the new index. This UID will be essential to make all request over the created index.


#### Body

The body take at least an index name.

The body accepts an optional [schema](/main_concepts/indexes.md) definition of your documents.

```json
{
  "name": "Movies",
  "schema": {
    "id": ["identifier", "indexed", "displayed"],
    "title": ["indexed", "displayed"],
    "description": ["indexed", "displayed"],
    "release_date": ["displayed"],
    "cover": ["displayed"]
  }
}
```

The index can be created without any schema.

If no schema has been defined when the first document is added, the schema will be [infered based upon the first document](/main_concepts/indexes.md#schema-definition).

### Example

```bash
curl \
  --request POST 'http://localhost:7700/indexes' \
  --data '{
  "name": "Movies",
  "schema": {
    "id": ["identifier", "indexed", "displayed"],
    "title": ["displayed", "indexed"],
    "overview": ["displayed", "indexed"],
    "release_date": ["displayed"],
    "poster": ["displayed"]
  }
}'
```

If no schema has been defined:
#### Response: `201 created`
```json
{
  "name": "Movie",
  "uid": "12345678",
  "schema": null,
  "createdAt": "2019-11-20T09:40:33.711476Z",
  "updatedAt": "2019-11-20T09:40:33.711476Z"
}
```

If schema has been given:
#### Response: `201 created`

```json
{
  "updateId": 1,
  "name": "Movie",
  "uid": "12345678",
  "schema": {
    "id": ["identifier", "indexed", "displayed"],
    "title": ["displayed", "indexed"],
    "overview": ["displayed", "indexed"],
    "release_date": ["displayed"],
    "poster": ["displayed"]
  },
  "createdAt": "2019-11-20T09:40:33.711476Z",
  "updatedAt": "2019-11-20T09:40:33.711476Z"
}
```
This `updateId` allows you to [track the current action](/references/updates.md).

## Update an index

<RouteHighlighter method="PUT" route="/indexes/:uid"/>

Update an index name.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID        |

#### Body

The body accepts a new name for the given index.

```json
{
  "name": "Movies"
}
```

### Example

```bash
curl \
  --request PUT 'http://localhost:7700/indexes/12345678' \
  --data '{
  "name": "Movies"
}'
```

#### Response: `200 Ok`

```json
{
  "name": "Movie",
  "uid": "12345678",
  "createdAt": "2019-11-20T09:40:33.711324Z",
  "updatedAt": "2019-11-20T10:16:42.761858Z"
}
```


## Delete an index

<RouteHighlighter method="DELETE" route="/indexes/:uid"/>

Delete an index.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID        |

### Example

```bash
curl \
  --request DELETE 'http://localhost:7700/indexes/12345678'
```

#### Response: `204 No Content`


## Get one index schema

<RouteHighlighter method="GET" route="/indexes/:uid/schema"/>

Get the schema of one index.


#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
| **uid** | The index UID         |

#### Query Parameters

| Query Parameter | Description | Default Value |
|-----------------|-------------|:-------------:|
| **raw**         | Change the format of response | false |

### Example

```bash
curl \
  --request GET 'http://localhost:7700/indexes/12345678/schema'
```


#### Response: `200 Ok`
```json
{
  "id": ["identifier", "indexed", "displayed"],
  "title": ["displayed", "indexed"],
  "overview": ["displayed", "indexed"],
  "release_date": ["displayed"],
  "poster": ["displayed"]
}
```

If `raw` query parameter has been set to `true`:
```json
{
  "identifier": "id",
  "attributes": {
    "id": {
      "displayed": true,
      "indexed": true,
      "ranked": false
    },
    "title": {
      "displayed": true,
      "indexed": true,
      "ranked": false
    },
    "overview": {
      "displayed": true,
      "indexed": true,
      "ranked": false
    },
    "release_date": {
      "displayed": true,
      "indexed": false,
      "ranked": false
    },
    "poster": {
      "displayed": true,
      "indexed": false,
      "ranked": false
    }
  }
}
```

## Update an index schema

<RouteHighlighter method="PUT" route="/indexes/:uid/schema"/>

Update an index schema.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID        |

#### Query Parameters

| Query Parameter | Description | Default Value |
|-----------------|-------------|:-------------:|
| **raw**         | Change the format of response | false |

#### Body

The body accepts a new schema for the given index.

```json
{
  "id": ["identifier", "indexed", "displayed"],
  "title": ["displayed", "indexed"],
  "overview": ["displayed", "indexed"],
  "release_date": ["displayed", "ranked"],
  "poster": ["displayed"]
}
```

If `raw` query parameter has been set to `true`:
```json
{
  "identifier": "id",
  "attributes": {
    "id": {
      "displayed": true,
      "indexed": true,
      "ranked": false
    },
    "title": {
      "displayed": true,
      "indexed": true,
      "ranked": false
    },
    "overview": {
      "displayed": true,
      "indexed": true,
      "ranked": false
    },
    "release_date": {
      "displayed": true,
      "indexed": false,
      "ranked": false
    },
    "poster": {
      "displayed": true,
      "indexed": false,
      "ranked": false
    }
  }
}
```

### Example

```bash
curl \
  --request PUT 'http://localhost:7700/indexes/12345678/schema' \
  --data '{
  "id": ["identifier", "indexed", "displayed"],
  "title": ["displayed", "indexed"],
  "overview": ["displayed", "indexed"],
  "release_date": ["displayed", "ranked"],
  "poster": ["displayed"]
}'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1,
}
```
This `updateId` allows you to [track the current action](/references/updates.md).
