# Errors

In this page you may find an exhaustive list of Meilisearch API errors.

## The basics

- Why do you get an error?
- Types of errors

We use the following HTTP status code in the response depending on the success or failure:

| Status Code         | Description                                                     |
|---------------------|-----------------------------------------------------------------|
| 200 | ✅ **Ok** Everything worked as expected.                                         |
| 201 | ✅ **Created** The resource has been created (synchronous)                          |
| 202 | ✅  **Accepted** The task has been added to the queue (asynchronous)                 |
| 204 | ✅ **No Content** The resource has been deleted or no content has been returned     |
| 205 | ✅ **Reset Content** All the resources have been deleted                              |
| 400 | ❌ **Bad Request** The request was unacceptable, often due to missing a required parameter|
| 401 | ❌ **Unauthorized** No valid API key provided                                           |
| 403 | ❌ **Forbidden** The API key doesn't have the permissions to perform the request       |
| 404 | ❌ **Not Found** The requested resource doesn't exist                               |

## Error types

Meilisearch has the following types of errors:

| Type            | Description                                                                                       |
|-----------------|---------------------------------------------------------------------------------------------------|
| `invalid_request` | This is due to an error in the user input. It is accompanied by the HTTP code `4xx`. |
| `internal`        | This is due to machine or configuration constraints. The most common cause is reaching or exceeding hard limits, such as the size of the disk, the size limit of an index, etc. It is accompanied by the HTTP code `5xx`.  |
| `auth`            | This type of error is related to authentication and authorization. It is accompanied by the HTTP code `4xx`. |

1. Do we have any suggestions on  how we would like the users to handle these errors?
2. It it a good idea to group errors based on situations?

## Error format

All errors contain a JSON body that explains the error:

```json
{
  "message": "Index `movies` not found.",
  "code": "index_not_found",
  "type": "invalid_request",
  "link": "https://docs.meilisearch.com/errors#index_not_found"
}
```

An error contains the following fields:

- `message` : A human-readable description of the error
- `code` : An [error code](/reference/errors/error_codes.md)
- `type` : The [error type](#error-type)
- `link` : A link to the the relevant section of the documentation
