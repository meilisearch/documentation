# Installation

## Download and launch

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

::: tab Windows
To install MeiliSearch on Windows, you can:

- use Docker
- download the available binary provided as [a release asset](https://github.com/meilisearch/MeiliSearch/releases)
- compile from source
:::

::::

::: tip Compile for Best Performance
For best performance, compile MeiliSearch on the machine you intend to run it on. This way, the binary is optimized for your specific architecture.
:::

## Cloud deploy

To deploy MeiliSearch on a cloud service, follow one of our dedicated guides:

- [AWS](/create/how_to/aws.md)
- [DigitalOcean](/create/how_to/digitalocean_droplet.md)
- [Qovery](/create/how_to/qovery.md)

## Configuration options

Configuration options are added at launch, either through command line options or through environment variables.

This is an example using the command line options.

```bash
./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
```

Here is a list of [all the options and how to use them](/reference/features/configuration.md).

## Updating MeiliSearch

Getting the latest version of MeiliSearch is a straightforward process: simply fetch and install the latest binary with your preferred method (see [Installation](/learn/getting_started/installation.md#download-and-launch) above).

However, please note that **prior to our official release (`v1.0`), databases are not compatible across versions**. Any database created by MeiliSearch `v0.X` can only be read by that version.

### Migrating your database to a later version

If you get the error `Cannot open database, expected MeiliSearch engine version: X.X.X, current engine version Y.Y.Y`, your database is not compatible with the version you're using. To migrate your database to the most recent version of MeiliSearch, follow our [dedicated guide](/create/how_to/updating.md).
