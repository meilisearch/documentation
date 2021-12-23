# Core concepts

This section defines the core concepts of MeiliSearch:

- [Documents](/learn/core_concepts/documents.md): Objects made up of key-value pairs
- [Indexes](/learn/core_concepts/indexes.md): Entities that contain documents and search-related settings
- [Relevancy](/learn/core_concepts/relevancy.md): Rules that help you get more intuitive results. The human element of your search engine

::: tip Important
MeiliSearch is an **asynchronous** API. This means that, unlike a synchronous API, it doesn't wait for a call to finish before reporting the results and accepting a new call request. Instead, calls are placed in a queue for processing. For further information please read [the dedicated guide on asynchronous operations](/learn/advanced/asynchronous_operations.md).
:::
