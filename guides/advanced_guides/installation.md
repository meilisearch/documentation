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

## Environment variables and Options

Options are added on launch.

```bash
$ ./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
Server is listening on: http://127.0.0.1:7700
```

Here is the list of [all Environment variables and options](/guides/advanced_guides/configuration.md).
