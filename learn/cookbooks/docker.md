# Using Meilisearch with Docker

Docker is a tool that packages applications into containers portable across a wide range of environments. When using Docker for development, we recommend following [the official instructions to install Docker Desktop](https://docs.docker.com/get-docker/).

In this guide you will learn how to use Docker to download and run Meilisearch, configure your instance, and manage your Meilisearch data.

## Download Meilisearch with Docker

Docker containers are distributed in images. To use Meilisearch, use the `docker pull` command to download a Meilisearch image:

```sh
docker pull getmeili/meilisearch:v0.28
```

Meilisearch deploys a new Docker image for every new release. All images are tagged with the release version—indicated in the example above by the text following the `:`. You can see [the full list of available Meilisearch Docker images](https://hub.docker.com/r/getmeili/meilisearch/tags#!) on Docker Hub.

::: warning
The `latest` tag will always download the most recent Meilisearch release. Meilisearch advises against using it, as it might result in different machines running different images if significant time passes between setting up each one of them.
:::

## Run Meilisearch

After completing the previous step, use `docker run` to launch the Meilisearch image:

```sh
docker run -it --rm \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v0.28
```

### Configure Meilisearch

Meilisearch accepts a number of instance options during launch. You can configure instance options in two ways: environment variables and CLI arguments. Some options are only available as CLI arguments—[consult our configuration reference for an exhaustive list](/learn/configuration/instance_options.md).

#### Passing instance options with environment variables

To pass environment variables to Docker, add the `-e` argument to `docker run`. The example below launches Meilisearch with a master key:

```sh
docker run -it --rm \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY='MASTER_KEY'\
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v0.28
```

#### Passing instance options with CLI arguments

If you want to pass command-line arguments to Meilisearch with Docker, you must add a line to the end of your `docker run` command explicitly launching the `meilisearch` binary:

```sh
docker run -it --rm \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v0.28
  meilisearch --master-key="MASTER_KEY"
```

## Managing data

When using Docker, your working directory is `/meili_data`. This means the location of your database file is `/meili_data/data.ms`.

### Data persistency

By default, data written to a Docker container is deleted every time the container stops running. This data includes your indexes and the documents they store.

To keep your data intact between reboots, specify a dedicated volume by running Docker with the `-v` command-line option:

```sh
docker run -it --rm \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v0.28
```

The example above uses `$(pwd)/meili_data`, which is a directory in the host machine. Depending on your OS, mounting volumes from the host to the container might result in performance loss and is only recommended when developing your application.

### Generating dumps and updating Meilisearch

To export a dump, [use the create dump endpoint as described in our dumps guide](/learn/advanced/dumps.md). Once the task is complete, you can access the dump file in `/meili_data/dumps` inside the volume you passed with `-v`.

To import a dump, use the `--import-dump` command-line option and specify the path to the dump file. Make sure the path points to a volume reachable by Docker:

```sh
docker run -it --rm \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v0.28
  meilisearch --import-dump /meili_data/dumps/20200813-042312213.dump
```

::: warning
If you are using a shared volume, you must delete `/meili_data/data.ms` before importing a dump.
:::

Use dumps to migrate data between different Meilisearch releases. [Read more about updating Meilisearch in our dedicated guide.](/learn/advanced/updating.md)

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
  meilisearch --import-snapshot /meili_data/snapshots/data.ms.snapshot
```

Use snapshots for backup or when migrating data between two Meilisearch instances of the same version. [Read more about snapshots in our guide.](/learn/advanced/snapshots.md)
