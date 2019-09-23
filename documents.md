# Documents

Documents are objects composed of fields containing any data, a field is composed of an attribute **and** its associated data.
This object form is used by most of the Meili API endpoints.

::: tip
Documents identifiers are always converted into strings and only strings and integers are valid identifiers.
It means that it is forbidden to use arrays or objects as identifier for example.
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
It is used by Meili to know how to handle documents like which fields to display and which fields to index.

- **Indexed** attributes are used by the search engine.
- **Displayed** attributes will be shown when a document is returned.

::: tip
By default the Meili dashboard infers the schema from the **first** document sent.
:::

::: danger
Documents fields which do not correspond to the schema fields are ignored.
The only mandatory document field is the **identifier**.
:::

If you upload a file via the dashboard the schema is infered this way:
  - the order of the first document fields is the order of the schema fields
  - the identifier is the first field containing "id" (case insensitive)
  - every field is indexed and displayed

::: tip
The order of the schema fields determines the precedence:
a field which is declared before another one is more important.
:::

```json
{
  "id": ["identifier", "indexed", "displayed"],
  "title": ["indexed", "displayed"],
  "description": ["indexed", "displayed"],
  "type": ["indexed", "displayed"]
}
```

In this schema example we can see that every field is indexed and displayed.
This is the typical schema that would be infered by uploading the previous document via the dashboard.

We can also deduct that the "id" attribute is more important than the "title", "description" and "type".
Which means that if you search for something that matches in the "description" of the document _A_ and in the "title" of the document _B_,
the document _B_ will be considered better than the document _A_. You can read more about these rules [in the search section][1].

[1]: /search.md#ranking-rules





## Get one document

<RouteHighlighter method="GET" route="/indexes/:index/documents/:identifier"/>

Get one document using its unique identifier.

#### Headers

