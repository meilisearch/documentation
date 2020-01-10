# Installation

## Download and launch
:::: tabs

::: tab cURL
Download the **latest stable release** of MeiliSearch with **curl**.

Launch the MeiliSearch package to start MeiliSearch's server.
```bash
$ curl -L https://install.meilisearch.com | sh
$ ./meilisearch
Server is listening on: http://127.0.0.1:7700
```
:::

::: tab Brew
Download the **latest stable release** of MeiliSearch with **Homebrew**.

Launch the MeiliSearch package to start MeiliSearch's server.
```bash
$ brew update && brew install meilisearch
$ meilisearch
Server is listening on: http://127.0.0.1:7700
```
:::

::: tab Docker
Using **Docker** you can choose to run [any available tags](https://hub.docker.com/r/getmeili/meilisearch/tags).

This command line starts the **latest stable release** of MeiliSearch.
```bash
$ docker run -it --rm -p 7700:7700 getmeili/meilisearch
Server is listening on: http://0.0.0.0:7700
```
:::

::: tab APT

Download the **latest stable release** of MeiliSearch with **APT**.

Launch the MeiliSearch package to start MeiliSearch's server.
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

:::


::: tab Source

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

  Compiling in release mode takes more time than in debug mode but the binary process time will be significantly faster. You **must** run a release binary when using MeiliSearch in production.

  You can find the compiled binary in `target/debug` or `target/release`.

  ```bash
  # Excuting the server binary
  $ ./target/release/meilisearch
  ```

:::

::::


## Flags
[Flags](/guides/advanced_guides/binary.md#environment-variables) can be added on launch.

```bash
$ ./meilisearch --db-path ./meilifiles --http-addr 127.0.0.1:7700
Server is listening on: http://127.0.0.1:7700
```

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
