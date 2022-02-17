# Instance options

You can configure Meilisearch with **environment variables** and **command-line options**.

The configuration options described here affect your entire Meilisearch instance, not just a single index. For index settings, see [settings](/learn/configuration/settings.md).

## Configuring an instance with command-line options

Pass command-line options and their respective values when launching a Meilisearch instance.

```bash
./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
```

```bash
Server is listening on: http://127.0.0.1:7700
```

In the previous example, `./meilisearch` is the command that launches a Meilisearch instance and `--http-addr` is the option that sets the URL and port this instance will use. **All command-line options are prepended with `--`.**

Some of these options are command-line flags and unlike command-line options, **they don't take any values**.

```bash
./meilisearch --no-analytics
```

The above example disables analytics for the Meilisearch instance without accepting any values.

We will refer to command-line with the :triangular_flag_on_post: emoji on this page.

## Configuring an instance with environment variables

In order to configure a Meilisearch instance using environment variables, you have to set the environment variable prior to launching the instance. If it's your first time doing this you may want to read more about [setting and listing environment variables](https://linuxize.com/post/how-to-set-and-list-environment-variables-in-linux/), or [use a command-line option](#configuring-an-instance-with-command-line-options) instead.

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

Command-line options take precedence over environment variables. If the same configuration option is specified both as a command-line option and as an environment variable, Meilisearch will use the command-line option and its respective value.

**All configuration options must specify a value.** Using a command-line option or environment variable without specifying a value will throw an error and interrupt the launch process.

```bash
./meilisearch --schedule-snapshot
```

```bash
error: The argument '--schedule-snapshot <schedule-snapshot>' requires a value but none was supplied
```

## Options

### General

