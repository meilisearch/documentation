# Health

## Get health
<RouteHighlighter method="GET" route="/health"/>

Get health of MeiliSearch server.

### Example

```bash
curl \
  -X GET 'http://localhost:7700/health'
```

#### Response: `204 No Content`

## Update health

<RouteHighlighter method="PUT" route="/health"/>

Update health of MeiliSearch server.

#### Body

The body accepts a boolean to define the MeiliSearch health.

```json
{
  "health": false
}
```

### Example

```bash
curl \
  -X PUT 'http://localhost:7700/health' \
  --data '{
  "health": false
}'
```

#### Response: `204 No Content`
