# Tokenization

**Tokenization** is the act of taking a sentence or phrase and splitting it into smaller units of language, called tokens. It is the first step of document indexing in the Meilisearch engine, and is a critical factor in the quality of search results.

Tokenization is a highly complex and language-dependant task. MeiliSearch's solution to this problem is a **modular tokenizer** that follows different processes, called **pipelines**, based on the type of characters it detects. This allows it to function on datasets from multiple languages with minimal setup.

Currently, the MeiliSearch tokenizer has full support for four languages: English, Chinese, Japanese, and Korean. It can also effectively tokenize any language that uses the latin alphabet.

## The Meili Tokenizer

![Tokenizer Architecture](https://user-images.githubusercontent.com/6482087/102896344-8560d200-4466-11eb-8cfe-b4ae8741093b.jpg)

The tokenization process can be broken down into two broad steps:
1. Determine the type of script that must be tokenized (e.g. Latin alphabet, Chinese characters, Arabic script, etc.).
2. Run the corresponding pipeline, if it exists. Pipelines include language-specific operations and stop words.