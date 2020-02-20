# Comparison to alternatives

## About MeiliSearch

MeiliSearch has been designed to be a ready-to-go open source solution and deliver an intuitive and instantaneous search experience. As the amount of information available on the websites increases as time goes by, it is essential to provide users with the most relevant results. Since many closed source search engines and open source alternatives can be used, determining which one to install is critical and may not seem easy at first.  
The present article covers a comparison of alternatives to MeiliSearch, i.e. available search technologies to be considered when planning to implement a search bar.  

## Comparisons

### MeiliSearch vs. Elasticsearch

Elasticsearch has been designed as a backend search engine and, although it is not at first suited for this purpose, is commonly used to build search bars for the end users.  
Unlike Elasticsearch which is a general search engine, MeiliSearch focuses on delivering a specific kind of features.  

Elasticsearch can handle search through massive amounts of data and perform text analysis. In order to make it effective for end-user searching, you need to spend time understanding more about how Elasticsearch works internally to be able to configure it properly.  
MeiliSearch is intended to deliver performant instant search experiences aimed at end-users. However, processing complex queries or analyzing large datasets (over 100 M documents) is not possible.  

Elasticsearch can sometimes be too slow if you want to provide a full instant search experience. Most of the times, it is significantly slower in returning search results compared to MeiliSearch.  
MeiliSearch is a perfect choice if you need a simple and easy tool to deploy a typo-tolerant search bar, that provides a prefix searching capability, makes search intuitive for users and returns them their results instantly with near perfect relevance.  

### MeiliSearch vs. Typesense

