# Known limitations

MeiliSearch has known limitations, some of which may be addressed in future versions.

Some of these limitations have been made by MeiliSearch developers for relevacy and/or performance while others limitations are enforced by LMDB, the key-value store used by MeiliSearch.

## Design limitations

### Database size

MeiliSearch uses two databases: the first one for storage and the second one for updates.
On launch LMDB needs to know the size that it can allocate on disk. This space will be reserved on disk for LMDB, thus MeiliSearch. This space will also be allocated as virtual memory.

The maxime database size is by default __100GiB__ for each databases. This size can me modified using the options `--max-mdb-size` & `--max-udb-size` as described in the [configuration guide](/reference/features/configuration.md#max-mdb-size).

### Number of indexes

You can create __up to 200 indexes__ in MeiliSearch. This limit has been hard set for performance reasons.

### Maximum words per attribute

A maximum of __1000 words per attribute__ can be indexed. This means that if an attribute contains more than 1000 words, only the first 1000 words will be indexed and the rest will be silently ignored.

This limit is enforced for relevancy reasons. The more words there are in a given attribute, the less relevant the search queries will be.

## Other limitations

### Payload size

The default limit for the payload size is around __100MB__. [This limit can be modified](/reference/features/configuration.md#payload-limit-size).
