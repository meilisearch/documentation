# Authentication

MeiliSearch uses a key-based authentication. There are three types of keys:

- The **Master** key grants access to all routes.
- The **Private** key grants access to all routes except the `/keys` routes.
- The **Public** key only grants access to the following routes:
  - `GET /indexes/:index_uid/search`
  - `POST /indexes/:index_uid/search`
  - `GET /indexes/:index_uid/documents`
  - `GET /indexes/:index_uid/documents/:doc_id`
- Without any key, you can always access `GET /health`

When a master key is provided to MeiliSearch, both the private and the public keys are automatically generated. **You cannot create any additional keys**.

## Master Key

When launching an instance, you have the option of giving a master key. By doing so, all routes will be protected and will require a key to be accessed.

You can specify it by passing the `MEILI_MASTER_KEY` environment variable, or using the command line argument `--master-key`.

You can retrieve both the private and the public keys using the master key on the [keys route](/reference/api/keys.md).

#### No master key

If no master key is provided, all routes can be accessed without requiring any key.

## API key

If a master key is set, on each API call, a key must be added to [the header](/reference/api/README.md#authentication).

If no or a wrong API key is provided in the header you will have no access to any route and you will receive the
`HTTP/1.1 403 Forbidden` status code.

## Reset key

Since both the private and the public keys are generated based on your master key, changing the master key will result in the modification of the two other keys.

After having changed your master key, it is mandatory to restart the MeiliSearch server to ensure the renewal of the private and the public keys.

**All keys will be changed**. Therefore, it is not possible to change only one of the keys.
