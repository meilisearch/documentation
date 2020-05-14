# Faceted Search

Faceted search is a feature provided out-of-the-box by MeiliSearch. Faceting allows to classify search results into categories that are called **facets**.

> For a movie, its title, director, and its release date can be used as facets.

The user can then narrow down search results by selecting facets, which is similar to applying filters to refine the results.

Both faceting and filtering help narrow down the search results. However, **faceting differs from [filtering](/guides/advanced_guides/filtering.md)**.

Faceted attributes **must be declared at indexing time**.

## Using Facets

In order to implement the all new facets, we at meilisearch have added a new attribute `attributesForFaceting`. With the default value of `Null` it accepts `[String]`.
It should be noted that passing an empty array will recet all faceting attribute in other words any call to settings with a value for the attribute attributesForFaceting overwrites the currently set faceting attributes.

A call to [POST]/indexes/:index_uid/settings should list the currently set facets.

## Using Search Query

When doing a search query, you can specify:

1. The facets to filter on with the facet syntax (explained below), thanks to the optional parameter facetFilters.
2. the facets for which to retrieve the matching count for, with the facets optional parameter.

## Syntax

The syntax for passing arguements through facetFilters is `["facetName:facetValue"] or [["FacetName:FacetValue"]]`

### Example

`[["color:red", "color:blue"], "kind:t-shirt"] <=> ("color:red" OR "color:blue") AND "kind:t-shirt"`
inner arrays elements are `OR`ed together, outer array elements are `AND`ed together.
> Array depth must not be greater than 2, and be at least 1.

Errors are sent to the user on:

  1. Incorrect syntax usage`[["color:red"]]` and `["color:red"]` are examples correct syntax while `"color:red"` is incorrect.
  2. Faceting on existing facets. It is asked of the user to do faceting on an unregistered or not existing facet. (we could send the list of existing facets to the user).

The facets accepts a `[String]` containing all the facets for which we want to retrieve count information. It defaults to `Null`. If it is set to `["*"]`, counts for all facets set above will be returned. It will return facets based on a best effort to match the user request. If a facet name is not existing it will be ignored.

## Additional fields

The result of the search query contains two additional fields if the `facets` parameter has been set:

  1. `Facets`: returning a count of candidates for each requested facets in the facets parameter, if set to `[*]` a count for all facets is returned.
  2. `ExhaustiveFacetsCount` telling whether the above count is exhaustive or approximative.
