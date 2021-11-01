# API references

Welcome to the MeiliSearch API documentation.

::: tip

Check out [the FAQ](/resources/faq.md) for answers to some common questions 💡

:::

## Headers

### Recommended headers

#### Content type

 Requests can be in JSON, CSV, or NDJSON. Responses are always in JSON.

MeiliSearch currently supports the following formats:

- `Content-Type: application/json` for JSON
- `Content-Type: application/x-ndjson` for NDJSON
- `Content-Type: text/csv` for CSV

You **don't need** to specify a header for `GET` and `DELETE` routes. Routes that require a payload **only accept JSON headers.** `PUT` and `POST` document routes accept all headers.

#### Authentication

For almost all routes, you need to be recognized by the server to check your permissions. Add your API key to your headers.
Please read about [authentication keys](/reference/features/authentication.md) and [how to manage them](/reference/api/keys.md) for more information.

`X-Meili-API-Key: $API_KEY`

## Errors & status code

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

All errors contain a JSON body that explains the error.

Response body:

```json
{
    "message": "Index `movies` not found.",
    "code": "index_not_found",
    "type": "invalid_request",
    "link": "https://docs.meilisearch.com/errors#index_not_found"
}
```

If you're having trouble understanding an error, take a look at the [complete list](https://docs.meilisearch.com/errors) of `code` values and descriptions.

## Asynchronous updates

MeiliSearch is an **asynchronous API**. It means that, in a lot of cases, you will receive as server response a simple JSON with only an `updateId` attribute:

```json
{
  "updateId": 2
}
```

This successful response indicates that the operation has been queued or is currently executing.
You can check the status of the operation via the `updateId` and the [get update status route](/reference/api/updates.md).

See more information about [asynchronous updates](/learn/advanced/asynchronous_updates.md).
