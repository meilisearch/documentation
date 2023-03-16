# Multi-index search

The `/multi-search` route allows you to perform multiple search queries on one or more indexes by bundling them into a single HTTP request.

## POST route

<RouteHighlighter method="POST" route="/multi-search"/>

### Body

| Name          | Type             | Description                                                                                                                                          |
| :------------ | :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`queries`** | Array of objects | Contains the list of search queries to perform. The [`indexUid`](#search-parameters) search parameter is required, all other parameters are optional |

#### Search parameters

| Search parameter                                                                | Type             | Default value | Description                                                               |
| :------------------------------------------------------------------------------ | :--------------- | :------------ | :------------------------------------------------------------------------ |
| **[`indexUid`](/learn/core_concepts/indexes.md#index-uid)**                           | String           | N/A           | [`uid`] |
| **[`q`](/reference/api/search.md#query-q)**                                     | String           | `""`          | Query string                                                              |
| **[`offset`](/reference/api/search.md#offset)**                                 | Integer          | `0`           | Number of documents to skip                                               |
| **[`limit`](/reference/api/search.md#limit)**                                   | Integer          | `20`          | Maximum number of documents returned                                      |
| **[`hitsPerPage`](/reference/api/search.md#number-of-results-per-page)**        | Integer          | `1`           | Maximum number of documents returned for a page                           |
| **[`page`](/reference/api/search.md#page)**                                     | Integer          | `1`           | Request a specific page of results                                        |
| **[`filter`](/reference/api/search.md#filter)**                                 | Array of strings | `null`        | Filter queries by an attribute's value                                    |
| **[`facets`](/reference/api/search.md#facets)**                                 | Array of strings | `null`        | Display the count of matches per facet                                    |
| **[`attributesToRetrieve`](/reference/api/search.md#attributes-to-retrieve)**   | Array of strings | `["*"]`       | Attributes to display in the returned documents                           |
| **[`attributesToCrop`](/reference/api/search.md#attributes-to-crop)**           | Array of strings | `null`        | Attributes whose values have to be cropped                                |
| **[`cropLength`](/reference/api/search.md#crop-length)**                        | Integer          | `10`          | Maximum length of cropped value in words                                  |
| **[`cropMarker`](/reference/api/search.md#crop-marker)**                        | String           | `"…"`         | String marking crop boundaries                                            |
| **[`attributesToHighlight`](/reference/api/search.md#attributes-to-highlight)** | Array of strings | `null`        | Highlight matching terms contained in an attribute                        |
| **[`highlightPreTag`](/reference/api/search.md#highlight-tags)**                | String           | `"<em>"`      | String inserted at the start of a highlighted term                        |
| **[`highlightPostTag`](/reference/api/search.md#highlight-tags)**               | String           | `"</em>"`     | String inserted at the end of a highlighted term                          |
| **[`showMatchesPosition`](/reference/api/search.md#show-matches-position)**     | Boolean          | `false`       | Return matching terms location                                            |
| **[`sort`](/reference/api/search.md#sort)**                                     | Array of strings | `null`        | Sort search results by an attribute's value                               |
| **[`matchingStrategy`](/reference/api/search.md#matching-strategy)**            | String           | `last`        | Strategy used to match query terms within documents                       |

[Learn more about how to use each search parameter](/reference/api/search.md#search-parameters).

### Response

| Name          | Type             | Description                                                            |
| :------------ | :--------------- | :--------------------------------------------------------------------- |
| **`results`** | Array of objects | Results of the search queries in the same order they were requested in |

Each search result object is composed of the following fields:

| Name                     | Type             | Description                                                                             |
| :----------------------- | :--------------- | :-------------------------------------------------------------------------------------- |
| **`indexUid`**           | String           | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index               |
| **`hits`**               | Array of objects | Results of the query                                                                    |
| **`offset`**             | Number           | Number of documents skipped                                                             |
| **`limit`**              | Number           | Number of documents to take                                                             |
| **`estimatedTotalHits`** | Number           | Estimated total number of matches                                                       |
| **`totalHits`**          | Number           | Exhaustive total number of matches                                                      |
| **`totalPages`**         | Number           | Exhaustive total number of search result pages                                          |
| **`hitsPerPage`**        | Number           | Number of results on each page                                                          |
| **`page`**               | Number           | Current search results page                                                             |
| **`facetDistribution`**  | Object           | **[Distribution of the given facets](/reference/api/search.md#facetdistribution)**      |
| **`processingTimeMs`**   | Number           | Processing time of the query                                                            |
| **`query`**              | String           | Query originating the response                                                          |
| **`facetStats`**         | Object           | [The the numeric `min` and `max` values per facet](/reference/api/search.md#facetstats) |

### Example

<CodeSamples id="multi_search_1" />

#### Response: `200 Ok`

```json
{
  "results":[
    {
      "indexUid":"movies",
      "hits":[
        {
          "id":13682,
          "title":"Pooh's Heffalump Movie",
          "overview":"Who or what exactly is a Heffalump …",
          "genres":[
            "Animation",
            "Family",
            "Comedy",
            "Fantasy"
          ],
          "poster":"https://image.tmdb.org/t/p/w500/5kd5JqccroxOnC9sVMP5NtLrbkr.jpg",
          "release_date":1108080000
        },
        …
      ],
      "query":"pooh",
      "processingTimeMs":2,
      "limit":5,
      "offset":0,
      "estimatedTotalHits":22
    },
    {
      "indexUid":"movies",
      "hits":[
        {
          "id":12,
          "title":"Finding Nemo",
          "overview":"Nemo, an adventurous young clownfish …",
          "genres":[
            "Animation",
            "Family"
          ],
          "poster":"https://image.tmdb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg",
          "release_date":1054252800
        },
        …
      ],
      "query":"nemo",
      "processingTimeMs":1,
      "limit":5,
      "offset":0,
      "estimatedTotalHits":11
    }
  ]
}
```
