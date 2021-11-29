# Keys

Each instance of MeiliSearch has three keys: a master, a private, and a public. Each key has a given set of permissions on the API routes.

You must have the master key to access the `keys` route.

[More information about the keys and their rights](/reference/features/security.md).

## Get keys

<RouteHighlighter method="GET" route="/keys"/>

Get the **private** and **public** [key](/reference/features/security.md).

::: warning
You must have the master key to access this route.
:::

### Example

<CodeSamples id="get_keys_1" />

#### Response: `200 Ok`

```json
{
  "private": "8c222193c4dff5a19689d637416820bc623375f2ad4c31a2e3a76e8f4c70440d",
  "public": "948413b6667024a0704c2023916c21eaf0a13485a586c43e4d2df520852a4fb8"
}
```
