# Authentication

MeiliSearch uses key-based authentication.

When using MeiliSearch in `production`, authentication is mandatory. You can read more about `production` mode in the [configuration reference](/reference/features/configuration).

If a MeiliSearch instance does not use authentication, all routes will be publicly accessible and unprotected.

## Key types

MeiliSearch uses three types of keys:

- The **Master** key grants access to all routes
- The **Private** key grants access to all routes except the `/keys` routes
- The **Public** key only grants access to the following routes:
  - `GET /indexes/:index_uid/search`
  - `POST /indexes/:index_uid/search`
  - `GET /indexes/:index_uid/documents`
  - `GET /indexes/:index_uid/documents/:doc_id`

When a master key is provided, both the private and the public keys are automatically generated. **You cannot create any additional keys**.

The only unprotected route available when using MeiliSearch in `production` is `GET /health`.

## Adding a key

When launching a MeiliSearch instance, you have the option of giving it a master key. By doing so, all routes will be protected and will require a key to be accessed.

You can specify a key by passing the `MEILI_MASTER_KEY` environment variable, or using the command line argument `--master-key`.

After adding the master key, you can retrieve both the private and the public keys on the [keys route](/reference/api/keys.md).

#### No master key

If no master key is provided, all routes can be accessed without requiring any key.

We strongly recommend only using the master key to retrieve the public and private keys.

If an invalid key is provided, you will receive the `HTTP/1.1 403 Forbidden` status code. You will receive the same error if you fail to provide a key when querying a protected route.


## Reset Key

Since both the private and the public keys are generated based on your master key, changing the master key will result in the modification of the two other keys.

After having changed your master key, it is mandatory to restart the MeiliSearch server to ensure the renewal of the private and the public keys.

**All keys will be changed**. Therefore, it is not possible to change only one of the keys.
