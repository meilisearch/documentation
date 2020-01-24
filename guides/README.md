# Foreword

Welcome to the beta version of the MeiliSearch API documentation 🐣

This is our first draft guide in the limbo of the HTTP MeiliSearch routes.
You can navigate into the documentation using the sidebar or by using the search bar above.

If you spot any typo or any error in the documentation like a miss-documented response body for example,
please contact us [by email](mailto:bonjour@meilisearch.com) or using the little chat box at the bottom right of this page.

Thank you for your interest and have fun with your HTTP client 🌍
## Getting Started

MeiliSearch has been developed to provide an easily integrated search solution. Each step of the implementation process has been designed to be as simple as possible. This guide will help you get started with MeiliSearch.

Contents :
- Launching an instance of MeiliSearch
- Create your index and add documents
- Integrate search
- Doing Research

First of all, you must have access to a running instance of MeiliSearch.

### Download and launch
There are [several download possibilities](/guides/advanced_guides/binary.md#download-and-launch).

Once it is downloaded, we need to start our instance of MeiliSearch. The port, as well as the master key, can be defined at launch. There are other [options available](/guides/advanced_guides/binary.md#usage).

One way of installing MeiliSearch is curl :
```bash
$ curl -L https://install.meilisearch.com | sh
$ ./meilisearch --http-addr 127.0.0.1:7700 --api-key 'MasterKey'
Server is listening on: http://127.0.0.1:7700
```

### Communicate with MeiliSearch

Now that our meilisearch server is up and running, we will be able to communicate with it.

This is done through a [RESTFull API](/references/readme.md) or one of our [SDK's](/resources/sdks.md).

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


```
[{
        "id": 287947,
        "title": "Shazam",
        "poster": "https://image.tmdb.org/t/p/w1280/xnopI5Xtky18MPhK40cZAGAOVeV.jpg",
        "overview": "A boy is given the ability to become an adult superhero in times of need with a single magic word.",
        "release_date": 1546473600
      },{
        "id": "522681",
        "title": "Escape Room",
        "poster": "https://image.tmdb.org/t/p/w1280/8yZAx7tlKRZIg7pJfaPhl00yHIQ.jpg",
        "overview": "Six strangers find themselves in circumstances beyond their control, and must use their wits to survive.",
        "release_date": 1546473600
      },
      ...
]
```


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


### Doing Searches

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




<!-- recognize that the guy is on windows or mac or linux -->
