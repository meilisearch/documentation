---
sidebarDepth: 2
---

# Configure Meilisearch at launch

You can configure Meilisearch at launch with **environment variables** and **command-line options**.

These startup options affect your entire Meilisearch instance, not just a single index. For settings that affect search within a single index, see [index settings](/learn/configuration/settings.md).

## Command-line options and flags

Pass **command-line options** and their respective values when launching a Meilisearch instance.

```bash
./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
```

In the previous example, `./meilisearch` is the command that launches a Meilisearch instance, while `--db-path` and `--http-addr` are options that modify this instance's behavior.

Meilisearch also has a number of **command-line flags.** Unlike command-line options, **command-line flags don't take values**. If a flag is given, it is activated and changes Meilisearch's default behavior.

```bash
./meilisearch --no-analytics
```

The above command-line flag disables analytics for the Meilisearch instance without accepting any value.

**Both command-line options and command-line flags take precedence over environment variables.** All command-line options and flags are prepended with `--`.

## Environment variables

To configure a Meilisearch instance using environment variables, set the environment variable prior to launching the instance. If you are unsure how to do this, read more about [setting and listing environment variables](https://linuxize.com/post/how-to-set-and-list-environment-variables-in-linux/), or [use a command-line option](#command-line-options-and-flags) instead.

```bash
export MEILI_DB_PATH=./meilifiles
export MEILI_HTTP_ADDR=127.0.0.1:7700
./meilisearch
```

In the previous example, `./meilisearch` is the command that launches a Meilisearch instance, while `MEILI_DB_PATH` and `MEILI_HTTP_ADDR` are environment variables that modify this instance's behavior.

Environment variables are always identical to the corresponding command-line option, but prepended with `MEILI_` and written in all uppercase. **Some options (e.g. `--import-snapshots`) are not available as environment variables.**

## All instance options

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

- Setting a [master key](/learn/security/master_api_keys.md) is **mandatory**
- The [search preview interface](/learn/what_is_meilisearch/search_preview.md) is disabled

`development`:

- Setting a [master key](/learn/security/master_api_keys.md) is **optional**
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

Sets the instance's master key, automatically protecting all routes except [`GET /health`](/reference/api/health.md). This means you will need an API key to access endpoints such as `POST /search` and `GET /documents`. [You can read more about security keys in Meilisearch in our dedicated guide.](/learn/security/master_api_keys.md)

::: note
You must supply an alphanumeric string when using this option.
:::

Providing a master key is mandatory when `--env` is set to `production`; if none is given, then Meilisearch will throw an error and refuse to launch.

If no master key is provided in a `development` environment, all routes will be unprotected and publicly accessible.

[Learn more about Meilisearch's use of security keys.](/learn/security/master_api_keys.md)

### Disable analytics

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: `MEILI_NO_ANALYTICS`
**CLI option**: `--no-analytics`
**Default**: Enabled

Deactivates Meilisearch's built-in telemetry when enabled.

The environment variable accepts `n`, `no`, `f`, `false`, `off`, and `0` as `false`. An absent environment variable will also be considered as `false`, everything else is considered `true`.

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
**Default value**: none
**Expected value**: a filepath pointing to a `.dump` file

Imports the dump file located at the specified path. Path must point to a `.dump` file. If a database already exists, Meilisearch will throw an error and abort launch.

Meilisearch will only launch once the dump data has been fully indexed. The time this takes depends on the size of the dump file.

_This option is not available as an environment variable._

### Ignore missing dump

::: warning
🚩 This is a CLI flag and does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: N/A
**CLI option**: `--ignore-missing-dump`

Prevents Meilisearch from throwing an error when `--import-dump` does not point to a valid dump file. Instead, Meilisearch will start normally without importing any dump.

This option will trigger an error if `--import-dump` is not defined.

_This option is not available as an environment variable._

### Ignore dump if DB exists

::: warning
🚩 This is a CLI flag and does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: N/A
**CLI option**: `--ignore-dump-if-db-exists`

Prevents a Meilisearch instance with an existing database from throwing an error when using `--import-dump`. Instead, the dump will be ignored and Meilisearch will launch using the existing database.

This option will trigger an error if `--import-dump` is not defined.

_This option is not available as an environment variable._

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

### Schedule snapshot creation

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: `MEILI_SCHEDULE_SNAPSHOT`
**CLI option**: `--schedule-snapshot`
**Default**: Disabled

Activates scheduled snapshots when enabled. Snapshots are disabled by default.

The environment variable accepts `n`, `no`, `f`, `false`, `off`, and `0` as `false`. An absent environment variable will also be considered as `false`, everything else is considered `true`.

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

_This option is not available as an environment variable._

### Ignore missing snapshot

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: N/A
**CLI option**: `--ignore-missing-snapshot`
**Default**: Disabled

Prevents a Meilisearch instance from throwing an error when [`--import-snapshot`](#import-snapshot) does not point to a valid snapshot file.

This command will throw an error if `--import-snapshot` is not defined.

_This option is not available as an environment variable._

### Ignore snapshot if DB exists

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: N/A
**CLI option**: `--ignore-snapshot-if-db-exists`
**Default**: Disabled

Prevents a Meilisearch instance with an existing database from throwing an error when using `--import-snapshot`. Instead, the snapshot will be ignored and Meilisearch will launch using the existing database.

This command will throw an error if `--import-snapshot` is not defined.

_This option is not available as an environment variable._

### SSL options

#### SSL authentication path

**Environment variable**: `MEILI_SSL_AUTH_PATH`
**CLI option**: `--ssl-auth-path`
**Default value**: `None`
**Expected value**: a filepath

Enables client authentication in the specified path.

#### SSL certificates path

**Environment variable**: `MEILI_SSL_CERT_PATH`
**CLI option**: `--ssl-cert-path`
**Default value**: `None`
**Expected value**: a filepath pointing to a valid SSL certificate

Sets the server's SSL certificates.

Value must be a path to PEM-formatted certificates. The first certificate should certify the KEYFILE supplied by `--ssl-key-path`. The last certificate should be a root CA.

#### SSL key path

**Environment variable**: `MEILI_SSL_KEY_PATH`
**CLI option**: `--ssl-key-path`
**Default value**: `None`
**Expected value**: a filepath pointing to a valid SSL keyfile

Sets the server's SSL keyfiles.

Value must be a path to an RSA private key or PKCS8-encoded private key, both in PEM format.

#### SSL OCSP path

**Environment variable**: `MEILI_SSL_OCSP_PATH`
**CLI option**: `--ssl-ocsp-path`
**Default value**: `None`
**Expected value**: a filepath pointing to a valid OCSP certificate

Sets the server's OCSP file. _Optional_

Reads DER-encoded OCSP response from OCSPFILE and staple to certificate.

#### SSL require auth

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: `MEILI_SSL_REQUIRE_AUTH`
**CLI option**: `--ssl-require-auth`
**Default value**: `None`

Makes SSL authentication mandatory.

Sends a fatal alert if the client does not complete client authentication.

The environment variable accepts `n`, `no`, `f`, `false`, `off`, and `0` as `false`. An absent environment variable will also be considered as `false`, everything else is considered `true`.

#### SSL resumption

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: `MEILI_SSL_RESUMPTION`
**CLI option**: `--ssl-resumption`
**Default value**: `None`

Activates SSL session resumption.

The environment variable accepts `n`, `no`, `f`, `false`, `off`, and `0` as `false`. An absent environment variable will also be considered as `false`, everything else is considered `true`.

#### SSL tickets

::: warning
This is a CLI flag and does not take any values. Assigning a value will throw an error.
:::

**Environment variable**: `MEILI_SSL_TICKETS`
**CLI option**: `--ssl-tickets`
**Default value**: `None`

Activates SSL tickets.

The environment variable accepts `n`, `no`, `f`, `false`, `off`, and `0` as `false`. An absent environment variable will also be considered as `false`, everything else is considered `true`.
