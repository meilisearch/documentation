# Chapter 3: Adding a visual UI

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

}
```

### attributesToHighlight

This highlights matching query terms in the specified attributes by enclosing them in `<em>` tags. `attributesToHighlight` only works on strings, numbers, arrays, and objects.

When this parameter is set, returned documents include a `_formatted` object containing the highlighted terms.

<CodeSamples id= "getting_started_attributesToHighlight_md" />

```json
{
  "id": "50393",
  "title": "Kung Fu Panda Holiday",
  "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
  "overview": "The Winter Feast is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal Winter Feast at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
  "release_date": 1290729600,
  "_formatted": {
    "id": "50393",
    "title": "Kung Fu Panda Holiday",
    "poster": "https://image.tmdb.org/t/p/w1280/gp18R42TbSUlw9VnXFqyecm52lq.jpg",
    "overview": "The <em>Winter Feast</em> is Po's favorite holiday. Every year he and his father hang decorations, cook together, and serve noodle soup to the villagers. But this year Shifu informs Po that as Dragon Warrior, it is his duty to host the formal <em>Winter Feast</em> at the Jade Palace. Po is caught between his obligations as the Dragon Warrior and his family traditions: between Shifu and Mr. Ping.",
    "release_date": 1290729600
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
