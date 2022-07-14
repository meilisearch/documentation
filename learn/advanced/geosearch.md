# Geosearch

Meilisearch allows you to filter and sort results based on their geographic location. This can be useful when you only want results within a specific area or when sorting results based on their distance from a specific location.

## Preparing documents for location-based search

In order to start filtering and sorting documents based on their geographic location, you must make sure they contain a valid `_geo` field.

`_geo` is a reserved field. If you include it in your documents, Meilisearch expects its value to conform to a specific format.

When using JSON and NDJSON, `_geo` must contain an object with two keys: `lat` and `lng`. Both fields must contain either a floating point number or a string indicating, respectively, latitude and longitude:

```json
{
  …
  "_geo": {
    "lat": 0.0,
    "lng": "0.0"
  }
}
```

### Examples

Suppose we have a JSON array containing a few restaurants:

```json
[
  {
    "id": 1,
    "name": "Nàpiz' Milano",
    "address": "Viale Vittorio Veneto, 30, 20124, Milan, Italy",
    "type": "pizza",
    "rating": 9
  },
  {
    "id": 2,
    "name": "Bouillon Pigalle",
    "address": "22 Bd de Clichy, 75018 Paris, France",
    "type": "french",
    "rating": 8
  },
  {
    "id": 3,
    "name": "Artico Gelateria Tradizionale",
    "address": "Via Dogana, 1, 20123 Milan, Italy",
    "type": "ice cream",
    "rating": 10
  }
]
```

Our restaurant dataset looks like this once we add geopositioning data:

```json
[
  {
    "id": 1,
    "name": "Nàpiz' Milano",
    "address": "Viale Vittorio Veneto, 30, 20124, Milan, Italy",
    "type": "pizza",
    "rating": 9,
    "_geo": {
      "lat": 45.4777599, 
      "lng": 9.1967508
    }
  },
  {
    "id": 2,
    "name": "Bouillon Pigalle",
    "address": "22 Bd de Clichy, 75018 Paris, France",
    "type": "french",
    "rating": 8,
    "_geo": {
      "lat": 48.8826517, 
      "lng": 2.3352748
    }
  },
  {
    "id": 3,
    "name": "Artico Gelateria Tradizionale",
    "address": "Via Dogana, 1, 20123 Milan, Italy",
    "type": "ice cream",
    "rating": 10,
    "_geo": {
      "lat": 45.4632046,
      "lng": 9.1719421
    }
  }
]
```

