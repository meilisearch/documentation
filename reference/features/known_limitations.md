# Known limitations

Currently, MeiliSearch has a number of known limitations. Some of these limitations are the result of intentional design trade-offs, while others can be attributed to [LMDB](/reference/under_the_hood/storage.md), the key-value store that MeiliSearch uses [under the hood](/reference/under_the_hood).

## Design limitations

### Number of query words

**Limitation:** The maximum number of terms taken into account for each [search query](/reference/features/search_parameters.md#query-q) is 10. **If a search query includes more than 10 words, all words after the 10th will be ignored.**

**Explanation:** Queries with many search terms can lead to long response times. This goes against our goal of providing a [fast search-as-you-type experience](/learn/what_is_meilisearch/philosophy.md#front-facing-search).

### Database size

**Limitation:** The default maximum database size is __100GiB__. This size can be modified using the options `--max-index-size` & `--max-udb-size` as described in the [configuration reference](/reference/features/configuration.md#max-index-size).

**Explanation:** MeiliSearch uses two databases: one for storage and one for updates. On launch, LMDB needs to know the maximum size that it will need to reserve on disk for both of them.

### Maximum words per attribute

**Limitation:** MeiliSearch can index a maximum of __65535 positions per attribute__. Any words exceeding the 65535 position limit will be silently ignored.

::: warning
Previously, this limit was 1000 positions. This change will allow you to increase the size of `data.ms` between v0.23 and v0.24.
:::

**Explanation:** This limit is enforced for relevancy reasons. The more words there are in a given attribute, the less relevant the search queries will be.

#### Example

Suppose you have three similar queries: `Hello World`, `Hello, World`, and `Hello - World`. Due to how our tokenizer works, each one of them will be processed differently and take up a different number of "positions" in our internal database.

If your query is `Hello World`:

- `Hello` takes the position `0` of the attribute
- `World` takes the position `1` of the attribute

If your query is `Hello, World`:

- `Hello` takes the position `0` of the attribute
- `,` takes the position `8` of the attribute
- `World` takes the position `9` of the attribute

::: note
`,` takes 8 positions as it is a hard separator. You can read more about word separators in our [article about datatypes](https://docs.meilisearch.com/reference/under_the_hood/datatypes.html#string).
:::

If your query is `Hello - World`:

- `Hello` takes the position `0` of the attribute
- `-` takes the position `1` of the attribute
- `World` takes the position `2` of the attribute

::: note
`-` takes 1 space as it is a soft separator, you can read more about word separators in our [article about datatypes](https://docs.meilisearch.com/reference/under_the_hood/datatypes.html#string).
:::

### Maximum attributes per document

**Limitation:** MeiliSearch can index a maximum of **65,536 attributes per document**. If a document contains more than 65,536 attributes, an error will be thrown.

**Explanation:** This limit is enforced for performance and storage reasons. Overly large internal data structures—resulting from documents with too many fields—lead to overly large databases on disk, and slower search performance.

### Maximum number of documents in an index

**Limitation:** An index can contain no more than 4,294,967,296 documents.

**Explanation:** This is the largest possible value for a 32-bit unsigned integer. Since  MeiliSearch's engine uses unsigned integers to identify documents internally, this is the maximum number of documents that can be stored in an index.

### Length of individual `filterableAttributes` values

**Limitation:** Individual `filterableAttributes` values are limited to 500 bytes.

**Explanation:** MeiliSearch stores `filterableAttributes` values as keys in LMDB, a datatype whose size is limited to approximately 500 bytes. Note that this only applies to individual values—for example, a `genres` attribute can contain any number of values such as `horror`, `comedy`, or `cyberpunk` as long as each one of them is smaller than 500 bytes.

## Other limitations

### Payload size

**Limitation:** The default limit for the payload size is __~100MB__.

**Explanation:** MeiliSearch memory consumption can be an issue in some systems and keeping payload sizes relatively small ensures an optimal experience for most users. [This limit can be modified](/reference/features/configuration.md#payload-limit-size) if you want to take full advantage of particularly powerful hardware.
