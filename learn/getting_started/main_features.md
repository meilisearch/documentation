# Main Features

Possible chapters:

- Download and install
- Add documents
- Updates
- Search
- Configure options / Refine search? (covers some? of the settings the user can modify)
- Backup

This section will go over some of the main features of MeiliSearch to help you get started.

Once you have everything set up, you can change the default settings .... need a better sentence to summarize the whole thing.

- Rename the subheadings and add or remove some of them?
- Rename the page
- Does everything need to be on one page?
- Web interface?

## Search

## Displayed attributes

By default, all attributes are displayed in each matching document but you can update the settings to change that.

## Filterable attributes

MeiliSearch allows you to refine your search using filters. You can use any of the document fields for filtering by adding them to the `filterableAttributes`.

## Ranking rules

Should this be part of Search?

## Searchable attributes

By default, all attribute are searched for matching query words but you can configure the settings to change that.

## Sortable attributes

You can use any (not any-do we need the details here?) of the document fields for sorting by adding them to the `sortableAttributes`.

Will the countries dataset work here?

## Geosearch

MeiliSearch allows you to filter and sort results based on their geographic location. To use this feature, your documents need to have the `_geo` field.

Use the countries dataset for this example.

## Dumps and snapshots

MeiliSearch allows you to backup your data using `dumps` or `screenshots`.

Dumps allow you to export your MeiliSearch instance. A dump isn't an exact copy of your database—it is closer to a blueprint that allows you to create an identical dataset. It contains all your indexes, documents, and settings, but in a raw unprocessed form.

Importing a dump requires MeiliSearch to re-index all of your documents. This process requires an amount of time and memory corresponding to the size of the database (the number of documents, their size, and the complexity of any index settings).

::: note
We do not recommend using dumps from a new MeiliSearch version to import an older version.
For example, you should not import a dump from MeiliSearch v0.22.0 to MeiliSearch v0.21.0. But importing a dump from MeiliSearch v0.21.0 to MeiliSearch v0.21.0 or higher will work.
:::

Snapshots, on the other hand, are an exact copy of your database. The documents in a snapshot are already "indexed" and ready to go, greatly increasing import speed. However, as a result, **snapshots are not compatible between different versions of MeiliSearch.**

Snapshots are intended mainly as a safeguard: ensuring that if some failure occurs, you're able to relaunch your database quickly and efficiently.

## ?? Indexation and performance
