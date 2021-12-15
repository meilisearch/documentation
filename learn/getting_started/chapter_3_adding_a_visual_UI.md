# Chapter 3: Adding a visual UI

## Instant MeiliSearch

The Instant MeiliSearch plugin let's your MeiliSearch instance communicate with the open-source [InstantSearch](https://github.com/algolia/instantsearch.js) tools for your front-end application. InstantSearch is an open-source library powered by Algolia and provides all the front-end tools you need to highly customize your search bar environment.

You can read more on installing and using it [here](https://github.com/meilisearch/instant-meilisearch#instant-meilisearch).

## Manipulating results

Even though the search is relevant by default, MeiliSearch offers many parameters that you can play with to refine your search or change the format of the returned document.

This section covers some of the important search parameters but you can read about all of them in our [search parameters guide](/reference/features/search_parameters.md).

- Do want to mention these in any particular order?

### attributesToCrop

By default, MeiliSearch responses return the entire value of all attributes. You can use the `attributesToCrop` parameter to crop the value of selected attributes.

Let's take `overview` as an example, MeiliSearch will return the whole value for it. If you want to only view the first `10` bytes, you can use:

<CodeSamples id= "getting_started_attributesToCrop_md" />

You will get the following response with the cropped text in the `_formatted` object:

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
    "overview": "this year Shifu informs",
    "release_date": 1290729600
  }
}
```

### attributesToHighlight (Is this that important?)

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

If you search the `movies` index for `shifu`, MeiliSearch will return the first 20 movies. If you were to update the limit to `10`:

<CodeSamples id= "getting_started_limit_md" />

MeiliSearch would now return the first ten results.

## Faceted search

- can we use this with the interface?

**The following content is currently homeless:**

======================================================================

Placeholder search (this is a behavior needs to mentioned briefly)

If you make a search without inputting any query words, MeiliSearch will return all the documents in that index sorted by its custom [ranking rules](/reference/features/settings.md#ranking-rules) and [sorting rules](/reference/features/sorting.md#sorting). This feature is called placeholder search.

Phrase search (Don't know where this goes)

If you enclose search terms in double quotes ("), MeiliSearch will only return documents that contain those terms in the order they were given. This gives users the option to make more precise search queries.

======================================================================
