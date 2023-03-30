---

sidebarDepth: 2

---

# Faceted search

You can use Meilisearch filters to build faceted search interfaces. This type of interface allows users to refine search results based on broad categories or facets. Faceted search provides users with a quick way to narrow down search results by selecting categories relevant to what they are looking for. A faceted navigation system is an **intuitive interface to display and navigate through content**.

Facets are common in ecommerce sites like Amazon. When users search for products, they are presented with a list of results and a list of facets which you can see on the sidebar in the image below:

![Meilisearch demo for an ecommerce website displaying faceting UI](/faceted-search/facets-ecommerce.png)

Faceted search interfaces often have a count of how many results belong to each facet. This gives users a visual clue of the range of results available for each facet.

### Filters or facets

Meilisearch does not differentiate between facets and filters. Facets are a specific use-case of filters, meaning you can use any attribute added to `filterableAttributes` as a facet. Whether something is a filter or a facet depends above all on UX and UI design.

## Configuring and using facets

Like any other filter, you must add any attributes you want to use as facets to the [`filterableAttributes`](/reference/api/settings.md#filterable-attributes) list in an index's settings. Once you have configured `filterableAttributes`, you can search for facets with [the `facets` search parameter](/reference/api/search.md#facets).

::: warning
Synonyms don't apply to facets. If you have `SF` and `San Francisco` set as synonyms, faceting by `SF` and `San Francisco` will show you different results.
:::

Suppose you have a <a id="downloadBooks" href="/books.json" download="books.json">books dataset</a> containing the following fields:

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

The response would return `classic` books along with two new fields: [`facetDistribution`](#facet-distribution) and [`facetStats`](#facet-stats):

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

The `facetDistribution` object contains the number of matching documents distributed among the values of a given facet. Meilisearch automatically adds `facetDistribution` to the response of any query using the `facets` search parameter.

The following response shows the facet distribution when searching for `classics`:

```json
{
  …
 "facetDistribution":{
    "genres":{
      "Classics":6,
      "Comedy":1,
      "Coming-of-Age":1,
      "Fantasy":2,
      "Fiction":8,
      …
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

`facetDistribution` contains an object for every attribute passed to the `facets` parameter. Each object contains the different values for that attribute and the count of matching documents with that value. Meilisearch does not return empty facets: if there are no results for the Arabic language, it will not be present in `facetDistribution`.

::: note
By default, `facets` returns a maximum of 100 facet values for each faceted field. You can change this value using the `maxValuesPerFacet` property of the [`faceting` index settings](/reference/api/settings.md#faceting).
:::

### Facet stats

When using the `facets` parameter, Meilisearch results include a `facetStats` object. `facetStats` contains the lowest (`min`) and highest (`max`) numerical values across all documents in each facet.

`facetStats` is useful when creating UI components such as range sliders. These allow users to refine their search by selecting from a range of facet values.

::: note
Meilisearch ignores numeric strings like `"21"` when computing `facetStats`.
:::

The following response shows the lowest and highest book ratings when searching for `"classic"`:

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

If none of the matching documents have a numeric value for a facet, that facet is not included in the `facetStats` object. Since `rating` was the only numeric facet in our example, it is the only facet returned in the `facetStats` object.

## Facet types

### Conjunctive facets

Conjunctive facets use the `AND` logical operator. When users select multiple values for a facet, returned results must contain all selected facet values.

With conjunctive facets, when a user selects `English` from the `language` facet, all returned books must be in English. If the user further narrows down the search by selecting `Fiction` and `Literature` as `genres`, all returned books must be in English and contain both `genres`.

```
"language = English AND genres = Fiction AND genres = Literature"
```

The GIF below shows how the facet count for `genres` updates to only include books that meet **all three conditions**.

![Selecting English books with 'Fiction' and 'Literature' as 'genres' for the books dataset](/faceted-search/conjunctive-factes.gif)

### Disjunctive facets

Disjunctive facets use the `OR` logical operator. When users select multiple values for a facet, returned results must contain at least one of the selected values.

With disjunctive facets, when a user selects `Fiction`, and `Literature`, Meilisearch returns all books that are either `Fiction`, `Literature`, or both:

```
"genres = Fiction OR genres = Literature"
```

The GIF below shows the `books` dataset with disjunctive facets. Notice how the facet count for `genres` updates based on the selection.

![Selecting 'Fiction' and 'Literature' as 'genres' for the books dataset](/faceted-search/disjunctive_facets.gif)

### Combining conjunctive and disjunctive facets

It is possible to create search queries with both conjunctive and disjunctive facets.

For example, a user might select `English` and `French` from the `language` facet so they can see books written either in English or in French. This query uses an `OR` operator and is a disjunctive facet:

```
"language = English OR language = French"
```

The same user might also be interested in literary fiction books and select `Fiction` and `Literature` as `genres`. Since the user wants a specific combination of genres, their query uses an `AND` operator:

```
"genres = Fiction AND genres = Literature"
```

The user can combine these two filter expressions in one by wrapping them in parentheses and using an `AND` operator:

```
"(language = English OR language = French) AND (genres = Fiction AND genres = Literature)"
```

The GIF below shows the `books` dataset with conjunctive and disjunctive facets. Notice how the facet count for each facet updates based on the selection.

![Selecting 'Fiction' and 'Literature' as 'genres' for English books](/faceted-search/conjunctive-and-disjunctive-facets.gif)
