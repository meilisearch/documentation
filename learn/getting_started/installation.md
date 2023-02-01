# Installation

We'll start with downloading and installing Meilisearch. You have the option to install Meilisearch locally or deploy it over a cloud service.

## Local installation

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
Download the **latest stable release** of Meilisearch with **[Homebrew](https://brew.sh/)**, a package manager for MacOS.

Launch Meilisearch to start the server.

```bash
# Update brew and install Meilisearch
brew update && brew install meilisearch

# Launch Meilisearch
meilisearch
```

:::

::: tab Docker
When using **Docker**, you can run [any available tag](https://hub.docker.com/r/getmeili/meilisearch/tags).

These commands launch the **latest stable release** of Meilisearch.

```bash
# Fetch the latest version of Meilisearch image from DockerHub
docker pull getmeili/meilisearch:v0.30

# Launch Meilisearch in development mode with a master key
docker run -it --rm \
    -p 7700:7700 \
    -e MEILI_MASTER_KEY='MASTER_KEY'\
    -v $(pwd)/meili_data:/meili_data \
    getmeili/meilisearch:v0.30 \
    meilisearch --env="development"
```

You can learn more about [using Meilisearch with Docker in our dedicated guide](/learn/cookbooks/docker.md).
:::

::: tab APT

Download the **latest stable release** of Meilisearch with **APT**.

Launch Meilisearch to start the server.

```bash
# Add Meilisearch package
echo "deb [trusted=yes] https://apt.fury.io/meilisearch/ /" | sudo tee /etc/apt/sources.list.d/fury.list

# Update APT and install Meilisearch
sudo apt update && sudo apt install meilisearch-http

# Launch Meilisearch
meilisearch
```

:::

::: tab Source

Meilisearch is written in `Rust`. To compile it, [install the Rust toolchain](https://www.rust-lang.org/tools/install).

If the Rust toolchain is already installed, clone the repository on your local system and change it to your working directory.

```bash
git clone https://github.com/meilisearch/meilisearch
cd meilisearch
```

Choose the release you want to use. You can find the full list [here](https://github.com/meilisearch/meilisearch/releases).

In the cloned repository, run the following command to access the most recent version of Meilisearch:

```bash
git checkout latest
```

Finally, update the rust toolchain, compile the project, and execute the binary.

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

- Use Docker (see "Docker" tab above)
- Download the latest binary (see "Direct download" tab above)
- Use the installation script (see "cURL" tab above) if you have installed [Cygwin](https://www.cygwin.com/), [WSL](https://learn.microsoft.com/en-us/windows/wsl/), or equivalent
- Compile from source (see "Source" tab above)

To learn more about the Windows command prompt, follow this [introductory guide](https://www.makeuseof.com/tag/a-beginners-guide-to-the-windows-command-line/).

:::

::: tab Direct download

If none of the other installation options work for you, you can always download the Meilisearch binary directly on GitHub.

Go to the [latest Meilisearch release](https://github.com/meilisearch/meilisearch/releases/latest), scroll down to "Assets", and select the binary corresponding to your operating system.

:::

::::

## Meilisearch Cloud

[Meilisearch Cloud](https://cloud.meilisearch.com/login) is one of the easiest way to get started with Meilisearch. Try our free plan.

## Cloud deploy

To deploy Meilisearch on a cloud service, follow one of our dedicated guides:

- [AWS](/learn/cookbooks/aws.md)
- [Azure](/learn/cookbooks/azure.md)
- [DigitalOcean](/learn/cookbooks/digitalocean_droplet.md)
- [GCP](/learn/cookbooks/gcp.md)
- [Koyeb](/learn/cookbooks/koyeb.md)
- [Qovery](/learn/cookbooks/qovery.md)
- [Railway](/learn/cookbooks/railway.md)
