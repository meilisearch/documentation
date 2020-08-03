---
permalink: /faq
---

# FAQ

This FAQ is still a work in progress.
If you have any questions we want to hear from you. Your feedback will help us improve this page!

## Table of contents

- [I have never used a search engine before. Can I use MeiliSearch anyway?](/faq/faq.md#i-have-never-used-a-search-engine-before-can-i-use-meilisearch-anyway)
- [Do I need to configure MeiliSearch to get it working?](/faq/faq.md#do-i-need-to-configure-meilisearch-to-get-it-working)
- [How to know if MeiliSearch perfectly fits my use cases?](/faq/faq.md#how-to-know-if-meilisearch-perfectly-fits-my-use-cases)
- [Which languages can MeiliSearch handle?](/faq/faq.md#which-languages-can-meilisearch-handle)
- [Do you provide a real dataset to test MeiliSearch?](/faq/faq.md#do-you-provide-a-real-dataset-to-test-meilisearch)
- [I did a call to an API route, and I only got an `updateId` as a response. What does it mean?](/faq/faq.md#i-did-a-call-to-an-api-route-and-i-only-got-an-updateid-as-a-response-what-does-it-mean)
- [I am trying to add my documents but I keep receiving a `400 - Invalid data` response.](/faq/faq.md#i-am-trying-to-add-my-documents-but-i-keep-receiving-a-400-invalid-data-response)
- [My document upload failed with the `document id is missing` error.](/faq/faq.md#my-document-upload-failed-with-the-document-id-is-missing-error)
- [I have uploaded my documents, but I get no result when I search in my index.](/faq/faq.md#i-have-uploaded-my-documents-but-i-get-no-result-when-i-search-in-my-index)
- [Does MeiliSearch deliver an interface to search in my documents?](/faq/faq.md#does-meilisearch-deliver-an-interface-to-search-in-my-documents)
- [I do not understand the relevancy of my search results.](/faq/faq.md#i-do-not-understand-the-relevancy-of-my-search-results)
- [Do you provide a public roadmap for MeiliSearch and its integration tools?](/faq/faq.md#do-you-provide-a-public-roadmap-for-meilisearch-and-its-integration-tools)
- [How can I contact the MeiliSearch team?](/faq/faq.md#how-can-i-contact-the-meilisearch-team)

## I have never used a search engine before. Can I use MeiliSearch anyway?

Of course! No knowledge of ElasticSearch or Solr is required to use MeiliSearch.

MeiliSearch is really **easy to use** and thus accessible to all kinds of developers.

[Take a quick tour](/guides/introduction/quick_start_guide.md) to learn the basics of MeiliSearch!

We also provide a lot of tools, including [SDKs](/resources/sdks.md), to help you integrate easily MeiliSearch in your project. We're adding new tools every day!

Plus, you can [contact us](/faq/faq.md#how-can-i-contact-the-meilisearch-team) if you need any help. We will answer for sure!

## Do I need to configure MeiliSearch to get it working?

MeiliSearch configuration works out-of-the-box. It means, by default, MeiliSearch configures necessary settings for providing a powerful and relevant search.

For example, without requiring any configuration, MeiliSearch is typo tolerant.
Type `craete an inedx` in the search bar of this documentation to experience the typo tolerance of our search engine.

To find out more about the relevancy of MeiliSearch, take a look at this detailed [explanation](/guides/main_concepts/relevancy.md#ranking-rules).

However, MeiliSearch is of course [highly customizable](/references/settings.md) in order to adapt the search to your needs by setting synonyms, stop words, and custom ranking rules.

## How to know if MeiliSearch perfectly fits my use cases?

Since MeiliSearch is an open-source and easy-to-use tool, you can give it a try using your data. Follow this [guide](/guides/introduction/quick_start_guide.md) to get a quick start!

Besides, we published a [comparison between MeiliSearch and other search engines](/resources/comparison_to_alternatives.md) with the goal of providing an overview of MeiliSearch alternatives.

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
You can check the status of the operation using the `updateId` via the [get update status route](/references/updates.md#get-an-update-status).
In addition, MeiliSearch delivers a global route to [track all your update status](/references/updates.md#get-all-update-status).
**This way, you will be informed if your action was processed or not, and <u>why</u>**.
:::

If you are curious about how the asynchronous part of MeiliSearch works, you can find more information [here](/guides/advanced_guides/asynchronous_updates.md).

## I am trying to add my documents but I keep receiving a `400 - Invalid data` response.

MeiliSearch API only accepts JSON format.
In case of a [document addition](/references/documents.md#add-or-replace-documents), only an array of objects is expected.

The `400 - Invalid data` response probably means that your data is not in an expected format.

Most common errors:

- Extraneous comma at the end of a line.
- Data is not an array of objects: for the [document addition route](/references/documents.md#add-or-replace-documents), MeiliSearch only accepts an array in the body even if there is only one document.

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
$ cat your_file.json | jq
```

:::

## My document upload failed with the `document id is missing` error.

::: note TLDR;
Most common reasons:

- A unique identifier in your document is missing.
- The unique identifier of your document is not well-formatted.
  :::

Each document is required to contain a unique identifier. This identifier attribute is the `primary key`.

How do I know the primary key of my index? [Check this route](/references/indexes.md#get-one-index). The `null` value means it has not been defined yet.

By default, the primary key will be inferred from the first document received. MeiliSearch will search for an attribute that contains the string `id` in a case-insensitive manner (e.g., `uid`, `MovieId`, `ID`, `123id123`). If none has been found, no documents will be added.

If you get a `document id is missing` error, the primary key was not recognized. This means your primary key is wrongly formatted. Sending primary key's name as a query parameter [when adding documents](/references/documents.md#add-or-replace-documents) should solve this issue.

Note that the primary key value must contain only `A-Z a-z 0-9` and `-_` characters.

Wrong:

```json
"id": "@BI+* ^5h2%"
```

Good:

```json
"id": "_Aabc012_"
```

See more [information about the primary key](/guides/main_concepts/documents.md#primary-key).

## I have uploaded my documents, but I get no result when I search in my index.

Your documents upload probably failed.
To understand what happened, please check this [answer](/faq/faq.md#i-did-a-call-to-an-api-route-and-i-only-got-an-updateid-as-a-response-what-does-it-mean).

## Does MeiliSearch deliver an interface to search in my documents?

Yes, a web interface is available on the default address and port of your MeiliSearch instance.

All you need to do is open your web browser and enter MeiliSearch’s address to visit it. This leads you to a web page with a search bar that allows you to search in a selected index.

Since the production environment requires an API-key for searching, the web interface is only available in [development mode](/guides/advanced_guides/configuration.md#environment).

Here is more information about the [MeiliSearch web interface](/guides/advanced_guides/web_interface.md).

## I do not understand the relevancy of my search results.

The search responses are sorted according to a set of consecutive rules called ranking rules.
Here is more information about the [relevancy of MeiliSearch](/guides/main_concepts/relevancy.md).

MeiliSearch applies these ranking rules in default order. This order can be modified. Furthermore, these rules can be deleted and new ones can be added.
All of the ranking rules can be modified via the [dedicated routes in the MeiliSearch API](/references/ranking_rules.md).

## Do you provide a public roadmap for MeiliSearch and its integration tools?

Yes, as MeiliSearch and its integration tools are opensource, we maintain a [public roadmap](https://github.com/orgs/meilisearch/projects/2) for the general features we plan to do.

For more accurate features and issues, everything is detailed in the issues of all our [GitHub repositories](https://github.com/meilisearch/MeiliSearch/issues).

## How can I contact the MeiliSearch team?

See our [contact page](/resources/contact.md).

## I have just updated MeiliSearch, and I am getting an error: "Cannot open database, expected MeiliSearch engine version..."

MeiliSearch minor versions are not compatible with each other because the way we represent data internally changes with the addition on new breaking features. To fix this, it suffice to delete your database folder (`data.ms` by default), and re-index your documents with the new version.
