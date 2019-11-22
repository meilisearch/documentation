# Keys

## Get keys

<RouteHighlighter method="GET" route="/keys"/>

Get api keys.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |


### Example

```bash
curl \
  --location \
  --request GET 'http://localhost:8080/keys' \
  --header 'Content-Type: application/json'
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

```json
[
  {
    "key": "VO6UTDBW5S4YJCL17KAXNZP0HQIG23E9R8MF",
    "description": "search key",
    "acl": [
      "documentsRead"
    ],
    "indexes": [
      "movies"
    ],
    "createdAt": "2019-11-21T09:59:19.016355Z",
    "updatedAt": "2019-11-21T09:59:19.016355Z",
    "expiresAt": "2019-11-21T10:42:08Z",
    "revoked": false
  }
  ]
```

## Get one key

<RouteHighlighter method="GET" route="/keys/:key"/>

Get one api key information.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |


### Example

```bash
curl \
  --location \
  --request GET 'http://localhost:8080/keys/VO6UTDBW5S4YJCL17KAXNZP0HQIG23E9R8MF' \
  --header 'Content-Type: application/json'
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

```json
  {
    "key": "VO6UTDBW5S4YJCL17KAXNZP0HQIG23E9R8MF",
    "description": "search key",
    "acl": [
      "documentsRead"
    ],
    "indexes": [
      "movies"
    ],
    "createdAt": "2019-11-21T09:59:19.016355Z",
    "updatedAt": "2019-11-21T09:59:19.016355Z",
    "expiresAt": "2019-11-21T10:42:08Z",
    "revoked": false
  }
```

## Create Key

<RouteHighlighter method="POST" route="/keys"/>

Create an API keys.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |

### Body

| Variable              | Value         |
|---------------------|---------------|
| **description** | description of the key    |
| **acl** | [List of ACL's](/advanced_guides/keys.md#acl) |
| **indexes** | [List of indexes with wildcards](/advanced_guides/keys.md#indexes) |
| **expiresAt** | Timestamp of expire date |


### Example

```bash
curl \
  --location \
  --request POST 'http://localhost:8080/keys' \
  --header "X-Meili-API-Key: $API_KEY"
  --header 'Content-Type: application/json' \
  --data '{
      "expiresAt": 1574332928,
      "description": "search key",
      "acl": ["documentsRead"],
      "indexes" : ["movies"]
  }'
```

#### Response: `201 Created`

```json
{
  "key":"0WEJVFD972U6SB3KYRCXINOMHQTP51L8AZG4",
  "description":"search key",
  "acl":["documentsRead"],
  "indexes":["movies"],
  "createdAt":"2019-11-21T09:49:00.666009Z",
  "updatedAt":"2019-11-21T09:49:00.666009Z",
  "expiresAt":"2019-11-21T10:42:08Z",
  "revoked":false
}
```

## Update Key

<RouteHighlighter method="PUT" route="/keys/:key"/>

Update an API key.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |

### Body

| Variable              | Value         |
|---------------------|---------------|
| **description** | description of the key    |
| **acl** | [List of ACL's](/advanced_guides/keys.md#acl) |
| **indexes** | [List of indexes with wildcards](/advanced_guides/keys.md#indexes) |
| **revoked** | [Boolean to revoke API KEY](/advanced_guides/keys.md#revoke) |

### Example

```bash
curl \
  --location \
  --request PUT 'http://localhost:8080/keys/0WEJVFD972U6SB3KYRCXINOMHQTP51L8AZG4' \
  --header "X-Meili-API-Key: $API_KEY"
  --header 'Content-Type: application/json' \
  --data '{
      "description": "Read and write documents",
      "acl": ["documentsRead", "documentsWrite"]
  }'
```

#### Response: `200 Ok`

```json
{
  "key": "0WEJVFD972U6SB3KYRCXINOMHQTP51L8AZG4",
  "description": "Read and write documents",
  "acl": ["documentsRead", "documentsWrite"],
  "indexes": ["movies"],
  "createdAt": "2019-11-21T09:49:00.666009Z",
  "updatedAt": "2019-11-21T10:31:29.492113Z",
  "expiresAt": "2019-11-21T10:42:08Z",
  "revoked": false
}
```

## Delete Key

<RouteHighlighter method="DELETE" route="/keys/:key"/>

Delete an API key.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |

### Example

```bash
curl \
  --request DELETE 'http://localhost:8080/keys/0WEJVFD972U6SB3KYRCXINOMHQTP51L8AZG4' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `204 No Content`
