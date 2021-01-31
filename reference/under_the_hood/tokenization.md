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

## Language Support

**MeiliSearch is multilingual**, featuring optimized support for:

- **Any language that uses whitespace to separate words**
- **Chinese** 🇨🇳 (through [Jieba](https://github.com/messense/jieba-rs))

We aim to provide global language support, and your feedback helps us [move closer to that goal](/guides/advanced_guides/tokenization.md#improving-our-language-support). If you notice inconsistencies in your search results or the way your documents are processed, please open an issue on our [GitHub repository](https://github.com/meilisearch/MeiliSearch/issues/new/choose).

### Improving Our Language Support

While we have employees from all over the world at MeiliSearch, we don't speak every language. In fact, we rely almost entirely on feedback from external contributors to know how our engine is performing across different languages.

If you'd like to help us create a more global MeiliSearch, please consider sharing your tests, results, and general feedback with us through [GitHub issues](https://github.com/meilisearch/MeiliSearch/issues). Here are some of the languages that have been requested by users and their corresponding issue:

- [Arabic](https://github.com/meilisearch/MeiliSearch/issues/554)
- [Lao](https://github.com/meilisearch/MeiliSearch/issues/563)
- [Persian/Farsi](https://github.com/meilisearch/MeiliSearch/issues/553)
- [Thai](https://github.com/meilisearch/MeiliSearch/issues/864)

If you'd like us to add or improve support for a language that isn't in the above list, please create an [issue](https://github.com/meilisearch/MeiliSearch/issues/new?assignees=&labels=&template=feature_request.md&title=) saying so, and then make a [pull request on the documentation](https://github.com/meilisearch/documentation/edit/master/guides/advanced_guides/tokenization.md) to add it to the above list.
