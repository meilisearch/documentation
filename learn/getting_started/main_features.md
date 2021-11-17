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

This section will go over some of the main features of MeiliSearch to help you get started.

Once you have everything set up, you can change the default settings .... need a better sentence to summarize the whole thing.

## Download and install

First of all, let's download and run MeiliSearch.

```bash
curl -L https://install.meilisearch.com | sh
./meilisearch
```

You should see the following response:

```
888b     d888          d8b 888 d8b  .d8888b.                                    888
8888b   d8888          Y8P 888 Y8P d88P  Y88b                                   888
88888b.d88888              888     Y88b.                                        888
888Y88888P888  .d88b.  888 888 888  "Y888b.    .d88b.   8888b.  888d888 .d8888b 88888b.
888 Y888P 888 d8P  Y8b 888 888 888     "Y88b. d8P  Y8b     "88b 888P"  d88P"    888 "88b
888  Y8P  888 88888888 888 888 888       "888 88888888 .d888888 888    888      888  888
888   "   888 Y8b.     888 888 888 Y88b  d88P Y8b.     888  888 888    Y88b.    888  888
888       888  "Y8888  888 888 888  "Y8888P"   "Y8888  "Y888888 888     "Y8888P 888  888

Database path:       "./data.ms"
Server listening on: "127.0.0.1:7700"
```

You can download & run MeiliSearch [in many different ways (i.e: docker, apt, homebrew, ...)](/learn/getting_started/installation.md).

## Cloud deploy

- Need details
- Is this a subheading of download and install?

To deploy MeiliSearch on a cloud service, follow one of our dedicated guides:

- [AWS](/create/how_to/aws.md)
- [DigitalOcean](/create/how_to/digitalocean_droplet.md)
- [Qovery](/create/how_to/qovery.md)

## Configuration options

- Do we need to link all the options here?

You can configure your MeiliSearch instance through the command line options or environment variables. These options affect your entire MeiliSearch instance, not just a single index. You can set these before or after launch.

This is an example using the command line options.

```bash
./meilisearch --db-path ./meilifiles --http-addr '127.0.0.1:7700'
```

Here is a list of [all the options and how to use them](/reference/features/configuration.md).

## Search

- mention search parameters?

Before you start querying, we recommend that you check the status of your index. You can do that using:

 Add CodeSample

Once the update shows `processed`, you can start searching.

::: warning
Attempting to search before all documents are indexed will result in undefined behavior.
:::

MeiliSearch [offers many parameters](/reference/features/search_parameters.md) that you can play with to refine your search or change the format of the returned documents. However, by default, the search is already relevant.

The search engine is now aware of your documents and can serve those via an HTTP server.

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

By default, all attribute are searched for matching query words but you can configure the settings to change that.

### Sortable attributes

You can use any (not any-do we need the details here?) of the document fields for sorting by adding them to the `sortableAttributes`.

Will the countries dataset work here?

### Geosearch

MeiliSearch allows you to filter and sort results based on their geographic location. To use this feature, your documents need to have the `_geo` field.

Use the countries dataset for this example.

## Dumps and snapshots

- I copied this section mostly from Data backup: snapshots vs. dumps under Advanced topics. I think this section gives enough detail for an introduction. If we keep this here, do we get rid of it from Advanced topics?

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
