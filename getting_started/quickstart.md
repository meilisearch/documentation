## Quick Start

You can deploy your own instant, relevant, and typo-tolerant MeiliSearch engine by yourself.
It can be achieved by following these three steps.

### Deploy the Server

You can deploy the server on your own machine. It will listen to HTTP requests on the 7700 port by default.


:::: tabs

::: tab curl
This script will download the latest stable release of MeiliSearch.
```bash
$ curl https://raw.githubusercontent.com/meilisearch/MeiliSearch/master/download-latest.sh | sh
$ ./meilisearch
Server is listening on: http://127.0.0.1:7700
```
:::

::: tab Docker
Using Docker you can choose to run [any available tags](https://hub.docker.com/r/getmeili/meilisearch/tags)
```bash
$ docker run -it --rm -p 7700:7700 getmeili/meilisearch
Server is listening on: http://0.0.0.0:7700
```
:::

::: tab Cargo
If you have the Rust toolchain installed you can compile MeiliSearch from the sources.
```bash
$ git clone https://github.com/meilisearch/MeiliSearch.git
$ cd MeiliSearch && cargo run --release
Server is listening on: http://0.0.0.0:7700
```
:::

::::

### Create an Index and Upload Some Documents

MeiliSearch can serve multiple indexes, with different kinds of documents. Therefore, it is required to create an index before sending documents to it.

```bash
curl -i -X POST 'http://127.0.0.1:7700/indexes' \
  --data '{
    "name" : "Movie"
  }'
```

The response looks like this:

```
{
  "name": "Movie",
  "uid": "12345678",
  ...
}
```

This `uid` is the `:uid` identifier used in all `indexes/:uid` routes.

Now that the server knows about our brand new index, we can send it data.
We provide you a dataset, it is available in the `datasets/` [directory](https://github.com/meilisearch/MeiliSearch/tree/master/datasets).

```bash
curl -i -X POST 'http://127.0.0.1:7700/indexes/12345678/documents' \
  --data @datasets/movies/movies.json
```

### Search for Documents

The search engine is now aware of our documents and can serve those via our HTTP server.

```bash
curl 'http://127.0.0.1:7700/indexes/12345678/search?q=botman'
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
