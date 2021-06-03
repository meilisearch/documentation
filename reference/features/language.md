# Language

**MeiliSearch is multilingual**, featuring optimized support for:

- **Any language that uses whitespace to separate words**
- **Chinese** (through [Jieba](https://github.com/messense/jieba-rs))

We aim to provide global language support, and your feedback helps us [move closer to that goal](#improving-our-language-support). If you notice inconsistencies in your search results or the way your documents are processed, please open an issue on our [GitHub repository](https://github.com/meilisearch/MeiliSearch/issues/new/choose).

If you'd like to learn more about how different languages are processed in MeiliSearch, see our [tokenizer documentation](/reference/under_the_hood/tokenization.md).

## Improving Our Language Support

While we have employees from all over the world at MeiliSearch, we don't speak every language. In fact, we rely almost entirely on feedback from external contributors to know how our engine is performing across different languages.

If you'd like to help us create a more global MeiliSearch, please consider sharing your tests, results, and general feedback with us through [GitHub issues](https://github.com/meilisearch/MeiliSearch/issues). Here are some of the languages that have been requested by users and their corresponding issue:

- [Arabic](https://github.com/meilisearch/MeiliSearch/issues/554)
- [Lao](https://github.com/meilisearch/MeiliSearch/issues/563)
- [Persian/Farsi](https://github.com/meilisearch/MeiliSearch/issues/553)
- [Thai](https://github.com/meilisearch/MeiliSearch/issues/864)

If you'd like us to add or improve support for a language that isn't in the above list, please create an [issue](https://github.com/meilisearch/MeiliSearch/issues/new?assignees=&labels=&template=feature_request.md&title=) saying so, and then make a [pull request on the documentation](https://github.com/meilisearch/documentation/edit/master/reference/features/language.md) to add it to the above list.

## FAQ

### What do you mean when you say MeiliSearch offers *optimized* support for a language?

Under the hood, MeiliSearch relies on tokenizers that identify the most important parts of each document in a given dataset. Currently, MeiliSearch has two tokenization pipelines: one for languages that separate words with spaces and one specifically tailored for Chinese. Languages that delimit their words in other ways will still work, but the quality and relevancy of search results may vary significantly.

### My language does not use whitespace to separate words. Can I still use MeiliSearch?

Yes, but your experience might not be optimized and results might be less relevant than in whitespace-separated languages and Chinese.

### My language does not use the Roman alphabet. Can I still use MeiliSearch?

Yes—our users work with many different alphabets and writing systems such as Cyrillic, Thai and Japanese.

### Does MeiliSearch plan to support additional languages in the future?

Yes, we definitely do. The more feedback we get from native speakers, the easier it is for us to understand how to improve performance for those languages—and the more requests to improve support for a specific language, the more likely we are to devote resources to that project.
