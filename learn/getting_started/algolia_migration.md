# Migrating from Algolia to Meilisearch

This page aims to help current users of Algolia make the transition to Meilisearch.

For a high-level comparison of the two search companies and their products, see [our analysis of the search market](/learn/what_is_meilisearch/comparison_to_alternatives.md#meilisearch-vs-algolia).

## Overview

This guide will take you step-by-step through the creation of a [Node.js](https://nodejs.org/en/) script to upload Algolia index data to Meilisearch. [You can also skip directly to the finished script](#finished-script).

The migration process consists of three steps:

1. [Export your data stored in Algolia](#export-your-algolia-data)
2. [Import your data into Meilisearch](#import-your-data-into-meilisearch)
3. [Configure your Meilisearch index settings (optional)](#configure-your-index-settings)

To help with the transition, we have also included a comparison of Meilisearch and Algolia's [API methods](#api-methods) and [front-end components](#front-end-components).

Before continuing, make sure you have both Meilisearch and Node.js installed and have access to a command-line terminal. If you're unsure how to install Meilisearch, see our [quick start](/learn/getting_started/quick_start.md).

::: note

This guide was tested with the following package versions:

[`node.js`](https://nodejs.org/en/): `16.14`
[`algoliasearch`](https://www.npmjs.com/package/algoliasearch): `4.13`
[`meilisearch-js`](https://www.npmjs.com/package/meilisearch): `0.25.1`
[`meilisearch`](https://github.com/meilisearch/meilisearch): `0.27`

:::

## Export your Algolia data

### Initialize project

Start by creating a directory `algolia-meilisearch-migration` and generating a `package.json` file with `npm`:

```bash
mkdir algolia-meilisearch-migration
cd algolia-meilisearch-migration
npm init -y
```

This will set up the environment we need to install dependencies.

Next, create a `script.js` file:

```bash
touch script.js
```

This file will contain our migration script.

### Install dependencies

To get started, you'll need two different packages. The first is `algoliasearch`, the JavaScript client for the Algolia API, and the second is `meilisearch`, the JavaScript client for the Meilisearch API.

```bash
npm install -s algoliasearch@4.13 meilisearch@0.25.1
```

### Create Algolia client

You'll need your **Application ID** and **Admin API Key** to start the Algolia client. Both can be found in your [Algolia account](https://www.algolia.com/api-keys).

Paste the below code in `script.js`:

```js
const algoliaSearch = require("algoliasearch");

const algoliaClient = algoliaSearch(
  "APPLICATION_ID",
  "ADMIN_API_KEY"
);
const algoliaIndex = algoliaClient.initIndex("INDEX_NAME");
```

Replace `APPLICATION_ID` and `ADMIN_API_KEY` with your Algolia application ID and admin API key respectively.

Replace `INDEX_NAME` with the name of the Algolia index you would like to migrate to Meilisearch.

### Fetch data from Algolia

To fetch all Algolia index data at once, use Algolia's [`browseObjects`](https://www.algolia.com/doc/api-reference/api-methods/browse/) method.

```js
let records = [];
await algoliaIndex.browseObjects({
    batch: (hits) => {
      records = records.concat(hits);
    }
  });
```

The `batch` callback method is invoked on each batch of hits and the content is concatenated in the `records` array. We will use `records` again later in the upload process.

## Import your data into Meilisearch

### Create Meilisearch client

Create a Meilisearch client by passing the host URL and API key of your Meilisearch instance. The easiest option is to use the automatically generated [admin API key](/learn/security/master_api_keys.md#listing-api-keys).

```js
const { MeiliSearch } = require("meilisearch");

const meiliClient = new MeiliSearch({
  host: "MEILI_HOST",
  apiKey: "MEILI_API_KEY",
});
const meiliIndex = meiliClient.index("MEILI_INDEX_NAME");
```

Replace `MEILI_HOST`,`MEILI_API_KEY`, and `MEILI_INDEX_NAME` with your Meilisearch host URL, Meilisearch API key, and the index name where you would like to add documents. Meilisearch will create the index if it doesn't already exist.

### Upload data to Meilisearch

Next, use the Meilisearch JavaScript method [`addDocumentsInBatches`](https://github.com/meilisearch/meilisearch-js#documents-) to upload all your records in batches of 100,000.

```js
const BATCH_SIZE = 100000;
await meiliIndex.addDocumentsInBatches(records, BATCH_SIZE);
```

That's all! When you're ready to run the script, enter the below command:

```bash
node script.js
```

### Finished script

```js
const algoliaSearch = require("algoliasearch");
const { MeiliSearch } = require("meilisearch");

const BATCH_SIZE = 1000;

(async () => {
  const algoliaClient = algoliaSearch("APPLICATION_ID", "ADMIN_API_KEY");
  const algoliaIndex = algoliaClient.initIndex("INDEX_NAME");

  let records = [];
  await algoliaIndex.browseObjects({
    batch: (hits) => {
      records = records.concat(hits);
    }
  });

  const meiliClient = new MeiliSearch({
    host: "MEILI_HOST",
    apiKey: "MEILI_API_KEY",
  });
  const meiliIndex = meiliClient.index("MEILI_INDEX_NAME");

  await meiliIndex.addDocumentsInBatches(records, BATCH_SIZE);
})();
```

## Configure your index settings

Meilisearch's default settings are designed to deliver a fast and relevant search experience that works for most use-cases.

To customize your index settings, we recommend following [this guide](/learn/configuration/settings.md). To learn more about the differences between settings in Algolia and Meilisearch, read on.

### Index settings vs. search parameters

One of the key usage differences between Algolia and Meilisearch is how they approach index settings and search parameters.

**In Algolia,** [API parameters](https://www.algolia.com/doc/api-reference/api-parameters/) is a flexible category that includes both index settings and search parameters. Many API parameters can be used both at indexing time—to set default behavior—or at search time—to override that behavior.

**In Meilisearch,** [index settings](/learn/configuration/settings.md) and [search parameters](/reference/api/search.md#search-parameters) are two distinct categories. Settings affect all searches on an index, while parameters affect the results of a single search.

Some Meilisearch parameters require index settings to be configured beforehand; for example, to use the search parameter `sort` you must first configure the index setting `sortableAttributes`. However, unlike in Algolia, an index setting can never be used as a parameter and vice versa.

### Settings and parameters comparison

The below table compares Algolia's **API parameters** with the equivalent Meilisearch **setting** or **search parameter**.

| Algolia                             | Meilisearch                                                                    |
|-------------------------------------|--------------------------------------------------------------------------------|
| `query`                             | `q`                                                                            |
| `attributesToRetrieve`              | `attributesToRetrieve`                                                         |
| `filters`                           | `filter`                                                                       |
| `facets`                            | `facetDistribution`                                                           |
| `attributesToHighlight`             | `attributesToHighlight`                                                        |
| `offset`                            | `offset`                                                                       |
| `length`                            | `limit`                                                                        |
| `typoTolerance`                     | `typoTolerance`                                                                |
| `snippetEllipsisText`               | `cropMarker`                                                                   |
| `searchableAttributes`              | `searchableAttributes`                                                         |
| `attributesForFaceting`             | `filterableAttributes`                                                         |
| `unretrievableAttributes`           | No direct equivalent; achieved by removing attributes from displayedAttributes |
| `attributesToRetrieve`              | `displayedAttributes`                                                          |
| `attributeForDistinct`              | `distinctAttribute`                                                            |
| `ranking`                           | `rankingRules`                                                                 |
| `customRanking`                     | Integrated within `rankingRules`                                               |
| `removeStopWords`                   | `stopWords`                                                                    |
| `synonyms`                          | `synonyms`                                                                     |
| Sorting(using replicas)             | `sortableAttributes` (no replicas required)                                    |
| `removeWordsIfNoResults`            | Automatically supported, but not customizable                                  |
| `disableTypoToleranceOnAttributes`  | `typoTolerance.disableOnAttributes`                                            |
| `separatorsToIndex`                 | Not Supported                                                                  |
| `disablePrefixOnAttributes`         | Not Supported                                                                  |
| `relevancyStrictness`               | Not Supported                                                                  |
| `maxValuesPerFacet`                 | Not Supported                                                                  |
| `sortFacetValuesBy`                 | Not Supported                                                                  |
| `restrictHighlightAndSnippetArrays` | Not Supported                                                                  |

## API methods

This section compares Algolia and Meilisearch's respective API methods, using JavaScript for reference.

| Method                | Algolia                                                                             | Meilisearch                                                                                                            |
|-----------------------|-------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| Index Instantiation   | `client.initIndex()`<br>Here, client is an Algolia instance.                        | `client.index()`<br>Here, client is a Meilisearch instance.                                                            |
| Create Index          | Algolia automatically creates an index the first time you add a record or settings. | The same applies to Meilisearch, but users can also create an index explicitly: `client.createIndex(string indexName)` |
| Get All Indexes       | `client.listIndices()`                                                              | `client.getIndexes()`                                                                                                  |
| Get Single Index      | No method available                                                                 | `client.getIndex(string indexName)`                                                                                    |
| Delete Index          | `index.delete()`                                                                    | `client.deleteIndex(string indexName)`                                                                                 |
| Get Index Settings    | `index.getSettings()`                                                               | `index().getSettings()`                                                                                                |
| Update Index Settings | `index.setSettings(object settings)`                                                | `index().updateSettings(object settings)`                                                                              |
| Search Method         | `index.search(string query, { searchParameters, requestOptions })`                  | `index.search(string query, object searchParameters)`                                                                  |
| Add Object            | `index.saveObjects(array objects)`                                                  | `index.addDocuments(array objects)`                                                                                    |
| Partial Update Object | `index.partialUpdateObjects(array objects)`                                         | `index.updateDocuments(array objects)`                                                                                 |
| Delete All Objects    | `index.deleteObjects(array objectIDs)`                                              | `index.deleteAllDocuments()`                                                                                           |
| Delete One Object     | `index.deleteObject(string objectID)`                                               | `index.deleteDocument(string id)`                                                                                      |
| Get All Objects       | `index.getObjects(array objectIDs)`                                                 | `index.getDocuments(object params)`                                                                                    |
| Get Single Object     | `index.getObject(str objectID)`                                                     | `index.getDocument(string id)`                                                                                         |
| Get API Keys          | `client.listApiKeys()`                                                              | `client.getKeys()`                                                                                                     |
| Get API Key Info      | `client.getApiKey(string apiKey)`                                                   | `client.getKey(string apiKey)`                                                                                         |
| Create API Key        | `client.addApiKey(array acl)`                                                       | `client.createKey(object configuration)`                                                                               |
| Update API Key        | `client.updateApiKey(string apiKey, object configuration)`                          | `client.updateKey(string apiKey, object configuration)`                                                                |
| Delete API Key        | `client.deleteApiKey(string apiKey)`                                                | `client.deleteKey(string apiKey)`                                                                                      |

## Front-end components

[InstantSearch](https://github.com/algolia/instantsearch.js) is a collection of open-source tools maintained by Algolia and used to generate front-end search UI components. To use InstantSearch with Meilisearch, you must use [Instant Meilisearch](https://github.com/meilisearch/instant-meilisearch).

Instant Meilisearch is a plugin connecting your Meilisearch instance with InstantSearch, giving you access to many of the same front-end components as Algolia users. You can find an up-to-date list of [the components supported by Instant Meilisearch](https://github.com/meilisearch/instant-meilisearch/#-api-resources) in the GitHub project's README.
