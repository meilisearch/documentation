# API Reference

Welcome to the MeiliSearch API documentation.

::: tip

Check out [the FAQ](/faq/) for answers to some common questions 💡

:::

## Headers

### Recommended Headers

#### Content Type

Every request and response body is in `JSON`.

It is **not required** to have `Content-Type: application/json` in the header. Any content-type is accepted.

#### Authentication

For almost all routes, you need to be recognized by the server to check your permissions. Add your API key to your headers.
Please read about [authentication keys](/reference/features/authentication.md) and [how to manage them](/reference/api/keys.md) for more information.

`X-Meili-API-Key: $API_KEY`

## Errors & Status Code

#### Success

**200 - Ok**: Everything worked as expected.

**201 - Created**: The resource has been created (synchronous)

**202 - Accepted**: The update has been pushed in the update queue (asynchronous)

**204 - No Content**: The resource has been deleted or no content has been returned

**205 - Reset Content**: All the resources have been deleted

#### Error

**400 - Bad Request**: The request was unacceptable, often due to missing a required parameter.

**401 - Unauthorized**: No valid API key provided.

**403 - Forbidden**: The API key doesn't have the permissions to perform the request.

**404 - Not Found**: The requested resource doesn't exist.

All errors contain a `JSON` body that explains the error.

Response body:

```json
{
  "message": "The error message"
}
```

## Asynchronous Updates

MeiliSearch is an **asynchronous API**. It means that, in a lot of cases, you will receive as server response a simple JSON with only an `updateId` attribute:

```json
{
  "updateId": 2
}
```

This successful response indicates that the operation has been queued or is currently executing.
You can check the status of the operation via the `updateId` and the [get update status route](/references/updates.md).

See more information about [asynchronous updates](/learn/advanced/asynchronous_updates.md).
