# Faceted Search

**Faceted search** is a feature provided out-of-the-box by MeiliSearch. Faceting allows classifying search results into categories that are called **facets**.

> For a movie, its director, or its genre can be used as facets.

A faceted search system provides users with a simple way to narrow down search results by selecting facets. A faceted navigation system is an **intuitive interface to display and navigate through content**. The facets are placed in the UI as filters which users can apply to refine the results in real-time.
When users perform a search, they are presented with a list of results and a list of facets (i.e., categories) as below:

![Amazon UI](/faceted-search/facets-amazon.png)
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

Any POST request on the `settings` route with the `attributesForFaceting` parameter set will overwrite the current value for `attributesForFaceting`: passing an empty array will remove all defined faceted attributes.

[Learn more about `attributesForFaceting` in the settings](/guides/advanced_guides/settings.md#attributes-for-faceting)

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
          "genres"
      ]
  }'
```

## Using facets

By introducing facets to MeiliSearch, new search query parameters were also added:

- `facetFilters`:  Narrows the selection on which to search.
- `facetsDistribution`: Returns the number of matching documents distributed amongst all the values of a given facet.

### The facet filters

Because facets relate specifically to a set of documents, they give an overview of the records and help to understand what kind of information can be searched. Facets then help users navigate through their search results.

![Amazon movies](/faceted-search/facets-akira.png)
> You can select multiple categories on Amazon.

They can filter on facets to narrow down their results based on criteria with the `facetFilters` attribute.

[Learn more about `facetFilters` in the search parameters](/guides/advanced_guides/search_parameters.md#facet-filters)

### The facets distribution

Facet distribution returns the number of matching documents distributed amongst all the values of a given facet.

> After a search in a movie dataset, the number of films found in all the different genres is the facet distribution of the `genres` facet.

In the example below, on [IMDb](https://www.imdb.com), the number in parentheses matches how many search results each facet relates to.

![IMDb facets](/faceted-search/facets-imdb.png)
> If a user searches Fantasy, Animation, Adventure movies, and TV shows, they will know there are 826 TV series and 137 video games matching their criteria.

Since the users can have a visual clue about the range of categories available in the UI, they can easily know how many search results are found for each category.

To get the facets distribution, you have to specify a list of facets for which to retrieve the count of matching documents using the `facetsDistribution` attribute.

[Learn more about `facetsDistribution` in the search parameters](/guides/advanced_guides/search_parameters.md#the-facets-distribution)

## Walkthrough

Follow these steps to get started with faceting.

Suppose that you manage a movie database. The first thing to do is to declare faceted attributes as follows:

```bash
$ curl \
  -X POST 'http://localhost:7700/indexes/movies/settings' \
  --data '{
      "attributesForFaceting": [
          "director",
          "producer",
          "genres",
          "production_companies"
      ]
  }'
```

In the above example, `director`, `producer`, `genres` and `production_companies` will be used as facets.

You can now search your documents and use query parameters.

You can filter on facets. For instance, say you want to get movies matching "thriller" classified as either horror **or** mystery **and** directed by Jordan Peele. You have to use the following CURL command:

```bash
$ curl --get 'http://localhost:7700/indexes/movies/search' \
    --data-urlencode 'q=thriller' \
    --data-urlencode 'facetFilters=[["genres:Horror", "genres:Mystery"], "director:Jordan Peele"]'
```

You will get the following response:

```json
[
  {
    "id": 458723,
    "title": "Us",
    "director": "Jordan Peele",
    "genres": [
      "Thriller",
      "Horror",
      "Mystery"
    ],
    "overview": "Husband and wife Gabe and Adelaide Wilson take their kids to their beach house expecting to unplug and unwind with friends. But as night descends, their serenity turns to tension and chaos when some shocking visitors arrive uninvited.",
    "production_companies": [
      "Monkeypaw Productions"
    ],
...
  },
  {
    "id": 419430,
    "title": "Get Out",
    "director": "Jordan Peele",
    "genres": [
      "Mystery",
      "Thriller",
      "Horror"
    ],
    "overview": "Chris and his girlfriend Rose go upstate to visit her parents for the weekend. At first, Chris reads the family's overly accommodating behavior as nervous attempts to deal with their daughter's interracial relationship, but as the weekend progresses, a series of increasingly disturbing discoveries lead him to a truth that he never could have imagined.",
    "production_companies": [
      "Monkeypaw Productions"
    ],
...
  }
],
"offset": 0,
"limit": 20,
"nbHits": 2,
"exhaustiveNbHits": false,
"processingTimeMs": 4,
"query": "thriller"
```

Now, if you want to know what the number of Batman movies per genre is, you have to use the following CURL command:

```bash
$ curl --get 'http://localhost:7700/indexes/movies/search' \
    --data-urlencode 'q=Batman' \
    --data-urlencode 'facetsDistribution=["genres"]'
```

You will get the following response:

```json
[
  {
    "id": 2661,
    "title": "Batman",
    "director": "Leslie H. Martinson",
    "genres": [
      "Adventure",
      "Comedy"
    ],
    "overview": "The Dynamic Duo faces four super-villains who plan to hold the world for ransom with the help of a secret invention that instantly dehydrates people.",
    "production_companies": [
      "DC Comics"
    ],
...
  },
  {
    "id": 268,
    "title": "Batman",
    "director": "Tim Burton",
    "genres": [
      "Fantasy",
      "Action"
    ],
    "overview": "The Dark Knight of Gotham City begins his war on crime with his first major enemy being the clownishly homicidal Joker, who has seized control of Gotham's underworld.",
    "production_companies": [
      "PolyGram Filmed Entertainment"
    ],
...
  }
  ...
],
"offset": 0,
"limit": 20,
"nbHits": 1684,
"exhaustiveNbHits": false,
"processingTimeMs": 5,
"query": "Batman",
"facetsDistribution": {
  "genres": {
    "action": 273,
    "animation": 118,
    "adventure": 132,
    "fantasy": 67,
    "comedy": 475,
    "mystery": 70,
    "thriller": 217,
  }
}
```

In the above response, you can see a returned object `facetsDistribution` that contains the count of matching documents for each value of the `genres` attribute.
