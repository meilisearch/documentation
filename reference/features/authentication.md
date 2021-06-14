# Authentication

MeiliSearch uses key-based authentication.

When using MeiliSearch in `production`, authentication is mandatory. You can read more about `production` mode in the [configuration reference](/reference/features/configuration).

If a MeiliSearch instance does not use authentication, all routes will be publicly accessible and unprotected.

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

The only unprotected route available when using the built-in key-based authorization is [`GET /health`](/reference/api/health).

## Adding the master key

When launching a MeiliSearch instance, you have the option of giving it a master key. By doing so, all routes will be protected and will require a key to be accessed.

You can specify a key by passing the `MEILI_MASTER_KEY` environment variable, or using the command line argument `--master-key`.

After adding the master key, you can retrieve both the private and the public keys on the [keys route](/reference/api/keys.md).

## Communicating with a protected instance

When using authentication, a key must be added to [the header](/reference/api/README.md#authentication) of each API call.

We strongly recommend only using the master key to retrieve the public and private keys.

If an invalid key is provided, you will receive the `HTTP/1.1 403 Forbidden` status code. You will receive the same error if you fail to provide a key when querying a protected route.

## Changing a key

**Changing the master key will automatically generate new private and public keys**. It is not possible to change one key without altering the others.

After changing the master key, it is mandatory to restart the MeiliSearch instance to generate new private and public keys.
