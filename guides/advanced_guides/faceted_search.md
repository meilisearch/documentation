# Faceted Search

**Faceted search** is a feature provided out-of-the-box by MeiliSearch. Faceting allows classifying search results into categories that are called **facets**.

> For a movie, its title, its director, or its genre can be used as facets.

A faceted search system provides users with a simple way to narrow down search results by selecting facets. A faceted navigation system is an **intuitive interface to display and navigate through content**. The facets are placed in the UI as filters which users can apply to refine the results in real-time.
When users perform a search, they are presented with a list of results and a list of facets (i.e., categories) as below:

![Amazon UI](/amazon-facets.png)
> Faceted navigation on Amazon: facets are displayed on the left column.

## How does it work?

Faceted search, also known as faceted navigation, is a technique that combines traditional search with a **faceted classification of items**. Data is classified across multiple dimensions, called facets, so it can be accessed and ordered in multiple ways at a time. Document fields are used as categories such as title, author, director, language, description, release date, and so forth.
Faceting is a powerful feature that enables to build an intuitive navigation interface.

Both faceting and filtering help drill down into a subset of search results. However, **faceting differs from [filtering](/guides/advanced_guides/filtering.md)**.

- **Filters** exclude some results based on criteria. They allow users to narrow down a set of documents to only those matching these chosen criteria. In other words, filtering is used to filter the returned results by adding constraints.
- **Facets** are a subset of filtering. Facets are document fields used as categories and thus provide grouping capabilities to search for specific fields rather than every field. They allow users to narrow down a set of documents by multiple dimensions at a time.

## Setting Up Facets

Document attributes to use as facets **must be declared at indexing time**.

You can set up facets **through the API** via the [global settings route](/references/settings.md#update-settings).
You need to add the desired attributes to the `attributesForFaceting` list. This attribute accepts a `[String]` that specifies which attributes are used as facets, and defaults to `null`.

::: warning

Only fields of data type **string** or **array of strings** can be set up as facets.

:::

Any POST request on the `settings` route with a value set to `attributesForFaceting` will overwrite the current faceted attributes. Then, passing an empty array will reset all defined faceted attributes.

### Example

Given an index that contains information about movies, you can list the settings as follows:

```bash
$ curl \
  -X GET 'http://localhost:7700/indexes/movies/settings'
```

## Querying On Faceted Attributes

When performing a search, you can specify:

1. The facets to filter on with the facet syntax (explained below), thanks to the optional parameter `facetFilters`.
2. the facets for which to retrieve the matching count for, with the `facets` optional parameter.

## Additional fields

The result of the search query contains two additional fields if the `facets` parameter has been set:

  1. `Facets`: returning a count of candidates for each requested facets in the facets parameter, if set to `[*]` a count for all facets is returned.
  2. `ExhaustiveFacetsCount` telling whether the above count is exhaustive or approximative.

The syntax for passing arguements through facetFilters is `["facetName:facetValue"] or [["FacetName:FacetValue"]]`

### Example

`[["color:red", "color:blue"], "kind:t-shirt"] <=> ("color:red" OR "color:blue") AND "kind:t-shirt"`
inner arrays elements are `OR`ed together, outer array elements are `AND`ed together.
> Array depth must not be greater than 2, and be at least 1.

Errors are sent to the user on:

  1. Incorrect syntax usage`[["color:red"]]` and `["color:red"]` are examples correct syntax while `"color:red"` is incorrect.
  2. Faceting on existing facets. It is asked of the user to do faceting on an unregistered or not existing facet. (we could send the list of existing facets to the user).

The facets accepts a `[String]` containing all the facets for which we want to retrieve count information. It defaults to `Null`. If it is set to `["*"]`, counts for all facets set above will be returned. It will return facets based on a best effort to match the user request. If a facet name is not existing it will be ignored.
