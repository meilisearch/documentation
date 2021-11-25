# Security

MeiliSearch allows you to protect your instances and indexes using API keys. When using API keys, you have fine-grained control over which users can access which endpoints, routes, and indexes.

## Using the `master` key to protect a MeiliSearch instance

To protect a MeiliSearch instance, you must supply it with an alphanumeric string using the `--master-key` configuration option:

```sh
./meilisearch --master-key="[an alphanumeric string]"
```

Protecting an instance is mandatory when `env` is set to `production`. Although it is optional to secure MeiliSearch when `env` is set to `development`, it is still recommended to do so if your instance is publicly accessible.

The `master` key is the only key with access to the `/keys` endpoint, which  can be used to create, update, and delete API keys. Even though the `master` key has unrestricted access to all other endpoints, for security reasons we recommend you only use the `master` key for API key management.

The `master` key also has full access to all other API endpoints. That said, we recommend you only use it to manage API keys.

### Updating the `master` key

To update the `master` key, you must first terminate your current instance and then launch it again, supplying a new value for the `--master-key` configuration option.

If you change an instance's `master` key, MeiliSearch will render all active keys  invalid and generate new values for each one of them. This can be useful if your `master` ever becomes compromised.

## Disabling security

You can make your instance unprotected by restarting MeiliSearch without providing a `master` key.

- If the master key was set up with command-line flags, relaunch the instance without the `--master-key` option
- If the master key was configured with environment variables, unset it and relaunch the instance

::: danger
We strongly advise against deactivating MeiliSearch's key-based security in publicly-accessible instances.
:::

## API keys

API keys are necessary to access the majority of API routes in a protected MeiliSearch instance. When creating API keys, you can set exactly which indexes, endpoints, and routes they can access, as well how long the key should remain valid.

### Creating an API key

You can create API keys by using the `POST /keys` endpoint. This endpoint is always protected and can only be accessed with the `master` key.

This endpoint accepts three mandatory arguments: `indexes`, `actions`, and `expiresAt`. `POST /keys` also accepts one optional argument: `description`.

- `indexes`: an array of strings indicating the `uid`s of indexes the key can access
- `actions`: an array containing the actions the key can perform
- `expiresAt`: a valid ISO 8601 datetime after which the key will stop working
- `description`: a string describing the key's intended use

::: note
While we strongly advise against it, you can create an API key with no expiry date by explicitly passing a `null` value to `expiresAt`.
:::

#### Example

You can create an API key that can only perform searches on your `scifi_books` index. Since you expect this key to remain useful for a long time and it doesn't have write access to any other endpoints, you decide you set its expiry date to the next year:

```sh
curl \
  -X POST 'http://localhost:7700/keys/' \
  -H 'Content-Type: application/json' \
  -H "X-Meili-API-Key: [your_master_key]" \
  --data-binary '{
    "description": "Search key",
    "actions": [
        "search"
    ],
    "indexes": ["scifi_books"],
    "expiresAt": "2023-01-01T00:00:00Z"
  }'
```

All `/keys` endpoints are synchronous, so your key will be generated immediately:

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

Before you start searching, you need to feed content to that index, so you create another key that allows you to add, update, and delete documents. Since this is a sensitive task and you don't unauthorized users editing the data in your instance, you set the key to expire the next day:

```sh
curl \
  -X POST 'http://localhost:7700/keys/' \
  -H 'Content-Type: application/json' \
  -H "X-Meili-API-Key: [your_master_key]" \
  --data-binary '{
    "description": "Manage sci-fi books key",
    "actions": [
      "documents.add",
      "documents.get",
      "documents.delete"
    ],
    "indexes": ["scifi_books"],
    "expiresAt": "2022-02-01T00:00:00Z"
  }'
```

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

As its name indicates, the `Default Search API Key` can only be used to access the `/search` endpoint:

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

By default, both automatically-generated API keys have access to all indexes in an instance and are not set to expire. If necessary, they can be deleted or edited like any user-created key.

### Listing API keys

You can use the `/keys` endpoint to obtain information on any active key accepted by your MeiliSearch instance. As with creating, deleting, and updating API keys, you need the `master` key to access this endpoint.

`GET /keys` returns a full list of all existing keys. Expired and deleted keys will not appear in the response. This can be useful when you need an overview of which keys exist and what permissions they have

`GET /keys/:key`, where `:key` stands for the full key value, returns information on a single key. This can be useful when you want to check what a specific key can and cannot access in your instance.

#### Example

You can query your instance to confirm which active keys have access to your `scifi_books` index:

```sh
[code sample]
```

```json
[response]
```

### Updating an API key

You can freely update an API key until it expires. This includes editing the indexes, endpoints, and routes it can access, as well as its description and expiry date.

To update an API key, you must use the `PATCH /keys/:key` endpoint which can only be accessed with the `master` key. Here, `:key` stands for the full key value.

#### Example

After creating your `Manage sci-fi books key` with an expiry date set for the next day, you decide to extend its duration in case you need to update some of the books:

```sh

```

As you can see, MeiliSearch supports partial updates with the `PATCH` route. This means that your payload can contain only the data you want to update—in this case, `expiresAt`.

### Deleting an API key

If a key is no longer useful or has been compromised, you can use `DELETE /keys/:key` to disable it before its expiry date.


#### Example

Since you don't expect to routinely update your instance's indexes after adding the first batch of documents, you decide the default admin key MeiliSearch is not necessary:

```sh

```

```json

```

### Expired keys

Once a key expires, it becomes inaccessible and will not show up when querying `GET /keys` or `GET /keys/:key`. It is not currently possible to renew a key after its expiry date has passed and a new one will have to be created using the `POST /keys` endpoint.

## Communicating with a protected instance

After an instance is secured, only the `GET /health` endpoint will be publicly available. To access any other API endpoint, you must add an API key with suitable permissions to the request header.

We strongly discourage using the `master` key for API calls. Doing so risks publicly exposing your `master` key and giving malicious users full access over your MeiliSearch indexes.

If you provide an invalid or expired key, you will receive an error as a response to your API call. You will receive the same error if you fail to provide a key when querying a protected route.
### Example

You can use a valid API key with access to the `search` endpoint to query your protected instance:

```sh

```

Since you used a valid key with the correct permissions, you get a response containing your search results: 

```json

```

If your key was invalid or was past its expiry date, you would instead receive an error message:

```json

```
