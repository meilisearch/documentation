# Health

The `/health` route allows you to verify the status and availability of a Meilisearch instance.

## Get health

<RouteHighlighter method="GET" route="/health"/>

Get health of Meilisearch server.

### Example

<CodeSamples id="get_health_1" />

#### Response: `200 OK`

```json
{ "status": "available" }
```
