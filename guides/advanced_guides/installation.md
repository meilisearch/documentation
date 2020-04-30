# Installation

## Download and launch

:::: tabs

::: tab cURL
Download the **latest stable release** of MeiliSearch with **curl**.

Launch MeiliSearch to start the server.

```bash
$ curl -L https://install.meilisearch.com | sh
$ ./meilisearch
Server is listening on: http://127.0.0.1:7700
```

:::

::: tab Brew
Download the **latest stable release** of MeiliSearch with **Homebrew**.

Launch MeiliSearch to start the server.

```bash
$ brew update && brew install meilisearch
$ meilisearch
Server is listening on: http://127.0.0.1:7700
```

:::

::: tab Docker
Using **Docker** you can choose to run [any available tags](https://hub.docker.com/r/getmeili/meilisearch/tags).

This command starts the **latest stable release** of MeiliSearch.

```bash
$ docker run -it --rm \
    -p 7700:7700 \
    -v $(pwd)/data.ms:/data.ms \
    getmeili/meilisearch
Server is listening on: http://0.0.0.0:7700
```

::: warning
Data written to a Docker container is not persistent and is deleted along with the container when the latter is stopped. Docker volumes are not deleted when containers are removed. It is then recommended to share volumes between your containers and your host machine to provide persistent storage. MeiliSearch writes data to `/data.ms`
:::

::: tab APT

Download the **latest stable release** of MeiliSearch with **APT**.

Launch MeiliSearch to start the server.

```bash
$ echo "deb [trusted=yes] https://apt.fury.io/meilisearch/ /" > /etc/apt/sources.list.d/fury.list
$ apt update && apt install meilisearch-http
$ meilisearch
Server is listening on: http://127.0.0.1:7700
```

:::

::: tab Source

MeiliSearch is written in `Rust`. To compile it, [installing the Rust toolchain](https://www.rust-lang.org/tools/install) is required.

If the Rust toolchain is already installed, clone the repository on your local system and change it to your working directory.

```bash
$ git clone https://github.com/meilisearch/MeiliSearch
$ cd MeiliSearch
```

In the cloned repository, compile MeiliSearch.

```bash
# Update the rust toolchain to the latest version
$ rustup update

# Compile the project
$ cargo build --release

# Execute the server binary
$ ./target/release/meilisearch
```

:::

::::

## Usage

```
$ ./meilisearch --help
meilisearch-http 0.10.0

USAGE:
    meilisearch [OPTIONS]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --db-path <db-path>              The destination where the database must be created. [env: MEILI_DB_PATH=]
                                         [default: ./data.ms]
        --env <env>                      This environment variable must be set to `production` if your are running in
                                         production. Could be `production` or `development` - `production`: Force api
                                         keys - `development`: Show logs in "info" mode + not mendatory to specify the
                                         api keys [env: MEILI_ENV=]  [default: development]  [possible values:
                                         development, production]
        --http-addr <http-addr>          The address on which the http server will listen. [env: MEILI_HTTP_ADDR=]
                                         [default: 127.0.0.1:7700]
        --master-key <master-key>        The master key allowing you to do everything on the server. [env:
                                         MEILI_MASTER_KEY=]
        --no-analytics <no-analytics>    Do not send analytics to Meili. [env: MEILI_NO_ANALYTICS=]
```

## Environment variables and Flags

Flags can be added on launch.

```bash
$ ./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
Server is listening on: http://127.0.0.1:7700
```

Here is the list of **all Environment variables and Flags** (CLI options).

| Environment Variable | CLI option     | Description                                                                                                                                                              | Default value    |
| -------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| `MEILI_DB_PATH`      | --db-path      | Defines the location for the database files                                                                                                                              | "./data.ms"      |
| `MEILI_HTTP_ADDR`    | --http-addr    | Address and port to listen to                                                                                                                                            | "127.0.0.1:7700" |
| `MEILI_MASTER_KEY`   | --master-key   | Default admin API key                                                                                                                                                    |                  |
| `MEILI_NO_ANALYTICS` | --no-analytics | Deactivates analytics. Analytics allow us to know how many users are using MeiliSearch, which versions and which platforms are used. This process is entirely anonymous. |                  |
| `MEILI_ENV`          | --env          | Defines the running environment of MeiliSearch. Can be set to `production` or `development`.                                                                             | "development"    |

### Environments

By default, MeiliSearch runs in `development` mode.

- `Production`: the [master key](/guides/advanced_guides/authentication.md) is **mandatory**.
- `Development`: the [master key](/guides/advanced_guides/authentication.md) is **optional**, and logs are output in "info" mode (_console output_).
