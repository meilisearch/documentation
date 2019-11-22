# Version

## Get version of meilisearch

<RouteHighlighter method="GET" route="/version"/>

Get version of MeiliSearch.



### Example

```bash
curl \
  --request GET 'http://localhost:8080/version' \
```

#### Response: `200 Ok`

```json
{
  "commitSha": "b46889b5f0f2f8b91438a08a358ba8f05fc09fc1",
  "buildDate": "2019-11-15T09:51:54.278247+00:00",
  "pkgVersion": "0.1.1"
}
```

::: warning
  No commitSha in SaaS version of MeiliSearch
:::