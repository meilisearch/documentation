# MeiliSearch Binary

## Downloading from Curl

This script will download the **latest stable release** of MeiliSearch.
```bash
$ curl -L https://install.meilisearch.com | sh
$ ./meilisearch
Server is listening on: http://127.0.0.1:7700
```

## Downloading with Homebrew

The MeiliSearch binary (latest stable release) can be downloaded with the Homebrew package manager.
```bash
$ brew install meilisearch
$ meilisearch
Server is listening on: http://127.0.0.1:7700
```

## Downloading with APT

The MeiliSearch binary (latest stable release) can be downloaded with the APT package manager.
```bash
$ echo "deb [trusted=yes] https://apt.fury.io/meilisearch/ /" > /etc/apt/sources.list.d/fury.list
$ apt update && apt install meilisearch-http
$ meilisearch
Server is listening on: http://127.0.0.1:7700
```

## Compiling from source

MeiliSearch is made in `Rust`. Therefore the Rust toolchain must [be installed](https://www.rust-lang.org/tools/install) to compile the project.

If you have the Rust toolchain already installed, you need to clone the repository and go to the cloned directory.

```bash
git clone https://github.com/meilisearch/MeiliSearch
cd MeiliSearch
```

Inside the folder, compile MeiliSearch.

```bash
# Production version
cargo build --release

# Debug version
cargo build
```
::: tip
Compiling in release mode is longer than in debug mode but the binary will be significantly faster. You **must** run a release binary when using MeiliSearch in production.
:::

You can find the compiled binary in `target/debug` or `target/release`.

```bash
# Excuting the server binary
./target/release/meilisearch
```

## Running with Docker 🐳

The `latest` docker image is built against each commit on the master branch. You can also run any specific version if you specify the specific tag.
```bash
$ docker run -it --rm -p 7700:7700 getmeili/meilisearch:latest
Server is listening on: http://0.0.0.0:7700
```

## Running on Heroku

You can deploy the latest stable build of MeiliSearch straight on Heroku.

<p align="center">
  <a href="https://heroku.com/deploy?template=https://github.com/meilisearch/MeiliSearch">
    <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
  </a>
</p>

::: note
The deploy can take up to 20 minutes because it will compile the whole project from the GitHub repository.
:::

## Usage

```bash
$ ./meilisearch --help
USAGE:
    meilisearch [OPTIONS]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --api-key <api-key>              The master key allowing you to do everything on the server. [env:
                                         MEILI_API_KEY=]
        --db-path <db-path>              The destination where the database must be created. [env: MEILI_DB_PATH=]
                                         [default: ./data.ms]
        --http-addr <http-addr>          The address on which the http server will listen. [env: MEILI_HTTP_ADDR=]
                                         [default: 127.0.0.1:7700]
        --no-analytics <no-analytics>    Do not send analytics to Meili. [env: MEILI_NO_ANALYTICS=]
```

# Environment variables

| Environment Variable | CLI option     | Description                                                                                                                                                            | Default value      |
|----------------------|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| MEILI_DB_PATH        | --db-path      | Define the location for the database files                                                                                                                                         | "./data.ms" |
| MEILI_HTTP_ADDR      | --http-addr    | Address and port to listen to                                                                                                                                          | "127.0.0.1:7700"   |
| MEILI_API_KEY        | --api-key      | Default admin API key                                                                                                                                                  |                    |
| MEILI_NO_ANALYTICS   | --no-analytics | Deactivate analytics. Analytics help us to know how much users are using our project, knowing which versions and which platforms are used. It is completely anonymous. |                    |
