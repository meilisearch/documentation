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

To add documents to MeiliSearch you must provide:

- [Documents](/guides/main_concepts/documents.md) in the form of `JSON objects`.
- An [index](/guides/main_concepts/indexes.md) name (_uid_). An index is where the documents are stored.

> _If the index does not exist, MeiliSearch creates it when you first add documents._

To be processed, all documents must share one common <clientGlossary word="field" /> which will serve as [<clientGlossary word="primary key" />](/guides/main_concepts/documents.md#primary-key) for the document. Values in that field must always be **unique**.

```json
{
  "id": "123",
  "title": "Superman"
}
```

> The primary key is `id`, the document's unique identifier is `123`.

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

[API references](/references/updates.md)

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

## Integrate to your website

The only step missing is adding the searchbar to your own application. The easiest way of achieving this is to use [instant-meilisearch](https://github.com/meilisearch/instant-meilisearch): A developer tool that generates all the search components needed to start searching.

[Instant-meilisearch](https://github.com/meilisearch/instant-meilisearch) works on common front-end environments as: [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [React](https://github.com/meilisearch/meilisearch-react) and [VueJs](https://github.com/meilisearch/meilisearch-vue).

#### Lets Try:

- Create a html file for example `index.html`
- Open it in a text editor (notepad, sublime text, vsc or other)
- Copy paste any of the code examples bellow and save the file
- Open `index.html` in your browser (double click on it in your folder)

_We uses browser builds for ease of integration. It is possible to add them with `npm` or `yarn`. Please refer to [instant-meilisearch](https://github.com/meilisearch/instant-meilisearch) for documentation._

:::: tabs

::: tab Javascript

The following code samples uses plain [javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

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

The code above is divided in multiple parts:

- The body of the page which adds both `searchbox` and `hits` divs.
  This is where `instant-meilisearch` adds a searchbar and search results.
- `<scripts src="..">` tags are [CDN](https://en.wikipedia.org/wiki/Content_delivery_network)'s that imports libraries needed to run `instant-meilisearch`.
- The Javascript part where you can customize how `instant-meilisearch` works.

To use `instant-meilisearch` using `npm` or `yarn` please visit [instant-meilisearch](https://github.com/meilisearch/instant-meilisearch).

:::

::: tab VueJs

The following example uses [VueJS](https://vuejs.org/) framework.

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="app">
      <ais-instant-search :search-client="searchClient" index-name="movies" >
        <ais-search-box placeholder="Search here…" class="searchbox"></ais-search-box>
        <ais-hits>
          <div slot="item" slot-scope="{ item }">
            <ais-highlight :hit="item" attribute="title" />
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

The code above is divided in multiple parts:

- The body of the page which which adds the right components using `VueJs`.
  This is where `instant-meilisearch` adds a searchbar and search results.
- `<scripts src="..">` tags are [CDN](https://en.wikipedia.org/wiki/Content_delivery_network)'s that imports libraries needed to run `instant-meilisearch`.
- The `VueJs` part where you customize your `instant-meilisearch`.

To use `instant-meilisearch` in `vueJs` using `npm` or `yarn` please visit [meilisearch-vue](https://github.com/meilisearch/meilisearch-vue).

:::

::: tab React

The following example uses [React](https://reactjs.org/) framework.

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

The code above is divided in multiple parts:

- The body of the page, which is the entry point for you `react` components.
- `<scripts src="..">` tags are [CDN](https://en.wikipedia.org/wiki/Content_delivery_network)'s that imports libraries needed to run `instant-meilisearch` in [React](https://reactjs.org/).
- The `React` part where you customize your `instant-meilisearch`.

To use `instant-meilisearch` in `React` using `npm` or `yarn` please visit [meilisearch-react](https://github.com/meilisearch/meilisearch-react).

:::

::::
