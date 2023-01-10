---

sidebarDepth: 2

---

# Filtering and faceted search

You can use Meilisearch's filters to refine search results.

Filters have several use-cases, such as restricting the results a specific user has access to or creating faceted search interfaces. Faceted search interfaces are particularly efficient in helping users navigate a great number of results across many broad categories.

## Configuring filters

Suppose you have a collection of movies called `movie_ratings` containing the following fields:

```json
[
  {
    "id": 458723,
    "title": "Us",
    "director": "Jordan Peele",
    "genres": [
      "Thriller",
      "Horror",
      "Mystery"
    ],
    "rating": {
      "critics": 86,
      "users": 73
    },
    "overview": "Husband and wife Gabe and Adelaide Wilson take their…"
  },
  …
]
```

If you want to filter results based on the `director` and `genres` attributes, you must add them to the `filterableAttributes` list:

<CodeSamples id="faceted_search_update_settings_1" />

**This step is mandatory and cannot be done at search time**  because Meilisearch needs to prepare an index before you can use filters. Updating `filterableAttributes` may take a significant amount of time depending on your dataset size.

::: note
By default, `filterableAttributes` is empty. Filters do not work without first explicitly adding attributes to the `filterableAttributes` list.
:::

Filters work with numeric and string values. Empty fields or fields containing an empty array will be ignored.

