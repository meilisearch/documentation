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
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

```json
[]
```

## Create Key