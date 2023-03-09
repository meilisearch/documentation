---

sidebarDepth: 2

---

# Search

Meilisearch exposes 2 routes to perform searches:

- A POST route: this is the preferred route when using API authentication, as it allows [preflight request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request) caching and better performances
- A GET route: the usage of this route is discouraged, unless you have good reason to do otherwise (specific caching abilities for example)

You may find exhaustive descriptions of the parameters accepted by the two routes [at the end of this article](#search-parameters).

## Search in an index with POST route

<RouteHighlighter method="POST" route="/indexes/{index_uid}/search"/>

Search for documents matching a specific query in the given index.

This is the preferred endpoint to perform search when an API key is required, as it allows for [preflight requests](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request) to be cached. Caching preflight requests **considerably improves search speed**.

::: note
By default, [this endpoint returns a maximum of 1000 results](/learn/advanced/known_limitations.md#maximum-number-of-results-per-search). If you want to scrape your database, use the [get documents endpoint](/reference/api/documents.md#get-documents) instead.
:::

### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

### Body

| Search Parameter                                        | Type             | Default value | Description                                         |
| :------------------------------------------------------ | :--------------- | :------------ | :-------------------------------------------------- |
| **[`q`](#query-q)**                                     | String           | `""`          | Query string                                        |
| **[`offset`](#offset)**                                 | Integer          | `0`           | Number of documents to skip                         |
| **[`limit`](#limit)**                                   | Integer          | `20`          | Maximum number of documents returned                |
| **[`hitsPerPage`](#number-of-results-per-page)**        | Integer          | `1`           | Maximum number of documents returned for a page     |
| **[`page`](#page)**                                     | Integer          | `1`           | Request a specific page of results                  |
| **[`filter`](#filter)**                                 | Array of strings | `null`        | Filter queries by an attribute's value              |
| **[`facets`](#facets)**                                 | Array of strings | `null`        | Display the count of matches per facet              |
| **[`attributesToRetrieve`](#attributes-to-retrieve)**   | Array of strings | `["*"]`       | Attributes to display in the returned documents     |
| **[`attributesToCrop`](#attributes-to-crop)**           | Array of strings | `null`        | Attributes whose values have to be cropped          |
| **[`cropLength`](#crop-length)**                        | Integer          | `10`          | Maximum length of cropped value in words            |
| **[`cropMarker`](#crop-marker)**                        | String           | `"…"`         | String marking crop boundaries                      |
| **[`attributesToHighlight`](#attributes-to-highlight)** | Array of strings | `null`        | Highlight matching terms contained in an attribute  |
| **[`highlightPreTag`](#highlight-tags)**                | String           | `"<em>"`      | String inserted at the start of a highlighted term  |
| **[`highlightPostTag`](#highlight-tags)**               | String           | `"</em>"`     | String inserted at the end of a highlighted term    |
| **[`showMatchesPosition`](#show-matches-position)**     | Boolean          | `false`       | Return matching terms location                      |
| **[`sort`](#sort)**                                     | Array of strings | `null`        | Sort search results by an attribute's value         |
| **[`matchingStrategy`](#matching-strategy)**            | String           | `last`        | Strategy used to match query terms within documents |

[Learn more about how to use each search parameter](#search-parameters).

#### Placeholder search

Placeholder search is a search with an empty `q` parameter. Since there is no query term, the [built-in ranking rules](/learn/core_concepts/relevancy.md#ranking-rules) **do not apply.** Only [sort](/learn/core_concepts/relevancy.md#_5-sort) and [custom ranking rules](/learn/core_concepts/relevancy.md#custom-rules) are taken into account.

If the index has no sort or custom ranking rules, the results are returned in the order of their internal database position.

#### Phrase search

Query terms enclosed in double quotes are treated as [phrase searches](#query-q).

### Response

| Name                     | Type             | Description                                     |
| :----------------------- | :--------------- | :---------------------------------------------- |
| **`hits`**               | Array of objects | Results of the query                            |
| **`offset`**             | Number           | Number of documents skipped                     |
| **`limit`**              | Number           | Number of documents to take                     |
| **`estimatedTotalHits`** | Number           | Estimated total number of matches               |
| **`totalHits`**          | Number           | Exhaustive total number of matches              |
| **`totalPages`**         | Number           | Exhaustive total number of search result pages  |
| **`hitsPerPage`**        | Number           | Number of results on each page                  |
| **`page`**               | Number           | Current search results page                     |
| **`facetDistribution`**  | Object           | **[Distribution of the given facets](#facets)** |
| **`processingTimeMs`**   | Number           | Processing time of the query                    |
| **`query`**              | String           | Query originating the response                  |

#### Exhaustive and estimated total number of search results

By default, Meilisearch only returns an estimate of the total number of search results in a query: `estimatedTotalHits`. This happens because Meilisearch prioritizes relevancy and performance over providing an exhaustive number of search results. When working with `estimatedTotalHits`, use `offset` and `limit` to navigate between search results.

If you require the total number of search results, use the `hitsPerPage` and `page` search parameters in your query. The response to this query replaces `estimatedTotalHits` with `totalHits` and includes an extra field with number of search results pages based on your `hitsPerPage`: `totalPages`. Using `totalHits` and `totalPages` may result in slightly reduced performance, but is recommended when creating UI elements such as numbered page selectors.

Neither `estimatedTotalHits` nor `totalHits` can exceed the limit configured in [the `maxTotalHits` index setting](/reference/api/settings.md#pagination).

You can [read more about pagination in our dedicated guide](/learn/advanced/pagination.md).

### Example

<CodeSamples id="search_post_1" />

#### Response: `200 Ok`

```json
{
  "hits": [
    {
      "id": 2770,
      "title": "American Pie 2",
      "poster": "https://image.tmdb.org/t/p/w1280/q4LNgUnRfltxzp3gf1MAGiK5LhV.jpg",
      "overview": "The whole gang are back and as close as ever. They decide to get even closer by spending the summer together at a beach house. They decide to hold the biggest…",
      "release_date": 997405200
    },
    {
      "id": 190859,
      "title": "American Sniper",
      "poster": "https://image.tmdb.org/t/p/w1280/svPHnYE7N5NAGO49dBmRhq0vDQ3.jpg",
      "overview": "U.S. Navy SEAL Chris Kyle takes his sole mission—protect his comrades—to heart and becomes one of the most lethal snipers in American history. His pinpoint accuracy not only saves countless lives but also makes him a prime…",
      "release_date": 1418256000
    },
    …
  ],
  "offset": 0,
  "limit": 20,
  "estimatedTotalHits": 976,
  "processingTimeMs": 35,
  "query": "american "
}
```

## Search in an index with GET route

<RouteHighlighter method="GET" route="/indexes/{index_uid}/search"/>

Search for documents matching a specific query in the given index.

::: warning
This endpoint only accepts [string filter expressions](/learn/advanced/filtering_and_faceted_search.md#filter-expressions).
:::

This endpoint should only be used when no API key is required. If an API key is required, use the [POST](/reference/api/search.md#search-in-an-index-with-post-route) route instead.

:::note
By default, [this endpoint returns a maximum of 1000 results](/learn/advanced/known_limitations.md#maximum-number-of-results-per-search). If you want to scrape your database, use the [get documents endpoint](/reference/api/documents.md#get-documents) instead.
:::

### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

### Query parameters

| Search Parameter                                        | Type             | Default value | Description                                         |
| :------------------------------------------------------ | :--------------- | :------------ | :-------------------------------------------------- |
| **[`q`](#query-q)**                                     | String           | `""`          | Query string                                        |
| **[`offset`](#offset)**                                 | Integer          | `0`           | Number of documents to skip                         |
| **[`limit`](#limit)**                                   | Integer          | `20`          | Maximum number of documents returned                |
| **[`hitsPerPage`](#number-of-results-per-page)**        | Integer          | `1`           | Maximum number of documents returned for a page     |
| **[`page`](#page)**                                     | Integer          | `1`           | Request a specific page of results                  |
| **[`filter`](#filter)**                                 | Array of strings | `null`        | Filter queries by an attribute's value              |
| **[`facets`](#facets)**                                 | Array of strings | `null`        | Display the count of matches per facet              |
| **[`attributesToRetrieve`](#attributes-to-retrieve)**   | Array of strings | `["*"]`       | Attributes to display in the returned documents     |
| **[`attributesToCrop`](#attributes-to-crop)**           | Array of strings | `null`        | Attributes whose values have to be cropped          |
| **[`cropLength`](#crop-length)**                        | Integer          | `10`          | Maximum length of cropped value in words            |
| **[`cropMarker`](#crop-marker)**                        | String           | `"…"`         | String marking crop boundaries                      |
| **[`attributesToHighlight`](#attributes-to-highlight)** | Array of strings | `null`        | Highlight matching terms contained in an attribute  |
| **[`highlightPreTag`](#highlight-tags)**                | String           | `"<em>"`      | String inserted at the start of a highlighted term  |
| **[`highlightPostTag`](#highlight-tags)**               | String           | `"</em>"`     | String inserted at the end of a highlighted term    |
| **[`showMatchesPosition`](#show-matches-position)**     | Boolean          | `false`       | Return matching terms location                      |
| **[`sort`](#sort)**                                     | Array of strings | `null`        | Sort search results by an attribute's value         |
| **[`matchingStrategy`](#matching-strategy)**            | String           | `last`        | Strategy used to match query terms within documents |

[Learn more about how to use each search parameter](#search-parameters).

#### Placeholder search

When no search query is specified, a [placeholder search](#query-q) is run instead.

#### Phrase search

Query terms enclosed in double quotes are treated as [phrase searches](#query-q).

### Response

| Name                     | Type             | Description                                     |
| :----------------------- | :--------------- | :---------------------------------------------- |
| **`hits`**               | Array of objects | Results of the query                            |
| **`offset`**             | Number           | Number of documents skipped                     |
| **`limit`**              | Number           | Number of documents to take                     |
| **`totalHits`**          | Number           | Exhaustive total number of matches              |
| **`totalPages`**         | Number           | Exhaustive total number of search results pages |
| **`hitsPerPage`**        | Number           | Number of results on each page                  |
| **`page`**               | Number           | Current search results page                     |
| **`estimatedTotalHits`** | Number           | Total number of matches                         |
| **`facets`**             | Object           | **[Distribution of the given facets](#facets)** |
| **`processingTimeMs`**   | Number           | Processing time of the query                    |
| **`query`**              | String           | Query originating the response                  |

### Example

<CodeSamples id="search_get_1" />

#### Response: `200 Ok`

```json
{
  "hits": [
    {
      "id": 2770,
      "title": "American Pie 2",
      "poster": "https://image.tmdb.org/t/p/w1280/q4LNgUnRfltxzp3gf1MAGiK5LhV.jpg",
      "overview": "The whole gang are back and as close as ever. They decide to get even closer by spending the summer together at a beach house. They decide to hold the biggest…",
      "release_date": 997405200
    },
    {
      "id": 190859,
      "title": "American Sniper",
      "poster": "https://image.tmdb.org/t/p/w1280/svPHnYE7N5NAGO49dBmRhq0vDQ3.jpg",
      "overview": "U.S. Navy SEAL Chris Kyle takes his sole mission—protect his comrades—to heart and becomes one of the most lethal snipers in American history. His pinpoint accuracy not only saves countless lives but also makes him a prime…",
      "release_date": 1418256000
    },
    …
  ],
  "offset": 0,
  "limit": 20,
  "estimatedTotalHits": 976,
  "processingTimeMs": 35,
  "query": "american "
}
```

## Search parameters

Here follows an exhaustive description of each search parameter currently available when using the search endpoint. Unless otherwise noted, all parameters are valid for both `GET` and `POST` routes.

::: warning
If [using the `GET` route to perform a search](/reference/api/search.md#search-in-an-index-with-get-route), all parameters must be **URL-encoded**.

This is not necessary when using the `POST` route or one of our [SDKs](/learn/what_is_meilisearch/sdks.md).
:::

### Overview

| Search Parameter                                        | Type             | Default value | Description                                         |
| :------------------------------------------------------ | :--------------- | :------------ | :-------------------------------------------------- |
| **[`q`](#query-q)**                                     | String           | `""`          | Query string                                        |
| **[`offset`](#offset)**                                 | Integer          | `0`           | Number of documents to skip                         |
| **[`limit`](#limit)**                                   | Integer          | `20`          | Maximum number of documents returned                |
| **[`hitsPerPage`](#number-of-results-per-page)**        | Integer          | `1`           | Maximum number of documents returned for a page     |
| **[`page`](#page)**                                     | Integer          | `1`           | Request a specific page of results                  |
| **[`filter`](#filter)**                                 | Array of strings | `null`        | Filter queries by an attribute's value              |
| **[`facets`](#facets)**                                 | Array of strings | `null`        | Display the count of matches per facet              |
| **[`attributesToRetrieve`](#attributes-to-retrieve)**   | Array of strings | `["*"]`       | Attributes to display in the returned documents     |
| **[`attributesToCrop`](#attributes-to-crop)**           | Array of strings | `null`        | Attributes whose values have to be cropped          |
| **[`cropLength`](#crop-length)**                        | Integer          | `10`          | Maximum length of cropped value in words            |
| **[`cropMarker`](#crop-marker)**                        | String           | `"…"`         | String marking crop boundaries                      |
| **[`attributesToHighlight`](#attributes-to-highlight)** | Array of strings | `null`        | Highlight matching terms contained in an attribute  |
| **[`highlightPreTag`](#highlight-tags)**                | String           | `"<em>"`      | String inserted at the start of a highlighted term  |
| **[`highlightPostTag`](#highlight-tags)**               | String           | `"</em>"`     | String inserted at the end of a highlighted term    |
| **[`showMatchesPosition`](#show-matches-position)**     | Boolean          | `false`       | Return matching terms location                      |
| **[`sort`](#sort)**                                     | Array of strings | `null`        | Sort search results by an attribute's value         |
| **[`matchingStrategy`](#matching-strategy)**            | String           | `last`        | Strategy used to match query terms within documents |

### Query (q)

**Parameter**: `q`
**Expected value**: Any string
**Default value**: `null`

Sets the search terms.

::: warning
Meilisearch only considers the first ten words of any given search query. This is necessary in order to deliver a [fast search-as-you-type experience](/learn/advanced/known_limitations.md#maximum-number-of-query-words).
:::

#### Example

You can search for films mentioning `shifu` by setting the `q` parameter:

<CodeSamples id="search_parameter_guide_query_1" />

This will give you a list of documents that contain your query terms in at least one attribute.

```json
{
  "hits": [
    {
      "id": 50393,
      "title": "Kung Fu Panda Holiday",
      "poster": "https://image.tmdb.org/t/p/w500/rV77WxY35LuYLOuQvBeD1nyWMuI.jpg",
      "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace.",
      "release_date": 1290729600,
      "genres": [
        "Animation",
        "Family",
        "TV Movie"
      ]
    }
  ],
  "query": "shifu"
}
```

#### Query term normalization

Query terms go through a normalization process that removes [non-spacing marks](https://www.compart.com/en/unicode/category/Mn). Because of this, Meilisearch effectively ignores accents and diacritics when returning results. For example, searching for `"sábia"` returns documents containing `"sábia"`, `"sabiá"`, and `"sabia"`.

Normalization also converts all letters to lowercase. Searching for `"Video"` returns the same results as searching for `"video"`, `"VIDEO"`, or `"viDEO"`.

#### Placeholder search

When `q` isn't specified, Meilisearch performs a **placeholder search**.  A placeholder search returns all searchable documents in an index, modified by any search parameters used and sorted by that index's [custom ranking rules](/learn/core_concepts/relevancy.md#custom-rules). Since there is no query term, the [built-in ranking rules](/learn/core_concepts/relevancy.md#ranking-rules) **do not apply.**

If the index has no sort or custom ranking rules, the results are returned in the order of their internal database position.

::: tip
Placeholder search is particularly useful when building a [faceted search interfaces](/learn/advanced/filtering_and_faceted_search.md#faceted-search), as it allows users to view the catalog and alter sorting rules without entering a query.
:::

#### Phrase search

If you enclose search terms in double quotes (`"`), Meilisearch will only return documents containing those terms in the order they were given. This is called a **phrase search**.

Phrase searches are case-insensitive and ignore [soft separators such as `-`, `,`, and `:`](/learn/advanced/datatypes.md). Using a hard separator within a phrase search effectively splits it into multiple separate phrase searches: `"Octavia.Butler"` will return the same results as `"Octavia" "Butler"`.

You can combine phrase search and normal queries in a single search request. In this case, Meilisearch will first fetch all documents with exact matches to the given phrase(s), and [then proceed with its default behavior](/learn/core_concepts/relevancy.md).

##### Example

<CodeSamples id="phrase_search_1" />

### Offset

**Parameter**: `offset`
**Expected value**: Any positive integer
**Default value**: `0`

Sets the starting point in the search results, effectively skipping over a given number of documents.

Queries using `offset` and `limit` only return an estimate of the total number of search results.

You can [paginate search results](/learn/advanced/pagination.md) by making queries combining both `offset` and `limit`.

::: warning
Setting `offset` to a value greater than an [index's `maxTotalHits`](/reference/api/settings.md#update-pagination-settings) returns an empty array.
:::

#### Example

If you want to skip the **first** result in a query, set `offset` to `1`:

<CodeSamples id="search_parameter_guide_offset_1" />

### Limit

**Parameter**: `limit`
**Expected value**: Any positive integer
**Default value**: `20`

Sets the maximum number of documents returned by a single query.

You can [paginate search results](/learn/advanced/pagination.md) by making queries combining both `offset` and `limit`.

::: warning
A search query cannot return more results than configured in [`maxTotalHits`](/reference/api/settings.md#pagination-object), even if the value of `limit` is greater than the value of `maxTotalHits`.
:::

#### Example

If you want your query to return only **two** documents, set `limit` to `2`:

<CodeSamples id="search_parameter_guide_limit_1" />

### Number of results per page

**Parameter**: `hitsPerPage`
**Expected value**: Any positive integer
**Default value**: `20`

Sets the maximum number of documents returned for a single query. The value configured with this parameter dictates the number of total pages: if Meilisearch finds a total of `20` matches for a query and your `hitsPerPage` is set to `5`, `totalPages` is `4`.

Queries containing `hitsPerPage` are exhaustive and do not return an `estimatedTotalHits`. Instead, the response body will include `totalHits` and `totalPages`.

If you set `hitsPerPage` to `0`, Meilisearch processes your request, but does not return any documents. In this case, the response body will include the exhaustive value for `totalHits`. The response body will also include `totalPages`, but its value will be `0`.

You can use `hitsPerPage` and `page` to [paginate search results](/learn/advanced/pagination.md).

::: note
`hitsPerPage` and `page` take precedence over `offset` and `limit`. If a query contains either `hitsPerPage` or `page`, any values passed to `offset` and `limit` are ignored.
:::

::: warning
`hitsPerPage` and `page` are resource-intensive options and might negatively impact search performance. This is particularly likely if [`maxTotalHits`](/reference/api/settings.md#pagination) is set to a value higher than its default.
:::

#### Example

The following example returns the first 15 results for a query:

<CodeSamples id="search_parameter_guide_hitsperpage_1" />

### Page

**Parameter**: `page`
**Expected value**: Any positive integer
**Default value**: `1`

Requests a specific results page. Pages are calculated using the `hitsPerPage` search parameter.

Queries containing `page` are exhaustive and do not return an `estimatedTotalHits`. Instead, the response body will include two new fields: `totalHits` and `totalPages`.

If you set `page` to `0`, Meilisearch processes your request, but does not return any documents. In this case, the response body will include the exhaustive values for `totalPages` and `totalHits`.

You can use `hitsPerPage` and `page` to [paginate search results](/learn/advanced/pagination.md).

::: note
`hitsPerPage` and `page` take precedence over `offset` and `limit`. If a query contains either `hitsPerPage` or `page`, any values passed to `offset` and `limit` are ignored.
:::

::: warning
`hitsPerPage` and `page` are resource-intensive options and might negatively impact search performance. This is particularly likely if [`maxTotalHits`](/reference/api/settings.md#pagination) is set to a value higher than its default.
:::

#### Example

The following example returns the second page of search results:

<CodeSamples id="search_parameter_guide_page_1" />

### Filter

**Parameter**: `filter`
**Expected value**: A filter expression written as a string or an array of strings
**Default value**: `[]`

Uses filter expressions to refine search results. Attributes used as filter criteria must be added to the [`filterableAttributes` list](/reference/api/settings.md#filterable-attributes).

For more information on how to use filters and build filter expressions, [read our guide on filtering, faceted search, and filter expressions](/learn/advanced/filtering_and_faceted_search.md).

#### Example

You can write a filter expression in string syntax using logical connectives:

```SQL
"(genres = horror OR genres = mystery) AND director = 'Jordan Peele'"
```

You can write the same filter as an array:

```
[["genres = horror", "genres = mystery"], "director = 'Jordan Peele'"]
```

You can then use the filter in a search query:

<CodeSamples id="faceted_search_walkthrough_filter_1" />

#### Filtering results with `_geoRadius`

If your documents contain `_geo` data, you can use the `_geoRadius` built-in filter rule to filter results according to their geographic position.

`_geoRadius` establishes a circular area based on a central point and a radius. Results beyond this area will be excluded from your search. This filter rule requires three parameters: `lat`, `lng` and `distance_in_meters`.

```json
_geoRadius(lat, lng, distance_in_meters)
```

`lat` and `lng` should be geographic coordinates expressed as floating point numbers. `distance_in_meters` indicates the radius of the area within which you want your results and should be an integer.

<CodeSamples id="geosearch_guide_filter_usage_1" />

### Facets

**Parameter**: `facets`
**Expected value**: An array of `attribute`s or `["*"]`
**Default value**: `null`

Returns the number of documents matching the current search query for each given facet. When `facets` is set, the search results object contains the `facetDistribution` field that shows the number of remaining candidates for each specified facet.

This parameter can take two values:

- An array of attributes: `facets=["attributeA", "attributeB", …]`
- An asterisk—this will return a count for all facets present in `filterableAttributes`

::: note
If an attribute used on `facets` has not been added to the `filterableAttributes` list, it will be ignored.
:::

[Learn more about facet distribution in the filtering and faceted search guide.](/learn/advanced/filtering_and_faceted_search.md#configuring-and-using-facets)

#### Example

Given a movie database, suppose that you want to know the number of `Batman` movies per genre:

<CodeSamples id="faceted_search_facets_1" />

You would get the following response:

```json
{
  …
  "estimatedTotalHits": 1684,
  "query": "Batman",
  "facetDistribution": {
    "genres": {
      "action": 273,
      "animation": 118,
      "adventure": 132,
      "fantasy": 67,
      "comedy": 475,
      "mystery": 70,
      "thriller": 217
    }
  }
}
```

### Attributes to retrieve

**Parameter**: `attributesToRetrieve`
**Expected value**: An array of `attribute`s or `["*"]`
**Default value**: `["*"]`

Configures which attributes will be retrieved in the returned documents.

If no value is specified, `attributesToRetrieve` uses the [`displayedAttributes` list](/reference/api/settings.md#displayed-attributes), which by default contains all attributes found in the documents.

::: note
If an attribute has been removed from `displayedAttributes`, `attributesToRetrieve` will silently ignore it and the field will not appear in your returned documents.
:::

#### Example

To get only the `overview` and `title` fields, set `attributesToRetrieve` to `["overview", "title"]`.

<CodeSamples id="search_parameter_guide_retrieve_1" />

### Attributes to crop

**Parameter**: `attributesToCrop`
**Expected value**: An array of attributes or `["*"]`
**Default value**: `null`

Crops the selected fields in the returned results to the length indicated by the [`cropLength`](#crop-length) parameter. When `attributesToCrop` is set, each returned document contains an extra field called `_formatted`. This object contains the cropped version of the selected attributes.

By default, crop boundaries are marked by the ellipsis character (`…`). You can change this by using the [`cropMarker`](#crop-marker) search parameter.

Optionally, you can indicate a custom crop length for any attributes given to `attributesToCrop`: `attributesToCrop=["attributeNameA:5", "attributeNameB:9"]`. If configured, these values have priority over `cropLength`.

Instead of supplying individual attributes, you can provide `["*"]` as a wildcard: `attributesToCrop=["*"]`. This causes `_formatted` to include the cropped values of all attributes present in [`attributesToRetrieve`](#attributes-to-retrieve).

#### Cropping algorithm

Suppose you have a field containing the following string: `Donatello is a skilled and smart turtle. Leonardo is the most skilled turtle. Raphael is the strongest turtle.`

Meilisearch tries to respect sentence boundaries when cropping. For example, if your search term is `Leonardo` and your `cropLength` is 6, Meilisearch will prioritize keeping the sentence together and return: `Leonardo is the most skilled turtle.`

If a query contains only a single search term, Meilisearch crops around the first occurrence of that term. If you search for `turtle` and your `cropLength` is 7, Meilisearch will return the first instance of that word: `Donatello is a skilled and smart turtle.`

If a query contains multiple search terms, Meilisearch centers the crop around the largest number of unique matches, giving priority to terms that are closer to each other and follow the original query order. If you search for `skilled turtle` with a `cropLength` of 6, Meilisearch will return `Leonardo is the most skilled turtle`.

If Meilisearch does not find any query terms in a field, cropping begins at the first word in that field. If you search for `Michelangelo` with a `cropLength` of 4 and this string is present in another field, Meilisearch will return `Donatello is a skilled …`.

#### Example

If you use `shifu` as a search query and set the value of the `cropLength` parameter to `5`:

<CodeSamples id="search_parameter_guide_crop_1" />

You will get the following response with the **cropped text in the `_formatted` object**:

```json
{
  "id": 50393,
  "title": "Kung Fu Panda Holiday",
  "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
  "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
  "release_date": 1290729600,
  "_formatted": {
    "id": 50393,
    "title": "Kung Fu Panda Holiday",
    "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
    "overview": "…this year Shifu informs Po…",
    "release_date": 1290729600
  }
}
```

### Crop length

**Parameter**: `cropLength`
**Expected value**: A positive integer
**Default value**: `10`

Configures the total number of words to appear in the cropped value when using [`attributesToCrop`](#attributes-to-crop). If `attributesToCrop` is not configured, `cropLength` has no effect on the returned results.

Query terms are counted as part of the cropped value length. If `cropLength` is set to `2` and you search for one term (for example, `shifu`), the cropped field will contain two words in total (for example, `"…Shifu informs…"`).

Stop words are also counted against this number. If `cropLength` is set to `2` and you search for one term (for example, `grinch`), the cropped result may contain a stop word (for example, `"…the Grinch…"`).

If `attributesToCrop` uses the `attributeName:number` syntax to specify a custom crop length for an attribute, that value has priority over `cropLength`.

### Crop marker

**Parameter**: `cropMarker`
**Expected value**: A string
**Default value**: `"…"`

Sets a string to mark crop boundaries when using the [`attributesToCrop`](#attributes-to-crop) parameter. The crop marker will be inserted on both sides of the crop. If `attributesToCrop` is not configured, `cropMarker` has no effect on the returned search results.

If `cropMarker` is set to `null` or an empty string, no markers will be included in the returned results.

Crop markers are only added where content has been removed. For example, if the cropped text includes the first word of the field value, the crop marker will not be added to the beginning of the cropped result.

#### Example

When searching for `shifu`, you can use `cropMarker` to change the default `…`:

<CodeSamples id="search_parameter_guide_crop_marker_1" />

```json
{
  "id": 50393,
  "title": "Kung Fu Panda Holiday",
  "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
  "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
  "release_date": 1290729600,
  "_formatted": {
    "id": 50393,
    "title": "Kung Fu Panda Holiday",
    "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
    "overview": "[…]But this year Shifu informs Po that as Dragon Warrior,[…]",
    "release_date": 1290729600
  }
}
```

### Attributes to highlight

**Parameter**: `attributesToHighlight`
**Expected value**: An array of attributes or `["*"]`
**Default value**: `null`

Highlights matching query terms in the specified attributes.  `attributesToHighlight` only works on values of the following types: string, number, array, object.

When this parameter is set, returned documents include a `_formatted` object containing the highlighted terms.

Instead of a list of attributes, you can use `["*"]`: `attributesToHighlight=["*"]`. In this case, all the attributes present in [`attributesToRetrieve`](#attributes-to-retrieve) will be assigned to `attributesToHighlight`.

By default highlighted elements are enclosed in `<em>` and `</em>` tags. You may change this by using the [`highlightPreTag` and `highlightPostTag` search parameters](#highlight-tags).

::: note
`attributesToHighlight` also highlights terms configured as [synonyms](/reference/api/settings.md#synonyms) and [stop words](/reference/api/settings.md#stop-words).
:::

::: warning
`attributesToHighlight` will highlight matches within all attributes added to the `attributesToHighlight` array, even if those attributes are not set as [`searchableAttributes`](/learn/configuration/displayed_searchable_attributes.md#searchable-fields).
:::

#### Example

The following query highlights matches present in the `overview` attribute:

<CodeSamples id="search_parameter_guide_highlight_1" />

The highlighted version of the text would then be found in the `_formatted` object included in each returned document:

```json
{
  "id": 50393,
  "title": "Kung Fu Panda Holiday",
  "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
  "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
  "release_date": 1290729600,
  "_formatted": {
    "id": 50393,
    "title": "Kung Fu Panda Holiday",
    "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
    "overview": "The <em>Winter Feast</em> is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal <em>Winter Feast</em> at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
    "release_date": 1290729600
  }
}
```

### Highlight tags

**Parameters**: `highlightPreTag` and `highlightPostTag`
**Expected value**: A string
**Default value**: `"<em>"` and `"</em>"` respectively

`highlightPreTag` and `highlightPostTag` configure, respectively, the strings to be inserted before and after a word highlighted by `attributesToHighlight`. If `attributesToHighlight` has not been configured, `highlightPreTag` and `highlightPostTag` have no effect on the returned search results.

It is possible to use `highlightPreTag` and `highlightPostTag` to enclose terms between any string of text, not only HTML tags: `"<em>"`, `"<strong>"`, `"*"`, and `"__"` are all equally supported values.

If `highlightPreTag` or `highlightPostTag` are set to `null` or an empty string, nothing will be inserted respectively at the beginning or the end of a highlighted term.

#### Example

The following query encloses highlighted matches in `<span>` tags with a `class` attribute:

<CodeSamples id="search_parameter_guide_highlight_tag_1" />

You can find the highlighted query terms inside the `_formatted` property:

```json
{
  "id": 50393,
  "title": "Kung Fu Panda Holiday",
  "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
  "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
  "release_date": 1290729600,
  "_formatted": {
    "id": 50393,
    "title": "Kung Fu Panda Holiday",
    "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
    "overview": "The <span class=\"highlight\">Winter Feast</span> is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal <span class=\"highlight\">Winter Feast</span> at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
    "release_date": 1290729600
  }
}
```

::: danger
Though it is not necessary to use `highlightPreTag` and `highlightPostTag` in conjunction, be careful to ensure tags are correctly matched. In the above example, not setting `highlightPostTag` would result in malformed HTML: `<span>Winter Feast</em>`.
:::

### Show matches position

**Parameter**: `showMatchesPosition`
**Expected value**: `true` or `false`
**Default value**: `false`

Adds a `_matchesPosition` object to the search response that contains the location of each occurrence of queried terms across all fields. This is useful when you need more control than offered by our [built-in highlighting](#attributes-to-highlight). `showMatchesPosition` only works for strings, numbers, and arrays of strings and numbers.

::: warning
`showMatchesPosition` returns the location of matched query terms within all attributes, even attributes that are not set as [`searchableAttributes`](/learn/configuration/displayed_searchable_attributes.md#searchable-fields).
:::

The beginning of a matching term within a field is indicated by `start`, and its length by `length`.

::: warning
`start` and `length` are measured in bytes and not the number of characters. For example, `ü` represents two bytes but one character.
:::

#### Example

If you set `showMatchesPosition` to `true` and search for `winter feast`:

<CodeSamples id="search_parameter_guide_show_matches_position_1" />

You would get the following response with **information about the matches in the `_matchesPosition` object**. Note how Meilisearch searches for `winter` and `feast` separately because of the whitespace:

```json
{
  "id": 50393,
  "title": "Kung Fu Panda Holiday",
  "poster": "https://image.tmdb.org/t/p/w500/rV77WxY35LuYLOuQvBeD1nyWMuI.jpg",
  "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
  "release_date": 1290729600,
  "_matchesPosition": {
    "overview": [
      {
        "start": 4,
        "length": 6
      },
      {
        "start": 11,
        "length": 5
      },
      {
        "start": 234,
        "length": 6
      },
      {
        "start": 241,
        "length": 5
      }
    ]
  }
}
```

### Sort

**Parameter**: `sort`
**Expected value**: A list of attributes written as an array or as a comma-separated string
**Default value**: `null`

Sorts search results at query time according to the specified attributes and indicated order.

Each attribute in the list must be followed by a colon (`:`) and the preferred sorting order: either ascending (`asc`) or descending (`desc`).

::: note
Attribute order is meaningful. The first attributes in a list will be given precedence over those that come later.

For example, `sort="price:asc,author:desc` will prioritize `price` over `author` when sorting results.
:::

When using the `POST` route, `sort` expects an array of strings.

When using the `GET` route, `sort` expects the list as a comma-separated string.

[Read more about sorting search results in our dedicated guide.](/learn/advanced/sorting.md)

#### Example

You can search for science fiction books ordered from cheapest to most expensive:

<CodeSamples id="search_parameter_guide_sort_1" />

#### Sorting results with `_geoPoint`

When dealing with documents containing geolocation data, you can use `_geoPoint` to sort results based on their distance from a specific geographic location.

`_geoPoint` is a sorting function that requires two floating point numbers indicating a location's latitude and longitude. You must also specify whether the sort should be ascending (`asc`) or descending (`desc`):

<CodeSamples id="geosearch_guide_sort_usage_1" />

Queries using `_geoPoint` will always include a `geoDistance` field containing the distance in meters between the document location and the `_geoPoint`:

```json
[
  {
    "id": 1,
    "name": "Nàpiz' Milano",
    "_geo": {
      "lat": 45.4777599,
      "lng": 9.1967508
    },
    "_geoDistance": 1532
  }
]
```

[You can read more about location-based sorting in our dedicated guide.](/learn/advanced/geosearch.md#sorting-results-with-geopoint)

### Matching strategy

**Parameter**: `matchingStrategy`
**Expected value**: `last` or `all`
**Default value**: `last`

Defines the strategy used to match query terms in documents.

#### `last`

`last` returns documents containing all the query terms first. If there are not enough results containing all query terms to meet the requested `limit`, Meilisearch will remove one query term at a time, starting from the end of the query.

<CodeSamples id="search_parameter_guide_matching_strategy_1" />

With the above code sample, Meilisearch will first return documents that contain all three words. If the results don't meet the requested `limit`, it will also return documents containing only the first two terms, `big fat`, followed by documents containing only `big`.

#### `all`

`all` only returns documents that contain all query terms. Meilisearch will not match any more documents even if there aren't enough to meet the requested `limit`.

<CodeSamples id="search_parameter_guide_matching_strategy_2" />

The above code sample would only return documents containing all three words.
