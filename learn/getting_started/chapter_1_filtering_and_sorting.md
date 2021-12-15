# Chapter 1: Filtering and sorting

## Filtering

MeiliSearch allows you to refine your search using filters. You can use any of the document fields for filtering by adding them to `filterableAttributes`.

Let's say you only want to view meteors that weigh less than 200g.

<CodeSamples id= "getting_started_filtering_md" />

```json
{"hits":[{"name":"Aachen","mass":21},{"name":"Emmaville","mass":127},{"name":"Erakot","mass":113},{"name":"Erevan","mass":107.2},{"name":"Fenghsien-Ku","mass":82},{"name":"Galapian","mass":132.7},{"name":"Galim (a)","mass":36.1},{"name":"Galim (b)","mass":28},{"name":"Garland","mass":102},{"name":"Grefsheim","mass":45.5},{"name":"Gurram Konda","mass":28},{"name":"Hachi-oji","mass":0.2},{"name":"Hotse","mass":180},{"name":"Hungen","mass":112},{"name":"Jamkheir","mass":22},{"name":"Jodzie","mass":30},{"name":"Kadonah","mass":89},{"name":"Karewar","mass":180},{"name":"Khetri","mass":100},{"name":"Kikino","mass":195}],"nbHits":114,"exhaustiveNbHits":false,"query":"","limit":20,"offset":0,"processingTimeMs":0}%
```

## Sorting

By default, MeiliSearch focuses on ordering results according to their relevancy. You can alter this sorting behavior so users can decide at search time what type of results they want to see first.

You can use any of the document fields as long as they contain numbers, strings, arrays of numeric values, or arrays of string values by adding them to `sortableAttributes`. Let's sort the meteors in the previous example  based on mass.

<CodeSamples id= "getting_started_sorting_md" />

```json
{"hits":[{"name":"Silistra","mass":0.15},{"name":"Hachi-oji","mass":0.2},{"name":"Chail","mass":0.5},{"name":"Delhi","mass":0.8},{"name":"Revelstoke","mass":1},{"name":"Natal","mass":1.4},{"name":"Perth","mass":2},{"name":"Niger (L6)","mass":3.3},{"name":"Niger (LL6)","mass":3.3},{"name":"Kusiali","mass":5},{"name":"Ras Tanura","mass":6.1},{"name":"Caratash","mass":8},{"name":"Cumulus Hills 04075","mass":9.6},{"name":"Patti","mass":12},{"name":"Piancaldoli","mass":13.1},{"name":"Bethlehem","mass":13.9},{"name":"Banswal","mass":14},{"name":"Barntrup","mass":17},{"name":"Bhagur","mass":18},{"name":"Red Canyon Lake","mass":18.41}],"nbHits":114,"exhaustiveNbHits":false,"query":"","limit":20,"offset":0,"processingTimeMs":1}%
```

You will see all meteors weighing less than 200g sorted based on increasing mass. If you use `mass:desc`, MeiliSearch will sort them based on decreasing mass.

To learn more about `sortableAttributes` and how to configure them, refer to our [dedicated guide](/reference/features/sorting.md).

## Geosearch

- Can't demonstrate this using a gif so I added the code sample and I don't like this
- Do I add the result for each query? If so, I need to fix the indentation
- Where do I link the dataset?

MeiliSearch allows you to filter and sort results based on their geographic location. To use this feature, your documents need to have the `_geo` field.

Let's say you want to find out the what meteors crashed within a 210km radius of Bern:

<CodeSamples id= "getting_started_geoRadius_md" />

You should get the following meteors:

