# Search Parameters

Search parameters let the user customize their search request.

| Query Parameter                                                                                   | Description                                                                                     | Default Value |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | :-----------: |
| **[q](/guides/advanced_guides/search_parameters.md#query-q)**                                     | Query string _(mandatory)_                                                                      |               |
| **[offset](/guides/advanced_guides/search_parameters.md#offset)**                                 | Number of documents to skip                                                                     |      `0`      |
| **[limit](/guides/advanced_guides/search_parameters.md#limit)**                                   | Maximum number of documents returned                                                            |     `20`      |
| **[attributesToRetrieve](/guides/advanced_guides/search_parameters.md#attributes-to-retrieve)**   | Attributes to display in the returned documents                                                 |      `*`      |
| **[attributesToCrop](/guides/advanced_guides/search_parameters.md#attributes-to-crop)**           | Attributes whose values have to be cropped                                                      |    `none`     |
| **[cropLength](/guides/advanced_guides/search_parameters.md#crop-length)**                        | Length used to crop field values                                                                |     `200`     |
| **[attributesToHighlight](/guides/advanced_guides/search_parameters.md#attributes-to-highlight)** | Attributes whose values will contain highlighted matching terms                                 |    `none`     |
| **[filters](/guides/advanced_guides/search_parameters.md#filters)**                               | Filter queries by an attribute value                                                            |    `none`     |
| **[matches](/guides/advanced_guides/search_parameters.md#matches)**                               | Defines whether an object that contains information about the matches should be returned or not |    `false`    |

## Query (q)

The query parameter is the **only mandatory** parameter. This is the string used by the search engine to find relevant documents.

`q=<String>`

- `<String>` (Mandatory, string)

  The query string.

#### Example

Suppose you would like to search `shifu` in a movie database, you would send:

```bash
$ curl -X GET -G 'http://localhost:7700/indexes/movies/search' \
      -d q=shifu
```

::: tip
Although the API will send back documents even if the query is only one character long, the more precise the search query is, the faster the API will respond.
:::

## Offset

A number of **documents to skip**.

`offset=<Integer>`

- `<Integer>` (Optional, positive integer, defaults to `0`)

  If the value of the parameter `offset` is _n_, _n_ first documents to skip. This is helpful for **pagination**.

#### Example

If you want to skip the **first** document, set `offset` to `1`.

```bash
$ curl -X GET -G 'http://localhost:7700/indexes/movies/search' \
      -d q=shifu \
      -d offset=1
```

## Limit

Set a **limit to the number of documents returned** by search queries.

`limit=<Integer>`

- `<Integer>` (Optional, positive integer, defaults to `20`)

  If the value of the parameter `limit` is _n_, there will be _n_ documents in the search query response. This is helpful for **pagination**.

#### Example

If you want to get only **two** documents, set `limit` to `2`.

```bash
$ curl -X GET -G 'http://localhost:7700/indexes/movies/search' \
      -d q=shifu \
      -d limit=2
```

## Attributes to retrieve

Attributes to **display** in the returned documents.

`attributesToRetrieve=<Attribute>,<Attribute>,...`

- `<Attribute>` (Optional, string, Defaults to `*`)

  Comma-separated list of attributes whose fields will be present in the returned documents.

#### Example

If you want to get only the `overview` and `title` field and not the other fields, set `attributesToRetrieve` to `overview,title`.

```bash
$ curl -X GET -G 'http://localhost:7700/indexes/movies/search' \
      -d q=shifu \
      -d attributesToRetrieve=overview,title
```

## Attributes to crop

Attributes whose values will be cropped if they contain a matched query word.

`attributesToCrop=<Attribute>,<Attribute>,...`

- `<Attribute>` (Optional, string, defaults to empty)

  Comma-separated list of attributes whose values will be cropped if they contain a matched query word. 
  
In the case a matched query word is found, the field's value will be cropped around the first matched query word according to the `cropLength` value (default `200` see below).

::: tip
This is especially useful when you have to display content on the front-end in a specific way.
:::

## Crop length

Set a length for the cropping around the matching query words (see attributesToCrop).

`cropLength=<Integer>`

- `<Integer>` (Optional, positive integer, defaults to `200`)

  The length used to crop field values around the first matched query word if the field's attribute is in the `attributedToCrop` list.

Cropping start at the **first occurrence of the matched query word**.

If the value of the parameter `cropLength` is _n_, the returned field value will consist of **_n_ characters before the query word** and **_n_ characters from the first character of the query word**. Below is a simple representation:

```json
_n_ characters + _n_ characters including the query word
```

#### Example

If you input `shifu` as a search query and set the value of the parameter `cropLength` to `100`:

```bash
$ curl -X GET -G 'http://localhost:7700/indexes/movies/search' \
      -d q=shifu \
      -d attributesToCrop=overview \
      -d cropLength=100
```

You will get the following response with the **cropped version in the \_formatted object**:

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

In the example above, the cropped version of `overview` is 200 characters longs. There are 100 characters before `shifu` (the first match) and 100 more characters starting at the first letter of `shifu`.

## Attributes to highlight

Attributes whose values will contain **highlighted matching query words**.

`attributesToHighlight=<Attribute>,<Attribute>,...`

- `<Attribute>` (Optional, string, defaults to empty)

  Comma-separated list of attributes. Every matching query words in the given attribute field will be wrapped around an `<em>` tag.

#### Example

If you choose to highlight the content of `overview`:

```bash
$ curl -X GET -G 'http://localhost:7700/indexes/movies/search' \
      -d q=shifu \
      -d attributesToHighlight=overview
```

You will get the following response with the **highlighted version in the \_formatted object**:

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

When evaluated in HTML, the **overview attribute in \_formatted** will look like as follows:

The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year <em>**Shifu**</em> informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between <em>**Shifu**</em> and Mr. Ping.

## Filters

This setting allows to **filter queries by an attribute value**.

Filters accept **only one** parameter.

`filters=<Attribute>:<Value>`

- `<Attribute>:<Value>` (Optional, string, defaults to empty)

  Two strings separated by a colon.

  - `<Attribute>`: The attribute name.

  - `<Value>`: The value which will be used to filter documents.

The attribute value used for filtering must be **equal to** the existing attribute value in the documents. The **comparison is done in a case-insensitive manner**.

#### Example

If you add this filter:

```bash
$ curl -X GET -G 'http://localhost:7700/indexes/nzwlr302/search' \
      -d q=n \
      -d filters='title:Nightshift'
```

Only documents that contain the value `Nightshift` in their `title` attribute will be returned upon search.

```json
{
  "id": "569367",
  "title": "Nightshift",
  "poster": "https://image.tmdb.org/t/p/w1280/peOeFl8ZTBTCERz5XQZAjYbXYsQ.jpg",
  "overview": "Amy begins her first night shift in a hotel with a murderous past. Witnessing terrifying events and trapped within a loop, Amy must find a way to escape the flesh obsessed murderer and save residents of the hotel.",
  "release_date": 1536282000
}
```

The parameter must be **URL-encoded**.

```bash
$ curl --request GET  -G 'http://localhost:7700/indexes/movies/search' \
      -d q=shifu \
      -d filters='title:Kung%20Fu%20Panda'
```

## Matches

This setting takes a **Boolean value** (`true` or `false`) and defines whether an object that contains information about the matches should be returned or not.

`matches=<Boolean>`

- `<Boolean>` (Optional, boolean, defaults to `false`)

  If `true`, returns an array of the search query occurrences in all fields. A search query occurrence is given by a `start` position in the field and the `length` of the occurrence.

::: tip
This is useful when you need to highlight the results without the default HTML highlighter.
:::

#### Example

If you set `matches` to `true`:

```bash
$ curl -X GET -G 'http://localhost:7700/indexes/movies/search' \
      -d q=shifu \
      -d attributesToHighlight=overview \
      -d matches=true
```

You will get the following response with the **raw matches in the \_matchesInfo object**:

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
