# Indexes

An index is the collection of a certain type of data, an entity that gathers a set of documents.

It can be comparable to a table in `SQL`, or a collection in MongoDB.

An index is defined by an `uid` and contains the following information:

- One <clientGlossary word="primary key"/>
- A set of relevancy rules (based on presets and customization)
- A list of synonyms and stop-words
- Rules for each field of a document

#### Example

Suppose you manage a database that contains information about movies. You would probably want to have multiple categories: one for movie descriptions, one for actors, and one for reviews. Each of these categories would be represented by an index in MeiliSearch.

Each index holds information about the fields found in the documents, how they get handled by MeiliSearch, and their order of importance. Besides, an index defines its own synonyms, relevancy rules, and stop words. The information of one index doesn't impact other indexes.

For example, it means you could create on the same server synonyms for a `movie` index and other synonyms for a `clothes` index which would be different.

## Index UID

The `uid` is the **unique** identifier of a given index. It can be found on every `indexes/:index_uid` route as `:index_uid` parameter.

The uid is set on [index creation](/references/indexes.md#create-an-index). Once a `uid` has been defined for an index, you cannot create another index with the same `uid` and the identifier **cannot be changed anymore**.

```json
{
  "uid": "movie",
  "createdAt": "2019-11-20T09:40:33.711324Z",
  "updatedAt": "2019-11-20T10:16:42.761858Z"
}
```

## Primary key

The primary key is a <clientGlossary word="field"/> present in all documents. This field is composed of a primary key <clientGlossary word="attribute"/> name and a unique value. All documents in a given index share the same primary key attribute but a different unique value. The primary key's attribute name **must** be known by the index. You can [set a primary key for an index](/guides/main_concepts/documents.md#setting-the-primary-key) in several ways.

For detailed information about the document primary key, see [this section.](/guides/main_concepts/documents.md#primary-key)

## Relevancy rules

Each index applies its own relevancy rules. All indexes are created configured with the same default <clientGlossary word="ranking rules"/> executed in a default order. Once your first document has been added, the index will be able to record how it should sort the keys. Their order of importance will be deduced from how the keys were listed in the document.

For example, if in your first document keys are listed as follows: `id, title, description, release_date`, any document containing the matching query in `title` will be considered more relevant than a document containing it in `description`.

On top of that, you can add your custom rules to the ranking rules. For example, you may want to rank your movies either by release date or popularity, or both and so on. Rules are customizable so the results meet your user's needs as close as possible.

[More information about ranking rules](/guides/main_concepts/relevancy.md)

## Synonyms and stop-words

An index can contain a set of synonyms. If multiples words have an equivalent meaning in your dataset, you can decide to create a synonym for theses words. The search engine will give the same search results for any search with one of the associated words as a search query. The synonyms are linked to the given index, and they will not apply to any other index on the same MeiliSearch instance.

[More information about synonyms](/guides/advanced_guides/synonyms.md)

An index can contain a list of stop-words. Those words will be ignored in documents and search queries. Typically those words could be redundant words of your chosen language, like `the` or `of` in English.
By adding those words in the stop-words list, you avoid having documents considered highly relevant because of the recurrence of one of those words in a document.

For example, on the following search query: `the great gatsby`, if the presence of the word `the` in a film review should not make the review more relevant. By adding `the` to the stop-word list, you avoid searching in documents containing only this stop word.

[More information about stop words](/guides/advanced_guides/stop_words.md)

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
