# The settings object

## [Displayed attributes](/reference/api/displayed_attributes.md)

## [Distinct attribute](/reference/api/distinct_attribute.md)

## [Faceting](/reference/api/faceting.md)

**Type**: Object

**Description**:

## [Filterable attributes](/reference/api/filterable_attributes.md)

## [Pagination](/reference/api/pagination.md)

**Type**: Object

**Description**:

## [Ranking rules](/reference/api/ranking_rules.md)

## [Searchable attributes](/reference/api/searchable_attributes.md)

## [Sortable attributes](/reference/api/sortable_attributes.md)

## [Stop words](/reference/api/stop_words.md)

## [Synonyms](/reference/api/synonyms.md)

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
