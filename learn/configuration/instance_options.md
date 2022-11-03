---
sidebarDepth: 2
---

# Configure Meilisearch at launch

You can configure Meilisearch at launch with **command-line options**, **environment variables**, or a **configuration file**.

These startup options affect your entire Meilisearch instance, not just a single index. For settings that affect search within a single index, see [index settings](/learn/configuration/settings.md).

## Configuration file

Meilisearch accepts a configuration file in the `.toml` format as an alternative to command-line options and environment variables. Configuration files can be easily shared and versioned, and allow you to define multiple options.

**Environment variables can overwrite the configuration file, and command-line options can overwrite environment variables.**

You can download the configuration file using the following command:

<CodeSamples id="instance_options_config_file_download_1" />

Once downloaded, Meilisearch will use it as the default configuration file. You will see it when you launch Meilisearch:

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

If no configuration file is provided, the `Config file path` is set to `none`.

You can override the default configuration file using the `MEILI_CONFIG_FILE_PATH` environment variable or the `--config-file-path` CLI option.

### Configuration file format

You can configure all environment variables and CLI options using a dedicated key in the configuration file. These keys follow the [snake case](https://en.wikipedia.org/wiki/Snake_case) convention. For example, `--import-dump` must be named `import_dump` in the file, `import_dumps` will throw an error.

::: warning
The only exception is the `config_file_path` key. Specifying the `config_file_path` key in the configuration file will throw an [error](/learn/configuration/instance_options.md#defining-a-configuration-file-with-a-syntax-error).
:::

By default, the file is divided into sections separated by comments. Each key has a brief description followed by a link to the relevant section of the documentation. Some keys are commented out as they are not required when launching Meilisearch, for example, `import_snapshot`, or because the value provided in the file is not the default value like `max_indexing_memory`.

### Configuration file errors

#### Defining `config_file_path` in the configuration file

```
Error: `config_file_path` is not supported in configuration file.
```

You can only set the configuration file path using the `MEILI_CONFIG_FILE_PATH` environment variable or the `--config-file-path` CLI option:

:::: tabs
::: tab CLI

```sh
./meilisearch --config-file-path="./config.toml"
```

:::

::: tab Environment variable

Linux/MacOS:

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

#### Defining a non-existent configuration file

```
Error: unable to open or read the "XXX" configuration file: No such file or directory (os error 2).
```

#### Defining a configuration file with a syntax error

```
Error: unknown field `XXX` at line Y column Z
```

All key names must follow snake case.

## Command-line options and flags

Pass **command-line options** and their respective values when launching a Meilisearch instance.

```bash
./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
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

```bash
export MEILI_DB_PATH=./meilifiles
export MEILI_HTTP_ADDR=127.0.0.1:7700
./meilisearch
```

In the previous example, `./meilisearch` is the command that launches a Meilisearch instance, while `MEILI_DB_PATH` and `MEILI_HTTP_ADDR` are environment variables that modify this instance's behavior.

Environment variables for command-line flags accept `n`, `no`, `f`, `false`, `off`, and `0` as `false`. An absent environment variable will also be considered as `false`. Any other value is considered `true`.

Environment variables are always identical to the corresponding command-line option, but prepended with `MEILI_` and written in all uppercase. **Some options (e.g., `--import-snapshots`) are not available as environment variables.**

## All instance options

### Configuration file

**Environment variable**: `MEILI_CONFIG_FILE_PATH`
**CLI option**: `--config-file-path`
**Default**: `./config.toml`
**Expected value**: a filepath

Designates the location of the configuration file to load at launch.

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

Providing a master key is mandatory when `--env` is set to `production`. If none is given, Meilisearch will throw an error and refuse to launch.

If no master key is provided in a `development` environment, all routes will be unprotected and publicly accessible.

[Learn more about Meilisearch's use of security keys.](/learn/security/master_api_keys.md)

### Disable auto-batching

::: warning
🚩 This is a CLI flag and does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_DISABLE_AUTO_BATCHING`
**CLI option**: `--disable-auto-batching`

Deactivates auto-batching when provided.

[Learn more about auto-batching.](/learn/core_concepts/documents.md#auto-batching)

### Disable analytics

::: warning
🚩 This is a CLI flag and does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_NO_ANALYTICS`
**CLI option**: `--no-analytics`

Deactivates Meilisearch's built-in telemetry when provided.

Meilisearch automatically collects data from all instances that do not opt out using this flag. All gathered data is used solely for the purpose of improving Meilisearch, and can be [deleted at any time](/learn/what_is_meilisearch/telemetry.md#how-to-delete-all-collected-data).

[Read more about our policy on data collection](/learn/what_is_meilisearch/telemetry.md), or take a look at [the comprehensive list of all data points we collect](/learn/what_is_meilisearch/telemetry.md#exhaustive-list-of-all-collected-data).

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

Meilisearch currently supports five log levels, listed in order of increasing verbosity:

- `'ERROR'`: only log unexpected events indicating Meilisearch is not functioning as expected
- `'WARN'`: log all unexpected events, regardless of their severity
- `'INFO'`: log all events. This is the default value of `--log-level`
- `'DEBUG'`: log all events and include detailed information on Meilisearch's internal processes. Useful when diagnosing issues and debugging
- `'TRACE'`: log all events and include even more detailed information on Meilisearch's internal processes. We do not advise using this level as it is extremely verbose. Use `'DEBUG'` before considering `'TRACE'`.

### Max index size

**Environment variable**: `MEILI_MAX_INDEX_SIZE`
**CLI option**: `--max-index-size`
**Default value**: `107374182400` (100 GiB)
**Expected value**: an integer

Sets the maximum size of the index. Value must be given in bytes or explicitly stating a base unit. For example, the default value can be written as `107374182400`, `'107.7Gb'`, or `'107374 Mb'`.

The `index` stores processed data and is different from the `task` database, which handles [pending tasks](/learn/advanced/asynchronous_operations.md).

[Learn more about Meilisearch's database and storage engine.](/learn/advanced/storage.md)

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
🚩 This is a CLI flag and does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_SCHEDULE_SNAPSHOT`
**CLI option**: `--schedule-snapshot`

Activates scheduled snapshots when provided. Snapshots are disabled by default.

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
🚩 This is a CLI flag and does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: N/A
**CLI option**: `--ignore-missing-snapshot`

Prevents a Meilisearch instance from throwing an error when [`--import-snapshot`](#import-snapshot) does not point to a valid snapshot file.

This command will throw an error if `--import-snapshot` is not defined.

_This option is not available as an environment variable._

### Ignore snapshot if DB exists

::: warning
🚩 This is a CLI flag and does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: N/A
**CLI option**: `--ignore-snapshot-if-db-exists`

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
🚩 This is a CLI flag and does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_SSL_REQUIRE_AUTH`
**CLI option**: `--ssl-require-auth`
**Default value**: `None`

Makes SSL authentication mandatory.

Sends a fatal alert if the client does not complete client authentication.

#### SSL resumption

::: warning
🚩 This is a CLI flag and does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_SSL_RESUMPTION`
**CLI option**: `--ssl-resumption`
**Default value**: `None`

Activates SSL session resumption.

#### SSL tickets

::: warning
🚩 This is a CLI flag and does not take any values. Assigning a value will throw an error. 🚩
:::

**Environment variable**: `MEILI_SSL_TICKETS`
**CLI option**: `--ssl-tickets`
**Default value**: `None`

Activates SSL tickets.
