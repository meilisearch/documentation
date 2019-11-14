# Stop Words

Stop-words words allow you to **ignore certain words in the relevance of your search**. 

During a search, if your query contains words that you have put in stop-words, they will be ignored by the algorithm that defines the relevance of each document. This increases the speed of the search. 

::: tip
Using stop-words allows the relevance of the search to be focused on more interesting elements such as ranking rather than on the accuracy of the sequence with another one.
:::

## Language driven

Stop-words are strongly related to the language in which your data is written. Thus "the" or "of" are words that do not add much interest in English research. However, their recurrence in the data makes them decisive in calculating the relevance of a document.  

### Example

in a movie database where we want the movies to be ranked by their release year.

#### Without stop words 
<!-- TODO: example -->