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

## Integrate to Your Project

The only step missing now is adding the search bar to your project. The easiest way of achieving this is to use [instant-meilisearch](https://github.com/meilisearch/instant-meilisearch): a developer tool that generates all the search components needed to start searching.

[Instant MeiliSearch](https://github.com/meilisearch/instant-meilisearch) works on common front-end environments, such as [JavaScript](https://github.com/meilisearch/meilisearch-js), [React](https://github.com/meilisearch/meilisearch-react), and [Vue.js](https://github.com/meilisearch/meilisearch-vue).

#### Let's Try!

- Create an `html` file, for example, `index.html`.
- Open it in a text editor (e.g. Notepad, Sublime Text, Visual Studio Code).
- Copy-paste any of the code examples below and save the file.
- Open `index.html` in your browser (double click on it in your folder).

_We use browser builds for ease of integration. It is possible to do this with `npm` or `yarn`. Please refer to [instant-meilisearch](https://github.com/meilisearch/instant-meilisearch) for documentation._

:::: tabs

::: tab JavaScript

The following code sample uses plain [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/templates/basic_search.css" />
  </head>
  <body>
    <div class="wrapper">
      <div id="searchbox" focus></div>
      <div id="hits"></div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/dist/instant-meilisearch.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4"></script>
    <script>
        const search = instantsearch({
            indexName: "movies",
            searchClient: instantMeiliSearch(
                "http://localhost:7700"
            )
            });

            search.addWidgets([
              instantsearch.widgets.searchBox({
                  container: "#searchbox"
              }),
              instantsearch.widgets.configure({ hitsPerPage: 8 }),
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

The code above comes in multiple parts:

- The first four lines of the `<body>` add both `searchbox` and `hits` elements. Ultimately, `instant-meilisearch` adds the search bar and search results in these elements.
- `<script src="..">` tags are [CDNs](https://en.wikipedia.org/wiki/Content_delivery_network) that import libraries needed to run `instant-meilisearch`.
- The JavaScript part is where you customize `instant-meilisearch`.

To use `instant-meilisearch` using `npm` or `yarn` please visit [instant-meilisearch](https://github.com/meilisearch/instant-meilisearch).

:::

::: tab Vue.js

The following code sample uses [Vue.js](https://vuejs.org/) framework.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/templates/basic_search.css" />
  </head>
  <body>
    <div id="app" class="wrapper">
      <ais-instant-search :search-client="searchClient" index-name="movies" >
        <ais-configure :hits-per-page.camel="10" />
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

The code above comes in multiple parts:

- In `Vue.js` customization happens directly in the `<body>` tag. To make `instant-meilisearch` work with `Vue.js` some components must be added. In the above example, `ais-instant-search`, `ais-search-box` and `ais-hits` are mandatory components to generate the`instant-meilisearch` interface.
- `<script src="..">` tags are [CDNs](https://en.wikipedia.org/wiki/Content_delivery_network) that import libraries needed to run `instant-meilisearch` with [Vue.js](https://vuejs.org).
- The `<script>` containing JavaScript initialize `Vue.js`. The code creates a new `Vue` instance that is mandatory to link `Vue.js` with the `DOM`.

To use `instant-meilisearch` in `Vue.js` using `npm` or `yarn` please visit [meilisearch-vue](https://github.com/meilisearch/meilisearch-vue).

:::

::: tab React

The following code sample uses [React](https://reactjs.org/) framework.

```html
<!DOCTYPE html>
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/templates/basic_search.css" />
</head>
<html>
  <body>
      <div id="app" class="wrapper"></div>
  </body>
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
  <script src="https://cdn.jsdelivr.net/npm/react-instantsearch-dom@6.7.0/dist/umd/ReactInstantSearchDOM.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/dist/instant-meilisearch.umd.min.js"></script>
  <script>
    const { InstantSearch, SearchBox, Hits, Highlight, Configure }  = ReactInstantSearchDOM;
    const searchClient = instantMeiliSearch(
      "http://localhost:7700"
    );

    const App = () => (
      React.createElement(InstantSearch, {
        indexName: "movies",
        searchClient: searchClient
      }, [
        React.createElement(SearchBox, { key: 1 }),
        React.createElement(Hits, { hitComponent: Hit, key: 2 }),
        React.createElement(Configure, { hitsPerPage: 10 })]
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

The code above comes in multiple parts:

- The `<body>` of the page is the entry point for React. `instant-meilisearch` adds the search bar and search results here by manipulating the DOM.
- `<script src="..">` tags are [CDNs](https://en.wikipedia.org/wiki/Content_delivery_network) that import libraries needed to run `instant-meilisearch` in [React](https://reactjs.org/).
- The `<script>` containing JavaScript initalize React and renders the code that will be rendered in the body. Customization of `instant-meilisearch` happens here as well.

To use `instant-meilisearch` in `React` using `npm` or `yarn` please visit [meilisearch-react](https://github.com/meilisearch/meilisearch-react).

:::

::::
