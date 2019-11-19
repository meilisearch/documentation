# Stats

## Get stat of an index

<RouteHighlighter method="GET" route="/stats/:index"/>

Get stats of an index.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The index UID |

### Example

```bash
curl \
  --location \
  --request GET 'http://localhost:8080/stats/movies' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

```json
{
  "numberOfDocuments": 19654,
  "isIndexing": false,
  "lastUpdate": "2019-11-15T11:15:22.092896Z",
  "fieldsFrequency": {
    "poster": 19654,
    "release_date": 19654,
    "title": 19654,
    "id": 19654,
    "overview": 19654
  }
}
```



## Get stats of all indexes

<RouteHighlighter method="GET" route="/stats"/>

Get stats of all indexes.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |


### Example

```bash
curl \
  --location \
  --request GET 'http://localhost:8080/stats' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

```json
{
  "databaseSize": 447819776,
  "indexes": {
    "movies": {
      "numberOfDocuments": 19654,
      "isIndexing": false,
      "lastUpdate": "2019-11-15T11:15:22.092896Z",
      "fieldsFrequency": {
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
      "lastUpdate": "2019-11-15T17:17:21.235357Z",
      "fieldsFrequency": {
        "overview": 19654,
        "id": 19654,
        "title": 19654
      }
    }
  }
}
```