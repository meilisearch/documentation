# Chapter 3: Adding a visual UI

This chapter will introduce you to customizing your search bar environment along with search parameters and faceted search interfaces.

## Instant MeiliSearch

The Instant MeiliSearch plugin let's your MeiliSearch instance communicate with the open-source [InstantSearch](https://github.com/algolia/instantsearch.js) tools for your front-end application. InstantSearch is an open-source library powered by Algolia and provides all the front-end tools you need to highly customize your search bar environment.

You can read more on installing and using it [here](https://github.com/meilisearch/instant-meilisearch#instant-meilisearch).

## Manipulating results

Even though the search is relevant by default, MeiliSearch offers many parameters that you can play with to refine your search or change the format of the returned document.

This section covers some of the important search parameters but you can read about all of them in our [search parameters guide](/reference/features/search_parameters.md).

### attributesToCrop

By default, MeiliSearch responses return the entire value of all attributes. You can use the `attributesToCrop` parameter to crop `n` bytes in either direction of the selected attributes.

Let's take `overview` as an example, MeiliSearch will return the whole value for it. If you want to crop  `5` bytes in either direction, you can use:

<CodeSamples id= "getting_started_attributesToCrop_md" />

You will get the following response with the cropped text in the `_formatted` object:

```json
{
  "id":"543878",
  "title":"Peppa Pig: Festival of Fun",
  "poster":"https://image.tmdb.org/t/p/w500/tZgQ76hS9RFIwFyUxzctp1Pkz0N.jpg",
  "overview":"Join the party with Peppa and George in their brand new adventures as they dance in the mud at a children’s festival, celebrate Grandpa Pig’s birthday at a restaurant for the first time, and take a trip to the cinema to see Super Potato’s big movie feature!",
  "release_date":1554426000,
  "genres":
  [
    "Animation",
    "Family"
    ],
    "_formatted": {
      "id":"543878",
      "title":"Peppa Pig: Festival of Fun",
      "poster":"https://image.tmdb.org/t/p/w500/tZgQ76hS9RFIwFyUxzctp1Pkz0N.jpg",
      "overview":"children’s festival",
      "release_date":"1554426000",
      "genres":
      [
        "Animation",
        "Family"
        ]
        }
}
```

### attributesToHighlight

This highlights matching query terms in the specified attributes by enclosing them in `<em>` tags. `attributesToHighlight` only works on strings, numbers, arrays, and objects.

When this parameter is set, returned documents include a `_formatted` object containing the highlighted terms.

<CodeSamples id= "getting_started_attributesToHighlight_md" />

```json
{
  "id":"471335",
  "title":"Cheese in the Trap",
  "poster":"https://image.tmdb.org/t/p/w500/jG1nfIvkSpwlEt2EeAG6oGFKyqY.jpg",
  "overview":"Movie is based on the popular webcomic “Cheese in the Trap” by Soonkki which was previously adapted in the 2016 television drama series “Cheese in the Trap.”",
  "release_date":1520985600,
  "genres":[
    "Romance",
    "Drama",
    "Thriller"
    ],
    "_formatted": {
      "id":"471335",
      "title":"Cheese in the Trap",
      "poster":"https://image.tmdb.org/t/p/w500/jG1nfIvkSpwlEt2EeAG6oGFKyqY.jpg",
      "overview":"Movie is based on the popular webcomic “<em>Cheese</em> in the Trap” by Soonkki which was previously adapted in the 2016 television drama series “<em>Cheese</em> in the Trap.”","release_date":"1520985600",
      "genres":
      [
        "Romance",
        "Drama",
        "Thriller"
        ]
        }
}
```

### limit

The `limit` decides the maximum number of documents MeiliSearch returns for a query. The default is `20` but you can change it.

If you search the `movies` index for `bear`, MeiliSearch will return the first 20 movies. If you were to update the limit to `10`:

<CodeSamples id= "getting_started_limit_md" />

MeiliSearch would now return the first ten results.

## Faceted search

You can use MeiliSearch filters to build faceted search interfaces. This allows users to refine search results based on broad categories or facets.

Faceted navigation systems are intuitive interfaces for displaying and navigating through content. Facets are used in the UI as filters which users can apply to refine the results in real-time.
