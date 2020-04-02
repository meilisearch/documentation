# Getting Started

This quick tour will help you get started with MeiliSearch in only a few steps.

## Download and launch

First of all, let's run MeiliSearch.

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

[Environment variables and flags](/guides/advanced_guides/installation.md#environment-variables-and-flags) can be set before and on launch. Amongst all the flags, you can use the **master key** and the **port** flags.

### Communicate with MeiliSearch

Now that your MeiliSearch server is up and running, you should be able to communicate with it.

Communication to the server is done through a [RESTful API](/references/README.md) or one of our [SDKs](/resources/sdks.md).

## Create your Index

In MeiliSearch, the information is subdivided into indexes. Each [index](/guides/main_concepts/indexes.md) contains a data structure and associated documents.<br>
Indexes can be comparable to SQL tables. Since MeiliSearch is <clientGlossary word="schemaless"/>, there's no need to define any attributes or data type when creating a table.

In order to be able to store your documents in an index, it is required you create one first.

:::: tabs

::: tab cURL

[API references](/references/indexes.md)

```bash
$ curl \
  -X POST 'http://127.0.0.1:7700/indexes' \
  --data '{
  "uid" : "movies"
}'
```

:::

::: tab JS

```bash
$ npm install meilisearch
# or
$ yarn add meilisearch
```

```js
const MeiliSearch = require("meilisearch");

var client = new MeiliSearch({ host: "http://127.0.0.1:7700" });
const index = client
  .createIndex({ uid: "movies" })
  .then((res) => console.log(res));
```

[About this package](https://github.com/meilisearch/meilisearch-js/)
:::

::: tab Ruby

```bash
$ gem install meilisearch
```

```ruby
require 'meilisearch'

client = MeiliSearch::Client.new('http://127.0.0.1:7700')
index = client.create_index('movies')
```

[About this package](https://github.com/meilisearch/meilisearch-ruby/)
:::

::: tab PHP

```bash
$ composer require meilisearch/meilisearch-php
```

```php
<?php

require_once __DIR__ . '/vendor/autoload.php';

use MeiliSearch\Client;

$client = new Client('http://127.0.0.1:7700');
$index = $client->createIndex('movies');
```

[About this package](https://github.com/meilisearch/meilisearch-php/)
:::

::: tab Python

```bash
$ pip3 install meilisearch
```

```python
import meilisearch

client = meilisearch.Client('http://127.0.0.1:7700')
index = client.create_index(uid='movies')
```

[About this package](https://github.com/meilisearch/meilisearch-python/)
:::

::: tab Go

```bash
$ go get github.com/meilisearch/meilisearch-go
```

```go
package main

import (
    "github.com/meilisearch/meilisearch-go"
)

func main() {
    var client = meilisearch.NewClient(meilisearch.Config{
      Host: "http://127.0.0.1:7700",
    })

    client.Indexes().Create(meilisearch.CreateIndexRequest{
        UID: "movies",
    })
}
```

[About this package](https://github.com/meilisearch/meilisearch-go/)
:::

::::

## Add Documents

Once the index has been created, the next step is to fill it with [documents](/guides/main_concepts/documents.md). These documents will be used and returned when search queries will be performed on MeiliSearch.

Documents are represented in `JSON format`.

To be processed, all documents must share one common <clientGlossary word="field" /> which will serve as [primary key](/guides/main_concepts/documents.md#primary-key) for the document. Values in that field must always be **unique**.

There are [several ways to let MeiliSearch know what the primary key](/guides/main_concepts/documents.md#primary-key) is. The easiest one is to have an <clientGlossary word="attribute" /> that contains the string `id` in a case-insensitive manner.

Below is an example to showcase how to add documents using the following test dataset: [movies.json](https://github.com/meilisearch/MeiliSearch/blob/master/datasets/movies/movies.json).

:::: tabs
::: tab cURL
[API references](/references/documents.md)

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/documents' \
  --data @movies.json
```

:::

::: tab JS

```js
const movies = require("./movies.json");
index.addDocuments(movies).then((res) => console.log(res));
```

[About this package](https://github.com/meilisearch/meilisearch-js/)
:::

::: tab Ruby

```ruby
require 'json'

movies_json = File.read('movies.json')
movies = JSON.parse(movies_json)
index.add_documents(movies)
```

[About this package](https://github.com/meilisearch/meilisearch-ruby/)
:::

::: tab PHP

```php
$movies_json = file_get_contents('movies.json');
$movies = json_decode($movies_json);
$index->addDocuments($movies);
```

[About this package](https://github.com/meilisearch/meilisearch-php/)
:::

::: tab Python

```python
import json

json_file = open('movies.json')
movies = json.load(json_file)
index.add_documents(movies)
```

[About this package](https://github.com/meilisearch/meilisearch-python/)
:::

::: tab Go

```go
import (
    "encoding/json"
    "io/ioutil"
)
```

```go
moviesJSON, _ := os.Open("movies.json")
defer moviesJSON.Close()

byteValue, _ := ioutil.ReadAll(moviesJSON)
var movies []map[string]interface{}
json.Unmarshal(byteValue, &movies)

updateRes, _ := client.Documents("movies").AddOrUpdate(movies)
fmt.Println(updateRes.UpdateID)
```

[About this package](https://github.com/meilisearch/meilisearch-go/)
:::

::::

### Checking updates

Most actions are asynchronous, which allows you to stack them. All of the actions are executed in the order in which they were sent.

The document addition process returns a JSON object containing only an `updateId` attribute.

This kind of **successful response** indicates that the operation has been taken into account, but may not have been executed yet.

You can check the status of the operation via the `updateId` and the [get update status route](/references/updates.md).

Checking the update status is not a mandatory step to search through your documents but could prove useful in tracing the origin of errors or unexpected behaviors.

## Search

Now that your documents have been ingested into MeiliSearch, you are able to [search them](/guides/main_concepts/search.md).

MeiliSearch [offers many parameters](/guides/advanced_guides/search_parameters.md) that you can play with to refine your search or change the format of the returned documents. However, by default, the search is already relevant.

The search engine is now aware of your documents and can serve those via an HTTP server.

:::: tabs
::: tab cURL
[API references](/references/search.md)

```bash
$ curl \
  -X GET 'http://127.0.0.1:7700/indexes/movies/search?q=botman'
```

:::

::: tab JS

```js
index.search("botman").then((res) => console.log(res));
```

[About this package](https://github.com/meilisearch/meilisearch-js/)
:::

::: tab Ruby

```ruby
index.search('botman')
```

[About this package](https://github.com/meilisearch/meilisearch-ruby/)
:::

::: tab PHP

```php
$index->search('botman');
```

[About this package](https://github.com/meilisearch/meilisearch-php/)
:::

::: tab Python

```python
index.search('botman')
```

[About this package](https://github.com/meilisearch/meilisearch-python/)
:::

::: tab Go

```go
searchRes, _ := client.Search("movies").Search(meilisearch.SearchRequest{
    Query: "botman",
    Limit: 20,
})
fmt.Println(searchRes.Hits)
```

[About this package](https://github.com/meilisearch/meilisearch-go/)
:::

::::

MeiliSearch **response**:

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
    ...
  ],
  "offset": 0,
  "limit": 20,
  "processingTimeMs": 2,
  "query": "botman"
}
```

### Web Interface

We also deliver an an out-of-the-box [web interface](/guides/advanced_guides/web_interface.md) in which you can test MeiliSearch interactively.

To do so, open your web browser and enter MeiliSearch address (in our case: `http://127.0.0.1:7700`) into the browser address bar.<br>
This will lead you to a web page with a search bar that will allow you to search in the selected index.

![movies demo gif](/movies-web-demo.gif)

::: warning
Since the production environment requires an API-key for searching, the web interface is only available in [development mode](/guides/advanced_guides/installation.md#environments).
:::
