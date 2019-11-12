## Features

- Provides [6 default ranking criteria](https://github.com/meilisearch/MeiliDB/blob/dc5c42821e1340e96cb90a3da472264624a26326/meilidb-core/src/criterion/mod.rs#L107-L113) used to [bucket sort](https://en.wikipedia.org/wiki/Bucket_sort) documents
- Accepts [custom criteria](https://github.com/meilisearch/MeiliDB/blob/dc5c42821e1340e96cb90a3da472264624a26326/meilidb-core/src/criterion/mod.rs#L24-L33) and can apply them in any custom order
- Support [ranged queries](https://github.com/meilisearch/MeiliDB/blob/dc5c42821e1340e96cb90a3da472264624a26326/meilidb-core/src/query_builder.rs#L283), useful for paginating results
- Can [distinct](https://github.com/meilisearch/MeiliDB/blob/dc5c42821e1340e96cb90a3da472264624a26326/meilidb-core/src/query_builder.rs#L265-L270) and [filter](https://github.com/meilisearch/MeiliDB/blob/dc5c42821e1340e96cb90a3da472264624a26326/meilidb-core/src/query_builder.rs#L246-L259) returned documents based on context defined rules
- Searches for [concatenated](https://github.com/meilisearch/MeiliDB/pull/164) and [splitted query words](https://github.com/meilisearch/MeiliDB/pull/232) to improve the search quality.
- Can store complete documents or only [user schema specified fields](https://github.com/meilisearch/MeiliDB/blob/dc5c42821e1340e96cb90a3da472264624a26326/meilidb-schema/src/lib.rs#L265-L279)
- The [default tokenizer](https://github.com/meilisearch/MeiliDB/blob/dc5c42821e1340e96cb90a3da472264624a26326/meilidb-tokenizer/src/lib.rs) can index latin and kanji based languages
- Returns [the matching text areas](https://github.com/meilisearch/MeiliDB/blob/dc5c42821e1340e96cb90a3da472264624a26326/meilidb-core/src/lib.rs#L66-L88), useful to highlight matched words in results
- Accepts query time search config like the [searchable attributes](https://github.com/meilisearch/MeiliDB/blob/dc5c42821e1340e96cb90a3da472264624a26326/meilidb-core/src/query_builder.rs#L272-L275)
- Supports [runtime incremental indexing](https://github.com/meilisearch/MeiliDB/blob/dc5c42821e1340e96cb90a3da472264624a26326/meilidb-core/src/store/mod.rs#L143-L173)
