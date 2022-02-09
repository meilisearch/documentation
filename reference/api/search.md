# Search

Meilisearch exposes 2 routes to perform searches:

- A POST route: this is the preferred route when using API authentication, as it allows [preflight request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request) caching and better performances.
- A GET route: the usage of this route is discouraged, unless you have good reason to do otherwise (specific caching abilities for example).

Other than the differences mentioned above, the two routes are strictly equivalent. You may find exhaustive descriptions of the parameters accepted by the two routes [at the end of this article](#search-parameters).

## Search in an index with POST route

<RouteHighlighter method="POST" route="/indexes/:index_uid/search"/>

Search for documents matching a specific query in the given index.

This is the preferred route to perform search when an API key is required, as it allows for [preflight requests](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request) to be cached. Caching preflight requests **considerably improves search speed**.

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

| Query Parameter                                       | Description                                        | Default Value |
|-------------------------------------------------------|----------------------------------------------------|---------------|
| **[q](#query-q)**                                     | Query string (mandatory)                           | `""`          |
| **[offset](#offset)**                                 | Number of documents to skip                        | `0`           |
| **[limit](#limit)**                                   | Maximum number of documents returned               | `20`          |
| **[filter](#filter)**                                 | Filter queries by an attribute's value             | `null`        |
| **[facetsDistribution](#facets-distribution)**        | Display the count of matches per facet             | `null`        |
| **[attributesToRetrieve](#attributes-to-retrieve)**   | Attributes to display in the returned documents    | `["*"]`       |
| **[attributesToCrop](#attributes-to-crop)**           | Attributes whose values have to be cropped         | `null`        |
| **[cropLength](#crop-length)**                        | Maximum field value length                         | `200`         |
| **[attributesToHighlight](#attributes-to-highlight)** | Highlight matching terms contained in an attribute | `null`        |
| **[matches](#matches)**                               | Return matching terms location                     | `false`       |
| **[sort](#sort)**                                     | Sort search results by an attribute's value        | `null`        |

[Learn more about how to use each search parameter](#search-parameters).

#### Placeholder search

Placeholder search is a search with an empty `q` parameter. Since there is no query term, the [built-in ranking rules](https://docs.meilisearch.com/learn/core_concepts/relevancy.html#ranking-rules) **do not apply.** Only [sort](/learn/core_concepts/relevancy.md#_5-sort) and [custom ranking rules](/learn/core_concepts/relevancy.md#custom-rules) are taken into account.

If the index has no sort or custom ranking rules, the results are returned in the order of their internal database position.

#### Phrase search

Query terms enclosed in double quotes are treated as [phrase searches](#query-q).

### Response

| field                | Description                    |    type    |
| -------------------- | ------------------------------ | :--------: |
| **hits**             | Results of the query           | `[result]` |
| **offset**           | Number of documents skipped    |  `number`  |
| **limit**            | Number of documents to take    |  `number`  |
| **nbHits**           | Total number of matches        |  `number`  |
| **exhaustiveNbHits** | Whether `nbHits` is exhaustive | `boolean`  |
| **facetsDistribution** | **[Distribution of the given facets](#facets-distribution)** | `object`
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
      "overview": "The whole gang are back and as close as ever. They decide to get even closer by spending the summer together at a beach house. They decide to hold the biggest…",
      "release_date": 997405200
    },
    {
      "id": "190859",
      "title": "American Sniper",
      "poster": "https://image.tmdb.org/t/p/w1280/svPHnYE7N5NAGO49dBmRhq0vDQ3.jpg",
      "overview": "U.S. Navy SEAL Chris Kyle takes his sole mission—protect his comrades—to heart and becomes one of the most lethal snipers in American history. His pinpoint accuracy not only saves countless lives but also makes him a prime…",
      "release_date": 1418256000
    },
    …
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

| Query Parameter                                       | Description                                        | Default Value |
|-------------------------------------------------------|----------------------------------------------------|---------------|
| **[q](#query-q)**                                     | Query string (mandatory)                           | `""`          |
| **[offset](#offset)**                                 | Number of documents to skip                        | `0`           |
| **[limit](#limit)**                                   | Maximum number of documents returned               | `20`          |
| **[filter](#filter)**                                 | Filter queries by an attribute's value             | `null`        |
| **[facetsDistribution](#facets-distribution)**        | Display the count of matches per facet             | `null`        |
| **[attributesToRetrieve](#attributes-to-retrieve)**   | Attributes to display in the returned documents    | `["*"]`       |
| **[attributesToCrop](#attributes-to-crop)**           | Attributes whose values have to be cropped         | `null`        |
| **[cropLength](#crop-length)**                        | Maximum field value length                         | `200`         |
| **[attributesToHighlight](#attributes-to-highlight)** | Highlight matching terms contained in an attribute | `null`        |
| **[matches](#matches)**                               | Return matching terms location                     | `false`       |
| **[sort](#sort)**                                     | Sort search results by an attribute's value        | `null`        |

[Learn more about how to use each search parameter](#search-parameters).

#### Placeholder search

When no search query is specified, a [placeholder search](#query-q) is run instead.

#### Phrase search

Query terms enclosed in double quotes are treated as [phrase searches](#query-q).

### Response

| field                | Description                    |    type    |
| -------------------- | ------------------------------ | :--------: |
| **hits**             | Results of the query           | `[result]` |
| **offset**           | Number of documents skipped    |  `number`  |
| **limit**            | Number of documents to take    |  `number`  |
| **nbHits**           | Total number of matches        |  `number`  |
| **exhaustiveNbHits** | Whether `nbHits` is exhaustive | `boolean`  |
| **facetsDistribution** | **[Distribution of the given facets](#facets-distribution)** | `object`
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
      "overview": "The whole gang are back and as close as ever. They decide to get even closer by spending the summer together at a beach house. They decide to hold the biggest…",
      "release_date": 997405200
    },
    {
      "id": "190859",
      "title": "American Sniper",
      "poster": "https://image.tmdb.org/t/p/w1280/svPHnYE7N5NAGO49dBmRhq0vDQ3.jpg",
      "overview": "U.S. Navy SEAL Chris Kyle takes his sole mission—protect his comrades—to heart and becomes one of the most lethal snipers in American history. His pinpoint accuracy not only saves countless lives but also makes him a prime…",
      "release_date": 1418256000
    },
    …
  ],
  "offset": 0,
  "limit": 20,
  "nbHits": 976,
  "exhaustiveNbHits": false,
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

## Parameters

| Query Parameter                                       | Description                                        | Default Value |
|-------------------------------------------------------|----------------------------------------------------|---------------|
| **[q](#query-q)**                                     | Query string (mandatory)                           | `""`          |
| **[offset](#offset)**                                 | Number of documents to skip                        | `0`           |
| **[limit](#limit)**                                   | Maximum number of documents returned               | `20`          |
| **[filter](#filter)**                                 | Filter queries by an attribute's value             | `null`        |
| **[facetsDistribution](#facets-distribution)**        | Display the count of matches per facet             | `null`        |
| **[attributesToRetrieve](#attributes-to-retrieve)**   | Attributes to display in the returned documents    | `["*"]`       |
| **[attributesToCrop](#attributes-to-crop)**           | Attributes whose values have to be cropped         | `null`        |
| **[cropLength](#crop-length)**                        | Maximum field value length                         | `200`         |
| **[attributesToHighlight](#attributes-to-highlight)** | Highlight matching terms contained in an attribute | `null`        |
| **[matches](#matches)**                               | Return matching terms location                     | `false`       |
| **[sort](#sort)**                                     | Sort search results by an attribute's value        | `null`        |

## Query (q)

**Parameter**: `q`
**Expected value**: any string
**Default value**: `null`

Sets the search terms.

::: warning
Meilisearch only considers the first ten words of any given search query. This is necessary in order to deliver a [fast search-as-you-type experience](/learn/advanced/known_limitations.md#number-of-query-words).

Additionally, keep in mind queries go through a normalization process that strips accents and diacritics, as well as making all terms lowercase.
:::

### Placeholder search

When `q` isn't specified, Meilisearch performs a **placeholder search**.  A placeholder search returns all searchable documents in an index, modified by any search parameters used and sorted by that index's [custom ranking rules](/reference/features/settings.md#custom-ranking-rule). Since there is no query term, the [built-in ranking rules](https://docs.meilisearch.com/learn/core_concepts/relevancy.html#ranking-rules) **do not apply.**

If the index has no sort or custom ranking rules, the results are returned in the order of their internal database position.

::: tip

Placeholder search is particularly useful when building a [faceted search UI](/learn/advanced/filtering_and_faceted_search.md#faceted-search), as it allows users to view the catalog and alter sorting rules without entering a query.

:::

### Example

You can search for films mentioning `shifu` by setting the `q` parameter:

<CodeSamples id="search_parameter_guide_query_1" />

This will give you a list of documents that contain your query terms in at least one attribute.

```json
{
  "hits": [
    {
      "id": "50393",
      "title": "Kung Fu Panda Holiday",
      "poster": "https://image.tmdb.org/t/p/w500/rV77WxY35LuYLOuQvBeD1nyWMuI.jpg",
      "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers.",
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

### Phrase search

If you enclose search terms in double quotes (`"`), Meilisearch will only return documents containing those terms in the order they were given. This is called a **phrase search**.

Phrase searches are case-insensitive and ignore [soft separators such as `-`, `,`, and `:`](/learn/advanced/datatypes.md). Using a hard separator within a phrase search effectively splits it into multiple separate phrase searches: `"Octavia.Butler"` will return the same results as `"Octavia" "Butler"`.

You can combine phrase search and normal queries in a single search request. In this case, Meilisearch will first fetch all documents with exact matches to the given phrase(s), and [then proceed with its default behavior](/learn/core_concepts/relevancy.md).

#### Example

<CodeSamples id="phrase_search_1" />

## Offset

**Parameter**: `offset`
**Expected value**: any positive integer
**Default value**: `0`

Sets the starting point in the search results, effectively skipping over a given number of documents.

::: tip
This parameter can be used together with `limit` in order to paginate results.
:::

### Example

If you want to skip the **first** result in a query, set `offset` to `1`:

<CodeSamples id="search_parameter_guide_offset_1" />

## Limit

**Parameter**: `limit`
**Expected value**: any positive integer
**Default value**: `20`

Sets the maximum number of documents returned by a single query.

::: tip
This parameter is often used together with `offset` in order to paginate results.
:::

### Example

If you want your query to return only **two** documents, set `limit` to `2`:

<CodeSamples id="search_parameter_guide_limit_1" />

## Filter

**Parameter**: `filter`
**Expected value**: a filter expression written as a string or an array of strings
**Default value**: `[]`

Uses filter expressions to refine search results. Attributes used as filter criteria must be added to the [`filterableAttributes` list](/reference/api/filterable_attributes.md).

[Read our guide on filtering, faceted search and filter expressions.](/learn/advanced/filtering_and_faceted_search.md)

### Example

You can write a filter expression in string syntax using logical connectives:

```SQL
"(genres = horror OR genres = mystery) AND director = 'Jordan Peele'"
```

You can write the same filter as an array:

```
[["genres = horror", "genres = mystery"], "director = 'Jordan Peele']
```

You can then use the filter in a search query:

<CodeSamples id="faceted_search_walkthrough_filter_1" />

### Filtering results `_geoRadius`

If your documents contain `_geo` data, you can use the `_geoRadius` built-in filter rule to filter results according to their geographic position.

`_geoRadius` establishes a circular area based on a central point and a radius. Results beyond this area will be excluded from your search. This filter rule requires three parameters: `lat`, `lng` and `distance_in_meters`.

```json
_geoRadius(lat, lng, distance_in_meters)
```

`lat` and `lng` should be geographic coordinates expressed as floating point numbers. `distance_in_meters` indicates the radius of the area within which you want your results and should be an integer.

<CodeSamples id="geosearch_guide_filter_usage_1" />

## Facets distribution

**Parameter**: `facetsDistribution`
**Expected value**: an array of `attribute`s or `["*"]`
**Default value**: `null`

Returns the number of documents matching the current search query for each given facet.

This parameter can take two values:

- An array of attributes: `facetsDistribution=["attributeA", "attributeB", …]`
- An asterisk—this will return a count for all facets present in `filterableAttributes`

::: note
If an attribute used on `facetsDistribution` has not been added to the `filterableAttributes` list, it will be ignored.
:::

### Returned fields

When `facetsDistribution` is set, the search results object contains **two additional fields**:

- `facetsDistribution`: The number of remaining candidates for each specified facet
- `exhaustiveFacetsCount`: A `true` or `false` value indicating whether the count is exact (`true`) or approximate (`false`)

`exhaustiveFacetsCount` is `false` when the search matches contain too many different values for the given `facetName`s. In this case, Meilisearch stops the distribution count to prevent slowing down the request.

::: warning
`exhaustiveFacetsCount` is not currently implemented and will always return `false`.
:::

[Learn more about facet distribution in the filtering and faceted search guide.](/learn/advanced/filtering_and_faceted_search.md#facets-distribution)

### Example

Given a movie database, suppose that you want to know the number of `Batman` movies per genre:

<CodeSamples id="faceted_search_facets_distribution_1" />

You would get the following response:

```json
{
  …
  "nbHits": 1684,
  "query": "Batman",
  "exhaustiveFacetsCount": false,
  "facetsDistribution": {
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

## Attributes to retrieve

**Parameter**: `attributesToRetrieve`
**Expected value**: an array of `attribute`s or `["*"]`
**Default value**: `["*"]`

Configures which attributes will be retrieved in the returned documents.

If no value is specified, `attributesToRetrieve` uses the [`displayedAttributes` list](/reference/features/settings.md#displayed-attributes), which by default contains all attributes found in the documents.

::: note
If an attribute has been removed from `displayedAttributes`, `attributesToRetrieve` will silently ignore it and the field will not appear in your returned documents.
:::

### Example

To get only the `overview` and `title` fields, set `attributesToRetrieve` to `["overview", "title"]`.

<CodeSamples id="search_parameter_guide_retrieve_1" />

## Attributes to crop

**Parameter**: `attributesToCrop`
**Expected value**: an array of attribute or `["*"]`
**Default value**: `null`

Crops the selected attributes' values in the returned results to the length indicated by the [`cropLength`](#crop-length) parameter.

When this parameter is set, a field called `_formatted` will be added to `hits`. The cropped version of each document will be available there.

Optionally, you can indicate a custom crop length for any of the listed attributes: `attributesToCrop=["attributeNameA:25", "attributeNameB:150"]`. The custom crop length set in this way has priority over the `cropLength` parameter.

Instead of supplying individual `attributes`, you can provide `["*"]` as a value: `attributesToCrop=["*"]`. This will crop the values of all attributes present in [`attributesToRetrieve`](#attributes-to-retrieve).

**Cropping starts at the first occurrence of the search query**. It only keeps `cropLength` characters on each side of the first match, rounded to match word boundaries.

If no query word is present in the cropped field, the crop will start from the first word.

### Example

If you use `shifu` as a search query and set the value of the `cropLength` parameter to `10`:

<CodeSamples id="search_parameter_guide_crop_1" />

You will get the following response with the **cropped text in the `_formatted` object**:

```json
{
  "id": "50393",
  "title": "Kung Fu Panda Holiday",
  "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
  "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
  "release_date": 1290729600,
  "_formatted": {
    "id": "50393",
    "title": "Kung Fu Panda Holiday",
    "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
    "overview": "this year Shifu informs",
    "release_date": 1290729600
  }
}
```

## Crop length

**Parameter**: `cropLength`
**Expected value**: a positive integer
**Default value**: `200`

Configures the number of characters to keep on each side of the matching query term when using the [`attributesToCrop`](#attributes-to-crop) parameter. Note that this means there can be up to `2 * cropLength` characters in the cropped field.

If `attributesToCrop` is not configured, `cropLength` has no effect on the returned results.

## Attributes to highlight

**Parameter**: `attributesToHighlight`
**Expected value**: an array of attributes or `["*"]`
**Default value**: `null`

Highlights matching query terms in the specified attributes by enclosing them in `<em>` tags. `attributesToHighlight` only works on values of the following types: string, number, array, object.

When this parameter is set, returned documents include a `_formatted` object containing the highlighted terms.

You can provide `["*"]` as a value: `attributesToHighlight=["*"]`. In this case, all the attributes present in [`attributesToRetrieve`](#attributes-to-retrieve) will be assigned to `attributesToHighlight`.

::: tip
It is not possible to change the `<em>` tag or its attributes.

If you need finer control over the formatted output, we recommend using [the `matches` search parameter](#matches).
:::

### Example

The following query highlights matches present in the `overview` attribute:

<CodeSamples id="search_parameter_guide_highlight_1" />

The highlighted version of the text would then be found in the `_formatted` object included in each returned document:

```json
{
  "id": "50393",
  "title": "Kung Fu Panda Holiday",
  "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
  "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
  "release_date": 1290729600,
  "_formatted": {
    "id": "50393",
    "title": "Kung Fu Panda Holiday",
    "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
    "overview": "The <em>Winter Feast</em> is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal <em>Winter Feast</em> at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
    "release_date": 1290729600
  }
}
```

## Matches

**Parameter**: `matches`
**Expected value**: `true` or `false`
**Default value**: `false`

Adds a `_matchesInfo` object to the search response that contains the location of each occurrence of queried terms across all fields. This is useful when you need more control than offered by our [built-in highlighting](#attributes-to-highlight). `matches` only works for strings, numbers, and arrays of strings and numbers.

The beginning of a matching term within a field is indicated by `start`, and its length by `length`.

::: warning
`start` and `length` are measured in bytes and not the number of characters. For example, `ü` represents two bytes but one character.
:::

### Example

If you set `matches` to `true` and search for `winter feast`:

<CodeSamples id="search_parameter_guide_matches_1" />

You would get the following response with **information about the matches in the `_matchesInfo` object**. Note how Meilisearch searches for `winter` and `feast` separately because of the whitespace:

```json
{
  "id": "50393",
  "title": "Kung Fu Panda Holiday",
  "poster": "https://image.tmdb.org/t/p/w500/rV77WxY35LuYLOuQvBeD1nyWMuI.jpg",
  "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
  "release_date": 1290729600,
  "_matchesInfo": {
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

## Sort

**Parameter**: `sort`
**Expected value**: a list of attributes written as an array or as a comma-separated string
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

### Example

You can search for science fiction books ordered from cheapest to most expensive:

<CodeSamples id="search_parameter_guide_sort_1" />

### Sorting results with `_geoPoint`

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
