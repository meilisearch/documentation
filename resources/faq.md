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

Plus, you can [contact us](/learn/what_is_meilisearch/contact.md) if you need any help.

## How to know if Meilisearch perfectly fits my use cases?

Since Meilisearch is an open-source and easy-to-use tool, you can give it a try using your data. Follow this [guide](/learn/getting_started/quick_start.md) to get a quick start!

Besides, we published a [comparison between Meilisearch and other search engines](/learn/what_is_meilisearch/comparison_to_alternatives.md) with the goal of providing an overview of Meilisearch alternatives.

## I am trying to add my documents but I keep receiving a `400 - Bad Request` response

The `400 - Bad request` response often means that your data is not in an expected format. You might have extraneous commas, mismatched brackets, missing quotes, etc. Meilisearch API accepts JSON, CSV, and NDJSON formats.

When [adding or replacing documents](/reference/api/documents.md#add-or-replace-documents), you must enclose them in an array even if there is only one new document.

## I have uploaded my documents, but I get no result when I search in my index

Your document upload probably failed. To understand why, please check the status of the document addition task using the returned [`taskUid`](/reference/api/tasks.md#get-one-task). If the task failed, the response should contain an `error` object.

Here is an example of a failed task:

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "failed",
    "type": "documentAdditionOrUpdate",
    "canceledBy": null,
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

## Do you provide a public roadmap for Meilisearch and its integration tools?

Yes, as Meilisearch and its integration tools are open source, we maintain a [public roadmap](https://roadmap.meilisearch.com/) for the general features we plan to do.

For more accurate features and issues, everything is detailed in the issues of all our [GitHub repositories](https://github.com/meilisearch/meilisearch/issues).

## What are the recommended requirements for hosting a Meilisearch instance?

**The short answer:**

The recommended requirements for hosting a Meilisearch instance will depend on many factors, such as the number of documents, the size of those documents, the number of filters/sorts you will need, and more. For a quick estimate to start with, try to use a machine that has at least ten times the disk space of your dataset.

**The long answer:**

Indexing documents is a complex process, making it difficult to accurately estimate the size and memory use of a Meilisearch database. There are a few aspects to keep in mind when optimizing your instance.

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
Beware heavily multi-lingual datasets and datasets with many unique words, such as IDs or URLs, as they can slow search speed and greatly increase database size. If you do have ID or URL fields, [make them non-searchable](/reference/api/settings.md#update-searchable-attributes) unless they are useful as search criteria.
:::

### Search speed

Because Meilisearch uses a [memory map](/learn/advanced/storage.md#lmdb), **search speed is based on the ratio between RAM and database size**. In other words:

- A big database + a small amount of RAM => slow search
- A small database + tons of RAM => lightning fast search

Meilisearch also uses disk space as [virtual memory](/learn/advanced/storage.md#memory-usage). This disk space does not correspond to database size; rather, it provides speed and flexibility to the engine by allowing it to go over the limits of physical RAM.

At this time, the number of CPU cores has no direct impact on index or search speed. However, **the more cores you provide to the engine, the more search queries it will be able to process at the same time**.

#### Speeding up Meilisearch

Meilisearch is designed to be fast (≤50ms response time), so speeding it up is rarely necessary. However, if you find that your Meilisearch instance is querying slowly, there are two primary methods to improve search performance:

1. Increase the amount of RAM (or virtual memory)
2. Reduce the size of the database

In general, we recommend the former. However, if you need to reduce the size of your database for any reason, keep in mind that:

- **More relevancy rules => a larger database**
  - The proximity [ranking rule](/learn/core_concepts/relevancy.md#ranking-rules) alone can be responsible for almost 80% of database size
- Adding many attributes to [`filterableAttributes`](/reference/api/settings.md#filterable-attributes) also consumes a large amount of disk space
- Multi-lingual datasets are costly, so split your dataset—one language per index
- [Stop words](/reference/api/settings.md#stop-words) are essential to reducing database size
- Not all attributes need to be [searchable](/learn/configuration/displayed_searchable_attributes.md#searchable-fields). Avoid indexing unique IDs.

## Why does Meilisearch send data to Segment? Does Meilisearch track its users?

**Meilisearch will never track or identify individual users**. That being said, we do use Segment to collect anonymous data about user trends, feature usage, and bugs.

You can read more about what metrics we collect, why we collect them, and how to disable it on our [telemetry page](/learn/what_is_meilisearch/telemetry.md). Issues of transparency and privacy are very important to us, so if you feel we are lacking in this area please [open an issue](https://github.com/meilisearch/documentation/issues/new/choose) or send an email to our dedicated email address: [privacy@meilisearch.com](mailto:privacy@meilisearch.com).
