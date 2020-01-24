## Features

Our feature list with extended explanations and links to the documentation.

* **Instant Search** (answers < 50ms): Priority on fast answers for smooth search experience.
* **Search as you type** (*prefix search*): Results are updated on each keystroke. To make this possible, we use a [prefix-search](/guides/advanced_guides/prefix.md#prefix-search).
* [Typo tolerance](/guides/advanced_guides/typotolerance.md#typo-tolerance): Understands typo and spelling mistakes.
* [Tokenization](https://en.wikipedia.org/wiki/Lexical_analysis#Tokenization) in English, kanji and latin based languages.
* Ability to create [synonyms](/guides/advanced_guides/synonyms.md) for a better search experience.
* [Easy to install, deploy and maintain](/getting_started/quickstart.md#quick-start)
* **Return the whole document**: The entire document is returned upon search.
* **Highly customizable search and indexation**:
    - [Filters](/guides/advanced_guides/search_parameters.md#filters): Filter in search.
    - [Highlight](/guides/advanced_guides/search_parameters.md#attributes-to-highlight): Highlighted search results in documents.
    - [Maximum response time](/guides/advanced_guides/search_parameters.md#attributes-to-highlight): Never will a response take more time to arrive.
    - [Stop-words](/guides/advanced_guides/stop_words.md): Ignore common non-relevant words like `of` or `the`.
    - [Custom ranking](/guides/advanced_guides/ranking.md#custom-ranking-rules): Create your own ranking rules on indexation.
    - [Schema customization](/guides/main_concepts/indexes.md#index-uid-and-name): Customize schema to suit your needs perfectly.
* **RESTfull API**
* **Asynchronous write operations**: Operations will be added to a queue for **low response time** and **guaranteed consistency**.
* [Bucket sort](/guides/advanced_guides/bucket_sort.md) with [6 default ranking rules](/guides/advanced_guides/ranking.md#ranking-rules) that [can be re-ordered](/guides/advanced_guides/ranking.md#ranking-order) to suit your needs.
