---

sidebarDepth: 2

---

# Comparison to alternatives

There are many search engines on the web, both open-source and otherwise. Deciding which search solution is the best fit for your project is very important, but also difficult. In this article, we'll go over the differences between Meilisearch and other search engines:

- In the [comparison table](#comparison-table), we present a general overview of the differences between Meilisearch and other search engines

- In the [approach comparison](#approach-comparison), instead, we focus on how Meilisearch measures up against [ElasticSearch](#meilisearch-vs-elasticsearch) and [Algolia](#meilisearch-vs-algolia), currently two of the biggest solutions available in the market

- Finally, we end this article with [an in-depth analysis of the broader search engine landscape](#a-quick-look-at-the-search-engine-landscape)

::: note
Please be advised that many of the search products described below are constantly evolving—just like Meilisearch. These are only our own impressions, and may not reflect recent changes. If something appears inaccurate, please don't hesitate to open an [issue or pull request](https://github.com/meilisearch/documentation).
:::

## Comparison table

### General overview

|   | Meilisearch | Algolia | Typesense | Elasticsearch |
|---|:----:|:----:|:-----:|:----:|
| Source code licensing | [MIT](https://choosealicense.com/licenses/mit/) <br> (Fully open-source) |  Closed-source  | [GPL-3](https://choosealicense.com/licenses/gpl-3.0/) <br> (Fully open-source) | SSPL <br>([Not open-source](https://opensource.org/node/1099))  |
| Built with | Rust <br> [Check out why we believe in Rust](https://www.abetterinternet.org/docs/memory-safety/). | C++ | C++ | Java |
| Data storage | Disk with Memory Mapping -- Not limited by RAM | Limited by RAM | Limited by RAM | Disk with RAM cache |

### Features

#### Integrations and SDKs

Note: we are only listing libraries officially supported by the internal teams of each different search engine.

Can't find a client you'd like us to support? [Submit your idea or vote for it](https://roadmap.meilisearch.com/tabs/1-under-consideration) 😇

| SDK      | Meilisearch | Algolia | Typesense | Elasticsearch |
|---|:---:|:----:|:---:|:---:|
| REST API | ✅ | ✅ | ✅ | ✅ |
| [JavaScript client](https://github.com/meilisearch/meilisearch-js) |  ✅        |   ✅    |     ✅    |       ✅      |
| [PHP client](https://github.com/meilisearch/meilisearch-php)                  |  ✅         |   ✅     |     ✅      |        ✅       |
| [Python client](https://github.com/meilisearch/meilisearch-python)              | ✅          | ✅      |        ✅   |       ✅        |
| [Ruby client](https://github.com/meilisearch/meilisearch-ruby)              | ✅          | ✅      |        ✅   |       ✅        |
| [Java client](https://github.com/meilisearch/meilisearch-java)              | ✅          | ✅      |        ✅   |       ✅        |
| [Swift client](https://github.com/meilisearch/meilisearch-swift)              | ✅          | ✅      |   🔶 <br> WIP  |       ❌        |
| [.NET client](https://github.com/meilisearch/meilisearch-dotnet)               | ✅          | ✅      |        ❌   |       ✅        |
| [Rust client](https://github.com/meilisearch/meilisearch-rust)             | ✅          | ❌      |        🔶 <br> WIP  |       ✅        |
| [Go client](https://github.com/meilisearch/meilisearch-go)              | ✅          | ✅     |        ✅   |       ✅        |
| [Dart client](https://github.com/meilisearch/meilisearch-dart)               | ✅          | ✅     |        ✅   |       ❌        |
| [Symfony](https://github.com/meilisearch/meilisearch-symfony) | ✅ | ✅ | ❌ | ❌ |
| [Django](https://roadmap.meilisearch.com/c/60-django) | ❌ | ✅ | ❌ | ❌ |
| [Rails](https://github.com/meilisearch/meilisearch-rails) | ✅ | ✅ | 🔶 <br>WIP | ✅ ||
| [Official Laravel Scout Support](https://github.com/laravel/scout) | ✅ | ✅ | ❌ | ❌ |
| [UI Search Kit](https://github.com/meilisearch/instant-meilisearch) | ✅ | ✅ | ✅ | ✅ |
| [Docsearch](https://github.com/meilisearch/docs-scraper) | ✅ | ✅ | ✅ | ❌ |
| [Strapi](https://github.com/meilisearch/strapi-plugin-meilisearch) | ✅ | ✅ | ❌ | ❌ |
| [Gatsby](https://github.com/meilisearch/gatsby-plugin-meilisearch) | ✅ | ✅ | ✅ | ❌ |
| [Firebase](https://github.com/meilisearch/firestore-meilisearch) | ✅ | ✅ | ✅ | ❌ |

#### Configuration

##### Document schema

|         | Meilisearch | Algolia | Typesense | Elasticsearch |
|---|:---:|:----:|:---:|:---:|
| Schemaless | ✅ | ✅ | 🔶 <br>Automatic schema detection is supported but needs to be specified | ✅ |
| Automatic document ID detection | ✅ | ❌ | ❌ | ❌ |
| Native document formats | `JSON`, `NDJSON`, `CSV` | `JSON` | `JSON`, `NDJSON` | `JSON`, `NDJSON`, `CSV` |

##### Relevancy

|   | Meilisearch | Algolia | Typesense | Elasticsearch |
|---|:---:|:----:|:---:|:---:|
| Typo tolerant  | ✅ | ✅ | ✅ | 🔶 <br>Needs to be specified by fuzzy queries |
| Orderable ranking rules | ✅ | ✅ | 🔶 <br>Tie-breaking order is limited by a unique scoring rule | ❌|
| Custom rules | ✅ | ✅ | 🔶 <br>Limited to one default sorting rule | 🔶 <br>Function score query
| Query field weights | ✅ | ✅ | ✅ | ✅ |
| Synonyms | ✅ | ✅ | ✅ | ✅ |
| Stop words | ✅ | ✅ | ❌ | ✅ |
| Automatic language detection | ✅ | ✅ | ❌ | ❌ |
| All language supports | ✅ | ✅ | ❌ <br> Only space separated | ✅ |

##### Security

|   | Meilisearch | Algolia | Typesense | Elasticsearch |
|---|:---:|:----:|:---:|:---:|
| API Key Management | ✅ | ✅ | ✅ | ✅ |
| Tenant tokens & multi-tenant indexes | ✅ <br> [Multitenancy support](/learn/security/tenant_tokens.md) | ✅  <br> Hard filters are not configurable per index for an end-user tenant key | ✅ <br> Hard filters are not configurable per index for an end-user tenant key | ✅ <br> Role-based |

##### Search

|   | Meilisearch | Algolia | Typesense | Elasticsearch |
|---|:---:|:----:|:---:|:---:|
| Placeholder search | ✅ | ✅ | ✅ | ✅ |
| Multi-index search | **Q3 2022** | ✅ | ✅ | ✅ |
| Exact phrase search | ✅ | ✅ | ❌ | ✅ |
| Geo search |  ✅  | ✅ | ✅ | ✅ |
| Sort by  |  ✅  | 🔶 <br> Limited to one `sort_by` rule per index. Indexes may have to be duplicated for each sort field and sort order | 🔶 <br> Does not support sort on string field | ✅ |
| Filtering |  ✅ <br> Support complex filter queries with an SQL-like syntax.  | 🔶 <br> Does not support `OR` operation across multiple fields | 🔶 <br> Does not support `OR` operation across multiple fields | ✅ |
| Faceted search |  ✅ | ✅ | ✅ | ✅ |
| Distinct attributes <br><div style="color:#A9A9A9;font-size:0.9em;">De-duplicate documents by a field value</div>| ✅ | ✅ | ✅  | ✅ |
| Grouping <br><div style="color:#A9A9A9;font-size:0.9em;">Bucket documents by field values</div> | ❌ | ✅ | ✅  | ✅ |

##### Visualize

|   | Meilisearch | Algolia | Typesense | Elasticsearch |
|---|:---:|:----:|:---:|:---:|
| [Mini Dashboard](https://github.com/meilisearch/mini-dashboard) | ✅ | 🔶 <br> Cloud product | 🔶 <br> Cloud product | ✅ |

#### Deployment

|   | Meilisearch | Algolia | Typesense | Elasticsearch |
|---|:---:|:----:|:---:|:---:|
| Self-hosted | ✅  | ❌  | ✅  | ✅ |
| Official 1-click deploy | ✅ <br> [DigitalOcean](https://marketplace.digitalocean.com/apps/meilisearch) <br> [Platform.sh](https://console.platform.sh/projects/create-project?template=https://raw.githubusercontent.com/platformsh/template-builder/master/templates/meilisearch/.platform.template.yaml) | ❌ | 🔶 <br>Only for the cloud-hosted solution | ❌ |
| Official cloud-hosted solution | [Join the beta](https://meilisearch.typeform.com/to/FtnzvZfh?typeform-source=comparative-table) | ✅ | ✅ | ✅ |
| High availability | Available with [Meilisearch Cloud](https://meilisearch.typeform.com/to/FtnzvZfh?typeform-source=www.meilisearch.com) | ✅ | ✅ | ✅ |
| Run-time dependencies | None | N/A | None | None |
| Backward compatibility | ✅ | N/A | ✅ | ✅ |
| Upgrade path | Documents need to be reindexed | N/A  | Documents need to be reindexed | Documents need to be reindexed |

### Limits

|  | Meilisearch | Algolia | Typesense | Elasticsearch |
|---|:---:|:----:|:---:|:---:|
| Maximum number of indexes | No limitation | 1000, increasing limit possible by contacting support | No limitation | No limitation |
| Maximum index size | 100GB default, configurable  | 128Gb | Constrained by RAM | No limitation |
| Maximum words per attribute | No limitation | No limitation | No limitation | No limitation |
| Maximum document size | No limitation | 100KB, configurable | No limitation | 100KB default, configurable  |

### Community

|  | Meilisearch | Algolia | Typesense | Elasticsearch |
|---|:---:|:----:|:---:|:---:|
| GitHub stars of the main project | 27K | N/A | 10K | 60K |
| Number of contributors on the main project | 75 | N/A | 20 | 1,700 |
| Public Slack community size | 1.5K | N/A | 700 | 14K |

### Support

|  | Meilisearch | Algolia | Typesense | Elasticsearch |
|---|:---:|:----:|:---:|:---:|
| Status page | ✅ | ✅ | ✅ | ✅ |
| Free support channels | Instant messaging / chatbox (2-3h delay),<br> emails, <br> public Slack community, <br> GitHub issues & discussions,<br> Slack Connect | Instant messaging / chatbox, <br> public community forum |  Instant messaging/chatbox (24h-48h delay),<br> public Slack community, <br> GitHub issues. | Public Slack community, <br> public community forum,<br> GitHub issues |
| Paid support channels | _Support is free!_ | Emails | Emails, <br> phone, <br> private Slack | Web support, <br> emails, <br> phone |

## Approach comparison

### Meilisearch vs Elasticsearch

Elasticsearch has been designed as a backend search engine and, although it is not at first suited for this purpose, is commonly used to build search bars for the end-users.
Unlike Elasticsearch, which is a general search engine, Meilisearch focuses on delivering a specific kind of features.

Elasticsearch can handle search through massive amounts of data and perform text analysis. In order to make it effective for end-user searching, you need to spend time understanding more about how Elasticsearch works internally to be able to customize and tailor it to fit your needs.
Meilisearch is intended to deliver performant instant search experiences aimed at end-users. However, processing complex queries or analyzing very large datasets is not possible.

Elasticsearch can sometimes be too slow if you want to provide a full instant search experience. Most of the time, it is significantly slower in returning search results compared to Meilisearch.
Meilisearch is a perfect choice if you need a simple and easy tool to deploy a typo-tolerant search bar that provides prefix searching capability, makes search intuitive for users, and returns results instantly with near-perfect relevance.

### Meilisearch vs Algolia

Meilisearch was inspired by Algolia's product and the algorithms behind it. We indeed studied most of the algorithms and data structures described in their blog posts in order to implement our own. Meilisearch is thus a new search engine based on the work of Algolia and recent research papers.

Meilisearch provides similar features and reaches the same level of relevance just as quickly as its competitor.

If you are a current Algolia user considering a switch to Meilisearch, you may be interested in our [migration guide](/learn/getting_started/algolia_migration.md).

#### Key similarities

Some of the most significant similarities between Algolia and Meilisearch are:

- [Features](/learn/what_is_meilisearch/overview.md#features) such as search-as-you-type, typo tolerance, faceting, etc.
- Fast results targeting an instant search experience (answers < 50 milliseconds)
- Schemaless indexing
- Support for all JSON data types
- Asynchronous API
- Similar query response

#### Key differences

Contrary to Algolia, Meilisearch is open-source and can be forked or self-hosted.

Additionally, Meilisearch is written in Rust, a modern systems-level programming language. Rust provides speed, portability, and flexibility, which makes the deployment of our search engine inside virtual machines, containers, or even [Lambda@Edge](https://aws.amazon.com/lambda/edge/) a seamless operation.

#### Pricing

The [pricing model for Algolia](https://www.algolia.com/pricing/) is based on the number of records kept and the number of API operations performed. It can be prohibitively expensive for small and medium-sized businesses.

Meilisearch is **open-source** and can be **self-hosted**, but also offers a cloud-hosted product analogous to Algolia's service: [Meilisearch Cloud](https://cloud.meilisearch.com/login). Unlike Algolia, [pricing of Meilisearch Cloud](https://www.meilisearch.com/pricing) follows a set hourly rate based on the computing resources chosen, with no per-record or per-search fees. You can send your server as much traffic or data as it can manage.

## A quick look at the search engine landscape

### Open source

#### Lucene

Apache Lucene is a free and open-source search library used for indexing and searching full-text documents. It was created in 1999 by Doug Cutting, who had previously written search engines at Xerox's Palo Alto Research Center (PARC) and Apple. Written in Java, Lucene was developed to build web search applications such as Google and DuckDuckGo, the last of which still uses Lucene for certain types of searches.

Lucene has since been divided into several projects:

- **Lucene itself**: the full-text search library.
- **Solr**: an enterprise search server with a powerful REST API.
- **Nutch**: an extensible and scalable web crawler relying on Apache Hadoop.

Since Lucene is the technology behind many open source or closed source search engines, it is considered as the reference search library.

#### Sonic

Sonic is a lightweight and schema-less search index server written in Rust. Sonic cannot be considered as an out-of-the-box solution, and compared to Meilisearch, it does not ensure relevancy ranking. Instead of storing documents, it comprises an inverted index with a Levenshtein automaton. This means any application querying Sonic has to retrieve the search results from an external database using the returned IDs and then apply some relevancy ranking.

Its ability to run on a few MBs of RAM makes it a minimalist and resource-efficient alternative to database tools that can be too heavyweight to scale.

#### Typesense

Like Meilisearch, Typesense is a lightweight open-source search engine optimized for speed. We are currently re-evaluating its features and functionality to better understand how it compares with Meilisearch.

#### Lucene derivatives

#### Lucene-Solr

Solr is a subproject of Apache Lucene, created in 2004 by Yonik Seeley, and is today one of the most widely used search engines available worldwide. Solr is a search platform, written in Java, and built on top of Lucene. In other words, Solr is an HTTP wrapper around Lucene's Java API, meaning you can leverage all the features of Lucene by using it. In addition, Solr server is combined with Solr Cloud, providing distributed indexing and searching capabilities, thus ensuring high availability and scalability. Data is shared but also automatically replicated.
Furthermore, Solr is not only a search engine; it is often used as a document-structured NoSQL database. Documents are stored in collections, which can be comparable to tables in a relational database.

Due to its extensible plugin architecture and customizable features, Solr is a search engine with an endless number of use cases even though, since it can index and search documents and email attachments, it is specifically popular for enterprise search.

#### Bleve & Tantivy

Bleve and Tantivy are search engine projects, respectively written in Golang and Rust, inspired by Apache Lucene and its algorithms (e.g., tf-idf, short for term frequency-inverse document frequency). Such as Lucene, both are libraries to be used for any search project; however they are not ready-to-use APIs.

#### Elasticsearch

Elasticsearch is a search engine based on the Lucene library and is most popular for full-text search. It provides a REST API accessed by JSON over HTTP. One of its key options, called index sharding, gives you the ability to divide indexes into physical spaces in order to increase performance and ensure high availability. Both Lucene and Elasticsearch have been designed for processing high-volume data streams, analyzing logs, and running complex queries. You can perform operations and analysis (e.g., calculate the average age of all users named "Thomas") on documents that match a specified query.

Today, Lucene and Elasticsearch are dominant players in the open-source search engine landscape. They both are solid solutions for a lot of different use cases in search, and also for building your own recommendation engine. They are good general products, but they require to be configured properly to get similar results to those of Meilisearch or Algolia.

### Closed source

#### Algolia

Algolia is a company providing a search engine on a SaaS model. Its software is closed source. In its early stages, Algolia offered mobile search engines that could be embedded in apps, facing the challenge of implementing the search algorithms from scratch. From the very beginning, the decision was made to build a search engine directly dedicated to the end-users, i.e., implementing search within mobile apps or websites.
Algolia successfully demonstrated over the past few years how critical tolerating typos was in order to improve the users' experience, and in the same way, its impact on reducing bounce rate and increasing conversion.

Apart from Algolia, a wide choice of SaaS products are available on the Search Engine Market. Most of them use Elasticsearch and fine-tune its settings in order to have a custom and personalized solution.

#### Swiftype

Swiftype is a search service provider specialized in website search and analytics. Swiftype was founded in 2012 by Matt Riley and Quin Hoxie, and is now owned by Elastic since November 2017. It is an end-to-end solution built on top of Elasticsearch, meaning it has the ability to leverage the Elastic Stack.

#### Doofinder

Doofinder is a paid on-site search service that is developed to integrate into any website with very little configuration. Doofinder is used by online stores to increase their sales, aiming to facilitate the purchase process.

## Conclusions

Each Search solution fits best with the constraints of a particular use case. Since each type of search engine offers a unique set of features, it wouldn't be easy nor relevant to compare their performance. For instance, it wouldn't be fair to make a comparison of speed between Elasticsearch and Algolia over a product-based database. The same goes for a very large full text-based database.

We cannot, therefore, compare ourselves with Lucene-based or other search engines targeted to specific tasks.

In the particular use case we cover, the most similar solution to Meilisearch is Algolia.

While Algolia offers the most advanced and powerful search features, this efficiency comes with an expensive pricing. Moreover, their service is marketed to big companies.

Meilisearch is dedicated to all types of developers. Our goal is to deliver a developer-friendly tool, easy to install, and to deploy. Because providing an out-of-the-box awesome search experience for the end-users matters to us, we want to give everyone access to the best search experiences out there with minimum effort and without requiring any financial resources.

Usually, when a developer is looking for a search tool to integrate into their application, they will go for ElasticSearch or less effective choices. Even if Elasticsearch is not best suited for this use case, it remains a great open-source solution. However, it requires technical know-how to execute advanced features and hence more time to customize it to your business.

We aim to become the default solution for developers.
