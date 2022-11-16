# API reference

Welcome to the Meilisearch API documentation. If you are new to Meilisearch, check out our [quick start guide!](/learn/getting_started/quick_start.md)

Meilisearch is a RESTful API. This page describes the general behavior of the API.

### OpenAPI

You can download the Meilisearch OpenAPI specifications at:

- [YAML](https://bump.sh/doc/meilisearch.yaml)
- [JSON](https://bump.sh/doc/meilisearch.json)

## Document conventions

This API documentation uses the following conventions:

- Curly braces (`{}`) in API routes represent path parameters, e.g., GET `/indexes/{index_uid}`
- Required fields are marked by an asterisk (`*`)
- Placeholder text is in uppercase characters with underscore delimiters, e.g., `MASTER_KEY`

## Authorization

By [providing Meilisearch with a master key at launch](/learn/security/master_api_keys.md#protecting-a-meilisearch-instance), you protect your instance from unauthorized requests. From then on, you must include the `Authorization` header along with a valid API key to access protected routes (all routes except [`/health`](/reference/api/health.md).

<CodeSamples id="authorization_header_1" />

The [`/keys`](/reference/api/keys.md) route can only be accessed using the master key. For security reasons, we recommend using regular API keys for all other routes.

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

Since the `/tasks` endpoint uses a different type of pagination, the response contains different fields. You can read more about it in the [tasks API reference](/reference/api/tasks.md#get-tasks).

## Parameters

Parameters are options you can pass to an API endpoint to modify its response. There are three main types of parameters in Meilisearch's API: request body parameters, path parameters, and query parameters.

### Request body parameters

These parameters are mandatory parts of POST, PUT, and PATCH requests. They accept a wide variety of values and data types depending on the resource you're modifying. You must add these parameters to your request's data payload.

### Path parameters

These are parameters you pass to the API in the endpoint's path. They are used to identify a resource uniquely. You can have multiple path parameters, e.g., `/indexes/{index_uid}/documents/{document_id}`.

If an endpoint does not take any path parameters, this section is not present in that endpoint's documentation.

### Query parameters

These optional parameters are a sequence of key-value pairs and appear after the question mark (`?`) in the endpoint. You can list multiple query parameters by separating them with an ampersand (`&`). The order of query parameters does not matter. They are mostly used with GET endpoints.

If an endpoint does not take any query parameters, this section is not present in that endpoint's documentation.

## Headers

### Content type

Any API request with a payload (`--data-binary`) requires a `Content-Type` header. Content type headers indicate the media type of the resource, helping the client process the response body correctly.

Meilisearch currently supports the following formats:

- `Content-Type: application/json` for JSON
- `Content-Type: application/x-ndjson` for NDJSON
- `Content-Type: text/csv` for CSV

Only the [add documents](/reference/api/documents.md#add-or-replace-documents) and [update documents](/reference/api/documents.md#add-or-update-documents) endpoints accept NDJSON and CSV. For all others, use `Content-Type: application/json`.

### Content encoding

The `Content-Encoding` header indicates the media type is compressed by a given algorithm. Compression improves transfer speed and reduces bandwidth consumption by sending and receiving smaller payloads. The `Accept-Encoding` header,  instead, indicates the compression algorithm the client understands. 

Meilisearch supports the following compression methods:

- `br`: uses the [Brotli](https://en.wikipedia.org/wiki/Brotli) algorithm
- `deflate`: uses the [zlib](https://en.wikipedia.org/wiki/Zlib) structure with the [deflate](https://en.wikipedia.org/wiki/DEFLATE) compression algorithm
- `gzip`: uses the [GZip](https://en.wikipedia.org/wiki/Gzip) algorithm

#### Request compression

The code sample below uses the `Content-Encoding: gzip` header, indicating that the request body is compressed using the `gzip` algorithm:

<CodeSamples id="api_reference_request_gzip_1" />

#### Response compression

Meilisearch compresses a response if the request contains the `Accept-Encoding` header. The code sample below uses the `gzip` algorithm:

<CodeSamples id="api_reference_response_gzip_1" />

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
