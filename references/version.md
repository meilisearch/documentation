# Version

## Get version of MeiliSearch

<RouteHighlighter method="GET" route="/version"/>

Get version of MeiliSearch.



### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/version'
```

#### Response: `200 Ok`

```json
{
  "commitSha": "b46889b5f0f2f8b91438a08a358ba8f05fc09fc1",
  "buildDate": "2019-11-15T09:51:54.278247+00:00",
  "pkgVersion": "0.1.1"
}
```
