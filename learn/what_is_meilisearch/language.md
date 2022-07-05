# Language

Meilisearch is multilingual, featuring optimized support for:

- Any language that uses whitespace to separate words
- Chinese
- Japanese
- Hebrew

We aim to provide global language support, and your feedback helps us move closer to that goal. If you notice inconsistencies in your search results or the way your documents are processed, please [open an issue in our tokenizer repo](https://github.com/meilisearch/charabia/issues/new).

[Read more about our tokenizer](/learn/advanced/tokenization.md)

## Improving our language support

While we have employees from all over the world at Meilisearch, we don't speak every language. We rely almost entirely on feedback from external contributors to understand how our engine is performing across different languages.

If you'd like to request optimized support for a language that we don't currently support, please upvote the related [discussion in our product repository](https://github.com/meilisearch/product/discussions?discussions_q=label%3Aproduct%3Acore%3Atokenizer) or [open a new one](https://github.com/meilisearch/product/discussions/new) if it doesn't exist.

If you'd like to help by developing a tokenizer pipeline yourself: first of all, thank you! We recommend that you take a look at the [tokenizer contribution guide](https://github.com/meilisearch/charabia/blob/main/CONTRIBUTING.md) before making a PR.

## FAQ

### What do you mean when you say Meilisearch offers _optimized_ support for a language?

Under the hood, Meilisearch relies on tokenizers that identify the most important parts of each document in a given dataset. We currently use four tokenization pipelines:

- A default pipeline designed for languages that separate words with spaces
- A pipeline specifically tailored for Chinese
- A pipeline specifically tailored for Japanese
- A pipeline specifically tailored for Hebrew

### My language does not use whitespace to separate words. Can I still use Meilisearch?

Yes, but search results might be less relevant than in one of the fully optimized languages.

### My language does not use the Roman alphabet. Can I still use Meilisearch?

Yes—our users work with many different alphabets and writing systems, such as Cyrillic, Thai, and Japanese.

### Does Meilisearch plan to support additional languages in the future?

Yes, we definitely do. The more [feedback](https://github.com/meilisearch/product/discussions?discussions_q=label%3Aproduct%3Acore%3Atokenizer) we get from native speakers, the easier it is for us to understand how to improve performance for those languages. Similarly, the more requests we get to improve support for a specific language, the more likely we are to devote resources to that project.
