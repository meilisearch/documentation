---

sidebarDepth: 2

---

# Faceted search

Meilisearch filters can be used to build faceted search interfaces. This type of interface allows users to refine search results based on broad categories or facets. Faceted search provides users with a quick way to narrow down search results by selecting categories relevant to what they are looking for. A faceted navigation system is an **intuitive interface to display and navigate through content**. Facets are used in the UI as filters that users can apply to refine the results in real-time.

Done right, facets allow users to find their way as they would in a physical store. Not only would users be able to find what they’re looking for, they can also see other relevant products you have. If your user is looking for a blanket, facets would ask questions like: What color do you want? Do you have a particular brand in mind? Any preferences for materials? How much are you willing to pay?

Facets are common in ecommerce sites like Amazon. When users perform a search, they are presented not only with a list of results but also with a list of facets which you can see on the sidebar in the image below:

![Meilisearch demo for an ecommerce website displaying faceting UI](/faceted-search/facets-ecommerce.png)

Faceted search interfaces often have a count of how many results belong to each facet. This gives users a visual clue of the range of results available for each facet.

### Filters or facets

In Meilisearch, facets are a specific use-case of filters. The question of whether something is a filter or a facet is mostly one pertaining to UX and UI design.

Meilisearch does not differentiate between facets and filters. This means that, despite its name, facets can be used with any attributes added to `filterableAttributes`.

## Configuring and using facets

Like any other filter, attributes you want to use as facets must be added to the [`filterableAttributes`](/reference/api/settings.md#filterable-attributes) list in the index's settings before they can be used. Once they have been configured, you can search for facets with [the `facets` search parameter](/reference/api/search.md#facets).

::: warning
Synonyms don't apply to facets. Meaning, if you have `SF` and `San Francisco` set as synonyms, faceting by `SF` and `San Francisco` will show you different results.
:::

Suppose you have a dataset on books called `books` containing the following fields:

```json
{
  "id":5,
  "title": "Hard Times",
  "genres": ["Classics","Fiction", "Victorian", "Literature"],
  "publisher": "Penguin Classics",
  "language": "English",
  "author": "Charles Dickens",
  "description":"Hard Times is a novel of social … ",
  "format": "Hardcover",
  "rating": 3
}
```

The following code sample allows you to create facets for the `genres`, `language`, and `rating` attributes:

<CodeSamples id="faceted_search_update_settings_1" />

Now, if you were to search the `books` index for `classic` using the following code sample:

<CodeSamples id="faceted_search_1" />

The response shows `classic` books along with two new fields: [`facetDistribution`](#facet-distribution) and [`facetStats`](#facet-stats):

```json
{
  "hits":[
    …
  ],
  "query":"classic",
  …
  "facetDistribution":{
    "genres":{
      "Classics":6,
      …
    },
    "language":{
      "English":6,
      "French":1,
      "Spanish":1
    },
    "rating":{
      "2.5":1,
      …
    }
  },
  "facetStats":{
    "rating":{
      "min":2.5,
      "max":4.7
    }
  }
}
```

### Facet distribution

The `facetDistribution` object contains the number of matching documents distributed among the values of a given facet. The `facets` search parameter expects an array of strings. Each string is an attribute present in the `filterableAttributes` list.

The following response shows the facet distribution when searching for `classics`:

```json
{
  …
 "facetDistribution":{
    "genres":{
      "Classics":6,
      "Fantasy":2,
      "Fiction":8,
      "Horror":2,
      "Literature":7,
      "Satire":1,
      "Tragedy":1,
      "Victorian":2
    },
    "language":{
      "English":6,
      "French":1,
      "Spanish":1
    },
    "rating":{
      "2.5":1,
      "3":2,
      "3.9":1,
      "4":3,
      "4.7":1
    }
  },
  …
}
```

`facetDistribution` contains an object for every given facet, in this case, `genres`, `language`, and `rating`. For each of these facets, there is another object containing all the different values and the count of matching documents. Note that zero values will not be returned: if there are no results for the Arabic language, it is not displayed.

::: note
By default, `facets` returns a maximum of 100 facet values for each faceted field. You can change this value using the `maxValuesPerFacet` property of the [`faceting` index settings](/reference/api/settings.md#faceting).
:::

### Facet stats

When using the `facets` parameter, any matching documents with facets containing numeric values are displayed in a `facetStats` object. `facetStats` contains the numeric minimum (`min`) and maximum (`max`) values per facet for all documents matching the search query. This can be used to create components like range sliders allowing users to select a range of values for a facet.

If none of the matching documents have a numeric value for a facet, that facet is not included in the `facetStats` object.

Meilisearch ignores numeric strings like `"21"` when computing `facetStats`.

The following response shows the `facetStats` when searching for `classics`:

```json
{
  …
"facetStats":{
    "rating":{
      "min":2.5,
      "max":4.7
    }
  }
  …
}  
```

Since `rating` was the only numeric facet in our example, it is the only facet returned in the `facetStats` object.

## Facet types

### Conjunctive facets

Conjunctive facets use the `AND` logical operator. When users select one or more values for a facet, all returned results must contain the selected facet value(s).

With conjunctive facets, when a user selects `English` from the `language` facet, all returned books must be in English. If the user further narrows down the search by selecting `Fiction` and `Literature` as `genres`, all returned books must be in English and contain both `genres`.

```
# Filter expression as an array
["language = English", "genres = Fiction", "genres = Literature"]

# Filter expression as a string
"language = English AND genres = Fiction AND genres = Literature"
```

The GIF below shows how the facet count for `genres` updates to only include books that meet **all three conditions**.

![Selecting English books with 'Fiction' and 'Literature' as 'genres' for the books dataset](/faceted-search/conjunctive-factes.gif)

### Disjunctive facets

Disjunctive facets use the `OR` logical operator. They allow users to choose multiple options within a facet, so they don’t have to perform more than one search to find the products they’re looking for.

Let's look at the `books` index from before with disjunctive facets. When the user selects `Fiction` and `Literature` as `genres`, Meilisearch returns all books that are either `Fiction`, `Literature`, or both:

```
# Filter expression as an array
[["genres = Fiction", "genres = Literature"]]

# Filter expression as a string
"genres = Fiction OR genres = Literature"
```

The GIF below shows the `books` dataset with disjunctive facets. Notice how the facet count for `genres` updates based on the selection.

![Selecting 'Fiction' and 'Literature' as 'genres' for the books dataset](/faceted-search/disjunctive_facets.gif)

### Using conjunctive and disjunctive facets

Let's look at the `books` index with both conjunctive and disjunctive facets. The user selects `English` and `French` from the `language` facet, and then narrows down the search to include `Fiction` and `Literature` as `genres`:

```
# Filter expression as an array
[["language = English", "language = French"], ["genres = Fiction", "genres = Literature"]]

# Filter expression as a string
"(language = English OR language = French) AND (genres = Fiction AND genres = Literature)"
```

![Selecting 'Fiction' and 'Literature' as 'genres' for English books](/faceted-search/conjunctive-and-disjunctive-facets.gif)
