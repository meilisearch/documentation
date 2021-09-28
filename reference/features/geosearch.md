# Geosearch

MeiliSearch allows you to filter and sort results based on their location. This can be useful when your users only want results within a specific geographic location or when searching for the results closest to their location.

## Preparing documents to use with geosearch

In order to start using geosearch, you must make sure that all documents in your index contain a reserved `_geo` attribute. 

If your data is in a format like JSON or NDJSON, `_geo` must be an object containing your documents coordinates:

```json
[
  {
    "id": 1,
    "name": "Nàpiz' Milano",
    "_geo": {
      "lat": 45.4777599, 
      "lng": 9.1967508
    }
  }
]
```

If your data is in a format like CSV, the file header must have a `_geo` column containing each document's latitude and longitude separated by a comma:

```csv
"id","name","_geo"
"1","Nàpiz Milano","45.4777599,9.1967508"
```

[text on error messages]

[New `invalid_geo_field` error]

[ if `_geo` exists, it must follow the expected format. If `_geo` does not follow the format, the update will fail]


## Configuring geosearch



## Using geosearch to look for results within an area

### configuration

[To use geosearch as a filter, users must add geo to filterableattributes]

[code sample update filterableattributes setting]

[read more on filtering in our dedicated guide]

### usage

[
Extends `filter` search parameter: `filter` now accepts `_geoRadius` filter rule

Using `_geoRadius` only returns results within the specified distance from the specified point. No results outside that radius should be returned
requires `_geo` to be added to `filterableAttributes`

`_geoRadius` requires 3 parameters: `lat`, `lng`, and `distance_in_meters`

`_geoRadius` is used like any other filter: `filter: ["_geoRadius(48.862725, 2.287592, 2000)"]`

`_geoRadius` can be used in combination with other filters: `["brand = Ferrari", "_geoRadius(48.862725, 2.287592, 2000)"]`

`_geo`, `_geoDistance`, and `_geoPoint` are invalid filter values
]

### example

[code sample]

## Using geosearch to sort results according to distance

### configuration

[To use geosearch for sorting, users must add geo to sortableattributes]

[code sample update sortableattributes setting]

[read more on sorting in our dedicated guide]

### usage

[
- Extends `sort` search parameter: `sort` now accepts `_geoPoint` sorting function
- Using `_geoPoint` will not filter results. Instead, it will promote results closer to or further way from the specified location
- `asc` for increasing distance from the point (meaning, closer results rank first) and `desc` for decreasing distance (meaning, results further away rank first)?
- requires `_geo` to be added to `sortableAttributes`
- geosearch ranking is embedded within the `sort` ranking rule. The weight of `_geo` within the `sort` (i.e. when used together with other sortable attributes) is decided by the position of `_geoPoint` in the list given to the `sort` search parameter
- `_geoPoint` requires 2 parameters: `lat` and `lng`
- `_geoPoint` is used like any other sort expression and requires a sorting order: `"sort": "_geoPoint(0.0, 0.0):asc"`
- `_geoPoint` can be used in combination with regular attributes
]

### example

[code sample]