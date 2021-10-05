# Configuration

You can configure MeiliSearch with **environment variables** and **command-line options**.

The configuration options described here affect your entire MeiliSearch instance, not just a single index. For index settings, see [settings](/reference/features/settings.md).

## Configuring an instance with command-line options

Pass command-line options and their respective values when launching a MeiliSearch instance.

```bash
./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
```

```bash
Server is listening on: http://127.0.0.1:7700
```

In the previous example, `./meilisearch` is the command that launches a MeiliSearch instance and `--http-addr` is the option that sets the URL and port this instance will use. **All command-line options are prepended with `--`.**

## Configuring an instance with environment variables

In order to configure a MeiliSearch instance using environment variables, you have to set the environment variable prior to launching the instance. If it's your first time doing this you may want to read more about [setting and listing environment variables](https://linuxize.com/post/how-to-set-and-list-environment-variables-in-linux/), or [use a command-line option](#configuring-an-instance-with-command-line-options) instead.

Environment variables are always identical to the corresponding command-line option, but prepended with `MEILI_` and written in all uppercase. Some options (e.g. `--import-snapshots`) are not available as environment variables.

```bash
export MEILI_DB_PATH=./meilifiles
export MEILI_HTTP_ADDR=127.0.0.1:7700
./meilisearch
```

```bash
Server is listening on: http://127.0.0.1:7700
```

## Usage

Command-line options take precedence over environment variables. If the same configuration option is specified both as a command-line option and as an environment variable, MeiliSearch will use the command-line option and its respective value.

**All configuration options must specify a value.** Using a command-line option or environment variable without specifying a value will throw an error and interrupt the launch process.

```bash
./meilisearch --schedule-snapshot
```

```bash
error: The argument '--schedule-snapshot <schedule-snapshot>' requires a value but none was supplied
```

## Options

### General