- [Database path](/learn/configuration/instance_options.md#database-path)
- [Environment](/learn/configuration/instance_options.md#environment)
- [HTTP address & port binding](/learn/configuration/instance_options.md#http-address-port-binding)
- [Master key](/learn/configuration/instance_options.md#master-key)

### Advanced

- [Disable analytics](/learn/configuration/instance_options.md#disable-analytics) :triangular_flag_on_post:
- [Dumps](/learn/configuration/instance_options.md#dumps-destination)
  - [Dumps destination](/learn/configuration/instance_options.md#dumps-destination)
  - [Import dump](/learn/configuration/instance_options.md#import-dump)
- [Log level](/learn/configuration/instance_options.md#log-level)
- [Max index size](/learn/configuration/instance_options.md#max-index-size)
- [Max TASK_DB size](/learn/configuration/instance_options.md#max-task-db-size)
- [Payload limit size](/learn/configuration/instance_options.md#payload-limit-size)
- [Snapshots](/learn/configuration/instance_options.md#schedule-snapshot-creation):
  - [Schedule snapshot creation](/learn/configuration/instance_options.md#schedule-snapshot-creation) :triangular_flag_on_post:
  - [Snapshot destination](/learn/configuration/instance_options.md#snapshot-destination)
  - [Snapshot interval](/learn/configuration/instance_options.md#snapshot-interval)
  - [Import snapshot](/learn/configuration/instance_options.md#import-snapshot)
  - [Ignore missing snapshot](/learn/configuration/instance_options.md#ignore-missing-snapshot) :triangular_flag_on_post:
  - [Ignore snapshot if DB exists](/learn/configuration/instance_options.md#ignore-snapshot-if-db-exists) :triangular_flag_on_post:
- [SSL configuration](/learn/configuration/instance_options.md#ssl-authentication-path):
  - [SSL authentication path](/learn/configuration/instance_options.md#ssl-authentication-path)
  - [SSL certificates path](/learn/configuration/instance_options.md#ssl-certificates-path)
  - [SSL key path](/learn/configuration/instance_options.md#ssl-key-path)
  - [SSL OCSP path](/learn/configuration/instance_options.md#ssl-ocsp-path)
  - [SSL require auth](/learn/configuration/instance_options.md#ssl-require-auth) :triangular_flag_on_post:
  - [SSL resumption](/learn/configuration/instance_options.md#ssl-resumption) :triangular_flag_on_post:
  - [SSL tickets](/learn/configuration/instance_options.md#ssl-tickets) :triangular_flag_on_post:

### Database path

**Environment variable**: `MEILI_DB_PATH`
**CLI option**: `--db-path`
**Default value**: `"data.ms/"`
**Expected value**: a filepath

Designates the location where database files will be created and retrieved.

### Environment

**Environment variable**: `MEILI_ENV`
**CLI option**: `--env`
**Default value**: `development`
**Expected value**: `production` or `development`

Configures the instance's environment. Value must be either `production` or `development`.

`production`:

- Setting a [master key](/learn/advanced/security.md) is **mandatory**
- The [search preview interface](/learn/what_is_meilisearch/search_preview.md) is disabled

`development`:

- Setting a [master key](/learn/advanced/security.md) is **optional**
- Search preview is enabled

::: tip
When the server environment is set to `development`, providing a master key is not mandatory. This is useful when debugging and prototyping, but dangerous otherwise since API routes are unprotected.
:::

### HTTP address & port binding

**Environment variable**: `MEILI_HTTP_ADDR`
**CLI option**: `--http-addr`
**Default value**: `"127.0.0.1:7700"`
**Expected value**: an HTTP address and port

Sets the HTTP address and port Meilisearch will use.

### Master key

**Environment variable**: `MEILI_MASTER_KEY`
**CLI option**: `--master-key`
**Default value**: `None`
**Expected value**: an alphanumeric string

Sets the instance's master key, automatically protecting all routes except [`GET /health`](/reference/api/health.md). This means you will need an API key to access endpoints such as `POST /search` and `GET /documents`. [You can read more about security keys in Meilisearch in our dedicated guide.](/learn/advanced/security.md)

::: note
You must supply an alphanumeric string when using this option.
:::

Providing a master key is mandatory when `--env` is set to `production`; if none is given, then Meilisearch will throw an error and refuse to launch.

If no master key is provided in a `development` environment, all routes will be unprotected and publicly accessible.

[Learn more about Meilisearch's use of security keys.](/learn/advanced/security.md)

### Disable analytics :triangular_flag_on_post:

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: `MEILI_NO_ANALYTICS`
**CLI option**: `--no-analytics`
**Default value**: Enabled
**Expected value**: `true` or `false`

Deactivates Meilisearch's built-in telemetry when set to `true`.

The environment variable accepts `n`, `no`, `f`, `false`, `off`, and `0` as false literals. An absent environment variable will also be considered as false, everything else is considered `true`.

Meilisearch automatically collects data from all instances that do not opt out using this flag. All gathered data is used solely for the purpose of improving Meilisearch, and can be [deleted at any time](/learn/what_is_meilisearch/telemetry.md#how-to-delete-all-collected-data).

[Read more about our policy on data collection](/learn/what_is_meilisearch/telemetry.md), or take a look at [the comprehensive list of all datapoints we collect](/learn/what_is_meilisearch/telemetry.md#exhaustive-list-of-all-collected-data).

### Dumps destination

**Environment variable**: `MEILI_DUMPS_DIR`
**CLI option**: `--dumps-dir`
**Default value**: `dumps/`
**Expected value**: a filepath pointing to a valid directory

Sets the directory where Meilisearch will create dump files.

[Learn more about creating dumps](/reference/api/dump.md).

### Import dump

**Environment variable**: N/A
**CLI option**: `--import-dump`
**Default value**: `none`
**Expected value**: a filepath pointing to a `.dump` file

Imports the dump file located at the specified path. Path must point to a `.dump` file.

Meilisearch will only launch once the dump data has been fully indexed. The time this takes depends on the size of the dump file.

*This option is not available as an environment variable.*

### Log level

**Environment variable**: `MEILI_LOG_LEVEL`
**CLI option**: `--log-level`
**Default value**: `'INFO'`
**Expected value**: one of `ERROR`, `WARN`, `INFO`, `DEBUG`, OR `TRACE`

Defines how much detail should be present in Meilisearch's logs.

Meilisearch currently supports four log levels, listed in order of increasing verbosity:

- `'ERROR'`: only log unexpected events indicating Meilisearch is not functioning as expected
- `'WARN:'` log all unexpected events, regardless of their severity
- `'INFO:'` log all events. This is the default value of `--log-level`
- `'DEBUG'`: log all events and include detailed information on Meilisearch's internal processes. Useful when diagnosing issues and debugging
- `'TRACE'`: log all events and include even more detailed information on Meilisearch's internal processes. We do not advise using this level as it is extremely verbose. Use `DEBUG` before considering `TRACE`.

### Max index size

**Environment variable**: `MEILI_MAX_INDEX_SIZE`
**CLI option**: `--max-index-size`
**Default value**: `107374182400` (100 GiB)
**Expected value**: an integer

Sets the maximum size of the index. Value must be given in bytes or explicitly stating a base unit. For example, the default value can be written as `107374182400`, `'107.7Gb'`, or `'107374 Mb'`.

The `index` stores processed data and is different from the `task` database, which handles [pending tasks](/learn/advanced/asynchronous_operations.md).

[Learn more about Meilisearch's database and storage engine.](/learn/advanced/storage.md)

### Max TASK_DB size

**Environment variable**: `MEILI_MAX_TASK_DB_SIZE`
**CLI option**: `--max-task-db-size`
**Default value**: `107374182400` (100 GiB)
**Expected value**: an integer

Sets the maximum size of the `task` database. Value must be given in bytes or explicitly stating a base unit. For example, the default value can be written as `107374182400`, `'107.7Gb'`, or `'107374 Mb'`.

The `task` database handles [pending tasks](/learn/advanced/asynchronous_operations.md). This is different from the `index` database, which only stores processed data.

[Learn more about Meilisearch's database and storage engine.](/learn/advanced/storage.md)

### Payload limit size

**Environment variable**: `MEILI_HTTP_PAYLOAD_SIZE_LIMIT`
**CLI option**: `--http-payload-size-limit`
**Default value**: `104857600` (~100MB)
**Expected value**: an integer

Sets the maximum size of [accepted payloads](/learn/core_concepts/documents.md#dataset-format). Value must be given in bytes or explicitly stating a base unit. For example, the default value can be written as `107374182400`, `'107.7Gb'`, or `'107374 Mb'`.

### Schedule snapshot creation :triangular_flag_on_post:

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: `MEILI_SCHEDULE_SNAPSHOT`
**CLI option**: `--schedule-snapshot`
**Default value**: `false`
**Expected value**: `true` or `false`

Activates scheduled snapshots when set to `true`. Snapshots are disabled by default.

The environment variable accepts `n`, `no`, `f`, `false`, `off`, and `0` as false literals. An absent environment variable will also be considered as false, everything else is considered `true`.

[Learn more about snapshots](/learn/advanced/snapshots.md).

### Snapshot destination

**Environment variable**: `MEILI_SNAPSHOT_DIR`
**CLI option**: `--snapshot-dir`
**Default value**: `snapshots/`
**Expected value**: a filepath pointing to a valid directory

Sets the directory where Meilisearch will store snapshots.

### Snapshot interval

**Environment variable**: `MEILI_SNAPSHOT_INTERVAL_SEC`
**CLI option**: `--snapshot-interval-sec`
**Default value**: `86400` (1 day)
**Expected value**: an integer

Defines the interval between each snapshot. Value must be given in seconds.

### Import snapshot

**Environment variable**: N/A
**CLI option**: `--import-snapshot`
**Default value**: `None`
**Expected value**: a filepath pointing to a snapshot file

Launches Meilisearch after importing a previously-generated snapshot at the given filepath.

This command will throw an error if:

- A database already exists
- No valid snapshot can be found in the specified path

This behavior can be modified with the [`--ignore-snapshot-if-db-exists`](#ignore-snapshot-if-db-exists) and [`--ignore-missing-snapshot`](#ignore-missing-snapshot) options, respectively.

*This option is not available as an environment variable.*

### Ignore missing snapshot :triangular_flag_on_post:

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: N/A
**CLI option**: `--ignore-missing-snapshot`
**Default value**: `false`
**Expected value**: `true` or `false`

Prevents a Meilisearch instance from throwing an error when [`--import-snapshot`](#import-snapshot) does not point to a valid snapshot file.

This command will throw an error if `--import-snapshot` is not defined.

*This option is not available as an environment variable.*

### Ignore snapshot if DB exists :triangular_flag_on_post:

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: N/A
**CLI option**: `--ignore-snapshot-if-db-exists`
**Default value**: `false`
**Expected value**: `true` or `false`

Prevents a Meilisearch instance with an existing database from throwing an error when using `--import-snapshot`. Instead, the snapshot will be ignored and Meilisearch will launch using the existing database.

This command will throw an error if `--import-snapshot` is not defined.

*This option is not available as an environment variable.*

### SSL authentication path

**Environment variable**: `MEILI_SSL_AUTH_PATH`
**CLI option**: `--ssl-auth-path`
**Default value**: `None`
**Expected value**: a filepath

Enables client authentication in the specified path.

### SSL certificates path

**Environment variable**: `MEILI_SSL_CERT_PATH`
**CLI option**: `--ssl-cert-path`
**Default value**: `None`
**Expected value**: a filepath pointing to a valid SSL certificate

Sets the server's SSL certificates.

Value must be a path to PEM-formatted certificates. The first certificate should certify the KEYFILE supplied by `--ssl-key-path`. The last certificate should be a root CA.

### SSL key path

**Environment variable**: `MEILI_SSL_KEY_PATH`
**CLI option**: `--ssl-key-path`
**Default value**: `None`
**Expected value**: a filepath pointing to a valid SSL keyfile

Sets the server's SSL keyfiles.

Value must be a path to an RSA private key or PKCS8-encoded private key, both in PEM format.

### SSL OCSP path

**Environment variable**: `MEILI_SSL_OCSP_PATH`
**CLI option**: `--ssl-ocsp-path`
**Default value**: `None`
**Expected value**: a filepath pointing to a valid OCSP certificate

Sets the server's OCSP file. *Optional*

Reads DER-encoded OCSP response from OCSPFILE and staple to certificate.

### SSL require auth :triangular_flag_on_post:

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: `MEILI_SSL_REQUIRE_AUTH`
**CLI option**: `--ssl-require-auth`
**Default value**: `None`

Makes SSL authentication mandatory.

Sends a fatal alert if the client does not complete client authentication.

The environment variable accepts `n`, `no`, `f`, `false`, `off`, and `0` as false literals. An absent environment variable will also be considered as false, everything else is considered `true`.

### SSL resumption :triangular_flag_on_post:

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: `MEILI_SSL_RESUMPTION`
**CLI option**: `--ssl-resumption`
**Default value**: `None`

Activates SSL session resumption.

The environment variable accepts `n`, `no`, `f`, `false`, `off`, and `0` as false literals. An absent environment variable will also be considered as false, everything else is considered `true`.

### SSL tickets :triangular_flag_on_post:

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: `MEILI_SSL_TICKETS`
**CLI option**: `--ssl-tickets`
**Default value**: `None`

Activates SSL tickets.

The environment variable accepts `n`, `no`, `f`, `false`, `off`, and `0` as false literals. An absent environment variable will also be considered as false, everything else is considered `true`.
