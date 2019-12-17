# Keys

## Get keys

<RouteHighlighter method="GET" route="/keys"/>

Get all API keys information.


### Example

```bash
curl \
  -X GET 'http://localhost:7700/keys'
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

Get information for a given API key.


### Example

```bash
curl \
  -X GET 'http://localhost:7700/keys/VO6UTDBW5S4YJCL17KAXNZP0HQIG23E9R8MF'
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

Create an API key.


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
  -X POST 'http://localhost:7700/keys' \
  --data '{
      "expiresAt": 1574332928,
      "description": "search key",
      "acl": ["documentsRead"],
      "indexes": ["movies"]
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


### Body

| Variable              | Value         |
|---------------------|---------------|
| **description** | description of the key    |
| **acl** | [List of ACL's](/advanced_guides/keys.md#acl) |
| **indexes** | [List of indexes with wildcards](/advanced_guides/keys.md#indexes) |
| **revoked** | [Boolean to revoke API KEY](/advanced_guides/keys.md#revoked) |

::: warning
`expiresAt` attribute can not be updated. Adding it in the body will result in a bad request error. 
:::

### Example

```bash
curl \
  -X PUT 'http://localhost:7700/keys/0WEJVFD972U6SB3KYRCXINOMHQTP51L8AZG4' \
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


### Example

```bash
curl \
  -X DELETE 'http://localhost:7700/keys/0WEJVFD972U6SB3KYRCXINOMHQTP51L8AZG4'
```

#### Response: `204 No Content`
