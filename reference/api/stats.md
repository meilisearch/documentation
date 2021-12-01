# Stats

The `/stats` route gives extended information and metrics about indexes and the MeiliSearch database.

## Fields returned

### Get stats of an index

<RouteHighlighter method="GET" route="/indexes/:index_uid/stats"/>

Get stats of an index. It returns the following fields:

#### `numberOfDocuments`

The `numberOfDocuments` field shows the total number of documents in an index.

#### `isIndexing`

The `isIndexing` field returns a Boolean. If `true`, the index is still processing documents and attempts to search will result in undefined behavior. If `false`, the index has finished processing and you can start searching.

#### `fieldDistribution`

The `fieldDistribution` object shows every field in the individual index or the entire database along with the total number of documents in the index that contain that field.

`fieldDistribution` is not impacted by `searchableAttributes` or `displayedAttributes`. Meaning, **if one of the fields is not displayed or searchable, it will still be displayed in the `fieldDistribution` object.**  

#### Path variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

### Example

<CodeSamples id="get_index_stats_1" />

#### Response: `200 Ok`

```json
{
  "numberOfDocuments": 19654,
  "isIndexing": false,
  "fieldDistribution": {
    "poster": 19654,
    "release_date": 19654,
    "title": 19654,
    "id": 19654,
    "overview": 19654
  }
}
```

### Get stats of all indexes

<RouteHighlighter method="GET" route="/stats"/>

Get stats of all indexes. In addition to [all fields returned by `GET /indexes/:index_uid/stats`](#fields-returned), `GET /stats` returns the following instance-level fields:

#### `databaseSize`

The `databaseSize` field shows the size of the database in bytes.

#### `lastUpdate`

The `lastUpdate` field shows when the last update was made to the database in the ISO 8601 format.

### Example

<CodeSamples id="get_indexes_stats_1" />

#### Response: `200 Ok`

```json
{
  "databaseSize": 447819776,
  "lastUpdate": "2019-11-15T11:15:22.092896Z",
  "indexes": {
    "movies": {
      "numberOfDocuments": 19654,
      "isIndexing": false,
      "fieldDistribution": {
        "poster": 19654,
        "overview": 19654,
        "title": 19654,
        "id": 19654,
        "release_date": 19654
      }
    },
    "rangemovies": {
      "numberOfDocuments": 19654,
      "isIndexing": false,
      "fieldDistribution": {
        "overview": 19654,
        "id": 19654,
        "title": 19654
      }
    }
  }
}
```
