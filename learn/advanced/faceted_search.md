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

Suppose you have an ecommerce dataset called `ecommerce` containing the following fields:

```json
{
  "id": "1",
  "title": "Kitchenex Stainless Steel Flatware Pie Server and Pie Cutter Set of 2",
  "description": "| The Kitchenex Stainless Pie Server|…",
  "category": "Home & Kitchen",
  "brand": "Dr. Pet",
  "price": 16.84,
  "rating": 4.7,
  "reviews_count": 7,
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

### Single select facets

Single-select or conjunctive facets use the `AND` logical operator. They only allow the selection of a single value per facet.

Suppose your `ecommerce` index contains a facet for `brand` with the values `BrandA`, `BrandB`, and `BrandC`. Single select facets will allow you to view products from one brand at a time. If you want to view `BrandA` and `BrandB` products, you will have to try both searches individually. If you want to further narrow down results using the `reviews` facet, you would need to do so separately for both brands.

The image below shows single-select facets in action. When the user searches for `led` and selects `Sunlite`, other brands are no longer visible.

![Meilisearch demo for single-select facets searching for 'LED'](/faceted-search/facets-single-select.png)

The code sample below shows the query for the search mentioned above:

<CodeSamples id="faceted_search_conjunctive_facets_1" />

### Multi-select facets

Multi-select or disjunctive facets use the `OR` logical operator. They allow users to choose multiple options within a facet so they don’t have to perform more than one search to find the products they’re looking for. You can use the `AND` operator to allow users to select different facets. For example, LED lights from the  brand `Sunlite` within the `Tools & Home Improvement` category:

<CodeSamples id="faceted_search_disjunctive_facets_1" />

With single select facets, if a user selects `BrandA` for the `brands` facet, they will see it offers 5 products, nothing more. But with multi-select facets, we want to show users how many products `BrandB` and `BrandC` offer even when they're not selected. This lets the user know if other brands offer similar products and allows them to view products from multiple brands at the same time.

The image below shows multi-select facets in action. Even though the user selected the `Lithonia Lighting` and `Sunlite` brands when searching for `LED`, they can see other brands and how many LED products they have.

![Meilisearch demo for multi-select facets searching for 'LED'](/faceted-search/facets-multi-select.png)

The code sample below shows the query for the search mentioned above:

<CodeSamples id="faceted_search_disjunctive_facets_2" />

To learn more about implementing faceting and filtering, check out our [ecommerce demo](https://github.com/meilisearch/ecommerce-demo).
