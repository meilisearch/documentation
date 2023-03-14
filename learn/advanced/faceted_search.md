# Faceted search

Meilisearch filters can be used to build faceted search interfaces. This type of interface allows users to refine search results based on broad categories or facets. Faceted search provides users with a quick way to narrow down search results by selecting categories relevant to what they are looking for. A faceted navigation system is an **intuitive interface to display and navigate through content**. Facets are used in the UI as filters that users can apply to refine the results in real-time.

Done right, it’s like allowing users to find their way as they would in a physical store. Not only would users be able to find what they’re looking for, they can also see other relevant products you have. If your user is looking for a blanket, facets would ask questions like: What color do you want? Do you have a particular brand in mind? Any preferences for materials? How much are you willing to pay?

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
  "id": "711decb2a3fdcbbe44755afc5af25e2f",
  "title": "Kitchenex Stainless Steel Flatware Pie Server and Pie Cutter Set of 2",
  "description": "| The Kitchenex Stainless Pie Server|…",
  "url": "https://www.amazon.com/dp/B07D2LJFYW",
  "images": [
    "https://images-na.ssl-images-amazon.com/images/I/41AeR2oo75L._.jpg"
  ],
  "category": "Home & Kitchen",
  "brand": "Dr. Pet",
  "price": 16.84,
  "rating": 4.7,
  "reviews_count": 7,
}
```

The following code sample allows you to create facets for the `brand` and `rating` attributes:

<CodeSamples id="faceted_search_update_settings_1" />

The response shows `pie server` products along with two new fields: `facetDistribution` and `facetStats`:

```json
{
  "hits":[
    …
  ],
  "query":"pie server",
  "processingTimeMs":9,
  "limit":20,
  "offset":0,
  "estimatedTotalHits":25,
  "facetDistribution":{
    "brand":{
      "All Things Rae Dunn":1,
      "BEERBONG .COM":1,
      "Dr. Pet":1,
      …
      "senover":1
    },
    "rating":{
      "0":7,
      …
      "4.8":1,
      "5":3
    },
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

The following response shows the facet distribution when searching for `pie server`:

```json
{
  …
  "facetDistribution":{
    "brand":{
      "All Things Rae Dunn":1,
      "BEERBONG .COM":1,
      "Dr. Pet":1,
      …
      "senover":1
    },
    "rating":{
      "0":7,
      …
      "4.8":1,
      "5":3
    }
  }
  …
}
```

`facetDistribution` contains an object for every given facet. For each of these facets, there is another object containing all the different values and the count of matching documents. Note that zero values will not be returned: if there are no `pie server` products by a certain brand, it is not displayed.

::: note
By default, `facets` returns a maximum of 100 facet values for each faceted field. You can change this value using the `maxValuesPerFacet` property of the [`faceting` index settings](/reference/api/settings.md#faceting).
:::

### Facet stats

When using the `facets` parameter, any matching documents with facets containing numeric values are displayed in a `facetStats` object. `facetStats` contains the numeric minimum (`min`) and maximum (`max`) values per facet for all documents matching the search query.

If none of the matching documents have a numeric value for a facet, that facet is not included in the `facetStats` object.

Meilisearch ignores string values like `"21"` when computing `facetStats`.

The following response shows the `facetStats` when searching for `pie server`:

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

Single-select facets allow the selection of a single value per facet. Using our `ecommerce` index, this means if you have a facet for `brand` with the values `BrandA`, `BrandB`, and `BrandC`. Single select facets will allow you to view products from one brand at a time. If you want to view `BrandA` and `BrandB` products, you will have to try both searches individually. If you want to further narrow down results using the `reviews` facet, you would need to do so separately for both brands.

### Multi-select facets

Multi-select facets allow users to choose multiple options within a facet so they don’t have to perform more than one search to find the products they’re looking for.

With single select facets, if a user selects `BrandA` for the `brands` facet, they will see it offers 5 products, nothing more. But with multi-select facets, we want to show users how many products `BrandB` and `BrandC` offer even when they're not selected. This way the user knows if other brands offer similar products and can view products from multiple brands at the same time.

The image below shows multi-select facets in action. Even though the user selected the `Lithonia Lighting` and `Sunlite` brands when searching for `LED`, they can see other brands and how many LED products they have.

![Meilisearch demo for multi-select facets searching for 'LED'](/faceted-search/facets-multi-select.png)
