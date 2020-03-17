# Keys

In MeiliSearch, there are three types of keys:

- The **Master** key has access to all routes.
- The **Private** key has access to all routes except the `/keys` routes.
- The **Public** key has only access to the following routes:
    - `GET /indexes/:index_uid/search`
    - `GET /indexes/:index_uid/search`
    - `GET /indexes/:index_uid/documents`
    - `GET /indexes/:index_uid/documents/:doc_id`

When a master key is given to MeiliSearch, the engine will automatically generate the private and the public key. **You cannot create additional keys**.

### Master Key

When launching an instance of MeiliSearch, you have the possibility to give a master key. By providing a master key, all routes in MeiliSearch will be protected and will require a key to access.

You can specify this key by passing the `MEILI_MASTER_KEY` environment variable, or with the command line argument `--master-key`.

With this master key, you can retrieve the private, and the public keys using the [keys route](/references/keys.md).

On each API call, the key must be added to [the header](/references/#authentication).

#### No master key

If no master key is given, all routes in MeiliSearch can be accessed without a key.

### Reset keys

Since the private and public keys are generated based on your master key, you must change the master key to change the two other ones.

After changing your master key, you must restart the MeiliSearch server to ensure the other keys renewal.

**All key will be changed**, thus a single key can not be changed.
