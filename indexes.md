# Indexes

With the notion of Index, that can be called table in SQL, We have also the notion of Schema. How describe is a schema, how to understand it and how to create one?

A schema is a correspondence between all fields present into your data and how this field will be understood by our database. We have some tags that should be associated with a field in the scheme:

* **identifier** : Unique identifier of a document, should be set on only one field. This field shout is unique on all the collection.
* **indexed** : Every indexed field will serve to make our search engine work. It's, for example, a text, but not an URL.
* **stored** : Stored field can be retrievable during the search. A none stored field will never appear in the search response.
* **ranked** : should not be given during the index creation but only by the settings. Will sort all response by this field.

Take the example of a movie collection. We have several fields:

* **id**: Is a unique identifier for a movie (tag: identifier). Not useful to search into the id field. will be used for redirection into the website (tag: stored).
* **title**: the most important field (tag: indexed). Surely printed on the front (tag: stored).
* **description**: give much information about the movie (tag: indexed), perhaps we will show the first line of the description on the front (tag: stored).
* **release_date**: the release date can be used for sort movies (tag: ranked), but nobody will search precisely the release date of a film. It's will be shown on the website (tag: stored);
* **cover**: the URL of the poster or images related to the movie. Will be showed into the front (tag: stored).
** The order of field has huge importance for efficiency. So please order them from the most important to the less.**

Our schema will be :

```json
{
    "id": ["identifier", "stored"],
    "title": ["indexed", "stored"],
    "description": ["indexed", "stored"],
    "release_date": ["ranked", "stored"],
    "cover": ["stored"]
}
```



## List all indexes
```
GET /indexes
```

List all indexes names.

#### Headers

| Header              | Value         |                      |
|---------------------|---------------|----------------------|
| **X-Meili-API-Key** | `$API_KEY`    | _ACL: `indexesRead`_ |

#### Example
```bash
curl \
  --location \
  --request GET "localhost:8080/indexes" \
  --header "X-Meili-API-Key: $API_KEY"
```

#### Response `200 Ok`
```json
["movie"]
```



## Get one index
```
GET /indexes/:index
```

Get the schema of one index

##### Headers
||||
|---|---|---|
| **X-Meili-API-Key** | $API_KEY  | _ACL: `indexesRead`_ |
| **Content-Type** | application/json | |

##### Path Variables
|||
|---|---|
| **index** | The name of the index |


##### Example
```bash
curl \
  --location \
  --request GET "localhost:8080/indexes/movie" \
  --header 'X-Meili-API-Key: $API_KEY'
```

<span class="exemple_child">**response**: `200` Ok</span>
```json
{
  "id": ["identifier", "indexed", "stored"],
  "title": ["stored", "indexed"],
  "overview": ["stored", "indexed"],
  "release_date": ["stored"],
  "poster": ["stored"],
  "objectId": ["stored", "indexed"]
}
```
