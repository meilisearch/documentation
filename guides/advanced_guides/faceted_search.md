# Faceted Search

**Faceted search** is a feature provided out-of-the-box by MeiliSearch. Faceting allows classifying search results into categories that are called **facets**.

> For a movie, its title, its director, or its genre can be used as facets.

A faceted search system provides users with a simple way to narrow down search results by selecting facets. A faceted navigation system is an **intuitive interface to display and navigate through content**. The facets are placed in the UI as filters which users can apply to refine the results in real-time.
When users perform a search, they are presented with a list of results and a list of facets (i.e., categories) as below:

![Amazon UI](/amazon-facets.png)
> Faceted navigation on Amazon: facets are displayed on the left column.

## How does it work?

Faceted search, also known as faceted navigation, is a technique that combines traditional search with a **faceted classification of items**. Data is classified across multiple dimensions, called facets, so it can be accessed and ordered in multiple ways at a time. Document fields are used as categories such as title, author, director, language, description, release date, and so forth.
Besides, faceting is a powerful feature that enables to build an intuitive navigation interface.

Both faceting and filtering help drill down into a subset of search results. However, **faceting differs from [filtering](/guides/advanced_guides/filtering.md)**.

- **Filters** exclude some results based on criteria. They allow users to narrow down a set of documents to only those matching these chosen criteria. In other words, filtering is used to filter the returned results by adding constraints.
- **Facets** are a subset of filtering. Facets are document fields used as categories and thus provide grouping capabilities to search for specific fields rather than every field. They allow users to narrow down a set of documents by multiple dimensions at a time.

Faceting and filtering aim at being complementary.

## Setting Up Facets

Document attributes to use as facets **must be declared at indexing time**.

You can set up facets **through the API** via the [global settings route](/references/settings.md#update-settings).
You need to add the desired attributes to the `attributesForFaceting` list. This attribute accepts a `[String]` that specifies which attributes must be used as facets, and defaults to `null`.

`attributesForFaceting=[<Attribute>, ...]`

- `[<Attribute>, ...]` (Array of strings, defaults to `null`)

  An array of strings that contains the attributes to use as facets.

::: warning

Only fields of data type **string** or **array of strings** can be set up as facets.

:::

Any POST request on the `settings` route with a value set to `attributesForFaceting` will overwrite the current faceted attributes. Then, passing an empty array will reset all defined faceted attributes.

### Example

Suppose that you have a collection of movies in the following JSON format:

```json
[
  {
      "id": "495925",
      "title": "Doraemon the Movie:Nobita's Treasure Island",
      "director": "Fujiko Fujio",
      "genre": "Science fiction",
      "poster": "https://image.tmdb.org/t/p/w1280/cmJ71gdZxCqkMUvGwWgSg3MK7pC.jpg",
      "overview": "The story is based on Robert Louis Stevenson's Treasure Island novel.",
      "release_date": 1520035200
  },
  {
      "id": "329996",
      "title": "Dumbo",
      "director": "Tim Burton",
      "genre": "Science fiction",
      "poster": "https://image.tmdb.org/t/p/w1280/279PwJAcelI4VuBtdzrZASqDPQr.jpg",
      "overview": "A young elephant, whose oversized ears enable him to fly, helps...",
      "release_date": 1553644800
  },
  {
      "id": "458723",
      "title": "Us",
      "director": "Jordan Peele",
      "genre": "Horror",
      "poster": "https://image.tmdb.org/t/p/w1280/ux2dU1jQ2ACIMShzB3yP93Udpzc.jpg",
      "overview": "Husband and wife Gabe and Adelaide Wilson take their...",
      "release_date": 1552521600
  },
  ...
]
```

You would declare faceted attributes as follows:

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/settings' \
  --data '{
      "attributesForFaceting": [
          "director",
          "genre"
      ]
  }'
```

## Querying On Faceted Attributes

When performing a search, you can specify:

### The facets for which to retrieve the matching count

`facets=[<facetName>, <facetName>, ...]`

This attribute can take two values:

- `[<facetName>, <facetName>, ...]` (Optional, array of strings, defaults to `null`)

  An array of strings that contains the facets for which to retrieve the matching count. The number of remaining candidates for each specified facet is returned. If a facet name doesn't exist, it will be ignored.

- `["*"]`

  The `*` character can also be used. In that case, a count for all facets is returned.

If the `facets` parameter has been set, the returned results will contain two additional fields:

- `facets`: The number of remaining candidates for each specified facet.

- `exhaustiveFacetsCount`:
  Returns `true` if the above count is **exhaustive**.
  Otherwise, returns `false` if the above count is **approximative**.

### Example

TODO

### The facets to filter on

`facetFilters=["facetName:facetValue"]` or `facetFilters=[["facetName:facetValue"]]`

This attribute can take two types of array:

- `["facetName:facetValue"]` (Optional, array of strings)
- `[["facetName:facetValue"]]` (Optional, array of arrays of strings)

  - `facetName`: The name (the attribute) of a field used as a facet.
  - `facetValue`: The value of this facet to filter results on.

  Both contain the facet names and values to filter on.
  The **array's depth** must be at least equal to **1** and musn't be greater than **2**.

Using a double dimensional array allows using **logical connectives**.

- **Inner arrays elements** are connected by an `OR` operator.
- **Outer arrays elements** are connected by an `AND` operator.

For instance, the following array:

```json
[["genre:Horror", "genre:Comedy"], "director:Jordan Peele"]
```

Can be translated as:

```SQL
("genre:Horror" OR "genre:Comedy") AND "director:Jordan Peele"
```

### Example

TODO
