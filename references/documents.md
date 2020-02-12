# Documents

## Get one document

<RouteHighlighter method="GET" route="/indexes/:uid/documents/:identifier"/>

Get one document using its unique identifier.


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/12345678/documents/25684'
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

## Get documents

<RouteHighlighter method="GET" route="/indexes/:uid/documents"/>

Get documents by batch.</br>
Using the query parameters `offset` and `limit`, you can browse through all your documents.

Documents are ordered in a specific way by MeiliSearch (the hash of the identifier).

#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID |

#### Query Parameters

| Query Parameter           | Description                          | Default Value |
|---------------------------|--------------------------------------|:-------------:|
| **offset**                | number of documents to skip          | 0             |
| **limit**                 | number of documents to take          | 20            |
| **attributesToRetrieve**  | document attributes to show          | *             |

### Example

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/12345678/documents?limit=2'
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

## Add and replace documents

<RouteHighlighter method="POST" route="/indexes/:uid/documents"/>

Add a list of documents or replace them if they already exist.

If you send an already existing document (same [identifier](/guides/main_concepts/documents.md#identifier)) **the whole old document**  will be override by the new document. Thus, removing any fields previously in the document not present in the new document.

For a partial update of the document see [add or update documents](/references/documents.md#add-and-update-documents).


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID |
| **identifier**    | [The unique identifier of the document](/guides/main_concepts/documents.md#identifier) |


If you want to set the **identifier** of your index through this route, it only has to be done **the first time you add documents** to the index. After which it will be ignored if given.

#### Body

The body is composed of a **JSON array** of documents. The fields of each document correspond to those in the index schema.
You can [read more about fields and schemas](/guides/main_concepts/indexes.md#schema-definition).

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
$ curl \
  -X POST 'http://localhost:7700/indexes/12345678/documents' \
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
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).

## Add and update documents

<RouteHighlighter method="PUT" route="/indexes/:uid/documents"/>

Add a list of documents or update them if they already.

If you send an already existing document (same [identifier](/guides/main_concepts/documents.md#identifier)) **only the field of the new documents** will be changed in the old document. Thus, any fields not present in the new document remained unchanged.

To completely overwrite a document, check out the [add and replace documents](/references/documents.md#add-and-replace-documents).


#### Path Variables

| Variable          | Description           |
|-------------------|-----------------------|
| **uid**         | The index UID |
| **identifier**    | [The unique identifier of the document](/guides/main_concepts/documents.md#identifier) |

If you want to set the **identifier** of your index through this route, it only has to be done **the first time you add documents** to the index. After which it will be ignored if given.

#### Body

The body is composed of a **JSON array** of documents. The fields of each document correspond to those in the index schema.
You can [read more about fields and schemas](/guides/main_concepts/indexes.md#schema-definition).


```json
[
  {
    "id": 287947,
    "title": "Shazam ⚡️"
  }
]
```

### Example

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/12345678/documents' \
  -d 'identifier=id'
  --data '[{
      "id": 287947,
      "title": "Shazam ⚡️"
    }]'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).

## Delete all documents

<RouteHighlighter method="DELETE" route="/indexes/:uid/documents"/>

Delete all documents in the specified index.



#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
| **uid** | The index UID |

### Example

```bash
curl \
  -X DELETE 'http://localhost:7700/indexes/12345678/documents'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).

## Delete one document

<RouteHighlighter method="DELETE" route="/indexes/:uid/documents/:identifier"/>

Delete one document based on its unique identifier.<br/>
You can read more about [identifiers and schemas](/guides/main_concepts/indexes.md#schema-definition).


#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
| **uid** | The index UID |

### Example

```bash
  curl \
  -X DELETE 'http://localhost:7700/indexes/12345678/documents/25684'
```

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).




## Delete documents

<RouteHighlighter method="POST" route="/indexes/:uid/documents/delete"/>

Delete a selection of documents based on array of identifiers.<br/>
You can read more about [identifiers and schemas](/guides/main_concepts/indexes.md#schema-definition).



#### Path Variables

| Variable  | Description           |
|-----------|-----------------------|
| **uid** | The index UID |

#### Body

The body must be a **Json Array** with the unique identifiers of the documents to delete.

```json
[23488, 153738, 437035, 363869]
```

### Example

```bash
  curl \
  -X POST 'http://localhost:7700/indexes/12345678' \
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
  "updateId": 1
}
```
This `updateId` allows you to [track the current update](/references/updates.md).
