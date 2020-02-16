# Comparison to alternatives

## About MeiliSearch

MeiliSearch has been designed to be a ready-to-go open source solution and deliver an intuitive and instantaneous search experience. As the amount of information available on the websites increases as time goes by, it is essential to provide users with the most relevant results. Since many closed source search engines and open source alternatives can be used, determining which one to install is critical and may not seem easy at first.  
The present article covers a comparison of alternatives to MeiliSearch, i.e. available search technologies to be considered when planning to implement a search bar.  


## A Quick Look at the Search Engine Landscape

### Open Source

#### Lucene

Apache Lucene is a free and open source search library, built in Java, used for the full text indexing and search of documents. This project was first created in 1999 by Doug Cutting who had previously written search engines at Xerox's Palo Alto Research Center (PARC) and Apple. Since Lucene has been developed to build web search applications such as Google, you can see that DuckDuckGo still uses it for some specific searches.  

Lucene has since been divided into several projects:  
* **Lucene itself**: the full-text search library.  
* **Solr**: an enterprise search server with a powerful REST API.  
* **Nutch**: an extensible and scalable web crawler relying on Apache Hadoop.  

Since Lucene is a widely used tool, it is considered as the reference search library and many open source or closed source search engines are based on it.  

#### Sonic

Sonic is a lightweight and schema-less search index server written in Rust. Sonic does not store any documents, which means an application querying Sonic has to retrieve the search results from an external database using the IDs that are returned. Its ability to run on a few MBs of RAM makes it a minimalist and resource-efficient alternative to database tools that can be too heavyweight to scale.  

#### Typesense

Another simple search engine is Typesense, which has been designed and optimized for speed. Particular attention has been given to ease-of-use. Thus Typesense aims to be simple to set-up, and focus on developer productivity and experience by providing a clean API. It is best suited for light projects.  

#### Lucene derivatives

#### Lucene-Solr

#### Bleve & Tantivy

Bleve and Tantivy are search engine libraries, respectively written in Golang and Rust, inspired by Apache Lucene and its algorithms (e.g. tf-idf, short for term frequency inverse document frequency). Such as Lucene, both are to be considered for any search project; however they are not ready-to-use APIs.  

#### Elasticsearch

Elasticsearch is a search engine based on the Lucene library and is most popular for full-text search. It provides a REST API accessed by JSON over HTTP. One of its key options called index sharding, gives you the ability to divide indexes in physical spaces in order to increase performance and ensure high availability. Both Lucene and Elasticsearch have been designed for processing huge datasets, analyzing logs, and performing complex queries. You can perform operations and analysis on documents that match a specified query (e.g. calculate the mean age of all users named "Thomas").  
Today, Lucene and Elasticsearch are dominant players in the open source search engine landscape. They both are solid solutions for a lot of different use cases in search, and also for building your own recommendation engine. They are good general products, but they require to be configured properly to get similar results to those of MeiliSearch or Algolia.  


### Closed Source

#### Algolia

#### Swiftype

#### Doofinder

## Comparisons

### MeiliSearch vs. Elasticsearch

### MeiliSearch vs. Algolia

## Conclusions

