# Indexes

An index is the collection of a certain type of data.

It is, as a table in SQL, or a collection in MongoDB, an entity that collects a set of documents.

An index is defined by an `uid` and contains the following information:
- One <glossary word="primary key"/>
- A set of relevancy rules (based on presets and customization)
- A list of synonyms and stop-words
- Rules for each field of a document


#### Example

In the case of a movie database, you probably have multiples categories. One for movie descriptions, one for actors, and one for reviews. Each one of these categories is represented by an index. 

Each of the indexes has information about the fields found in the documents, how MeiliSearch handles them, and their order of importance. An index also has its own synonyms, relevancy rules, and stop-words. The information of one index never acts on another index.

This means you can create synonyms for a `movie` index and different synonyms for a `clothes` index on the same MeiliSearch server.

## Index UID

The `uid` of an index is its **unique** identifier. It is the `:index_uid` parameter found on every `indexes/:index_uid` route.

The uid is set on [index creation](/references/indexes.md#create-an-index). After which you cannot create another index with the same `uid`.
The `uid` cannot be changed.


```json
{
    "uid": "movie",
    "createdAt": "2019-11-20T09:40:33.711324Z",
    "updatedAt": "2019-11-20T10:16:42.761858Z"
  }
```

## Primary key

The primary key is a <glossary word="field" /> present in all documents. This field is composed of a primary key <glossary word="attribute"/> name and it's unique value. All documents in a given index have the same primary key attribute, with each a unique value. The primary key's attribute name **must** be known by the index. There are [multiple ways to set your primary key](/guides/main_concepts/documents.md#setting-the-primary-key).

[More information about the document primary key](/guides/main_concepts/documents.md#primary-key)

## Relevancy rules

Each index has its own relevancy rules. By default, all indexes come with the same <glossary word="ranking rules"/> applied in the same order. Once you add your first document, from the order of the keys in this document, the index will be able to record which key is more important than another.

For example, if your first document has the following keys in this order: `id, title, description, release_date`. A document containing the matching query in the `title` will be considered more relevant than a document where it is in `description`.

On top of that, you can add your own rule to the ranking rules. For example, you can rank your movies by release date or per popularity. It's also possible to do both. And so on, depending on your available data and your user's needs.

[More information about ranking rules](/guides/main_concepts/relevancy.md)

## Synonyms and stop-words

An index can contain a set of synonyms. If multiples words have an equivalent meaning in your dataset, you can decide to create a synonym for theses words. The search engine will give the same search results for any search with one of the associated words as a search query. The synonyms are linked to the given index, and they will not apply to any other index on the same MeiliSearch instance.

[More information about synonyms](/guides/advanced_guides/synonyms.md)

An index can contain a list of stop-words. Those words will be ignored in documents and search queries. Typically those words could be redundant words of your chosen language, like `the` or `of` in English.
By adding those words in the stop-words list, you avoid having documents considered highly relevant because of the recurrence of one of those words in a document.

For example, on the following search query: `the great gatsby`, if the presence of the word `the` in a film review should not make the review more relevant. By adding `the` to the stop-word list, you avoid searching in documents containing only this stop-word.

[More information about stop-words](/guides/advanced_guides/stop_words.md)

## Fields properties

In MeiliSearch, by default, every document field is searchable and returned on search queries.

The properties of the fields can be changed in the [settings](/references/settings.md).

Fields can have the following properties:
- Searchable
- Displayed

### Searchable fields

Searchable fields are all the fields of which attribute is present in the [searchable-attributes](/references/searchable_attributes.md) list.

When a fields attribute is present in the searchable-attribute list, the content of the field will be used by MeiliSearch to determine the relevancy of a document.
When a fields attribute is not present in the searchable-attribute list, while it is still stored, it will be ignored during a search.

By default, all fields attributes are added to the searchable-attributes list. If a new document is added with a field never present in any other document, it will automatically be added to the searchable-attributes list. [This behavior can be changed](/references/accept_new_fields.md).

This list can be restricted to a certain set of attributes that you chose in the settings. That way, you can determine which fields should be ignored by MeiliSearch during a search.

### Displayed attributes

Displayed fields are all the fields of which attribute is present in the [displayed-attributes](/references/displayed_attributes.md) list.

When a fields attribute is present in the displayed-attribute list, the field will be present in the documents returned upon search.
When a fields attribute is not present in the displayed-attribute list, the field will be absent in the documents.

By default, all fields attributes are added to the displayed-attributes list. If a new document is added with a field never present in any other document, it will automatically be added to the displayed-attributes list. [This behavior can be changed](/references/accept_new_fields.md).

This list can be restricted to a certain set of attributes that you chose in the settings. That way, you can determine which fields should be not be returned upon search.

### Data storing

Every field is stored. This cannot be changed. That way if a field is not in the displayed-attributes list and not in the searchable-attributes list, it is still stored in MeiliSearch and could be added to either list at any time.
