# Indexes

An index is an entity that gathers a set of documents with its own settings.

It can be comparable to a table in `SQL`, or a collection in MongoDB.

An index is defined by an `uid` and contains the following information:

- One <clientGlossary word="primary key"/>
- Default settings that can be configured as needed: relevancy rules, synonyms, stop words, and field properties.

#### Example

Suppose you manage a database that contains information about movies. You would probably want to have multiple categories: one for movie descriptions, one for actors, and one for reviews. Each of these categories would be represented by an index in MeiliSearch.

Each index holds information about the fields found in the documents, how they get handled by MeiliSearch, and their order of importance. Besides, an index defines its own synonyms, relevancy rules, and stop words. **The information of one index doesn't impact other indexes.**

For example, it means you could create on the same server synonyms for a `movie` index and different synonyms for a `clothing` index.

## Index UID

The `uid` is the **unique** identifier of a given index. It is used on every `indexes/:index_uid` route as the `:index_uid` parameter.

The uid is set at [index creation time](/references/indexes.md#create-an-index). Once a `uid` has been defined for an index, you cannot create another index with the same `uid` and the identifier **cannot be changed anymore**.

```json
{
  "uid": "movie",
  "createdAt": "2019-11-20T09:40:33.711324Z",
  "updatedAt": "2019-11-20T10:16:42.761858Z"
}
```

## Primary key

The primary key is a <clientGlossary word="field"/> present in all documents. This field is composed of a primary key <clientGlossary word="attribute"/> name and a unique value. All documents in a given index share the same primary key attribute but a different unique value. The primary key's attribute name **must** be known by the index. You can [set a primary key for an index or let it be inferred by MeiliSearch](/guides/main_concepts/documents.md#setting-the-primary-key).

[Learn more about document primary key](/guides/main_concepts/documents.md#primary-key)

## Relevancy rules

Each index applies its own relevancy rules. All indexes are created with the same built-in <clientGlossary word="ranking rules"/> executed in a default order. Once your first document has been added, the index will record how the attributes must be sorted. Their order of importance will be deduced from their order of appearance in the document.

For example, if in your first document attributes are listed as follows: `id, title, description, release_date`, any document containing the matching query in `title` will be considered more relevant than a document containing it in `description`.

On top of that, you can add your custom rules to the ranking rules. For example, you may want to rank your movies either by release date or popularity, or both and so on. **Rules are customizable** so the results meet your user's needs as close as possible.

[Learn more about ranking rules](/guides/main_concepts/relevancy.md)

## Synonyms

A set of synonyms can be defined for an index. In your dataset, you may decide to create synonyms for words which have the same meaning. Even though they are different, they should be treated similarly. If either of the associated words is searched, the same results shall be displayed.

Since synonyms are linked to a given index, they won't apply to any other index on the same MeiliSearch instance.

[Learn more about synonyms](/guides/advanced_guides/synonyms.md)

## Stop words

Sometimes you may want to ignore certain words in documents and search queries. To do so, a set of stop words can be defined for an index. Unless you actually need them, some words neither add semantic value nor context. Besides, they are often too frequent (i.e. `the` or `of` in English).

By adding words to a stop words list, these specific terms will be excluded from your search. It will avoid documents being considered highly relevant because of the presence of some words in an important [attribute](/guides/main_concepts/relevancy.md#_4-attribute) or in a good [position](/guides/main_concepts/relevancy.md#ranking-rules). This will also greatly improve the search time because all the documents containing only those words will not be used in the sorting of documents.

For example, suppose you would perform the following search query: `the great gatsby`. Having the word `the` in a film review wouldn't make the review more relevant. By adding `the` to the stop word list, performance would be increased and search results more relevant.

[Learn more about stop words](/guides/advanced_guides/stop_words.md)

## Field properties

By default, every document field is searchable and returned on search queries.

Fields can have either or both or none of the following properties that can be modified in the [settings](/references/settings.md):

- **Searchable**: The content of searchable fields is used by MeiliSearch to assess the relevancy of a document.
- **Displayed**: Documents returned upon search contain only displayed fields.

By default, each field is stored and this behavior cannot be changed.

[Learn more about field properties](/guides/advanced_guides/field_properties.md)
