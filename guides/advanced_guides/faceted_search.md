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

The first step in using facets is to chose which of your document <clientGlossary word="field" label="fields"/> will be used as facets. Fields with common values are the best suited for faceting (e.g., `genre`, `color`, `size` ).

For these fields to be used as facets during search, their <clientGlossary word="attribute" label="attributes"/> **must have been previously added to the settings**. In the settings, the chosen attributes must be added to the [`attributesForFaceting` list](/guides/advanced_guides/settings.md#attributes-for-faceting).
This step is required because facet needs to be properly processed and prepared by the engine to be usable. This process takes as much time as indexing all your documents.

You can perform faceting on attributes that are either `String` or `[String]`, and `null` values are ignored.
If a facet value in a given document is **not** of type `string`, or `[String]`, or `null`, the transaction will stop and raise an error.

[References for `attributesForFaceting` in the settings](/guides/advanced_guides/settings.md#attributes-for-faceting)

#### Example

Suppose that you have a collection of movies containing the following fields:

```json
[
  {
      "id": "458723",
      "title": "Us",
      "director": "Jordan Peele",
      "genres": [
        "Thriller",
        "Horror",
        "Mystery"
      ],
      "overview": "Husband and wife Gabe and Adelaide Wilson take their...",
  },
  ...
]
```

To be able to facet search on `director` and `genres`, you would declare faceted attributes as follows:

<code-samples id="faceted_search_update_settings_1" />

## Using facets

By introducing facets to MeiliSearch, new search query parameters were also added:

- `facetFilters`:  Narrows the selection on which to search.
- `facetsDistribution`: Returns the number of matching documents distributed amongst all the values of a given facet.

### The facet filters

Because facets relate specifically to a set of documents, they give an overview of the records and help to understand what kind of information can be searched. Facets then help users navigate through their search results.

![Amazon movies](/faceted-search/facets-akira.png)
> You can select multiple categories on Amazon.
They can filter on facets to narrow down their results based on criteria with the `facetFilters` attribute.

#### Usage

`facetFilters` is a query parameter added on search request. It expects a string or an array of strings containing the facetFilter information. Each string is composed of a `facetName`, a colon, and a `facetValue`.

`facetFilters=["facetName:facetValue"]` or `facetFilters=[["facetName:facetValue"]]`

- `facetName`: The name (the attribute) of a field used as a facet (e.g. `director`, `genres`). This attribute must be [in the `attributesForFiltering` list](/guides/advanced_guides/faceted_search.md#setting-up-facets).
- `facetValue`: The value of the facet used to filter results (e.g. `Tim Burton`, `Mati Diop`, `Comedy`, `Romance`).

Facet filters can have a **maximum array depth of two**.

The following are correct:

good ✅

```javascript
"genre:horror"
```

good ✅

```javascript
["genre:horror", "genre:thriller"]
```

good ✅

```javascript
["genre:comedy", ["genre:horror", "genre:thiller"]]
```

If the maximum array depth is exceeded, errors will be raised:
error ❌

```javascript
["genre:comedy", ["genre:horror", ["genre:romance"]]]
```

error ❌

```javascript
[[["genre:romance"]]]
```

Facet filters can have a **maximum array deepness of two**.

The following are correct:

good ✅

```javascript
"genre:horror"
```

good ✅

```javascript
["genre:horror", "genre:thriller"]
```

good ✅

```javascript
["genre:comedy", ["genre:horror", "genre:thiller"]]
```

When you add one more array deepness, it will raise errors:
error ❌

```javascript
["genre:comedy", ["genre:horror", ["genre:romance"]]]
```

error ❌

```javascript
[[["genre:romance"]]]
```

#### Logical Connectives

Inputting a double dimensional array allows you to use **logical connectives**.

- **Inner arrays elements** are connected by an `OR` operator (e.g. `[["genres:Comedy", "genres:Romance"]]`).
- **Outer arrays elements** are connected by an `AND` operator (e.g. `["genres:Romance", "director:Mati Diop"]`).

You can mix connectives, for instance, the following array:

```json
[["genres:Comedy", "genres:Romance"], "director:Mati Diop"]
```

Can be translated as:

```SQL
("genres:Comedy" OR "genres:Romance") AND "director:Mati Diop"
```

#### Example

Suppose you have declared `director` and `genres` as [faceted attributes](/guides/advanced_guides/settings.md#attributes-for-faceting), and you want to get movies matching "thriller" classified as either horror **or** mystery **and** directed by Jordan Peele.

```SQL
("genres:Horror" OR "genres:Mystery") AND "director:Jordan Peele"
```

Querying on "thriller", the above example results in the following CURL command:

<code-samples id="faceted_search_facet_filters_1" />

And you would get the following response:

```json
{
  "hits": [
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
    }
  ],
  ...
  "nbHits": 2,
  "exhaustiveNbHits": false,
  "query": "thriller"
}
```

### The facets distribution

Facet distribution returns the number of matching documents distributed amongst all the values of a given facet.

> After a search in a movie dataset, the number of films found in all the different genres is the facet distribution of the `genres` facet.
In the example below, on [IMDb](https://www.imdb.com), the number in parentheses represents the count of search results each facet is associated to.

![IMDb facets](/faceted-search/facets-imdb.png)
> If a user searches Fantasy, Animation, Adventure movies, and TV shows, they will know there are 826 TV series and 137 video games matching their criteria.
Since the users can have a visual clue about the range of categories available in the UI, they can easily know how many search results are found for each category.

To get the facets distribution, you have to specify a list of facets for which to retrieve the count of matching documents using the `facetsDistribution` attribute.

The `facetsDistribution` parameter also introduces `exhaustiveFacetsCount` in the return object. `exhaustiveFacetsCount` is a boolean value that informs the user whether or not the facets distribution is matching the reality or if it is an approximation.
The approximative facet count happens when there are too many documents in too many different facet values. In which case, MeiliSearch stops the distribution count to prevent considerably slowing down the request.

#### Usage

`facetsDistribution` is a query parameter added on a search request. It expects an array of strings. Each string is an attribute present in the `attributesForFiltering` list.

Upon search, when using the `facetDistribution` parameter, there will be a `facetDistribution` key in the returned object. It contains an object for every facet given. For each of these facets, another object containing all the different values and the count of matching document found with this value. This is called the distribution.

```json
{
  "exhaustiveFacetsCount": true,
  "facetsDistribution" : {
    "genres" : {
      "horror": 50,
      "comedy": 34,
      "romantic": 0
    }
  }
}
```

#### Example

Given a movie database, suppose that you want to know what the number of Batman movies per genre is. You would use the following CURL command:

<code-samples id="faceted_search_facets_distribution_1"/>

And you would get the following response:

```json
{
  "hits": [
    {
      "id": 2661,
      "title": "Batman",
      "director": "Leslie H. Martinson",
      "genres": [
        "Adventure",
        "Comedy"
      ],
      "overview": "The Dynamic Duo faces four super-villains who plan to hold the world fo  r ransom with the help of a secret invention that instantly dehydrates people.",
    },
    {
      "id": 268,
      "title": "Batman",
      "director": "Tim Burton",
      "genres": [
        "Fantasy",
        "Action"
      ],
      "overview": "The Dark Knight of Gotham City begins his war on crime with his first major enemy being the clownishly homicidal Joker, who has seized control of Gotham's underworld."
    }
    ...
  ],
  ...
  "nbHits": 1684,
  "query": "Batman",
  "exhaustiveFacetsCount": true,
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
}
```

## Walkthrough

With this walkthrough, you will go through each step to successfully add facets and faceted search.

Suppose that you manage a movie database on which you want to search by `genres`, `producer`, `production_companies` and `directors`.

The first thing to do is to declare faceted attributes as follows:

<code-samples id="faceted_search_walkthrough_attributes_for_faceting_1" />

In the above example, `director`, `producer`, `genres` and `production_companies` will be used as facets.

You can now search your documents and use query parameters.

You can filter on facets. For instance, say you want to get movies matching "thriller" classified as either horror **or** mystery **and** directed by Jordan Peele. You have to use the following CURL command:

<code-samples id="faceted_search_walkthrough_facet_filters_1" />

You will get the following response:

```json
{
  "hits": [
    {
      "id": 458723,
      "title": "Us",
      "director": "Jordan Peele",
      "genres": [
        "Thriller",
        "Horror",
        "Mystery"
      ],
      "overview": "Husband and wife Gabe and Adelaide Wilson take their kids to their beach house expecting to unplug and unwind with friends. But as night descends, their serenity turns to tension and chaos when some shocking visitors arrive uninvited."
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
      "overview": "Chris and his girlfriend Rose go upstate to visit her parents for the weekend. At first, Chris reads the family's overly accommodating behavior as nervous attempts to deal with their daughter's interracial relationship, but as the weekend progresses, a series of increasingly disturbing discoveries lead him to a truth that he never could have imagined."
    }
  ],
  "nbHits": 2,
  "exhaustiveNbHits": false,
  "query": "thriller"
}
```

Now, if you want to know what the number of Batman movies per genre is, you have to use the following CURL command:

<code-samples id="faceted_search_walkthrough_facets_distribution_1" />

You will get the following response:

```json
{
  "hits": [
    ...
  ],
  ...
  "nbHits": 1684,
  "query": "Batman",
  "exhaustiveFacetsCount": true,
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
}
```

In the above response, you can see a returned object `facetsDistribution` that contains the count of matching documents for each value of the `genres` attribute.
