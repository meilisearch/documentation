# Quick Start

MeiliSearch is simply to install and deploy. It will be up and running by following these few steps.

### Deploy the Server

You can deploy the server on your own machine. It will listen to HTTP requests on the 7700 port by default.

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
$ docker run -it --rm -p 7700:7700 -v $(pwd)/data.ms:/data.ms getmeili/meilisearch
Server is listening on: http://0.0.0.0:7700
```

::: warning
Docker is not persistent. You should share a volume to make your container filesystem persistent. MeiliSearch write its data at `/data.ms`
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

::: tab Heroku

You can deploy the latest stable build of MeiliSearch straight on Heroku.

<p align="center">
  <a href="https://heroku.com/deploy?template=https://github.com/meilisearch/MeiliSearch">
    <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
  </a>
</p>

The deploy can take up to 20 minutes because it will compile the whole project from the GitHub repository.

::: warning
The [Heroku filesystem is ephemeral](https://help.heroku.com/K1PPS2WM/why-are-my-file-uploads-missing-deleted), which means you may lose your data on any restart of the Heroku instance. **The Heroku deploy is okay for testing purposes, but it won't work for production.**
:::

::: tab Source

MeiliSearch is made in `Rust`. Therefore the Rust toolchain must [be installed](https://www.rust-lang.org/tools/install) to compile the project.

If you have the Rust toolchain already installed, you need to clone the repository and go to the cloned directory.

```bash
$ git clone https://github.com/meilisearch/MeiliSearch
$ cd MeiliSearch
```

Inside the folder, compile MeiliSearch.

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

### Create an Index and Upload Some Documents

MeiliSearch can serve multiple indexes, with different kinds of documents.

It is required to create an index before sending documents to it.

```bash
$ curl -i -X POST 'http://127.0.0.1:7700/indexes' \
  --data '{
    "uid": "movies"
  }'
```

This `uid` is the `:index_uid` identifier used in all `indexes/:index_uid` routes.

Now that the server knows about our brand new index, we can send our data to it.

If you have no dataset, [here is a movie dataset](https://www.notion.so/meilisearch/A-movies-dataset-to-test-Meili-1cbf7c9cfa4247249c40edfa22d7ca87#b5ae399b81834705ba5420ac70358a65) you can use.

```bash
$ curl -i -X POST 'http://127.0.0.1:7700/indexes/movies/documents' \
  --data @datasets/movies/movies.json
```

::: warning
If you have the `missing primary key` error. [More information about the primary key here](/guides/main_concepts/documents.md#primary-key).
:::

### Search for Documents

The search engine is now aware of our documents and can serve those via our HTTP server.

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
The [`jq` command line tool](https://stedolan.github.io/jq/) can greatly help you read the server responses.
:::
