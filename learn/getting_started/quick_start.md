# Quick start

This quick start will walk you through setting up Meilisearch, adding documents, performing your first search, using the search preview, adding a search bar, and securing your instance.

All that is required is a [command line](https://www.learnenough.com/command-line-tutorial#sec-running_a_terminal) for installation, and some way to interact with Meilisearch afterwards (for example, [cURL](https://curl.se) or one of our [SDKs](/learn/what_is_meilisearch/sdks.md)).

Let's get started!

## Setup and installation

We'll start with downloading and installing Meilisearch:

```bash
# Install Meilisearch
curl -L https://install.meilisearch.com | sh

# Launch Meilisearch
./meilisearch
```

You have the option to install Meilisearch locally or deploy it over a cloud service. Learn more about the other installation options in our [dedicated guide](/learn/getting_started/installation.md).

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
Server listening on: "localhost:7700"
```

Congratulations! You're ready to move on to the next step!

## Add documents

For this quick start, we will be using a collection of movies as our dataset. To follow along, first click this link to download the file: <a id="downloadMovie" href="/movies.json" download="movies.json">movies.json</a>. Then, move the downloaded file into your working directory.

Open a new terminal window and run the following command:

<CodeSamples id="getting_started_add_documents_md" />

Meilisearch stores data in the form of discrete records, called [documents](/learn/core_concepts/documents.md). Documents are grouped into collections, called [indexes](/learn/core_concepts/indexes.md).

::: note
Meilisearch currently only accepts data in JSON, NDJSON, and CSV formats. You can read more about this in our [documents guide](/learn/core_concepts/documents.md#dataset-format).
:::

The previous command added documents from `movies.json` to a new index called `movies` and set `id` as the primary key. If it isn't set manually, Meilisearch [infers](/learn/core_concepts/primary_key.md#meilisearch-guesses-your-primary-key) it from your dataset.

Every index must have a [primary key](/learn/core_concepts/primary_key.md#primary-field), an attribute shared across all documents in that index. If you try adding documents to an index and even a single one is missing the primary key, none of the documents will be stored.

By default, Meilisearch combines consecutive document requests into a single batch and processes them together. This process is called [auto-batching](/learn/core_concepts/documents.md#auto-batching), and it significantly speeds up indexing. After adding documents, you should receive a response like this:

```json
{
    "taskUid": 0,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentAdditionOrUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

Most database operations in Meilisearch are [asynchronous](/learn/advanced/asynchronous_operations.md). This means that rather than being processed instantly, **API requests are added to a queue and processed one at a time**.

Use the returned `taskUid` to [check the status](/reference/api/tasks.md) of your documents:

<CodeSamples id="getting_started_check_task_status" />

If the document addition is successful, the response should look like this:

```json
{
   "uid": 0,
   "indexUid": "movies",
   "status": "succeeded",
   "type": "documentAdditionOrUpdate",
   "canceledBy": null,
   "details":{
      "receivedDocuments": 19547,
      "indexedDocuments": 19547
   },
   "error": null,
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
      "id": 29751,
      "title": "Batman Unmasked: The Psychology of the Dark Knight",
      "poster": "https://image.tmdb.org/t/p/w1280/jjHu128XLARc2k4cJrblAvZe0HE.jpg",
      "overview": "Delve into the world of Batman and the vigilante justice tha",
      "release_date": "2008-07-15"
    },
    {
      "id": 471474,
      "title": "Batman: Gotham by Gaslight",
      "poster": "https://image.tmdb.org/t/p/w1280/7souLi5zqQCnpZVghaXv0Wowi0y.jpg",
      "overview": "ve Victorian Age Gotham City, Batman begins his war on crime",
      "release_date": "2018-01-12"
    },
    …
  ],
  "estimatedTotalHits": 66,
  "query": "botman",
  "limit": 20,
  "offset": 0,
  "processingTimeMs": 12
}
```

By default, Meilisearch only returns the first 20 results for a search query. This can be changed using the [`limit` parameter](/reference/api/search.md#limit).

## Search preview

Meilisearch offers a browser-based search preview where you can search through a selected index. You can access it any time Meilisearch is running at `http://localhost:7700`.

![Meilisearch's search preview showing the movies index](/search_preview/default.png)

For security reasons, the search preview is only available in [development mode.](/learn/configuration/instance_options.md#environment)

If you have multiple indexes, you can switch between them using the indexes dropdown.

![Meilisearch's search preview indicating the indexes dropdown in the upper right corner](/search_preview/multiple_indexes.png)

## Customization

At this point, you can configure your entire Meilisearch instance, customize your indexes, and refine your results using:

- [Environment variables](/learn/configuration/instance_options.md#environment-variables) and [command-line options](/learn/configuration/instance_options.md#command-line-options-and-flags)

- A [configuration file](/learn/configuration/instance_options.md#configuration-file)

- [Index settings](/reference/api/settings.md)

- [Search parameters](/reference/api/search.md#search-parameters)

## Front-end integration

The only step missing now is adding a search bar to your project. The easiest way of achieving this is to use [instant-meilisearch](https://github.com/meilisearch/instant-meilisearch): a plugin that establishes communication between your Meilisearch instance and [InstantSearch](https://github.com/algolia/instantsearch.js). InstantSearch, an open-source project developed by Algolia, is the tool that renders all the components needed to start searching.

<CodeSamples id="getting_started_front_end_integration_md" />

### Let's try it!

1. Create an empty file and name it `index.html`
2. Open it in a text editor like Notepad, Sublime Text, or Visual Studio Code
3. Copy-paste one of the code samples above—either vanilla JavaScript, Vue 2, or React— and save the file
4. Open `index.html` in your browser by double-clicking it in your folder

You should now have a working front-end search interface 🚀🔥

## Securing Meilisearch

The Meilisearch API is unprotected by default, making all routes publicly accessible. You can set a master key to protect your instance from unauthorized use:

:::: tabs

::: tab CLI

```bash
./meilisearch --master-key="MASTER_KEY"
```

:::

::: tab Environment variable

UNIX:

```bash
export MEILI_MASTER_KEY="MASTER_KEY"
./meilisearch
```

Windows:

```bash
set MEILI_MASTER_KEY="MASTER_KEY"
./meilisearch
```

:::

::::

When you launch your Meilisearch instance with a master key, two things happen:

- Your Meilisearch instance is now protected. Aside from the [get health endpoint](/reference/api/health.md), all subsequent API requests must include a valid API key for [authorization](/reference/api/overview.md#authorization)
- Two [default API keys](/learn/security/master_api_keys.md#using-default-api-keys-for-authorization) are automatically generated

Here's how to use the master key you set to [get all keys](/reference/api/keys.md#get-all-keys):

<CodeSamples id="authorization_header_1" />

The master key should only be used for retrieving and managing API keys. For regular API calls, such as search, use an API key:

<CodeSamples id="getting_started_communicating_with_a_protected_instance" />

::: warning
Accessing the `/keys` route without setting a master key will return an [error](/reference/errors/error_codes.md#missing-master-key).
:::

To learn more about key management, refer to our [dedicated guide](/learn/security/master_api_keys.md).

## What's next?

You now know all the basics: how to install Meilisearch, create an index, add documents, check the status of an asynchronous task, and perform a search.

To keep going, continue to the [Meilisearch 101](/learn/getting_started/filtering_and_sorting.md) for a guided overview of the main features, or check out the [API references](/reference/api/overview.md) to dive right in!
