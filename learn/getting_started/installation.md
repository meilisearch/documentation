# Installation

## Download and launch

:::: tabs

::: tab cURL
Download the **latest stable release** of Meilisearch with **cURL**.

Launch Meilisearch to start the server.

```bash
# Install Meilisearch
curl -L https://install.meilisearch.com | sh

# Launch Meilisearch
./meilisearch
```

:::

::: tab Homebrew
Download the **latest stable release** of Meilisearch with **Homebrew**.

Launch Meilisearch to start the server.

```bash
# Update brew and install Meilisearch
brew update && brew install meilisearch

# Launch Meilisearch
meilisearch
```

:::

::: tab Docker
Using **Docker** you can choose to run [any available tag](https://hub.docker.com/r/getmeili/meilisearch/tags).

This command starts the **latest stable release** of Meilisearch.

```bash
# Fetch the latest version of Meilisearch image from DockerHub
docker pull getmeili/meilisearch:latest

# Launch Meilisearch
docker run -it --rm \
    -p 7700:7700 \
    -v $(pwd)/data.ms:/data.ms \
    getmeili/meilisearch:latest
```

Data written to a **Docker container is not persistent** and is deleted along with the container when the latter is stopped. Docker volumes are not deleted when containers are removed. It is then recommended to share volumes between your containers and your host machine to provide persistent storage. Meilisearch writes data to the `data.ms` folder.

You can learn more about Docker on the [official documentation](https://docs.docker.com/get-docker/).
:::

::: tab APT

Download the **latest stable release** of Meilisearch with **APT**.

Launch Meilisearch to start the server.

```bash
# Add Meilisearch package
echo "deb [trusted=yes] https://apt.fury.io/meilisearch/ /" > /etc/apt/sources.list.d/fury.list

# Update APT and install Meilisearch
apt update && apt install meilisearch-http

# Launch Meilisearch
meilisearch
```

:::

::: tab Source

Meilisearch is written in `Rust`. To compile it, [installing the Rust toolchain](https://www.rust-lang.org/tools/install) is required.

If the Rust toolchain is already installed, clone the repository on your local system and change it to your working directory.

```bash
git clone https://github.com/meilisearch/MeiliSearch
cd MeiliSearch
```

In the cloned repository, compile Meilisearch.

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

To install Meilisearch on Windows, you can:

- use Docker (see "Docker" tab above)
- [download the latest binary](https://github.com/meilisearch/MeiliSearch/releases)
- use the installation script (see "cURL" tab above) if you have installed [Cygwin](https://www.cygwin.com/) or equivalent
- compile from source (see "Source" tab above)

To learn more about the Windows command prompt, follow this [introductory guide](https://www.makeuseof.com/tag/a-beginners-guide-to-the-windows-command-line/).

::::

::: tip Compile for Best Performance
For best performance, compile Meilisearch on the machine you intend to run it on. This way, the binary is optimized for your specific architecture.
:::

## Cloud deploy

To deploy Meilisearch on a cloud service, follow one of our dedicated guides:

- [AWS](/learn/cookbooks/aws.md)
- [DigitalOcean](/learn/cookbooks/digitalocean_droplet.md)
- [Qovery](/learn/cookbooks/qovery.md)

## Configuration options

Configuration options are added at launch, either through command line options or through environment variables.

This is an example using the command line options.

```bash
./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
```

Here is a list of [all the options and how to use them](/reference/features/configuration.md).

## Updating Meilisearch

Getting the latest version of Meilisearch is a straightforward process: simply fetch and install the latest binary with your preferred method (see [Installation](/learn/getting_started/installation.md#download-and-launch) above).

However, please note that **prior to our official release (`v1.0`), databases are not compatible across versions**. Any database created by Meilisearch `v0.X` can only be read by that version.

### Migrating your database to a later version

If you get the error `Cannot open database, expected Meilisearch engine version: X.X.X, current engine version Y.Y.Y`, your database is not compatible with the version you're using. To migrate your database to the most recent version of Meilisearch, follow our [dedicated guide](/learn/advanced/updating.md).
