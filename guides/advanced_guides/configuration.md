# Configuration

Many options are available to configure a MeiliSearch Instance. Each of these options are added on MeiliSearch Instance launch.

Options can be either communicated through **environment variables** or **command line options**.

## Passing arguments via the command line

Options are added on launch.

```bash
$ ./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
Server is listening on: http://127.0.0.1:7700
```

## Passing arguments via the environment variables

The format of the environment variables is identical to the command line options with the exception that it is uppercased and `MEILI_` is added at the beginning.

```
$ export MEILI_DB_PATH=./meilifiles
$ export MEILI_HTTP_ADDR=127.0.0.1:7700
$ ./meilisearch
Server is listening on: http://127.0.0.1:7700
```

## Options

List of options:

- [Path to database](/guides/advanced_guides/configuration.md#path-to-database)
- [HTTP address](/guides/advanced_guides/configuration.md#http-address)
- [Master Key](/guides/advanced_guides/configuration.md#master-key)
- [No Analytics](/guides/advanced_guides/configuration.md#no-analytics)
- [Environment](/guides/advanced_guides/configuration.md#environment)
- [Payload size limit](/guides/advanced_guides/configuration.md#payload-size-limit)

### Path to database

**Environment Variable**: `MEILI_DB_PATH`
**CLI option**: `--db-path`

Defines the location for the database files.

**Default value**: `"./data.ms"`

### HTTP Address

**Environment Variable**: `MEILI_HTTP_ADDR`
**CLI option**: `--http-addr`

The address the HTTP server will listen on.

**Default value**: `"127.0.0.1:7700"`

### Master Key

**Environment Variable**: `MEILI_MASTER_KEY`
**CLI option**: `--master-key`

The master key allowing you to do everything on the server. If no master key is provided all routes will be accessible without keys. This is only possible if your are in `developement` environment. An error is thrown if you try to start MeiliSearch without master key when the environment is set to `production`.

[Learn more about the permission and authentication in this guide.](/guides/advanced_guides/authentication.md)

**Default Value**: `None`

### No Analytics

**Environment Variable**: `MEILI_NO_ANALYTICS`
**CLI option**: `--no-analytics`

Deactivates analytics. Analytics allow us to know how many users are using MeiliSearch, which versions and which platforms are used. This process is entirely anonymous.

**Default value**: `false`

### Environment

**Environment Variable**: `MEILI_ENV`
**CLI option**: `--env`

By default, MeiliSearch runs in `development` mode.

- `Production`: the [master key](/guides/advanced_guides/authentication.md) is **mandatory**.
- `Development`: the [master key](/guides/advanced_guides/authentication.md) is **optional**, and logs are output in "info" mode (_console output_).

If the server is running in development mode more logs will be displayed, and the master key can be avoided which implies that there is no security on the updates routes.
This is useful to debug when integrating the engine with another service.

**Default value**: `development`

### Payload Size Limit

**Environment Variable**: `MEILI_HTTP_PAYLOAD_SIZE_LIMIT`
**CLI option**: --http-payload-size-limit

The maximum size, in bytes, of accepted JSON payloads.

**Default value**: `10485760` (+=10Mb)
