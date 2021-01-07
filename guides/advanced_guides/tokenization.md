# Tokenization

**Tokenization** is the act of taking a sentence or phrase and splitting it into smaller units of language, called tokens. It is the first step of document indexing in the Meilisearch engine, and is a critical factor in the quality of search results.

Breaking sentences into smaller chunks requires understanding where one word ends and another begins, making tokenization a highly complex and language-dependant task. MeiliSearch's solution to this problem is a **modular tokenizer** that follows different processes, called **pipelines**, based on the type of character it detects. This allows it to function on datasets from multiple languages with minimal setup.

Currently, the MeiliSearch tokenizer has full support for four languages: English, Chinese, Japanese, and Korean. It can also effectively tokenize any language that uses the Latin alphabet.

## The Meili Tokenizer

![Tokenizer Architecture](https://user-images.githubusercontent.com/6482087/102896344-8560d200-4466-11eb-8cfe-b4ae8741093b.jpg)

The tokenization process can be broken down into two broad steps:
1. Determine the type of script that must be tokenized (e.g. Latin alphabet, Arabic script, Cyrillic etc.).
2. Run the corresponding pipeline, if it exists. Pipelines include language-specific operations and stop words.

For more detail, take a look at the [feature specification](https://github.com/meilisearch/specifications/blob/master/text/0001-script-based-tokenizer.md).

## Future Development

We rely on external contributors to help us extend our tokenizer to support new scripts and languages.

If there is an unsupported language that you would like us to target, you can help by developing a pipeline, writing tests for that language, or simply giving a :+1: to the relevant GitHub issue.

Here are some of the languages that have been requested by users and their corresponding issue:
- [Thai](https://github.com/meilisearch/MeiliSearch/issues/864)
- [Persian/Farsi](https://github.com/meilisearch/MeiliSearch/issues/553)
- [Lao](https://github.com/meilisearch/MeiliSearch/issues/563)
- [Arabic](https://github.com/meilisearch/MeiliSearch/issues/554)