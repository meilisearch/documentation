# Search

MeiliSearch exposes 2 routes to perform searches:

- A POST route: this is the preferred route when using API authentication, as it allows [preflight request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request) caching and better performances.
- A GET route: the usage of this route is discouraged, unless you have good reason to do otherwise (specific caching abilities for example).

Other than the differences mentioned above, the two routes are strictly equivalent.

## Search in an index with POST route

<RouteHighlighter method="POST" route="/indexes/:index_uid/search"/>

Search for documents matching a specific query in the given index.

This is the preferred route to perform search when an API key is required, as it allows for [preflight requests](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request) to be cached. Caching preflight requests **improves considerably the speed of the search**.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

| Variable                  | Type                 | Description                                                                                       | Default value                                                                                   |
| ------------------------- | -------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **q**                     | `String`               | Query string \_(mandatory)                                                                      | `""`                                                                                          |
| **offset**                | `Integer`              | Number of documents to skip                                                                     | `0`                                                                                             |
| **limit**                 | `Integer`              | Maximum number of documents returned                                                            | `20`                                                                                            |
| **filters**               | `String`               | Filter queries by an attribute value                                                            | `null`                                                                                          |
| **facetFilters**          | `[Strings OR [Strings]]` | Facet names and values to filter on                                                            | `null`                                                                                          |
| **facetsDistribution**    | `[Strings]`            | Facets for which to retrieve the matching count                                                 | `null`                                                                                          |
| **attributesToRetrieve**  | `[Strings]`            | Attributes to display in the returned documents                                                 | `["*"]`                                                                                           |
| **attributesToCrop**     | `[Strings]`            | Attributes whose values have to be cropped                                                       | `null`                                                                                          |
| **cropLength**            | `Integer`              | Length used to crop field values                                                                | `200`                                                                                           |
| **attributesToHighlight** | `[Strings]`            | Attributes whose values will contain highlighted matching terms                                 | `null`                                                                                          |
| **matches**               | `Boolean`              | Defines whether an object that contains information about the matches should be returned or not | `false`                                                                                         |
> `filters` accept a query string. You can find more about the filter syntax on [our dedicated page](/reference/features/filtering.md).
> `cropLength` is automatically rounded to match word boundaries.

[Learn more about how to use the search parameters](/reference/features/search_parameters.md).

#### Placeholder search

