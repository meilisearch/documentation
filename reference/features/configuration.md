# Configuration

Options can be passed to a MeiliSearch instance through **environment variables** and **command line options**.

## Configuring an instance with command-line flags

Options and their respective arguments must be passed when launching the instance.

```bash
./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
```

```bash
Server is listening on: http://127.0.0.1:7700
```

## Configuring an instance with environment variables

Environment variables are always identical to the command-line flags, but prepended with `MEILI_` and written in upper case.

```bash
export MEILI_DB_PATH=./meilifiles
export MEILI_HTTP_ADDR=127.0.0.1:7700
./meilisearch
```

```bash
Server is listening on: http://127.0.0.1:7700
```

## Usage

Command-line flags take precedence over environment variables. If an option is specified both as a flag and an environment variable, the command-line flag and its respective value will be used.

All options should have a value specified. Adding a command-line flag or environment variable without a value will throw an error.

```bash
./meilisearch --schedule-snapshot
```

```bash
error: The argument '--schedule-snapshot <schedule-snapshot>' requires a value but none was supplied
```

## Options

### General

- [Database path](/reference/features/configuration.md#database-path)
- [HTTP address & port binding](/reference/features/configuration.md#http-address-port-binding)
- [Master key](/reference/features/configuration.md#master-key)
- [Environment](/reference/features/configuration.md#environment)

### Advanced

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
**Default value**: `"./data.ms"`

Set the location of the database file.

### HTTP address & port binding

**Environment variable**: `MEILI_HTTP_ADDR`
**CLI option**: `--http-addr`
**Default value**: `"127.0.0.1:7700"`

Set the HTTP address and port the MeiliSearch instance server will use.

### Master Key

**Environment variable**: `MEILI_MASTER_KEY`
**CLI option**: `--master-key`
**Default value**: `None`

Set an instance's master key, automatically protecting all routes except `GET /health`. Providing a key is mandatory when environment is set to `production`.

If no master key is provided in a `development` environment, all routes will be unprotected and publicly accessible.

If no master key is provided in a `production` environment, the MeiliSearch instance will throw an error and refuse to launch.

[Learn more about MeiliSearch's use of security keys in this guide.](/reference/features/authentication.md)


### Environment

**Environment variable**: `MEILI_ENV`
**CLI option**: `--env`
**Default value**: `development`

By default, MeiliSearch runs in `development` mode.

- `production`: setting a [master key](/reference/features/authentication.md) is **mandatory**.
- `development`: setting a [master key](/reference/features/authentication.md) is **optional**. Log level is automatically set to `info`.

If the server is running in `development` mode, logs are more verbose and providing a master key is not mandatory. This is useful when debugging, but dangerous otherwise since update routes are unprotected.

The [web interface](/reference/features/web_interface.md#web-interface) is disabled in `production` mode.

### Analytics

**Environment variable**: `MEILI_NO_ANALYTICS`
**CLI option**: `--no-analytics`
**Default value**: `false`

If set to `true`, deactivates MeiliSearch's built-in analytics and telemetry.

By default, MeiliSearch collects the following data from all instances that do not explicitly opt-out:

- Application version
- Environment (development or production)
- Number of days since the first start (segment development/production
- Database size
- Last update time
- Number of updates
- Number of documents per index

Additionally, a user does not disable analytics, they may also provide an email address and their server provider by setting the environment variables `MEILI_USER_EMAIL` and `MEILI_SERVER_PROVIDER`.

All collected data is used solely for the purpose of improving MeiliSearch.

A full document describing why we collect this data and how we use it is forthcoming.

### Payload limit size

**Environment variable**: `MEILI_HTTP_PAYLOAD_SIZE_LIMIT`
**CLI option**: `--http-payload-size-limit`
**Default value**: `104857600` (~100MB)

Set the maximum size, in bytes, of accepted JSON payloads.

### SSL authentication path

**Environment variable**: `MEILI_SSL_AUTH_PATH`
**CLI option**: `--ssl-auth-path`
**Default value**: `None`

Enable client authentication and accept certificates signed by the roots provided in CERTFILE.

### SSL Certificates Path

**Environment variable**: `MEILI_SSL_CERT_PATH`
**CLI option**: `--ssl-cert-path`

Read server certificates from CERTFILE. This should contain PEM-format certificates in the right order (the first certificate should certify KEYFILE, the last should be a root CA).

**Default value**: `None`

### SSL key path

**Environment variable**: `MEILI_SSL_KEY_PATH`
**CLI option**: `--ssl-key-path`

Read private key from KEYFILE.  This should be a RSA private key or PKCS8-encoded private key, in PEM format.

**Default value**: `None`

### SSL OCSP path

**Environment variable**: `MEILI_SSL_OCSP_PATH`
**CLI option**: `--ssl-ocsp-path`

Read DER-encoded OCSP response from OCSPFILE and staple to certificate. *Optional*.

**Default value**: `None`

### SSL require auth

**Environment variable**: `MEILI_SSL_REQUIRE_AUTH`
**CLI option**: `--ssl-require-auth`

Send a fatal alert if the client does not complete client authentication.

**Default value**: `None`

### SSL resumption

**Environment variable**: `MEILI_SSL_RESUMPTION`
**CLI option**: `--ssl-resumption`

SSL support session resumption.

**Default value**: `None`

### SSL tickets

**Environment variable**: `MEILI_SSL_TICKETS`
**CLI option**: `--ssl-tickets`

SSL support tickets.

**Default value**: `None`

### Max MDB size

**Environment variable**: `MEILI_MAX_MDB_SIZE`
**CLI option**: `--max-mdb-size`
**Default value**: `107374182400` (100 GiB)

Set the maximum size of the `main` database, in bytes. The `main` database stores the processed data and is different from the `update` database, which handles [pending updates](/learn/advanced/asynchronous_updates.md).

The maximum MDB size must be a modulo value of the OS's `PAGE_SIZE`. To find the OS's `PAGE_SIZE`, use the following command:

```bash
getconf PAGE_SIZE
```

On **UNIX** systems (e.g. Linux, MacOS) `getconf` returns the maximum page size.

On **Windows**, `getconf` returns a fixed size that will be allocated when launching the instance.

[Learn more about MeiliSearch's database and storage engine.](/reference/under_the_hood/storage.md)

### Max UDB size

**Environment variable**: `MEILI_MAX_UDB_SIZE`
**CLI option**: `--max-udb-size`
**Default value**: `107374182400` (100 GiB)

The maximum size, in bytes, of the `update` database. The `update` database handles the [pending updates](/learn/advanced/asynchronous_updates.md). This is different from the `main` database, which only stores processed data.

The maximum UDB size must be a modulo value of the OS's `PAGE_SIZE`. To find the OS's `PAGE_SIZE`, use the following command:

```bash
getconf PAGE_SIZE
```

On **UNIX** systems (e.g. Linux, MacOS) `getconf` returns the maximum page size.

On **Windows**, `getconf` returns a fixed size that will be allocated when launching the instance.

[Learn more about MeiliSearch's database and storage engine.](/reference/under_the_hood/storage.md)

### Disable sentry

**Environment variable**: `MEILI_NO_SENTRY`
**CLI option**: `--no-sentry`
**Default value**: `false`

Deactivates Sentry when set to `true`.

We use [Sentry](https://sentry.io) to receive bug reports and diagnostics that help us improve MeiliSearch.

### Schedule snapshot creation

**Environment variable**: `MEILI_SCHEDULE_SNAPSHOT`
**CLI option**: `--schedule-snapshot`
**Default value**: `false`

Activates scheduled snapshots when set to `true`. Disabled by default.

[Learn more about snapshots](/reference/features/snapshots.md).

### Snapshot destination

**Environment variable**: `MEILI_SNAPSHOT_DIR`
**CLI option**: `--snapshot-dir`
**Default value**: `snapshots/`

Sets the directory path where MeiliSearch will create snapshots.

### Snapshot Interval

**Environment variable**: `MEILI_SNAPSHOT_INTERVAL_SEC`
**CLI option**: `--snapshot-interval-sec`
**Default value**: `86400` (1 day)

Defines the interval between the creation of each snapshot. Value should be given in seconds.

### Import Snapshot

**Environment variable**: N/A
**CLI option**: `--import-snapshot`
**Default value**: `none`

Launches an instance with a previously-generated snapshot.

This command will throw an error if:

- A database already exists
- No valid snapshot can be found in the specified path

This option is not available as an environment variable.

### Ignore missing snapshot

**Environment variable**: N/A
**CLI option**: `--ignore-missing-snapshot`
**Default value**: `false`

Prevents a MeiliSearch instance from throwing an error when the path supplied to `--import-snapshot` does not point to a valid snapshot file.

This command will throw an error if `--import-snapshot` is not defined.

This option is not available as an environment variable.

### Ignore snapshot if DB exists

**Environment variable**: N/A
**CLI option**: `--ignore-snapshot-if-db-exists`
**Default value**: `false`

Prevents a MeiliSearch instance with an existing database from throwing an error when `--import-snapshot` is used.

This command will throw an error if `--import-snapshot` is not defined.

This option is not available as an environment variable.

### Dumps destination

**Environment variable**: `MEILI_DUMPS_DIR`
**CLI option**: `--dumps-dir`
**Default value**: `dumps/`

Sets the directory for dump file storage.

[Learn more about creating dumps of MeiliSearch instances](/reference/api/dump.md).

### Import dump

**Environment variable**: N/A
**CLI option**: `--import-dump`
**Default value**: `none`

Imports a dump located in the specified path. Must be a `.dump` file.

The MeiliSearch instance will only be launched once the dump data has been fully indexed.

This option is not available as an environment variable.

### Dump batch size

**Environment variable**: `MEILI_DUMP_BATCH_SIZE`
**CLI option**: `--dump-batch-size`
**Default value**: `1024`

Sets the batch size used in the dump importation process. This number corresponds to the maximum number of documents indexed in each batch. A larger value will take less time but use more memory.

Bigger batch sizes can speed up the import process, but require more RAM. Setting a larger size than a system can handle might cause a MeiliSearch instance to crash; if this happens, consider reducing the batch size.

**Example**
A dump contains 2600 documents. If `--dump-batch-size` is set to 1000, MeiliSearch will not index all 2600 in one go. Instead, the instance will:

1. First index documents 0 -> 999 (1000 docs)
2. Then index documents 1000 -> 1999 (1000 docs)
3. And finally index documents 2000 -> 2599 (600 docs)

[Learn more about MeiliSearch dumps](/reference/features/dumps.md)