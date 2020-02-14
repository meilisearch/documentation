# Indexes

An index is an entity, like a table in `SQL`, or a collection in `mongoDb`, that collects a set of documents.

An index is defined by an `uid` and contains the following information:
- One document identifier <glossary word="attribute"/>
- A set of relevancy rules (based on presets and customization)
- A list of synonyms and stop-words
- Rules for each field of a document
- Settings

#### Example

An index will typically be the collection of a certain type of data. For example, a `movie` index with documents containing each information about a movie. On the same server, you could have another index containing all the movie reviews, where each document contains information about a review.

Each of the indexes will have information about the fields found in the documents. What should be done with each field, and their order of importance. Different synonyms, relevancy rules, stop-words, could be set on both indexes based on the context.

## Index UID

The `uid` of an index is its **unique** identifier. It is the `:uid` parameter found on every `indexes/:uid` route.

The uid is set on [index creation](/references/indexes.md#create-an-index). After which you cannot create another index with the same `uid`.
The `uid` cannot be changed.


```json
{
    "uid": "movie",
    "createdAt": "2019-11-20T09:40:33.711324Z",
    "updatedAt": "2019-11-20T10:16:42.761858Z"
  }
```

## Document identifier

The document identifier is a <glossary word="field" /> in a document. This field is composed of an identifier <glossary word="attribute"/> name and it's unique value. All documents in a given index have the same identifier attribute, with each an unique value. The identifier's attribute name **must** be known by the index. There are [multiple ways to set your identifier](/guides/main_concepts/documents.md#setting-the-identifier).

[More information about the document identifier](/guides/main_concepts/documents.md#identifier)

## Relevancy rules

Each index has its own relevancy rules. By default, all index starts with the same <glossary word="ranking rules"/>  applied in the same order. Once you add your first document, from the order of the keys in this document, the index will be able to record which key is more important than another.

For example, if your first document has the following keys in this order: `id, title, description, release_date`. A document containing the matching query in the `title` will be considered more relevant than a document where it is in `description`.

On top of that, you can add your own rule to the ranking rules. For example, you could add a rule where a recent movie will be considered more relevant than an old movie. Or a rule where a movie with a higher popularity is more relevant. And so one, depending on your available data and your user's needs.

[More information about ranking rules](/guides/advanced_guides/ranking.md#ranking-rules)

## Synonyms, stop-words, ...

An index can contain a set of synonyms. On those words, a document containing the synonym of your search query will be considered as relevant as the same document with the search query in itself. The synonyms are linked to the given index, and they will not apply to any other index on the same MeiliSearch instance.

[More information about synonyms](/guides/advanced_guides/synonyms.md)

An index can contain, like synonyms, a list of stop-words. Those words will be ignored if present in a search query. Typically those words could be redundant words of your chosen language.
For example, `the` or `of` in English. By adding those words in the stop-words list, you avoid having documents considered highly relevant because of the recurrence of one of those words in a document.

For example, on the following search query: `the great gatsby`, if the presence of the word `the` in a film review should not make the review more relevant. By adding `the` to the stop-word list, you avoid having a document full of that word high in the search results.

[More information about stop-words](/guides/advanced_guides/stop_words.md)

## Rules of fields

In MeiliSearch, by default, every field of the document is `indexed`, `displayed`, and `searchable`. Those rules can be changed.

You could give a list of **indexed fields** that will be added by MeiliSearch on document addition — making it easy to ignore some uninteresting field that you have not cleaned out.

You could give a list of **searchable fields** that will be used to determine the relevancy of the documents. Excluding some fields with non-relevant information.

You could give a list of **displayed fields** that will be present in the returned documents after a search — removing some fields that will not be displayed to the end-users and take unnecessary bandwidth.

By default, the three options take all the fields presents in all the documents. Once you have set a list of fields on one option, it will only take the fields present in the list, not applying the option on the fields not present in the list.

[More information about fields settings](/guides/main_concepts/indexes.md)<Badge text="soon" type="warn"/>
