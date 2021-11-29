# Security

MeiliSearch allows you to protect your instances by using API keys. API keys give you fine-grained control over which users can access which indexes, endpoints, and  routes.

## Protecting a MeiliSearch instance

To protect a MeiliSearch instance, you must supply it with an alphanumeric string representing your `master` key. This can be done with the [master key configuration option](/reference/features/configuration.md#master-key):

:::: tabs
::: tab CLI 
```sh
./meilisearch --master-key="[your_master_key]"
```
:::

::: tab Environment variable
```sh
MEILI_MASTER_KEY="[your_master_key]"
```
:::
::::

::: note
Launching an instance with a `master` key is mandatory when `env` is set to `production`.
:::

Communicating with a protected instance's endpoints requires adding a `Authorization` header to your request.

### Using the `master` key

Whenever possible, you should avoid using your `master` key to access API endpoints other than [`/keys`](#) and [use API Keys instead](#api-keys). When you launch a secured instance for the first time, MeiliSearch creates a two default API keys:[ `Default Search API Key` and `Default Admin API Key`](#default-api-keys).

The `master` key is the only key with access to the [`/keys` endpoint](#). You can use this endpoint to [create, update, and delete API keys](#api-keys).

### Updating the `master` key

To update the `master` key, you must first terminate your instance. You must then launch it again, [supplying a new value for the `master` key](#protecting-a-meilisearch-instance).

Changing an instance's `master` key renders all active API keys invalid and generates new values for each one of them. This can be useful if your `master` key is ever compromised.

## API keys

API keys are necessary to access the majority of API routes in a protected MeiliSearch instance. When creating API keys, you can set exactly which indexes, endpoints, and routes they can access, as well how long the key should remain valid.

### Creating an API key

You can create API keys by using the [`POST /keys` endpoint](/reference/api/keys.md#create-a-key). This endpoint is always protected and can only be accessed with the `master` key.

This endpoint accepts four arguments: 

- `indexes`: an array of strings indicating the `uid`s of indexes the key can access _(mandatory)_
- `actions`: an array of [valid key actions](/reference/api/keys.md#actions) _(mandatory)_
- `expiresAt`: a valid ISO 8601 datetime after which the key will stop working _(mandatory)_
- `description`: a string describing the key's intended use _(optional)_

`indexes`, `actions`, and `expiresAt` are mandatory. Failing to specify any of these arguments when creating a key will result in an error.

::: note
While we strongly advise against it, you can create an API key with no expiry date by explicitly passing a `null` value to `expiresAt`.
:::

#### Example

You can create an API key that can only perform searches on your `scifi_books` index. Since you expect this key to remain useful for a long time and it doesn't have write access to any other endpoints, you decide you set its expiry date to the next year:

<CodeSamples id="security_guide_create_key_1" />

All [`/keys` endpoints](/reference/api/keys.md) are synchronous, so your key will be generated immediately:

```json
{
  "description": "Search key",
  "key": "d0552b41536279a0ad88bd595327b96f01176a60c2243e906c52ac02375f9bc4",
  "actions": [
      "search"
  ],
  "indexes": ["scifi_books"],
  "expiresAt": "2023-01-01T00:00:00Z",
  "createdAt": "2022-01-01T10:00:00Z",
  "updatedAt": "2022-01-01T10:00:00Z"
}
```

Before you start searching, you need to add content to that index, so you create another key that allows you to add, update, and delete documents. Since this is a sensitive task, you set the key to expire the next day:

<CodeSamples id="security_guide_create_key_2" />

Once again, you'll receive the key in the request response body:

```json
{
  "description": "Manage sci-fi books key",
  "key": "d0552b41536279a0ad88bd595327b96f01176a60c2243e906c52ac02375f9bc4",
  "actions": [
    "documents.add",
    "documents.get",
    "documents.delete"
  ],
  "indexes": ["scifi_books"],
  "expiresAt": "2022-02-01T00:00:00Z",
  "createdAt": "2022-01-01T10:00:00Z",
  "updatedAt": "2022-01-01T10:00:00Z"
}
```

### Default API Keys

When you launch an instance with a `master` key for the first time, MeiliSearch will automatically generate two API keys: `Default Search API Key` and `Default Admin API Key`.

As its name indicates, the `Default Search API Key` can only be used to access the [`/search` endpoint](/reference/api/search.md):

```json
{
  "description": "Default Search API Key (Use it to search from the frontend code)",
  "key": "0a6e572506c52ab0bd6195921575d23092b7f0c284ab4ac86d12346c33057f99", 
  "actions": [
    "search"
  ],
  "indexes": [
    "*"
  ],
  "expiresAt": null,
  "createdAt": "2021-08-11T10:00:00Z",
  "updatedAt": "2021-08-11T10:00:00Z"
}
```

`Default Admin API Key`, instead, has access to all API endpoints except `/keys`:

```json
{
  "description": "Default Admin API Key (Use it for all other operations. Caution! Do not use it on a public frontend)",
  "key": "380689dd379232519a54d15935750cc7625620a2ea2fc06907cb40ba5b421b6f",
  "actions": [
    "*"
  ],
  "indexes": [
    "*"
  ],
  "expiresAt": null,
  "createdAt": "2021-08-11T10:00:00Z",
  "updatedAt": "2021-08-11T10:00:00Z"
}
```

Both default API keys have access to all indexes in an instance and do not have an expiry date. If necessary, they can be deleted or edited like any user-created key.

### Listing API keys

You can use the [`/keys` endpoint](/reference/api/keys.md) to obtain information on any active key in your MeiliSearch instance. This can be useful when you need an overview of which keys exist and what permissions they have.

[`GET /keys`](/reference/api/keys.md#get-all-keys) returns a full list of all existing keys. Expired and deleted keys will not appear in the response. As with creating, deleting, and updating API keys, you need the `master` key to access this endpoint.

[`GET /keys/:key`](/reference/api/keys.md#get-one-key), where `:key` stands for the full value of an active key, returns information on a single key.

#### Example

You can query your instance to confirm which active keys have access to your `scifi_books` index:

<CodeSamples id="security_guide_list_keys_1" />

```json
{
  "results": [
    {
      "description": "Default Search API Key (Use it to search from the frontend code)",
      "key": "0a6e572506c52ab0bd6195921575d23092b7f0c284ab4ac86d12346c33057f99",
      "actions": [
          "search"
      ],
      "indexes": [
          "*"
      ],
      "expiresAt": null,
      "createdAt": "2021-08-11T10:00:00Z",
      "updatedAt": "2021-08-11T10:00:00Z"
    },
    {
      "description": "Default Admin API Key (Use it for all other operations. Caution! Do not share it on the client side)",
      "key": "380689dd379232519a54d15935750cc7625620a2ea2fc06907cb40ba5b421b6f",
      "actions": [
          "*"
      ],
      "indexes": [
          "*"
      ],
      "expiresAt": null,
      "createdAt": "2021-08-11T10:00:00Z",
      "updatedAt": "2021-08-11T10:00:00Z"
    }
  ]
}
```

### Updating an API key

You can freely update an API key until it expires. This includes editing the indexes, endpoints, and routes it can access, as well as its description and expiry date.

To update an API key, you must use the [`PATCH /keys/:key`](/reference/api/keys.md#update-a-key) endpoint which can only be accessed with the `master` key. Here, `:key` stands for the full value of the key you want to update.

#### Example

After creating your `Manage sci-fi books key` with an expiry date set for the next day, you decide to extend its duration in case you need to update some of the books:

<CodeSamples id="security_guide_update_key_1" />

```json
{
  "description": "Manage sci-fi books key",
  "key": "d0552b41536279a0ad88bd595327b96f01176a60c2243e906c52ac02375f9bc4",
  "actions": [
    "documents.add",
    "documents.get",
    "documents.delete"
  ],
  "indexes": ["scifi_books"],
  "expiresAt": "2022-03-01T00:00:00Z",
  "createdAt": "2022-01-01T10:00:00Z",
  "updatedAt": "2022-01-01T10:00:00Z"
}
```

As you can see, MeiliSearch supports partial updates with the `PATCH` route. This means that your payload can contain only the data you want to update—in this case, `expiresAt`.

### Deleting an API key

If a key is no longer useful or has been compromised, you can use [`DELETE /keys/:key`](/reference/api/keys.md#delete-a-key) to disable it before its expiry date.

#### Example

Since you don't expect to routinely update your instance's indexes after adding the first batch of documents, you decide the default admin key MeiliSearch is not necessary:

<CodeSamples id="security_guide_delete_key_1" />

### Expired keys

Once a key is past its `expiresAt` date, it becomes inaccessible and does not show up when querying [`GET /keys` or `GET /keys/:key`](/reference/api/keys.md). It is not currently possible to renew a key after its expiry date.

## Communicating with a protected instance

After an instance is secured, only the [`GET /health` endpoint](/reference/api/health.md) will be publicly available. To access any other API endpoint, you must add an API key with suitable permissions to the request header.

We strongly discourage using the `master` key for API calls. Doing so risks publicly exposing your `master` key and giving malicious users full access over your MeiliSearch indexes.

If you provide an invalid or expired key, you will receive an error as a response to your API call. You will receive the same error if you fail to provide a key when querying a protected route.

### Example

You can use a valid API key with access to the `search` endpoint to query your protected instance:

<CodeSamples id="security_guide_search_key_1" />

## Disabling security

You can make your instance unprotected by restarting MeiliSearch without providing a `master` key:

- If the master key was set up with command-line flags, relaunch the instance without the `--master-key` option
- If the master key was configured with environment variables, unset `MEILI_MASTER_KEY` and relaunch the instance

::: danger
We strongly advise against deactivating MeiliSearch's key-based security in publicly-accessible instances.
:::
