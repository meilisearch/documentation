# Quick Start

MeiliSearch is very simple to install and deploy. It requires very little configuration to be up and running. Follow this step-by-step guide to get started!

### Deploy the Server

You can deploy the server on your own machine. By default, the server will listen to port 7700 for HTTP requests.

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

### Create an Index and upload documents

MeiliSearch can serve multiple indexes, with different kinds of documents.

It is required to create an index before sending documents to it.

```bash
$ curl -i -X POST 'http://127.0.0.1:7700/indexes' \
  --data '{
    "uid": "movies"
  }'
```

This `uid` is the `:index_uid` identifier used in all `indexes/:index_uid` routes.

Now that the server knows about your brand new index, you're ready to send it some data.

If you need a test dataset, use [this sample](https://www.notion.so/meilisearch/A-movies-dataset-to-test-Meili-1cbf7c9cfa4247249c40edfa22d7ca87#b5ae399b81834705ba5420ac70358a65).

```bash
$ curl -i -X POST 'http://127.0.0.1:7700/indexes/movies/documents' \
  --data @datasets/movies/movies.json
```

::: warning
If you get a `Could not infer a primary key` error, see detailed information about the primary key [here](/guides/main_concepts/documents.md#primary-key).
:::

### Search for Documents

The search engine is now aware of your documents and can serve those via an HTTP server.

```bash
$ curl 'http://127.0.0.1:7700/indexes/movies/search?q=botman'
```

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
    }
  ],
  "offset": 0,
  "limit": 2,
  "processingTimeMs": 1,
  "query": "botman"
}
```

::: tip
The [`jq` command line tool](https://stedolan.github.io/jq/) can be a great help for reading the server responses.
:::
