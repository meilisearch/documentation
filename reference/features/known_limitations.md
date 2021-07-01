# Known limitations

Currently, MeiliSearch has a number of known limitations. Some of these limitations are the result of intentional design trade-offs, while others can be attributed to [LMDB](/reference/under_the_hood/storage.md), the key-value store that MeiliSearch uses [under the hood](/reference/under_the_hood).

## Design limitations

### Number of query words

The maximum number of terms taken into account for each [search query](/reference/features/search_parameters.md#query-q) is 10. **If a search query includes more than 10 words, all words after the 10th will be ignored.**

Large queries can lead to long response times and MeiliSearch's goal is to provide a [fast search-as-you-type experience](/learn/what_is_meilisearch/philosophy.md#front-facing-search).

### Database size

MeiliSearch uses two databases: one for storage and one for updates. On launch, LMDB needs to know the maximum size that it will need to reserve on disk for both of them.

The default maximum database size is __100GiB__. This size can be modified using the options `--max-mdb-size` & `--max-udb-size` as described in the [configuration reference](/reference/features/configuration.md#max-mdb-size).

### Number of indexes

You can create __up to 200 indexes__ in MeiliSearch. This limit has been hard-coded for performance reasons.

### Maximum words per attribute

A maximum of __1000 words per attribute__ can be indexed. This means that if an attribute contains more than 1000 words, only the first 1000 words will be indexed and the rest will be silently ignored.

This limit is enforced for relevancy reasons. The more words there are in a given attribute, the less relevant the search queries will be.

## Other limitations

### Payload size

The default limit for the payload size is around __100MB__. [This limit can be modified](/reference/features/configuration.md#payload-limit-size).
