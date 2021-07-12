# Search parameters

Search parameters allow you greater control over the results returned by a MeiliSearch query.

For example, you can paginate results by using `limit` and `offset` parameters:

<CodeSamples id="search_guide_1" />

Or you can request that a search only returns recently released movies by using the `filters` parameter:

<CodeSamples id="search_guide_2" />

::: warning
If [using the `GET` route to perform a search](/reference/api/search.md#search-in-an-index-with-get-route), all parameters must be **URL-encoded**.

This is not necessary when using the `POST` route or one of our [SDKs](/learn/what_is_meilisearch/sdks.md).
:::

## Parameters

| Query Parameter                                                                               | Description                                        | Default Value |
|-----------------------------------------------------------------------------------------------|----------------------------------------------------|:-------------:|
| **[q](/reference/features/search_parameters.md#query-q)**                                     | Search terms                                       | `""`          |
| **[offset](/reference/features/search_parameters.md#offset)**                                 | Number of documents to skip                        | `0`           |
| **[limit](/reference/features/search_parameters.md#limit)**                                   | Maximum number of documents returned               | `20`          |
| **[filters](/reference/features/search_parameters.md#filters)**                               | Filter queries by an attribute's value             | `null`        |
| **[facetFilters](/reference/features/search_parameters.md#facet-filters)**                    | Filter queries with a faceted attribute            | `null`        |
| **[facetsDistribution](/reference/features/search_parameters.md#facets-distribution)**        | Display the count of matches per facet             | `null`        |
| **[attributesToRetrieve](/reference/features/search_parameters.md#attributes-to-retrieve)**   | Attributes to display in the returned documents    | `["*"]`       |
| **[attributesToCrop](/reference/features/search_parameters.md#attributes-to-crop)**           | Attributes whose values have to be cropped         | `null`        |
| **[cropLength](/reference/features/search_parameters.md#crop-length)**                        | Maximum field value length                         | `200`         |
| **[attributesToHighlight](/reference/features/search_parameters.md#attributes-to-highlight)** | Highlight matching terms contained in an attribute | `null`        |
| **[matches](/reference/features/search_parameters.md#matches)**                               | Return matching terms location                     | `false`       |

## Query (q)

**Parameter**: `q`
**Expected value**: any string
**Default value**: `null`

Sets the search terms.

::: warning
MeiliSearch only considers the first ten words of any given search query. This is necessary in order to deliver a [fast search-as-you-type experience](/learn/what_is_meilisearch/philosophy.md#front-facing-search).
:::

### Example

You can search for films mentioning `shifu` by setting the `q` parameter:

<CodeSamples id="search_parameter_guide_query_1" />

This will give you a list of documents that contain your query terms in at least one attribute.

```json
{
  "hits": [
    {
      "id":"50393",
      "title":"Kung Fu Panda Holiday",
      "poster":"https://image.tmdb.org/t/p/w500/rV77WxY35LuYLOuQvBeD1nyWMuI.jpg",
      "overview":"The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers.",
      "release_date":1290729600,
      "genres":["Animation","Family","TV Movie"]
    },
  ],
  "query":"shifu"
}
```

### Placeholder search

When `q` isn't specified, MeiliSearch performs a **placeholder search**. A placeholder search returns all documents in an index, sorted by that index's [custom ranking rules](/reference/features/settings#custom-ranking-rule).

If the index has no custom ranking rules, the results are returned in the order of their internal database position.

::: tip
Placeholder search is particularly useful for setting up a [faceted search UI](/reference/features/faceted_search).
:::

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

## Filters

**Parameter**: `filters`
**Expected value**: a string containing a query expression
**Default value**: `null`

Filters query results. The string value must use MeiliSearch's [filter syntaxes](/reference/features/filtering.md#the-query-language).

### Example

You can limit your search so it only returns results whose `title` field contains the word `Nightshift`:

<CodeSamples id="search_parameter_guide_filter_1" />

## Facet filters

**Parameter**: `facetFilters`
**Expected value**: an array of strings in the following format: `facetName:facetValue`
**Default value**: `null`

Uses [facets](/reference/features/faceted_search.md) to filter search results.

Values must be given as an array of strings: `facetFilters=["facetName:facetValue"]`.

These strings must be `facetName:facetValue` pairs. `facetName` corresponds to a faceted attribute and `facetValue` to the value the query results will be filtered on.

You can use nested arrays: `facetFilters=["facetName:facetValue", ["facetNameA:facetValueA", "facetNameB:facetValueB"]]`.

Facet filters also support logical connectives by using [inner and outer array elements](/reference/features/faceted_search.md#using-facets). You can [learn more about faceted search in our dedicated guide](/reference/features/faceted_search.md).

### Example

Suppose you are searching for movies, but only want results in `Horror` or `Mystery` `genres` and whose `director` is `Jordan Peele`:

```SQL
("genres:Horror" OR "genres:Mystery") AND "director:Jordan Peele"
```

After declaring `director` and `genres` as [faceted attributes](/reference/features/settings.md#attributes-for-faceting), you make a query for `thriller`:

<CodeSamples id="faceted_search_walkthrough_facet_filters_1" />

And get the following response:

```json
{
  "hits": [
    {
      "id": 458723,
      "title": "Us",
      "director": "Jordan Peele",
      "tagline": "Watch yourself",
      "genres": [
        "Thriller",
        "Horror",
        "Mystery"
      ],
      "overview": "Husband and wife Gabe and Adelaide Wilson take their kids to their beach house expecting to unplug and unwind with friends. But as night descends, their serenity turns to tension and chaos when some shocking visitors arrive uninvited.",
    },
    {
      "id": 419430,
      "title": "Get Out",
      "director": "Jordan Peele",
      "genres": [
        "Mystery",
        "Thriller",
        "Horror"
      ],
      "overview": "Chris and his girlfriend Rose go upstate to visit her parents for the weekend. At first, Chris reads the family's overly accommodating behavior as nervous attempts to deal with their daughter's interracial relationship, but as the weekend progresses, a series of increasingly disturbing discoveries lead him to a truth that he never could have imagined.",
    }
  ],
  …
  "query": "thriller"
}
```

## Facets distribution

**Parameter**: `facetsDistribution`
**Expected value**: an array of `facetName`s or `["*"]`
**Default value**: `null`

Adds the count of matching facet terms to the query's returned fields.

This argument can take two values:

- An array of `facetName`s—this will only count the listed facets:  `facetsDistribution=[<facetNameA>, <facetNameB>, ...]`. If a `facetName` does not exist, it will be ignored

- An asterisk—this will return a count for all facets: `["*"]`

### Returned fields

When `facetsDistribution` is set, search results contain **two additional fields**:

- `facetsDistribution`: The number of remaining candidates for each specified facet

- `exhaustiveFacetsCount`: A `true` or `false` value indicating whether the count reflects all instances of a facet. If `false`, the number is only an approximation.

The non-exhaustive facet count happens when there are too many documents in too many different facet values. In this case, MeiliSearch stops the distribution count to prevent slowing down the request.

[Learn more about facet distribution in the dedicated guide.](/reference/features/faceted_search.md#the-facets-distribution)

### Example

Given a movie database, suppose that you want to know the number of `Batman` movies per genre:

<CodeSamples id="faceted_search_facets_distribution_1" />

You would get the following response:

```json
{
  "hits": [
    …
  ],
  …
  "nbHits": 1684,
  "query": "Batman",
  "exhaustiveFacetsCount": true,
  "facetsDistribution": {
    "genres": {
      "action": 273,
      "animation": 118,
      "adventure": 132,
      "fantasy": 67,
      "comedy": 475,
      "mystery": 70,
      "thriller": 217,
    }
  }
}
```

## Attributes to retrieve

**Parameter**: `attributesToRetrieve`
**Expected value**: an array of `attribute`s or `["*"]`
**Default value**: `["*"]`

Configures which attributes will be displayed in the returned documents.

If no value is specified, `attributesToRetrieve` uses the [`displayedAttributes` list](/reference/features/settings.md#displayed-attributes), which by default contains all attributes found in the documents.

### Example

To get only the `overview` and `title` fields and ignore all other attributes, set `attributesToRetrieve` to `"overview", "title"`.

<CodeSamples id="search_parameter_guide_retrieve_1" />

## Attributes to crop

**Parameter**: `attributesToCrop`
**Expected value**: an array of `attribute`s or `["*"]`
**Default value**: `null`

Crops the selected attributes' values in the returned results to the length indicated by the [`cropLength`](/reference/features/search_parameters.md#crop-length) parameter.

The cropped version of each document will be available in each document's `_formatted` property.

Values can be supplied individually, one for each attribute you want to crop: `attributesToCrop=["attributeA", "attributeB"]`.

Optionally, you can indicate a custom crop length for any of the listed attributes: `attributesToCrop=["attributeNameA:25", "attributeNameB:150"]`.

Instead of supplying individual `attributes`, you can provide `["*"]` as a value. This will crop the values of all attributes present in the `attributesToRetrieve` list: `attributesToCrop=["*"]`.

**Cropping starts at the first occurrence of the search query**. It only keeps `cropLength` characters on each side of the first match, rounded to match word boundaries.

If no query word is present in the cropped field, the crop will start from the first word.

### Example

If you use `shifu` as a search query and set the value of the parameter `cropLength` to `10`:

<CodeSamples id="search_parameter_guide_crop_1" />

You will get the following response with the **cropped version in the `_formatted` object**:

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

Configures the number of characters to keep on each side of the matching word. Often used together with [`attributesToCrop`](/reference/features/search_parameters.md#attributes-to-crop).

## Attributes to highlight

**Parameter**: `attributesToHighlight`
**Expected value**: an array of `attribute`s or `["*"]`
**Default value**: `null`

Highlights matching query words in the selected attributes. Every matching query word in the given attribute's value will be wrapped in an `<em>` tag.

Values can be supplied individually, in an array: `attributesToHighlight=["attributeA", "attributeB"]`.

Instead of single `attributes`, you can provide `["*"]` as a value: `attributesToHighlight=["*"]`. In this case, all the attributes present in `attributesToRetrieve` will be assigned to `attributesToHighlight`.

The cropped version of each document will be available in its `_formatted` property.

If HTML highlighting is not desirable, `matches` can provide finer-grained control of the output.

### Example

If you want to highlight the content of `overview`:

<CodeSamples id="search_parameter_guide_highlight_1" />

You will get the following response with the **highlighted version in the `_formatted` object**:

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
    "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year <em>Shifu</em> informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between <em>Shifu</em> and Mr. Ping.",
    "release_date": 1290729600
  }
}
```

## Matches

**Parameter**: `matches`
**Expected value**: `true` or `false`
**Default value**: `false`

Adds an object containing the location of each occurrence of queried terms across all fields. This is useful when you need more customization than offered by the default HTML highlighter.

Matches can be found in the `\_matchesInfo` object present in each returned result.

The location is indicated by the `start` position of the match and its length.

::: warning
`start` and `length` return the number of bytes and not the number of characters. For example, `ü` represents two bytes but one character.
:::

### Example

If you set `matches` to `true` and search for `shifu`:

<CodeSamples id="search_parameter_guide_matches_1" />

You will get the following response with the **information about the matches in the `\_matchesInfo` object**:

```json
{
  "id": "50393",
  "title": "Kung Fu Panda Holiday",
  "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
  "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
  "release_date": 1290729600,
  "_matchesInfo": {
    "overview": [
      {
        "start": 159,
        "length": 5
      },
      {
        "start": 361,
        "length": 5
      }
    ]
  }
}
```