- [Database path](/reference/features/configuration.md#database-path)
- [Environment](/reference/features/configuration.md#environment)
- [HTTP address & port binding](/reference/features/configuration.md#http-address-port-binding)
- [Master key](/reference/features/configuration.md#master-key)

### Advanced

- [Disable analytics](/reference/features/configuration.md#disable-analytics)
- [Dumps](/reference/features/configuration.md#dumps-destination)
  - [Dumps destination](/reference/features/configuration.md#dumps-destination)
  - [Import dump](/reference/features/configuration.md#import-dump)
- [Log level](/reference/features/configuration.md#log-level)
- [Max index size](/reference/features/configuration.md#max-index-size)
- [Max UDB size](/reference/features/configuration.md#max-udb-size)
- [Payload limit size](/reference/features/configuration.md#payload-limit-size)
- [Snapshots](/reference/features/configuration.md#schedule-snapshot-creation):
  - [Schedule snapshot creation](/reference/features/configuration.md#schedule-snapshot-creation)
  - [Snapshot destination](/reference/features/configuration.md#snapshot-destination)
  - [Snapshot interval](/reference/features/configuration.md#snapshot-interval)
  - [Import snapshot](/reference/features/configuration.md#import-snapshot)
  - [Ignore missing snapshot](/reference/features/configuration.md#ignore-missing-snapshot)
  - [Ignore snapshot if DB exists](/reference/features/configuration.md#ignore-snapshot-if-db-exists)
- [SSL configuration](/reference/features/configuration.md#ssl-authentication-path):
  - [SSL authentication path](/reference/features/configuration.md#ssl-authentication-path)
  - [SSL certificates path](/reference/features/configuration.md#ssl-certificates-path)
  - [SSL key path](/reference/features/configuration.md#ssl-key-path)
  - [SSL OCSP path](/reference/features/configuration.md#ssl-ocsp-path)
  - [SSL require auth](/reference/features/configuration.md#ssl-require-auth)
  - [SSL resumption](/reference/features/configuration.md#ssl-resumption)
  - [SSL tickets](/reference/features/configuration.md#ssl-tickets)

### Database path

**Environment variable**: `MEILI_DB_PATH`
**CLI option**: `--db-path`
**Default value**: `"data.ms/"`

Designates the location where database files will be created and retrieved.

### Environment

**Environment variable**: `MEILI_ENV`
**CLI option**: `--env`
**Default value**: `development`

Configures the instance's environment. Value must be either `production` or `development`.

`production`:

- Setting a [master key](/reference/features/authentication.md) is **mandatory**
- Logging is disabled
- The [web interface](/reference/features/web_interface.md#web-interface) is disabled

`development`:

- Setting a [master key](/reference/features/authentication.md) is **optional**
- Logs are printed to the standard output
- The web interface is enabled

::: tip
When the server environment is set to `development`, providing a master key is not mandatory. This is useful when debugging and prototyping, but dangerous otherwise since API routes are unprotected.
:::

### HTTP address & port binding

**Environment variable**: `MEILI_HTTP_ADDR`
**CLI option**: `--http-addr`
**Default value**: `"127.0.0.1:7700"`

Sets the HTTP address and port MeiliSearch will use.

### Master key

**Environment variable**: `MEILI_MASTER_KEY`
**CLI option**: `--master-key`
**Default value**: `None`

Sets the instance's master key, automatically protecting all routes except [`GET /health`](/reference/api/health.md).

::: note
You must supply an alphanumeric string when using this option.
:::

Providing a master key is mandatory when `--env` is set to `production`; if none is given, then MeiliSearch will throw an error and refuse to launch.

If no master key is provided in a `development` environment, all routes will be unprotected and publicly accessible.

[Learn more about MeiliSearch's use of security keys.](/reference/features/authentication.md)

### Disable analytics

**Environment variable**: `MEILI_NO_ANALYTICS`
**CLI option**: `--no-analytics`
**Default value**: `false`

Deactivates MeiliSearch's built-in telemetry when set to `true`.

MeiliSearch collects the following data from all instances that do not explicitly opt-out:

- Application version
- Environment (development or production)
- Number of days instance has been active since creation
- Database size
- Last update time
- Number of updates
- Number of documents per index

All collected data is used solely for the purpose of improving MeiliSearch.

[You can read more about our policy on data collection in our telemetry page.](/learn/what_is_meilisearch/telemetry.md)

### Dumps destination

**Environment variable**: `MEILI_DUMPS_DIR`
**CLI option**: `--dumps-dir`
**Default value**: `dumps/`

Sets the directory where MeiliSearch will create dump files.

[Learn more about creating dumps](/reference/api/dump.md).

### Import dump

**Environment variable**: N/A
**CLI option**: `--import-dump`
**Default value**: `none`

Imports the dump file located at the specified path. Path must point to a `.dump` file.

MeiliSearch will only launch once the dump data has been fully indexed. The time this takes depends on the size of the dump file.

*This option is not available as an environment variable.*

### Log level

**Environment variable**: MEILI_LOG_LEVEL
**CLI option**: `--log-level`
**Default value**: `'INFO'`

Defines how much detail should be present in MeiliSearch's logs.

MeiliSearch currently supports four log levels, listed in order of increasing verbosity:

- `'ERROR'`: only log unexpected events indicating MeiliSearch is not functioning as expected
- `'WARN:'` log all unexpected events, regardless of their severity
- `'INFO:'` log all events. This is the default value of `--log-level`
- `'DEBUG'`: log all events and including detailed information on MeiliSearch's internal processes. Useful when diagnosing issues and debugging

### Max index size

**Environment variable**: `MEILI_MAX_INDEX_SIZE`
**CLI option**: `--max-index-size`
**Default value**: `107374182400` (100 GiB)

Sets the maximum size of the index. Value must be given in bytes or explicitly stating a base unit. For example, the default value can be written as `107374182400`, `'107.7Gb'`, or `'107374 Mb'`.

The `index` stores processed data and is different from the `update` database, which handles [pending updates](/learn/advanced/asynchronous_updates.md).

[Learn more about MeiliSearch's database and storage engine.](/reference/under_the_hood/storage.md)

### Max UDB size

**Environment variable**: `MEILI_MAX_UDB_SIZE`
**CLI option**: `--max-udb-size`
**Default value**: `107374182400` (100 GiB)

Sets the maximum size of the `update` database. Value must be given in bytes or explicitly stating a base unit. For example, the default value can be written as `107374182400`, `'107.7Gb'`, or `'107374 Mb'`.

The `update` database handles [pending updates](/learn/advanced/asynchronous_updates.md). This is different from the `index` database, which only stores processed data.

[Learn more about MeiliSearch's database and storage engine.](/reference/under_the_hood/storage.md)

### Payload limit size

**Environment variable**: `MEILI_HTTP_PAYLOAD_SIZE_LIMIT`
**CLI option**: `--http-payload-size-limit`
**Default value**: `104857600` (~100MB)

Sets the maximum size of [accepted payloads](https://docs.meilisearch.com/learn/core_concepts/documents.html#dataset-format). Value must be given in bytes or explicitly stating a base unit. For example, the default value can be written as `107374182400`, `'107.7Gb'`, or `'107374 Mb'`.

### Schedule snapshot creation

**Environment variable**: `MEILI_SCHEDULE_SNAPSHOT`
**CLI option**: `--schedule-snapshot`
**Default value**: `false`

Activates scheduled snapshots when set to `true`. Snapshots are disabled by default.

[Learn more about snapshots](/reference/features/snapshots.md).

### Snapshot destination

**Environment variable**: `MEILI_SNAPSHOT_DIR`
**CLI option**: `--snapshot-dir`
**Default value**: `snapshots/`

Sets the directory where MeiliSearch will store snapshots.

### Snapshot interval

**Environment variable**: `MEILI_SNAPSHOT_INTERVAL_SEC`
**CLI option**: `--snapshot-interval-sec`
**Default value**: `86400` (1 day)

Defines the interval between each snapshot. Value must be given in seconds.

### Import snapshot

**Environment variable**: N/A
**CLI option**: `--import-snapshot`
**Default value**: `None`

Launches MeiliSearch after importing a previously-generated snapshot at the given filepath.

This command will throw an error if:

- A database already exists
- No valid snapshot can be found in the specified path

This behavior can be modified with the [`--ignore-snapshot-if-db-exists`](#ignore-snapshot-if-db-exists) and [`--ignore-missing-snapshot`](#ignore-missing-snapshot) options, respectively.

*This option is not available as an environment variable.*

### Ignore missing snapshot

**Environment variable**: N/A
**CLI option**: `--ignore-missing-snapshot`
**Default value**: `false`

Prevents a MeiliSearch instance from throwing an error when [`--import-snapshot`](#import-snapshot) does not point to a valid snapshot file.

This command will throw an error if `--import-snapshot` is not defined.

*This option is not available as an environment variable.*

### Ignore snapshot if DB exists

**Environment variable**: N/A
**CLI option**: `--ignore-snapshot-if-db-exists`
**Default value**: `false`

Prevents a MeiliSearch instance with an existing database from throwing an error when using `--import-snapshot`. Instead, the snapshot will be ignored and MeiliSearch will launch using the existing database.

This command will throw an error if `--import-snapshot` is not defined.

*This option is not available as an environment variable.*

### SSL authentication path

**Environment variable**: `MEILI_SSL_AUTH_PATH`
**CLI option**: `--ssl-auth-path`
**Default value**: `None`

Enables client authentication in the specified path.

### SSL certificates path

**Environment variable**: `MEILI_SSL_CERT_PATH`
**CLI option**: `--ssl-cert-path`
**Default value**: `None`

Sets the server's SSL certificates.

Value must be a path to PEM-formatted certificates. The first certificate should certify the KEYFILE supplied by `--ssl-key-path`. The last certificate should be a root CA.

### SSL key path

**Environment variable**: `MEILI_SSL_KEY_PATH`
**CLI option**: `--ssl-key-path`
**Default value**: `None`

Sets the server's SSL keyfiles.

Value must be a path to an RSA private key or PKCS8-encoded private key, both in PEM format.

### SSL OCSP path

**Environment variable**: `MEILI_SSL_OCSP_PATH`
**CLI option**: `--ssl-ocsp-path`
**Default value**: `None`

Sets the server's OCSP file. *Optional*

Reads DER-encoded OCSP response from OCSPFILE and staple to certificate.

### SSL require auth

**Environment variable**: `MEILI_SSL_REQUIRE_AUTH`
**CLI option**: `--ssl-require-auth`
**Default value**: `None`

Makes SSL authentication mandatory.

Sends a fatal alert if the client does not complete client authentication.

### SSL resumption

**Environment variable**: `MEILI_SSL_RESUMPTION`
**CLI option**: `--ssl-resumption`
**Default value**: `None`

Activates SSL session resumption.

### SSL tickets

**Environment variable**: `MEILI_SSL_TICKETS`
**CLI option**: `--ssl-tickets`
**Default value**: `None`

Activates SSL tickets.
