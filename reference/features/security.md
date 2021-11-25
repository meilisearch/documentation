# Security

MeiliSearch allows you to protect your instances and indexes using API keys. When using API keys, you have fine-grained control over which users can access which endpoints, routes, and indexes.

## Protecting a MeiliSearch instance

To protect a MeiliSearch instance, you must supply it with an alphanumeric string using the `--master-key` configuration option.

Protecting an instance is mandatory when `env` is set to `production`. Although it is optional to secure MeiliSearch when `env` is set to `development`, it is still recommended to do so if your instance is publicly accessible.

The `master` key has full access to all API endpoints. That said, we recommend you only use it to manage the [keys endpoint].

The `master` key is the only key with access to the `/keys` endpoint, which  can be used to create, update, and delete API keys. Even though the `master` key has unrestricted access to all other endpoints, for security reasons we recommend you only use the `master` key for API key management.

When an instance is launched with a valid `master` key, it will automatically generate two API keys: `Default Search API Keys` and `Default admin api key`. We recommend you use these keys for the majority of operations on a MeiliSearch instance.

## API keys

API keys are the recommended way of interacting with MeiliSearch's API. When creating API keys, you can set exactly which indexes, endpoints, and routes they can access, as well how long the key should remain valid.

### Default API Keys

## Managing API keys


### Creating an API key

### Updating an API key

### Deleting an API key

### Expired keys







## Setting up API keys

We strongly recommend activating API keys when using MeiliSearch in production.

When a MeiliSearch instance is unprotected, all routes are publicly accessible. This means a malicious agent can easily add documents, delete an index, or alter settings.

If [`env`](/reference/features/configuration.md#environment) is set to `production`, using API keys is mandatory.

If `env` is set to `development`, activating API keys is optional but still recommended if your instance is publicly available.

To activate MeiliSearch security, you must launch your instance with a valid master key:

[Example: add master key]

### Key types

There are two types of keys in MeiliSearch:

- `master` key: the master key grants full access to all routes. It is the only key with access to the [api keys endpoint](/)
- `API keys`: 

MeiliSearch uses three types of keys:

- The **Master** key grants access to all routes
- The **Private** key grants access to all routes except the `/keys` routes
- The **Public** key only grants access to the following routes:
  - [`GET /indexes/:index_uid/search`](/reference/api/search.md#search-in-an-index-with-get-route)
  - [`POST /indexes/:index_uid/search`](/reference/api/search.md#search-in-an-index-with-post-route)
  - [`GET /indexes/:index_uid/documents`](/reference/api/documents.md#get-documents)
  - [`GET /indexes/:index_uid/documents/:document_id`](/reference/api/documents.md#get-one-document)

Both the private and public keys are automatically generated whenever you set or change the master key. **You cannot create any additional keys**.

The only route accessible to all, regardless of authentication, is [`GET /health`](/reference/api/health.md).

## Adding the master key

When launching a MeiliSearch instance, you have the option of [setting the master key](/reference/features/configuration.md#master-key). By doing so, all routes will be protected and will require a key to access.

You can specify the master key by setting the `MEILI_MASTER_KEY` environment variable, or passing the command-line argument `--master-key` on launch.

#### Example

:::: tabs

::: tab Env

```bash
export MEILI_MASTER_KEY=[YOUR_MASTER_KEY]
meilisearch
```

:::

::: tab CLI

```bash
meilisearch --master-key=[YOUR_MASTER_KEY]
```

:::

::::

After setting up the master key, you can retrieve both the private and the public keys with the [keys route](/reference/api/keys.md).

## Communicating with a protected instance

When using authentication, a key must be added to [the header](/reference/api/README.md#authentication) of each API call.

We strongly discourage using the master key for API calls. It is intended only for retrieving the public and private keys.

If an invalid key is provided, you will receive the `HTTP/1.1 403 Forbidden` status code. You will receive the same error if you fail to provide a key when querying a protected route.

### Example

<CodeSamples id="authentication_header_1" />

#### Response

```json
{
  "private": "8c222193c4dff5a19689d637416820bc623375f2ad4c31a2e3a76e8f4c70440d",
  "public": "948413b6667024a0704c2023916c21eaf0a13485a586c43e4d2df520852a4fb8"
}
```

## Changing a key

**Changing the master key will automatically generate new private and public keys**. It is not possible to change one key without altering the others.

After changing the master key, it is mandatory to restart the MeiliSearch instance to generate new private and public keys.

## Deactivating key-based authentication

In order to deactivate MeiliSearch's key-based authentication, restart the instance without providing a master key:

- If the master key was set up with command-line flags, relaunch the instance without the `--master-key` option
- If the master key was configured with environment variables, unset it and relaunch the instance
