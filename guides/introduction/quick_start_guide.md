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
$ docker run -it --rm -p 7700:7700 -v $(pwd)/data.ms:/data.ms getmeili/meilisearch
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

::: tab Heroku

You can deploy the latest stable build of MeiliSearch straight on Heroku.

<p align="center">
  <a href="https://heroku.com/deploy?template=https://github.com/meilisearch/MeiliSearch">
    <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
  </a>
</p>

Since all the source code from the GitHub repository will be compiled, the deployment process can take up to 20 minutes to complete.

::: warning
The [Heroku filesystem is ephemeral](https://help.heroku.com/K1PPS2WM/why-are-my-file-uploads-missing-deleted), which means data loss may occur on restart. **The Heroku deployment is useful for testing purposes; however, it won't meet the requirements for production deployments.**
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

[Environment variables and flags](/guides/advanced_guides/installation.md#environment-variables-and-flags) can be set before and on launch. Among other things, you can use them to add the **master key** or set the **port**.

### Communicate with MeiliSearch

Now that your MeiliSearch server is up and running, you should be able to communicate with it.

Communication to the server is done through a [RESTFul API](/references/README.md) or one of our [SDKs](/resources/sdks.md).

## Create your Index

In MeiliSearch, the information is subdivided into indexes. Each [index](/guides/main_concepts/indexes.md) contains a data structure and the associated documents.
Indexes can be imagined as SQL tables. Since MeiliSearch is <ClientOnly><glossary word="schemaless"/></ClientOnly>, there's no need to define any attributes or data type when creating a table.
In order to be able to store your documents in an index, you have to create one first.

:::: tabs

::: tab cURL

[API references](/references/indexes.md)
```bash
$ curl \
  -X POST 'http://localhost:7700/indexes' \
  --data '{
  "uid" : "movies"
}'
```
:::

::: tab JS

```js
meili.createIndex({
    uid: "movies"
})
```
:::

::: tab Ruby

```ruby
client.create_index(uid: 'movies')
```
:::

::: tab PHP

```php
$client->createIndex('movies');
```
:::

::: tab Python

```python
client.create_index(uid="movies")
```
:::

::::


## Add Documents

Once the index has been created, the next step is to fill it with [documents](/guides/main_concepts/documents.md). These documents will be used and returned when search queries will be performed on MeiliSearch.

Documents are sent to MeiliSearch in JSON format.

To be processed by MeiliSearch, all documents must share one common <ClientOnly><glossary word="field" /></ClientOnly> which will serve as [primary key](/guides/main_concepts/documents.md#primary-key) for the document. Values in that field must always **unique**.

There are [several ways to let MeiliSearch know what the primary key](/guides/main_concepts/documents.md#primary-key) is. The easiest one is to have an <ClientOnly><glossary word="attribute" /></ClientOnly> that contains the string `id` case-insensitively.


Let's use an example [movies.json dataset](https://github.com/meilisearch/MeiliSearch/blob/master/datasets/movies/movies.json) to showcase how to add documents.


:::: tabs

::: tab Curl

[API references](/references/documents.md)
```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/documents' \
  --data @movies.json
```
:::

::: tab JS

```js
const movies = require('./movies.json')
meili
    .Index("movies")
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
$index->addOrReplaceDocuments($movies);
```
:::

::: tab Python

```python
index = self.client.get_index(uid="movies")
json_file = open('movies.json')
data = json.load(json_file)
response = index.add_documents(data)
```
:::

::::

### Checking updates

Most actions are asynchronous, which allows you to stack actions. All of the actions are executed in the order in which they were specified.

You can [track the state of each action](/guides/advanced_guides/asynchronous_updates.md).


## Searches

Now that your documents have been added to MeiliSearch, you are able to [search](/guides/main_concepts/search.md) in it.

MeiliSearch [offers many parameters](/guides/advanced_guides/search_parameters.md) that you can play with to refine your search or change the format of the returned documents. However, by default, the search is already relevant.

The search engine is now aware of your documents and can serve those via a HTTP server.

```bash
$ curl 'http://127.0.0.1:7700/indexes/12345678/search?q=botman'
```

MeiliSearch also provides an out-of-the-box [web interface](/guides/advanced_guides/web_interface.md) on which you can try the search. Go to your MeiliSearch address using a browser. In that case, it would be: `http://127.0.0.1:7700`

:::: tabs

::: tab Curl

[API references](/references/search.md)
```bash
$ curl \
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
$index->search('botman');
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

MeiliSearch **response** :
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
