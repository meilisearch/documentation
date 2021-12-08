# Main Features

[[toc]]

Questions: (Answers in italics)

1. Do we add warnings and notes at this stage? *Nope*
2. Do we add links to detailed explanations at every instance? Or do we add them only once at the bottom of each section? *Only once*
3. What should the feature examples look like? Do we start with a presenting a use case? Suppose you want to blah blah and demonstrate how MeiliSearch does it? Add a code sample. *To be decided*
4. Do we want a section at the start briefly explaining MeiliSearch terms and any other terms? Documents, indexes, attributes, any other terms used in getting started? *Nope*
5. Where does the dataset file go? Not sure if we need it
6. Should I use "we" or "you"? *You*

This section will go over some of the main features of MeiliSearch to help you get started.

Once you have everything set up, you can change the default settings .... need a better sentence to summarize the whole thing.

## Starting your journey / Quick start / MeiliSearch 101 /

### Download and install

:::: tabs

::: tab cURL
Download the **latest stable release** of MeiliSearch with **cURL**.

Launch MeiliSearch to start the server.

```bash
# Install MeiliSearch
curl -L https://install.meilisearch.com | sh

# Launch MeiliSearch
./meilisearch
```

:::

::: tab Homebrew
Download the **latest stable release** of MeiliSearch with **Homebrew**.

Launch MeiliSearch to start the server.

```bash
# Update brew and install MeiliSearch
brew update && brew install meilisearch

# Launch MeiliSearch
meilisearch
```

:::

