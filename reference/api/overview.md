# API reference

Welcome to the Meilisearch API documentation. If you are new to Meilisearch, check out our [quick start guide!](/learn/getting_started/quick_start.md)

Meilisearch is a RESTful API. This page describes the general behavior of the API.

## OpenAPI

The Meilisearch OpenAPI specifications:

- [JSON](https://bump.sh/doc/meilisearch.json)
- [YAML](https://bump.sh/doc/meilisearch.yaml)

## Document conventions

The API documentation uses the following conventions:

- Curly braces (`{}`) represent path parameters, e.g., GET `/indexes/{index_uid}`
- Required fields are marked by an asterisk (`*`)
- Placeholder text is in uppercase characters with underscore delimiters, e.g., `MASTER_KEY`

## Authorization

Once you [provide Meilisearch with a master key at launch](/learn/security/master_api_keys.md#protecting-a-meilisearch-instance), you must include the `Authorization` header for all your API requests. The `Authorization` header provides the credentials needed to access a protected resource.

<CodeSamples id="authorization_header_1" />

While the master key grants full access to your Meilisearch instance, it should only be used for managing the [`/keys`](/reference/api/keys.md) route. We recommend using API keys for most of your day-to-day operations. API keys grant access to specific indexes, routes, and endpoints.

::: note
 v0.24 and below use the `X-MEILI-API-KEY: apiKey` authorization header:
<CodeSamples id="updating_guide_check_version_old_authorization_header" />
:::

[To learn more about keys and security, refer to our dedicated guide.](/learn/security/master_api_keys.md)

## Pagination

Meilisearch paginates all GET routes that return multiple resources, e.g., GET `/indexes`, GET `/documents`, GET `/keys`, etc. This allows you to work with manageable chunks of data. All these routes return 20 results per page, but you can configure it using the `limit` query parameter. You can move between pages using `offset`.

All paginated responses contain the following fields:

| Name         | Type    | Description                  |
| :----------- | :------ | :--------------------------- |
| **`offset`** | Integer | Number of resources skipped  |
| **`limit`**  | Integer | Number of resources returned |
| **`total`**  | Integer | Total number of resources    |

### `/tasks` endpoint

The `/tasks` endpoint uses a different type of pagination; hence the response contains different fields. You can read more about it in the [tasks API reference](/reference/api/tasks.md#get-tasks).

## Parameters

Parameters are options passed to the endpoint to influence the response. They are added at the end of the string for GET requests. For POST requests, they are added to the body.

### Path parameters

These are parameters you pass to the API in the endpoint's path. They are used to identify a resource uniquely. You can have multiple path parameters, e.g., `/indexes/{index_uid}/documents/{document_id}`.

We omit this section if an endpoint does not take any path parameters.

### Query parameters

These optional parameters are a sequence of key-value pairs and appear after the question mark (`?`) in the endpoint. You can list multiple query parameters by separating them with an ampersand (`&`). The order of query parameters does not matter.

We omit this section if an endpoint does not take any query parameters.

## Headers

### Content type

Any API request with a payload (`--data-binary`) requires a `Content-Type` header. Content type headers indicate the media type of the resource, helping the client process the response body correctly.

Meilisearch currently supports the following formats:

- `Content-Type: application/json` for JSON
- `Content-Type: application/x-ndjson` for NDJSON
- `Content-Type: text/csv` for CSV

The only endpoints which currently accept NDJSON and CSV `Content-Type` are the [add documents](/reference/api/documents.md#add-or-replace-documents) and [update documents](/reference/api/documents.md#add-or-update-documents) endpoints. For all others, use `Content-Type: application/json`.

## Request body

The request body is data sent to the API. It is used with PUT, POST, and PATCH methods to create or update a resource. You must provide request bodies in JSON.

## Response body

Meilisearch is an **asynchronous API**. This means that in response to most write requests, you will receive a summarized version of the `task` object:

```json
{
    "taskUid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "indexUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task).

See more information about [asynchronous operations](/learn/advanced/asynchronous_operations.md).

## Data types

The Meilisearch API supports [JSON data types](https://www.w3schools.com/js/js_json_datatypes.asp).

## Status codes and Meilisearch errors

| Status code | Description                                                                                |
| ----------- | ------------------------------------------------------------------------------------------ |
| 200         | ✅ **Ok** Everything worked as expected.                                                   |
| 201         | ✅ **Created** The resource has been created (synchronous)                                 |
| 202         | ✅  **Accepted** The task has been added to the queue (asynchronous)                       |
| 204         | ✅ **No Content** The resource has been deleted or no content has been returned            |
| 205         | ✅ **Reset Content** All the resources have been deleted                                   |
| 400         | ❌ **Bad Request** The request was unacceptable, often due to missing a required parameter |
| 401         | ❌ **Unauthorized** No valid API key provided                                              |
| 403         | ❌ **Forbidden** The API key doesn't have the permissions to perform the request           |
| 404         | ❌ **Not Found** The requested resource doesn't exist                                      |

### Errors

Failed requests are always accompanied by a JSON-formatted error response. Meilisearch errors can be of one of the following types:

| Type              | Description                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `invalid_request` | This is due to an error in the user input. It is accompanied by the HTTP code `4xx`                                                                                                                                      |
| `internal`        | This is due to machine or configuration constraints. The most common cause is reaching or exceeding hard limits, such as the size of the disk, the size limit of an index, etc. It is accompanied by the HTTP code `5xx` |
| `auth`            | This type of error is related to authentication and authorization. It is accompanied by the HTTP code `4xx`                                                                                                              |

Response body:

```json
{
  "message": "Index `movies` not found.",
  "code": "index_not_found",
  "type": "invalid_request",
  "link": "https://docs.meilisearch.com/errors#index_not_found"
}
```

If you're having trouble understanding an error, take a look at the [complete list](/reference/api/error_codes.md) of `code` values and descriptions.
