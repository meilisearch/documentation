# Version

## Get version of meilisearch

<RouteHighlighter method="GET" route="/version"/>

Get version of MeiliSearch.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |


### Example

```bash
curl \
  --location \
  --request GET 'http://localhost:8080/version' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

```json
{
  "commitSha": "b46889b5f0f2f8b91438a08a358ba8f05fc09fc1",
  "buildDate": "2019-11-15T09:51:54.278247+00:00",
  "pkgVersion": "0.1.1"
}
```