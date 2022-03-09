# Quick start

In this quick start we will walk you through setting up Meilisearch, adding documents, performing your first search, using the search preview, and adding a search bar.

All that is required is a [command line](https://www.learnenough.com/command-line-tutorial#sec-running_a_terminal) for installation, and some way to interact with Meilisearch afterwards (e.g. [cURL](https://curl.se) or one of our [SDKs](/learn/what_is_meilisearch/sdks.md)).

Let's get started!

## Step 1: Setup and installation

We'll start with downloading and installing Meilisearch. You have the option to install Meilisearch locally or deploy it over a cloud service.

### Local installation

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
docker pull getmeili/meilisearch:latest

# Launch Meilisearch
docker run -it --rm \
    -p 7700:7700 \
    -v $(pwd)/data.ms:/data.ms \
    getmeili/meilisearch:latest
```

Data written to a **Docker container is not persistent** and is wiped every time the container is stopped. We recommend using a shared Docker volume between containers and host machines to provide persistent storage.

On macOS and Windows, do not mount volumes from the host to the container—this will make I/O operations between the filesystems very slow. Instead make sure the mounted volumes remain inside the docker vm. If this is not an option, we recommend using the native application or a [cloud-hosted option](#cloud-deploy).

You can learn more about Docker by consulting [its official documentation](https://docs.docker.com/get-docker/).
:::

::: tab APT

Download the **latest stable release** of Meilisearch with **APT**.

Launch Meilisearch to start the server.

```bash
# Add Meilisearch package
sudo echo "deb [trusted=yes] https://apt.fury.io/meilisearch/ /" > /etc/apt/sources.list.d/fury.list

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

In the cloned repository, run the following command replacing `vX.Y.Z` with the tag you selected:

```bash
git checkout v0.25.2
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

- use Docker (see "Docker" tab above)
- [download the latest binary](https://github.com/meilisearch/Meilisearch/releases)
- use the installation script (see "cURL" tab above) if you have installed [Cygwin](https://www.cygwin.com/) or equivalent
- compile from source (see "Source" tab above)

To learn more about the Windows command prompt, follow this [introductory guide](https://www.makeuseof.com/tag/a-beginners-guide-to-the-windows-command-line/).

::::

### Cloud deploy

To deploy Meilisearch on a cloud service, follow one of our dedicated guides:

- [AWS](/learn/cookbooks/aws.md)
- [DigitalOcean](/learn/cookbooks/digitalocean_droplet.md)
- [Qovery](/learn/cookbooks/qovery.md)
- [GCP](/learn/cookbooks/gcp.md)
- [Azure](/learn/cookbooks/azure.md)

### Running Meilisearch

On successfully running Meilisearch, you should see the following response:

```
888b     d888          d8b 888 d8b                                            888
8888b   d8888          Y8P 888 Y8P                                            888
88888b.d88888              888                                                888
888Y88888P888  .d88b.  888 888 888 .d8888b   .d88b.   8888b.  888d888 .d8888b 88888b.
888 Y888P 888 d8P  Y8b 888 888 888 88K      d8P  Y8b     "88b 888P"  d88P"    888 "88b
888  Y8P  888 88888888 888 888 888 "Y8888b. 88888888 .d888888 888    888      888  888
888   "   888 Y8b.     888 888 888      X88 Y8b.     888  888 888    Y88b.    888  888
888       888  "Y8888  888 888 888  88888P'  "Y8888  "Y888888 888     "Y8888P 888  888

Database path:       "./data.ms"
Server listening on: "127.0.0.1:7700"
```

Congratulations! You're ready to move on to the next step!

## Step 2: Add documents

For this quick start, we will be using a collection of movies as our dataset. To follow along, first click this link to download the file: <a id="downloadMovie" href="/movies.json" download="movies.json">movies.json</a>. Then, move the downloaded file into your working directory.

Open a new terminal window and run the following command:

<CodeSamples id="getting_started_add_documents_md" />

Meilisearch stores data in the form of discrete records, called [documents](/learn/core_concepts/documents.md). Documents are grouped into collections, called [indexes](/learn/core_concepts/indexes.md).

The previous command added documents from `movies.json` to a new index called `movies`. After adding documents, you should receive a response like this:

```json
{
    "uid": 0,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentAddition",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

Most database operations in Meilisearch are [asynchronous](/learn/advanced/asynchronous_operations.md). This means that rather than being processed instantly, **API requests are added to a queue and processed one at a time**.

Use the returned `uid` to [check the status](/reference/api/tasks.md) of your documents:

<CodeSamples id="getting_started_check_task_status_md" />

If the document addition is successful, the response should look like this:

```json
{
   "uid":0,
   "indexUid":"movies",
   "status":"succeeded",
   "type":"documentAddition",
   "details":{
      "receivedDocuments":19547,
      "indexedDocuments":19547
   },
   "duration":"PT0.030750S",
   "enqueuedAt":"2021-12-20T12:39:18.349288Z",
   "startedAt":"2021-12-20T12:39:18.352490Z",
   "finishedAt":"2021-12-20T12:39:18.380038Z"
}
```

If the `status` field has the value `enqueued` or `processing`, all you have to do is wait a short time and check again. Proceed to the next step once the task `status` has changed to `succeeded`.

## Step 3: Search

Now that you have Meilisearch setup, you can start searching!

<CodeSamples id="getting_started_search_md" />

In the above code sample, the parameter `q` represents the search query. The documents you added in [step two](#step-2-add-documents) will be searched for text that matches `botman`.

**Meilisearch response**:

```json
{
  "hits": [
    {
      "id": "29751",
      "title": "Batman Unmasked: The Psychology of the Dark Knight",
      "poster": "https://image.tmdb.org/t/p/w1280/jjHu128XLARc2k4cJrblAvZe0HE.jpg",
      "overview": "Delve into the world of Batman and the vigilante justice tha",
      "release_date": "2008-07-15"
    },
    {
      "id": "471474",
      "title": "Batman: Gotham by Gaslight",
      "poster": "https://image.tmdb.org/t/p/w1280/7souLi5zqQCnpZVghaXv0Wowi0y.jpg",
      "overview": "ve Victorian Age Gotham City, Batman begins his war on crime",
      "release_date": "2018-01-12"
    },
    …
  ],
  "nbHits":66,
  "exhaustiveNbHits":false,
  "query":"botman",
  "limit":20,
  "offset":0,
  "processingTimeMs":12
}
```

By default, Meilisearch only returns the first 20 results for a search query. This can be changed using the [`limit` parameter](/reference/api/search.md#limit).

## Step 4: Search preview

Meilisearch offers a web interface where you can preview search results. It comes with a search bar that allows you to search a selected index. You can access it in your browser at `http://127.0.0.1:7700` any time Meilisearch is running.

![Screenshot of Meilisearch's search preview indicating the indexes dropdown on the upper right corner](/getting-started/multiple_indexes.png)

If you have multiple indexes, you can switch between them using the indexes dropdown.

## Step 5: Front-end integration

The only step missing now is adding a search bar to your project. The easiest way of achieving this is to use [instant-meilisearch](https://github.com/meilisearch/instant-meilisearch): a developer tool that generates all the components needed to start searching.

To learn more about instant-meilisearch, refer to its [documentation](https://github.com/meilisearch/instant-meilisearch#readme) located in the project repository.

## What's next?

You now know all the basics: how to install Meilisearch, create an index, add documents, check the status of an asynchronous task, and perform a search.

To keep going, continue to the [Meilisearch 101](/learn/getting_started/filtering_and_sorting.md) for a guided overview of the main features, or check out the [API references](/reference/api/overview.md) to dive right in!
