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
$ docker run -it --rm -p 7700:7700 -v $(pwd)/data.ms:/data.ms getmeili/meilisearch
Server is listening on: http://0.0.0.0:7700
```

::: warning
Docker is not persistent. You should share a volume to make your container filesystem persistent. MeiliSearch write its data at `/data.ms`
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

::: tab Heroku

You can deploy the latest stable build of MeiliSearch straight on Heroku.

<p align="center">
  <a href="https://heroku.com/deploy?template=https://github.com/meilisearch/MeiliSearch">
    <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
  </a>
</p>

The deploy can take up to 20 minutes because it will compile the whole project from the GitHub repository.

::: warning
The [Heroku filesystem is ephemeral](https://help.heroku.com/K1PPS2WM/why-are-my-file-uploads-missing-deleted), which means you may lose your data on any restart of the Heroku instance. **The Heroku deploy is okay for testing purposes, but it won't work for production.**
:::

::: tab Source

MeiliSearch is made in `Rust`. Therefore the Rust toolchain must [be installed](https://www.rust-lang.org/tools/install) to compile the project.

If you have the Rust toolchain installed, you can clone the repository and compile it this way:

```bash
$ git clone https://github.com/meilisearch/MeiliSearch
$ cd MeiliSearch
```

Inside the folder, compile MeiliSearch.

```bash
# Production version
$ cargo build --release

# Executing the server binary
$ ./target/release/meilisearch
```

:::

::::




## Usage

```
$ ./meilisearch --help
meilisearch-http 0.9.0

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

```
$ ./meilisearch --db-path ./meilifiles --http-addr 127.0.0.1:7700
Server is listening on: http://127.0.0.1:7700
```

Here is the list of **all Environment variables and Flags** (CLI options).

| Environment Variable | CLI option     | Description                                                                                                                                                            | Default value      |
|----------------------|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| MEILI_DB_PATH        | --db-path      | Define the location for the database files                                                                                                                                         | "./data.ms" |
| MEILI_HTTP_ADDR      | --http-addr    | Address and port to listen to                                                                                                                                          | "127.0.0.1:7700"   |
| MEILI_MASTER_KEY     | --master-key   | Default admin API key                                                                                                                                                  |                    |
| MEILI_NO_ANALYTICS   | --no-analytics | Deactivate analytics. Analytics help us to know how much users are using our project, knowing which versions and which platforms are used. It is completely anonymous. |                    |
| MEILI_ENV   | --env | Defines the environment in which MeiliSearch is running. Can be `production` or `development` |  "development"  |

### Environments

By default, MeiliSearch runs in `development` mode.

- `Production`: the [master key](/guides/advanced_guides/keys.md) is **mandatory**.
- `Development`: the [master key](/guides/advanced_guides/keys.md) is **optional** and logs are output in "info" mode (*console output*).