When no search query is specified, a [placeholder search](/reference/features/search_parameters.md#query-q) is run instead.

#### Phrase search

Query terms enclosed in double quotes are treated as [phrase searches](/reference/features/search_parameters.md#query-q).

### Response

| field                | Description                    |    type    |
| -------------------- | ------------------------------ | :--------: |
| **hits**             | Results of the query           | `[result]` |
| **offset**           | Number of documents skipped    |  `number`  |
| **limit**            | Number of documents to take    |  `number`  |
| **nbHits**           | Total number of matches        |  `number`  |
| **exhaustiveNbHits** | Whether `nbHits` is exhaustive | `boolean`  |
| **facetsDistribution** | **[Distribution of the given facets](/reference/features/search_parameters.md#the-facets-distribution)** | `object`
| **exhaustiveFacetsCount** | Whether `facetsDistribution` is exhaustive | `boolean`
| **processingTimeMs** | Processing time of the query   |  `number`  |
| **query**            | Query originating the response |  `string`  |

### Example

<CodeSamples id="search_post_1" />

#### Response: `200 Ok`

```json
{
  "hits": [
    {
      "id": "2770",
      "title": "American Pie 2",
      "poster": "https://image.tmdb.org/t/p/w1280/q4LNgUnRfltxzp3gf1MAGiK5LhV.jpg",
      "overview": "The whole gang are back and as close as ever. They decide to
      get even closer by spending the summer together at a beach house. They
      decide to hold the biggest...",
      "release_date": 997405200
    },
    {
      "id": "190859",
      "title": "American Sniper",
      "poster": "https://image.tmdb.org/t/p/w1280/svPHnYE7N5NAGO49dBmRhq0vDQ3.jpg",
      "overview": "U.S. Navy SEAL Chris Kyle takes his sole mission—protect his
      comrades—to heart and becomes one of the most lethal snipers in American
      history. His pinpoint accuracy not only saves countless lives but also
      makes him a prime...",
      "release_date": 1418256000
    },
    ...
  ],
  "offset": 0,
  "limit": 20,
  "nbHits": 976,
  "exhaustiveNbHits": false,
  "processingTimeMs": 35,
  "query": "american "
}
```

## Search in an index with GET route

<RouteHighlighter method="GET" route="/indexes/:index_uid/search"/>

Search for documents matching a specific query in the given index.

This route should only be used when no API key is required. If an API key is required, use the POST route instead.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Query parameters

| Query Parameter                                                                                   | Description                                                                                     | Default Value |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | :-----------: |
| **[q](/reference/features/search_parameters.md#query-q)**                                     | Query string                                                                                    |    `""`     |
| **[offset](/reference/features/search_parameters.md#offset)**                                 | Number of documents to skip                                                                     |     `0`       |
| **[limit](/reference/features/search_parameters.md#limit)**                                   | Maximum number of documents returned                                                            |     `20`      |
| **[filters](/reference/features/search_parameters.md#filters)**                               | Filter queries by an attribute value                                                            |    `null`     |
| **[facetFilters](/reference/features/search_parameters.md#facet-filters)** | Facet names and values to filter on                                                                                |    `null`     |
| **[facetsDistribution](/reference/features/search_parameters.md#the-facets-distribution)** | Facets for which to retrieve the matching count                                                    |    `null`     |
| **[attributesToRetrieve](/reference/features/search_parameters.md#attributes-to-retrieve)**   | Attributes to display in the returned documents                                                 |    `["*"]`      |
| **[attributesToCrop](/reference/features/search_parameters.md#attributes-to-crop)**           | Attributes whose values have to be cropped                                                      |    `null`     |
| **[cropLength](/reference/features/search_parameters.md#crop-length)**                        | Length used to crop field values                                                                |    `200`      |
| **[attributesToHighlight](/reference/features/search_parameters.md#attributes-to-highlight)** | Attributes whose values will contain highlighted matching terms                                 |    `null`     |
| **[matches](/reference/features/search_parameters.md#matches)**                               | Defines whether an object that contains information about the matches should be returned or not |   `false`     |

> `filters` accept a query string. You can find about the filter syntax on [our dedicated page](/reference/features/filtering.md).
> `cropLength` is automatically rounded to match word boundaries.

[Learn more about how to use the search parameters](/reference/features/search_parameters.md).

#### Placeholder search

When no search query is specified, a [placeholder search](/reference/features/search_parameters.md#query-q) is run instead.

#### Phrase search

Query terms enclosed in double quotes are treated as [phrase searches](/reference/features/search_parameters.md#query-q).

### Response

| field                | Description                    |    type    |
| -------------------- | ------------------------------ | :--------: |
| **hits**             | Results of the query           | `[result]` |
| **offset**           | Number of documents skipped    |  `number`  |
| **limit**            | Number of documents to take    |  `number`  |
| **nbHits**           | Total number of matches        |  `number`  |
| **exhaustiveNbHits** | Whether `nbHits` is exhaustive | `boolean`  |
| **facetsDistribution** | **[Distribution of the given facets](/reference/features/search_parameters.md#the-facets-distribution)** | `object`
| **exhaustiveFacetsCount** | Whether `facetsDistribution` is exhaustive | `boolean`
| **processingTimeMs** | Processing time of the query   |  `number`  |
| **query**            | Query originating the response |  `string`  |

### Example

<CodeSamples id="search_get_1" />

#### Response: `200 Ok`

```json
{
  "hits": [
    {
      "id": "2770",
      "title": "American Pie 2",
      "poster": "https://image.tmdb.org/t/p/w1280/q4LNgUnRfltxzp3gf1MAGiK5LhV.jpg",
      "overview": "The whole gang are back and as close as ever. They decide to
      get even closer by spending the summer together at a beach house. They
      decide to hold the biggest...",
      "release_date": 997405200
    },
    {
      "id": "190859",
      "title": "American Sniper",
      "poster": "https://image.tmdb.org/t/p/w1280/svPHnYE7N5NAGO49dBmRhq0vDQ3.jpg",
      "overview": "U.S. Navy SEAL Chris Kyle takes his sole mission—protect his
      comrades—to heart and becomes one of the most lethal snipers in American
      history. His pinpoint accuracy not only saves countless lives but also
      makes him a prime...",
      "release_date": 1418256000
    },
    ...
  ],
  "offset": 0,
  "limit": 20,
  "nbHits": 976,
  "exhaustiveNbHits": false,
  "processingTimeMs": 35,
  "query": "american "
}
```
