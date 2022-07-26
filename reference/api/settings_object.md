# Settings object

## [`displayedAttributes`](/reference/api/displayed_attributes.md)

**Type**: Array of strings

**Description**: Fields displayed in the returned documents.

**Default value**: `[*]`

| Name | Type | Description |
|------|------|-------------|
|      |      |             |

## [Distinct attribute](/reference/api/distinct_attribute.md)

| Name | Type | Description |
|------|------|-------------|
|      |      |             |

## [Faceting](/reference/api/faceting.md)

**Type**: Object

**Description**:

| Name                | Type    | Description                                            | Default value |
|---------------------|---------|--------------------------------------------------------|---------------|
| `maxValuesPerFacet` | Integer | Maximum number of facet values returned for each facet | `100`         |

## [Filterable attributes](/reference/api/filterable_attributes.md)

| Name | Type | Description |
|------|------|-------------|
|      |      |             |

## [Pagination](/reference/api/pagination.md)

**Type**: Object

**Description**:

| Name           | Type       | Description                                          | Default value |
|----------------|------------|------------------------------------------------------|---------------|
| `maxTotalHits` | Integer    | The maximum number of results Meilisearch can return | `1000`        |

## [Ranking rules](/reference/api/ranking_rules.md)

**Type**: Array

**Description**: An array that contains ranking rules in order of importance.

| Name | Type | Description |
|------|------|-------------|
| words     |      |             |
| typo     |      |             |
| proximity     |      |             |
|      |      |             |
|      |      |             |
|      |      |             |
|      |      |             |

## [Searchable attributes](/reference/api/searchable_attributes.md)

| Name | Type | Description |
|------|------|-------------|
|      |      |             |

## [Sortable attributes](/reference/api/sortable_attributes.md)

| Name | Type | Description |
|------|------|-------------|
|      |      |             |

## [Stop words](/reference/api/stop_words.md)

| Name | Type | Description |
|------|------|-------------|
|      |      |             |

## [Synonyms](/reference/api/synonyms.md)

| Name | Type | Description |
|------|------|-------------|
|      |      |             |

## [Typo tolerance](/reference/api/typo_tolerance.md)

### `enabled`

**Type**: Boolean

**Description**: Whether typo tolerance is enabled or not

### `minWordSizeForTypos`

**Type**: Object

**Description**: The minimum word length for tolerating 1 or 2 typos

| Name       | Description                                                                       | Type    | Default value |
|------------|-----------------------------------------------------------------------------------|---------|---------------|
| `oneTypo`  | The minimum word size for accepting 1 typo; must be between `0` and `twoTypos`    | integer | `5`           |
| `twoTypos` | The minimum word size for accepting 2 typos; must be between `oneTypo` and `255`  | integer | `9`           |

### `disableOnWords`

**Type**: Array

**Description**: An array of words for which the typo tolerance feature is disabled

### `disableOnAttributes`

**Type**: Array

**Description**: An array of attributes for which the typo tolerance feature is disabled

```json
{
    "displayedAttributes":["*"],
    "searchableAttributes":["*"],
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
