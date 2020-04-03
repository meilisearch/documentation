# All settings

This section describes all **configuration settings** available in MeiliSearch.

| Variable                                                                              | Description                                                                      | Default value                                                                                     |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **[synonyms](/guides/advanced_guides/settings.md#synonyms)**                          | List of associated words that should be treated similarly in a search query      | `{}`                                                                                              |
| **[stopWords](/guides/advanced_guides/settings.md#stop-words)**                       | List of words that should be excluded from search queries                        | `[]`                                                                                              |
| **[rankingRules](/guides/advanced_guides/settings.md#ranking-rules)**                 | List of ranking rules sorted by order of importance                              | [A list of ordered built-in ranking rules](/guides/main_concepts/relevancy.md#order-of-the-rules) |
| **[distinctAttribute](/guides/advanced_guides/settings.md#distinct-attribute)**       | Returns only distinct (different) values of a given field                        | `null`                                                                                            |
| **[searchableAttributes](/guides/advanced_guides/settings.md#searchable-attributes)** | Fields in which to search for matching query words sorted by order of importance | All attributes found in the documents                                                             |
| **[displayedAttributes](/guides/advanced_guides/settings.md#displayed-attributes)**   | Fields displayed in the returned documents                                       | All attributes found in the documents                                                             |
| **[acceptNewFields](/guides/advanced_guides/settings.md#accept-new-fields)**          | Defines if new fields should be searchable and displayed or not                  | `true`                                                                                            |

## Synonyms

A set of words defined for an index. Synonyms are **different words that have the same meaning**, and thus are be treated similarly. If either of the associated words is searched, the same results shall be displayed.

`synonyms=<Object>`

- `<Object>` (Object, defaults to `{}`)

  An object that contains all synonyms and their associated words.

#### Example

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/settings' \
  --data '{
      "synonyms": {
          "wolverine": ["xmen", "logan"],
          "logan": ["wolverine"]
      }
  }'
```

[Learn more about synonyms](/guides/advanced_guides/synonyms.md)

## Stop words

A set of words defined for an index. Because some words neither add semantic value nor context, you may want to ignore them from your search. Stop words are **excluded from search queries**.

`stopWords=[<String>, <String>, ...]`

- `[<String>, <String>, ...]` (Array of strings, defaults to `[]`)

  An array of strings that contains the stop words.

#### Example

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

[Learn more about stop words](/guides/advanced_guides/stop_words.md)

## Ranking rules

Built-in ranking rules to **ensure relevancy in search results**. They are customizable so the results meet your user's needs as close as possible. Ranking rules are applied in a default order which can be changed in the settings.

`rankingRules=[<String>, <String>, ...]`

- `[<String>, <String>, ...]` (Array of strings, see default value below)

  An array of strings that contains the ranking rules sorted by order of importance (arranged from the most important rule to the least important rule).

Default value:

```json
["typo", "words", "proximity", "attribute", "wordsPosition", "exactness"]
```

By default, rules are executed in the following order:

#### 1. Typo

Results are sorted by **ascending number of typos**: find documents that match query terms with fewer typos first.

#### 2. Words

Results are sorted by **descending number of occurrences of the query terms** in each matching document: find documents that contain more occurrences of the query terms first.

#### 3. Proximity

Results are sorted by **descending proximity of the query words** found in the matching documents: find documents that contain more query words near each other and placed in the correct order first.

#### 4. Attribute

Results are sorted by **[attribute importance](/guides/main_concepts/relevancy.md#attributes-importance)**.

#### 5. Words Position

Results are sorted by **the position of the query words in the attributes**. MeiliSearch determines the order of importance of the attributes based on the order in which they appear in the first document added. The first found attribute in the document is considered as the most relevant term whereas the last one found in the document is considered as the last relevant term.

#### 6. Exactness

Results are sorted by **the similarity of the matched words with the query words**: find documents that contain exactly the same terms as the ones queried first.

#### Example

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
          "dsc(release_date)",
          "dsc(rank)"
      ]
  }'
```

[Learn more about ranking rules](/guides/main_concepts/relevancy.md)

## Distinct attribute

A field whose value will always be **unique** in the returned documents.

`distinctAttribute=<String>`

- `<String>` (String, defaults to `null`)

  The field name.

#### Example

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/settings' \
  --data '{
      "distinctAttribute": "movie_id"
  }'
```

## Searchable attributes

Fields in which to **search for matching query words**.

`searchableAttributes=[<String>, <String>, ...]`

- `[<String>, <String>, ...]` (Array of strings, defaults to all attributes found in the documents)

  An array of strings that contains searchable attributes sorted by order of importance (arranged from the most important attribute to the least important attribute).

#### Example

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

[Learn more about searchable attributes](/guides/advanced_guides/field_properties.md#searchable-fields)

## Displayed attributes

Displayed attributes are the **fields contained in each matching document**.

Documents returned upon search contain only displayed fields.

`displayedAttributes=[<String>, <String>, ...]`

- `[<String>, <String>, ...]` (Array of strings, defaults to all attributes found in the documents)

  An array of strings that contains attributes of an index to display.

#### Example

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

[Learn more about displayed attributes](/guides/advanced_guides/field_properties.md#displayed-attributes)

## Accept new fields

This setting takes a **Boolean** value and defines whether new fields should be automatically added to the [searchable-attributes](/references/searchable_attributes.md) and the [displayed-attributes](/references/displayed_attributes.md) lists.

It can take the value of `true` or `false` and defaults to `true`.

`acceptNewFields=<Boolean>`

- `<Boolean>` (Boolean, defaults to `true`)

  If set to `true`, which is the _default_ value, all new fields are searchable and displayed in returned documents.

  If set to `false`, fields are stored but neither searchable nor displayed in returned documents.

#### Example

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/settings' \
  --data '{
      "acceptNewFields": false
  }'
```

[Learn more about field properties](/guides/advanced_guides/field_properties.md)
