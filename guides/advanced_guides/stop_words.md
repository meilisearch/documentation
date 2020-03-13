# Stop words

Stop-words allows you to create a list of words **ignored in your search queries**.

During a search, the stop-words contained in your search query will be ignored by the sorting algorithm.

I.e. if `the` is a stop word, and your search query contains `the`, MeiliSearch will ignore this word, and be faster to answer.

Stop-words **improves the speed**, and **relevancy** of a search.

## Language driven

Stop-words are strongly related to the language in which your data is written. Thus "the" or "of" are words that are very common in the English language and could be less relevant than a more specific word.

However, their recurrence in the data makes them decisive for calculating the relevance of a document, which could be counterproductive. In most cases, it is more desirable to ignore any recurrence of these words and to base research results on more relevant distinctions.
