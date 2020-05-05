# Settings Configuration

This page describes all the **settings** available in MeiliSearch and how to **configure** them.

| Variable                                                                              | Description                                                                      | Default value                                                                                     |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **[synonyms](/guides/advanced_guides/settings.md#synonyms)**                          | List of associated words treated similarly                                       | `{}`                                                                                              |
| **[stopWords](/guides/advanced_guides/settings.md#stop-words)**                       | List of words ignored by MeiliSearch when present in search queries              | `[]`                                                                                              |
| **[rankingRules](/guides/advanced_guides/settings.md#ranking-rules)**                 | List of ranking rules sorted by order of importance                              | [A list of ordered built-in ranking rules](/guides/main_concepts/relevancy.md#order-of-the-rules) |
| **[distinctAttribute](/guides/advanced_guides/settings.md#distinct-attribute)**       | Search returns documents with distinct (different) values of the given field     | `null`                                                                                            |
| **[searchableAttributes](/guides/advanced_guides/settings.md#searchable-attributes)** | Fields in which to search for matching query words sorted by order of importance | All attributes found in the documents                                                             |
| **[displayedAttributes](/guides/advanced_guides/settings.md#displayed-attributes)**   | Fields displayed in the returned documents                                       | All attributes found in the documents                                                             |
| **[acceptNewFields](/guides/advanced_guides/settings.md#accept-new-fields)**          | Defines whether new fields should be searchable and displayed or not             | `true`                                                                                            |

## Synonyms

A set of words defined for an index. Synonyms are **different words that have the same meaning**, and thus are treated similarly. If either of the associated words is searched, the same results will be displayed.

`synonyms=<Object>`

- `<Object>` (Object, defaults to `{}`) : `{ <String>: [<String>, <String>, ...], ... }`

  An object that contains words with a list of their associated synonyms.

[Learn more about synonyms](/guides/advanced_guides/synonyms.md)

#### Example

Suppose you have an e-commerce dataset. For an index that contains information about tops, you decide to create synonyms for `sweater` and `jumper` since these two items are very similar.

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/tops/settings' \
  --data '{
      "synonyms": {
          "sweater": ["jumper"],
          "jumper": ["sweater"]
      }
  }'
```

By doing so, when searching for `black sweater`, results for `black jumper` will also be returned.

## Stop words

A set of words defined for an index. Because some words neither add semantic value nor context, you may want to ignore them from your search. Stop words are **ignored during search**.

`stopWords=[<String>, <String>, ...]`

- `[<String>, <String>, ...]` (Array of strings, defaults to `[]`)

  An array of strings that contains the stop words.

[Learn more about stop words](/guides/advanced_guides/stop_words.md)

#### Example

To add `the`, `a` and `an` to the stop words list, send:

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/settings' \
  --data '{
      "stopWords": [
          "the",
          "a",
          "an"
      ]
  }'
```

With the settings in the example above, `the`, `a` and `an` are now ignored by the sorting algorithm if they are present in search queries.

Suppose you would like to search `the mask` in a movie database. Since `the` is ignored during search, MeiliSearch will look for every movie containing `mask` and not the millions ones containing `the`. `the` is a less relevant term than `mask` and also a very frequent word in English. By adding `the` to the stop words list, MeiliSearch will ignore this word, and thus be faster to answer without losing in relevancy.

## Ranking rules

Built-in ranking rules that **ensure relevancy in search results**. Ranking rules are applied in a default order which can be changed in the settings. You can add or remove rules and change their order of importance.

`rankingRules=[<String>, <String>, ...]`

- `[<String>, <String>, ...]` (Array of strings, see default value below)

  An array of strings that contains the ranking rules sorted by order of importance (arranged from the most important rule to the least important rule).

Default value (the ranking rules in the default order):

```json
["typo", "words", "proximity", "attribute", "wordsPosition", "exactness"]
```

[Read this guide to know more about what each ranking rules does](/guides/main_concepts/relevancy.md)

### Custom ranking rule

You can add a custom ranking rule anywhere in the list of ranking rules. A custom ranking rule is composed of an attribute and an ascending or descending order. The attribute **must have a numeric value** in the documents.

#### Example

To add your ranking rules to the settings, send:

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/settings' \
  --data '{
      "rankingRules": [
          "typo",
          "words",
          "proximity",
          "attribute",
          "wordsPosition",
          "exactness",
          "asc(release_date)",
          "desc(rank)"
      ]
  }'
```

With the settings in the example above, documents will be sorted by number of typos first. If too many documents have the same number of typos, the `words` rule will be applied. This operation will be repeated with the next rules until the requested number of documents has been reached (default: 20).

## Distinct attribute

The **value of a field** whose attribute is set as a distinct attribute will always be **unique** in the returned documents.

`distinctAttribute=<String>`

- `<String>` (String, defaults to `null`)

  The field name.

[Learn more about the distinct attribute](/guides/advanced_guides/distinct.md)

#### Example

Suppose you have an e-commerce dataset. For an index that contains information about jackets, you may have several identical items in different variations (color or size).

As shown below, you have 2 documents that contain information about the same jacket. One of the jackets is brown and the other one is black.

```json
[
  {
    "id": 1,
    "description": "Leather jacket",
    "brand": "Lee jeans",
    "color": "brown",
    "product_id": "123456"
  },
  {
    "id": 2,
    "description": "Leather jacket",
    "brand": "Lee jeans",
    "color": "black",
    "product_id": "123456"
  }
]
```

You may want to ignore the different colors of an item. To do so, you can set `product_id` as a `distinctAttribute`.

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/jackets/settings' \
  --data '{
      "distinctAttribute": "product_id"
  }'
```

With the settings in the example above, only one of the two documents will be returned if you search `Lee leather jacket`.

## Searchable attributes

The content of the fields whose attributes are added to the [searchable-attributes list](/references/searchable_attributes.md) are **searched for matching query words**.

`searchableAttributes=[<String>, <String>, ...]`

- `[<String>, <String>, ...]` (Array of strings, defaults to all attributes found in the documents)

  An array of strings that contains searchable attributes ordered by importance (arranged from the most important attribute to the least important attribute).

[Learn more about searchable attributes](/guides/advanced_guides/field_properties.md#searchable-fields)

#### Example

By adding the following settings, the fields `uid`, `movie_id`, `title`, `description`, `poster`, `release_date` and `rank` will be searched.

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/settings' \
  --data '{
      "searchableAttributes": [
          "uid",
          "movie_id",
          "title",
          "description",
          "poster",
          "release_date",
          "rank"
      ]
  }'
```

## Displayed attributes

The fields whose attributes are added to the [displayed-attributes list](/references/displayed_attributes.md) are **contained in each matching document**.

Documents returned upon search contain only displayed fields.

`displayedAttributes=[<String>, <String>, ...]`

- `[<String>, <String>, ...]` (Array of strings, defaults to all attributes found in the documents)

  An array of strings that contains attributes of an index to display.

[Learn more about displayed attributes](/guides/advanced_guides/field_properties.md#displayed-fields)

#### Example

By adding the following settings, documents returned upon search will contain the fields `title`, `description`, `poster`, `release_date` and `rank`.

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/settings' \
  --data '{
      "displayedAttributes": [
          "title",
          "description",
          "poster",
          "release_date",
          "rank"
      ]
  }'
```

## Accept new fields

This setting takes a **Boolean value** (`true` or `false`) and defines whether new fields should be automatically added to the [searchable-attributes](/references/searchable_attributes.md) and the [displayed-attributes](/references/displayed_attributes.md) lists.

`acceptNewFields=<Boolean>`

- `<Boolean>` (Boolean, defaults to `true`)

  If set to `true`, which is the _default_ value, all new fields are searchable and displayed in returned documents.

  If set to `false`, fields are stored but neither searchable nor displayed in returned documents.

[Learn more about field properties](/guides/advanced_guides/field_properties.md)

#### Example

If you set `acceptNewFields` to `false`, new fields will be stored but neither searchable nor displayed in returned documents.

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/settings' \
  --data '{
      "acceptNewFields": false
  }'
```
