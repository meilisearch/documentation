# Migrating from Algolia to Meilisearch

This guide will walk you through exporting your Algolia data and indexing it in Meilisearch using a Node.js script. To skip directly to the finished script, [click here](#finished-script).

This guide also includes comparisons of Meilisearch and Algolia's [APIs](#apis), [index settings, parameters](#settings-and-parameters), and [support for the `instantsearch.js` library](#front-end-components).

This is a practical guide for current Algolia users making the transition to Meilisearch. We also provide [a high-level comparison of the two search companies and their products](/learn/what_is_meilisearch/comparison_to_alternatives.md#meilisearch-vs-algolia) elsewhere.

## Migration script

Migrating indexes from Algolia to Meilisearch can be done in three steps:

1. Export your data stored in Algolia
2. Upload your data to Meilisearch
3. (optional) Configure your settings to approximate the settings of your Algolia index

This guide uses a [Node.js](https://nodejs.org/en/) script to upload Algolia index data to Meilisearch. Before continuing, make sure you have both Meilisearch and Node.js installed, and access to a command-line terminal. If you're unsure, see our [quick start](/learn/getting_started/quick_start.md) for instructions on installing Meilisearch.

::: note

Older Meilisearch versions (prior to v0.27.0) have limited support for nested objects. If your data set contains nested fields, we strongly recommend installing the [latest version](https://github.com/meilisearch/MeiliSearch/releases) before continuing.

:::

### Initialize project

Start by creating a directory `algolia-meilisearch-migration` and initializing it as an npm package:

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

### Install required packages

To get started, you'll need two different packages. The first is `algoliasearch`, the JavaScript client for the Algolia API, and the second is `meilisearch`, the JavaScript client for the Meilisearch API.

```bash
npm install algoliasearch meilisearch
```

### Create Algolia client

You'll need your **Application ID** and **API Key** to start the Algolia client. Both can be found in your [Algolia account](https://www.algolia.com/api-keys).

Paste the below code in `script.js`:

```js
const AlgoliaSearch = require("algoliasearch");
const algoliaClient = AlgoliaSearch(
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
      records=records.concat(hits)
    }
  });
```

On each batch of hits, the `batch` callback method is invoked, and the content is concatenated in the `records` array. This variable will be used later on in the upload process.

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

Replace `MEILI_HOST`,`MEILI_API_KEY`, and `MEILI_INDEX_NAME` with your Meilisearch host URL, Meilisearch API key, and the index name where you would like documents to be added. Meilisearch will create the index if it doesn't already exist.

### Upload data to Meilisearch

Next, use the Meilisearch JavaScript method [`addDocumentsInBatches`]([/learn/core_concepts/documents.md#primary-field](https://github.com/meilisearch/meilisearch-js#documents-)) to upload all your records in batches of 100,000 at a time.

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
const AlgoliaSearch = require("algoliasearch");
const { MeiliSearch } = require("meilisearch");
const BATCH_SIZE = 1000;

(async () => {
  const algoliaClient = AlgoliaSearch("APPLICATION_ID", "ADMIN_API_KEY");
  const algoliaIndex = algoliaClient.initIndex("INDEX_NAME");

  let records = [];
  await algoliaIndex.browseObjects({
    batch: (hits) => {
      records = records.concat(hits)
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

## Settings and parameters

One of the key usage differences between Algolia and Meilisearch is how they approach search customization.

In Algolia, [API parameters](https://www.algolia.com/doc/api-reference/api-parameters/) are a flexible category that can be used either at indexing time—to set default behavior—or at search time—to override that behavior.

In Meilisearch, these are split into two distinct categories. [Index settings](/learn/configuration/settings.md) affect all searches on an index; [search parameters](/reference/api/search.md#search-parameters) affect only a single search. Some search parameters depend on index settings; for example, the search parameter `sort` can't be used without first configuring the index setting `sortableAttributes`. However, an index setting cannot be given as a parameter at search time, and a parameter cannot override a setting.

The below table compares Algolia's **API parameters** with the equivalent Meilisearch **setting** or **search parameter**.

| Algolia | Meilisearch |
| --- | --- |
| `query` | `q` |
| `attributesToRetrieve` | `attributesToRetrieve` |
| `filters` | `filter` |
| `facets` | `facetsDistribution` |
| `attributesToHighlight` | `attributesToHighlight` |
| `offset` | `offset` |
| `length` | `limit` |
| `typoTolerance` | `typoTolerance` |
| `snippetEllipsisText` | `cropMarker` |
| `searchableAttributes` | `searchableAttributes` |
| `attributesForFaceting` | `filterableAttributes` |
| `unretrievableAttributes` | No direct equivalent; achieved by removing attributes from displayedAttributes |
| `attributesToRetrieve` | `displayedAttributes` |
| `attributeForDistinct` | `distinctAttribute` |
| `ranking` | `rankingRules` |
| `customRanking` | Integrated within `rankingRules` |
| `removeStopWords` | `stopWords` |
| `synonyms` | `synonyms` |
| Sorting(using replicas) | `sortableAttributes` (no replicas required) |
| `removeWordsIfNoResults` | Automatically supported, but not customizable |
| `disableTypoToleranceOnAttributes` | `typoTolerance.enabled` |
| `separatorsToIndex` | Not Supported |
| `disablePrefixOnAttributes` | Not Supported |
| `relevancyStrictness` | Not Supported |
| `maxValuesPerFacet` | Not Supported |
| `sortFacetValuesBy` | Not Supported |
| `restrictHighlightAndSnippetArrays` | Not Supported |

## APIs

This section compares Algolia and Meilisearch's respective API methods, using JavaScript for reference.

| Topic | Algolia | Meilisearch |
| --- | --- | --- |
| Index Instantiation | `client.initIndex()`<br>Here, client is an Algolia instance. | `client.index()`<br>Here, client is a Meilisearch instance. |
| Create Index | Users don’t need to create an index explicitly, the engine does it for you the first time you add an object or set settings. | The same applies for Meilisearch but users can also create an index explicitly using: `client.createIndex(string indexName)` |
| Get All Indexes | `client.listIndices()` | `client.getIndexes()` |
| Get Single Index | No method available | `client.getIndex(string indexName)` |
| Delete Index | `index.delete()` | `client.deleteIndex(string indexName)` |
| Get Index Settings | `index.getSettings()` | `index().getSettings()` |
| Update Index Settings | `index.setSettings(object settings)` | `index().updateSettings(object settings)` |
| Search Method | `index.search(string query, { searchParameters, requestOptions })` | `index.search(string query, object searchParameters)` |
| Add Object | `index.saveObjects(array objects)` | `index.addDocuments(array objects)` |
| Partial Update Object | `index.partialUpdateObjects(array objects)` | `index.updateDocuments(array objects)` |
| Delete All Objects | `index.deleteObjects(array objectIDs)` | `index.deleteAllDocuments()` |
| Delete One Object | `index.deleteObject(string objectID)` | `index.deleteDocument(string id)` |
| Get All Objects | `index.getObjects(array objectIDs)` | `index.getDocuments(object params)` |
| Get Single Object | `index.getObject(str objectID)` | `index.getDocument(string id)` |
| Get API Keys | `client.listApiKeys()` | `client.getKeys()` |
| Get API Key Info | `client.getApiKey(string apiKey)` | `client.getKey(string apiKey)` |
| Create API Key | `client.addApiKey(array acl)` | `client.createKey(object configuration)` |
| Update API Key | `client.updateApiKey(string apiKey, object configuration)` | `client.updateKey(string apiKey, object configuration)` |
| Delete API Key | `client.deleteApiKey(string apiKey)` | `client.deleteKey(string apiKey)` |

## Front-end components

[InstantSearch](https://github.com/algolia/instantsearch.js) is a collection of open-source tools maintained by Algolia and used to generate front-end search UI components.

[Instant Meilisearch](https://github.com/meilisearch/instant-meilisearch) is a plugin connecting your Meilisearch instance with InstantSearch, giving you access to many (but not all) of the same front-end components as Algolia users. Here is [an up-to-date list of components compatible with Instant Meilisearch](https://github.com/meilisearch/instant-meilisearch/#-api-resources).

## Conclusion

You now know how to migrate your data from Algolia to Melisearch and some of the similarities between their respective APIs.

Please don't hesitate to [let us know how you think this guide can be improved](https://github.com/meilisearch/documentation/issues/new), and if you have any questions, we're always available to help [on Slack](https://meilicommunity.slack.com/join/shared_invite/zt-c4rs8tpi-ZId_q3fw~7cqeuzFG4XHaA#/shared-invite/email).
