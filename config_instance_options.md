---
sidebarDepth: 2
---

# Configure Meilisearch at launch

You can configure Meilisearch at launch with **command-line options**, **environment variables**, or a **configuration file**.

These startup options affect your entire Meilisearch instance, not just a single index. For settings that affect search within a single index, see [index settings](/learn/configuration/settings.md).

## Command-line options and flags

Pass **command-line options** and their respective values when launching a Meilisearch instance.

```bash
./meilisearch --db-path ./meilifiles --http-addr 'localhost:7700'
```

In the previous example, `./meilisearch` is the command that launches a Meilisearch instance, while `--db-path` and `--http-addr` are options that modify this instance's behavior.

Meilisearch also has a number of **command-line flags.** Unlike command-line options, **flags don't take values**. If a flag is given, it is activated and changes Meilisearch's default behavior.

```bash
./meilisearch --no-analytics
```

The above flag disables analytics for the Meilisearch instance and does not accept a value.

**Both command-line options and command-line flags take precedence over environment variables.** All command-line options and flags are prepended with `--`.

## Environment variables

To configure a Meilisearch instance using environment variables, set the environment variable prior to launching the instance. If you are unsure how to do this, read more about [setting and listing environment variables](https://linuxize.com/post/how-to-set-and-list-environment-variables-in-linux/), or [use a command-line option](#command-line-options-and-flags) instead.

:::: tabs
::: tab UNIX

```sh
export MEILI_DB_PATH=./meilifiles
export MEILI_HTTP_ADDR=localhost:7700
./meilisearch
```

:::

::: tab Windows

```sh
set MEILI_DB_PATH=./meilifiles
set MEILI_HTTP_ADDR=127.0.0.1:7700
./meilisearch
```

:::
::::

In the previous example, `./meilisearch` is the command that launches a Meilisearch instance, while `MEILI_DB_PATH` and `MEILI_HTTP_ADDR` are environment variables that modify this instance's behavior.

Environment variables for command-line flags accept `n`, `no`, `f`, `false`, `off`, and `0` as `false`. An absent environment variable will also be considered as `false`. Any other value is considered `true`.

Environment variables are always identical to the corresponding command-line option, but prepended with `MEILI_` and written in all uppercase.

## Configuration file

Meilisearch accepts a configuration file in the `.toml` format as an alternative to command-line options and environment variables. Configuration files can be easily shared and versioned, and allow you to define multiple options.

**When used simultaneously, environment variables override the configuration file, and command-line options override environment variables.**

You can download a default configuration file using the following command:

```sh
curl https://raw.githubusercontent.com/meilisearch/meilisearch/latest/config.toml > config.toml
```

By default, Meilisearch will look for a `config.toml` file in the working directory. If it is present, it will be used as the configuration file. You can verify this when you launch Meilisearch:

```
888b     d888          d8b 888 d8b                                            888
8888b   d8888          Y8P 888 Y8P                                            888
88888b.d88888              888                                                888
888Y88888P888  .d88b.  888 888 888 .d8888b   .d88b.   8888b.  888d888 .d8888b 88888b.
888 Y888P 888 d8P  Y8b 888 888 888 88K      d8P  Y8b     "88b 888P"  d88P"    888 "88b
888  Y8P  888 88888888 888 888 888 "Y8888b. 88888888 .d888888 888    888      888  888
888   "   888 Y8b.     888 888 888      X88 Y8b.     888  888 888    Y88b.    888  888
888       888  "Y8888  888 888 888  88888P'  "Y8888  "Y888888 888     "Y8888P 888  888

Config file path:       "./config.toml"
```

If the `Config file path` is anything other than `"none"`, it means that a configuration file was successfully located and used to start Meilisearch.

You can override the default location of the configuration file using the `MEILI_CONFIG_FILE_PATH` environment variable or the `--config-file-path` CLI option:

:::: tabs
::: tab CLI

```sh
./meilisearch --config-file-path="./config.toml"
```

:::

::: tab Environment variable

UNIX:

```sh
export MEILI_CONFIG_FILE_PATH="./config.toml"
./meilisearch
```

Windows:

```sh
set MEILI_CONFIG_FILE_PATH="./config.toml"
./meilisearch
```

:::
::::

### Configuration file formatting

You can configure any environment variable or CLI option using a configuration file. In configuration files, options must be written in [snake case](https://en.wikipedia.org/wiki/Snake_case). For example, `--import-dump` would be written as `import_dump`.

```toml
import_dump = "./example.dump"
```

::: warning
Specifying the `config_file_path` option within the configuration file will throw an error. This is the only configuration option that cannot be set within a configuration file.
:::

## All instance options

### Configuration file path

**Environment variable**: `MEILI_CONFIG_FILE_PATH`
**CLI option**: `--config-file-path`
**Default**: `./config.toml`
**Expected value**: a filepath

Designates the location of the configuration file to load at launch.

::: warning
Specifying this option in the configuration file itself will throw an error (assuming Meilisearch is able to find your configuration file).
:::

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

- Setting a [master key](/learn/security/master_api_keys.md) of at least 16 bytes is **mandatory**. If no master key is provided or if it is under 16 bytes, Meilisearch will suggest a secure autogenerated master key
- The [search preview interface](/learn/what_is_meilisearch/search_preview.md) is disabled

`development`:

- Setting a [master key](/learn/security/master_api_keys.md) is **optional**. If no master key is provided or if it is under 16 bytes, Meilisearch will suggest a secure autogenerated master key
- Search preview is enabled

::: tip
When the server environment is set to `development`, providing a master key is not mandatory. This is useful when debugging and prototyping, but dangerous otherwise since API routes are unprotected.
:::

### HTTP address & port binding

**Environment variable**: `MEILI_HTTP_ADDR`
**CLI option**: `--http-addr`
**Default value**: `"localhost:7700"`
**Expected value**: an HTTP address and port

Sets the HTTP address and port Meilisearch will use.

### Master key

**Environment variable**: `MEILI_MASTER_KEY`
**CLI option**: `--master-key`
**Default value**: `None`
**Expected value**: a UTF-8 string of at least 16 bytes

Sets the instance's master key, automatically protecting all routes except [`GET /health`](/reference/api/health.md). This means you will need a valid API key to access all other endpoints.

When `--env` is set to `production`, providing a master key is mandatory. If none is given, or it is under 16 bytes, Meilisearch will throw an error and refuse to launch.

When `--env` is set to `development`, providing a master key is optional. If none is given, all routes will be unprotected and publicly accessible.

If you do not supply a master key in `production` or `development` environments or it is under 16 bytes, Meilisearch will suggest a secure autogenerated master key you can use when restarting your instance.

[Learn more about Meilisearch's use of security keys.](/learn/security/master_api_keys.md)

### Disable analytics

::: warning
🚩 This option does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_NO_ANALYTICS`
**CLI option**: `--no-analytics`

Deactivates Meilisearch's built-in telemetry when provided.

Meilisearch automatically collects data from all instances that do not opt out using this flag. All gathered data is used solely for the purpose of improving Meilisearch, and can be [deleted at any time](/learn/what_is_meilisearch/telemetry.md#how-to-delete-all-collected-data).

[Read more about our policy on data collection](/learn/what_is_meilisearch/telemetry.md), or take a look at [the comprehensive list of all data points we collect](/learn/what_is_meilisearch/telemetry.md#exhaustive-list-of-all-collected-data).

### Dump directory

**Environment variable**: `MEILI_DUMP_DIR`
**CLI option**: `--dump-dir`
**Default value**: `dumps/`
**Expected value**: a filepath pointing to a valid directory

Sets the directory where Meilisearch will create dump files.

[Learn more about creating dumps](/reference/api/dump.md).

### Import dump

**Environment variable**: `MEILI_IMPORT_DUMP`
**CLI option**: `--import-dump`
**Default value**: none
**Expected value**: a filepath pointing to a `.dump` file

Imports the dump file located at the specified path. Path must point to a `.dump` file. If a database already exists, Meilisearch will throw an error and abort launch.

Meilisearch will only launch once the dump data has been fully indexed. The time this takes depends on the size of the dump file.

### Ignore missing dump

::: warning
🚩 This option does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_IGNORE_MISSING_DUMP`
**CLI option**: `--ignore-missing-dump`

Prevents Meilisearch from throwing an error when `--import-dump` does not point to a valid dump file. Instead, Meilisearch will start normally without importing any dump.

This option will trigger an error if `--import-dump` is not defined.

### Ignore dump if DB exists

::: warning
🚩 This option does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_IGNORE_DUMP_IF_DB_EXISTS`
**CLI option**: `--ignore-dump-if-db-exists`

Prevents a Meilisearch instance with an existing database from throwing an error when using `--import-dump`. Instead, the dump will be ignored and Meilisearch will launch using the existing database.

This option will trigger an error if `--import-dump` is not defined.

### Log level

**Environment variable**: `MEILI_LOG_LEVEL`
**CLI option**: `--log-level`
**Default value**: `'INFO'`
**Expected value**: one of `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, OR `OFF`

Defines how much detail should be present in Meilisearch's logs.

Meilisearch currently supports five log levels, listed in order of increasing verbosity:

- `'ERROR'`: only log unexpected events indicating Meilisearch is not functioning as expected
- `'WARN'`: log all unexpected events, regardless of their severity
- `'INFO'`: log all events. This is the default value of `--log-level`
- `'DEBUG'`: log all events and include detailed information on Meilisearch's internal processes. Useful when diagnosing issues and debugging
- `'TRACE'`: log all events and include even more detailed information on Meilisearch's internal processes. We do not advise using this level as it is extremely verbose. Use `'DEBUG'` before considering `'TRACE'`.
- `'OFF'`: disable logging

### Max indexing memory

**Environment variable**: `MEILI_MAX_INDEXING_MEMORY`
**CLI option**: `--max-indexing-memory`
**Default value**: 2/3 of the available RAM
**Expected value**: an integer (`104857600`) or a human readable size (`'100Mb'`)

Sets the maximum amount of RAM Meilisearch can use when indexing. By default, Meilisearch uses no more than two thirds of available memory.

The value must either be given in bytes or explicitly state a base unit:  `107374182400`, `'107.7Gb'`, or `'107374 Mb'`.

It is possible that Meilisearch goes over the exact RAM limit during indexing. In most contexts and machines, this should be a negligible amount with little to no impact on stability and performance.

::: danger
Setting `--max-indexing-memory` to a value bigger than or equal to your machine's total memory is likely to cause your instance to crash.
:::

### Max indexing threads

**Environment variable**: `MEILI_MAX_INDEXING_THREADS`
**CLI option**: `--max-indexing-threads`
**Default value**: half of the available threads
**Expected value**: an integer

Sets the maximum number of threads Meilisearch can use during indexing. By default, the indexer avoids using more than half of a machine's total processing units. This ensures Meilisearch is always ready to perform searches, even while you are updating an index.

If `--max-indexing-threads` is higher than the real number of cores available in the machine, Meilisearch uses the maximum number of available cores.

In single-core machines, Meilisearch has no choice but to use the only core available for indexing. This may lead to a degraded search experience during indexing.

::: danger
Avoid setting `--max-indexing-threads` to the total of your machine's processor cores. Though doing so might speed up indexing, it is likely to severely impact search experience.
:::

### Payload limit size

**Environment variable**: `MEILI_HTTP_PAYLOAD_SIZE_LIMIT`
**CLI option**: `--http-payload-size-limit`
**Default value**: `104857600` (~100MB)
**Expected value**: an integer

Sets the maximum size of [accepted payloads](/learn/core_concepts/documents.md#dataset-format). Value must be given in bytes or explicitly stating a base unit. For example, the default value can be written as `107374182400`, `'107.7Gb'`, or `'107374 Mb'`.

### Schedule snapshot creation

**Environment variable**: `MEILI_SCHEDULE_SNAPSHOT`
**CLI option**: `--schedule-snapshot`
**Default value**: disabled if not present, `86400` if present without a value
**Expected value**: `None` or an integer

Activates scheduled snapshots. Snapshots are disabled by default.

It is possible to use `--schedule-snapshot` without a value. If `--schedule-snapshot` is present when launching an instance but has not been assigned a value, Meilisearch takes a new snapshot every 24 hours.

For more control over snapshot scheduling, pass an integer representing the interval in seconds between each snapshot. When `--schedule-snapshot=3600`, Meilisearch takes a new snapshot every hour.

<Capsule intent="note">
When using the configuration file, it is also possible to explicitly pass a boolean value to `schedule_snapshot`. Meilisearch takes a new snapshot every 24 hours when `schedule_snapshot=true`, and takes no snapshots when `schedule_snapshot=false`.
</Capsule>

[Learn more about snapshots](/learn/advanced/snapshots.md).

### Snapshot destination

**Environment variable**: `MEILI_SNAPSHOT_DIR`
**CLI option**: `--snapshot-dir`
**Default value**: `snapshots/`
**Expected value**: a filepath pointing to a valid directory

Sets the directory where Meilisearch will store snapshots.

### Import snapshot

**Environment variable**: `MEILI_IMPORT_SNAPSHOT`
**CLI option**: `--import-snapshot`
**Default value**: `None`
**Expected value**: a filepath pointing to a snapshot file

Launches Meilisearch after importing a previously-generated snapshot at the given filepath.

This command will throw an error if:

- A database already exists
- No valid snapshot can be found in the specified path

This behavior can be modified with the [`--ignore-snapshot-if-db-exists`](#ignore-snapshot-if-db-exists) and [`--ignore-missing-snapshot`](#ignore-missing-snapshot) options, respectively.

### Ignore missing snapshot

::: warning
🚩 This option does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_IGNORE_MISSING_SNAPSHOT`
**CLI option**: `--ignore-missing-snapshot`

Prevents a Meilisearch instance from throwing an error when [`--import-snapshot`](#import-snapshot) does not point to a valid snapshot file.

This command will throw an error if `--import-snapshot` is not defined.

### Ignore snapshot if DB exists

::: warning
🚩 This option does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_IGNORE_SNAPSHOT_IF_DB_EXISTS`
**CLI option**: `--ignore-snapshot-if-db-exists`

Prevents a Meilisearch instance with an existing database from throwing an error when using `--import-snapshot`. Instead, the snapshot will be ignored and Meilisearch will launch using the existing database.

This command will throw an error if `--import-snapshot` is not defined.

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
**Expected value**: a filepath pointing to a valid SSL key file

Sets the server's SSL key files.

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
🚩 This option does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_SSL_REQUIRE_AUTH`
**CLI option**: `--ssl-require-auth`
**Default value**: `None`

Makes SSL authentication mandatory.

Sends a fatal alert if the client does not complete client authentication.

#### SSL resumption

::: warning
🚩 This option does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_SSL_RESUMPTION`
**CLI option**: `--ssl-resumption`
**Default value**: `None`

Activates SSL session resumption.

#### SSL tickets

::: warning
🚩 This option does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_SSL_TICKETS`
**CLI option**: `--ssl-tickets`
**Default value**: `None`

Activates SSL tickets.