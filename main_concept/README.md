# Main Concepts

In this section, we go through the main concept of MeiliSearch.

::: tip Important
MeiliSearch is an **asynchronous** API. It means that when it does not behave like a synchronous API when you are dealing with the request's responses. [Read more in the advanced guide](/advanced_guides/asynchronous_updates).
:::

## Glossary

MeiliSearch uses the following terms inside the documentation. You should become familiar with them before continuing.

* **[Index](indexes)**: Like a table in `SQL`. It's the entity that gathers all the documents of a given structure.
* **[Schema](indexes#schema-definition)**: The definition of the index. The `schema` describes the structure of the `document`.
* **[Document](documents)**: Object containing the defined attributes with their associated data.
