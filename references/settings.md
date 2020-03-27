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
  "rankingDistinct": null,
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
  "indexNewFields": false
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

| Variable                 | Type      | Description                                                                  | Default value                                                                                 |
| ------------------------ | --------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **rankingRules**         | [Strings] | Ranking rules in their order of importance                                   | [built-in ranking rules list in order](/guides/main_concepts/relevancy.md#order-of-the-rules) |
| **rankingDistinct**      | String    | Returns only distinct (different) values of the given field                  | `null`                                                                                        |
| **searchableAttributes** | [Strings] | Fields in which to search for matching query words (_ordered by importance_) | All attributes found in the documents                                                         |
| **displayedAttributes**  | [Strings] | Fields present in the returned documents                                     | All attributes found in the documents                                                         |
| **stopWords**            | [Strings] | Words in the search query that will be ignored                               | `[]`                                                                                          |
| **synonyms**             | Object    | List of associated words that are considered the same in a search query      | `{}`                                                                                          |
| **indexNewFields**       | Boolean   | New fields in newly added document are/aren't added to MeiliSearch           | `true`                                                                                        |

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
            "dsc(rank)",
        ],
        "rankingDistinct": "movie_id",
        "searchableAttributes": [
            "uid",
            "movie_id",
            "title",
            "description",
            "poster",
            "release_date",
            "rank",
        ],
        "displayedAttributes": [
            "title",
            "description",
            "poster",
            "release_date",
            "rank",
        ],
        "stopWords": [
            "the",
            "a",
            "an",
        ],
        "synonyms": {
            "wolverine": ["xmen", "logan"],
            "logan": ["wolverine"],
        },
        "indexNewFields": false,
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

| Variable                 | Description                                                                  | Default value                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **rankingRules**         | Ranking rules in their order of importance                                   | [built-in ranking rules list in order](/guides/main_concepts/relevancy.md#order-of-the-rules) |
| **rankingDistinct**      | Returns only distinct (different) values of the given field                  | `null`                                                                                        |
| **searchableAttributes** | Fields in which to search for matching query words (_ordered by importance_) | All attributes found in the documents                                                         |
| **displayedAttributes**  | Fields present in the returned documents                                     | All attributes found in the documents                                                         |
| **stopWords**            | Words in the search query that will be ignored                               | `[]`                                                                                          |
| **synonyms**             | List of associated words that are considered the same in a search query      | `{}`                                                                                          |
| **indexNewFields**       | New fields in newly added document are/aren't added to MeiliSearch           | `true`                                                                                        |

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
