# Settings object

The settings object allows you to customize index level settings for your Meilisearch instance.

```json
{
    "displayedAttributes":[
        "*"
    ],
    "searchableAttributes":[
        "*"
    ],
    "filterableAttributes":[],
    "sortableAttributes":[],
    "rankingRules":
    [
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness"
    ],
    "stopWords":[],
    "synonyms":{},
    "distinctAttribute":null,
    "typoTolerance":{
        "enabled":true,
        "minWordSizeForTypos":{
            "oneTypo":5,
            "twoTypos":9
            },
        "disableOnWords":[],
        "disableOnAttributes":[]
        },
    "faceting":{
        "maxValuesPerFacet":100
        },
    "pagination":{
        "maxTotalHits":1000
        }
}
```

## [`displayedAttributes`](/reference/api/displayed_attributes.md)

**Type**: Array of strings

**Description**: Fields displayed in the returned documents

**Default value**: All attributes

## [`distinctAttribute`](/reference/api/distinct_attribute.md)

**Type**: String

**Description**: Search returns documents with distinct (different) values of the given field

**Default value**: `null`

## [`faceting`](/reference/api/faceting.md)

**Type**: Object

**Description**: Faceting settings

**Default value**:

```json
{
  "maxValuesPerFacet": 100
}
```

| Name                | Type    | Description                                            | Default value |
|---------------------|---------|--------------------------------------------------------|---------------|
| `maxValuesPerFacet` | Integer | Maximum number of facet values returned for each facet | `100`         |

## [`filterableAttributes`](/reference/api/filterable_attributes.md)

**Type**: Array of strings

**Description**: Attributes to use as filters and facets

**Default value**: Empty

## [`pagination`](/reference/api/pagination.md)

**Type**: Object

**Description**: Pagination settings

**Default value**:

```json
{
  "maxTotalHits": 1000
}
```

| Name           | Type       | Description                                          | Default value |
|----------------|------------|------------------------------------------------------|---------------|
| `maxTotalHits` | Integer    | The maximum number of results Meilisearch can return | `1000`        |

## [`rankingRules`](/reference/api/ranking_rules.md)

**Type**: Array

**Description**: An array that contains ranking rules in order of importance

**Default value**:

```json
[
  "words",
  "typo",
  "proximity",
  "attribute",
  "sort",
  "exactness"
]
```

## [`searchableAttributes`](/reference/api/searchable_attributes.md)

**Type**: Array of strings

**Description**: Fields in which to search for matching query words sorted by order of importance

**Default value**: All attributes

## [`sortableAttributes`](/reference/api/sortable_attributes.md)

**Type**: Array of strings

**Description**: Attributes to use when sorting search results

**Default value**: Empty

## [`stopWords`](/reference/api/stop_words.md)

**Type**: Array of strings

**Description**: List of words ignored by Meilisearch when present in search queries

**Default value**: Empty

## [`synonyms`](/reference/api/synonyms.md)

**Type**: Object

**Description**: List of associated words treated similarly

**Default value**: Empty

## [`typoTolerance`](/reference/api/typo_tolerance.md)

**Type**: Object

**Description**: Typo tolerance settings

**Default value**:

```json
{
    "enabled":true,
    "minWordSizeForTypos":{
        "oneTypo":5,
        "twoTypos":9
        },
    "disableOnWords":[],
    "disableOnAttributes":[]
}
```

### `enabled`

**Type**: Boolean

**Description**: Whether typo tolerance is enabled or not

**Default value**: `true`

### `minWordSizeForTypos`

**Type**: Object

**Description**: The minimum word length for tolerating 1 or 2 typos

| Name       | Description                                                                       | Type    | Default value |
|------------|-----------------------------------------------------------------------------------|---------|---------------|
| `oneTypo`  | The minimum word size for accepting 1 typo; must be between `0` and `twoTypos`    | integer | `5`           |
| `twoTypos` | The minimum word size for accepting 2 typos; must be between `oneTypo` and `255`  | integer | `9`           |

### `disableOnWords`

**Type**: Array of strings

**Description**: An array of words for which the typo tolerance feature is disabled

**Default value**: Empty

### `disableOnAttributes`

**Type**: Array of strings

**Description**: An array of attributes for which the typo tolerance feature is disabled

**Default value**: Empty
