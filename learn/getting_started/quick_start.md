# Quick start

In this quick start we will walk you through setting up Meilisearch, adding documents, performing your first search, using the search preview, and adding a search bar.

All that is required is a [command line](https://www.learnenough.com/command-line-tutorial#sec-running_a_terminal) for installation, and some way to interact with Meilisearch afterwards (e.g. [cURL](https://curl.se) or one of our [SDKs](/learn/what_is_meilisearch/sdks.md)).

Let's get started!

## Setup and installation

We'll start with downloading and installing Meilisearch. You have the option to install Meilisearch locally or deploy it over a cloud service.

### Local installation

:::: tabs

::: tab cURL
Download the **latest stable release** of Meilisearch with **cURL**.

Launch Meilisearch to start the server.

```bash
# Install Meilisearch
curl -L https://install.meilisearch.com | sh

# Launch Meilisearch
./meilisearch
```

:::

::: tab Homebrew
Download the **latest stable release** of Meilisearch with **[Homebrew](https://brew.sh/)**, a package manager for MacOS.

Launch Meilisearch to start the server.

```bash
# Update brew and install Meilisearch
brew update && brew install meilisearch

# Launch Meilisearch
meilisearch
```

:::

::: tab Docker
When using **Docker**, you can run [any available tag](https://hub.docker.com/r/getmeili/meilisearch/tags).

These commands launch the **latest stable release** of Meilisearch.

```bash
# Fetch the latest version of Meilisearch image from DockerHub
docker pull getmeili/meilisearch:v0.27.1

# Launch Meilisearch
docker run -it --rm \
    -p 7700:7700 \
    -v $(pwd)/meili_data:/meili_data \
    getmeili/meilisearch:v0.27.1
```

Data written to a **Docker container is not persistent** and is wiped every time the container is stopped. We recommend using a shared Docker volume between containers and host machines to provide persistent storage.

On macOS and Windows, do not mount volumes from the host to the container—this will make I/O operations between the filesystems very slow. Instead make sure the mounted volumes remain inside the docker vm. If this is not an option, we recommend using the native application or a [cloud-hosted option](#cloud-deploy).

You can learn more about Docker by consulting [its official documentation](https://docs.docker.com/get-docker/).
:::

::: tab APT

Download the **latest stable release** of Meilisearch with **APT**.

Launch Meilisearch to start the server.

```bash
# Add Meilisearch package
sudo echo "deb [trusted=yes] https://apt.fury.io/meilisearch/ /" > /etc/apt/sources.list.d/fury.list

# Update APT and install Meilisearch
sudo apt update && sudo apt install meilisearch-http

# Launch Meilisearch
meilisearch
```

:::

::: tab Source

Meilisearch is written in `Rust`. To compile it, [install the Rust toolchain](https://www.rust-lang.org/tools/install).

If the Rust toolchain is already installed, clone the repository on your local system and change it to your working directory.

```bash
git clone https://github.com/meilisearch/meilisearch
cd meilisearch
```

Choose the release you want to use. You can find the full list [here](https://github.com/meilisearch/meilisearch/releases).

In the cloned repository, run the following command replacing `vX.Y.Z` with the tag you selected:

```bash
git checkout v0.25.2
```

Finally, update the rust toolchain, compile the project, and execute the binary.

```bash
# Update the rust toolchain to the latest version
rustup update

# Compile the project
cargo build --release

# Execute the server binary
./target/release/meilisearch
```

:::

::: tab Windows

To install Meilisearch on Windows, you can:

- use Docker (see "Docker" tab above)
- [download the latest binary](https://github.com/meilisearch/Meilisearch/releases)
- use the installation script (see "cURL" tab above) if you have installed [Cygwin](https://www.cygwin.com/) or equivalent
- compile from source (see "Source" tab above)

To learn more about the Windows command prompt, follow this [introductory guide](https://www.makeuseof.com/tag/a-beginners-guide-to-the-windows-command-line/).

::::

### Cloud deploy

To deploy Meilisearch on a cloud service, follow one of our dedicated guides:

- [AWS](/learn/cookbooks/aws.md)
- [Azure](/learn/cookbooks/azure.md)
- [DigitalOcean](/learn/cookbooks/digitalocean_droplet.md)
- [GCP](/learn/cookbooks/gcp.md)
- [Koyeb](/learn/cookbooks/koyeb.md)
- [Qovery](/learn/cookbooks/qovery.md)

### Running Meilisearch

On successfully running Meilisearch, you should see the following response:

```
888b     d888          d8b 888 d8b                                            888
8888b   d8888          Y8P 888 Y8P                                            888
88888b.d88888              888                                                888
888Y88888P888  .d88b.  888 888 888 .d8888b   .d88b.   8888b.  888d888 .d8888b 88888b.
888 Y888P 888 d8P  Y8b 888 888 888 88K      d8P  Y8b     "88b 888P"  d88P"    888 "88b
888  Y8P  888 88888888 888 888 888 "Y8888b. 88888888 .d888888 888    888      888  888
888   "   888 Y8b.     888 888 888      X88 Y8b.     888  888 888    Y88b.    888  888
888       888  "Y8888  888 888 888  88888P'  "Y8888  "Y888888 888     "Y8888P 888  888

Database path:       "./data.ms"
Server listening on: "127.0.0.1:7700"
```

Congratulations! You're ready to move on to the next step!

## Add documents

For this quick start, we will be using a collection of movies as our dataset. To follow along, first click this link to download the file: <a id="downloadMovie" href="/movies.json" download="movies.json">movies.json</a>. Then, move the downloaded file into your working directory.

::: note
Meilisearch currently only accepts data in JSON, NDJSON, and CSV formats. You can read more about this in our [documents guide](/learn/core_concepts/documents.md#dataset-format).
:::

Open a new terminal window and run the following command:

<CodeSamples id="getting_started_add_documents_md" />

Meilisearch stores data in the form of discrete records, called [documents](/learn/core_concepts/documents.md). Documents are grouped into collections, called [indexes](/learn/core_concepts/indexes.md).

The previous command added documents from `movies.json` to a new index called `movies`. After adding documents, you should receive a response like this:

```json
{
    "uid": 0,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentAddition",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

Most database operations in Meilisearch are [asynchronous](/learn/advanced/asynchronous_operations.md). This means that rather than being processed instantly, **API requests are added to a queue and processed one at a time**.

Use the returned `uid` to [check the status](/reference/api/tasks.md) of your documents:

<CodeSamples id="getting_started_check_task_status" />

If the document addition is successful, the response should look like this:

```json
{
   "uid": 0,
   "indexUid": "movies",
   "status": "succeeded",
   "type": "documentAddition",
   "details":{
      "receivedDocuments": 19547,
      "indexedDocuments": 19547
   },
   "duration": "PT0.030750S",
   "enqueuedAt": "2021-12-20T12:39:18.349288Z",
   "startedAt": "2021-12-20T12:39:18.352490Z",
   "finishedAt": "2021-12-20T12:39:18.380038Z"
}
```

If the `status` field has the value `enqueued` or `processing`, all you have to do is wait a short time and check again. Proceed to the next step once the task `status` has changed to `succeeded`.

## Search

Now that you have Meilisearch set up, you can start searching!

<CodeSamples id="getting_started_search_md" />

In the above code sample, the parameter `q` represents the search query. The documents you added in [the previous step](#add-documents) will be searched for text that matches `botman`.

**Meilisearch response**:

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
    },
    …
  ],
  "nbHits": 66,
  "exhaustiveNbHits": false,
  "query": "botman",
  "limit": 20,
  "offset": 0,
  "processingTimeMs": 12
}
```

By default, Meilisearch only returns the first 20 results for a search query. This can be changed using the [`limit` parameter](/reference/api/search.md#limit).

## Search preview

Meilisearch offers a search preview where you can preview search results. It comes with a search bar that allows you to search a selected index. You can access it in your browser at `http://127.0.0.1:7700` any time Meilisearch is running.

![Screenshot of Meilisearch's search preview indicating the indexes dropdown on the upper right corner](/getting-started/multiple_indexes.png)

If you have multiple indexes, you can switch between them using the indexes dropdown.

## Front-end integration

The only step missing now is adding a search bar to your project. The easiest way of achieving this is to use [instant-meilisearch](https://github.com/meilisearch/instant-meilisearch): a developer tool that generates all the components needed to start searching.

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
  </body>
  <script src="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch@0.3.2/dist/instant-meilisearch.umd.min.js"></script>
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
</html>
```

Here's what's happening:

- The first four lines of the `<body>` add two container elements: `#searchbox` and `#hits`. `instant-meilisearch` creates the search bar inside `#searchbox` and lists search results in `#hits`
- The first two`<script src="…">` tags import libraries needed to run `instant-meilisearch`
- The third and final `<script>` tag is where you customize `instant-meilisearch`

:::

::: tab Vue.js

The following example uses [Vue 2](https://vuejs.org/), the second major release of a JavaScript framework for building web user interfaces.

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/templates/basic_search.css" />
</head>

<body>
  <div id="app" class="wrapper">
    <ais-instant-search :search-client="searchClient" index-name="movies">
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
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-instantsearch/vue2/umd/index.js"></script>
<script
  src="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/dist/instant-meilisearch.umd.min.js"></script>
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

Here's what's happening:

- To use `instant-meilisearch` with Vue, you must add `<ais-instant-search>`, `<ais-search-box>`, and `<ais-hits>` to your application's HTML. These components are mandatory when generating the`instant-meilisearch` interface
- Other Vue components such as `<ais-configure>` and `<ais-highlight>` are optional. They offer greater control over `instant-meilisearch`'s behavior and appearance
- The first two`<script src="..">` tags import libraries needed to run `instant-meilisearch` with Vue
- The third and final `<script>` creates a new Vue instance and instructs it to use `instant-meilisearch`

:::note

The above example uses Vue 2. Refer to [this GitHub issue](https://github.com/meilisearch/meilisearch-vue/issues/102) to learn more about Vue 3.

:::

::: tab React

The following code sample uses [React](https://reactjs.org/), a JavaScript library for building web user interfaces.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/templates/basic_search.css" />
  </head>
  <body>
      <div id="app" class="wrapper"></div>
  </body>
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
  <script src="https://cdn.jsdelivr.net/npm/react-instantsearch-dom@6.7.0/dist/umd/ReactInstantSearchDOM.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/dist/instant-meilisearch.umd.min.js"></script>
  <script>
    const { InstantSearch, SearchBox, Hits, Highlight, Configure } = ReactInstantSearchDOM;
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

    const Hit = (props) => (
      React.createElement(Highlight, {
        attribute: "title",
        hit: props.hit
      })
    );
    
    const domContainer = document.querySelector('#app');
    ReactDOM.render(React.createElement(App), domContainer);
  </script>
</html>
```

Here's what's happening:

- The `< div id="app">` inside `<body>` is React's entry point. `instant-meilisearch` creates the search bar and the search result container inside this HTML element by manipulating the DOM
- The first four`<script src="…">` tags import all the libraries required to run `instant-meilisearch` in [React](https://reactjs.org/).
- The last `<script>` tag initializes React, customizes `instant-meilisearch`, and creates all the required UI elements inside `<div id="app">`

:::

::::

### Let's try it!

1. Create an empty file and name it `index.html`
2. Open it in a text editor like Notepad, Sublime Text, or Visual Studio Code
3. Copy-paste one of the code samples above—either vanilla JavaScript, Vue 2, or React— and save the file
4. Open `index.html` in your browser by double-clicking it in your folder

You should now have a working front-end search interface 🚀🔥

## What's next?

You now know all the basics: how to install Meilisearch, create an index, add documents, check the status of an asynchronous task, and perform a search.

To keep going, continue to the [Meilisearch 101](/learn/getting_started/filtering_and_sorting.md) for a guided overview of the main features, or check out the [API references](/reference/api/overview.md) to dive right in!
