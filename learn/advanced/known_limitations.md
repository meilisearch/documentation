# Known limitations

Currently, Meilisearch has a number of known limitations. Some of these limitations are the result of intentional design trade-offs, while others can be attributed to [LMDB](/learn/advanced/storage.md), the key-value store that Meilisearch uses under the hood.

This guide covers hard limits that cannot be altered. Meilisearch also has some default limits that _can_ be changed, such as a [default payload limit of 100MB](/learn/configuration/instance_options.md#payload-limit-size) and a [default search limit of 20 hits](/reference/api/search.md#limit).

## Maximum number of query words

**Limitation:** The maximum number of terms taken into account for each [search query](/reference/api/search.md#query-q) is 10. If a search query includes more than 10 words, all words after the 10th will be ignored.

**Explanation:** Queries with many search terms can lead to long response times. This goes against our goal of providing a [fast search-as-you-type experience](/learn/what_is_meilisearch/philosophy.md#front-facing-search).

## Maximum number of document fields

**Limitation:** Documents have a soft maximum of 1000 fields.

**Explanation:** There is no limit on how many fields a document can have. However, documents with more than 1000 fields may cause the [ranking rules](/learn/core_concepts/relevancy.md#ranking-rules) to stop working, leading to undefined behavior.

## Maximum number of words per attribute

**Limitation:** Meilisearch can index a maximum of 65535 positions per attribute. Any words exceeding the 65535 position limit will be silently ignored.

**Explanation:** This limit is enforced for relevancy reasons. The more words there are in a given attribute, the less relevant the search queries will be.

### Example

Suppose you have three similar queries: `Hello World`, `Hello, World`, and `Hello - World`. Due to how our tokenizer works, each one of them will be processed differently and take up a different number of "positions" in our internal database.

If your query is `Hello World`:

- `Hello` takes the position `0` of the attribute
- `World` takes the position `1` of the attribute

If your query is `Hello, World`:

- `Hello` takes the position `0` of the attribute
- `,` takes the position `8` of the attribute
- `World` takes the position `9` of the attribute

::: note
`,` takes 8 positions as it is a hard separator. You can read more about word separators in our [article about data types](/learn/advanced/datatypes.md#string).
:::

If your query is `Hello - World`:

- `Hello` takes the position `0` of the attribute
- `-` takes the position `1` of the attribute
- `World` takes the position `2` of the attribute

::: note
`-` takes 1 position as it is a soft separator. You can read more about word separators in our [article about data types](/learn/advanced/datatypes.md#string).
:::

## Maximum number of attributes per document

**Limitation:** Meilisearch can index a maximum of **65,536 attributes per document**. If a document contains more than 65,536 attributes, an error will be thrown.

**Explanation:** This limit is enforced for performance and storage reasons. Overly large internal data structures—resulting from documents with too many fields—lead to overly large databases on disk, and slower search performance.

## Maximum number of concurrent requests

**Limitation:** Meilisearch can receive a maximum of 1024 API requests at the exact same time. Requests exceeding this limit will cause Meilisearch to thrown an internal error.

**Explanation:** This limit applies only to receiving requests, not to processing or adding them to the Tasks queue. It is set by [LMDB](/learn/advanced/storage.md#lmdb), Meilisearch's storage engine.

## Maximum number of documents in an index

**Limitation:** An index can contain no more than 4,294,967,296 documents.

**Explanation:** This is the largest possible value for a 32-bit unsigned integer. Since Meilisearch's engine uses unsigned integers to identify documents internally, this is the maximum number of documents that can be stored in an index.

## Length of individual `filterableAttributes` values

**Limitation:** Individual `filterableAttributes` values are limited to 500 bytes.

**Explanation:** Meilisearch stores `filterableAttributes` values as keys in LMDB, a data type whose size is limited to approximately 500 bytes. Note that this only applies to individual values—for example, a `genres` attribute can contain any number of values such as `horror`, `comedy`, or `cyberpunk` as long as each one of them is smaller than 500 bytes.

## Maximum filter depth

**Limitation:** Meilisearch does not accept searches with more than 2000 `OR` filters.

**Explanation:** `OR` filters create nested structures which can lead to a stack overflow.

### Example

Either of these filter expressions would cause a search query to fail:

```sql
user = 1 OR user = 2 […] OR user = 1500 OR user = 1501 […] OR user = 2000 OR user = 2001
```

```json
[
  ["user = 1", "user = 2", […], "user = 1500", "user = 1501", […], "user = 2000", "user = 2001"]
]
```  

## Size of integer fields

**Limitation:** Meilisearch can only exactly represent integers between -2⁵³ and 2⁵³.

**Explanation:** Meilisearch stores numeric values as double-precision floating-point numbers. This allows for greater precision and increases the range of magnitudes that Meilisearch can represent, but leads to inaccuracies in [values beyond certain thresholds](https://en.wikipedia.org/wiki/Double-precision_floating-point_format#Precision_limitations_on_integer_values).

## Maximum number of results per search

**Limitation:** By default, Meilisearch returns up to 1000 documents per search.

**Explanation:** Meilisearch limits the maximum amount of returned search results to protect your database from malicious scraping. You may change this by using the `maxTotalHits` property of the [pagination index settings](/reference/api/settings.md#pagination-object). `maxTotalHits` only applies to the [search route](/reference/api/search.md) and has no effect on the [get documents endpoint](/reference/api/documents.md#get-documents).

## Large datasets and internal errors

**Limitation:** Meilisearch might throw an internal error when indexing large batches of documents.

**Explanation:** Indexing a large batch of documents, such as a JSON file over 3.5GB in size, can result in Meilisearch opening too many file descriptors. Depending on your machine, this might reach your system's default resource usage limits and trigger an internal error. Use [`ulimit`](https://www.ibm.com/docs/en/aix/7.1?topic=u-ulimit-command) or a similar tool to increase resource consumption limits before running Meilisearch. For example, call `ulimit -Sn 3000` in a UNIX environment to raise the number of allowed open file descriptors to 3000.

## Maximum database size

**Limitation:** Meilisearch supports a maximum index size of around 80TiB on Linux environments. For performance reasons, Meilisearch recommends keeping indexes under 2TiB.

**Explanation:** Meilisearch can accommodate indexes of any size as long the combined size of active databases is below the maximum virtual address space the OS devotes to a single process. On 64-bit Linux, this limit is approximately 80TiB.

## Maximum number of indexes in an instance

**Limitation:** Meilisearch can accommodate an arbitrary number of indexes as long as their size does not exceed 2TiB. When dealing with larger indexes, Meilisearch can accommodate up to 20 indexes as long as their combined size does not exceed the OS's virtual address space limit.

**Explanation:** While Meilisearch supports an arbitrary number of indexes under 2TiB, accessing hundreds of different databases in short periods of time might lead to decreased performance and should be avoided when possible.
