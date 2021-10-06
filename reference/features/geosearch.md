# Geosearch

MeiliSearch allows you to filter and sort results based on their geographic location. This can be useful when you only want results within a specific area or when sorting results based on their distance from a specific location.

## Preparing documents for location-based search

In order to start filtering and sorting matches based on their geographic location, you must make sure that all documents in your index contain a valid `_geo` field.

`_geo` is a reserved field. If you include it in your documents, MeiliSearch expects its value to conform to a specific format.

When using JSON and NDJSON, `_geo` must contain an object with two keys: `lat` and `lng`. Both must contain a floating point number indicating, respectively, latitude and longitude:

```json
{
  …
  "_geo": {
    "lat": 0.0,
    "lng": 0.0
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
    "address": "Viale Vittorio Veneto, 30, 20124, Milano, Italia",
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
Trying to index a dataset with one or more documents containing badly formatted `_geo` values will cause MeiliSearch to throw an [`invalid_geo_field`](/errors) error. In this case, the update will fail and no documents will be added or modified.
:::

### Using `_geo` with CSV

If your dataset is formatted as CSV, the file header must have a `_geo` column.  Each row in the dataset must then contain a column with a comma-separated string indicating latitude and longitude:

```csv
"id:number", "name:string", "address:string", "type:string", "rating:number", "_geo:string"
"1", "Nàpiz Milano", "Viale Vittorio Veneto, 30, 20124, Milano, Italia","pizzeria", 9, "45.4777599,9.1967508"
"2", "Bouillon Pigalle", "22 Bd de Clichy, 75018 Paris, France", "french", 8, "48.8826517,2.3352748"
"3", "Artico Gelateria Tradizionale", "Via Dogana, 1, 20123 Milan, Italy", "ice cream", 10, "48.8826517,2.3352748"
```

## Filtering results with `_geoRadius`

You can use `_geo` data to filter queries and make sure you only receive results located within a certain geographic area.

### Configuration

In order to filter results based on their location, you must add the `_geo` attribute to the `filterableAttributes` list:

<CodeSamples id="geosearch_guide_filter_settings_1" />

Note that MeiliSearch will rebuild your index whenever you update `filterableAttributes`. Depending on the size of your dataset, this might take a considerable amount of time.

[You can read more about configuring `filterableAttributes` in our dedicated filtering guide.](/reference/features/filtering_and_faceted_search.md#configuring-filters)

### Usage

Once you made sure all your documents contain valid geolocation data and added the `_geo` attribute to the `filterableAttributes` list, you can use [`filter`](/reference/features/search_parameters.md#filter) and `_geoRadius` to ensure MeiliSearch only returns results located within a specific geographic area.

`_geoRadius` establishes a circular area based on a central point and a radius. Results beyond this area will be excluded from your search. This filter rule requires three parameters: `lat`, `lng` and `distance_in_meters`.

```
_geoRadius(lat, lng, distance_in_meters)
```

`lat` and `lng` must be floating point numbers indicating a geographic position. `distance_in_meters` must be an integer indicating the radius covered by the `_geoRadius` filter.

`_geoRadius` must always be used with the [`filter` search parameter](/reference/features/search_parameters.md#filter). The following filter expression would only include results within 1km of the Eiffel Tower:

```json
{
  "filter": "_geoRadius(48.8583701, 2.2922926, 1000)"
}
```

If any of `lat`, `lng`, or `distance_in_meters` are invalid or missing, MeiliSearch will return an [`invalid_filter`](/errors) error.

[You can read more about using `filter` in our dedicated guide.](/reference/features/filtering_and_faceted_search.md#using-filters)

::: warning
`_geo`, `_geoDistance`, and `_geoPoint` are not valid filter rules. Trying to use any of them with the `filter` search parameter will result in an [`invalid_filter`](/errors) error.
:::

### Examples

`_geoRadius` works like any other filter rule. We can search for places to eat near the centre of Milan:

<CodeSamples id="geosearch_guide_filter_usage_1" />

Using our example dataset, returned results look like this:

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

Note that MeiliSearch will rebuild your index whenever you update `sortableAttributes`. Depending on the size of your dataset, this might take a considerable amount of time.

[You can read more about configuring `sortableAttributes` in our dedicated sorting guide.](/reference/features/sorting.md#configuring-meilisearch-for-sorting-at-search-time)

### Usage

Once you made sure all your documents contain valid geolocation data and added the `_geo` attribute to the `sortableAttributes` list, you can use `_geoPoint` and [`sort`](/reference/features/search_parameters.md#sort) to order results based on their distance from a geographic location.

`_geoPoint` is a sorting function that requires two floating point numbers indicating a location's latitude and longitude. You must also specify whether the sort should be ascending (`asc`) or descending (`desc`):

```
_geoPoint(0.0, 0.0):asc
```

Ascending sort will prioritize results closer to the specified location. Conversely, descending sort will bring items more distant from the specified location to the top of the results.

The following sorting rule orders results according to how close they are to the Eiffel Tower:

```json
{
  "sort": ["_geoPoint(48.8583701, 2.2922926):asc"]
}
```

If either `lat` or `lng` is invalid or missing, MeiliSearch will return an [`invalid_sort`](/errors) error. An error will also be thrown if you fail to indicate a sorting order.

[You can read more about sorting in our dedicated guide.](/reference/features/sorting.md#sorting-results-at-search-time)

::: warning
`_geo`, `_geoDistance`, and `_geoRadius` are not valid `sort` values. Trying to use any of them with the `sort` search parameter will result in an [`invalid_sort`](/errors) error.
:::

### Examples

The `_geoPoint` sorting function can be used like any other sorting rule. We can order documents based on how close they are to the Eiffel Tower:

<CodeSamples id="geosearch_guide_sort_usage_1" />

With our example dataset, the results look like this:

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

`_geoPoint` also works when used together with other sorting rules. We can sort restaurants based on proximity to the Eiffel Tower and good ratings:

<CodeSamples id="geosearch_guide_sort_usage_2" />

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

By default, MeiliSearch emphasizes relevant sorting over exhaustive sorting. This means our engine first finds the most relevant results and only then orders matches based on values given to the `sort` search parameter.

This means that sorting with `_geoPoint` will often be a tie-breaker and not the most important factor when deciding which results a user will see first.

Since `_geoPoint` is used with the `sort` search parameter, its weight when ranking results is controlled by the position of `"sort"` ranking rule.

[You can read more about the `"sort"` ranking rule and how to customize it on our dedicated sorting guide.](/reference/features/sorting.md#sorting-and-custom-ranking-rules)

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
