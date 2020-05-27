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

<code-samples id="search_parameter_guide_query_1" />

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

<code-samples id="search_parameter_guide_offset_1" />

## Limit

Set a **limit to the number of documents returned** by search queries.

`limit=<Integer>`

- `<Integer>` (Optional, positive integer, defaults to `20`)

  If the value of the parameter `limit` is _n_, there will be _n_ documents in the search query response. This is helpful for **pagination**.

#### Example

If you want to get only **two** documents, set `limit` to `2`.

<code-samples id="search_parameter_guide_limit_1" />

## Attributes to Retrieve

Attributes to **display** in the returned documents.

`attributesToRetrieve=<Attribute>,<Attribute>,...`

- `<Attribute>` (Optional, string, Defaults to `*`)

  Comma-separated list of attributes whose fields will be present in the returned documents.

  Defaults to the attributes added to the [displayedAttributes list](/guides/advanced_guides/settings.md#displayed-attributes) which contains by default all attributes found in the documents.

#### Example

If you want to get only the `overview` and `title` field and not the other fields, set `attributesToRetrieve` to `overview,title`.

<code-samples id="search_parameter_guide_retrieve_1" />

## Attributes to Crop

Attributes whose values will be cropped if they contain a matched query word.

`attributesToCrop=<Attribute:Croplength>,<Attribute:Croplength>,...`

Attribute can have two values:

- `<Attribute>` OR `<Attribute:Croplength>` (Optional, string, defaults to empty)

  Comma-separated list of attributes whose values will be cropped if they contain a matched query word.
  Each attribute can be joined by an optional `cropLength` that overwrites the [cropLength](/guides/advanced_guides/search_parameters.md#crop-length) parameter.

- `"*"`

  The `*` character can also be used. In that case, all the attributes present in `attributesToRetrieve` will be assigned to `attributesToCrop`.

In the case a matched query word is found, the field's value will be cropped around the first matched query word according to the `cropLength` value (default `200` see [cropLength](/guides/advanced_guides/search_parameters.md#crop-length) to change this value).

Some working examples:

- `attributesToCrop=overview`
- `attributesToCrop=overview:20`
- `attributesToCrop=*,overview:20,title:0`

::: tip
This is especially useful when you have to display content on the front-end in a specific way.
:::

**Cropping start at the first occurrence of the search query**. It only keeps `cropLength` chars on each side of the first match, rounded to match word boundaries.

#### Example

If you input `shifu` as a search query and set the value of the parameter `cropLength` to `10`:

<code-samples id="search_parameter_guide_crop_1" />

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
    "overview": "this year Shifu informs",
    "release_date": 1290729600
  }
}
```

## Crop Length

`cropLength=<Integer>` (Optional, positive integer, defaults to `200`)

Number of characters to keep on each side of the start of the matching word. See [attributesToCrop](/guides/advanced_guides/search_parameters.md#attributes-to-crop).

## Attributes to Highlight

Attributes whose values will contain **highlighted matching query words**.

- `attributesToHighlight=<Attribute>,<Attribute>,...`

Attribute can have two values:

- `<Attribute>` (Optional, string, defaults to empty)

  Comma-separated list of attributes. Every matching query words in the given attribute field will be wrapped around an `<em>` tag.

- `"*"`

  The `*` character can also be used. In that case, all the attributes present in `attributesToRetrieve` will be assigned to `attributesToHighlight`.

Every matching string sequence in the given attribute's field will be wrapped around an `<em>` tag.

Some working examples:

- `attributesToHighlight=overview`
- `attributesToHighlight=*,overview`

#### Example

If you choose to highlight the content of `overview`:

<code-samples id="search_parameter_guide_highlight_1" />

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

`filters=<String>`

Specify a filter to be used with the query. See our [dedicated guide](/guides/advanced_guides/filtering.md).

<code-samples id="search_parameter_guide_filter_1" />

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

<code-samples id="search_parameter_guide_filter_2" />

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

<code-samples id="search_parameter_guide_matches_1" />

You will get the following response with the **information about the matches in the \_matchesInfo object**:

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
