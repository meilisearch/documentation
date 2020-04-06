# Settings

`Settings` is a list of all the **customization** possible for an index.

It is possible to update all the settings in one go or individually with the dedicated routes.

These are the reference pages for the dedicated routes:

- [Synonyms](/references/synonyms.md)
- [Stop-words](/references/stop_words.md)
- [Ranking rules](/references/ranking_rules.md)
- [Distinct attribute](/references/distinct_attribute.md)
- [Searchable attributes](/references/searchable_attributes.md)
- [Displayed attributes](/references/displayed_attributes.md)
- [Accept new fields](/references/accept_new_fields.md)

::: note
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

## Get settings

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings" />

Get the settings of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings'
```

#### Response: `200 Ok`

List the settings.

```json
{
  "rankingRules": [
    "typo",
    "words",
    "proximity",
    "attribute",
    "wordsPosition",
    "exactness",
    "dsc(release_date)"
  ],
  "distinctAttribute": null,
  "searchableAttributes": ["title", "description", "uid"],
  "displayedAttributes": [
    "title",
    "description",
    "release_date",
    "rank",
    "poster"
  ],
  "stopWords": null,
  "synonyms": {
    "wolverine": ["xmen", "logan"],
    "logan": ["wolverine", "xmen"]
  },
  "acceptNewFields": false
}
```

## Update settings

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings" />

Update the settings of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

| Variable                 | Type      | Description                                                                      | Default value                                                                                     |
| ------------------------ | --------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **synonyms**             | Object    | List of associated words treated similarly                                       | `{}`                                                                                              |
| **stopWords**            | [Strings] | List of words ignored by MeiliSearch when present in search queries              | `[]`                                                                                              |
| **rankingRules**         | [Strings] | List of ranking rules sorted by order of importance                              | [A list of ordered built-in ranking rules](/guides/main_concepts/relevancy.md#order-of-the-rules) |
| **distinctAttribute**    | String    | Search returns documents with distinct (different) values of the given field     | `null`                                                                                            |
| **searchableAttributes** | [Strings] | Fields in which to search for matching query words sorted by order of importance | All attributes found in the documents                                                             |
| **displayedAttributes**  | [Strings] | Fields displayed in the returned documents                                       | All attributes found in the documents                                                             |
| **acceptNewFields**      | Boolean   | Defines if new fields should be searchable and displayed or not                  | `true`                                                                                            |

Any parameters not provided will be left unchanged.

### Examples

#### Add settings

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
      ],
      "distinctAttribute": "movie_id",
      "searchableAttributes": [
          "uid",
          "movie_id",
          "title",
          "description",
          "poster",
          "release_date",
          "rank"
      ],
      "displayedAttributes": [
          "title",
          "description",
          "poster",
          "release_date",
          "rank"
      ],
      "stopWords": [
          "the",
          "a",
          "an"
      ],
      "synonyms": {
          "wolverine": ["xmen", "logan"],
          "logan": ["wolverine"]
      },
      "acceptNewFields": false
  }'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Reset settings

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings"/>

Reset the settings of an index.

All settings will be reset to their default value.

| Variable                 | Description                                                                      | Default value                                                                                     |
| ------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **synonyms**             | List of associated words treated similarly                                       | `{}`                                                                                              |
| **stopWords**            | List of words ignored by MeiliSearch when present in search queries              | `[]`                                                                                              |
| **rankingRules**         | List of ranking rules sorted by order of importance                              | [A list of ordered built-in ranking rules](/guides/main_concepts/relevancy.md#order-of-the-rules) |
| **distinctAttribute**    | Search returns documents with distinct (different) values of a given field       | `null`                                                                                            |
| **searchableAttributes** | Fields in which to search for matching query words sorted by order of importance | All attributes found in the documents                                                             |
| **displayedAttributes**  | Fields displayed in the returned documents documents                             | All attributes found in the documents                                                             |
| **acceptNewFields**      | Defines whether new fields should be searchable and displayed or not             | `true`                                                                                            |

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

```bash
$ curl \
  -X DELETE 'http://localhost:7700/indexes/movies/settings'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).
