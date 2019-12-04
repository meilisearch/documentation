# API References

Welcome to the beta version of the MeiliSearch Api documentation.

This is our first draft guide in the limbo of the http MeiliSearch routes.
You can navigate into the documentation using the sidebar or by using the search bar above.

If you spot any typo or any error in the documentation like a miss-documented response body for example,
please contact us using the little chat box at the bottom right of this page.

Thank you for your interest and have fun with your HTTP client 🌍

----

# Headers

## Recommended Headers

#### Content Type

All request and response body are in `JSON`. Always specify it in your header.

`Content-Type: application/json`

#### Encoding

You can compress the data you send to your MeiliSearch API. We recommend using it when you add a very large number of documents on the [add documents route](/references/documents.md#add-or-update-documents)

`Content-Encoding: gzip`

We support `gzip`, `brotli` and `deflate`.

#### Decoding

You can request compressed data from MeiliSearch API. We recommend using it on [search route](/references/search.md#search-in-an-index). But only if you have an unusually long response time due to the size of the response.

`Accept-Encoding: gzip, deflate`

We support `gzip`, `brotli` and `deflate`.

#### Authentication

For almost all routes, you need to be recognized by the server to check your permissions. Add your API key to your headers.
Please read the [advanced part about keys](/advanced_guides/keys.md) and [how to manage them](/references/keys.md) for more information.

`X-Meili-API-Key : $API_KEY`

----

# Errors & Status Code

#### Success

**200 - Ok**: Everything worked as expected.

**201 - Created**: The resource has been created (synchronous)

**202 - Accepted**: The update has been pushed in the update queue (asynchronous)

**205 - Reset Content**: All the resources have been deleted


#### Error


**400 - Bad Request**: The request was unacceptable, often due to missing a required parameter.

**401 - Unauthorized**: No valid API key provided.

**403 - Forbidden**: The API key doesn't have the permissions to perform the request.

**404 - Not Found**: The requested resource doesn't exist.

All errors contain a `JSON` body that explains the error.

Response body :
```json
{
  "message": "The error message"
}
```

----

# Asynchronous Updates

In a lot of cases you will receive as server response a simple JSON with only an `updateId` attribute:

```json
{
    "updateId": 2
}
```

MeiliSearch is an **asynchronous API**. It means that the API does not behave as you would typically expect when handling the request's responses. See [advanced guide](/advanced_guides/asynchronous_updates.md) for more information.
