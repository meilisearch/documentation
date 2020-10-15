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

## Create your Index

In MeiliSearch, the information is subdivided into indexes. Each [index](/guides/main_concepts/indexes.md) contains a data structure and associated documents.
Indexes can be comparable to SQL tables. Since MeiliSearch is <clientGlossary word="schemaless"/>, there's no need to define any attributes or data type when creating a table.

In order to be able to store your documents in an index, it is required you create one first.

<code-samples id="getting_started_create_index_md" />

[API references](/references/indexes.md)

## Add Documents

Once the index has been created, the next step is to fill it with [documents](/guides/main_concepts/documents.md). These documents will be used and returned when search queries will be performed on MeiliSearch.

Documents are represented in `JSON format`.

To be processed, all documents must share one common <clientGlossary word="field" /> which will serve as [primary key](/guides/main_concepts/documents.md#primary-key) for the document. Values in that field must always be **unique**.

There are [several ways to let MeiliSearch know what the primary key](/guides/main_concepts/documents.md#primary-key) is. The easiest one is to have an <clientGlossary word="attribute" /> that contains the string `id` in a case-insensitive manner.

Below is an example to showcase how to add documents using the following test dataset: [movies.json](https://github.com/meilisearch/MeiliSearch/blob/master/datasets/movies/movies.json).

<code-samples id="getting_started_add_documents_md" />

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

<code-samples id="getting_started_search_md" />

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

![movies demo gif](/movies-web-demo.gif)


### Integrations

The only step missing is adding the searchbar to your own application. The easiest way of achieving this is to use [instant-meilisearch](https://github.com/meilisearch/instant-meilisearch): A developer tool that generates all the search components needed to start searching.

The first step is to create a `html` file wherever you want. Next, using one of the browser builds proposed bellow, you need to copy/paste the whole code inside the `html` file you just created.
Now open the `html` file in your browser (by clicking on it and select a browser if it's not done automatically) and you should have the following user interacer:




:::: tabs

::: tab VueJs

Browser build to create a vue environment.
```html
  <!DOCTYPE html>
  <html>
      <body>
          <div id="app">
              <h1 style="text-align: center;">Search Movies</h1>
                <ais-instant-search :search-client="searchClient" index-name="movies">
                  <ais-configure
                    :hits-per-page.camel="200"
                  />
                  <ais-search-box placeholder="Search here…" class="searchbox"></ais-search-box>
                  <ais-hits>
                    <div slot="item" slot-scope="{ item }">
                          <h2>{{ item.title }}</h2>
                    </div>
                  </ais-hits>
                </ais-instant-search>
          </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/vue"></script>
      <script src="https://cdn.jsdelivr.net/npm/vue-instantsearch@3.2.0/dist/vue-instantsearch.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/dist/instant-meilisearch.umd.min.js"></script>
      <script>
          Vue.use(VueInstantSearch)
          var app = new Vue({
              el: '#app',
              data: {
                  searchClient: instantMeiliSearch('http://127.0.0.1:7700')
              }
          })
      </script>
  </html>
```

To install `instant-meilisearch` using `npm` please visite [meilisearch-vue](https://github.com/meilisearch/meilisearch-vue)

:::

::: tab React

```html
<!DOCTYPE html>
<html>
  <body>
      <div id="app"></div>
  </body>
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
  <script src="https://cdn.jsdelivr.net/npm/react-instantsearch-dom@6.7.0/dist/umd/ReactInstantSearchDOM.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/dist/instant-meilisearch.umd.min.js"></script>
  <script>
    'use strict';
      const { InstantSearch, SearchBox, Hits, Highlight }  = ReactInstantSearchDOM;

      const searchClient = instantMeiliSearch(
        "http://localhost:7700"
      );

      const App = () => (
        React.createElement(InstantSearch, {
          indexName: "movies",
          searchClient: searchClient
        }, [ React.createElement(SearchBox, { key: 1 }), React.createElement(Hits, { hitComponent: Hit, key: 2 })]
        )
      );
      function Hit(props) {
          return React.createElement(Highlight, {
            attribute: "title",
            hit: props.hit
          })
      }
    const domContainer = document.querySelector('#app');
    ReactDOM.render(React.createElement(App), domContainer);
  </script>
</html>
```

:::

::: tab Javascript

- The basic divs structure for the search bar and the results box
- Adding the CDN's
- Adding the configuration to link your DOM with instant-meilisearch


```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <div>
      <div id="searchbox" focus></div>
      <div id="hits"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/dist/instant-meilisearch.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4"></script>
    <script>
        const search = instantsearch({
            indexName: "movies",
            searchClient: instantMeiliSearch(
                "http://localhost:7700",
                "masterKey",
            )
            });

            search.addWidgets([
            instantsearch.widgets.searchBox({
                container: "#searchbox"
            }),
            instantsearch.widgets.hits({
                container: "#hits",
                templates: {
                item: `
                    <div>
                    <div class="hit-name">
                        {{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}
                    </div>
                    </div>
                `
                }
            })
            ]);

            search.start();
    </script>
  </body>
</html>
```
:::



::::
