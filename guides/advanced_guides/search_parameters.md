# Search Parameters

Search parameters let the user customize their search request.

| Query Parameter                                                                                   | Description                                        | Default Value |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------- | :-----------: |
| **[q](/guides/advanced_guides/search_parameters.md#query-q)**                                     | Query string _(mandatory)_                         |               |
| **[offset](/guides/advanced_guides/search_parameters.md#offset)**                                 | Number of documents to skip                        |      `0`      |
| **[limit](/guides/advanced_guides/search_parameters.md#limit)**                                   | Number of documents returned                       |     `20`      |
| **[attributesToRetrieve](/guides/advanced_guides/search_parameters.md#attributes-to-retrieve)**   | Document attributes to show                        |      `*`      |
| **[attributesToCrop](/guides/advanced_guides/search_parameters.md#attributes-to-crop)**           | Which attributes to crop                           |    `none`     |
| **[cropLength](/guides/advanced_guides/search_parameters.md#crop-length)**                        | Limit length at which to crop specified attributes |     `200`     |
| **[attributesToHighlight](/guides/advanced_guides/search_parameters.md#attributes-to-highlight)** | Which attributes to highlight                      |    `none`     |
| **[filters](/guides/advanced_guides/search_parameters.md#filters)**                               | Attribute with an exact match                      |    `none`     |
| **[matches](/guides/advanced_guides/search_parameters.md#matches)**                               | Whether to return the raw matches or not           |    `false`    |

## Query (q)

`q=<String>`

- `<String>` (Mandatory, string)

  The query parameter is the **only mandatory** parameter.

  It is the string used by the search engine to find relevant documents.

::: tip
Although the API will send back documents even if the query is only one character long, the more precise the search query is, the faster the API responds.
:::

### Query parameters

## Offset

`offset=<Integer>`

- `<Integer>` (Optional, positive integer)

  If the value of the parameter `offset` is _n_, _n_ first documents to skip. This is helpful for **pagination**.

  Defaults to `0`.

## Limit

`limit=<Integer>`

- `<Integer>` (Optional, positive integer)

  If the value of the parameter `limit` is _n_, there will be _n_ documents in the search query response. This is helpful for **pagination**.

  Defaults to `20`.

## Attributes to retrieve

`attributesToRetrieve=<Attribute>,<Attribute>,...`

- `<Attribute>` (Optional, string)

  Comma-separated list of attributes that will appear in the returned documents.

  Defaults to `*`.

## Attributes to crop

`attributesToCrop=<Attribute>,<Attribute>,...`

- `<Attribute>` (Optional, string)

  Comma-separated list of attributes whose values will be cropped depending on the `cropLength` and the matches.

  Defaults to `none`.

::: tip
This is useful when you have specific needs for displaying results on the front-end application.
:::

**Cropping start at the first occurrence of the search query**. It only keeps `(cropLength - matchLength)/2` chars on each side of the first match.

## Crop length

`cropLength=<Integer>`

- `<Integer>` (Optional, positive integer)

  If the value of the parameter `cropLength` is _n_, _n_ is the total length of the cropped field.

  Defaults to `200`.

#### Example

If you input `shifu` as a search query and set the value of the parameter `cropLength` to 100 as below:

```bash
$ curl -X GET -G 'http://localhost:7700/indexes/nzwlr302/search' \
        -d q=shifu \
        -d attributesToCrop=overview \
        -d cropLength=100 \
```

Our **cropped version is in the \_formatted object**.

You would get this response:

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

## Attributes to highlight

`attributesToHighlight=<Attribute>,<Attribute>,...`

- `<Attribute>` (Optional, string)

  Comma-separated list of attributes. Every matching string sequence in the given attribute's field will be wrapped around an `<em>` tag.

  Defaults to `none`.

#### Example

```bash
$ curl -X GET -G 'http://localhost:7700/indexes/nzwlr302/search' \
        -d q=shifu \
        -d attributesToHighlight=overview
```

Our **highlight version is in the \_formatted object**.

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
    "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year <em>Shifu</em> informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between <em>Shifu</em> and Mr. Ping.",
    "release_date": 1290729600
  }
}
```

The **overview attribute in formatted** looks like this when evaluated in HTML:

The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year <em>**Shifu**</em> informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between <em>**Shifu**</em> and Mr. Ping.

## Filters

`filters=<Attribute>:<Value>`

- `<Attribute>:<Value>` (Optional, string)

  Two strings separated by a colon.

  Defaults to `none`.

  - `<Attribute>`: An attribute name.

  - `<Value>`: Its corresponding value.

  The given attribute's value must be **equal** to the value of the attribute in the documents. Filters accept **only one** parameter.

  The **comparison is done in a case-insensitive manner**.

```bash
$ curl -X GET -G 'http://localhost:7700/indexes/nzwlr302/search' \
        -d q=n \
        -d filters='title:Nightshift'
```

```json
{
  "id": "569367",
  "title": "Nightshift",
  "poster": "https://image.tmdb.org/t/p/w1280/peOeFl8ZTBTCERz5XQZAjYbXYsQ.jpg",
  "overview": "Amy begins her first night shift in a hotel with a murderous past. Witnessing terrifying events and trapped within a loop, Amy must find a way to escape the flesh obsessed murderer and save residents of the hotel.",
  "release_date": 1536282000
}
```

The parameter should be **URL-encoded**.

```bash
$ curl --request GET  -G 'http://localhost:8080/indexes/nzwlr302/search' \
        -d q=shifu \
        -d filters='title:Kung%20Fu%20Panda' \
        -i
```

## Matches

`matches=<Boolean>`

- `<Boolean>` (Optional, boolean)

  If `true`, returns an array of the search query occurrences in all fields. A search query occurrence is given by a `start` position in the field and the `length` of the occurrence.

  Defaults to `false`.

::: tip
This is useful when you need to highlight the results without the default HTML highlighter.
:::

#### Example

```bash
$ curl -X GET -G 'http://localhost:7700/indexes/nzwlr302/search' \
        -d q=shifu \
        -d attributesToHighlight=overview \
        -d matches=true
```

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
