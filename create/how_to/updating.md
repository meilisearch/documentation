# Update to the Latest MeiliSearch Version

Currently, MeiliSearch versions [are not compatible with each other](/learn/getting_started/installation.md#updating-meilisearch). The following guide will walk you through all the steps to migrate your database from an older version of MeiliSearch to the most recent one. 

If you already have a MeiliSearch database with some data you don’t want to lose, you are in the right place!

## Verify your database version

Before we begin, you need to verify your database's **expected MeiliSearch version**, i.e. the version that indexed the data. You can do so by launching a MeiliSearch instance:

```bash
./meilisearch
```

If you get the error `Cannot open database, expected MeiliSearch engine version: X.X.X, current engine version Y.Y.Y`, your database is not compatible with the version you're using. Find and download the **expected version** [here](https://github.com/meilisearch/MeiliSearch/releases) before continuing.

If MeiliSearch launched successfully, simply use the [get version endpoint](/reference/api/version.md).

<RouteHighlighter method="GET" route="/version"/>

Now that you know the version your database is using, proceed accordingly:

- **If your database version is v0.15.0 or above**, continue to the [next section](#updating-from-v0150-or-above).
- **If your version is v0.14.0 or below**, [go here](#updating-from-v0140-or-below).

## Updating from v0.15.0 or above

Because MeiliSearch v0.15.0 and above include the [dumps feature](/reference/features/dumps.md), updating is very simple. You just need to **create a dump** using the expected MeiliSearch version, then **import it** using the most recent one.

### Step 1: Set all fields as displayed attributes

When creating dumps, MeiliSearch calls the same service as the [`GET /documents` route](/reference/api/documents.md#get-documents). This means that a field must be present in the [displayed-attributes list](/reference/features/field_properties.md#displayed-fields) in order to be saved in the dump.

By default, all fields are included in `displayedAttributes`. Still, it's a good idea to verify this before creating a dump. You can do so by using the [get displayed attributes](/reference/api/displayed_attributes.html#get-displayed-attributes) endpoint: 

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/displayed-attributes" />

If the returned value is `["*"]`, you can move on to the next step.

If not, then you need to use the [reset displayed-attributes](/reference/api/displayed_attributes.html#reset-displayed-attributes) endpoint.

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/displayed-attributes"/>

### Step 2: Create the dump

To create a dump, simply use the [create dump endpoint](/reference/api/dump.html#create-a-dump).

<RouteHighlighter method="POST" route="/dumps"/>

MeiliSearch will store the dump in your dump directory, by default `dumps/`. You can [modify this directory](/reference/features/configuration.html#dumps-destination) through the command line or an environment variable. 

The server should return a response that looks like this:

```json
{
  "uid": "20210212-151153878",
  "status": "in_progress"
}
```

Since dump creation is an [asynchronous process](/learn/advanced/asynchronous_updates.md), you can use the returned `uid` to [track its status](/reference/api/dump.html#get-dump-status).

<RouteHighlighter method="GET" route="/dumps/:dump_uid/status"/>

This process can take some time. Once the status is `"done"`, move on to the next step.

### Step 3: Import the dump

Now that you’ve got your dump, you just need to [install the latest version of MeiliSearch](/learn/getting_started/installation.md#download-and-launch) and import the dump at launch, like so:

```bash
# Install MeiliSearch in the local directory
curl -L https://install.meilisearch.com | sh

# Launch MeiliSearch and import the specified dump file
./meilisearch --import-dump /dumps/name_of_your_dump.dump
```

> Importing a dump is the same process as indexing documents. This can take some time and cause a spike in RAM usage. To save RAM, use a [smaller batch size](/reference/features/configuration.md#dump-batch-size).

Finally, don’t forget to set `displayedAttributes` back to its previous value, if necessary.

Congratulations! You have successfully migrated your MeiliSearch database to the latest version! 🎉

## Updating from v0.14.0 or below

Since these versions predate the [dumps feature](/reference/features/dumps.md), the best solution is to export your documents and your [index settings](/reference/features/settings.md) as JSON files. 

If you don’t need to preserve index settings, skip directly to [step 2](#step-2-check-your-settings).

### Step 1: Save your settings

First, use the [get settings](/reference/api/settings.md#get-settings) endpoint to retrieve the [settings](/reference/features/settings.md) of any indexes you want to preserve, and save them to a file using the method you prefer.

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings"/>

For simplicity's sake, this example uses cURL.

```bash
# the -o option saves the output as a local file
curl -X GET “http://127.0.0.1:7700/indexes/:index_uid/settings” -o mysettings.json
```

It is important to first export your settings before exporting documents, since retrieving the documents in their entirety may require modifying the settings.

### Step 2: Set all fields as displayed attributes

In order to retrieve all the fields present in your documents, all fields must be set as `displayedAttributes`. 

By default, all fields are included in `displayedAttributes`. Still, it's a good idea to verify your settings before continuing. Do so using the [get displayed attributes](/reference/api/displayed_attributes.html#get-displayed-attributes) endpoint: 

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/displayed-attributes"/>

If the returned value is `["*"]`, you can move on to the next step.

If not, use the [reset displayed-attributes](/reference/api/displayed_attributes.html#reset-displayed-attributes) endpoint.

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/displayed-attributes"/>

Now that all fields are **displayed**, you can proceed to save your documents without risking any information loss.

### Step 3: Save your documents

Use a GET request to retrieve your documents and save them using the method you prefer.

<RouteHighlighter method="GET" route="/indexes/:index_uid/documents"/>

cURL provides an easy option for exporting the results of an API call:

```bash
# the -o option saves the output as a local file
curl -X GET “http://127.0.0.1:7700/indexes/:index_uid/documents” -o mydocuments.json
```

### Step 4: Upload your data to the latest version of MeiliSearch

Finally, [install the latest version of MeiliSearch](/learn/getting_started/installation.md) and upload your data as usual.

If you chose to save your settings, make sure to follow this order:

1. [Update your settings](/reference/api/settings.md#update-settings)
2. [Add your documents](/reference/api/documents.md#add-or-replace-documents)

This order prevents double indexing and will save time and memory.

Congratulations! You have successfully migrated your MeiliSearch database to the latest version! 🎉
