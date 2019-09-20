# Documents

Documents are objects composed of fields containing any data, a field is composed of an attribute **and** its associated data.
This object form is used by most of the Meili API endpoints.

::: tip
Documents identifiers are always converted into strings and only strings and integers are valid identifiers.
:::

```json
{
  "id": 3205,
  "title": "Interstellar",
  "description": "This is a great movie.",
  "type": ["sci fi", "space"]
}
```

In this document example, **attributes** are `"id"`, `"title"`, `"description"` and `"type"`.</br>
The **fields** are the combination of attributes and data (i.e. `"title": "Interstellar"`).

#### Schemas

A schema is a representation of the documents attributes.
It is used by Meili to know how to handle documents like which fields to store and which fields to index.

- **Indexed** attributes are used by the search system.
- **Stored** attributes will be returned by Meili when a document is returned.

::: tip
By default the Meili dashboard infer the schema from the **first** document sent.
:::

::: danger
Document fields which do not correspond to the schema fields are ignored.
The only mandatory document field is the **identifier**.
:::

If you upload a file via the dashboard the schema is infered this way:
  - the order of the first document fields is the order of the schema fields
  - the identifier is the first field containing "id" (case insensitive)
  - every field is indexed and stored

::: tip
The order of the schema fields determine the precedence:
a field which is declared before another one is more important.
:::

```json
{
  "id": ["identifier", "indexed", "stored"],
  "title": ["indexed", "stored"],
  "description": ["indexed", "stored"],
  "type": ["indexed", "stored"]
}
```

In this schema example we can see that every field is indexed and stored.
This is the typical schema that would be infered by uploading the previous document via the dashboard.

We can also deduct that the "id" attribute is more important than the "title", "description" and "type".
Which means that if you search for something that matches in the "description" of the document _A_ and in the "title" of the document _B_,
the document _B_ will be considered better than the document _A_. You can read more about these rules [in the search section][1].

[1]: /search#ranking-rules


## Get one document

<RouteHighlighter method="GET" route="/indexes/:index/documents/:identifier"/>

Get one document using its specific identifier.

