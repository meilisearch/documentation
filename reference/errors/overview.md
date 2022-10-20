# Status codes and Meilisearch errors

Meilisearch uses the following standard HTTP codes for a successful or failed API request:

| Status code | Description                                                                                |
| :---------- | :----------------------------------------------------------------------------------------- |
| 200         | ✅ **Ok** Everything worked as expected.                                                   |
| 201         | ✅ **Created** The resource has been created (synchronous)                                 |
| 202         | ✅  **Accepted** The task has been added to the queue (asynchronous)                       |
| 204         | ✅ **No Content** The resource has been deleted or no content has been returned            |
| 205         | ✅ **Reset Content** All the resources have been deleted                                   |
| 400         | ❌ **Bad Request** The request was unacceptable, often due to missing a required parameter |
| 401         | ❌ **Unauthorized** No valid API key provided                                              |
| 403         | ❌ **Forbidden** The API key doesn't have the permissions to perform the request           |
| 404         | ❌ **Not Found** The requested resource doesn't exist                                      |

## Errors

Failed requests are always accompanied by a JSON-formatted error response. Meilisearch errors can be of one of the following types:

| Type              | Description                                                                                                                                                                                                              |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `invalid_request` | This is due to an error in the user input. It is accompanied by the HTTP code `4xx`                                                                                                                                      |
| `internal`        | This is due to machine or configuration constraints. The most common cause is reaching or exceeding hard limits, such as the size of the disk, the size limit of an index, etc. It is accompanied by the HTTP code `5xx` |
| `auth`            | This type of error is related to authentication and authorization. It is accompanied by the HTTP code `4xx`                                                                                                              |

### Error format

```json
{
  "message": "Index `movies` not found.",
  "code": "index_not_found",
  "type": "invalid_request",
  "link": "https://docs.meilisearch.com/errors#index_not_found"
}
```

| Field     | Description                                           |
| :-------- | :---------------------------------------------------- |
| `message` | Human-readable description of the error               |
| `code`    | [Error code](/reference/errors/error_codes.md)        |
| `type`    | [Type](#errors) of error returned                     |
| `link`    | Link to the the relevant section of the documentation |

If you're having trouble understanding an error, take a look at the [complete list](/reference/errors/error_codes.md) of `code` values and descriptions.
