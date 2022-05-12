# Health

The `/health` route enables you to periodically test the health of your Meilisearch instance.

## Get health

<RouteHighlighter method="GET" route="/health"/>

Get health of Meilisearch server.

### Example

<CodeSamples id="get_health_1" />

#### Response: `200 OK`

```json
{ "status": "available" }
```
