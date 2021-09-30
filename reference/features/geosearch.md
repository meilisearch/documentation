# Geosearch

MeiliSearch allows you to filter and sort results based on their location. This can be useful when your users only want results within a specific geographic location or when searching for the results closest to their location.

## Preparing documents to use with geosearch

In order to start using geosearch, you must make sure that all documents in your index contain a reserved `_geo` attribute.

Suppose you have a list of restaurants:

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

If you want to allow users to search results based on their location, each document must have a `_geo` attribute containing the restaurant's coordinates. `_geo` is a reserved attribute. This means that it is not a mandatory field, but if you include it in your documents MeiliSearch expects it to conform to a specific format:

```json
{
  …
  "_geo": {
    "lat": 0.0,
    "lng": 0.0
  }
}
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

Trying to index a dataset with one or more documents with badly formatted `_geo` values will cause MeiliSearch to throw an [`invalid_geo_field`](/errors) error. In this case, the update will fail and no documents will be added or modified.

### Using `_geo` with CSV

If your dataset is formatted as CSV, the file header must have a `_geo` column.  Each row in the dataset must then contain a column with latitude and longitude separated by a comma:

```csv
"id", "name", "address", "_geo"
"1", "Nàpiz Milano", "Viale Vittorio Veneto, 30, 20124, Milano, Italia","45.4777599,9.1967508"
"2", "Bouillon Pigalle", "22 Bd de Clichy, 75018 Paris, France","48.8826517,2.3352748"
```

## Using geosearch to filter results

You can use geosearch in combination with filters to make sure you only receive results located within a certain geographic area.

### Configuration

Before using geosearch for filtering, you must add the `_geo` attribute to the `filterableAttributes` list:

<CodeSamples id="geosearch_guide_filter_settings_1" />

Note that MeiliSearch will rebuild your index whenever you update `filterableAttributes`. Depending on the size of your dataset, this might take a considerable amount of time.

### Usage

Once you made sure all your documents contain valid geolocation data and added the `_geo` attribute to the `filterableAttributes` list, you can use the `_geoRadius` built-in filter rule in combination with the `filter` search parameter. Doing so will ensure MeiliSearch only returns results located within the specified geographic area.

`_geoRadius` is a special filter rule that requires three parameters:

```js
_geoRadius(lat, lng, distance_in_meters)
```

`lat` and `lng` must be float numbers, while `distance_in_meters` must be an integer. If any of the values are invalid or missing, MeiliSearch's API will return an `invalid_filter` error.

::: warning
`_geo`, `_geoDistance`, and `_geoPoint` are not valid filter values. Trying to use them with the `filter` search parameter will return an `invalid_filter` error.
:::

### Examples

The `_geoRadius` filter rule can be used like any other filter. We can search for places to eat near the centre of Milan:

<CodeSamples id="geosearch_guide_filter_usage_1" />

With our example dataset, the results look like this:

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

It is possible to use `_geoRadius` together with other filters. We can narrow down our previous search so it only includes pizzerias:

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

## Sorting results with geosearch

You can use geosearch to sort results according to how close or far they are from a specific location.

### Configuration

Before using geosearch for sorting, you must add the `_geo` attribute to the `sortableAttributes` list:

<CodeSamples id="geosearch_guide_sort_settings_1" />

Note that MeiliSearch will rebuild your index whenever you update `sortableAttributes`. Depending on the size of your dataset, this might take a considerable amount of time.

You can read more about configuring `sortableAttributes` in our dedicated sorting guide.

### Usage

Once you made sure all your documents contain valid geolocation data and added the `_geo` attribute to the `sortableAttributes` list, you can use the `_geoPoint` sorting function. Doing so will change which results your users will see first depending on how close or distant they are from the specified location.

`_geoPoint` indicates the location on which MeiliSearch will sort results. It requires two parameters: `lat` and `lng`. Both must be floating point numbers:

```js
_geoPoint(0.0, 0.0)
```

If either parameter is invalid or missing, MeiliSearch will return an `invalid_sort` error.

You must also indicate a sorting order, which can be either ascending (`asc`) or descending (`desc`):

```js
_geoPoint(0.0, 0.0):asc
```

Ascending sort will promote items closer to the specified location. Conversely, descending sort will promote items more distant to the specified location.

::: note
`_geoPoint` changes the order of returned search results, but does not influence the query in any other way. 

If you need to exclude results outside a certain geographic area, use the `geoRadius` filter rule.
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

`_geoPoint` also works when used together with other sorting rules. We can sort restaurants based on both how close they are to us and how well-rated they are: 

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

Sorting around a geographic location is included in the `"sort"` ranking rule.

By default, MeiliSearch emphasizes relevant sorting over exhaustive sorting. This our engine first finds the most relevant results and only then ranks matches based on the values given to the `sort` search parameter, such as the `_geoPoint` sorting function.

You can read more about the `"sort"` ranking rule and how to customize it on our dedicated sorting guide.

### `_geoDistance`

When using `_geoPoint`, all returned results will have one extra field: `_geoDistance`. This field contains the distance in meters between the specified `_geoPoint` and the document:

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
Using a `_geoRadius` filter will not cause results to include `_geoDistance`.

`_geoDistance` will only be computed and present in the results object if the query uses `_geoPoint` in the `sort` search parameter.
:::