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
2. Go back over the documents field-by-field, running the corresponding tokenization pipeline, if it exists.

Pipelines include many language-specific operations. Currently, we have two pipelines:

1. A specialized Chinese pipeline using [Jieba](https://github.com/messense/jieba-rs)
2. A default pipeline that uses [unicode text segmentation](https://github.com/unicode-rs/unicode-segmentation).

For more details or to make a contribution, check out the tokenizer [feature specification](https://github.com/meilisearch/specifications/blob/master/text/0001-script-based-tokenizer.md) and [repository](https://github.com/meilisearch/Tokenizer).

## Language Support

**MeiliSearch is multilingual**, featuring optimized support for: 

- **Any language that uses whitespace to separate words**
- **Chinese** 🇨🇳 (through [Jieba](https://github.com/messense/jieba-rs))

Don't know if your language is covered? **We recommend trying MeiliSearch anyway.** MeiliSearch is a flexible engine designed to deliver results in any language. We are constantly working to improve our multilingual support and [welcome your feedback](/guides/advanced_guides/tokenization.md#future-development).

If you'd like more information on how MeiliSearch handles different languages, learn about our [tokenizer](/guides/advanced_guides/tokenization.md#tokenization).

## Future Development

There are many ways you can contribute to creating a more global MeiliSearch.

If you're a Rust dev, check out our [tokenizer repo](https://github.com/meilisearch/Tokenizer) and consider developing a [tokenization pipeline](/guides/advanced_guides/tokenization.md#tokenization) for your language of choice.

If you'd like to help in another way, please consider sharing your tests, results, and feedback with us on GitHub. We have issues on the MeiliSearch repository tracking our efforts to improve support for various languages. Be sure to also give a :+1: to any language you'd like us to target!

Here are some of the languages that have been requested by users and their corresponding issue:

- [Arabic](https://github.com/meilisearch/MeiliSearch/issues/554)
- [Lao](https://github.com/meilisearch/MeiliSearch/issues/563)
- [Persian/Farsi](https://github.com/meilisearch/MeiliSearch/issues/553)
- [Thai](https://github.com/meilisearch/MeiliSearch/issues/864)

If you'd like us to add or improve support for a language that isn't in the above list, please create an [issue](https://github.com/meilisearch/MeiliSearch/issues/new?assignees=&labels=&template=feature_request.md&title=) saying so, and then make a [pull request on the documentation](https://github.com/meilisearch/documentation/edit/master/guides/advanced_guides/tokenization.md) to add it to the above list.