Typesense uses a default_sorting_field on each document, it means that before indexing your documents you need to compute a relevancy score for typesense to be able to sort them based on your needs (https://typesense.org/docs/0.11.1/guide/#ranking-relevance).  
On the other hand, MeiliSearch uses a bucket sort which means that there is a default relevancy algorithm based on the proximity of words in the documents, the fields in which the words are found and the number of typos (https://docs.meilisearch.com/guides/advanced_guides/ranking ...). And you can still add your own custom rules if you want to alter the default search behavior.  

### MeiliSearch vs. Algolia

MeiliSearch was inspired by Algolia’s product and the algorithms behind it. We indeed studied most of the algorithms and data structures described in their blog posts in order to implement our own. MeiliSearch is thus a new search engine based on the work of Algolia and recent research papers.  
It provides similar features and reaches the same level of relevance just as quickly as its predecessor.  

Contrary to Algolia, MeiliSearch is open-source and written in Rust, a systems-level and modern programming language, allows to rapidly build features. Rust also enables portability and flexibility, which makes the deployment of our search engines inside Virtual Machines, containers, or even Lambda@Edge, a seamless operation.  

One of Algolia major assets is the robust worldwide infrastructure that they offer to their customers.  
MeiliSearch currently delivers a search engine and is not in a position to provide a competitive infrastructure yet. However, we aim it to be much more simple to deploy and maintain than Algolia’s.  

## A Quick Look at the Search Engine Landscape

### Open Source

#### Lucene

Apache Lucene is a free and open source search library, built in Java, used for the full text indexing and search of documents. This project was first created in 1999 by Doug Cutting who had previously written search engines at Xerox's Palo Alto Research Center (PARC) and Apple. Since Lucene has been developed to build web search applications such as Google, you can see that DuckDuckGo still uses it for some specific searches.  

Lucene has since been divided into several projects:  
* **Lucene itself**: the full-text search library.  
* **Solr**: an enterprise search server with a powerful REST API.  
* **Nutch**: an extensible and scalable web crawler relying on Apache Hadoop.  

Since Lucene is the technology behind many open source or closed source search engines, it is considered as the reference search library.  

#### Sonic

Sonic is a lightweight and schema-less search index server written in Rust. Sonic cannot be considered as an out-of-the-box solution and, compared to MeiliSearch, it does not ensure relevancy ranking. Indeed, it does not store any documents but is comprised of an inverted index with a Levenshtein automaton, which means an application querying Sonic has to retrieve the search results from an external database using the IDs that are returned, and then apply some relevancy ranking.  
Its ability to run on a few MBs of RAM makes it a minimalist and resource-efficient alternative to database tools that can be too heavyweight to scale.  

#### Typesense

Another simple search engine is Typesense, which has been designed and optimized for speed. Particular attention has been given to ease-of-use. Thus Typesense aims to be simple to set-up, and focus on developer productivity and experience by providing a clean API. It is best suited for light projects.  

#### Lucene derivatives

#### Lucene-Solr

Solr is a subproject of Apache Lucene, created in 2004 by Yonik Seeley, and is today one of the most widely used search engines available worldwide. Solr is a search platform, written in Java, and built on top of Lucene. In other words, Solr is an HTTP wrapper around Lucene’s Java API, meaning you can leverage all the features of Lucene by using it. In addition, Solr server is combined with Solr Cloud, providing distributed indexing and searching capabilities, thus ensuring high availability and scalability. Data is shared but also automatically replicated.  
Furthermore, Solr is not only a search engine; it is often used as a document-structured NoSQL database. Documents are stored in collections, which can be comparable to tables in a relational database.  

Due to its extensible plugin architecture and customizable features, Solr is a search engine with an endless number of use cases even though, since it can index and search documents and email attachments, it is specifically popular for enterprise search.  

#### Bleve & Tantivy

Bleve and Tantivy are search engine projects, respectively written in Golang and Rust, inspired by Apache Lucene and its algorithms (e.g. tf-idf, short for term frequency inverse document frequency). Such as Lucene, both are libraries to be used for any search project; however they are not ready-to-use APIs.  

#### Elasticsearch

Elasticsearch is a search engine based on the Lucene library and is most popular for full-text search. It provides a REST API accessed by JSON over HTTP. One of its key options called index sharding gives you the ability to divide indexes in physical spaces in order to increase performance and ensure high availability. Both Lucene and Elasticsearch have been designed for processing large datasets, analyzing logs, and running complex queries. You can perform operations and analysis (e.g. calculate the average age of all users named "Thomas") on documents that match a specified query.  

Today, Lucene and Elasticsearch are dominant players in the open source search engine landscape. They both are solid solutions for a lot of different use cases in search, and also for building your own recommendation engine. They are good general products, but they require to be configured properly to get similar results to those of MeiliSearch or Algolia.  


### Closed Source

#### Algolia

Algolia is a company providing a search engine on a SaaS model. Its software is closed source. In its early stages, Algolia offered mobile search engines that could be embedded in apps, facing the challenge of implementing the search algorithms from scratch. From the very beginning, the decision was made to build a search engine directly dedicated to the end users, i.e. implementing search within mobile apps or websites.  
Algolia successfully demonstrated over the past few years how critical tolerating typos is in order to improve the users’ experience, and in the same way, its impact on reducing bounce rate and increasing conversion.  

Apart from Algolia, a wide range of SaaS products exist on the Search Engine Market. Most of them use Elasticsearch, and fine tune its settings in order to have a custom and personalized solution.  

#### Swiftype

Swiftype is a search service provider specialized in website search and analytics. Swiftype was founded in 2012 by Matt Riley and Quin Hoxie, and is now owned by Elastic since November 2017. It is a end-to-end solution built on top of Elasticsearch, meaning it has the ability to leverage the Elastic Stack.  

#### Doofinder

Doofinder is a paid on-site search service which was developed to integrate to any website with very little configuration. Doofinder is used by online stores to increase their sales, aiming to facilitate the purchase process.  

## Conclusions

MeiliSearch offers the same features as Algolia but is intended to be a more simplified alternative. In addition, providing an open source code allows to unleash a large number of opportunities for monetization: SaaS, support services, enterprise-features, and so on.  
Today, Algolia is no longer perceived as a dev tool, a developer friendly tool, since Algolia's marketing strategy is now mainly focused on large businesses; especially on e-commerce market where instant search is proving effective in bringing a strong added value. Since MeiliSearch is open source, it will be integrated in relatively smaller projects and will be managed by the development team rather than the marketing team or the product team. MeiliSearch will continue growing driven by its projects! Our ambition for MeiliSearch is to become the reference technology in the search engine market.  

Each Search solution has its perfect use case and its not easy to compare the performances on different types of search engines. It would’t be fair to compare the fastness of ElasticSearch and Algolia on a product-based database. Same goes for comparing the fastness on an enormous full text based database.  

Thats why we can not compare ourself with lucene-based or other specific use-case search engines.  

On the use-case MeiliSearch is focussing, the search solution that are the most similar to us are Algolia and Typesense. We all made a search-as-you-type relevant search engine.
Typesense is a great tool but not at having a lot done with zero configuration.
While Algolia is the most advanced, it has its price and is marketed to big companies.  

MeiliSearch is made for all types of developers. We focus on a developer friendly tool, easy to install and to deploy. Offering an out-of-the-box awesome search experience for the end users. We want everyone to have access to the best search experiences out there with minimum effort and with no financial means.
Today a developer wanting a search solution on his application will mostly go for ElasticSearch or less effective solutions. While Elastic is not made for that use case, it is still, a great open-source solution. We are this default solution today.  
