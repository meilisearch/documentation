# Configuration file

Meilisearch accepts a configuration file in the `.toml` format as an alternative to the [command-line options and environment variables](/learn/configuration/instance_options.md) specified at launch.

You can download the configuration file using the following command:

<CodeSamples id="configuration_file_download" />

Once downloaded, Meilisearch will use it as the default configuration file. You will see the configuration file when you launch Meilisearch:

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

Some of the options are commented out. You can override the default configuration file using the `MEILI_CONFIG_FILE_PATH` environment variable or the `--config-file-path` CLI option.

## Configuration file format

You can configure all environment variables and CLI options using a dedicated key in the configuration file. These keys follow the [snake case](https://en.wikipedia.org/wiki/Snake_case) convention. For example, `--import-dump` must be named `import_dump` in the file, `import_dumps` will throw an error.

::: warning
The only exception is the `config_file_path` key. Specifying the `config_file_path` key in the configuration file will throw an error.
:::

### Priority

Environment variables can overwrite the configuration file, and command-line options can overwrite environment variables.

### Errors

#### Defining `config_file_path` in the configuration file

```
Error: `config_file_path` is not supported in configuration file.
```

You can only set the configuration file path using the `MEILI_CONFIG_FILE_PATH` environment variable or the `--config-file-path` CLI option:

:::: tabs
::: tab CLI

```sh
./meilisearch --config-file-path="FILE_PATH"
```

:::

::: tab Environment variable

Linux/MacOS:

```sh
export MEILI_CONFIG_FILE_PATH="FILE_PATH"
./meilisearch
```

Windows:

```sh
set MEILI_CONFIG_FILE_PATH="FILE_PATH"
./meilisearch
```

:::
::::

#### Defining a non-existent config file

```
Error: unable to open or read the "XXX" configuration file: No such file or directory (os error 2).
```

#### Defining a config file with a syntax error

```
Error: unknown field `XXX` at line Y column Z
```

All key names must follow snake case.
