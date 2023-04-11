# Tokenization

**Tokenization** is the act of taking a sentence or phrase and splitting it into smaller units of language, called tokens. It is the first step of document indexing in the Meilisearch engine, and is a critical factor in the quality of search results.

Breaking sentences into smaller chunks requires understanding where one word ends and another begins, making tokenization a highly complex and language-dependent task. Meilisearch's solution to this problem is a **modular tokenizer** that follows different processes, called **pipelines**, based on the language it detects.

This allows Meilisearch to function in several different languages with zero setup.

## Deep dive: The Meilisearch tokenizer

When you add documents to a Meilisearch index, the tokenization process is handled by an abstract interface called the tokenizer. The tokenizer is responsible for splitting each field by writing system (for example, Latin alphabet, Chinese hanzi). It then applies the corresponding pipeline to each part of each document field.

We can break down the tokenization process like so:

1. Crawl the document(s), splitting each field by script
2. Go back over the documents part-by-part, running the corresponding tokenization pipeline, if it exists

Pipelines include many language-specific operations. Currently, we have four pipelines:

1. A default Meilisearch pipeline for languages that use whitespace to separate words. Uses [Unicode segmenter](https://github.com/unicode-rs/unicode-segmentation)
2. A specialized Chinese pipeline using [Jieba](https://github.com/messense/jieba-rs)
3. A specialized Japanese pipeline using [Lindera](https://github.com/lindera-morphology/lindera)
4. A specialized Hebrew pipeline based off the default Meilisearch pipeline. Uses [Niqqud](https://docs.rs/niqqud/latest/niqqud/) for normalization
5. A specialized Thai pipeline using [dictionary-based](https://github.com/PyThaiNLP/nlpo3) segmentation

For more details, check out the [tokenizer contribution guide](https://github.com/meilisearch/charabia/blob/main/CONTRIBUTING.md).
