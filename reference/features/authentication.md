# Authentication

MeiliSearch uses key-based authentication.

If your [environment](/reference/features/configuration.md#environment) is set to `production`, authentication is mandatory. If it is set to `development` (the default), then authentication is optional.

If a MeiliSearch instance does not use authentication, all routes will be publicly accessible and unprotected.

Authentication is activated by setting a master key.

## Key types

MeiliSearch uses three types of keys:

- The **Master** key grants access to all routes
- The **Private** key grants access to all routes except the `/keys` routes
- The **Public** key only grants access to the following routes:
  - [`GET /indexes/:index_uid/search`](/reference/api/search#search-in-an-index-with-get-route)
  - [`POST /indexes/:index_uid/search`](/reference/api/search#search-in-an-index-with-post-route)
  - [`GET /indexes/:index_uid/documents`](/reference/api/documents#get-documents)
  - [`GET /indexes/:index_uid/documents/:document_id`](/reference/api/documents#get-one-document)

Both the private and public keys are automatically generated whenever you set or change the master key. **You cannot create any additional keys**.

The only route accessible to all, regardless of authentication, is [`GET /health`](/reference/api/health).

## Adding the master key

When launching a MeiliSearch instance, you have the option of [setting the master key](/reference/features/configuration.md#master-key). By doing so, all routes will be protected and will require a key to access.

You can specify the master key by setting the `MEILI_MASTER_KEY` environment variable, or passing the command-line argument `--master-key` on launch.

#### Example

:::: tabs

::: tab Env

<<<<<<< HEAD
```bash
export MEILI_MASTER_KEY=[YOUR_MASTER_KEY]
meilisearch
```
=======
## Adding the master key
>>>>>>> c6bf45fd (Update reference/features/authentication.md)

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

## Changing a key

**Changing the master key will automatically generate new private and public keys**. It is not possible to change one key without altering the others.

After changing the master key, it is mandatory to restart the MeiliSearch instance to generate new private and public keys.

## Deactivating key-based authentication

In order to deactivate MeiliSearch's key-based authentication, restart the instance without providing a master key:

- If the master key was set up with command-line flags, relaunch the instance without the `--master-key` option
- If the master key was configured with environment variables, unset it and relaunch the instance