```json
[
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
      "lng":7.35}
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
      "lng":6.46667}
  },
  {
    "name":"Menziswyl",
  "id":"15486",
  "nametype":"Valid",
  "recclass":"L5",
  "mass":"28.9",
  "fall":"Fell",
  "year":"1903-01-01T00:00:00.000",
  "_geo": {
      "lat":46.81867,
      "lng":7.21817}
  },
  {
    "name":"Ornans",
  "id":"18030",
  "nametype":"Valid",
  "recclass":"CO3.4",
  "mass":"6000",
  "fall":"Fell",
  "year":"1868-01-01T00:00:00.000",
  "_geo": {
      "lat":47.11667,
      "lng":6.15}
  },
  {
    "name":"Ortenau",
  "id":"18033",
  "nametype":"Valid",
  "recclass":"Stone-uncl",
  "mass":"4500",
  "fall":"Fell",
  "year":"1671-01-01T00:00:00.000",
  "_geo": {
      "lat":48.5,
      "lng":8.0}
  },
  {
    "name":"Alby sur Chéran",
  "id":"458",
  "nametype":"Valid",
  "recclass":"Eucrite-mmict",
  "mass":"252",
  "fall":"Fell",
  "year":"2002-01-01T00:00:00.000",
  "_geo": {
      "lat":45.82133,
      "lng":6.01533}
  },
  {
    "name":"Chervettaz",
  "id":"5341",
  "nametype":"Valid",
  "recclass":"L5",
  "mass":"705",
  "fall":"Fell",
  "year":"1901-01-01T00:00:00.000",
  "_geo": {
      "lat":46.55,
      "lng":6.81667}
  }
  ]
  ```

You can also use geosearch to sort results based on their distance from a specific location. Let's say you want to view meteors based on how close they were to the Taj Mahal:

<CodeSamples id= "getting_started_geoPoint_md" />

You should get the following meteors:

