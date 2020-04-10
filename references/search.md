# Search

## Search in an index

<RouteHighlighter method="GET" route="/indexes/:index_uid/search"/>

Search for documents matching a specific query in the given index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Query Parameters

| Query Parameter           | Description                                                                                     | Default Value |
| ------------------------- | ----------------------------------------------------------------------------------------------- | :-----------: |
| **q**                     | Query string \_(mandatory)                                                                      |               |
| **offset**                | Number of documents to skip                                                                     |      `0`      |
| **limit**                 | Maximum number of documents returned                                                            |     `20`      |
| **attributesToRetrieve**  | Attributes to display in the returned documents                                                 |      `*`      |
| **attributesToCrop**      | Attributes whose values have to be cropped                                                      |    `none`     |
| **cropLength**            | Length used to crop field values                                                                |     `200`     |
| **attributesToHighlight** | Attributes whose values will contain highlighted matching terms                                 |    `none`     |
| **filters**               | Filter queries by an attribute value                                                            |    `none`     |
| **matches**               | Defines whether an object that contains information about the matches should be returned or not |    `false`    |

> `filters` accept a query string. You can find about the filter syntax on [our dedicated page](/guides/advanced_guides/filtering).
> `cropLength` is automatically rounded to match word boundaries.

### Example

```bash
$ curl \
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