| Header              | Value         |
|---------------------|---------------|
| **X-Meili-API-Key** | `$API_KEY`    |
| **Accept-encoding** | gzip, deflate |

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The name of the index |
| **identifier**    | [The unique identifier of the document](/documents.md#schemas) |

### Example

```bash
curl \
  --location \
  --request GET 'https://localhost:8080/indexes/movie/documents/25684' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

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
This route is a non-optimized route, it can be a little bit slow to answer.
:::

#### Headers

| Header              | Value            |
|---------------------|------------------|
| **X-Meili-API-Key** | `$API_KEY`       |
| **Content-Type**    | application/json |
| **Accept-encoding** | gzip, deflate    |

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The name of the index |

#### Query Parameters

| Query Parameter           | Description                          | Default Value |
|---------------------------|--------------------------------------|:-------------:|
| **offset**                | number of documents to skip          | 0             |
| **limit**                 | number of documents to take          | 20            |
| **attributesToRetrieve**  | document attributes to show          | *             |

### Example

```bash
curl \
  --location \
  --request GET 'https://localhost:8080/indexes/movie/documents?limit=5' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `200 Ok`

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

Insert a list of documents or update them if they already exist based on [their unique identifiers](/documents.md#schemas).

The update id returned by this function can be sent to the [get update status route](/indexes.md#get-an-update-status) to retrieve informations about its advancement.

#### Headers

| Header              | Value            |
|---------------------|------------------|
| **X-Meili-API-Key** | `$API_KEY`       |
| **Content-Type**    | application/json |
| **Accept-encoding** | gzip, deflate    |

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The name of the index |

#### Body

The body is composed of a **Json array** of documents composed of fields corresponding to the index schema.
You can [read more about fields and schemas](/documents.md#schemas).

::: warning
Documents fields which are not known to the index schema will be ignored
:::

```json
[
  {
    "id": 287947,
    "title": "Shazam",
    "poster": "https://image.tmdb.org/t/p/w1280/xnopI5Xtky18MPhK40cZAGAOVeV.jpg",
    "overview": "A boy is given the ability to become an adult superhero in times of need with a single magic word.",
    "release_date": "2019-03-23"
  }
]
```

### Example

```bash
curl \
  --location \
  --request POST 'https://localhost:8080/indexes/movie/documents' \
  --header 'Content-Type: application/json' \
  --header "X-Meili-API-Key: $API_KEY" \
  --data '[{
      "id": 287947,
      "title": "Shazam",
      "poster": "https://image.tmdb.org/t/p/w1280/xnopI5Xtky18MPhK40cZAGAOVeV.jpg",
      "overview": "A boy is given the ability to become an adult superhero in times of need with a single magic word.",
      "release_date": "2019-03-23"
    }]'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 3
}
```





## Batch write documents

<RouteHighlighter method="POST" route="/indexes/:index/documents/batch"/>

Insert and Delete multiple documents in one request.

The update id returned by this function can be sent to the [get update status route](/indexes.md#get-an-update-status) to retrieve informations about its advancement.

#### Headers

| Header              | Value            |
|---------------------|------------------|
| **X-Meili-API-Key** | `$API_KEY`       |
| **Content-Type**    | application/json |
| **Accept-encoding** | gzip, deflate    |

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **index**         | The name of the index |

#### Body

The body must contain a **Json Object** containing an `insert` and a `delete` field:
  - the `insert` field expect the same body as the [Add or Update documents](#add-or-update-documents) route.
  - the `delete` field expect the same body as the [Delete multiple documents](#delete-multiple-documents) route.

::: warning
Unknown documents attributes will be ignored. You can [read more about that](/documents.md#schemas).
:::

```json
{
  "insert": [],
  "delete": []
}
```

### Example

```bash
curl \
  --location \
  --request POST 'https://localhost:8080/indexes/movie/documents' \
  --header 'Content-Type: application/json' \
  --header "X-Meili-API-Key: $API_KEY" \
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

#### Response: `202 Accepted`

```json
{
  "updateId": 12
}
```





## Clear all documents

<RouteHighlighter method="DELETE" route="/indexes/:index/documents"/>

Delete all documents in the specified index.

The update id returned by this function can be sent to the [get update status route](/indexes.md#get-an-update-status) to retrieve informations about its advancement.

#### Headers

| Header              | Value            |
|---------------------|------------------|
| **X-Meili-API-Key** | `$API_KEY`       |
| **Content-Type**    | application/json |

#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
| **index** | The name of the index |

### Example

```bash
curl \
  --location \
  --request DELETE 'https://localhost:8080/indexes/movie/documents' \
  --header "X-Meili-API-Key: $API_KEY" \
  --header 'Content-Type: application/json'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 37
}
```





## Delete one document

<RouteHighlighter method="DELETE" route="/indexes/:index/documents/:identifier"/>

Delete one document based on its unique identifier.<br/>
You can read more about [identifiers and schemas](/documents.md#schemas).

The update id returned by this function can be sent to the [get update status route](/indexes.md#get-an-update-status) to retrieve informations about its advancement.

#### Headers

| Header              | Value      |
|---------------------|------------|
| **X-Meili-API-Key** | `$API_KEY` |

#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
| **index** | The name of the index |

### Example

```bash
  curl \
  --location \
  --request DELETE 'https://localhost:8080/indexes/movie/documents/25684' \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response: `202 Accepted`

```json
{
  "updateId": 27
}
```




## Delete multiple documents

<RouteHighlighter method="POST" route="/indexes/:index/documents/delete"/>

Delete a selection of documents based on array of identifiers.<br/>
You can read more about [identifiers and schemas](/documents.md#schemas).

The update id returned by this function can be sent to the [get update status route](/indexes.md#get-an-update-status) to retrieve informations about its advancement.

#### Headers

| Header              | Value              |
|---------------------|--------------------|
| **X-Meili-API-Key** | `$API_KEY`         |
| **Content-Type**    | `application/json` |
| **Accept-encoding** | `gzip, deflate`    |

#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
| **index** | The name of the index |

#### Body

The body must be a **Json Array** with the unique identifiers of the documents to delete.

```json
[23488, 153738, 437035, 363869]
```

### Example

```bash
  curl \
  --location \
  --request POST 'https://localhost:8080/indexes/movie' \
  --header "X-Meili-API-Key: $API_KEY" \
  --header 'Content-Type: application/json' \
  --data '[
      23488,
      153738,
      437035,
      363869
    ]'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 127
}
```