::: warning
Trying to index a dataset with one or more documents containing badly formatted `_geo` values will cause Meilisearch to throw an [`invalid_geo_field`](/reference/api/error_codes.md#invalid-geo-field) error. In this case, the update will fail and no documents will be added or modified.
:::

### Using `_geo` with CSV

If your dataset is formatted as CSV, the file header must have a `_geo` column. Each row in the dataset must then contain a column with a comma-separated string indicating latitude and longitude:

```csv
"id:number", "name:string", "address:string", "type:string", "rating:number", "_geo:string"
"1", "Nàpiz Milano", "Viale Vittorio Veneto, 30, 20124, Milan, Italy","pizzeria", 9, "45.4777599,9.1967508"
"2", "Bouillon Pigalle", "22 Bd de Clichy, 75018 Paris, France", "french", 8, "48.8826517,2.3352748"
"3", "Artico Gelateria Tradizionale", "Via Dogana, 1, 20123 Milan, Italy", "ice cream", 10, "48.8826517,2.3352748"
```

## Filtering results with `_geoRadius`

You can use `_geo` data to filter queries and make sure you only receive results located within a certain geographic area.

### Configuration

In order to filter results based on their location, you must add the `_geo` attribute to the `filterableAttributes` list:

<CodeSamples id="geosearch_guide_filter_settings_1" />

Note that Meilisearch will rebuild your index whenever you update `filterableAttributes`. Depending on the size of your dataset, this might take a considerable amount of time.

[You can read more about configuring `filterableAttributes` in our dedicated filtering guide.](/learn/advanced/filtering_and_faceted_search.md#configuring-filters)

### Usage

Once you are sure that all your documents contain valid geolocation data and that you have added the `_geo` attribute to the `filterableAttributes` list, you can use the [`filter` search parameter](/reference/api/search.md#filter) along with `_geoRadius`, a special filter rule, to ensure Meilisearch only returns results located within a specific geographic area.

`_geoRadius` establishes a circular area based on a central point and a radius. Results beyond this area will be excluded from your search. This filter rule requires three parameters: `lat`, `lng` and `distance_in_meters`.

```
_geoRadius(lat, lng, distance_in_meters)
```

`lat` and `lng` must be floating point numbers indicating a geographic position. `distance_in_meters` must be an integer indicating the radius covered by the `_geoRadius` filter. If any of these three parameters are invalid or missing, Meilisearch will return an [`invalid_filter`](/reference/api/error_codes.md#invalid-filter) error.

[You can read more about using `filter` in our dedicated guide.](/learn/advanced/filtering_and_faceted_search.md#using-filters)

::: warning
`_geo`, `_geoDistance`, and `_geoPoint` are not valid filter rules. Trying to use any of them with the `filter` search parameter will result in an [`invalid_filter`](/reference/api/error_codes.md#invalid-filter) error.
:::

### Examples

`_geoRadius` works like any other filter rule. Using our <a id="downloadRestaurants" href="/restaurants.json" download="restaurants.json">example dataset</a>, we can search for places to eat near the center of Milan:

<CodeSamples id="geosearch_guide_filter_usage_1" />

The results should look like this:

```json
[
  {
    "id": 1,
    "name": "Nàpiz' Milano",
    "address": "Viale Vittorio Veneto, 30, 20124, Milan, Italy",
    "type": "pizza",
    "rating": 9,
    "_geo": {
      "lat": 45.4777599, 
      "lng": 9.1967508
    }
  },
  {
    "id": 3,
    "name": "Artico Gelateria Tradizionale",
    "address": "Via Dogana, 1, 20123 Milan, Italy",
    "type": "ice cream",
    "rating": 10,
    "_geo": {
      "lat": 45.4632046,
      "lng": 9.1719421
    }
  }
]
```

It is also possible to use `_geoRadius` together with other filters. We can narrow down our previous search so it only includes pizzerias:

<CodeSamples id="geosearch_guide_filter_usage_2" />

The above command will only work if you have previously added `type` to `filterableAttributes`.

```json
[
  {
    "id": 1,
    "name": "Nàpiz' Milano",
    "address": "Viale Vittorio Veneto, 30, 20124, Milan, Italy",
    "type": "pizza",
    "rating": 9,
    "_geo": {
      "lat": 45.4777599, 
      "lng": 9.1967508
    }
  }
]
```

## Sorting results with `_geoPoint`

You can use `_geo` data to sort results based on their distance from a specific location.

### Configuration

Before using geosearch for sorting, you must add the `_geo` attribute to the `sortableAttributes` list:

<CodeSamples id="geosearch_guide_sort_settings_1" />

Note that Meilisearch will rebuild your index whenever you update `sortableAttributes`. Depending on the size of your dataset, this might take a considerable amount of time.

[You can read more about configuring `sortableAttributes` in our dedicated sorting guide.](/learn/advanced/sorting.md#configuring-meilisearch-for-sorting-at-search-time)

### Usage

Once you are sure that all your documents contain valid geolocation data and that you have added the `_geo` attribute to the `sortableAttributes` list, you can use the [`sort` search parameter](/reference/api/search.md#sort) along with `_geoPoint`, a special sorting function, to order results based on their distance from a geographic location.

```
_geoPoint(0.0, 0.0):asc
```

`_geoPoint` requires two floating point numbers indicating a location's latitude and longitude. You must also specify whether the sort should be ascending (`asc`) or descending (`desc`). Ascending sort will prioritize results closer to the specified location, while descending sort will put the most distant results first.

If either `lat` or `lng` is invalid or missing, Meilisearch will return an [`invalid_sort`](/reference/api/error_codes.md#invalid-sort) error. An error will also be thrown if you fail to indicate a sorting order.

[You can read more about sorting in our dedicated guide.](/learn/advanced/sorting.md#sorting-results-at-search-time)

::: warning
`_geo`, `_geoDistance`, and `_geoRadius` are not valid `sort` values. Trying to use any of them with the `sort` search parameter will result in an [`invalid_sort`](/reference/api/error_codes.md#invalid-sort) error.
:::

### Examples

The `_geoPoint` sorting function can be used like any other sorting rule. We can order documents based on how close they are to the Eiffel Tower:

<CodeSamples id="geosearch_guide_sort_usage_1" />

With our <a id="downloadRestaurants" href="/restaurants.json" download="restaurants.json">restaurants dataset</a>, the results look like this:

```json
[
  {
    "id": 2,
    "name": "Bouillon Pigalle",
    "address": "22 Bd de Clichy, 75018 Paris, France",
    "type": "french",
    "rating": 8,
    "_geo": {
      "lat": 48.8826517, 
      "lng": 2.3352748
    }
  },
  {
    "id": 3,
    "name": "Artico Gelateria Tradizionale",
    "address": "Via Dogana, 1, 20123 Milan, Italy",
    "type": "ice cream",
    "rating": 10,
    "_geo": {
      "lat": 45.4632046,
      "lng": 9.1719421
    }
  },
  {
    "id": 1,
    "name": "Nàpiz' Milano",
    "address": "Viale Vittorio Veneto, 30, 20124, Milan, Italy",
    "type": "pizza",
    "rating": 9,
    "_geo": {
      "lat": 45.4777599, 
      "lng": 9.1967508
    }
  }
]
```

`_geoPoint` also works when used together with other sorting rules. We can sort restaurants based on their proximity to the Eiffel Tower and their rating:

<CodeSamples id="geosearch_guide_sort_usage_2" />

The above command will only work if you have previously added `rating` to `sortableAttributes`.

```json
[
  {
    "id": 2,
    "name": "Bouillon Pigalle",
    "address": "22 Bd de Clichy, 75018 Paris, France",
    "type": "french",
    "rating": 8,
    "_geo": {
      "lat": 48.8826517, 
      "lng": 2.3352748
    }
  },
  {
    "id": 3,
    "name": "Artico Gelateria Tradizionale",
    "address": "Via Dogana, 1, 20123 Milan, Italy",
    "type": "ice cream",
    "rating": 10,
    "_geo": {
      "lat": 45.4632046,
      "lng": 9.1719421
    }
  },
  {
    "id": 1,
    "name": "Nàpiz' Milano",
    "address": "Viale Vittorio Veneto, 30, 20124, Milan, Italy",
    "type": "pizza",
    "rating": 9,
    "_geo": {
      "lat": 45.4777599, 
      "lng": 9.1967508
    }
  }
]
```

### Ranking rules

By default, Meilisearch emphasizes relevant sorting over exhaustive sorting. This means our engine first finds the most relevant results and only then orders matches based on values given to the `sort` search parameter. As a result, sorting with `_geoPoint` will rarely be the most important factor in deciding which results users see first. More often, it will be a tie-breaker between results that are considered equally relevant to the given search query.

Since `_geoPoint` is part of the `sort` search parameter, its weight when ranking results is controlled by the position of the `"sort"` rule in the `rankingRules` array.

[You can read more about the `"sort"` ranking rule and how to customize it in our dedicated sorting guide.](/learn/advanced/sorting.md#sorting-and-custom-ranking-rules)

## Finding the distance between a document and a `_geoPoint`

When using `_geoPoint`, all returned documents will contain one extra field: `_geoDistance`. As its name indicates, `_geoDistance` contains the distance in meters between the specified `_geoPoint` and a document's `_geo` data:

```json
[
  {
    "id": 1,
    "name": "Nàpiz' Milano",
    "address": "Viale Vittorio Veneto, 30, 20124, Milan, Italy",
    "type": "pizza",
    "rating": 9,
    "_geo": {
      "lat": 45.4777599, 
      "lng": 9.1967508
    },
    "_geoDistance": 1532
  }
]
```

::: warning
Using `_geoRadius` filter will not cause results to include `_geoDistance`.

`_geoDistance` will only be computed in a returned document if the query uses `_geoPoint` and the `sort` search parameter.
:::
