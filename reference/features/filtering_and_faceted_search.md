# Filtering and faceted search

You can use MeiliSearch's filters to refine search results.

Filters have several use-cases, such as restricting the results a specific user has access to or creating faceted search interfaces. Faceted search interfaces are particularly efficient in helping users navigate a great number of results across many broad categories.

## Configuring filters

Filters use [document fields](/learn/core_concepts/documents.md#fields) to establish filtering criteria.

To use a document field as a filter, you must first add its attribute to the [`filterableAttributes` index setting](/reference/api/filterable_attributes.md).

**This step is mandatory and cannot be done at search time.** Filters need to be properly processed and prepared by MeiliSearch before they can be used.

Updating `filterableAttributes` requires recreating the entire index. This may take a significant amount of time depending on your dataset size.

::: note
By default, `filterableAttributes` is empty. This means that filters do not work without first explicitly adding attributes to the `filterableAttributes` list.
:::

Filters work with numeric and string values. Empty fields or fields containing an empty array will be ignored.

::: warning
MeiliSearch does not support filtering on nested arrays and objects [yet](https://roadmap.meilisearch.com/c/105-filter-on-nested-objects). Therefore, fields containing nested arrays and objects will be silently ignored.
:::

### Example

Suppose you have a collection of movies containing the following fields:

```json
[
  {
      "id": "458723",
      "title": "Us",
      "director": "Jordan Peele",
      "genres": [
        "Thriller",
        "Horror",
        "Mystery"
      ],
      "overview": "Husband and wife Gabe and Adelaide Wilson take their […]",
  },
  …
]
```

If you want to filter results based on the `director` and `genres` attributes, you must add them to the [`filterableAttributes` list](/reference/api/filterable_attributes.md):

<CodeSamples id="faceted_search_update_settings_1" />

## Using filters

Once you have configured `filterableAttributes`, you can start using [the `filter` search parameter](/reference/features/search_parameters.md#filter). Search parameters are added to at search time, that is, when a user searches your dataset.

`filter` expects a **filter expression** containing one or more **conditions**. A filter expression can be written as a string, as an array, or as a mix of both.

### Conditions

Conditions are a filter's basic building blocks. They are always written in the `attribute OPERATOR value` format, where:

- `attribute` is the attribute of the field you want to filter on
- `OPERATOR` is the comparison operator and can be `=`, `!=`, `>`, `>=`, `<`, or `<=`
- `value` is the value condition for the filter

::: note
`>`, `>=`, `<`, and `<=` only operate on numeric values and will ignore all other types of values.

When operating on strings, `=` and `!=` are **case-insensitive**.
:::

#### Examples

A basic condition could request movies containing the `horror` genre:

```
genres = horror
```

Note that string values containing whitespace must be enclosed in single or double quotes:

```
director = 'Jordan Peele'
director = "Tim Burton"
```

Another condition could request movies released after 18 March 1995 (written as 795484800 in UNIX Epoch time):

```
release_date > 795484800
```

::: warning
As no specific schema is enforced at indexing, the filtering engine will try to coerce the type of `value`. This can lead to undefined behaviour when big floats are coerced into integers and reciprocally. For this reason, it is best to have homogeneous typing across fields, especially if numbers tend to become large.
:::

### Filter expressions

You can build filter expressions by grouping basic conditions. Filter expressions can be written as strings, arrays, or a mix of both.

::: warning
The [`GET` route of the search endpoint](/reference/api/search.md#search-in-an-index-with-get-route) only accepts string filter expressions.
:::

#### Creating filter expressions with strings

String expressions combine conditions using the following filter operators and parentheses:

- `NOT` only returns documents that do not satisfy a condition : `NOT genres = horror`
- `AND` operates by connecting two conditions and only returns documents that satisfy both of them: `genres = horror AND director = 'Jordan Peele'`
- `OR` connects two conditions and returns results that satisfy at least one of them: `genres = horror OR genres = comedy`
- `TO` is equivalent to `>= AND <=`. The expression `release_date 795484800 TO 972129600` translates to `release_date >= 795484800 AND release_date <= 972129600`

::: tip
String expressions are read left to right. `NOT` takes precedence over `AND` and `AND` takes precedence over `OR`. You can use parentheses to ensure expressions are correctly parsed.

For instance, if you want your results to only include `comedy` and `horror` movies released after March 1995, the parentheses in the following query are mandatory:

`(genres = horror OR genres = comedy) AND release_date > 795484800`

Failing to add these parentheses will cause the same query to be parsed as:

`genres = horror OR (genres = comedy AND release_date > 795484800)`

Translated into English, the above expression will only return comedies released after March 1995 or horror movies regardless of their `release_date`.
:::

#### Creating filter expressions with arrays

Array expressions establish logical connectives by nesting arrays of strings. They can have a maximum depth of two—array filter expressions with three or more levels of nesting will throw an error.

Outer array elements are connected by an `AND` operator. The following expression returns `horror` movies directed by `Jordan Peele`:

```
["genres = horror", "director = 'Jordan Peele'"]
```

Inner array elements are connected by an `OR` operator. The following expression returns either `horror` or `comedy` films:

```
[["genres = horror", "genres = comedy"]]
```

Inner and outer arrays can be freely combined. The following expression returns both `horror` and `comedy` movies directed by `Jordan Peele`:

```
[["genres = horror", "genres = comedy"], "director = 'Jordan Peele'"]
```

#### Combining arrays and strings

You can also create filter expressions that use both array and string syntax.

The following filter is written as a string and only returns movies not directed by `Jordan Peele` that belong to the `comedy` or `horror` genres:

```
"(genres = comedy OR genres = horror) AND director != 'Jordan Peele'"
```

You can write the same filter mixing arrays and strings:

```
[["genres = comedy, genres = horror"], "NOT director = 'Jordan Peele'"]
```

### Example

Suppose that you have a dataset containing several movies in the following format:

```json
[
    …
    {
        "id": "458723",
        "title": "Us",
        "director": "Jordan Peele",
        "poster": "https://image.tmdb.org/t/p/w1280/ux2dU1jQ2ACIMShzB3yP93Udpzc.jpg",
        "overview": "Husband and wife Gabe and Adelaide Wilson take their…",
        "release_date": 1552521600,
        "genres": [
            "Comedy",
            "Horror",
            "Thriller"
        ],
        "rating": 4
    },
    …
]
```

If you want to enable filtering using `director`, `release_date`, `genres`, and `rating`, you must add these attributes to the [`filterableAttributes` index setting](/reference/api/filterable_attributes.md).

You can then restrict a search so it only returns movies released after 18 March 1995 with the following filter containing a single condition:

```SQL
release_date > 795484800
```

You can use this filter when searching for recent `Avengers` movies:

<CodeSamples id="filtering_guide_1" />

You can also combine multiple conditions. For instance, you can limit your search so it only includes recent movies directed by either `Tim Burton` or `Christopher Nolan`:

```SQL
release_date > 795484800 AND (director = "Tim Burton" OR director = "Christopher Nolan")
```

Here, the parentheses are mandatory: without them, the filter would return movies directed by `Tim Burton` and released after 1995 or any film directed by `Christopher Nolan`, without constraints on its release date. This happens because `AND` takes precedence over `OR`.

You can use this filter when searching for `Batman` movies:

<CodeSamples id="filtering_guide_2" />

Note that filtering on string values is case-insensitive.

If you only want well-rated movies that weren't directed by `Tim Burton`, you can use this filter:

```SQL
rating >= 3 AND (NOT director = "Tim Burton")
```

You can use this filter when searching for `Planet of the Apes`:

<CodeSamples id="filtering_guide_4" />

## Filtering with `_geoRadius`

If your documents contain `_geo` data, you can use the `_geoRadius` built-in filter rule to filter results according to their geographic position.

`_geoRadius` establishes a circular area based on a central point and a radius. Results beyond this area will be excluded from your search. This filter rule requires three parameters: `lat`, `lng` and `distance_in_meters`.

```
_geoRadius(lat, lng, distance_in_meters)
```

`lat` and `lng` must be floating point numbers indicating a geographic position. `distance_in_meters` must be an integer indicating the radius covered by the `_geoRadius` filter.

### Example

When using a dataset of restaurants containing geopositioning data, we can filter our search so it only includes places within two kilometres of our location:

<CodeSamples id="geosearch_guide_filter_usage_1" />

[You can read more about filtering results with `_geoRadius` in our geosearch guide.](/reference/features/geosearch.md#filtering-results-with-georadius)

## Faceted search

MeiliSearch filters can be used to build **faceted search** interfaces. This type of interface allows users to refine search results based on broad categories or **facets**. For example, a clothing webshop can use faceted search to allow users to easily explore items of a certain size or belonging to a specific brand.

Faceted search provides users with a quick way to narrow down search results by selecting categories relevant to what they are looking for. A faceted navigation system is an **intuitive interface to display and navigate through content**. Facets are used in the UI as filters which users can apply to refine the results in real-time.

This is common in ecommerce sites like Amazon: when users perform a search, they are presented not only with a list of results, but also with a list of facets which you can see on the sidebar in the image below:

![Amazon UI](/faceted-search/facets-amazon.png)

### Filters or facets

In MeiliSearch, facets are a specific use-case of filters. The question of whether something is a filter or a facet is mostly one pertaining to UX and UI design.

### Using facets

Like any other filter, attributes you want to use as facets must be added to the `filterableAttributes` list in the index's settings before they can be used.

Once they have been configured, you can search for facets with the `filter` search parameter.

#### Example

Suppose you have added `director` and `genres` to the [`filterableAttributes` list](/reference/features/settings.md#filterable-attributes), and you want to get movies classified as either `Horror` **or** `Mystery` **and** directed by `Jordan Peele`.

```SQL
[["genres = horror", "genres = mystery"], "director = 'Jordan Peele'"]
```

You can then use this filter to search for `thriller`:

<CodeSamples id="faceted_search_filter_1" />

### Facets distribution

When creating a faceted search interface it is often useful to have a count of how many results belong to each facet. This can be done by using the [`facetsDistribution` search parameter](/reference/features/search_parameters.md#facets-distribution) in combination with `filter` when searching.

::: note
MeiliSearch does not differentiate between facets and filters. This means that, despite its name, `facetsDistribution` can be used with any attributes added to `filterableAttributes`.
:::

Using `facetsDistribution` will add an extra field to the returned search results containing the number of matching documents distributed among all the values of a given facet.

In the example below, [IMDb](https://www.imdb.com) displays the facet count in parentheses next to each faceted category. This UI gives users a visual clue of the range of results  available for each facet.

![IMDb facets](/faceted-search/facets-imdb.png)

#### Using facet distribution

[`facetsDistribution` is a search parameter](/reference/features/search_parameters.md#facets-distribution) and as such must be added to a search request. It expects an array of strings. Each string is an attribute present in the `filterableAttributes` list.

Using the `facetsDistribution` search parameter adds two new keys to the returned object: `facetsDistribution` and `exhaustiveFacetsCount`.

`facetsDistribution` contains an object for every given facet. For each of these facets, there is another object containing all the different values and the count of matching documents. Note that zero values will not be returned: if there are no `romance` movies matching the query, `romance` is not displayed.

```json
{
  "exhaustiveFacetsCount": false,
  "facetsDistribution" : {
    "genres" : {
      "horror": 50,
      "comedy": 34,
    }
  }
}
```

`exhaustiveFacetsCount` is a boolean value that informs the user whether the facet count is exact or just an approximation. For performance reasons, MeiliSearch chooses to use approximate facet count values when there are too many documents across several different fields.

::: warning
`exhaustiveFacetsCount` is not currently implemented in and will always return `false`.
:::

##### Example

You can write a search query that gives you the distribution of `batman` movies per genre:

<CodeSamples id="faceted_search_facets_distribution_1"/>

This query would return not only the matching movies, but also the `facetsDistribution` key containing all relevant data:

```json
{
  "hits": [
    …
  ],
  …
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
