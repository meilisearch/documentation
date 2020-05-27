# Search

## Search in an index

<RouteHighlighter method="GET" route="/indexes/:index_uid/search"/>

Search for documents matching a specific query in the given index.

[Learn more about how the search works](/guides/main_concepts/search.md).

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Query Parameters

| Query Parameter                                                                                   | Description                                                                                     | Default Value |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | :-----------: |
| **[q](/guides/advanced_guides/search_parameters.md#query-q)**                                     | Query string \_(mandatory)                                                                      |               |
| **[offset](/guides/advanced_guides/search_parameters.md#offset)**                                 | Number of documents to skip                                                                     |      `0`      |
| **[limit](/guides/advanced_guides/search_parameters.md#limit)**                                   | Maximum number of documents returned                                                            |     `20`      |
| **[attributesToRetrieve](/guides/advanced_guides/search_parameters.md#attributes-to-retrieve)**   | Attributes to display in the returned documents                                                 |      `*`      |
| **[attributesToCrop](/guides/advanced_guides/search_parameters.md#attributes-to-crop)**           | Attributes whose values have to be cropped                                                      |    `none`     |
| **[cropLength](/guides/advanced_guides/search_parameters.md#crop-length)**                        | Length used to crop field values                                                                |     `200`     |
| **[attributesToHighlight](/guides/advanced_guides/search_parameters.md#attributes-to-highlight)** | Attributes whose values will contain highlighted matching terms                                 |    `none`     |
| **[filters](/guides/advanced_guides/search_parameters.md#filters)**                               | Filter queries by an attribute value                                                            |    `none`     |
| **[matches](/guides/advanced_guides/search_parameters.md#matches)**                               | Defines whether an object that contains information about the matches should be returned or not |    `false`    |

> `filters` accept a query string. You can find about the filter syntax on [our dedicated page](/guides/advanced_guides/filtering.md).
> `cropLength` is automatically rounded to match word boundaries.

[Learn more about how to use the search parameters](/guides/advanced_guides/search_parameters.md).

### Response

| field                | Description                    |    type    |
| -------------------- | ------------------------------ | :--------: |
| **hits**             | results of the query           | `[result]` |
| **offset**           | number of documents skipped    |  `number`  |
| **limit**            | number of documents to take    |  `number`  |
| **nbHits**           | total number of matches        |  `number`  |
| **exhaustiveNbHits** | whether `nbHits` is exhaustive | `boolean`  |
| **processingTimeMs** | processing time of the query   |  `number`  |
| **query**            | query originating the response |  `string`  |

### Example

<code-samples id="search_1" />

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
