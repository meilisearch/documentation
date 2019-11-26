## Features

Our feature list with extended explainations and link to the documentation.
<!-- 
* Instant Search (answers < 50ms)
* Search as you type (*prefix search*)
* [Typo tolerance](/advanced_guides/typotolerance.md#typo-tolerance) (understands typo and spelling mistakes)
* Kanji supported 
* Synonyms
* Easy to install, deploy and maintain
* Return whole document
* Highly customizable
* RESTfull API -->

*  **Instant Search** (answers < 50ms): Priority is given on fast answers for smooth search experience.
* **Search as you type** (*prefix search*): Results are shown as you type, to achieve this we use a prefix-search.
* [Typo tolerance](/advanced_guides/typotolerance.md#typo-tolerance): Understands typo and spelling mistakes.
* [Tokenization](https://en.wikipedia.org/wiki/Lexical_analysis#Tokenization) in English, kanji and latin based languages.  
* Ability to create [synonyms](/advanced_guides/synonyms.md) for a better search experience.   
* [Easy to install, deploy and maintain](/introduction/quickstart.html#quick-start)
* **Return whole document**: The entire document is returned upon search.
* **Highly customizable search and indexation**:
    - [Filters](/advanced_guides/search_parameters.md#filters): Filter in search
    - [Highlight](/advanced_guides/search_parameters.md#attributes-to-highlight): Highlighted search results in documents
    - [Maximum response time](/advanced_guides/search_parameters.md#attributes-to-highlight): Never will a response take more time to arrive
    - [Stop-words](/advanced_guides/stop_words.md): Ignore common non-relevant words like `of`, `the`, ..
    - [Custom ranking](/advanced_guides/ranking.html#custom-ranking-rules): Create own ranking rules on indexation.
    - [Schema customization](/main_concept/indexes.html#index-uid-and-name): Customize schema to perfectly suit your needs.
* **RESTfull API**
* **Asynchronous write actions**: Actions will be added to a queue for **low response time** and **guaranteed consistency**.
* [Bucket sort](/advanced_guides/bucket_sort.html) with [6 default ranking rules](advanced_guides/ranking.md#ranking-rules) that [can be re-ordered](/advanced_guides/ranking.html#ranking-order) to suit your needs.