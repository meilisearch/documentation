# Settings

It is possible to update all the settings in one go or individually with the dedicated route.

Here are the reference pages with the didicated routes:
- [Synonymn](/references/synonyms)
- [StopWords](/references/stop_words)
- [rankingRules](/references/stop_words)
- [rankingDistinct](/references/stop_words)
- [identifier](/references/stop_words)
- [searchableAttribute](/references/stop_words)
- [displayedAttribute](/references/stop_words)
- [indexNewField](/references/stop_words)

## Get settings

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings" />

Get the settings of a given index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

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
      "_typo",
      "_words",
      "_proximity",
      "_attribute",
      "_words_position",
      "_exact",
      "dsc(release_date)",
  ],
  "rankingDistinct": null,
  "searchableAttributes": [
      "title",
      "description",
      "uid",
  ],
  "displayedAttributes": [
      "title",
      "description",
      "release_date",
      "rank",
      "poster",
  ],
  "stopWords": null,
  "synonyms": {
      "wolverine": ["xmen", "logan"],
      "logan": ["wolverine", "xmen"],
  },
  "indexNewFields": false
}
```

## Add settings

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings" />

Add or replace the settings of an index.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |

#### Body

| Variable          | type |  Description |
|-------------------|-----------------------| --- |
| **rankingRules** | [Strings] | Ranking rules in their order of importance  |
| **rankingDistinct** | String | Returns only distinct (different) values of the given field |
| **searchableAttributes** | [Strings] | Fields in which to search for matching query words |
| **displayedAttributes** | [Strings] | Fields present in the returned documents |
| **stopWords** | [Strings] | Words in the search query that will be ignored |
| **synonyms** | Object | List of associated words that are considered the same in a search query |
| **indexNewFields** | Boolean | New fields in newly added document are/aren't added to MeiliSearch |

### Examples

#### Add settings

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings' \
  --data '{
   "rankingRules": [
            "_typo",
            "_words",
            "_proximity",
            "_attribute",
            "_words_position",
            "_exact",
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
    });
'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).

## Delete settings

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings"/>

Delete the settings of the index.

All settings will be set to null except for:
-  `indexNewFields` who will be set to its default value of `true`
- `rankingRules` who will have its default ranking rules in their default order.

The settings will look like this after the delete has been processed by MeiliSearch

```json
{
    "rankingRules": null,
    "rankingDistinct": null,
    "searchableAttributes": null,
    "displayedAttributes": null,
    "stopWords": null,
    "synonyms": null,
    "indexNewFields": true,
})
```
The value of `RankingRules` is **null** but it still has the default ranking rules. When no modification has been made to the ranking rules the field has a value of null. To remove all ranking rules, which is not recommended for any use-case, you should send an empty array.

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index_uid**         | The index UID |


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

