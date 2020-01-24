# Foreword

This guide is made to give you a fast overview of MeiliSearch. Every bit of information is linked to its advanced documentation.

If you want an even quicker overview we suggest [you look into our quickstart](/tutorials).
## Getting Started

MeiliSearch has been developed to provide an easily integrated search solution. Each step of the implementation process has been designed to be **as simple as possible**. This guide will help you get started with MeiliSearch.

Contents :
- [Launching an instance of MeiliSearch](/guides/#download-and-launch)
- [Create your index](/guides/#create-your-index)
- [Add documents](/guides/#add-documents)
- [Search !](/guides/#searches)

### Download and launch

First of all, you must have access to a running instance of MeiliSearch.

There are [several download possibilities](/guides/advanced_guides/binary.md#download-and-launch).

:::: tabs

::: tab cURL
Download the **latest stable release** of MeiliSearch with **curl**.

Launch the MeiliSearch package to start MeiliSearch's server.
```bash
$ curl -L https://install.meilisearch.com | sh
$ ./meilisearch
Server is listening on: http://127.0.0.1:7700
```
:::

::: tab Brew
Download the **latest stable release** of MeiliSearch with **Homebrew**.

Launch the MeiliSearch package to start MeiliSearch's server.
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

Launch the MeiliSearch package to start MeiliSearch's server.
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
git clone https://github.com/meilisearch/MeiliSearch
cd MeiliSearch
```

Inside the folder, compile MeiliSearch.

```bash
# Production version
cargo build --release

# Debug version
cargo build
```

Compiling in release mode takes more time than in debug mode but the binary process time will be significantly faster. You **must** run a release binary when using MeiliSearch in production.

You can find the compiled binary in `target/debug` or `target/release`.

```bash
# Excuting the server binary
$ ./target/release/meilisearch
```

:::

::::

[Environnements variables and flags](/guides/advanced_guides/binary.md#environment-variables-and-flags) can be set before and on launch. With them you can among other things  add the **master key** or set the **port**.

### Communicate with MeiliSearch

Now that our meilisearch server is up and running, we will be able to communicate with it.

This is done through a [RESTFul API](/references/readme.md) or one of our [SDK's](/resources/sdks.md).

For this getting started, communication will be done with the RESTful API using cURL.

### Create your Index

In MeiliSearch, the information is subdivided into [indexes](/guides/main_concepts/indexes.md). Each index contains a data structure and the associated documents.
The indexes can be imagined as SQL tables. But you wont need to define the table, [meiliSearch does that for your](/guides/main_concepts/indexes.md#inferred-schema).

In order to be able to store our documents in an index, we [have to create one first](/guides/main_concepts/indexes.md).

:::: tabs

::: tab Curl

[API references](/references/indexes.md)
```bash
curl \
  -X POST 'http://localhost:7700/indexes' \
  --data '{
  "name": "Movies",
  "uid" : "movies_uid"
}'
```
:::

::: tab JS

```js
meili.createIndex({
    name: "Movies",
    uid: "movies_uid"
})
```
:::

::: tab Ruby

```ruby
client.create_index(name: 'Movies', uid: 'movies_uid')
```
:::

::: tab PHP

```php
$client->createIndex('Movies', 'movies_uid');
```
:::

::: tab Python

```python
client.create_index(name="movies", uid="movies_uid")
```
:::
::::


### Add Documents

Once the index has been created it need to be filled with [documents](/guides/main_concepts/documents.md). It is these [documents](/guides/main_concepts/documents.md) that will be used and returned when [searches](/guides/main_concepts/search.md) are made on MeiliSearch.

[Documents](/guides/main_concepts/documents.md) are sent to MeiliSearch in JSON format.

The documents must have at least one field in common. This field contains the identifier of the document.

Lets use an example [movies.json dataset](https://github.com/meilisearch/MeiliSearch/blob/master/datasets/movies/movies.json) to showcase how to add documents.


:::: tabs

::: tab Curl

[API references](/references/documents.md)
```bash
curl \
  -X POST 'http://localhost:7700/indexes/movies_uid/documents' \
  --data @movies.json
```
:::

::: tab JS

```js
const movies = require('./movies.json')
meili
    .Index("movies_uid")
    .addDocuments(movies)
```
:::

::: tab Ruby

```ruby
index.add_documents(movies)
```
:::

::: tab PHP

```php
$index->addOrReplaceDocuments($movies)
```
:::

::: tab Python

```python

index = self.client.get_index(uid="movies_uid")
json_file = open('movies.json')
data = json.load(json_file)
response = index.add_documents(data)

```
:::
::::

### Checking updates

In MeiliSearch most actions are asynchronous. This lets you stack actions. They will be executed in the order in which they were made.

You can [track the state of each action](/guides/advanced_guides/asynchronous_updates.md).


### Searches

Now that our documents have been added to MeiliSearch we are be able to [search](/guides/main_concepts/search.md) in it.

Meilisearch [offers many parameters](/guides/advanced_guides/search_parameters.md) that you can play with to refine your search or change the format of the returned documents. However, by default the search is already relevant.

The search engine is now aware of our documents and can serve those via our HTTP server.

```bash
curl 'http://127.0.0.1:7700/indexes/12345678/search?q=botman'
```

:::: tabs

::: tab Curl

[API references](/references/search.md)
```bash
curl \
  -X POST 'http://127.0.0.1:7700/indexes/12345678/search?q=botman'
```
:::

::: tab JS

```js
meili
  .Index('movies')
  .search({
    q: 'batman',
  })
  .then((response) => {
    console.log(response)
  })
```
:::

::: tab Ruby

```ruby
index.search('botman')
```
:::

::: tab PHP

```php
$index->search('botman')
```
:::

::: tab Python

```python
index.search({
            'q': 'How to Train Your Dragon'
        })

```
:::
::::

Meilisearch **response** :
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


### Afterword


In MeiliSearch we have three concepts on which we build our search engine. If you did not go to those pages, they give an essential insight.
- [Indexes](/guides/main_concepts/indexes.md)
- [Documents](/guides/main_concepts/documents.md)
- [Search](/guides/main_concepts/search.md)

Finally, you can find the API references here :
- [API References](/references/README.md)

And the SDK's links here :
- [Ressources](/resources/sdks.md)

Tutorials and Cookbooks are being made. They will be available soon.


