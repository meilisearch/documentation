# Health

The health check endpoint enables you to periodically test the health of your MeiliSearch instance.

## Get health

<RouteHighlighter method="GET" route="/health"/>

Get health of MeiliSearch server.

### Example

<CodeSamples id="get_health_1" />

#### Response: `200 OK`

```json
{
  "status": "available"
}
```