# Chapter 1: Filtering and sorting

Welcome to the Meilisearch 101! This guide aims to introduce you to the main features of Meilisearch as efficiently as possible. It assumes that you have completed the [Quick start](/learn/getting_started/quick_start.md) and already have a running Meilisearch instance.

This chapter uses a dataset of meteors to demonstrate filtering, sorting, and geosearch. To follow along, first click this link to download the file: <a id="downloadMeteors" href="/meteors.json" download="meteors.json">meteors.json</a>. Then, move it into your working directory and run the following command:

<CodeSamples id="getting_started_add_meteors_md" />

## Settings

Every index contains a `settings` object that allows you to customize search behavior. Configuring this object is the first step to filtering and sorting your data.

The `settings` object contains two arrays for this purpose: `filterableAttributes` and `sortableAttributes`.

<CodeSamples id= "getting_started_configure_settings" />

>Running the above code sample should set you up for the next sections.

## Filtering

Meilisearch allows you to refine your search using filters. You can use any document fields for filtering by adding them to `filterableAttributes` as shown [above](#settings).

Let's say you only want to view meteors that weigh less than 200g:

<CodeSamples id= "getting_started_filtering_md" />

```json
{
  "hits":[
    {
      "name":"Aachen",
      "mass":21
    },
    {
      "name":"Emmaville",
      "mass":127
    },
    …
  ],
  "nbHits":114,
  "exhaustiveNbHits":false,
  "query":"",
  "limit":20,
  "offset":0,
  "processingTimeMs":0
}
```

Filtering is intended to be combined with search queries to refine your results.

To learn more about filters and how to configure them, refer to our [dedicated guide](/reference/features/filtering_and_faceted_search.md).

## Sorting

By default, Meilisearch orders results according to their relevancy. You can alter this sorting behavior as part of the search request, allowing users to decide which type of results they want to see first.

You can use any document field for sorting as long as it contains numbers, strings, arrays of numbers, or arrays of strings and has been added to `sortableAttributes` as shown [above](#settings).

Let's sort the meteors in the previous example based on mass:

<CodeSamples id= "getting_started_sorting_md" />

```json
{
  "hits":[
    {
      "name":"Silistra",
      "mass":0.15
    },
    {
      "name":"Hachi-oji",
      "mass":0.2
    },
    …
  ],
  "nbHits":114,
  "exhaustiveNbHits":false,
  "query":"",
  "limit":20,
  "offset":0,
  "processingTimeMs":1
  }
```

You will see all meteors weighing less than 200g sorted by increasing mass. To sort them in the opposite direction, you would use `mass:desc`.

Sorting is intended to be combined with search queries to refine your results.

To learn more about sorting and how to configure it, refer to our [dedicated guide](/reference/features/sorting.md).

## Geosearch

Meilisearch allows you to filter and sort results based on their geographic location. To use this feature, your documents need to have the `_geo` field, which must be added to `sortableAttributes` or `filterableAttributes` depending on your use case.

### Filtering by geographical location

Let's say you want to find out which meteors crashed within a 210km radius of Bern:

<CodeSamples id= "getting_started_geoRadius_md" />

```json
{
  "hits":[
  {
    "name":"Ensisheim",
    "id":"10039",
    "nametype":"Valid",
    "recclass":"LL6",
    "mass":"127000",
    "fall":"Fell",
    "year":"1492-01-01T00:00:00.000",
    "_geo": {
        "lat":47.86667,
        "lng":7.35
        }
  },
  {
    "name":"Épinal",
    "id":"10041",
    "nametype":"Valid",
    "recclass":"H5",
    "mass":"277",
    "fall":"Fell",
    "year":"1822-01-01T00:00:00.000",
    "_geo": {
        "lat":48.18333,
        "lng":6.46667
        }
  },
  …
  ],
  "nbHits":7,
  "exhaustiveNbHits":false,
  "query":"",
  "limit":20,
  "offset":0,
  "processingTimeMs":3
  }
  ```

### Sorting by geographical location

The following command sorts meteors by how close they were to the Taj Mahal:

<CodeSamples id= "getting_started_geoPoint_md" />

```json
{
  "hits":[
  {
    "name":"Nagaria",
    "id":"16892",
    "nametype":"Valid",
    "recclass":"Eucrite-cm",
    "mass":"20",
    "fall":"Fell",
    "year":"1875-01-01T00:00:00.000",
    "_geo": {
      "lat":26.98333,
      "lng":78.21667
      },
      "_geoDistance":27449
  },
  {
    "name":"Kheragur",
    "id":"12294",
    "nametype":"Valid",
    "recclass":"L6",
    "mass":"450",
    "fall":"Fell",
    "year":"1860-01-01T00:00:00.000",
    "_geo": {
      "lat":26.95,
      "lng":77.88333
      },
      "_geoDistance":29558
    },
  …
  ]
  "nbHits":1000,
  "exhaustiveNbHits":false,
  "query":"",
  "limit":20,
  "offset":0,
  "processingTimeMs":4
  }
```

This response returns an additional field, `_geoDistance`, representing the distance between the Taj Mahal and each meteor in meters.

To learn more about geosearch and how to configure it, refer to our [dedicated guide](/reference/features/geosearch.md).

The next chapter dives deeper into the `settings` object and how you can use it to fine-tune results.
