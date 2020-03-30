# All settings

This section describes all **configuration settings** available in MeiliSearch.

## Synonyms

A set of words defined for an index. These words look different but have the same meaning, and thus should be treated similarly.

## Stop words

A set of words defined for an index. These words should be excluded from search queries. It will avoid documents being considered highly relevant because of the high frequency of these terms in a corpus.

## Ranking rules

Built-in ranking rules to ensure relevancy in search results. They are customizable so the results meet your user's needs as close as possible. Ranking rules are applied in a default order which can be changed in the settings.

By default, rules are executed in the following order:

#### 1. Typo

Results are sorted by ascending number of typos: find documents that match query terms with fewer typos first.

#### 2. Words

Results are sorted by descending number of occurrences of the query terms in each matching document: find documents that contain more occurrences of the query terms first.

#### 3. Proximity

Results are sorted by descending proximity of the query words found in the matching documents: find documents that contain more query words near each other and placed in the correct order first.

#### 4. Attribute

Results are sorted by [attribute importance](/guides/main_concepts/relevancy.md#attributes-importance).

#### 5. Words Position

Results are sorted by the position of the query words in the attributes. MeiliSearch determines the order of importance of the attributes based on the order in which they appear in the first document added. The first found attribute in the document is considered as the most relevant term whereas the last one found in the document is considered as the last relevant term.

#### 6. Exactness

Results are sorted by the similarity of the matched words with the query words: find documents that contain exactly the same terms as the ones queried first.

## Distinct attribute


## Searchable attributes


## Displayed attributes


## Accept new fields


