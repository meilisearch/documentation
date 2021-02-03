# Known Limitations

MeiliSearch has known limitations, some of which may be addressed in future versions.

Some of these limitations have been made by MeiliSearch developers for relevancy and/or performance, while others are enforced by [LMDB](/reference/under_the_hood/storage.md), the key-value store used by MeiliSearch.

## Design limitations

### Number of query words

The maximum number of words taken into account for each [search query](/reference/features/search_parameters.md#query-q) is 10. If a search query includes more than 10 words, all words after the 10th will be ignored.

This is because large queries can lead to long response times, and MeiliSearch's goal is always to provide a [fast type-as-you-search experience](/learn/what_is_meilisearch/philosophy.md#front-facing-search).

### Database size

MeiliSearch uses two databases: the first one for storage and the second one for updates.
On launch LMDB needs to know the size that it can allocate on disk. This space will be reserved on disk for LMDB, thus MeiliSearch. This space will also be allocated as virtual memory.

The maximum database size is by default __100GiB__ for each database. This size can be modified using the options `--max-mdb-size` & `--max-udb-size` as described in the [configuration guide](/reference/features/configuration.md#max-mdb-size).

### Number of indexes

You can create __up to 200 indexes__ in MeiliSearch. This limit has been hard set for performance reasons.

### Maximum words per attribute

A maximum of __1000 words per attribute__ can be indexed. This means that if an attribute contains more than 1000 words, only the first 1000 words will be indexed and the rest will be silently ignored.

This limit is enforced for relevancy reasons. The more words there are in a given attribute, the less relevant the search queries will be.

## Other limitations

### Payload size

The default limit for the payload size is around __100MB__. [This limit can be modified](/reference/features/configuration.md#payload-limit-size).
