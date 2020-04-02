# Comparison to alternatives

## About MeiliSearch

MeiliSearch has been designed to be a ready-to-go open source solution and deliver an intuitive and instantaneous search experience. As the amount of information available on the websites increases as time goes by, it is essential to provide users with the most relevant results. Since many closed source search engines and open source alternatives can be used, determining which one to install is critical and may not seem easy at first.

The present article covers a comparison of alternatives to MeiliSearch, i.e., available search technologies to be considered when planning to implement a search bar.

## Comparisons

### MeiliSearch vs. Elasticsearch

Elasticsearch has been designed as a backend search engine and, although it is not at first suited for this purpose, is commonly used to build search bars for the end-users.
Unlike Elasticsearch, which is a general search engine, MeiliSearch focuses on delivering a specific kind of features.

Elasticsearch can handle search through massive amounts of data and perform text analysis. In order to make it effective for end-user searching, you need to spend time understanding more about how Elasticsearch works internally to be able to customize and tailor it to fit your needs.
MeiliSearch is intended to deliver performant instant search experiences aimed at end-users. However, processing complex queries or analyzing very large datasets is not possible.

Elasticsearch can sometimes be too slow if you want to provide a full instant search experience. Most of the time, it is significantly slower in returning search results compared to MeiliSearch.
MeiliSearch is a perfect choice if you need a simple and easy tool to deploy a typo-tolerant search bar that provides a prefix searching capability, makes search intuitive for users, and returns them their results instantly with near-perfect relevance.

### MeiliSearch vs. Typesense

[Typesense uses a default_sorting_field](https://typesense.org/docs/0.11.1/guide/#ranking-relevance) on each document, it means that before indexing your documents you need to compute a relevancy score for Typesense to be able to sort them based on your needs.
On the other hand, [MeiliSearch uses a bucket sort](/guides/main_concepts/relevancy.md), which means that there is a default relevancy algorithm based on the proximity of words in the documents, the fields in which the words are found and the number of typos. And you can still add your own custom rules if you want to alter the default search behavior.

### MeiliSearch vs. Algolia

MeiliSearch was inspired by Algolia's product and the algorithms behind it. We indeed studied most of the algorithms and data structures described in their blog posts in order to implement our own. MeiliSearch is thus a new search engine based on the work of Algolia and recent research papers.
It provides similar features and reaches the same level of relevance just as quickly as its predecessor.

Contrary to Algolia, MeiliSearch is open-source and written in Rust, a systems-level and modern programming language, that allows to rapidly build features. Rust also enables portability and flexibility, which makes the deployment of our search engines inside Virtual Machines, containers, or even Lambda@Edge, a seamless operation.

One of Algolia's major assets is the robust worldwide infrastructure that they offer to their customers.
MeiliSearch currently delivers a search engine and is not in a position to provide a competitive infrastructure yet. However, we aim it to be much more simple to deploy and maintain than Algolia's.

## A Quick Look at the Search Engine Landscape

### Open Source

#### Lucene

Apache Lucene is a free and open-source search library, written in Java, used for the full-text indexing and search of documents. This project was first created in 1999 by Doug Cutting, who had previously written search engines at Xerox's Palo Alto Research Center (PARC) and Apple. Since Lucene has been developed to build web search applications such as Google, you can see that DuckDuckGo still uses it for some specific searches.

Lucene has since been divided into several projects:

- **Lucene itself**: the full-text search library.
- **Solr**: an enterprise search server with a powerful REST API.
- **Nutch**: an extensible and scalable web crawler relying on Apache Hadoop.

Since Lucene is the technology behind many open source or closed source search engines, it is considered as the reference search library.

#### Sonic

Sonic is a lightweight and schema-less search index server written in Rust. Sonic cannot be considered as an out-of-the-box solution and, compared to MeiliSearch, it does not ensure relevancy ranking. Indeed, it does not store any documents but is comprised of an inverted index with a Levenshtein automaton, which means any application querying Sonic has to retrieve the search results from an external database using the IDs that are returned and then apply some relevancy ranking.
Its ability to run on a few MBs of RAM makes it a minimalist and resource-efficient alternative to database tools that can be too heavyweight to scale.

#### Typesense

Another simple search engine is Typesense, which has been designed and optimized for speed. Particular attention has been given to ease-of-use. Thus, Typesense aims to be simple to set-up and focus on developer productivity and experience by providing a clean API. It is best suited for light projects.

#### Lucene derivatives

#### Lucene-Solr

Solr is a subproject of Apache Lucene, created in 2004 by Yonik Seeley, and is today one of the most widely used search engines available worldwide. Solr is a search platform, written in Java, and built on top of Lucene. In other words, Solr is an HTTP wrapper around Lucene's Java API, meaning you can leverage all the features of Lucene by using it. In addition, Solr server is combined with Solr Cloud, providing distributed indexing and searching capabilities, thus ensuring high availability and scalability. Data is shared but also automatically replicated.
Furthermore, Solr is not only a search engine; it is often used as a document-structured NoSQL database. Documents are stored in collections, which can be comparable to tables in a relational database.

Due to its extensible plugin architecture and customizable features, Solr is a search engine with an endless number of use cases even though, since it can index and search documents and email attachments, it is specifically popular for enterprise search.

#### Bleve & Tantivy

Bleve and Tantivy are search engine projects, respectively written in Golang and Rust, inspired by Apache Lucene and its algorithms (e.g., tf-idf, short for term frequency-inverse document frequency). Such as Lucene, both are libraries to be used for any search project; however they are not ready-to-use APIs.

#### Elasticsearch

Elasticsearch is a search engine based on the Lucene library and is most popular for full-text search. It provides a REST API accessed by JSON over HTTP. One of its key options, called index sharding, gives you the ability to divide indexes into physical spaces in order to increase performance and ensure high availability. Both Lucene and Elasticsearch have been designed for processing high-volume data streams, analyzing logs, and running complex queries. You can perform operations and analysis (e.g., calculate the average age of all users named "Thomas") on documents that match a specified query.

Today, Lucene and Elasticsearch are dominant players in the open-source search engine landscape. They both are solid solutions for a lot of different use cases in search, and also for building your own recommendation engine. They are good general products, but they require to be configured properly to get similar results to those of MeiliSearch or Algolia.

### Closed Source

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

In the particular use case we cover, the most similar solutions to MeiliSearch are Algolia and Typesense. The three of them are search-as-you-type relevant search engines.

Typesense is a great tool but is not recommended for achieving a lot of operations with minimal configuration.

While Algolia offers the most advanced and powerful search features, this efficiency comes with an expensive pricing. Moreover, their service is marketed to big companies.

MeiliSearch is dedicated to all types of developers. Our goal is to deliver a developer-friendly tool, easy to install, and to deploy. Because providing an out-of-the-box awesome search experience for the end-users matters to us, we want to give everyone access to the best search experiences out there with minimum effort and without requiring any financial resources.

Usually, when a developer is looking for a search tool to integrate into their application, they will go for ElasticSearch or less effective choices. Even if Elasticsearch is not best suited for this use case, it remains a great open-source solution. However, it requires technical know-how to execute advanced features and hence more time to customize it to your business.

We aim to become the default solution for developers.