```json
[
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
  {
    "name":"Kadonah",
    "id":"12221",
    "nametype":"Valid",
    "recclass":"H6",
    "mass":"89",
    "fall":"Fell",
    "year":"1822-01-01T00:00:00.000",
    "_geo": {
      "lat":27.08333,
      "lng":78.33333
      },
      "_geoDistance":30574
   },
  {
    "name":"Ambapur Nagla",
    "id":"2290",
    "nametype":"Valid",
    "recclass":"H5",
    "mass":"6400",
    "fall":"Fell",
    "year":"1895-01-01T00:00:00.000",
    "_geo": {
      "lat":27.66667,
      "lng":78.25},
      "_geoDistance":58385},
  {
    "name":"Moti-ka-nagla",
    "id":"16759",
    "nametype":"Valid",
    "recclass":"H6",
    "mass":"1500",
    "fall":"Fell",
    "year":"1868-01-01T00:00:00.000",
    "_geo": {
      "lat":26.83333,
      "lng":77.33333},
      "_geoDistance":79843},
  {
    "name":"Chandpur",
    "id":"5321",
    "nametype":"Valid",
    "recclass":"L6",
    "mass":"1100",
    "fall":"Fell",
    "year":"1885-01-01T00:00:00.000",
    "_geo": {
      "lat":27.28333,
      "lng":79.05},
      "_geoDistance":100378},
  {
    "name":"Ekh Khera",
    "id":"7777",
    "nametype":"Valid",
    "recclass":"H6",
    "mass":"840",
    "fall":"Fell",
    "year":"1916-01-01T00:00:00.000",
    "_geo": {
      "lat":28.26667,
      "lng":78.78333},
      "_geoDistance":141617},
  {
    "name":"Bahjoi",
    "id":"4922",
    "nametype":"Valid",
    "recclass":"Iron, IAB-sLL",
    "mass":"10322",
    "fall":"Fell",
    "year":"1934-01-01T00:00:00.000",
    "_geo": {
      "lat":28.48333,
      "lng":78.5},
      "_geoDistance":152277},
  {
    "name":"Delhi",
    "id":"6642",
    "nametype":"Valid",
    "recclass":"L5",
    "mass":"0.8",
    "fall":"Fell",
    "year":"1897-01-01T00:00:00.000",
    "_geo": {
      "lat":28.56667,
      "lng":77.25},
      "_geoDistance":173219},
  {
    "name":"Raghunathpura",
    "id":"22371",
    "nametype":"Valid",
    "recclass":"Iron, IIAB",
    "mass":"10200",
    "fall":"Fell",
    "year":"1986-01-01T00:00:00.000",
    "_geo": {
      "lat":27.72528,
      "lng":76.465},
      "_geoDistance":167213},
  {
    "name":"Rewari",
    "id":"22593",
    "nametype":"Valid",
    "recclass":"L6",
    "mass":"3332",
    "fall":"Fell",
    "year":"1929-01-01T00:00:00.000",
    "_geo": {
      "lat":28.2,
      "lng":76.66667},
      "_geoDistance":176996},
  {
    "name":"Bansur",
    "id":"4936",
    "nametype":"Valid",
    "recclass":"L6",
    "mass":"15000",
    "fall":"Fell",
    "year":"1892-01-01T00:00:00.000",
    "_geo": {
      "lat":27.7,
      "lng":76.33333},
      "_geoDistance":178446},
  {
    "name":"Moradabad",
    "id":"16740",
    "nametype":"Valid",
    "recclass":"L6",
    "mass":"70",
    "fall":"Fell",
    "year":"1808-01-01T00:00:00.000",
    "_geo": {
      "lat":28.78333,
      "lng":78.83333},
      "_geoDistance":194975},
  {
    "name":"Meerut",
    "id":"15469",
    "nametype":"Valid",
    "recclass":"H5",
    "mass":"22",
    "fall":"Fell",
    "year":"1861-01-01T00:00:00.000",
    "_geo": {
      "lat":29.01667,
      "lng":77.8},
      "_geoDistance":206145},
  {
    "name":"Kaee",
    "id":"12222",
    "nametype":"Valid",
    "recclass":"H5",
    "mass":"230",
    "fall":"Fell",
    "year":"1838-01-01T00:00:00.000",
    "_geo": {
      "lat":27.25,
      "lng":79.96667},
      "_geoDistance":190496},
  {
    "name":"Khetri",
    "id":"12296",
    "nametype":"Valid",
    "recclass":"H6",
    "mass":"100",
    "fall":"Fell",
    "year":"1867-01-01T00:00:00.000",
    "_geo": {
      "lat":28.01667,
      "lng":75.81667},
      "_geoDistance":238430},
  {
    "name":"Kasauli",
    "id":"30740",
    "nametype":"Valid",
    "recclass":"H4",
    "mass":"16820",
    "fall":"Fell",
    "year":"2003-01-01T00:00:00.000",
    "_geo": {
      "lat":29.58333,
      "lng":77.58333},
      "_geoDistance":271517},
  {
    "name":"Kusiali",
    "id":"12382",
    "nametype":"Valid",
    "recclass":"L6",
    "mass":"5",
    "fall":"Fell",
    "year":"1860-01-01T00:00:00.000",
    "_geo": {
      "lat":29.68333,
      "lng":78.38333},
      "_geoDistance":280891},
  {
    "name":"Akbarpur",
    "id":"427",
    "nametype":"Valid",
    "recclass":"H4",
    "mass":"1800",
    "fall":"Fell",
    "year":"1838-01-01T00:00:00.000",
    "_geo": {
      "lat":29.71667,
      "lng":77.95},
      "_geoDistance":282753},
  {
    "name":"Haripura",
    "id":"11829",
    "nametype":"Valid",
    "recclass":"CM2",
    "mass":"315",
    "fall":"Fell",
    "year":"1921-01-01T00:00:00.000",
    "_geo": {
      "lat":28.38333,
      "lng":75.78333},
      "_geoDistance":259664}
]
```

This response returns an additional `_geoDistance` field. `_geoDistance` represents the distance between the Taj Mahal and each meteor in meters.

To learn more about geosearch and how to configure it, refer to our [dedicated guide](/reference/features/geosearch.md).
