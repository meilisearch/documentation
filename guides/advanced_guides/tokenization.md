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

Currently, the MeiliSearch tokenizer is optimized for four languages: 
- **English**  🇬🇧
- **Chinese** 🇨🇳
- **Japanese** 🇯🇵
- **Korean** 🇰🇷

It also supports any language that uses the Latin alphabet. **Results may vary in languages with long compound words, such as German.**

## Future Development

We rely on external contributors to help us extend our tokenizer to support new languages.

In the future, we hope that our international developer community will lead the process of developing additional tokenizer pipelines. For now, if there's an unsupported language that you would like us to target, you can help by writing tests for that language, giving us feedback, or simply giving a :+1: to the relevant GitHub issue.

Here are some of the languages that have been requested by users and their corresponding issue:

- [Thai](https://github.com/meilisearch/MeiliSearch/issues/864)
- [Persian/Farsi](https://github.com/meilisearch/MeiliSearch/issues/553)
- [Lao](https://github.com/meilisearch/MeiliSearch/issues/563)
- [Arabic](https://github.com/meilisearch/MeiliSearch/issues/554)
