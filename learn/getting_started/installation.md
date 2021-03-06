# Installation

## Download and Launch

:::: tabs

::: tab cURL
Download the **latest stable release** of MeiliSearch with **cURL**.

Launch MeiliSearch to start the server.

```bash
# Install MeiliSearch
curl -L https://install.meilisearch.com | sh

# Launch MeiliSearch
./meilisearch
```

:::

::: tab Homebrew
Download the **latest stable release** of MeiliSearch with **Homebrew**.

Launch MeiliSearch to start the server.

```bash
# Update brew and install MeiliSearch
brew update && brew install meilisearch

# Launch MeiliSearch
meilisearch
```

:::

::: tab Docker
Using **Docker** you can choose to run [any available tags](https://hub.docker.com/r/getmeili/meilisearch/tags).

This command starts the **latest stable release** of MeiliSearch.

```bash
docker run -it --rm \
    -p 7700:7700 \
    -v $(pwd)/data.ms:/data.ms \
    getmeili/meilisearch
```

Data written to a **Docker container is not persistent** and is deleted along with the container when the latter is stopped. Docker volumes are not deleted when containers are removed. It is then recommended to share volumes between your containers and your host machine to provide persistent storage. MeiliSearch writes data to `/data.ms`
:::

::: tab APT

Download the **latest stable release** of MeiliSearch with **APT**.

Launch MeiliSearch to start the server.

```bash
# Add MeiliSearch package
echo "deb [trusted=yes] https://apt.fury.io/meilisearch/ /" > /etc/apt/sources.list.d/fury.list

# Update APT and install MeiliSearch
apt update && apt install meilisearch-http

# Launch MeiliSearch
meilisearch
```

:::

::: tab Source

MeiliSearch is written in `Rust`. To compile it, [installing the Rust toolchain](https://www.rust-lang.org/tools/install) is required.

If the Rust toolchain is already installed, clone the repository on your local system and change it to your working directory.

```bash
git clone https://github.com/meilisearch/MeiliSearch
cd MeiliSearch
```

In the cloned repository, compile MeiliSearch.

```bash
# Update the rust toolchain to the latest version
rustup update

# Compile the project
cargo build --release

# Execute the server binary
./target/release/meilisearch
```

:::

::::

::: tip Compile for Best Performance
For best performance, compile MeiliSearch on the machine you intend to run it on. This way, the binary is optimized for your specific architecture.
:::

::: details MeiliSearch on M1 Mac
At this time, MeiliSearch may not compile on M1 Macs. If you have issues installing MeiliSearch, please [create an issue](https://github.com/meilisearch/MeiliSearch/issues/new/choose) so we can improve our software!
:::

::: details MeiliSearch on Windows
To install MeiliSearch on Windows, use Docker or compile from the source.

A common compilation error (`"link.exe not found"`) can be solved by installing [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/) (scroll down and click on **Tools for Visual Studio 2019**).

MeiliSearch will allocate 100GB on launch. If disk space is an issue on your machine, adjust the [main database](/reference/features/configuration.md#max-mdb-size) and [update database](/reference/features/configuration.md#max-udb-size) maximums accordingly.
:::

## Cloud Deploy

To deploy MeiliSearch on a cloud service, follow one of our dedicated guides:

- [AWS](/create/how_to/aws.md)
- [DigitalOcean](/create/how_to/digitalocean_droplet.md)
- [Qovery](/create/how_to/qovery.md)

## Configuration Options

Configuration options are added at launch, either through command line options or through environment variables.

This is an example using the command line options.

```bash
./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
```

Here is a list of [all the options and how to use them](/reference/features/configuration.md).

## Updating MeiliSearch

Getting the latest version of MeiliSearch is a straightforward process: simply fetch and install the latest binary with your preferred method (see [installation](/learn/getting_started/installation.md#download-and-launch) above).

However, please note that prior to our official release (`v1.0`), all minor updates (`v0.X`) are considered breaking. In other words, **MeiliSearch databases are not compatible across versions** for as long as we are in beta.

If you get the error `Cannot open database, expected MeiliSearch engine version: X.X.X, current engine version Y.Y.Y`, your database is not compatible with the version you're using. To migrate your database to the most recent version of MeiliSearch, we recommend following our [dedicated guide](/create/how_to/updating.md).

### Migrating a Database to a Later Version

Using [dumps](/reference/features/dumps.md), you can export your MeiliSearch data—all indexes, documents, and settings contained in your database—into a transferrable state. Then, you can re-import this data after updating MeiliSearch to the latest version.

Since the content is exported in a way that guarantees mobility, it needs to be re-indexed. If your database is large, this process can take a long time. Nonetheless, this process guarantees **to migrate all settings and documents between two different versions of MeiliSearch**.

For a complete guide on how to migrate your database to the most recent version, [click here](/create/how_to/updating.md).