::: tab Docker
Using **Docker** you can choose to run [any available tag](https://hub.docker.com/r/getmeili/meilisearch/tags).

This command starts the **latest stable release** of MeiliSearch.

```bash
# Fetch the latest version of MeiliSearch image from DockerHub
docker pull getmeili/meilisearch:latest

# Launch MeiliSearch
docker run -it --rm \
    -p 7700:7700 \
    -v $(pwd)/data.ms:/data.ms \
    getmeili/meilisearch:latest
```

Data written to a **Docker container is not persistent** and is deleted along with the container when the latter is stopped. Docker volumes are not deleted when containers are removed. It is then recommended to share volumes between your containers and your host machine to provide persistent storage. MeiliSearch writes data to `/data.ms`

You can learn more about Docker on the [official documentation](https://docs.docker.com/get-docker/).
:::

::: tab APT

Download the **latest stable release** of MeiliSearch with **APT**.

Launch MeiliSearch to start the server.

```bash
# Add MeiliSearch package
echo "deb [trusted=yes] https://apt.fury.io/meilisearch/ /" > /etc/apt/sources.list.d/fury.list

# Update APT and install MeiliSearch
apt update && apt install meilisearch-http

# Launch MeiliSearch
meilisearch
```

:::

::: tab Source

MeiliSearch is written in `Rust`. To compile it, [installing the Rust toolchain](https://www.rust-lang.org/tools/install) is required.

If the Rust toolchain is already installed, clone the repository on your local system and change it to your working directory.

```bash
git clone https://github.com/meilisearch/MeiliSearch
cd MeiliSearch
```

In the cloned repository, compile MeiliSearch.

```bash
# Update the rust toolchain to the latest version
rustup update

# Compile the project
cargo build --release

# Execute the server binary
./target/release/meilisearch
```

:::

::: tab Windows

To install MeiliSearch on Windows, you can:

- use Docker (see "Docker" tab above)
- [download the latest binary](https://github.com/meilisearch/MeiliSearch/releases)
- use the installation script (see "cURL" tab above) if you have installed [Cygwin](https://www.cygwin.com/) or equivalent
- compile from source (see "Source" tab above)

To learn more about the Windows command prompt, follow this [introductory guide](https://www.makeuseof.com/tag/a-beginners-guide-to-the-windows-command-line/).

::::

### Cloud deploy

To deploy MeiliSearch on a cloud service, follow one of our dedicated guides:

- [AWS](/learn/cookbooks/aws.md)
- [DigitalOcean](/learn/cookbooks/digitalocean_droplet.md)
- [Qovery](/learn/cookbooks/qovery.md)

### Add documents

Now that MeiliSearch is up and running, the next step is adding documents. A [document](/learn/core_concepts/documents.md) is an object that contains data in the form of one or more fields. MeiliSearch currently accepts documents in the JSON, NDJSON, and CSV formats.

Your documents are stored in an [index](/learn/core_concepts/indexes.md). If the index does not exist, MeiliSearch creates it when you first add documents.

To add documents to an index called `movies`, use:

<CodeSamples id="getting_started_add_documents_md" />

Here's an example of the kind of response you should receive after adding documents.

```json
{
    "uid": 0,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "documentsAddition",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

Document addition is an [asynchronous](/learn/advanced/asynchronous_updates.md) operation. All asynchronous operations return the above response indicating that the operation has been taken into account and will be processed once it reaches the front of the queue.

You can use the `uid` to view additional details on the [task's progress](/reference/api/updates.md).

All documents must have a [primary key](/learn/core_concepts/documents.md#primary-field). Each index recognizes only one primary key attribute. Once a primary key has been set for an index, it cannot be changed anymore. If no primary key is found in a document, the document will not be stored.

You can set the primary key manually on index creation or document addition. If no primary key is set, MeiliSearch automatically guesses the primary key when you add documents.

### Basic search

Now that you have MeiliSearch setup, you can start searching! MeiliSearch [offers many parameters](/reference/features/search_parameters.md) that you can play with to refine your search or change the format of the returned documents. However, by default, the search is already relevant.

<CodeSamples id="getting_started_search_md" />

MeiliSearch **response**:

```json
{
  "hits": [
    {
      "id": "29751",
      "title": "Batman Unmasked: The Psychology of the Dark Knight",
      "poster": "https://image.tmdb.org/t/p/w1280/jjHu128XLARc2k4cJrblAvZe0HE.jpg",
      "overview": "Delve into the world of Batman and the vigilante justice tha",
      "release_date": "2008-07-15"
    },
    {
      "id": "471474",
      "title": "Batman: Gotham by Gaslight",
      "poster": "https://image.tmdb.org/t/p/w1280/7souLi5zqQCnpZVghaXv0Wowi0y.jpg",
      "overview": "ve Victorian Age Gotham City, Batman begins his war on crime",
      "release_date": "2018-01-12"
    },
    …
  ],
  "offset": 0,
  "limit": 20,
  "processingTimeMs": 2,
  "query": "botman"
}
```

### Web interface

MeiliSearch offers an out-of-the-box web interface where you can test MeiliSearch interactively. You can access it on your browser at: `http://127.0.0.1:7700`.

<MovieGif />

If you have multiple indexes, you can switch between them using the indexes dropdown.

![multiple indexes](/getting-started/multiple_indexes.png)

If your MeiliSearch instance does not have any indexes, you should see this screen.

->Add image

We will be using this interface to demonstrate some features in future chapters.

## Relevancy / Refining your search / 

### Ranking rules

- What kind of example goes here?

MeiliSearch sorts search responses based on a set of consecutive rules called ranking rules. You can update these ranking rules for each index. The rules are stored in an array of strings called `rankingRules`. The default order for the ranking rules is as follows:

1. Words
2. Typo
3. Proximity
4. Attribute
5. Sort
6. Exactness

The order in which ranking rules are applied matters. The first rule in the array has the most impact, and the last rule has the least.

You can read more about them in our [dedicated guide](/learn/core_concepts/relevancy.md).

### Displayed attributes

By default, all attributes are displayed in each matching document but you can update the settings to change that. If you access the MeiliSearch web interface at `http://127.0.0.1:7700/`, you will notice that you can view all of the attributes in the `movies` index.

![Web interface with default displayed attributes](/getting-started/default_displayed_attributes.png)

If you only want to view the `title`, `poster`, and `overview`, you can do so with the following query:

<CodeSamples id= "getting_started_update_displayedAttributes_md" />

![Web interface with updated displayed attributes](/getting-started/updated_displayed_attributes.png)  

### distinctAttribute

MeiliSearch lets you set one field per index as the distinct attribute. The distinct attribute will always be unique among returned documents. This means there will never be more than one occurrence of the same value in the distinct attribute field among the returned documents.

-> no idea what the example should be

### Searchable attributes

By default, all attribute are searched for matching query words but you can configure the settings to change that. Let's look at MeiliSearch's web interface for this example.
When we search for `lion king` with the default settings, MeiliSearch searches for it everywhere.

Use a number or a common phrase for the example. `Number 23`, `Pi`

![need a better gif](/getting-started/getting_started_searchableAttributes.gif)

If we update the `searchableAttributes` to only contain the movie title, MeiliSearch will only consider the title during search.

new gif

### stop words and synonyms

- Is it a good idea to link one-way association or should it be the Synonyms page? This link does take the user to the synonyms page so it shouldn't be a problem
- Do I need to include examples? I don't think so. The Synonyms and Stop words pages are pretty brief, too much info here will make them useless. But is this detail enough for demonstration purposes? Maybe add a gif and update the examples I used in the text accordingly?
- Not sure if gifs is a good idea for stop words. Any suggestions?

MeiliSearch allows you to create a list of words that is ignored in your search queries. These words are called stop words. A good example is the word `the` in English.

If you search the `movies` index for `the cat` with the default settings, MeiliSearch will return a lot of results but not all of them will be relevant. After adding `the` to your list of stop words, MeiliSearch will ignore all documents containing `the` and return the ones with `cat` improving the speed and relevancy of your search.

You can read more about stop words in our [dedicated guide](/reference/features/stop_words.md).

A list of synonyms is useful if you have multiple words with the same meaning in your dataset. This will make your search results more relevant. So if you have `winnie` and `piglet` set as synonyms, searching for either words will show the same results.

-> Need to create a gif

The only exception is one-way association, you can read more about it in our [dedicated guide](/reference/features/synonyms.md#one-way-association).

## Filtering and sorting

### Filterable attributes

MeiliSearch allows you to refine your search using filters. You can use any of the document fields for filtering by adding them to `filterableAttributes`.

Let's say you only want to view meteors that weigh less than 200g.

<CodeSamples id= "getting_started_filtering_md" />

```json
{"hits":[{"name":"Acapulco","mass":1914},{"name":"Ellemeet","mass":1470},{"name":"Enshi","mass":8000},{"name":"Ensisheim","mass":127000},{"name":"Épinal","mass":277},{"name":"Ergheo","mass":20000},{"name":"Erxleben","mass":2250},{"name":"Esnandes","mass":1500},{"name":"Essebi","mass":500},{"name":"Estherville","mass":320000},{"name":"Farmington","mass":89400},{"name":"Farmville","mass":56000},{"name":"Favars","mass":1500},{"name":"Fayetteville","mass":2360},{"name":"Feid Chair","mass":380},{"name":"Felix","mass":3200},{"name":"Ferguson","mass":220},{"name":"Fermo","mass":10200},{"name":"Fisher","mass":17600},{"name":"Florence","mass":3640}],"nbHits":858,"exhaustiveNbHits":false,"query":"","limit":20,"offset":0,"processingTimeMs":3}%
```

### Sortable attributes

- I'm not sure how to the example part should go? For now I can only think of "Let's ..." but is that peppy enough?
- Link to sorting guide

By default, MeiliSearch focuses on ordering results according to their relevancy. You can alter this sorting behavior so users can decide at search time what type of results they want to see first.

You can use any of the document fields as long as they contain numbers, strings, arrays of numeric values, or arrays of string values by adding them to `sortableAttributes`. Let's look at how you can sort all `H5` meteors based on their mass.

<CodeSamples id= "getting_started_sorting_md" />

```json
{"hits":[{"name":"Red Canyon Lake","mass":18.41},{"name":"Meerut","mass":22},{"name":"Kutais","mass":23},{"name":"Barnaul","mass":23.2},{"name":"Mason Gully","mass":24.54},{"name":"Centerville","mass":45.6},{"name":"Sologne","mass":54},{"name":"Fenghsien-Ku","mass":82},{"name":"Darmstadt","mass":100},{"name":"Pavlodar (stone)","mass":142.5},{"name":"Seldebourak","mass":150},{"name":"Cross Roads","mass":167},{"name":"Pétèlkolé","mass":189},{"name":"Okabe","mass":194},{"name":"Oviedo","mass":205},{"name":"Grimsby","mass":215},{"name":"Jiange","mass":222},{"name":"Kaee","mass":230},{"name":"Épinal","mass":277},{"name":"Schenectady","mass":283.3}],"nbHits":147,"exhaustiveNbHits":false,"query":"H5","limit":20,"offset":0,"processingTimeMs":6}
```

You will see all `H5` meteors sorted based on increasing mass. If you used `desc`, MeiliSearch will sort them based on decreasing mass.

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

## Integration/Facets (Decide this chapter name once we know what goes in here)

- can we use this with the interface?

## Search parameters / Optimizing your search

Even though the search is relevant by default, MeiliSearch offers many parameters that you can play with to refine your search or change the format of the returned document.

This chapter covers some of the important search parameters but you can read about all of them in our [search parameters guide](/reference/features/search_parameters.md).

### Placeholder search (does this need to be a heading or something that can be mentioned briefly somewhere else)

If you make a search without inputting any query words, MeiliSearch will return all the documents in that index sorted by its custom [ranking rules](/reference/features/settings.md#ranking-rules) and [sorting rules](/reference/features/sorting.md#sorting). This feature is called placeholder search.

### Phrase search (does this need to be a heading or something that can be mentioned briefly somewhere else)

If you enclose search terms in double quotes ("), MeiliSearch will only return documents that contain those terms in the order they were given. This gives users the option to make more precise search queries.

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

### attributesToCrop

By default, MeiliSearch responses return the entire value of all attributes. You can use the `attributesToCrop` parameter to crop the value of selected attributes.

Let's take `overview` as an example, MeiliSearch will return the whole value for it. If you want to only view the first `10` characters(is this the right term), you can use:

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

### limit

The `limit` decides the maximum number of documents MeiliSearch returns for a query. The default is `20` but you can change it.

If you search the `movies` index for `shifu`, MeiliSearch will return the first 20 movies. If you were to update the limit to `10`:

<CodeSamples id= "getting_started_limit_md" />

MeiliSearch would now return the first ten results.

## Configuration options / Dive deeper / Advanced concepts

MeiliSearch allows you to configure your entire instance through **environment variables** and **command-line options**. You can configure your instance with environment variables before launch and with command line options at launch.

This chapter covers some of the important configuration options but you can read about all of them in our [configuration guide](/reference/features/configuration.md).

### Database path

By default, all your database files will be created in a folder called `data.ms`. You can configure this using the `MEILI_DB_PATH` environment variable or the `--db-path` CLI option.

### Environment

You can run your MeiliSearch instance in `production` or `development`. By default, it runs in `development`, you can change that using the `MEILI_ENV` environment variable or the `--env` CLI option.

### Master key

You can protect your MeiliSearch instance by setting a master key. You can configure this using the `MEILI_MASTER_KEY` environment variable or the `--master-key` CLI option. MeiliSearch requires a master key when the `--env` is set to `production`.

### Disable analytics (I think we can use this here instead of payload limit size)

By default, MeiliSearch automatically collects data from all instances that do not opt out using this flag. You can configure it using the `MEILI_NO_ANALYTICS` environment variable or the `--no-analytics` CLI option.

You can read more about our data collection policy [here](/learn/what_is_meilisearch/telemetry.md).

### Payload limit size

MeiliSearch accepts JSON, NDJSON, and CSV payloads. The default payload limit is 104857600 (~100MB) but you can update it using the `MEILI_HTTP_PAYLOAD_SIZE_LIMIT` environment variable or the `--http-payload-size-limit` CLI option.

## Dumps and snapshots

- I think this section gives enough detail for an introduction. If we keep this here, do we get rid of it from Advanced topics?
- I don't think a note is a good idea here, too much detail for a "brief intro".

MeiliSearch allows you to backup your data using `dumps` or `screenshots`.

Dumps allow you to export your MeiliSearch instance. A dump isn't an exact copy of your database—it is closer to a blueprint that allows you to create an identical dataset. It contains all your indexes, documents, and settings, but in a raw unprocessed form.

Importing a dump requires MeiliSearch to re-index all of your documents. This process requires an amount of time and memory corresponding to the size of the database (the number of documents, their size, and the complexity of any index settings).

Snapshots, on the other hand, are an exact copy of your database. The documents in a snapshot are already "indexed" and ready to go, greatly increasing import speed. However, as a result, **snapshots are not compatible between different versions of MeiliSearch.**

Snapshots are intended mainly as a safeguard: ensuring that if some failure occurs, you're able to relaunch your database quickly and efficiently.
