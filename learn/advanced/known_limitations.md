# Known limitations

Currently, Meilisearch has a number of known limitations. Some of these limitations are the result of intentional design trade-offs, while others can be attributed to [LMDB](/learn/advanced/storage.md), the key-value store that Meilisearch uses under the hood.

## Design limitations

### Number of query words

**Limitation:** The maximum number of terms taken into account for each [search query](/reference/api/search.md#query-q) is 10. **If a search query includes more than 10 words, all words after the 10th will be ignored.**

**Explanation:** Queries with many search terms can lead to long response times. This goes against our goal of providing a [fast search-as-you-type experience](/learn/what_is_meilisearch/philosophy.md#front-facing-search).

### Database size

**Limitation:** The default maximum database size is __100GiB__. This size can be modified using the options `--max-index-size` & `--max-task-db-size` as described in the [configuration reference](/learn/configuration/instance_options.md#max-index-size).

**Explanation:** Meilisearch uses two databases: one for storage and one for tasks. On launch, LMDB needs to know the maximum size that it will need to reserve on disk for both of them.

### Maximum words per attribute

**Limitation:** Meilisearch can index a maximum of __65535 positions per attribute__. Any words exceeding the 65535 position limit will be silently ignored.

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
`,` takes 8 positions as it is a hard separator. You can read more about word separators in our [article about datatypes](/learn/advanced/datatypes.md#string).
:::

If your query is `Hello - World`:

- `Hello` takes the position `0` of the attribute
- `-` takes the position `1` of the attribute
- `World` takes the position `2` of the attribute

::: note
`-` takes 1 position as it is a soft separator. You can read more about word separators in our [article about datatypes](/learn/advanced/datatypes.md#string).
:::

### Maximum attributes per document

**Limitation:** Meilisearch can index a maximum of **65,536 attributes per document**. If a document contains more than 65,536 attributes, an error will be thrown.

**Explanation:** This limit is enforced for performance and storage reasons. Overly large internal data structures—resulting from documents with too many fields—lead to overly large databases on disk, and slower search performance.

### Maximum number of documents in an index

**Limitation:** An index can contain no more than 4,294,967,296 documents.

**Explanation:** This is the largest possible value for a 32-bit unsigned integer. Since  Meilisearch's engine uses unsigned integers to identify documents internally, this is the maximum number of documents that can be stored in an index.

### Length of individual `filterableAttributes` values

**Limitation:** Individual `filterableAttributes` values are limited to 500 bytes.

**Explanation:** Meilisearch stores `filterableAttributes` values as keys in LMDB, a datatype whose size is limited to approximately 500 bytes. Note that this only applies to individual values—for example, a `genres` attribute can contain any number of values such as `horror`, `comedy`, or `cyberpunk` as long as each one of them is smaller than 500 bytes.

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

## Other limitations

### Payload size

**Limitation:** The default limit for the payload size is __~100MB__.

**Explanation:** Meilisearch memory consumption can be an issue in some systems and keeping payload sizes relatively small ensures an optimal experience for most users. [This limit can be modified](/learn/configuration/instance_options.md#payload-limit-size) if you want to take full advantage of particularly powerful hardware.
