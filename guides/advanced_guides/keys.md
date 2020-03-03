# Keys

In MeiliSearch there are three types of keys:

- **Master** key: access to all routes.
- **Private** key: access to all routes except the `/keys` routes.
- **Public** key: Only access:
    - `GET /indexes/search`
    - `GET /indexes/:index_uid/search`
    - `GET /indexes/:index_uid/documents`
    - `GET /indexes/:index_uid/documents/:doc_id`

When a master key is given, a MeiliSearch will have one master key and generate one private key and one public key. **You can not create additionals keys**.

### Master Key

When launching an instance of MeiliSearch, you have the possibility to give a master key. By providing a master key, all routes in MeiliSearch will be protected and will require a key to access.

You can communicate it as :
- an environment variable : `MEILI_MASTER_KEY=xxx`
- a CLI option : `./meilisearch --master-key "xxx"`

With this master key: a private key and a public key will be generated. They can be retrieved using the [keys route](/references/keys.md).

On each API call, the key must be added in [the header](/references/#authentication). Depending on the provided key you will have different permissions ([see above](/guides/advanced_guides/keys.md)).

#### No master Key
If no master key is given, all routes in MeiliSearch can be accessed without a key.

### Reset keys

Since the private and public key are generated based on your master key, to reset the keys, you must change the master key.
This means that you will have to relaunch the MeiliSearch instance with a new master key.

**All key will be changed**. This means that a single key can not be revoked.

Nothing will be lost on instance relaunch, only the keys will be different.
