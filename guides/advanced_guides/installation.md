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

Data written to a **Docker container is not persistent** and is deleted along with the container when the latter is stopped. Docker volumes are not deleted when containers are removed. It is then recommended to share volumes between your containers and your host machine to provide persistent storage. MeiliSearch writes data to `/data.ms`
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

## Configuration Options

Options are added at launch. Either through command line options or through environment variables.

This is an example using the command line options.

```bash
$ ./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
Server is listening on: http://127.0.0.1:7700
```

Here is the list of [all the options and how to use them](/guides/advanced_guides/configuration.md).

## Updating MeiliSearch

Updating MeiliSearch is a straightforward process: simply get and install the latest binary with your preferred method (see [installation](/guides/advanced_guides/installation.md#download-and-launch) above).

Note that prior to our official release (`v1.0`), all minor updates (`v0.X`) are considered breaking. Therefore, **MeiliSearch databases are not compatible across versions** for as long as we are in beta.

If you want to transfer your database from an outdated MeiliSearch instance to the most recent version, we recommend following [the below guide](/guides/advanced_guides/installation.md#migrating-a-database-to-a-later-version).

If you get the error `Cannot open database, expected MeiliSearch engine version: X.X.X, current engine version Y.Y.Y`, simply delete your database folder (defaults to `data.ms`), and re-index all your documents.

### Migrating a Database to a Later Version

Using [dumps](/guides/advanced_guides/snapshots_and_dumps.md#dumps), you can export your MeiliSearch data—all indexes, documents, and settings contained in your database—into a transferrable state. Then, you can re-import this data after updating MeiliSearch to the latest version.

Since the content is exported in a way that guarantees mobility, it needs to be re-indexed. If your database is large, this process can take a long time. Nonetheless, this process guarantees **to migrate all settings and documents between two different versions of MeiliSearch**.

If you want a complete guide on how to update MeiliSearch on DigitalOcean, please [look at this GitHub issue](https://github.com/meilisearch/MeiliSearch/discussions/1187#discussioncomment-278125).
