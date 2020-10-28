# Getting Started

This quick tour will help you get started with MeiliSearch in only a few steps.

## Download and launch

First of all, let's download and run MeiliSearch.

```bash
$ curl -L https://install.meilisearch.com | sh
$ ./meilisearch
Server is listening on: http://127.0.0.1:7700
```

You can download & run MeiliSearch [in many different ways (i.e: docker, apt, brew, ...)](/guides/advanced_guides/installation.md).

[Environment variables and options](/guides/advanced_guides/configuration.md) can be set before and on launch to configure MeiliSearch. Amongst all the options, you can use the **master key** and the **port** options.

### Communicate with MeiliSearch

Now that your MeiliSearch server is up and running, you should be able to communicate with it.

Communication to the server is done through a [RESTful API](/references/README.md) or one of our [SDKs](/resources/sdks.md).

## Add Documents

To add documents to MeiliSearch you need to provide an [index](/guides/main_concepts/indexes.md) name and [documents](/guides/main_concepts/documents.md). The documents will be stored inside the given `index`. The index is created the first time you add documents to it.

The documents will be used and returned when search queries will be performed on MeiliSearch.

Documents are represented in `JSON format`.

To be processed, all documents must share one common <clientGlossary word="field" /> which will serve as [primary key](/guides/main_concepts/documents.md#primary-key) for the document. Values in that field must always be **unique**.

There are [several ways to let MeiliSearch know what the primary key](/guides/main_concepts/documents.md#primary-key) is. The easiest one is to have an <clientGlossary word="attribute" /> that contains the string `id` in a case-insensitive manner.

Below is an example to showcase how to add documents to an index called `movies` using the following test dataset: [movies.json](https://github.com/meilisearch/MeiliSearch/blob/master/datasets/movies/movies.json).

<CodeSamples id="getting_started_add_documents_md" />

[API references](/references/documents.md)

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

<CodeSamples id="getting_started_search_md" />

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

[API references](/references/search.md)

### Web Interface

We also deliver an out-of-the-box [web interface](/guides/advanced_guides/web_interface.md) in which you can test MeiliSearch interactively.

To do so, open your web browser and enter MeiliSearch address (in our case: `http://127.0.0.1:7700`) into the browser address bar.
This will lead you to a web page with a search bar that will allow you to search in the selected index.

<br>
<br>
<MovieGif />
