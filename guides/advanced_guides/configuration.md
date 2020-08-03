# Configuration

Many options are available to configure a MeiliSearch instance. Each of these options is added on MeiliSearch instance launch.

Options can be either communicated through **environment variables** or **command line options**. If both are provided for the same option, the command line option value is kept.

## Passing arguments via the command line

Options are added at launch.

```bash
$ ./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
Server is listening on: http://127.0.0.1:7700
```

## Passing arguments via the environment variables

The format of the environment variables is identical to the command line options with the exception that it is uppercased and `MEILI_` is prepended.

```bash
$ export MEILI_DB_PATH=./meilifiles
$ export MEILI_HTTP_ADDR=127.0.0.1:7700
$ ./meilisearch
Server is listening on: http://127.0.0.1:7700
```

## Options

#### General

- [Database path](/guides/advanced_guides/configuration.md#database-path)
- [HTTP address & port binding](/guides/advanced_guides/configuration.md#http-address-port-binding)
- [Master key](/guides/advanced_guides/configuration.md#master-key)
- [Environment](/guides/advanced_guides/configuration.md#environment)

#### Advanced

- [Analytics](/guides/advanced_guides/configuration.md#analytics)
- [Payload Limit Size](/guides/advanced_guides/configuration.md#payload-limit-size)
- [Max MDB Size](/guides/advanced_guides/configuration.md#max-mdb-size)
- [Max UDB Size](/guides/advanced_guides/configuration.md#max-udb-size)
- [SSL Configuration](/guides/advanced_guides/configuration.md#ssl-authentication-path):
  - [SSL Authentication Path](/guides/advanced_guides/configuration.md#ssl-authentication-path)
  - [SSL Certicates Path](/guides/advanced_guides/configuration.md#ssl-certificates-path)
  - [SSL Key Path](/guides/advanced_guides/configuration.md#ssl-key-path)
  - [SSL OCSP Path](/guides/advanced_guides/configuration.md#ssl-ocsp-path)
  - [SSL Require Auth](/guides/advanced_guides/configuration.md#ssl-require-auth)
  - [SSL Resumption](/guides/advanced_guides/configuration.md#ssl-resumption)
  - [SSL Tickets](/guides/advanced_guides/configuration.md#ssl-tickets)
- [Disable Sentry](/guides/advanced_guides/configuration.md#disable-sentry)

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

[Learn more about the permission and authentication in this guide.](/guides/advanced_guides/authentication.md)

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

- `Production`: the [master key](/guides/advanced_guides/authentication.md) is **mandatory**.
- `Development`: the [master key](/guides/advanced_guides/authentication.md) is **optional**, and logs are output in "info" mode (_console output_).

If the server is running in development mode more logs will be displayed, and the master key can be avoided which implies that there is no security on the updates routes.
This is useful to debug when integrating the engine with another service.

**Default value**: `development`

### Payload Limit Size

**Environment variable**: `MEILI_HTTP_PAYLOAD_SIZE_LIMIT`
**CLI option**: `--http-payload-size-limit`

The maximum size, in bytes, of accepted JSON payloads.

**Default value**: `10485760` (+=10Mb)

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

[To know more about storage in MeiliSearch look at this guide](/resources/about_storage.md)

**Default value**: `107374182400` (100 GiB)

### Max UDB Size

**Environment variable**: `MEILI_MAX_UDB_SIZE`
**CLI option**: `--max-udb-size`

The maximum size, in bytes, of the `update` database. The `update` database stores the [pending updates](/guides/advanced_guides/asynchronous_updates.md).

The size must be a modulo value of your OS `PAGE_SIZE` otherwise it will throw an error.
You can find out about the `PAGE_SIZE` with the following command:

```bash
getconf PAGE_SIZE
```

Depending on the OS, it is either the size that will be allocated on launch or the maximum size the database can attain.

- On **UNIX** it is the maximum size.
- On **Windows** it is a fixed size that will be allocated on launch.
  Because this allocates 100Gb on MeiliSearch launch, a Windows user can use this option to decrease the size of the database.

[To know more about storage in MeiliSearch look at this guide](/resources/about_storage.md)

**Default value**: `107374182400` (100 GiB)

### Disable Sentry

**Environment variable**: `MEILI_NO_SENTRY`
**CLI option**: `--no-sentry`

We use [Sentry](https://sentry.io) to get bug reports and diagnostics, and improve MeiliSearch experience. You can disable it at any moment by launching MeiliSearch with the argument above.
