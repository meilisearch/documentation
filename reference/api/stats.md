# Stats

The `/stats` route gives extended information and metrics about indexes and the Meilisearch database.

## Stats object

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
    "books": {
      "numberOfDocuments": 5,
      "isIndexing": false,
      "fieldDistribution": {
        "id": 5,
        "title": 5,
        "author": 5,
        "price": 5, 
        "genres": 5
      }
    }
  }
}
```

| Name                    | Type    | Description                                                                                                                                                                            |
| :---------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`databaseSize`**      | Integer | Size of the database in bytes                                                                                                                                                          |
| **`lastUpdate`**        | String  | When the last update was made to the database in the [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format                                                                           |
| **`indexes`**           | Object  | Object containing the statistics for each index found in the database                                                                                                                |
| **`numberOfDocuments`** | Integer | Total number of documents in an index                                                                                                                                                  |
| **`isIndexing`**        | Boolean | If `true`, the index is still processing documents and attempts to search will result in undefined behavior. If `false`, the index has finished processing and you can start searching |
| **`fieldDistribution`** | Object  | Shows every field in the index along with the total number of documents containing that field in said index                                        |

::: note
`fieldDistribution` is not impacted by `searchableAttributes` or `displayedAttributes`. Even if a field is not displayed or searchable, it will still appear in the `fieldDistribution` object.  
:::

## Get stats of all indexes

<RouteHighlighter method="GET" route="/stats"/>

Get stats of all indexes.

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
    "books": {
      "numberOfDocuments": 5,
      "isIndexing": false,
      "fieldDistribution": {
        "id": 5,
        "title": 5,
        "author": 5,
        "price": 5, 
        "genres": 5
      }
    }
  }
}
```

## Get stats of an index

<RouteHighlighter method="GET" route="/indexes/{index_uid}/stats"/>

Get stats of an index.

### Path parameters

| Name              | Type   | Description                                                               |
| :---------------- | :----- | :------------------------------------------------------------------------ |
| **`index_uid`** * | String | [`uid`](/learn/core_concepts/indexes.md#index-uid) of the requested index |

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
