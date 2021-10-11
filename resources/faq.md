---
permalink: /faq.html
---

# FAQ

This FAQ is still a work in progress.
If you have any questions we want to hear from you. Your feedback will help us improve this page!

#### Table of contents

[[toc]]

## I have never used a search engine before. Can I use MeiliSearch anyway?

Of course! No knowledge of ElasticSearch or Solr is required to use MeiliSearch.

MeiliSearch is really **easy to use** and thus accessible to all kinds of developers.

[Take a quick tour](/learn/getting_started/quick_start.md) to learn the basics of MeiliSearch!

We also provide a lot of tools, including [SDKs](/learn/what_is_meilisearch/sdks.md), to help you integrate easily MeiliSearch in your project. We're adding new tools every day!

Plus, you can [contact us](#how-can-i-contact-the-meilisearch-team) if you need any help. We will answer for sure!

## Do I need to configure MeiliSearch to get it working?

MeiliSearch configuration works out-of-the-box. It means, by default, MeiliSearch configures necessary settings for providing a powerful and relevant search.

For example, without requiring any configuration, MeiliSearch is typo tolerant.
Type `craete an index` in the search bar of this documentation to experience the typo tolerance of our search engine.

To find out more about the relevancy of MeiliSearch, take a look at this detailed [explanation](/learn/core_concepts/relevancy.md#ranking-rules).

However, MeiliSearch is of course [highly customizable](/reference/api/settings.md) in order to adapt the search to your needs by setting synonyms, stop words, and custom ranking rules.

## How to know if MeiliSearch perfectly fits my use cases?

Since MeiliSearch is an open-source and easy-to-use tool, you can give it a try using your data. Follow this [guide](/learn/getting_started/quick_start.md) to get a quick start!

Besides, we published a [comparison between MeiliSearch and other search engines](/learn/what_is_meilisearch/comparison_to_alternatives.md) with the goal of providing an overview of MeiliSearch alternatives.

## Which languages can MeiliSearch handle?

MeiliSearch works perfectly with English, kanji, and Romance languages.
If you have any hesitation about your language handling, please contact us.

## Do you provide a real dataset to test MeiliSearch?

For now, we provide this [movies dataset](https://github.com/meilisearch/MeiliSearch/blob/master/datasets/movies/movies.json). More datasets are coming soon!

## I did a call to an API route, and I only got an `updateId` as a response. What does it mean?

MeiliSearch is an **asynchronous API**.
It means that in many cases (e.g., documents addition), you will receive as server response a simple JSON containing only an `updateId` attribute. For example:

```json
{
  "updateId": 2
}
```

This kind of **successful response** indicates that the operation has been taken into account, but may not have been executed yet.

::: tip
You can check the status of the operation using the `updateId` via the [get update status route](/reference/api/updates.md#get-an-update-status).
In addition, MeiliSearch delivers a global route to [track all your update status](/reference/api/updates.md#get-all-update-status).
**This way, you will be informed if your action was processed or not, and <u>why</u>**.
:::

If you are curious about how the asynchronous part of MeiliSearch works, you can find more information [here](/learn/advanced/asynchronous_updates.md).

## I am trying to add my documents but I keep receiving a `400 - Bad Request` response.

MeiliSearch API accepts JSON, CSV, and NDJSON formats.
In case of a [document addition](/reference/api/documents.md#add-or-replace-documents), only an array of objects is expected.

The `400 - Bad request` response probably means that your data is not in an expected format.

Most common errors:

- Extraneous comma at the end of a line.
- Data is not an array of objects: for the [document addition route](/reference/api/documents.md#add-or-replace-documents), MeiliSearch only accepts an array in the body even if there is only one document.

Wrong:

```json
{ "id": 123, "title": "Pride and Prejudice" }
```

Good:

```json
[{ "id": 123, "title": "Pride and Prejudice" }]
```

:::tip
The [jq](https://github.com/stedolan/jq) command line tool can greatly help you check the format of your data.

```bash
cat your_file.json | jq
```

:::

## My document upload failed with the `document id is missing` error.

::: note TLDR;
Most common reasons:

- A unique identifier in your document is missing.
- The unique identifier of your document is not well-formatted.
  :::

Each document is required to contain a unique identifier. This identifier attribute is the `primary key`.

How do I know the primary key of my index? [Check this route](/reference/api/indexes.md#get-one-index). The `null` value means it has not been defined yet.

By default, the primary key will be inferred from the first document received. MeiliSearch will search for an attribute that contains the string `id` in a case-insensitive manner (e.g., `uid`, `MovieId`, `ID`, `123id123`). If none has been found, no documents will be added.

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

See more [information about the primary key](/learn/core_concepts/documents.md#primary-key).

## I have uploaded my documents, but I get no result when I search in my index.

Your document upload probably failed. To understand what happened, please check this [answer](#i-did-a-call-to-an-api-route-and-i-only-got-an-updateid-as-a-response-what-does-it-mean).

## Is killing a MeiliSearch process safe?

Killing MeiliSearch is **safe**, even in the middle of a process (ex: adding a batch of documents). When you restart the server, it will start the task from the beginning.
More information in the [asynchronous updates guide](/learn/advanced/asynchronous_updates.md).

## Does MeiliSearch deliver an interface to search in my documents?

Yes, a web interface is available on the default address and port of your MeiliSearch instance.

All you need to do is open your web browser and enter MeiliSearch’s address to visit it. This leads you to a web page with a search bar that allows you to search in a selected index.

Since the production environment requires an API-key for searching, the web interface is only available in [development mode](/reference/features/configuration.md#environment).

Here is more information about the [MeiliSearch web interface](/reference/features/web_interface.md).

## I do not understand the relevancy of my search results.

The search responses are sorted according to a set of consecutive rules called ranking rules.
Here is more information about the [relevancy of MeiliSearch](/learn/core_concepts/relevancy.md).

MeiliSearch applies these ranking rules in default order. This order can be modified. Furthermore, these rules can be deleted and new ones can be added.
All of the ranking rules can be modified via the [dedicated routes in the MeiliSearch API](/reference/api/ranking_rules.md).

## Do you provide a public roadmap for MeiliSearch and its integration tools?

Yes, as MeiliSearch and its integration tools are opensource, we maintain a [public roadmap](https://roadmap.meilisearch.com/) for the general features we plan to do.

For more accurate features and issues, everything is detailed in the issues of all our [GitHub repositories](https://github.com/meilisearch/MeiliSearch/issues).

## How can I contact the MeiliSearch team?

See our [contact page](/learn/what_is_meilisearch/contact.md).

## I have just updated MeiliSearch, and I am getting an error: "Cannot open database, expected MeiliSearch engine version..."

Until our first stable release (v1.0), MeiliSearch minor versions are not compatible with each other, i.e. **every new version is considered breaking** with the small exception of bug-fixing patches. To fix this error, simply delete your database folder (`data.ms` by default) and re-index your documents with the current-version engine. See [updating MeiliSearch](/learn/getting_started/installation.md#updating-meilisearch) for more information.

## What are the recommended requirements for hosting a MeiliSearch instance?

**The short answer: we don't know yet!**

Indexing documents is a highly complex process, making it difficult to accurately estimate the size and memory use of a MeiliSearch database. At this stage, our engine is changing constantly, which means benchmarks are constantly out of date.

Once our engine is completely stable (v1), we will provide detailed benchmarks with different datasets. Until then, read on to learn how to optimize your MeiliSearch instance.

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
- The number of faceted fields
- The size of each update
- The number of different words present in the dataset

:::tip
Beware heavily multi-lingual datasets and datasets with many unique words, such as IDs or URLs, as they can slow search speed and greatly increase database size. If you do have ID or URL fields, [make them non-searchable](/reference/api/searchable_attributes.md#update-searchable-attributes) unless they are useful as search criteria.
:::

### Search speed

Because MeiliSearch uses a [memory map](/reference/under_the_hood/storage.md#lmdb), **search speed is based on the ratio between RAM and database size**. In other words:

- A big database + a small amount of RAM => slow search
- A small database + tons of RAM => lightning fast search

MeiliSearch also uses disk space as [virtual memory](/reference/under_the_hood/storage.md#memory-usage). This disk space does not correspond to database size; rather, it provides speed and flexibility to the engine by allowing it to go over the limits of physical RAM.

At this time, the number of CPU cores has no direct impact on index or search speed. However, **the more cores you provide to the engine, the more search queries it will be able to process at the same time**.

::: tip
Our new engine (currently in development) **will support multi-core indexing at launch**.
:::

#### Speeding up MeiliSearch

MeiliSearch is designed to be fast (≤50ms response time), so speeding it up is rarely necessary. However, if you find that your MeiliSearch instance is querying slowly, there are two primary methods to speed it up:

1. Increase the amount of RAM (or virtual memory)
2. Reduce the size of the database

In general, we recommend the former. However, if you need to reduce the size of your database for any reason, keep in mind that:

- **More relevancy rules => a larger database**
  - The proximity [ranking rule](/learn/core_concepts/relevancy.md#ranking-rules) alone can be responsible for almost 80% of database size
- Adding many attributes to [filterableAttributes](/reference/features/settings.md#filterable-attributes) also consumes a large amount of disk space
- Multi-lingual datasets are costly, so split your dataset—one language per index
- [Stop words](/reference/features/stop_words.md) are essential to reducing database size
- Not all attributes need to be [searchable](/reference/features/field_properties.md#searchable-fields). Avoid indexing unique IDs.

## Why does MeiliSearch send data to Amplitude? Does MeiliSearch track its users?

**MeiliSearch will never track or identify individual users**. That being said, we do use Amplitude to collect anonymous data about user trends and bug reports.

You can read more about what metrics we collect, why we collect them, and how to disable it on our [telemetry page](/learn/what_is_meilisearch/telemetry.md). Transparency is very important to us, so if you feel we are lacking in this area please [open an issue](https://github.com/meilisearch/documentation/issues/new/choose) and let us know! ❤️

## Why does MeiliSearch crash when I try to add documents?

Most crashes during indexation are a result of a machine running out of RAM. This happens when your computer does not have enough memory to process your dataset.

Indexation also uses disk space. If the indexer runs out of available disk space, MeiliSearch will crash.

In both cases, we recommend adding new documents in smaller batches. Alternatively, you can try increasing your machine's RAM and/or available disk space.

This is a known issue that we are actively trying to improve.

## How can I speed up indexation when adding new documents?

You can improve indexation speed in two ways:

1. Indexation is a memory-intensive and multi-threaded operation. This means that **the more memory and processor cores available, the faster will MeiliSearch index new documents**.

2. **Bigger HTTP payloads are processed more quickly than smaller payloads**. For example, adding the same 100,000 documents in two batches of 50,000 documents will be quicker than in four batches of 25,000 documents. By default, MeiliSearch sets the maximum payload size to 100MB, but [you can change this value if necessary](/reference/features/configuration.md#payload-limit-size). That said, **the bigger the payload, the higher the memory consumption**. An instance may crash if it requires more RAM than is currently available in a machine.
