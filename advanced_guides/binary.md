# MeiliSearch Binary

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
$ docker run -it --rm -p 8080:8080 getmeili/meilisearch:latest
Server is listening on: http://0.0.0.0:8080
```

## Usage

```bash
$ ./meilisearch --help
USAGE:
    meilidb-http [OPTIONS]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --api-key <api-key>              The master key allowing you to do everything on the server. [env:
                                         MEILI_API_KEY=]
        --db-path <db-path>              The destination where the database must be created. [env: MEILI_DB_PATH=]
                                         [default: /tmp/meilidb]
        --http-addr <http-addr>          The address on which the http server will listen. [env: MEILI_HTTP_ADDR=]
                                         [default: 127.0.0.1:8080]
        --no-analytics <no-analytics>    Do not send analytics to Meili. [env: MEILI_NO_ANALYTICS=]
```
::: tip Environment variables
Check the [references](/references/environment.md) to read more about the binary options.
:::
