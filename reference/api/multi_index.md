# Multi-index search

The `/multi-search` route allows you to perform multiple search queries on one or more indexes by bundling them into a single request.

## POST route

<RouteHighlighter method="POST" route="/multi-search"/>

### Body

| Name          | Type             | Description                                                                                                                                          |
| :------------ | :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`queries`** | Array of objects | Contains the list of search queries to perform. The [`indexUid`](#search-parameters) search parameter is required, all other parameters are optional |

#### Search parameters

| Search parameter                                                                | Type             | Default value | Description                                                               |
| :------------------------------------------------------------------------------ | :--------------- | :------------ | :------------------------------------------------------------------------ |
| **[`indexUid`](/reference/api/search.md#query-q)**  *                           | String           | N/A           | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |
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

Each search result object is composed of:

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
          "overview":"Who or what exactly is a Heffalump…",
          "genres":[
            "Animation",
            "Family",
            "Comedy",
            "Fantasy"
          ],
          "poster":"https://image.tmdb.org/t/p/w500/5kd5JqccroxOnC9sVMP5NtLrbkr.jpg",
          "release_date":1108080000
        },
        {
          "id":14903,
          "title":"Pooh's Grand Adventure: The Search for Christopher Robin",
          "overview":"A full length animated film for all the family to enjoy…",
          "genres":[
            "Animation",
            "Family",
            "Adventure"
          ],
          "poster":"https://image.tmdb.org/t/p/w500/x0VfdebBXlgfLN5lSoapwvXdtMz.jpg",
          "release_date":877305600
        },
        {
          "id":14885,
          "title":"Pooh's Heffalump Halloween Movie",
          "overview":"It's Halloween in the 100 Acre Wood…",
          "genres":[
            "Animation",
            "Family"
          ],
          "poster":"https://image.tmdb.org/t/p/w500/3zVLrNuuEcNcyCz5SLgYimrkBT3.jpg",
          "release_date":1126569600
        },
        {
          "id":13706,
          "title":"Winnie the Pooh: A Very Merry Pooh Year",
          "overview":"It's Christmastime in the Hundred Acre Wood…",
          "genres":[
            "Animation",
            "Family"
          ],
          "poster":"https://image.tmdb.org/t/p/w500/1Xfh2PPZsjEwFyLqp6bisrbdxZs.jpg",
          "release_date":1009843200
        },
        {
          "id":16394,
          "title":"Winnie the Pooh: Springtime with Roo",
          "overview":"Spring has sprung, and baby Roo is…",
          "genres":[
            "Animation",
            "Family"
          ],
          "poster":"https://image.tmdb.org/t/p/w500/yAgVcU1BdPqvnyYnOkb1QtVNd5V.jpg",
          "release_date":1078790400
        }
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
          "overview":"Nemo, an adventurous young clownfish…",
          "genres":[
            "Animation",
            "Family"
          ],
          "poster":"https://image.tmdb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg",
          "release_date":1054252800
        },
        {
          "id":22611,
          "title":"Little Nemo: Adventures in Slumberland",
          "overview":"A little boy whose dreams transcend reality…",
          "genres":[
            "Adventure",
            "Animation",
            "Family",
            "Fantasy"
          ],
          "poster":"https://image.tmdb.org/t/p/w500/kj5MWZjQIivF9w8SKDI5ih53PDK.jpg",
          "release_date":616464000
        },
        {
          "id":56354,
          "title":"Captain Nemo and the Underwater City",
          "overview":"Some survivors of a drowning ship are rescued by Captain…",
          "genres":[
            "Adventure",
            "Family"
          ],
          "poster":"https://image.tmdb.org/t/p/w500/whvYatDbIFsPGSt2Pv9Rrk0q7zT.jpg",
          "release_date":-1123200
        },
        {
          "id":31011,
          "title":"Mr. Nobody",
          "overview":"Nemo Nobody leads an ordinary existence…",
          "genres":[
            "Science Fiction",
            "Drama",
            "Romance",
            "Fantasy"
          ],
          "poster":"https://image.tmdb.org/t/p/w500/qNkIONc4Rgmzo23ph7qWp9QfVnW.jpg",
          "release_date":1257465600
        },
        {
          "id":20609,
          "title":"30,000 Leagues Under The Sea",
          "overview":"Captain Nemo goes even deeper into insanity…",
          "genres":[
            "Action",
            "Adventure",
            "Science Fiction"
          ],
          "poster":"https://image.tmdb.org/t/p/w500/zxcM9XbumJHpYAstef4BrUcD6zR.jpg",
          "release_date":1189296000
        }
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
