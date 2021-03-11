# Update to the Latest MeiliSearch Version

Currently, MeiliSearch versions [are not compatible with each other](/learn/getting_started/installation.md#updating-meilisearch). The following guide will walk you through all the steps to migrate your database from an older version of MeiliSearch to the most recent one.

If you already have a MeiliSearch database with some data you don’t want to lose, you are in the right place!

## Verify your database version

Before we begin, you need to verify your database's **expected MeiliSearch version**, i.e. the version that indexed the data. You can do so by launching a MeiliSearch instance:

```bash
./meilisearch
```

If MeiliSearch launches successfully, simply use the [get version endpoint](/reference/api/version.md) and [proceed to the next step](#proceed-according-to-your-database-version).

```bash
curl -X GET “http://127.0.0.1:7700/version"
```

If you get the error `Cannot open database, expected MeiliSearch engine version: X.X.X, current engine version Y.Y.Y`, your database is not compatible with the version you're using. You need to download the expected version and use that to launch your database.

This step is different depending on which tool you used to download MeiliSearch.

:::: tabs

::: tab cURL
If you downloaded MeiliSearch using curl, find and download the **expected version** [here](https://github.com/meilisearch/MeiliSearch/releases) before continuing.
:::

::: tab Homebrew

```bash
brew install meilisearch@0.X.X
```

:::

::: tab Source

```bash
# Clone MeiliSearch and checkout the branch of the expected version
git clone https://github.com/meilisearch/MeiliSearch
cd MeiliSearch
git checkout v0.X.X

# Update the rust toolchain to the latest version
rustup update

# Compile the project
cargo build --release

# Execute the server binary
./target/release/meilisearch
```

:::

::: tab APT

```bash
apt-get install meilisearch=0.X.X
```

:::

::: tab Docker

```bash
docker run -it --rm \
    -p 7700:7700 \
    -v $(pwd)/data.ms:/data.ms \
    getmeili/meilisearch:v0.X.X
```

:::

::::

## Proceed according to your database version

Now that you know the version your database is using, proceed accordingly:

- **If your database version is v0.15.0 or above**, continue to the [next section](#updating-from-v0-15-0-or-above).
- **If your version is v0.14.0 or below**, [go here](#updating-from-v0-14-0-or-below).

## Updating from v0.15.0 or above

Because MeiliSearch v0.15.0 and above include the [dumps feature](/reference/features/dumps.md), updating is very simple. You just need to **create a dump** using the expected MeiliSearch version, then **import it** using the most recent one.

### Step 1: Set all fields as displayed attributes

When creating dumps, MeiliSearch calls the same service as the [`GET /documents` route](/reference/api/documents.md#get-documents). This means that a field must be present in the [displayed-attributes list](/reference/features/field_properties.md#displayed-fields) in order to be saved in the dump.

By default, all fields are included in `displayedAttributes`. Still, it's a good idea to verify this before creating a dump. You can do so by using the [get displayed attributes](/reference/api/displayed_attributes.md#get-displayed-attributes) endpoint:

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/displayed-attributes" />

If the returned value is `["*"]`, you can move on to the next step.

If not, then you need to use the [reset displayed-attributes](/reference/api/displayed_attributes.md#reset-displayed-attributes) endpoint.

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/displayed-attributes"/>

### Step 2: Create the dump

Before creating your dump, verify that your [dump directory](/reference/features/configuration.md#dumps-destination) is somewhere accessible to you. By default this is a folder called `dumps` at the root of your MeiliSearch directory, but can be modified at launch.

::: tip
If you're unsure where your MeiliSearch directory is located, try this:

```bash
which meilisearch
```

:::

To create a dump, simply use the [create dump endpoint](/reference/api/dump.md#create-a-dump).

```bash
curl -X POST "http://127.0.0.1:7700/dumps"
```

The server should return a response that looks like this:

```json
{
  "uid": "20210212-151153878",
  "status": "in_progress"
}
```

Since dump creation is an [asynchronous process](/learn/advanced/asynchronous_updates.md), you can use the returned `uid` to [track its status](/reference/api/dump.md#get-dump-status).

```bash
curl -X GET "http://127.0.0.1:7700/dumps/:dump_uid/status"
```

This process can take some time. Once the status is `"done"`, move on to the next step.

### Step 3: Import the dump

Now that you’ve got your dump, you just need to [install the latest version of MeiliSearch](/learn/getting_started/installation.md#download-and-launch) and import the dump at launch, like so:

```bash
# Launch MeiliSearch and import the specified dump file
./meilisearch --import-dump /dumps/name_of_your_dump.dump
```

> Importing a dump is the same process as indexing documents. This can take some time and cause a spike in RAM usage. To save RAM, use a [smaller batch size](/reference/features/configuration.md#dump-batch-size).

Finally, don’t forget to set `displayedAttributes` back to its previous value, if necessary.

Congratulations! You have successfully migrated your MeiliSearch database to the latest version! 🎉

## Updating from v0.14.0 or below

Since these versions predate the [dumps feature](/reference/features/dumps.md), the best solution is to export your documents and your [index settings](/reference/features/settings.md) as JSON files.

If you don’t need to preserve index settings, skip directly to [step 2](#step-2-set-all-fields-as-displayed-attributes).

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

By default, all fields are included in `displayedAttributes`. Still, it's a good idea to verify your settings before continuing. Do so using the [get displayed attributes](/reference/api/displayed_attributes.md#get-displayed-attributes) endpoint:

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/displayed-attributes"/>

If the returned value is `["*"]`, you can move on to the next step.

If not, use the [reset displayed-attributes](/reference/api/displayed_attributes.md#reset-displayed-attributes) endpoint.

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/displayed-attributes"/>

Now that all fields are **displayed**, you can proceed to save your documents without risking any information loss.

### Step 3: Save your documents

Use the [GET documents endpoint](/reference/api/documents.md#get-documents) to retrieve your documents and save them using the method you prefer. Make sure to set the limit parameter so that, if you have `n` documents, `limit ≥ n`.

```bash
# the -o option saves the output as a local file
curl -X GET “http://127.0.0.1:7700/indexes/:index_uid/documents?limit=n” -o mydocuments.json
```

### Step 4: Upload your data to the latest version of MeiliSearch

Finally, [install the latest version of MeiliSearch](/learn/getting_started/installation.md) and upload your data as usual.

If you chose to save your settings, make sure to follow this order:

1. [Update your settings](/reference/api/settings.md#update-settings)
2. [Add your documents](/reference/api/documents.md#add-or-replace-documents)

This order prevents double indexing and will save time and memory.

Congratulations! You have successfully migrated your MeiliSearch database to the latest version! 🎉
