# Using Meilisearch with Docker

A common way of installing Meilisearch is using Docker. In this guide you will learn what Docker is, how to install it in your local machine, and how to use Meilisearch with it.

## Docker

Docker is a tool that packages an application's code and dependencies into something called a container. Using Docker allows developers to ensure their software runs reliably across a wide range of machines and environments.

Docker containers are distributed in images. Docker images are packages storing not only the container, but also instructions on how Docker should instantiate that container.

## Install Docker

The first step to start using Docker is installing it in your target machine. We recommend following [Docker's official instructions to install Docker Desktop](https://docs.docker.com/get-docker/), available for MacOS, Windows, and Linux.

Docker for Desktop includes an interface for managing your containers, command-line applications and several tools required for using Docker.

## Install Meilisearch

Once you installed Docker you can use the `docker pull` command to download a Meilisearch image:

```sh
docker pull getmeili/meilisearch:v0.28
```

Meilisearch deploys a new Docker image for every new release. All images are tagged with the release version. You can see [the full list of available Meilisearch Docker images](https://hub.docker.com/r/getmeili/meilisearch/tags#!) on Docker Hub.

::: warning
Meilisearch advises against using the `latest` tag. As its name indicates, `latest` will always get the most recent Meilisearch release, which might result in different machines running different images if significant time passes between setting up each of them.
:::

## Run Meilisearch

After running `docker pull` and downloading Meilisearch image, you can use `docker run` to launch it:

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

## Managing data

When using Docker, your working directory is `/meili_data`. This means the location of your database file is: `/meili_data/data.ms`

By default, data written to a Docker container is not persistent and is wiped every time the container stops running. This data includes your indexes and the documents they store.

To keep your data intact between reboots, specify a dedicated volume by running Docker with the `-v` command-line option:

```sh
docker run -it --rm \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v0.28
```

The example above uses `$(pwd)/meili_data:/meili_data`, which is a directory in the host machine. This is only recommended when developing and prototyping your application.

::: tip
If you cannot find the `data.ms` file when following instructions in the Meilisearch documentation, look for `/meili_data/data.ms`.
:::

### Dumps

To export a dump, use the dumps endpoint as described in our dedicated dumps guide. Once the task is complete, you can access the dump file in the `/meili_data` directory inside the volume you configured with `-v`.

To import a dump, use the `--import-dump` command-line option and specify the path to the dump. Make sure the path points to `/meili_data` in a volume reachable by the Docker:

```sh
docker run -it --rm \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v0.28
  meilisearch --import-dump /meili_data/20200813-042312213.dump
```

### Snapshots

To generate a Meilisearch snapshot with Docker, launch Meilisearch with `--schedule-snapshot` and `--snapshot-dir`:

```sh
docker run -it --rm \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v0.28
  meilisearch --schedule-snapshot --snapshot-dir /meili_data/snapshots
```

`--snapshot-dir` should point to a folder inside the Docker working directory for Meilisearch, `/meili_data`. Once generated, snapshots will be available in the configured directory.

To import a snapshot, launch Meilisearch with the `--import-snapshot` option:

```sh
docker run -it --rm \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v0.28
  meilisearch --import-snapshot /meili_data/data.ms.snapshot
```

### Production environments

In the examples above, `$(pwd)/meili_data:/meili_data` points to a directory in the host machine. This is a good choice when developing or prototyping, but might cause performance issues in production environments. In these situations, mounting dedicated volumes with tools like `docker volume` is advisable.

::: note
On macOS and Windows, do not mount volumes from the host to the container—this will make I/O operations between the filesystems very slow. Instead make sure the mounted volumes remain inside the Docker virtual machine.
:::
