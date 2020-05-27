# Health

The `health` route gives information about the health of your MeiliSearch instance.

## Get health

<RouteHighlighter method="GET" route="/health"/>

Get health of MeiliSearch server.

### Example

<code-samples id="get_health_1" />

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

<code-samples id="update_health_1" />

#### Response: `204 No Content`