Filters do not work with [`NaN`](https://en.wikipedia.org/wiki/NaN) and infinite values such as `inf` and `-inf` as they are [not supported by JSON](https://en.wikipedia.org/wiki/JSON#Data_types). It is possible to filter infinite and `NaN` values if you parse them as strings, except when handling [geo fields](/learn/advanced/geosearch.md#preparing-documents-for-location-based-search).

## Filter basics

Once you have configured `filterableAttributes`, you can use [the `filter` search parameter](/reference/api/search.md#filter). The `filter` search parameter refines search results by selecting documents matching the given filter and running the search query only on those documents.

::: warning
[Synonyms](/learn/configuration/synonyms.md) don't apply to filters. Meaning, if you have `SF` and `San Francisco` set as synonyms, filtering by `SF` and `San Francisco` will show you different results.
:::

`filter` expects a **filter expression** containing one or more **conditions**. A filter expression can be written as a string, array, or as a mix of both.

### Conditions

Conditions are a filter's basic building blocks. They are always written in the `attribute OPERATOR value` format, where:

- `attribute` is the attribute of the field you want to filter on
- `OPERATOR` can be `=`, `!=`, `>`, `>=`, `<`, `<=`, `TO`, `EXISTS`, `IN`, `NOT`, `AND`, or `OR`
- `value` is the value condition for the filter

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

Another condition could request movies released after 18 March 1995 (written as `795484800` in UNIX Epoch time):

```
release_date > 795484800
```

::: warning
As no specific schema is enforced at indexing, the filtering engine will try to coerce the type of `value`. This can lead to undefined behavior when big floats are coerced into integers and reciprocally. For this reason, it is best to have homogeneous typing across fields, especially if numbers tend to become large.
:::

### Filter operators

Meilisearch supports the following filter operators:

#### Equality

The equality operator (`=`) returns all documents containing an attribute equal to a specific value. When operating on strings, `=` is case-insensitive.

::: note
The equality operator does not return any results for `null` and empty arrays.
:::

The following expression returns all action movies:

```
genres = action
```

#### Inequality

The inequality operator (`!=`) returns all documents not selected by the equality operator. When operating on strings, `!=` is case-insensitive.

The following expression returns all movies without the `action` genre:

```
genres != action
```

#### Comparison

The comparison operators (`>`, `<`, `>=`, `<=`, `TO`) select documents satisfying a comparison. Comparison operators only apply only to numerical values.

The expression below returns all documents with a user rating above 85:

```
rating.users > 85
```

To filter documents with a user rating of 80 or above but below 90, use:

```
rating.users >= 80 AND rating.users < 90
```

##### `TO`

`TO` is equivalent to `>= AND <=`. The following expression returns all movies with a user rating of 80 or above but below 90:

```
rating.users 80 TO rating.users 89
```

#### `EXISTS`

The `EXISTS` operator checks for the existence of a field. Fields with empty or `null` values count as existing.

The following expression returns all documents that contain the `release_date` field, even if it is empty or `null`:

```
release_date EXISTS
```

The negated form of the above expression can be written as:

```
release_date NOT EXISTS
NOT release_date EXISTS
```

Both forms are equivalent.

#### `IN`

`IN` combines equality operators by taking an array of comma-separated values delimited by square brackets. It selects all documents whose chosen field contains at least one of the specified values.

Both of the following expressions are equivalent and return all documents whose `genres` includes either `horror`, `comedy`, or both:

```
genres IN [horror, comedy]
genres = horror OR genres = comedy
```

The negated form of the above expression can be written as:

```
genres NOT IN [horror, comedy]
NOT genres IN [horror, comedy]
```

Both are equivalent and mean:

```
genres != horror AND genres != comedy
```

#### `NOT`

The negation operator (`NOT`) selects all documents that do not satisfy a condition. It has higher precedence than `AND` and `OR`.

The following expression will return all documents whose `genres` does not contain `horror` and documents with a missing `genres` field:

```
NOT genres = horror
```

### Combining filter expressions

You can build filter expressions by grouping basic conditions using `AND` and `OR`. Filter expressions can be written as strings, arrays, or a mix of both.

::: warning
The [`GET` route of the search endpoint](/reference/api/search.md#search-in-an-index-with-get-route) only accepts string filter expressions.
:::

#### `AND`

`AND` connects two conditions and only returns documents that satisfy both of them. `AND` has higher precedence than `OR`.

The following expression returns all `horror` movies directed by `Jordan Peele`:

```
genres = horror AND director = 'Jordan Peele'
```

#### `OR`

`OR` connects two conditions and returns results that satisfy at least one of them.

The following expression returns either `horror` or `comedy` films:

```
genres = horror OR genres = comedy
```

#### Creating filter expressions with strings

Meilisearch reads string expressions from left to right. You can use parentheses to ensure expressions are correctly parsed.

::: note
Filtering on string values is case-insensitive.
:::

For instance, if you want your results to only include `comedy` and `horror` movies released after March 1995, the parentheses in the following query are mandatory:

```
(genres = horror OR genres = comedy) AND release_date > 795484800
```

Failing to add these parentheses will cause the same query to be parsed as:

```
genres = horror OR (genres = comedy AND release_date > 795484800)
```

Translated into English, the above expression will only return comedies released after March 1995 or horror movies regardless of their `release_date`.

::: note
When creating an expression with a field name or value identical to a filter operator such as `AND` or `NOT`, you must wrap it in quotation marks: `title = "NOT" OR title = "AND"`.
:::

#### Creating filter expressions with arrays

Array expressions establish logical connectives by nesting arrays of strings. **Array filters can have a maximum depth of two**—expressions with three or more levels of nesting will throw an error.

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

## Using filters

Suppose that your `movie_ratings` dataset contains several movies in the following format:

```json
[
  …
  {
    "id": 458723,
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
    "rating": {
      "critics": 86,
      "users": 73
    },
  },
  …
]
```

After adding `director`, `release_date`, and `genres` to the [`filterableAttributes` index setting](//reference/api/settings.md#filterable-attributes), you can use them for filtering.

The following code sample returns `Avengers` movies released after 18 March 1995:

<CodeSamples id="filtering_guide_1" />

You can also combine multiple conditions. For example, you can limit your search so it only includes `Batman` movies directed by either `Tim Burton` or `Christopher Nolan`:

<CodeSamples id="filtering_guide_2" />

Here, the parentheses are mandatory: without them, the filter would return movies directed by `Tim Burton` and released after 1995 or any film directed by `Christopher Nolan`, without constraints on its release date. This happens because `AND` takes precedence over `OR`.

If you only want recent `Planet of the Apes` movies that weren't directed by `Tim Burton`, you can use this filter:

<CodeSamples id="filtering_guide_3" />

`NOT director = "Tim Burton"` will include both documents that do not contain `"Tim Burton"` in its `director` field and documents without a `director` field. To return only documents that have a `director` field, expand the filter expression with the `EXISTS` operator:

```SQL
release_date > 1577884550 AND (NOT director = "Tim Burton" AND director EXISTS)
```

### Filtering with `_geoRadius`

If your documents contain `_geo` data, you can use the `_geoRadius` built-in filter rule to filter results according to their geographic position.

`_geoRadius` establishes a circular area based on a central point and a radius. Results beyond this area will be excluded from your search. This filter rule requires three parameters: `lat`, `lng` and `distance_in_meters`.

```
_geoRadius(lat, lng, distance_in_meters)
```

`lat` and `lng` must be floating point numbers indicating a geographic position. `distance_in_meters` must be an integer indicating the radius covered by the `_geoRadius` filter.

When using a <a id="downloadRestaurants" href="/restaurants.json" download="restaurants.json"> dataset of restaurants</a> containing geopositioning data, we can filter our search so it only includes places within two kilometers of our location:

<CodeSamples id="geosearch_guide_filter_usage_1" />

[You can read more about filtering results with `_geoRadius` in our geosearch guide.](/learn/advanced/geosearch.md#filtering-results-with-georadius)

### Filtering by nested fields

Use dot notation to filter results based on a document's nested fields. The following query only returns thrillers with good user reviews:

<CodeSamples id="filtering_guide_nested_1" />

[You can read more about nested fields in our guide on data types.](/learn/advanced/datatypes.md)

## Faceted search

Meilisearch filters can be used to build **faceted search** interfaces. This type of interface allows users to refine search results based on broad categories or **facets**. For example, a clothing webshop can use faceted search to allow users to easily explore items of a certain size or belonging to a specific brand.

Faceted search provides users with a quick way to narrow down search results by selecting categories relevant to what they are looking for. A faceted navigation system is an **intuitive interface to display and navigate through content**. Facets are used in the UI as filters that users can apply to refine the results in real-time.

This is common in ecommerce sites like Amazon. When users perform a search, they are presented not only with a list of results but also with a list of facets which you can see on the sidebar in the image below:

![Meilisearch demo for an ecommerce website displaying faceting UI](/faceted-search/facets-ecommerce.png)

Faceted search interfaces often have a count of how many results belong to each facet. This gives users a visual clue of the range of results available for each facet.

### Filters or facets

In Meilisearch, facets are a specific use-case of filters. The question of whether something is a filter or a facet is mostly one pertaining to UX and UI design.

### Configuring and using facets

Like any other filter, attributes you want to use as facets must be added to the [`filterableAttributes` list](/reference/api/settings.md#filterable-attributes) in the index's settings before they can be used.

Once they have been configured, you can search for facets with [the `facets` search parameter](/reference/api/search.md#facets).

::: warning
Synonyms don't apply to facets. Meaning, if you have `SF` and `San Francisco` set as synonyms, filtering by `SF` and `San Francisco` will show you different results.
:::

::: note
Meilisearch does not differentiate between facets and filters. This means that, despite its name, `facets` can be used with any attributes added to `filterableAttributes`.
:::

#### Facet distribution

Using `facets` will add an extra field,`facetDistribution`, to the returned search results containing the number of matching documents distributed among the values of a given facet. The `facets` search parameter expects an array of strings. Each string is an attribute present in the `filterableAttributes` list.

The following search query gives you the distribution of `batman` movies per genre:

<CodeSamples id="faceted_search_facets_1"/>

```json
{
  "hits": [
    …
  ],
  …
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

`facetDistribution` contains an object for every given facet. For each of these facets, there is another object containing all the different values and the count of matching documents. Note that zero values will not be returned: if there are no `romance` movies matching the query, `romance` is not displayed.

::: note
By default, `facets` returns a maximum of 100 facet values for each faceted field. You can change this value using the `maxValuesPerFacet` property of the [`faceting` index settings](/reference/api/settings.md#faceting).
:::
