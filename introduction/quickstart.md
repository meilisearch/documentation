## Quick Start

You can deploy your own instant, relevant and typo-tolerant MeiliDB search engine by yourself too.
Something similar to the demo above can be achieve by following these little three steps first.
You will need to create your own web front display to make it pretty though.

### Deploy the Server

You can deploy the server on your own machine, it will listen to HTTP requests on the 8080 port by default.

```bash
rustup override set nightly
cargo run --release
```

### Create an Index and Upload Some Documents

MeiliDB can serve multiple indexes, with different kinds of documents,
therefore, it is required to create the index before sending documents to it.

```bash
curl -i -X POST 'http://127.0.0.1:8080/indexes/movies'
```

Now that the server knows about our brand new index, we can send it data.
We provided you a little dataset, it is available in the `datasets/` directory.

```bash
curl -i -X POST 'http://127.0.0.1:8080/indexes/movies/documents' \
  --header 'content-type: application/json' \
  --data @datasets/movies/movies.json
```

### Search for Documents

The search engine is now aware of our documents and can serve those via our HTTP server again.
The [`jq` command line tool](https://stedolan.github.io/jq/) can greatly help you read the server responses.

```bash
curl 'http://127.0.0.1:8080/indexes/movies/search?q=botman'
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