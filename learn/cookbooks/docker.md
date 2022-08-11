# Using Meilisearch with Docker

A common way of installing Meilisearch is using Docker. In this guide you will learn what Docker is, how to install it in your local machine, and how to use Meilisearch with it.

## Docker

Docker is a tool that packages an application's code and dependencies into something called a container. Using Docker allows developers to ensure their software runs reliably across a wide range of machines and environments.

Docker containers are distributed in images. Docker images are packages storing not only the container, but also instructions on how Docker should instantiate that container.

## Install Docker

The first step to start using Docker is installing it in your target machine. We recommend following [Docker's official instructions to install Docker Desktop](https://docs.docker.com/get-docker/), available for MacOS, Windows, and Linux.

Docker for Desktop includes several tools required for using Docker. In this tutorial, we are particularly interested in its CLI commands.

## Install Meilisearch

Once you have installed Docker you can use the `docker pull` command to download a  Meilisearch image:

```sh
docker pull getmeili/meilisearch:v0.28
```

Meilisearch deploys a new Docker image for every new release. All images are tagged with the release version. You can see [the full list of available Meilisearch Docker images](https://hub.docker.com/r/getmeili/meilisearch/tags#!) on Docker Hub.

::: warning
Meilisearch advises against using the `latest` tag. As its name indicates, `latest` will always get the most recent Meilisearch release, which might result in different machines running different images if significant time passes between setting up each of them.
:::

## Run Meilisearch

After running `docker pull` and installing Meilisearch, you can use `docker run` to launch it:

```sh
docker run -it --rm \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v0.28
```

### Passing instance options

Meilisearch accepts a number of instance options during launch. You can configure instance options in two ways: environment variables and CLI arguments.

#### Passing instance options with environment variables

To pass environment variables to Docker, you must use the `-e` argument. The example below launches Meilisearch with a master key:

```sh
docker run -it --rm \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY='MASTER_KEY'\
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v0.28
```

#### Passing instance options with CLI arguments

In the previous examples, Docker implicitly runs Meilisearch. If you want to pass command-line arguments to Meilisearch with Docker, you must explicitly run the `meilisearch` binary:

```sh
docker run -it --rm \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v0.28
  meilisearch --master-key="MASTER_KEY"
```

## How to import a dump

## Data persistency

Data written to a Docker container, such as indexes and documents, is not persistent and is wiped every time the container is stopped. To keep data intact between every reboot, you must use the `-v` argument to mount a shared Docker volume:

```sh
docker run -it --rm \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v0.28
```

On macOS and Windows, do not mount volumes from the host to the container—this will make I/O operations between the filesystems very slow. Instead make sure the mounted volumes remain inside the Docker virtual machine.

### Filepaths

#### database file

#### generated dumps

#### generated snapshots