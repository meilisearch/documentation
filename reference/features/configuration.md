# Configuration

Many options are available to configure a MeiliSearch instance. Each of these options is added on MeiliSearch instance launch.

Options can be either communicated through **environment variables** or **command line options**. If both are provided for the same option, the command line option value is kept.

## Passing arguments via the command line

Options are added at launch.

```bash
./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
```

```bash
Server is listening on: http://127.0.0.1:7700
```

## Passing arguments via the environment variables

The format of the environment variables is identical to the command line options with the exception that it is uppercased and `MEILI_` is prepended.

```bash
export MEILI_DB_PATH=./meilifiles
export MEILI_HTTP_ADDR=127.0.0.1:7700
./meilisearch
```

```bash
Server is listening on: http://127.0.0.1:7700
```

## Usage

All options should have a value specified. Adding the flag without a value will throw an error (same goes for environment variables). 
Example: 
`meilisearch --schedule-snapshot` throws an error.
`meilisearch --schedule-snapshot=true` activates snapshots scheduling properly.

## Options

#### General

- [Database path](/reference/features/configuration.md#database-path)
- [HTTP address & port binding](/reference/features/configuration.md#http-address-port-binding)
- [Master key](/reference/features/configuration.md#master-key)
- [Environment](/reference/features/configuration.md#environment)

#### Advanced

- [Analytics](/reference/features/configuration.md#analytics)
- [Payload Limit Size](/reference/features/configuration.md#payload-limit-size)
- [Snapshots](/reference/features/configuration.md#schedule-snapshot-creation):
  - [Schedule Snapchot Creation](/reference/features/configuration.md#schedule-snapshot-creation)
  - [Snapshot Destination](/reference/features/configuration.md#snapshot-destination)
  - [Snapshot Interval](/reference/features/configuration.md#snapshot-interval)
  - [Import Snapshot](/reference/features/configuration.md#import-snapshot)
  - [Ignore Missing Snapshot](/reference/features/configuration.md#ignore-missing-snapshot)
  - [Ignore Snapshot if DB Exists](/reference/features/configuration.md#ignore-snapshot-if-db-exists)
- [Dumps](/reference/features/configuration.md#dumps-destination)
  - [Dumps Destination](/reference/features/configuration.md#dumps-destination)
  - [Import Dump](/reference/features/configuration.md#import-dump)
  - [Dump Batch Size](/reference/features/configuration.md#dump-batch-size)
- [Max MDB Size](/reference/features/configuration.md#max-mdb-size)
- [Max UDB Size](/reference/features/configuration.md#max-udb-size)
- [SSL Configuration](/reference/features/configuration.md#ssl-authentication-path):
  - [SSL Authentication Path](/reference/features/configuration.md#ssl-authentication-path)
  - [SSL Certicates Path](/reference/features/configuration.md#ssl-certificates-path)
  - [SSL Key Path](/reference/features/configuration.md#ssl-key-path)
  - [SSL OCSP Path](/reference/features/configuration.md#ssl-ocsp-path)
  - [SSL Require Auth](/reference/features/configuration.md#ssl-require-auth)
  - [SSL Resumption](/reference/features/configuration.md#ssl-resumption)
  - [SSL Tickets](/reference/features/configuration.md#ssl-tickets)
- [Disable Sentry](/reference/features/configuration.md#disable-sentry)

### Database path

**Environment variable**: `MEILI_DB_PATH`
**CLI option**: `--db-path`

Defines the location for the database files.

**Default value**: `"./data.ms"`

### HTTP address & port binding

**Environment variable**: `MEILI_HTTP_ADDR`
**CLI option**: `--http-addr`

The address the HTTP server will listen on.

**Default value**: `"127.0.0.1:7700"`

### Master Key

**Environment variable**: `MEILI_MASTER_KEY`
**CLI option**: `--master-key`

The master key allowing you to do everything on the server. If no master key is provided all routes will be accessible without keys. This is only possible if you are in `development` environment. An error is thrown if you try to start MeiliSearch without any master key when the environment is set to `production`.

[Learn more about the permission and authentication in this guide.](/reference/features/authentication.md)

**Default value**: `None`

### Analytics

**Environment variable**: `MEILI_NO_ANALYTICS`
**CLI option**: `--no-analytics`

Deactivates analytics.

Analytics allow us to know how many users are using MeiliSearch and the following:

- The application version.
- The environment: development/production.
- The number of days since the first start: Segment development/production.
- The user email: (*Optional*) If the user wants to have alerts.
- The server provider: (*Optional*).
- The database size.
- The last update time.
- The number of updates.
- The number of documents per index.

**Default value**: `false`

### Environment

**Environment variable**: `MEILI_ENV`
**CLI option**: `--env`

By default, MeiliSearch runs in `development` mode.

- `production`: the [master key](/reference/features/authentication.md) is **mandatory**.
- `development`: the [master key](/reference/features/authentication.md) is **optional**, and logs are output in "info" mode (_console output_).

If the server is running in development mode more logs will be displayed, and the master key can be avoided which implies that there is no security on the updates routes.
This is useful to debug when integrating the engine with another service.
In production mode, the [web interface](/reference/features/web_interface.md#web-interface) is disabled.

**Default value**: `development`

### Payload Limit Size

**Environment variable**: `MEILI_HTTP_PAYLOAD_SIZE_LIMIT`
**CLI option**: `--http-payload-size-limit`

The maximum size, in bytes, of accepted JSON payloads.

**Default value**: `104857600` (+=100MB)

### SSL Authentication Path

**Environment variable**: `MEILI_SSL_AUTH_PATH`
**CLI option**: `--ssl-auth-path`

Enable client authentication, and accept certificates signed by those roots provided in CERTFILE

**Default value**: `None`

### SSL Certificates Path

**Environment variable**: `MEILI_SSL_CERT_PATH`
**CLI option**: `--ssl-cert-path`

Read server certificates from CERTFILE. This should contain PEM-format certificates in the right order (the first certificate should certify KEYFILE, the last should be a root CA).

**Default value**: `None`

### SSL Key Path

**Environment variable**: `MEILI_SSL_KEY_PATH`
**CLI option**: `--ssl-key-path`

Read private key from KEYFILE.  This should be a RSA private key or PKCS8-encoded private key, in PEM format.

**Default value**: `None`

### SSL OCSP path

**Environment variable**: `MEILI_SSL_OCSP_PATH`
**CLI option**: `--ssl-ocsp-path`

Read DER-encoded OCSP response from OCSPFILE and staple to certificate. *Optional*.

**Default value**: `None`

### SSL Require Auth

**Environment variable**: `MEILI_SSL_REQUIRE_AUTH`
**CLI option**: `--ssl-require-auth`

Send a fatal alert if the client does not complete client authentication.

**Default value**: `None`

### SSL Resumption

**Environment variable**: `MEILI_SSL_RESUMPTION`
**CLI option**: `--ssl-resumption`

SSL support session resumption.

**Default value**: `None`

### SSL Tickets

**Environment variable**: `MEILI_SSL_TICKETS`
**CLI option**: `--ssl-tickets`

SSL support tickets.

**Default value**: `None`

### Max MDB Size

**Environment variable**: `MEILI_MAX_MDB_SIZE`
**CLI option**: `--max-mdb-size`

The maximum size, in bytes, of the `main` database. The `main` database stores the processed data.

The size must be a modulo value of your OS `PAGE_SIZE` otherwise it will throw an error.
You can find out about the `PAGE_SIZE` with the following command:

```bash
getconf PAGE_SIZE
```

Depending on the OS, it is either the size that will be allocated on launch or the maximum size the database can attain.

- On **UNIX** it is the maximum size.
- On **Windows** it is a fixed size that will be allocated on launch.
  Because this allocates 100Gb on MeiliSearch launch, a Windows user can use this option to decrease the size of the database.

[To know more about storage in MeiliSearch look at this guide](/reference/under_the_hood/storage.md)

**Default value**: `107374182400` (100 GiB)

### Max UDB Size

**Environment variable**: `MEILI_MAX_UDB_SIZE`
**CLI option**: `--max-udb-size`

The maximum size, in bytes, of the `update` database. The `update` database stores the [pending updates](/learn/advanced/asynchronous_updates.md).

The size must be a modulo value of your OS `PAGE_SIZE` otherwise it will throw an error.
You can find out about the `PAGE_SIZE` with the following command:

```bash
getconf PAGE_SIZE
```

Depending on the OS, it is either the size that will be allocated on launch or the maximum size the database can attain.

- On **UNIX** it is the maximum size.
- On **Windows** it is a fixed size that will be allocated on launch.
  Because this allocates 100Gb on MeiliSearch launch, a Windows user can use this option to decrease the size of the database.

[To know more about storage in MeiliSearch look at this guide](/reference/under_the_hood/storage.md)

**Default value**: `107374182400` (100 GiB)

### Disable Sentry

**Environment variable**: `MEILI_NO_SENTRY`
**CLI option**: `--no-sentry`

We use [Sentry](https://sentry.io) to get bug reports and diagnostics, and improve MeiliSearch experience. You can disable it at any moment by launching MeiliSearch by adding the argument above with a `true` as value.

**Default value**: `false`

### Schedule Snapshot Creation

**Environment variable**: `MEILI_SCHEDULE_SNAPSHOT`
**CLI option**: `--schedule-snapshot`

Activates scheduled snapshots. Disabled by default, should be set to `true` to activate it.

[Read more about snapshots](/reference/features/snapshots.md).

**Default value**: `false`

### Snapshot Destination

**Environment variable**: `MEILI_SNAPSHOT_DIR`
**CLI option**: `--snapshot-dir`

The directory path where MeiliSearch will create snapshots.

**Default value**: `snapshots/`

### Snapshot Interval

**Environment variable**: `MEILI_SNAPSHOT_INTERVAL_SEC`
**CLI option**: `--snapshot-interval-sec`

Defines the time gap in seconds between each snapshot creation.

**Default value**: `86400` (1 day)

### Import Snapshot

**CLI option**: `--import-snapshot`

The path of the snapshot file to import.

This command will stop the process if:

- A database already exists
- No snapshot exists in the given path.

If this command is not called, no snapshot will be imported.

### Ignore Missing Snapshot

**CLI option**: `--ignore-missing-snapshot`

The engine ignores missing snapshots and does not throw an error in this case.

Requires `--import-snapshot` to be defined.

**Default value**: `false`

### Ignore Snapshot if DB Exists

**CLI option**: `--ignore-snapshot-if-db-exists`

If a database already exists, MeiliSearch will attempt to launch using that database instead of importing a snapshot. No error is thrown in this case.

Requires `--import-snapshot` to be defined.

**Default value**: `false`

### Dumps Destination

**Environment variable**: `MEILI_DUMPS_DIR`
**CLI option**: `--dumps-dir`

Path of the directory where dumps will be created if the [dump route](/reference/api/dump.md#create-a-dump) is called.

**Default value**: `dumps/`

### Import Dump

**CLI option**: `--import-dump`

Import a dump from the specified path. Must be a `.dump` file.

As the data contained in the dump needs to be indexed, the process will take an amount of time corresponding to the size of the dump. Only when the import is complete and successful will the MeiliSearch server start.

### Dump Batch Size

**Environment variable**: `MEILI_DUMP_BATCH_SIZE`
**CLI option**: `--dump-batch-size`

Sets the batch size used in the dump importation process. This number corresponds to the maximum number of documents indexed in each batch. A larger value will take less time but use more memory.

If a dump import process is killed, this means that you do not have enough RAM. Consider reducing your batch size.

If you find that a dump import process is too slow and you have a lot of RAM to spare, consider increasing the batch size, as it will accelerate the indexation. However, if this leads to the dump process failing, you've gone too far and run out of memory. In this case, you should decrease the batch size until you find the right balance between speed and memory overhead.

**Example**
Imagine you set `--dump-batch-size 1000` and your dump contains 2600 documents. Instead of indexing all 2600 docs in one go, the engine will :

1. Index documents 0 -> 999 (1000 docs)
2. Index documents 1000 -> 1999 (1000 docs)
3. Index documents 2000 -> 2599 (600 docs)

**Default value**: `1024`

[Read more about dumps](/reference/features/dumps.md)
