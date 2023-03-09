# Faceted search

Meilisearch filters can be used to build **faceted search** interfaces. This type of interface allows users to refine search results based on broad categories or **facets**. For example, a clothing webshop can use faceted search to allow users to easily explore items of a certain size or belonging to a specific brand.

Faceted search provides users with a quick way to narrow down search results by selecting categories relevant to what they are looking for. A faceted navigation system is an **intuitive interface to display and navigate through content**. Facets are used in the UI as filters that users can apply to refine the results in real-time.

This is common in ecommerce sites like Amazon. When users perform a search, they are presented not only with a list of results but also with a list of facets which you can see on the sidebar in the image below:

![Meilisearch demo for an ecommerce website displaying faceting UI](/faceted-search/facets-ecommerce.png)

Faceted search interfaces often have a count of how many results belong to each facet. This gives users a visual clue of the range of results available for each facet.

### Filters or facets

In Meilisearch, facets are a specific use-case of filters. The question of whether something is a filter or a facet is mostly one pertaining to UX and UI design.

## Configuring and using facets

Like any other filter, attributes you want to use as facets must be added to the [`filterableAttributes` list](/reference/api/settings.md#filterable-attributes) in the index's settings before they can be used.

Once they have been configured, you can search for facets with [the `facets` search parameter](/reference/api/search.md#facets).

::: warning
Synonyms don't apply to facets. Meaning, if you have `SF` and `San Francisco` set as synonyms, filtering by `SF` and `San Francisco` will show you different results.
:::

::: note
Meilisearch does not differentiate between facets and filters. This means that, despite its name, `facets` can be used with any attributes added to `filterableAttributes`.
:::

### Facet distribution

Using `facets` will add an extra field,`facetDistribution`, to the returned search results containing the number of matching documents distributed among the values of a given facet. The `facets` search parameter expects an array of strings. Each string is an attribute present in the `filterableAttributes` list.

The following search query gives you the distribution of `batman` movies per genre:

<CodeSamples id="faceted_search_facets_1"/>

```json
{
  "hits": [
    …
  ],
  …
  "facetDistribution": {
    "genres": {
      "action": 273,
      "animation": 118,
      "adventure": 132,
      "fantasy": 67,
      "comedy": 475,
      "mystery": 70,
      "thriller": 217
    }
  }
}
```

`facetDistribution` contains an object for every given facet. For each of these facets, there is another object containing all the different values and the count of matching documents. Note that zero values will not be returned: if there are no `romance` movies matching the query, `romance` is not displayed.

::: note
By default, `facets` returns a maximum of 100 facet values for each faceted field. You can change this value using the `maxValuesPerFacet` property of the [`faceting` index settings](/reference/api/settings.md#faceting).
:::
