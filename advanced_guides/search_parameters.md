# Search Parameters

Search parameters let the user customize his search request.

| Query Parameter           | Description                                        | Default Value |
|---------------------------|----------------------------------------------------|:-------------:|
| **[q](/advanced_guides/search_parameters.md#query-q)**                     | query string _(mandatory)_                         |               |
| **[offset](/advanced_guides/search_parameters.md#offset)**                | number of documents to skip                        | 0             |
| **[limit](/advanced_guides/search_parameters.md#limit)**                 | number of documents returned                       | 20            |
| **[attributesToRetrieve](/advanced_guides/search_parameters.md#attributes-to-retrieve)**  | document attributes to show                        | *             |
| **[attributesToCrop](/advanced_guides/search_parameters.md#attributes-to-crop)**      | which attributes to crop                           | none          |
| **[cropLength](/advanced_guides/search_parameters.md#crop-length)**            | limit length at which to crop specified attributes | 200           |
| **[attributesToHighlight](/advanced_guides/search_parameters.md#attributes-to-highlight)** | which attributes to highlight                      | none          |
| **[filters](/advanced_guides/search_parameters.md#filters)**               |  attribute with an exact match                     | none          |
| **[timeout_ms](/advanced_guides/search_parameters.md#timeout)**            | maximum response time                              | 30 ms         |
| **[matches](/advanced_guides/search_parameters.md#matches)**               | whether to return the raw matches or not           | false         |

## Query (q)

The query parameter is the **only mandatory** parameter.

It is the string the search engine uses to find relevant documents.

::: tip
Although the API will send back documents even with only one letter, the more precise the search query is, the faster the API responds.
:::

## Offset

`offset=<Integer>`.

X first documents to skip. This is helpful for **pagination**

## Limit

`offset=<Integer>`.

X number of documents in the search query response. This is helpful for **pagination**

## Attributes to retrieve

`attributesToRetrieve=<Attribute>,<Attribute>,...`.

Attributes that will appear in the returned documents.

## Attributes to crop

`attributesToCrop=<Attribute>,<Attribute>,...`

Attributes of which the value will be cropped depending on the `cropLength` and the matches .

::: tip
This is useful when you have specific needs for displaying results on the front-end application.
:::

**Cropping start at the first occurence of the search query**. It only keeps `(croplength - matchLength)/2 ` chars on each side of the first match.

#### Example

```bash
curl -X GET  -G 'http://localhost:7700/indexes/nzwlr302/search' \
        -d q=shifu \
        -d attributesToCrop=overview \
        -d cropLength=100 \
```

With a `cropLength` of 100 on `shifu` as a search query  this is the response.

Our **cropped version is in the _formatted object**.

```json
   {
      "id": "50393",
      "title": "Kung Fu Panda Holiday",
      "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
      "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
      "release_date": 1290729600,
      "_formatted": {
        "id": "50393",
        "title": "Kung Fu Panda Holiday",
        "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
        "overview": "d his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade ",
        "release_date": 1290729600
      }
    }
```

## Crop length

`cropLength=<Integer>`

Total length of the cropped field. See [attributesToCrop](/advanced_guides/search_parameters.md#attributes-to-crop)

## Attributes to highlight

`attributesToHighlight=<Attribute>,<Attribute>,...`

Every matching string sequence in the given attribute's field will be wrapped arround an `<em>` tag

#### Example

```json
    {
      "id": "50393",
      "title": "Kung Fu Panda Holiday",
      "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
      "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
      "release_date": 1290729600,
      "_formatted": {
        "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year <em>Shifu</em> informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between <em>Shifu</em> and Mr. Ping."
      }
    }
```
The **overview attribute in formatted** looks like this when evaluated in HTML:


The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year <em>**Shifu**</em> informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between <em>**Shifu**</em> and Mr. Ping.

## Filters

`filters=<Attribute>:<String>`

Attribute's value must be **equal** to the given string in the documents.

The **equality is case insenstive**.

```bash
curl -X GET  -G 'http://localhost:7700/indexes/nzwlr302/search' \
        -d q=n \
        -d filters='title:Nightshift'
```

```json
{
  "id":"569367",
  "title":"Nightshift",
  "poster":"https://image.tmdb.org/t/p/w1280/peOeFl8ZTBTCERz5XQZAjYbXYsQ.jpg",
  "overview":"Amy begins her first night shift in a hotel with a murderous past. Witnessing terrifying events and trapped within a loop, Amy must find a way to escape the flesh obsessed murderer and save residents of the hotel.",
  "release_date":1536282000
}
```

## Timeout

`timeout_ms=<Integer>`

**Maximum time** before a search request responds.

::: warning
When it's faster you lose in relevancy
:::

## Matches

`matches=<Boolean>`

Returns an array of the search query occurrences in all fields. A search query occurence is given by a `start` position in the field and the `length` of the occurence.

::: tip
This is useful when you need to highlight the results without the default html highlighter.
:::


#### Example

`Shifu` as search query:

```json
  {
      "id": "50393",
      "title": "Kung Fu Panda Holiday",
      "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
      "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
      "release_date": 1290729600,
      "_matchesInfo": {
        "overview": [
          {
            "start": 159,
            "length": 5
          },
          {
            "start": 361,
            "length": 5
          }
        ]
      }
    }
  ```
