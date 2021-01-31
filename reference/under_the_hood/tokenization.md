# Tokenization

**Tokenization** is the act of taking a sentence or phrase and splitting it into smaller units of language, called tokens. It is the first step of document indexing in the Meilisearch engine, and is a critical factor in the quality of search results.

Breaking sentences into smaller chunks requires understanding where one word ends and another begins, making tokenization a highly complex and language-dependant task. MeiliSearch's solution to this problem is a **modular tokenizer** that follows different processes, called **pipelines**, based on the language it detects.

This allows MeiliSearch to function in several different languages with zero setup.

## Deep Dive: The Meili Tokenizer

![Tokenizer Architecture](https://user-images.githubusercontent.com/6482087/102896344-8560d200-4466-11eb-8cfe-b4ae8741093b.jpg)

When you add documents to a MeiliSearch index, the tokenization process is handled by an abstract interface called an **analyzer**. The analyzer is responsible for determining the primary language of each <clientGlossary word="field" /> based on the scripts (e.g. Latin alphabet, Chinese hanzi, etc.) that are present there. Then, it applies the corresponding **pipeline** to each field.

We can break down the tokenization process like so:

1. Crawl the document(s) and determine the primary language for each field.
2. Go back over the documents field-by-field, running the corresponding tokenization pipeline, if it exists.

Pipelines include many language-specific operations. Currently, we have two pipelines:

1. A specialized Chinese pipeline using [Jieba](https://github.com/messense/jieba-rs)
2. A default MeiliSearch pipeline that separates words based on categories. Works with a variety of languages.

For more details, check out the [feature specification](https://github.com/meilisearch/specifications/blob/master/text/0001-script-based-tokenizer.md).
