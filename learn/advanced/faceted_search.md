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
  "id":2,
  "title": "The Travels of Ibn Battuta",
  "genres": ["Travel","Adventure"],
  "publisher": "Dover Publications",
  "language": "English",
  "authors": "Ibn Battuta",
  "description":""
}
```

The following code sample allows you to create facets for the `brand` and `rating` attributes:

<CodeSamples id="faceted_search_update_settings_1" />

Now, if you were to search the `ecommerce` index for `led` using the following code sample:

<CodeSamples id="faceted_search_1" />

The response shows `led` products along with two new fields: [`facetDistribution`](#facet-distribution) and [`facetStats`](#facet-stats):

```json
{
  "hits":[
    …
  ],
  "query":"led",
  "processingTimeMs":20,
  "limit":20,
  "offset":0,
  "estimatedTotalHits":24,
  "facetDistribution":{
    "brand":{
      "AceLite":1,
       …
      "Sunlite":2,
    },
    "category":{
      "Home & Kitchen":1,
      "Tools & Home Improvement":22,
      "Toys & Games":1
    },
    "rating":{
      "0":7,
       …
      "5":3
    }
  },
  "facetStats":{
    "rating":{
      "min":0.0,
      "max":5.0
    }
  }
}
```

### Facet distribution

The `facetDistribution` object contains the number of matching documents distributed among the values of a given facet. The `facets` search parameter expects an array of strings. Each string is an attribute present in the `filterableAttributes` list.

The following response shows the facet distribution when searching for `led`:

```json
{
  …
 "facetDistribution":{
    "brand":{
      "AceLite":1,
      "DALS Lighting":2,
      "Globe Electric":1,
      "Hyperikon":2,
      "LUXRITE":1,
      "Lithonia Lighting":1,
      "MODOAO":2,
      "Nadair":1,
      "POCKETMAN":2,
      "QPLUS":1,
      "Sunlite":2,
      "Suppromo":1,
      "TORCHSTAR":1,
      "Vinkki":1,
      "WEWILL":1,
      "hykolity":2,
      "iHomma":1,
      "iLintek":1
    },
    "category":{
      "Home & Kitchen":1,
      "Tools & Home Improvement":22,
      "Toys & Games":1
    },
    "rating":{
      "0":7,
      "1":1,
      "3.6":1,
      "3.8":1,
      "4":2,
      "4.1":2,
      "4.4":1,
      "4.5":2,
      "4.6":1,
      "4.7":3,
      "5":3
    }
  }
  …
}
```

`facetDistribution` contains an object for every given facet, in this case, `brand`, `category`, and `rating`. For each of these facets, there is another object containing all the different values and the count of matching documents. Note that zero values will not be returned: if there are no `led` products under the `Electronics` category, it is not displayed.

::: note
By default, `facets` returns a maximum of 100 facet values for each faceted field. You can change this value using the `maxValuesPerFacet` property of the [`faceting` index settings](/reference/api/settings.md#faceting).
:::

### Facet stats

When using the `facets` parameter, any matching documents with facets containing numeric values are displayed in a `facetStats` object. `facetStats` contains the numeric minimum (`min`) and maximum (`max`) values per facet for all documents matching the search query. This can be used to create a range slider component allowing users to select a range of values for a facet.

If none of the matching documents have a numeric value for a facet, that facet is not included in the `facetStats` object.

Meilisearch ignores string values like `"21"` when computing `facetStats`.

The following response shows the `facetStats` when searching for `led`:

```json
{
  …
  "facetStats":{
    "rating":{
      "min":0.0,
      "max":5.0
    }
  }
  …
}  
```

Since `rating` was the only numeric facet in our example, it is returned in the `facetStats` object.

## Facet types

### Conjunctive facets

Conjunctive facets use the `AND` logical operator. When users select one or more values for a facet, all returned results must contain the selected facet value(s).

With conjunctive facets, when a user selects `English` from the `languages` facet, all returned books must be in English. If the user further narrows down the search by selecting `Fiction` and `Literature` as `genres`, all returned books must be in English and contain both `genres`.

```
["languages = English", "genres = Fiction", "genres = Literature"]
```

The GIF below shows how the facet count for `genres` updates to only include books that meet **all three conditions**.

![Selecting English books with 'Fiction' and 'Literature' as 'genres' for the books dataset](/faceted-search/conjunctive-factes.gif)

### Disjunctive facets

Disjunctive or multi-select facets use the `OR` logical operator. They allow users to choose multiple options within a facet, so they don’t have to perform more than one search to find the products they’re looking for.

Let's look at the `books` index from before with disjunctive facets. When the user selects `Fiction` and `Literature` as `genres`, Meilisearch returns all books that are either `Fiction`, `Literature`, or both:

```
[["genres = Fiction", "genres = Literature"]]
```

The GIF below shows the same dataset as before, but with disjunctive facets. Notice how the facet count for `genres` remains the same regardless of selection.

![Selecting 'Fiction' and 'Literature' as 'genres' for the books dataset](/faceted-search/default-disjunctive.gif)

To learn more about implementing faceting and filtering, check out our [ecommerce demo](https://github.com/meilisearch/ecommerce-demo).
