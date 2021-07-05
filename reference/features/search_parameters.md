# Search parameters

Search parameters let the user customize their search request.

| Query Parameter                                                                                   | Description                                                                                     | Default Value |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | :-----------: |
| **[q](/reference/features/search_parameters.md#query-q)**                                     | Query string                                                                                    |     `""`     |
| **[offset](/reference/features/search_parameters.md#offset)**                                 | Number of documents to skip                                                                     |      `0`      |
| **[limit](/reference/features/search_parameters.md#limit)**                                   | Maximum number of documents returned                                                            |     `20`      |
| **[filters](/reference/features/search_parameters.md#filters)**                               | Filter queries by an attribute value                                                            |    `null`     |
| **[facetFilters](/reference/features/search_parameters.md#facet-filters)** | Facet names and values to filter on                                  |    `null`     |
| **[facetsDistribution](/reference/features/search_parameters.md#the-facets-distribution)** | Facets for which to retrieve the matching count                                 |    `null`     |
| **[attributesToRetrieve](/reference/features/search_parameters.md#attributes-to-retrieve)**   | Attributes to display in the returned documents                                                 |      `["*"]`      |
| **[attributesToCrop](/reference/features/search_parameters.md#attributes-to-crop)**           | Attributes whose values have to be cropped                                                      |    `null`     |
| **[cropLength](/reference/features/search_parameters.md#crop-length)**                        | Length used to crop field values                                                                |     `200`     |
| **[attributesToHighlight](/reference/features/search_parameters.md#attributes-to-highlight)** | Attributes whose values will contain highlighted matching terms                                 |    `null`     |
| **[matches](/reference/features/search_parameters.md#matches)**                               | Defines whether an object that contains information about the matches should be returned or not |    `false`    |

## Query (q)

This is the string used by the search engine to find relevant documents. Search queries are [tokenized](/reference/under_the_hood/tokenization.md).

::: warning
MeiliSearch only considers the first ten words of any given search query. This is necessary in order to deliver a [fast type-as-you-search experience](/learn/what_is_meilisearch/philosophy.md#front-facing-search) in a consistent way.
:::

`q=<String>`

- `<String>` (String)

  The query string.

#### Example

Suppose you would like to search `shifu` in a movie database. You would send the following:

<CodeSamples id="search_parameter_guide_query_1" />

### Placeholder search

When `q` isn't specified, a **placeholder search** is performed. Placeholder search allows you to find documents without providing any search terms.

Placeholder search returns the documents that best match other search parameters, sorted according to that index's [ranking rules](/reference/features/settings.md#ranking-rules). This feature also supports [faceting](/reference/features/faceted_search.md) and [filtering](/reference/features/filtering.md)

### Phrase search

You can enclose search terms in double quotes (`"`), in which case MeiliSearch will only return documents containing all terms in the order they were given. This is called a [phrase search](/learn/what_is_meilisearch/features.md#phrase-search).

Phrase searches are case-insensitive and ignore [soft separators such as `-`, `,`, and `:`](/reference/under_the_hood/datatypes.md). Hard separators within a phrase search effectively split the query into different phrase searches: `"Octavia.Butler"` will return the same results as `"Octavia" "Butler"`.

You can mix phrase searches with regular queries: MeiliSearch will first fetch all documents with exact matches and [then proceed with its default behavior](/learn/core_concepts/relevancy.md).

## Offset

A number of **documents to skip**.

`offset=<Integer>`

- `<Integer>` (Optional, positive integer, defaults to `0`)

  If the value of the parameter `offset` is _n_, _n_ first documents to skip. This is helpful for **pagination**.

#### Example

If you want to skip the **first** document, set `offset` to `1`.

<CodeSamples id="search_parameter_guide_offset_1" />

## Limit

Set a **limit to the number of documents returned** by search queries.

`limit=<Integer>`

- `<Integer>` (Optional, positive integer, defaults to `20`)

  If the value of the parameter `limit` is _n_, there will be _n_ documents in the search query response. This is helpful for **pagination**.

#### Example

If you want to get only **two** documents, set `limit` to `2`.

<CodeSamples id="search_parameter_guide_limit_1" />

## Filters

`filters=<String>`

Specify a filter to be used with the query. See our [dedicated guide](/reference/features/filtering.md).

<CodeSamples id="search_parameter_guide_filter_1" />

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

<CodeSamples id="search_parameter_guide_filter_2" />

## Facet filters

If you have [set up faceted attributes](/reference/features/settings.md#attributes-for-faceting), you can filter on [facets](/reference/features/faceted_search.md) to narrow down your results based on criteria.

`facetFilters=["facetName:facetValue"]` or `facetFilters=[["facetName:facetValue"]]`
or a mix of both `facetFilters=["facetName1:facetValue1", ["facetName2:facetValue2"]]`

- `["facetName1:facetValue1", ["facetName2:facetValue2"]]` (Array of array of strings or single strings, defaults to `null`)

  Both types of array contain the facet names and values to filter on.
  A valid array must be an array that contains either a list of strings or arrays of strings and can mix both (e.g. `["director:Mati Diop", ["genres:Comedy", "genres:Romance"]]`).

  - `facetName`: The name (the attribute) of a field used as a facet (e.g. `director`, `genres`).
  - `facetValue`: The value of this facet to filter results on (e.g. `Tim Burton`, `Mati Diop`, `Comedy`, `Romance`).

Facet filters also support logical connectives by using [inner and outer array elements](/reference/features/faceted_search.md#using-facets).

[Learn more about facet filters in the dedicated guide](/reference/features/faceted_search.md)

#### Example

Suppose you have declared `director` and `genres` as [faceted attributes](/reference/features/settings.md#attributes-for-faceting), and you want to get movies matching "thriller" classified as either horror **or** mystery **and** directed by Jordan Peele.

```SQL
("genres:Horror" OR "genres:Mystery") AND "director:Jordan Peele"
```

Querying on "thriller", the above example results in the following CURL command:

<CodeSamples id="faceted_search_walkthrough_facet_filters_1" />

And you would get the following response:

```json
{
  "hits": [
    {
      "id": 458723,
      "title": "Us",
      "director": "Jordan Peele",
      "tagline": "Watch yourself",
      "genres": [
        "Thriller",
        "Horror",
        "Mystery"
      ],
      "overview": "Husband and wife Gabe and Adelaide Wilson take their kids to their beach house expecting to unplug and unwind with friends. But as night descends, their serenity turns to tension and chaos when some shocking visitors arrive uninvited.",
    },
    {
      "id": 419430,
      "title": "Get Out",
      "director": "Jordan Peele",
      "genres": [
        "Mystery",
        "Thriller",
        "Horror"
      ],
      "overview": "Chris and his girlfriend Rose go upstate to visit her parents for the weekend. At first, Chris reads the family's overly accommodating behavior as nervous attempts to deal with their daughter's interracial relationship, but as the weekend progresses, a series of increasingly disturbing discoveries lead him to a truth that he never could have imagined.",
    }
  ],
  ...
  "query": "thriller"
}
```

## The facets distribution

If you have [set up faceted attributes](/reference/features/settings.md#attributes-for-faceting), you can retrieve the count of matching terms for each [facets](/reference/features/faceted_search.md).

`facetsDistribution=[<facetName>, <facetName>, ...]`

This attribute can take two values:

- `[<facetName>, <facetName>, ...]` (Array of strings)

  An array of strings that contains the facets for which to retrieve the matching count. The number of remaining candidates for each specified facet is returned.
  If a facet name doesn't exist, it will be ignored.

- `["*"]`

  In that case, a count for all facets is returned.

#### Returned fields

If the `facetsDistribution` parameter has been set, the returned results will contain **two additional fields**:

- `facetsDistribution`: The number of remaining candidates for each specified facet.

- `exhaustiveFacetsCount`:
  Returns `true` if the count in each facet value is **exhaustive** (exact count for each facet value).
  Otherwise, returns `false` if this count is **approximative** (approximative count for each facet value).
  The approximative facet count happens when there are too many documents in too many different facet values. In which case, MeiliSearch stops the distribution count to prevent considerably slowing down the request.

[Learn more about facet distribution in the dedicated guide](/reference/features/faceted_search.md#the-facets-distribution)

#### Example

Given a movie database, suppose that you want to know what the number of Batman movies per genre is. You would use the following CURL command:

<CodeSamples id="faceted_search_facets_distribution_1" />

And you would get the following response:

```json
{
  "hits": [
    ...
  ],
  ...
  "nbHits": 1684,
  "query": "Batman",
  "exhaustiveFacetsCount": true,
  "facetsDistribution": {
    "genres": {
      "action": 273,
      "animation": 118,
      "adventure": 132,
      "fantasy": 67,
      "comedy": 475,
      "mystery": 70,
      "thriller": 217,
    }
  }
}
```

## Attributes to retrieve

Attributes to **display** in the returned documents.

`attributesToRetrieve=<Attribute>,<Attribute>,...`

- `<Attribute>` (Optional, string, Defaults to `['*']`)

  Comma-separated list of attributes whose fields will be present in the returned documents.

  Defaults to to the [displayedAttributes list](/reference/features/settings.md#displayed-attributes) which contains by default all attributes found in the documents.

#### Example

If you want to get only the `overview` and `title` field and not the other fields, set `attributesToRetrieve` to `overview,title`.

<CodeSamples id="search_parameter_guide_retrieve_1" />

## Attributes to crop

Attributes whose values will be cropped if they contain a matched query word.

`attributesToCrop=<Attribute:Croplength>,<Attribute:Croplength>,...`

Attribute can have two values:

- `<Attribute>` OR `<Attribute:Croplength>` (Optional, string, defaults to empty)

  Comma-separated list of attributes whose values will be cropped if they contain a matched query word.
  Each attribute can be joined by an optional `cropLength` that overwrites the [cropLength](/reference/features/search_parameters.md#crop-length) parameter.

- `['*']`

  In this case, all the attributes present in `attributesToRetrieve` will be assigned to `attributesToCrop`.

In the case a matched query word is found, the field's value will be cropped around the first matched query word according to the `cropLength` value (default `200` see [cropLength](/reference/features/search_parameters.md#crop-length) to change this value).

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

<CodeSamples id="search_parameter_guide_crop_1" />

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

## Crop length

`cropLength=<Integer>` (Optional, positive integer, defaults to `200`)

Number of characters to keep on each side of the start of the matching word. See [attributesToCrop](/reference/features/search_parameters.md#attributes-to-crop).

## Attributes to highlight

Attributes whose values will contain **highlighted matching query words**.

- `attributesToHighlight=[<Attribute>,<Attribute>,...]`

Attribute can have two values:

- `<Attribute>` (Optional, string, defaults to empty)

  Comma-separated list of attributes. Every matching query words in the given attribute field will be wrapped around an `<em>` tag.

- `"*"`

  In this case, all the attributes present in `attributesToRetrieve` will be assigned to `attributesToHighlight`.

Every matching string sequence in the given attribute's field will be wrapped around an `<em>` tag.

Some working examples:

- `attributesToHighlight=overview`
- `attributesToHighlight=*,overview`

#### Example

If you choose to highlight the content of `overview`:

<CodeSamples id="search_parameter_guide_highlight_1" />

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

<CodeSamples id="search_parameter_guide_matches_1" />

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

::: warning
`start` and `length` return the number of bytes and not the number of characters. For example, `ü` represents two bytes but one character.
:::

## Examples

Here are a few examples of what can be achieved with search parameters:

Results can be paginated using the `limit` and `offset` query parameters.

<CodeSamples id="search_guide_1" />

You can filter results using the `filters` query parameter.

<CodeSamples id="search_guide_2" />
