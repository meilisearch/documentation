---
permalink: /faq.html
sidebar: auto
---

# FAQ

This FAQ is created in collaboration with our users.

If you have any questions that aren't answered here, we want to hear from you! Your feedback will help us improve our documentation.

## I have never used a search engine before. Can I use Meilisearch anyway?

Of course! No knowledge of ElasticSearch or Solr is required to use Meilisearch.

Meilisearch is really **easy to use** and thus accessible to all kinds of developers.

[Take a quick tour](/learn/getting_started/quick_start.md) to learn the basics of Meilisearch!

We also provide a lot of tools, including [SDKs](/learn/what_is_meilisearch/sdks.md), to help you integrate easily Meilisearch in your project. We're adding new tools every day!

Plus, you can [contact us](#how-can-i-contact-the-meilisearch-team) if you need any help. We will answer for sure!

## Do I need to configure Meilisearch to get it working?

Meilisearch configuration works out-of-the-box. It means, by default, Meilisearch configures necessary settings for providing a powerful and relevant search.

For example, without requiring any configuration, Meilisearch is typo tolerant.
Type `craete an index` in the search bar of this documentation to experience the typo tolerance of our search engine.

To find out more about the relevancy of Meilisearch, take a look at this detailed [explanation](/learn/core_concepts/relevancy.md#ranking-rules).

However, Meilisearch is of course [highly customizable](/reference/api/settings.md) in order to adapt the search to your needs by setting synonyms, stop words, and custom ranking rules.

## How to know if Meilisearch perfectly fits my use cases?

Since Meilisearch is an open-source and easy-to-use tool, you can give it a try using your data. Follow this [guide](/learn/getting_started/quick_start.md) to get a quick start!

Besides, we published a [comparison between Meilisearch and other search engines](/learn/what_is_meilisearch/comparison_to_alternatives.md) with the goal of providing an overview of Meilisearch alternatives.

## Which languages can Meilisearch handle?

Meilisearch works perfectly with English, kanji, and Romance languages.
If you have any hesitation about your language handling, please contact us.

## Do you provide a real dataset to test Meilisearch?

In this documentation, we provide this <a id="downloadMovie" href="/movies.json" download="movies.json">movies.json</a> dataset.

More datasets and setting configurations are available [in this repository](https://github.com/meilisearch/datasets/).

## I did a call to an API route and got an object as a response. What does it mean?

All asynchronous operations return a summarized version of the [`task` object](/learn/advanced/asynchronous_operations.md#response).

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentAddition",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

This response indicates that the operation has been taken into account and will be processed once it reaches the front of the queue. You can use this `uid` to get more details on [the status of the task](/reference/api/tasks.md#get-task).

## I am trying to add my documents but I keep receiving a `400 - Bad Request` response.

Meilisearch API accepts JSON, CSV, and NDJSON formats.
In case of a [document addition](/reference/api/documents.md#add-or-replace-documents), only an array of objects is expected.

The `400 - Bad request` response probably means that your data is not in an expected format.

Most common errors:

- Extraneous comma at the end of a line.
- Data is not an array of objects: for the [document addition route](/reference/api/documents.md#add-or-replace-documents), Meilisearch only accepts an array in the body even if there is only one document.

Wrong:

```json
{
  "id": 123,
  "title": "Pride and Prejudice"
}
```

Good:

```json
[
  {
    "id": 123,
    "title": "Pride and Prejudice"
  }
]
```

:::tip
The [jq](https://github.com/stedolan/jq) command line tool can greatly help you check the format of your data.

```bash
cat your_file.json | jq
```

:::

## What do the different error types mean?

Meilisearch has the following types of errors:

| Type            | Description                                                                                       |
|-----------------|---------------------------------------------------------------------------------------------------|
| invalid_request | This is due to an error in the user input. It is accompanied by the HTTP code `4xx`. |
| internal        | This is due to machine or configuration constraints. The most common cause is reaching or exceeding hard limits, such as the size of the disk, the size limit of an index, etc. It is accompanied by the HTTP code `5xx`.  |
| auth            | This type of error is related to authentication and authorization. It is accompanied by the HTTP code `4xx`. |

## My document upload failed with the `document id is missing` error.

::: note TLDR;
Most common reasons:

- A unique identifier in your document is missing.
- The unique identifier of your document is not well-formatted.
  :::

Each document is required to contain a unique identifier. This identifier attribute is the `primary key`.

How do I know the primary key of my index? [Check this route](/reference/api/indexes.md#get-one-index). The `null` value means it has not been defined yet.

By default, the primary key will be inferred from the first document received. Meilisearch will search for an attribute that contains the string `id` in a case-insensitive manner (e.g., `uid`, `MovieId`, `ID`, `123id123`). If none has been found, no documents will be added.

If you get a `document id is missing` error, the primary key was not recognized. This means your primary key is wrongly formatted. Sending primary key's name as a query parameter [when adding documents](/reference/api/documents.md#add-or-replace-documents) should solve this issue.

Note that the primary key value must contain only `A-Z a-z 0-9` and `-_` characters.

Wrong:

```json
"id": "@BI+* ^5h2%"
```

Good:

```json
"id": "_Aabc012_"
```

See more [information about the primary key](/learn/core_concepts/the_primary_key.md#primary-key).

## I have uploaded my documents, but I get no result when I search in my index.

Your document upload probably failed. To understand why, please check the status of the document addition task using the `uid`. If the task failed, the response should contain an `error` object.

Here is an example of a failed task:

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "failed",
    "type": "documentAddition",
    "details": { 
            "receivedDocuments": 67493,
            "indexedDocuments": 0
    },
    "error": {
        "message": "Document does not have a `:primaryKey` attribute: `:documentRepresentation`.",
        "code": "internal",
        "type": "missing_document_id",
        "link": "https://docs.meilisearch.com/errors#missing-document-id",
    },
    "duration": "PT1S",
    "enqueuedAt": "2021-08-10T14:29:17.000000Z",
    "startedAt": "2021-08-10T14:29:18.000000Z",
    "finishedAt": "2021-08-10T14:29:19.000000Z"
}
```

Check your error message for more information.

## Is killing a Meilisearch process safe?

Killing Meilisearch is **safe**, even in the middle of a process (ex: adding a batch of documents). When you restart the server, it will start the task from the beginning.
More information in the [asynchronous operations guide](/learn/advanced/asynchronous_operations.md).

## Does Meilisearch deliver an interface to search in my documents?

Yes, a search preview is available on the default address and port of your Meilisearch instance.

All you need to do is open your web browser and enter Meilisearch’s address to visit it. This leads you to a web page with a search bar that allows you to search in a selected index.

Since the production environment requires an API key for searching, the search preview is only available in [development mode](/learn/configuration/instance_options.md#environment).

Here is more information about [Meilisearch's search preview](/learn/what_is_meilisearch/search_preview.md).

## I do not understand the relevancy of my search results.

The search responses are sorted according to a set of consecutive rules called ranking rules.
Here is more information about the [relevancy of Meilisearch](/learn/core_concepts/relevancy.md).

Meilisearch applies these ranking rules in default order. This order can be modified. Furthermore, these rules can be deleted and new ones can be added.
All of the ranking rules can be modified via the [dedicated routes in the Meilisearch API](/reference/api/ranking_rules.md).

## Do you provide a public roadmap for Meilisearch and its integration tools?

Yes, as Meilisearch and its integration tools are opensource, we maintain a [public roadmap](https://roadmap.meilisearch.com/) for the general features we plan to do.

For more accurate features and issues, everything is detailed in the issues of all our [GitHub repositories](https://github.com/meilisearch/meilisearch/issues).

## How can I contact the Meilisearch team?

See our [contact page](/learn/what_is_meilisearch/contact.md).

## I have just updated Meilisearch, and I am getting an error: "Cannot open database, expected Meilisearch engine version..."

Until our first stable release (v1.0), Meilisearch minor versions are not compatible with each other, i.e. **every new version is considered breaking** with the small exception of bug-fixing patches. To fix this error, simply delete your database folder (`data.ms` by default) and re-index your documents with the current-version engine. See [updating Meilisearch](/learn/advanced/updating.md) for more information.

## What are the recommended requirements for hosting a Meilisearch instance?

**The short answer: we don't know yet!**

Indexing documents is a highly complex process, making it difficult to accurately estimate the size and memory use of a Meilisearch database. At this stage, our engine is changing constantly, which means benchmarks are constantly out of date.

Once our engine is completely stable (v1), we will provide detailed benchmarks with different datasets. Until then, read on to learn how to optimize your Meilisearch instance.

### Memory usage

There are two things that can cause your memory usage (RAM) to spike:

1. Adding documents
2. Updating index settings (if index contains documents)

To reduce memory use and indexing time, follow this best practice: **always update index settings before adding your documents**. This avoids unnecessary double-indexing.

### Disk usage

The following factors have a great impact on the size of your database (in no particular order):

- The number of documents
- The size of documents
- The number of searchable fields
- The number of filterable fields
- The size of each update
- The number of different words present in the dataset

:::tip
Beware heavily multi-lingual datasets and datasets with many unique words, such as IDs or URLs, as they can slow search speed and greatly increase database size. If you do have ID or URL fields, [make them non-searchable](/reference/api/searchable_attributes.md#update-searchable-attributes) unless they are useful as search criteria.
:::

### Search speed

Because Meilisearch uses a [memory map](/learn/advanced/storage.md#lmdb), **search speed is based on the ratio between RAM and database size**. In other words:

- A big database + a small amount of RAM => slow search
- A small database + tons of RAM => lightning fast search

Meilisearch also uses disk space as [virtual memory](/learn/advanced/storage.md#memory-usage). This disk space does not correspond to database size; rather, it provides speed and flexibility to the engine by allowing it to go over the limits of physical RAM.

At this time, the number of CPU cores has no direct impact on index or search speed. However, **the more cores you provide to the engine, the more search queries it will be able to process at the same time**.

::: tip
Our new engine (currently in development) **will support multi-core indexing at launch**.
:::

#### Speeding up Meilisearch

Meilisearch is designed to be fast (≤50ms response time), so speeding it up is rarely necessary. However, if you find that your Meilisearch instance is querying slowly, there are two primary methods to speed it up:

1. Increase the amount of RAM (or virtual memory)
2. Reduce the size of the database

In general, we recommend the former. However, if you need to reduce the size of your database for any reason, keep in mind that:

- **More relevancy rules => a larger database**
  - The proximity [ranking rule](/learn/core_concepts/relevancy.md#ranking-rules) alone can be responsible for almost 80% of database size
- Adding many attributes to [filterableAttributes](/learn/configuration/settings.md#filterable-attributes) also consumes a large amount of disk space
- Multi-lingual datasets are costly, so split your dataset—one language per index
- [Stop words](/reference/api/stop_words.md) are essential to reducing database size
- Not all attributes need to be [searchable](/learn/configuration/displayed_searchable_attributes.md#searchable-fields). Avoid indexing unique IDs.

## Why does Meilisearch send data to Segment? Does Meilisearch track its users?

**Meilisearch will never track or identify individual users**. That being said, we do use Segment to collect anonymous data about user trends, feature usage, and bugs.

You can read more about what metrics we collect, why we collect them, and how to disable it on our [telemetry page](/learn/what_is_meilisearch/telemetry.md). Issues of transparency and privacy are very important to us, so if you feel we are lacking in this area please [open an issue](https://github.com/meilisearch/documentation/issues/new/choose) or send an email to our dedicated email address: [privacy@meilisearch.com](mailto:privacy@meilisearch.com).

## Why does Meilisearch crash when I try to add documents?

Crashes that occur when trying to add documents are connected to Meilisearch's indexer. For more information and possible solutions, read [our dedicated article on indexation](/learn/advanced/indexation.md#memory-crashes).

## How can I speed up indexation when adding documents?

Indexation is one of Meilisearch's most resource-intensive processes. For more information on how to optimize it, take a look at [our dedicated indexation guide](/learn/advanced/indexation.md#improving-indexation-performance).
