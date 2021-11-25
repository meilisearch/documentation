# Main Features

MeiliSearch 101:

- Download and install
  - Cloud deploy?
  - Configuration (should it be a chapter or a subheading?)
  - Update MeiliSearch
- Add documents
  - mention indexes and documents and how they work briefly
  - primary key inference? talk about it briefly here?
- Update (Do we talk about the general update process and updating MeiliSearch?)
- Search
- Configure settings (covers some? of the settings the user can modify)
  - A brief explanation of what the setting allows you to do + an example (multiple examples in case of different options like for geosearch?)
- Synonyms and stop words (will this have enough content to qualify as a chapter?)
- Backup
- Authentication (do we need to talk about this at this stage?)

Questions:

1. Do we add warnings and notes at this stage?
2. Do we add links to detailed explanations at every instance? Or do we add them only once at the bottom of each section? I think we should add them once at the bottom of each section
3. What should the feature examples look like? Do we start with a presenting a use case? Suppose you want to blah blah and demonstrate how MeiliSearch does it? Add a code sample
4. Do we want a section at the start briefly explaining MeiliSearch terms and any other terms? Documents, indexes, attributes, any other terms used in getting started?
5. Where does the dataset file go?
6. Should I use "we" or "you"? I think we would sound better in this context I used a mix of both for now just to see what would look better.

This section will go over some of the main features of MeiliSearch to help you get started.

Once you have everything set up, you can change the default settings .... need a better sentence to summarize the whole thing.

## Download and install

- Do we need to include all the tabs from Download and launch here?

## Cloud deploy

- Need details
- Is this a subheading of download and install?

## Configuration options

- Do we need to link all the options here?
- Should this be a very brief section?

## Search

- mention search parameters?
- mention placeholder and phrase search?

## Web interface

## Integrate your project

## Distinct attributes

MeiliSearch lets you set one field per index as the distinct attribute. The distinct attribute will always be unique among returned documents. This means there will never be more than one occurrence of the same value in the distinct attribute field among the returned documents.

## Settings

### Displayed attributes

- Can we use the web interface to show how the different attributes work? Adding gifs or images for demonstration?

By default, all attributes are displayed in each matching document but you can update the settings to change that.

### Filterable attributes

MeiliSearch allows you to refine your search using filters. You can use any of the document fields for filtering by adding them to the `filterableAttributes`.

### Ranking rules

Should this be part of Search?

### Searchable attributes

By default, all attribute are searched for matching query words but you can configure the settings to change that. Lets look at MeiliSearch's web interface for this example.
When we search for `lion king` with the default settings, MeiliSearch searches for it everywhere.

![need a better gif](/getting-started/getting_started_searchableAttributes.gif)

If we update the `searchableAttributes` to only contain the movie title, MeiliSearch will only consider the title during search.

new gif

### Sortable attributes

- I'm not sure how to the example part should go? For now I can only think of "Let's ..." but is that peppy enough?
- Should we link the feature reference or the API reference?
- Should we have something on sorting as well? Maybe as part of this?

You can use any (not any-do we need the details here?) of the document fields for sorting by adding them to the `sortableAttributes`. Let's look at how you can sort all `H5` meteors based on their mass.

<CodeSamples id= "getting_started_sorting_md" />

Add json result here

To learn more about `sortableAttributes` and how to configure them, refer to our [dedicated guide](/reference/features/sorting.md).

### Geosearch

- Can't demonstrate this using a gif so I added the code sample and I don't like this
- Do I add the result for each query? If so, I need to fix the indentation
- Where do I link the dataset?
- Do I need to mention `_geoDistance`?

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

To learn more about geosearch and how to configure it, refer to our [dedicated guide](/reference/features/geosearch.md).

## Stop words and synonyms

- Is it a good idea to link one-way association or should it be the Synonyms page? This link does take the user to the synonyms page so it shouldn't be a problem
- Do I need to include examples? I don't think so. The Synonyms and Stop words pages are pretty brief, too much info here will make them useless. But is this detail enough for demonstration purposes? Maybe add a gif and update the examples I used in the text accordingly?

MeiliSearch allows you to create a list of words that is ignored in your search queries. These words are called stop words. A good example is the word `the` in English. Adding `the` to your stop words list will mean that MeiliSearch will ignore all documents containing this word improving the speed and relevancy of your search. You can read more about stop words in our [dedicated guide](/reference/features/stop_words.md).

A list of synonyms is useful if you have multiple words with the same meaning in your dataset. This will make your search results more relevant. So if you have `San Francisco` and `SF` set as synonyms, searching for either words will show the same results. The only exception is one-way association, you can read more about it in our [dedicated guide](/reference/features/synonyms.md#one-way-association).

## Dumps and snapshots

- I think this section gives enough detail for an introduction. If we keep this here, do we get rid of it from Advanced topics?
- I don't think a note is a good idea here, too much detail for a "brief intro".

MeiliSearch allows you to backup your data using `dumps` or `screenshots`.

Dumps allow you to export your MeiliSearch instance. A dump isn't an exact copy of your database—it is closer to a blueprint that allows you to create an identical dataset. It contains all your indexes, documents, and settings, but in a raw unprocessed form.

Importing a dump requires MeiliSearch to re-index all of your documents. This process requires an amount of time and memory corresponding to the size of the database (the number of documents, their size, and the complexity of any index settings).

::: note
We do not recommend using dumps from a new MeiliSearch version to import an older version.
For example, you should not import a dump from MeiliSearch v0.22.0 to MeiliSearch v0.21.0. But importing a dump from MeiliSearch v0.21.0 to MeiliSearch v0.21.0 or higher will work.
:::

Snapshots, on the other hand, are an exact copy of your database. The documents in a snapshot are already "indexed" and ready to go, greatly increasing import speed. However, as a result, **snapshots are not compatible between different versions of MeiliSearch.**

Snapshots are intended mainly as a safeguard: ensuring that if some failure occurs, you're able to relaunch your database quickly and efficiently.

## ?? Indexation
