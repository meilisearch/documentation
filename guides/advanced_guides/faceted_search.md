# Faceted Search

**Faceted search** is a feature provided out-of-the-box by MeiliSearch. Faceting allows classifying search results into categories that are called **facets**.

> For a movie, its director, or its genre can be used as facets.

Because facets relate specifically to a set of documents, they give an overview of the records and help to understand what kind of information can be searched.

A faceted search system provides users with a simple way to narrow down search results by selecting facets. A faceted navigation system is an **intuitive interface to display and navigate through content**. The facets are placed in the UI as filters which users can apply to refine the results in real-time.
When users perform a search, they are presented with a list of results and a list of facets (i.e., categories) as below:

![Amazon UI](/faceted-search/amazon-facets.png)
> Faceted navigation on Amazon: facets are displayed on the left column.

## Filters or Facets?

Faceted search, also known as faceted navigation, is a technique that combines traditional search with a **faceted classification of items**.
Setting categorical document attributes as "facet" enables efficient filtering within the different categories. Such categorical attributes are, for example, movie genre, director, or language.
Besides, faceting is a powerful feature that allows building intuitive navigation interfaces.

Both faceting and filtering help drill down into a subset of search results. However, **faceting differs from [filtering](/guides/advanced_guides/filtering.md)**.

- **Filters** exclude some results based on criteria. They allow users to narrow down a set of documents to only those matching these chosen criteria. In other words, filtering is used to filter the returned results by adding constraints.
- **Facets**, on the other hand, are used to categorize the data into subsets that will be searched upon: they reduce the number of documents to process.

Faceting and filtering aim at being complementary;  facets narrows down the set of documents to be searched upon, while filters reduce the number of documents coming out of a search.

## Setting Up Facets

Attributes that could be used as facets **must be declared at indexing time**.

You can set up facets **through the API** via the [global settings route](/references/settings.md#update-settings).
Attributes for which to enable faceting are defined in the `attributesForFaceting` list.
Learn more about `attributesForFaceting` in **[the settings](/guides/advanced_guides/settings.md#attributes-for-faceting)**.

Any POST request on the `settings` route with the `attributesForFaceting` parameter set will overwrite the current value for `attributesForFaceting`: passing an empty array will remove all defined faceted attributes.

#### Example

Suppose that you have a collection of movies in the following JSON format:

```json
[
  {
      "id": "495925",
      "title": "Doraemon the Movie:Nobita's Treasure Island",
      "director": "Fujiko Fujio",
      "genre": "Science fiction",
      "poster": "https://image.tmdb.org/t/p/w1280/cmJ71gdZxCqkMUvGwWgSg3MK7pC.jpg",
      "overview": "The story is based on Robert Louis Stevenson's Treasure Island novel.",
      "release_date": 1520035200
  },
  {
      "id": "329996",
      "title": "Dumbo",
      "director": "Tim Burton",
      "genre": "Science fiction",
      "poster": "https://image.tmdb.org/t/p/w1280/279PwJAcelI4VuBtdzrZASqDPQr.jpg",
      "overview": "A young elephant, whose oversized ears enable him to fly, helps...",
      "release_date": 1553644800
  },
  {
      "id": "458723",
      "title": "Us",
      "director": "Jordan Peele",
      "genre": "Horror",
      "poster": "https://image.tmdb.org/t/p/w1280/ux2dU1jQ2ACIMShzB3yP93Udpzc.jpg",
      "overview": "Husband and wife Gabe and Adelaide Wilson take their...",
      "release_date": 1552521600
  },
  ...
]
```

To be able to facet search on `director` and `genre`, you would declare faceted attributes as follows:

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/settings' \
  --data '{
      "attributesForFaceting": [
          "director",
          "genre"
      ]
  }'
```

## Using facets

By introducing facets to MeiliSearch, new search query parameters were also added:

- `facetFilters`:  Narrows the selection on which to search.
- `facets`: Returns the number of matching documents distributed amongst all the values of a given facet.

### The facet filters

You can filter on facets to narrow down your results based on criteria with the `facetFilters` attribute.
Learn more about `facetFilters` in **[the search parameters](/guides/advanced_guides/search_parameters.md#facet-filters)**.

#### Example

Given a clothing dataset, suppose you want to retrieve all t-shirts with a nautical pattern. You would then use:

```bash
$ curl --get 'http://localhost:7700/indexes/clothing/search' \
    --data-urlencode 'q=nautical' \
    --data-urlencode 'facetFilters=["kind:t-shirt"]'
```

### The facets distribution

Since the users can have a visual clue about the range of categories available in the UI, they can easily know how many search results are found for each category.

In the example below, on the [snowleader.co.uk website](https://www.snowleader.co.uk), the number in parentheses matches how many search results each facet relates to.

![snowleader boot](/faceted-search/facets-dist-boot.png)
> When searching for "Boot", 791 outdoor boots have been found. If the user wants to buy outdoor boots, they can narrow down their search results by clicking the Outdoor category. Image from [snowleader.co.uk](https://www.snowleader.co.uk).

![snowleader ski pants](/faceted-search/facets-dist-pants.png)
> If a user is looking for ski pants available in XXL size, they can select the right size. Thus they won't waste their time looking at items they are not interested in buying. Image from [snowleader.co.uk](https://www.snowleader.co.uk).

To get the facets distribution, you have to specify a list of facets for which to retrieve the count of matching documents using the `facets` attribute.
Learn more about `facets` in **[the search parameters](/guides/advanced_guides/search_parameters.md#the-facets-distribution)**.

#### Example

Given a movie database, suppose that you want to know how many Batman movies are classified as `Action and Adventure`, how many of them are classified as `Animation` and what the number of Batman movies per director is. You would use the following CURL command:

```bash
$ curl --get 'http://localhost:7700/indexes/movies/search' \
    --data-urlencode 'q=Batman' \
    --data-urlencode 'facets=["genre", "director"]'
```
