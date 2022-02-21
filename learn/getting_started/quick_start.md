# Quick start

In this quick start we will walk you through setting up Meilisearch, adding documents, performing your first search, using the search preview, and adding a search bar.

All that is required is a [command line](https://www.learnenough.com/command-line-tutorial#sec-running_a_terminal) for installation, and some way to interact with Meilisearch afterwards (e.g. [cURL](https://curl.se) or one of our [SDKs](/learn/what_is_meilisearch/sdks.md)).

Let's get started!

## Step 1: Setup and installation

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
When using **Docker**, you can run [any available tag](https://hub.docker.com/r/getmeili/Meilisearch/tags).

These commands launch the **latest stable release** of Meilisearch.

```bash
# Fetch the latest version of Meilisearch image from DockerHub
docker pull getmeili/meilisearch:latest

# Launch Meilisearch
docker run -it --rm \
    -p 7700:7700 \
    -v $(pwd)/data.ms:/data.ms \
    getmeili/Meilisearch:latest
```

Data written to a **Docker container is not persistent** and is wiped every time the container is stopped. We recommend using a shared Docker volume between containers and host machines to provide persistent storage.

You can learn more about Docker by consulting [its official documentation](https://docs.docker.com/get-docker/).
:::

::: tab APT

Download the **latest stable release** of Meilisearch with **APT**.

Launch Meilisearch to start the server.

```bash
# Add Meilisearch package
sudo echo "deb [trusted=yes] https://apt.fury.io/meilisearch/ /" > /etc/apt/sources.list.d/fury.list

# Update APT and install Meilisearch
sudo apt update && apt install meilisearch-http

# Launch Meilisearch
sudo meilisearch
```

:::

::: tab Source

Meilisearch is written in `Rust`. To compile it, [install the Rust toolchain](https://www.rust-lang.org/tools/install).

If the Rust toolchain is already installed, clone the repository on your local system and change it to your working directory.

```bash
git clone https://github.com/meilisearch/Meilisearch
cd meilisearch
```

In the cloned repository, choose the release you want to use. You can find the full list [here](https://github.com/meilisearch/MeiliSearch/releases).

Now, run the following command with the tag you selected:

```bash
git checkout v0.25.2

#Compile Meilisearch using:

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
- [DigitalOcean](/learn/cookbooks/digitalocean_droplet.md)
- [Qovery](/learn/cookbooks/qovery.md)
- [GCP](/learn/cookbooks/gcp.md)
- [Azure](/learn/cookbooks/azure.md)

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

## Step 2: Add documents

For this quick start, we will be using a collection of movies as our dataset. To follow along, first click this link to download the file: <a id="downloadMovie" href="/movies.json" download="movies.json">movies.json</a>. Then, move the downloaded file into your working directory.

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

<CodeSamples id="getting_started_check_task_status_md" />

If the document addition is successful, the response should look like this:

```json
{
   "uid":0,
   "indexUid":"movies",
   "status":"succeeded",
   "type":"documentAddition",
   "details":{
      "receivedDocuments":19547,
      "indexedDocuments":19547
   },
   "duration":"PT0.030750S",
   "enqueuedAt":"2021-12-20T12:39:18.349288Z",
   "startedAt":"2021-12-20T12:39:18.352490Z",
   "finishedAt":"2021-12-20T12:39:18.380038Z"
}
```

If the `status` field has the value `enqueued` or `processing`, all you have to do is wait a short time and check again. Proceed to the next step once the task `status` has changed to `succeeded`.

## Step 3: Search

Now that you have Meilisearch setup, you can start searching!

<CodeSamples id="getting_started_search_md" />

In the above code sample, the parameter `q` represents the search query. The documents you added in [step two](#step-2-add-documents) will be searched for text that matches `botman`.

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
  "nbHits":66,
  "exhaustiveNbHits":false,
  "query":"botman",
  "limit":20,
  "offset":0,
  "processingTimeMs":12
}
```

By default, Meilisearch only returns the first 20 results for a search query. This can be changed using the [`limit` parameter](/reference/api/search.md#limit).

## Step 4: Search preview

Meilisearch offers a web interface where you can preview search results. It comes with a search bar that allows you to search a selected index. You can access it in your browser at `http://127.0.0.1:7700` any time Meilisearch is running.

![Screenshot of Meilisearch's search preview indicating the indexes dropdown on the upper right corner](/getting-started/multiple_indexes.png)

If you have multiple indexes, you can switch between them using the indexes dropdown.

## Step 5: Front-end integration

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
      searchClient: instantMeilisearch(
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

The code above comes in multiple parts:

- The first four lines of the `<body>` add both `searchbox` and `hits` elements. Ultimately, `instant-meilisearch` adds the search bar and search results in these elements.
- `<script src="..">` tags are [CDNs](https://en.wikipedia.org/wiki/Content_delivery_network) that import libraries needed to run `instant-meilisearch`.
- The JavaScript part is where you customize `instant-meilisearch`.

To use `instant-meilisearch` with `npm` or `yarn` please visit [instant-meilisearch](https://github.com/meilisearch/instant-meilisearch).

:::

::: tab Vue.js

The following code sample uses [Vue.js](https://vuejs.org/) framework.

```html
<!DOCTYPE html>
<html lang="en">
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
  <script src="https://cdn.jsdelivr.net/npm/vue-instantsearch/dist/vue-instantsearch.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/dist/instant-meilisearch.umd.min.js"></script>
  <script>
    Vue.use(VueInstantSearch)
    var app = new Vue({
        el: '#app',
        data: {
            searchClient: instantMeilisearch('http://127.0.0.1:7700')
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
    const { InstantSearch, SearchBox, Hits, Highlight, Configure }  = ReactInstantSearchDOM;
    const searchClient = instantMeilisearch(
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
- The `<script>` containing JavaScript initialize React and renders the code that will be rendered in the body. Customization of `instant-meilisearch` happens here as well.

To use `instant-meilisearch` in `React` using `npm` or `yarn` please visit [meilisearch-react](https://github.com/meilisearch/meilisearch-react).

:::

::::

### Let's try it!

1. Create an `html` file, for example, `index.html`
2. Open it in a text editor (e.g. Notepad, Sublime Text, Visual Studio Code)
3. Copy-paste any of the code examples above and save the file
4. Open `index.html` in your browser (double click on it in your folder)

You should now have a working front-end search interface 🚀🔥

## What's next?

You now know all the basics: how to install Meilisearch, create an index, add documents, check the status of an asynchronous task, and perform a search.

To keep going, continue to the [Meilisearch 101](/learn/getting_started/filtering_and_sorting.md) for a guided overview of the main features, or check out the [API references](/reference/api/README.md) to dive right in!
