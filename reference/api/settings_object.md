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

## `displayedAttributes`

**Type**: Array of strings

**Description**: Fields displayed in the returned documents

**Default value**: All attributes

**Dedicated API route**: [`/settings/displayed-attributes`](/reference/api/displayed_attributes.md)

**Dedicated guide**:

## `distinctAttribute`

**Type**: String

**Description**: Search returns documents with distinct (different) values of the given field

**Default value**: `null`

**Dedicated API route**: [`/settings/distinct-attribute`](/reference/api/distinct_attribute.md)

**Dedicated guide**:

## `faceting`

**Type**: Object

**Description**: Faceting settings

| Name                | Type    | Description                                            | Default value |
|---------------------|---------|--------------------------------------------------------|---------------|
| `maxValuesPerFacet` | Integer | Maximum number of facet values returned for each facet | `100`         |

```json
{
  "maxValuesPerFacet": 100
}
```

**Dedicated guide**:

**Dedicated API route**: [`/settings/faceting`](/reference/api/faceting.md)

## `filterableAttributes`

**Type**: Array of strings

**Description**: Attributes to use as filters and facets

**Default value**: Empty

**Dedicated API route**: [`/settings/filterable-attributes`](/reference/api/filterable_attributes.md)

**Dedicated guide**:

## `pagination`

**Type**: Object

**Description**: Pagination settings

| Name           | Type       | Description                                          | Default value |
|----------------|------------|------------------------------------------------------|---------------|
| `maxTotalHits` | Integer    | The maximum number of results Meilisearch can return | `1000`        |

```json
{
  "maxTotalHits": 1000
}
```

**Dedicated API route**: [`/settings/pagination`](/reference/api/pagination.md)

**Dedicated guide**:

## `rankingRules`

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

**Dedicated API route**: [`/settings/ranking-rules`](/reference/api/ranking_rules.md)

**Dedicated guide**:

## `searchableAttributes`

**Type**: Array of strings

**Description**: Fields in which to search for matching query words sorted by order of importance

**Default value**: All attributes

**Dedicated API route**: [`/settings/searchable-attributes`](/reference/api/searchable_attributes.md)

**Dedicated guide**:

## `sortableAttributes`

**Type**: Array of strings

**Description**: Attributes to use when sorting search results

**Default value**: Empty

**Dedicated API route**: [`/settings/sortable-attributes`](/reference/api/sortable_attributes.md)

**Dedicated guide**:

## `stopWords`

**Type**: Array of strings

**Description**: List of words ignored by Meilisearch when present in search queries

**Default value**: Empty

**Dedicated API route**: [`/settings/stop-words`](/reference/api/stop_words.md)

**Dedicated guide**:

## `synonyms`

**Type**: Object

**Description**: List of associated words treated similarly

**Default value**: Empty

**Dedicated API route**: [`/settings/synonyms`](/reference/api/synonyms.md)

**Dedicated guide**:

## `typoTolerance`

**Type**: Object

**Description**: Typo tolerance settings

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

**Dedicated API route**: [`/settings/typo-tolerance`](/reference/api/typo_tolerance.md)
