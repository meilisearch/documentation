# Language

Meilisearch is multilingual, featuring optimized support for:

- **Any language that uses whitespace to separate words**
- **Chinese** (through [Jieba](https://github.com/messense/jieba-rs))
- **Japanese** (through [Lindera](https://github.com/lindera-morphology/lindera))
- **Hebrew** (with normalization through [Niqqud](https://docs.rs/niqqud/latest/niqqud/))

We aim to provide global language support, and your feedback helps us move closer to that goal. If you notice inconsistencies in your search results or the way your documents are processed, please [open an issue in our tokenizer repo](https://github.com/meilisearch/charabia/issues/new).

[Read more about our tokenizer](/learn/advanced/tokenization.md)

## Improving our language support

While we have employees from all over the world at Meilisearch, we don't speak every language. We rely almost entirely on feedback from external contributors to understand how our engine is performing across different languages.

- If you'd like to request dedicated support for a language but aren't able to work on a tokenization pipeline yourself, please [open a discussion in our product repo](https://github.com/meilisearch/product/discussions).
- If you are interested in contributing to the Meilisearch tokenizer directly, please have a look at the [contribution guide](https://github.com/meilisearch/charabia/blob/main/CONTRIBUTING.md) before doing so.

## FAQ

### What do you mean when you say Meilisearch offers _optimized_ support for a language?

Under the hood, Meilisearch relies on tokenizers that identify the most important parts of each document in a given dataset. We currently use four tokenization pipelines:

- A default one designed for languages that separate words with spaces
- One specifically tailored for Chinese
- One specifically tailored for Japanese
- One specifically tailored for Hebrew

### My language does not use whitespace to separate words. Can I still use Meilisearch?

Yes, but search results might be less relevant than in one of the fully optimized languages.

### My language does not use the Roman alphabet. Can I still use Meilisearch?

Yes—our users work with many different alphabets and writing systems, such as Cyrillic, Thai, and Japanese.

### Does Meilisearch plan to support additional languages in the future?

Yes, we definitely do. The more feedback we get from native speakers, the easier it is for us to understand how to improve performance for those languages. Similarly, the more requests we get to improve support for a specific language, the more likely we are to devote resources to that project.