| Header              | Value          |                        |
|---------------------|----------------|------------------------|
| **X-Meili-API-Key** | `$API_KEY`     | _ACL: `DocumentsRead`_ |
| **Accept-encoding** | gzip, deflate  |                        |

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The name of the index |
| **identifier**    | [The unique identifier of the document](/indexes#schema_definition) |

#### Example Query
```bash
curl \
  --location \
  --request GET "localhost:8080/indexes/movie/documents/25684" \
  --header "X-Meili-API-Key: $API_KEY"
```

##### Response `200 Ok`
```json
{
  "id": 25684,
  "title": "American Ninja 5",
  "poster": "https://image.tmdb.org/t/p/w1280/iuAQVI4mvjI83wnirpD8GVNRVuY.jpg",
  "overview": "When a scientists daughter is kidnapped, American Ninja, attempts to find her, but this time he teams up with a youngster he has trained in the ways of the ninja.",
  "release_date": "1993-01-01"
}
```





## Browse documents

<RouteHighlighter method="GET" route="/indexes/:index/documents"/>

Get the documents in an unordered way.

::: danger
non-optimized route
:::

#### Headers

||||
|---|---|---|
| **X-Meili-API-Key** | API_KEY | <em> ACL:`DocumentsRead` </em> |
| **Content-Type**  |  application/json | |

#### Path Variables
|||
|---|---|
| **index** | The name of the index  |

#### Query Parameters
|**Key**| **value description** | **default** |
|---|---|---|
| **offset** | number to offset  | 0 |
| **length** | number of elements to get back  | 20 |
| **attributesToRetrieve** | attributes of documents to retrieve  | * |

#### Example
```bash
curl \
  --location \
  --request GET "localhost:8080/indexes/movie/documents?length=5" \
  --header 'X-Meili-API-Key: API_KEY'
```

<span class="exemple_child">**response**: `200` Ok</span>
```json
[
  {
    "id": 25684,
    "release_date": "1993-01-01",
    "poster": "https://image.tmdb.org/t/p/w1280/iuAQVI4mvjI83wnirpD8GVNRVuY.jpg","title": "American Ninja 5",
    "overview": "When a scientists daughter is kidnapped, American Ninja, attempts to find her, but this time he teams up with a youngster he has trained in the ways of the ninja."
  },
  {
    "id": 468219,
    "title": "Dead in a Week (Or Your Money Back)",
    "release_date": "2018-09-12",
    "poster": "https://image.tmdb.org/t/p/w1280/f4ANVEuEaGy2oP5M0Y2P1dwxUNn.jpg",
    "overview": "William has failed to kill himself so many times that he outsources his suicide to aging assassin Leslie. But with the contract signed and death assured within a week (or his money back), William suddenly discovers reasons to live... However Leslie is under pressure from his boss to make sure the contract is completed."
  }
]
```



## Add or Update documents

<RouteHighlighter method="POST" route="/indexes/:index/documents"/>

Add a list of document(s) or update them if their identifier already exist.

#### Headers
||||
|---|---|---|
| **X-Meili-API-Key** | API_KEY  | <em> ACL:`DocumentsWrite` </em> |
| **Content-Type** | `application/json`  | |
| **Accept-encoding** | `gzip, deflate` ||

#### Path Variables
|||
|---|---|
| **index** | The name of the index  |

#### Body
**Json array** of documents containing attributes from the given `index`. [See indexes documentation](/indexes#summary)

```json
[
  {
    "id": 287947,
    "title": "Shazam",
    "poster": "https://image.tmdb.org/t/p/w1280/xnopI5Xtky18MPhK40cZAGAOVeV.jpg",
    "overview": "A boy is given the ability to become an adult superhero in times of need with a single magic word.",
    "release_date": "2019-03-23"
  },
]
```
> Unkown attributes will be ignored


#### Example
```bash
curl \
  --location \
  --request POST "http://localhost:8080/indexes/movie/documents" \
  --header "Content-Type: application/json" \
  --data '[{
      "id": 287947,
      "title": "Shazam",
      "poster": "https://image.tmdb.org/t/p/w1280/xnopI5Xtky18MPhK40cZAGAOVeV.jpg",
      "overview": "A boy is given the ability to become an adult superhero in times of need with a single magic word.",
      "release_date": "2019-03-23"
    }]'
```

<span class="exemple_child">**response**: `201` Created</span>

```json
{
  "success": ["287947"]
}
```

## Batch write documents

<RouteHighlighter method="POST" route="/indexes/:index/documents/batch"/>

Update multiple documents at once.

#### Headers
||||
|---|---|---|
| **X-Meili-API-Key** | API_KEY  | <em> ACL:`indexesWrite` </em> |
| **Content-Type** | `application/json`  | |

#### Path Variables
|||
|---|---|
| **index** | The name of the index  |

#### Body
Batch write `insert` and `delete` actions. **Insert** expect same input as [Add or Update documents](#create-documents). **Delete** expect same input as [Delete multiple documents](#delete-documents)

```json
{
  "insert": [],
  "delete": []
}
```

::: warning
Unkown attributes in insert documents will be ignored
:::


#### Example
```bash
curl \
  --location \
  --request POST "http://localhost:8080/indexes/movie/documents" \
  --header "X-Meili-API-Key: " \
  --header "Content-Type: application/json" \
  --data '{
      "insert": [
        {
          "id": 287947,
          "title": "Shazam!",
          "poster": "https://image.tmdb.org/t/p/w1280/xnopI5Xtky18MPhK40cZAGAOVeV.jpg",
          "overview": "A boy is given the ability to become an adult superhero in times of need with a single magic word.",
          "release_date": "2019-03-23"
        }
      ],
      "delete": [
        522681
      ]
    }'
```

<span class="exemple_child">**response**: `201` Created</span>

```json
{
  "inserted": ["287947"],
  "deleted": ["522681"]
}
```
## Clear all documents

<RouteHighlighter method="POST" route="/indexes/:index/documents"/>

Delete all documents.

#### Headers
||||
|---|---|---|
| **X-Meili-API-Key** | API_KEY  | <em> ACL:`DocumentsWrite` </em> |

#### Path Variables
|||
|---|---|
| **index** | The name of the index  |

::: danger
This route will disapear in the next MeiliDB beta version. It does not comply to RESTfull rules.
:::

#### Example
```bash
curl \
  --location \
  --request POST "http://localhost:8080/indexes/movie/documents/clear" \
  --header "X-Meili-API-Key: $API_KEY" \
  --header "Content-Type: application/json"
```

<span class="exemple_child">**response**: `205` Reset Content</span>

> No response body




## Delete one document

<RouteHighlighter method="DELETE" route="/indexes/:index/documents/:identifier"/>

Delete one document. Based on document identifier. [See identifier documentation](/indexes#schema_definition).

#### Headers
||||
|---|---|---|
| **X-Meili-API-Key** | API_KEY  | <em> ACL:`DocumentsWrite` </em> |


#### Path Variables
|||
|---|---|
| **index** | The name of the index  |

#### Body
Array of identifiers.
```json
[1, 2, ...]
```

#### Example
```bash
  curl \
  --location \
  --request DELETE "localhost:8080/indexes/movie" \
  --header "X-Meili-API-Key: $API_KEY"
  --data '[
      23488,
      153738,
      437035,
      363869
    ]'
```
<span class="exemple_child">**response**: `202` Accepted</span>

::: warning
no response body
:::


## Delete multiple documents

<RouteHighlighter method="DELETE" route="/indexes/:index/documents"/>

Delete selection of documents. Based on array of identifiers. [See identifier documentation](/indexes#schema_definition).

#### Headers
||||
|---|---|---|
| **X-Meili-API-Key** | `$API_KEY` | <em> ACL:`DocumentsWrite` </em> |
| **Content-Type** | `application/json` | |
| **Accept-encoding** | `gzip, deflate` | |

#### Path Variables
|||
|---|---|
| **index** | The name of the index |

#### Body
Array of identifiers.
```json
[1, 2, ...]
```

#### Example
```bash
  curl \
  --location \
  --request DELETE "http://localhost:8080/indexes/movie" \
  --header "X-Meili-API-Key: $API_KEY"
  --data '[
      23488,
      153738,
      437035,
      363869
    ]'
```
<span class="exemple_child">**response**: `202` Accepted</span>

::: warning
no response body
:::
