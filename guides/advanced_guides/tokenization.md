# Language and Tokenization

## Tokenization

**Tokenization** is the act of taking a sentence or phrase and splitting it into smaller units of language, called tokens. It is the first step of document indexing in the Meilisearch engine, and is a critical factor in the quality of search results.

Breaking sentences into smaller chunks requires understanding where one word ends and another begins, making tokenization a highly complex and language-dependant task. MeiliSearch's solution to this problem is a **modular tokenizer** that follows different processes, called **pipelines**, based on the language it detects.

This allows MeiliSearch to function in several different languages with zero setup.

### Deep Dive: The Meili Tokenizer

![Tokenizer Architecture](https://user-images.githubusercontent.com/6482087/102896344-8560d200-4466-11eb-8cfe-b4ae8741093b.jpg)

When you add documents to a MeiliSearch index, the tokenization process is handled by an abstract interface called an **analyzer**. The analyzer is responsible for determining the primary language of each <clientGlossary word="field" /> based on the scripts (e.g. Latin alphabet, Chinese hanzi, etc.) that are present there. Then, it applies the corresponding **pipeline** to each field.

We can break down the tokenization process like so:

1. Crawl the document(s) and determine the primary language for each field.
2. Go back over the documents field-by-field, running the corresponding tokenization pipeline, if it exists. Pipelines include many language-specific operations.

## Language Support

Currently, MeiliSearch offers full support for two groups of languages:

- **English** 🇬🇧 and **any other language that uses the Latin alphabet**
- **Chinese** 🇨🇳

This is due to how our [tokenizer](/guides/advanced_guides/tokenization.md#tokenization) is optimized. While we can't promise high-quality results for languages outside of these two groups, we find that **MeiliSearch works effectively in most languages**.

Note that although we support all languages that use the Latin alphabet, **results may vary in languages with long compound words, such as German.**

## Future Development

While we have employees from all over the world at MeiliSearch, we don't speak every language. In fact, we rely almost entirely on external contributors to understand how our engine is performing in a given language.

In the future, we plan to open-source the development of [tokenization pipelines](/guides/advanced_guides/tokenization.md#tokenization) and let our international community lead the charge towards a more global MeiliSearch. For now, you can help by sharing tests, results, and feedback with us in that language's GitHub issue. Be sure to also give a :+1: to any language you'd like us to target!

Here are some of the languages that have been requested by users and their corresponding issue:

- [Thai](https://github.com/meilisearch/MeiliSearch/issues/864)
- [Persian/Farsi](https://github.com/meilisearch/MeiliSearch/issues/553)
- [Lao](https://github.com/meilisearch/MeiliSearch/issues/563)
- [Arabic](https://github.com/meilisearch/MeiliSearch/issues/554)

If you'd like us to add support for a language that isn't in the above list, please create an [issue](https://github.com/meilisearch/MeiliSearch/issues/new?assignees=&labels=&template=feature_request.md&title=) saying so, and then make a [pull request on the documentation](https://github.com/meilisearch/documentation/edit/master/guides/advanced_guides/tokenization.md) to add it to the above list.
