# Search

## Search in an index

<RouteHighlighter method="GET" route="/indexes/:uid/search"/>

Search for documents matching a specific query in the given index.


#### Path Variables

| Variable  | Description   |
|-----------|---------------|
| **index** | The index UID |

#### Query Parameters

| Query Parameter           | Description                                        | Default Value |
|---------------------------|----------------------------------------------------|:-------------:|
| **q**                     | query string _(mandatory)_                         |               |
| **offset**                | number of documents to skip                        | 0             |
| **limit**                 | number of documents to take                        | 20            |
| **attributesToRetrieve**  | document attributes to show                        | *             |
| **attributesToCrop**      | which attributes to crop                           | none          |
| **cropLength**            | limit length at which to crop specified attributes | 200           |
| **attributesToHighlight** | which attributes to highlight                      | none          |
| **filters**               |  attribute with an exact match                     | none          |
| **timeout_ms**            | maximum response time                              | 30 ms         |
| **matches**               | whether to return the raw matches or not           | false         |

### Example

```bash
curl \
  -X GET 'http://localhost:7700/indexes/4eb345y7/search?q=american%20ninja%205'
```

#### Response: `200 Ok`

```json
{
  "hits": [
    {
      "id": "25684",
      "title": "American Ninja 5",
      "poster": "https://image.tmdb.org/t/p/w1280/iuAQVI4mvjI83wnirpD8GVNRVuY.jpg",
      "overview": "When a scientists daughter is kidnapped, American Ninja, attempts to find her, but this time he teams up with a youngster he has trained in the ways of the ninja.",
      "release_date": "1993-01-01"
    },
    {
      "id": "25682",
      "title": "American Ninja 3: Blood Hunt",
      "poster": "https://image.tmdb.org/t/p/w1280/c7oNrk8bRg0BlmtvidhVD8ivPYT.jpg",
      "overview": "Jackson is back, and now he has a new partner, karate champion Sean, as they must face a deadly terrorist known as 'The Cobra', who has infected Sean with a virus. Sean and Jackson have no choice but to fight the Cobra and his bands of ninjas.",
      "release_date": "1989-02-24"
    },
    ...
  ],
  "offset": 0,
  "limit": 20,
  "processingTimeMs": 32,
  "query": "american ninja 5"
}
```
