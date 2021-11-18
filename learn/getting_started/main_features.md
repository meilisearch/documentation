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

By default, all attribute are searched for matching query words but you can configure the settings to change that.

### Sortable attributes

You can use any (not any-do we need the details here?) of the document fields for sorting by adding them to the `sortableAttributes`.

- Will the countries dataset work here?

### Geosearch

MeiliSearch allows you to filter and sort results based on their geographic location. To use this feature, your documents need to have the `_geo` field.

Use the countries dataset for this example.

## Stop words and synonyms

MeiliSearch allows you to create a list of words that is ignored in your search queries. Adding a stop words list improves the speed, and relevancy of your search.

A list of synonyms is useful if you have multiple words with the same meaning in your dataset. This will make your search results more relevant.

## Dumps and snapshots

- I think this section gives enough detail for an introduction. If we keep this here, do we get rid of it from Advanced topics?

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
