# Update to the latest MeiliSearch version

Currently, MeiliSearch databases can only be opened by the MeiliSearch version you used to create them. The following guide will walk you through all the steps to **migrate an existing database** from an older version of MeiliSearch to the most recent one.

If you already have a MeiliSearch database with some data you don’t want to lose, you are in the right place!

:::note
If you have already **installed the latest version and manually indexed your data and settings**, you can ignore this guide.
:::

## Verify your database version

Before we begin, you need to **verify the version of MeiliSearch that's compatible with your database**, i.e. the version that indexed the data. You can do so by launching a MeiliSearch instance:

```bash
./meilisearch
```

If MeiliSearch launches successfully, use the [get version endpoint](/reference/api/version.md), note your `pkgVersion`, and [proceed to the next step](#proceed-according-to-your-database-version).

```bash
curl -X GET 'http://127.0.0.1:7700/version'
```

The response should look something like this:

```json
{
  "commitSha": "stringOfLettersAndNumbers",
  "commitDate": "YYYY-MM-DDTimestamp",
  "pkgVersion": "x.y.z"
}
```

If you get the error `Cannot open database, expected MeiliSearch engine version: 0.X.X, current engine version 0.Y.Y`, your database is not compatible with the currently installed MeiliSearch version.

In this case, you need to **download the compatible version now** (i.e. `0.X.X` in the above error message) so that you can access and export your database.

:::: tabs

::: tab cURL
If you downloaded MeiliSearch using `curl`, find and download the compatible version [here](https://github.com/meilisearch/MeiliSearch/releases) before continuing.
:::

::: tab Homebrew

Replace `0.X.X` with the version you would like to install.

```bash
brew install meilisearch@0.X.X
```

:::

::: tab Source

Replace `0.X.X` with the version you would like to install.

```bash
# clone MeiliSearch and checkout the branch of the expected version
git clone https://github.com/meilisearch/MeiliSearch
cd MeiliSearch
git checkout v0.X.X

# update the rust toolchain to the latest version
rustup update

# compile the project
cargo build --release

# execute the server binary
./target/release/meilisearch
```

:::

::: tab APT

Replace `0.X.X` with the version you would like to install.

```bash
apt-get install meilisearch=0.X.X
```

:::

::: tab Docker

Replace `0.X.X` with the version you would like to install.

```bash
docker run -it --rm \
    -p 7700:7700 \
    -v "$(pwd)/data.ms:/data.ms" \
    getmeili/meilisearch:v0.X.X
```

:::

::::

### Proceed according to your database version

Now that you know which MeiliSearch version your database is compatible with, proceed accordingly:

- **If your database version is v0.15.0 or above**, continue to the [next section](#updating-from-v0-15-0-or-above).
- **If your version is v0.14.0 or below**, [go here](#updating-from-v0-14-0-or-below).

## Updating from v0.15.0 or above

Because MeiliSearch v0.15.0 and above include the [dumps feature](/reference/features/dumps.md), updating is relatively simple.

In this guide, we will:

1. [Set all fields as displayed attributes](#step-1-set-all-fields-as-displayed-attributes)
2. [Create a dump using the MeiliSearch version that's compatible with your database](#step-2-create-the-dump)
3. [Delete the database folder](#step-3-delete-the-database-folder)
4. [Import the dump using the most recent MeiliSearch version](#step-4-import-the-dump)

### Step 1: Set all fields as displayed attributes

::: note
If your dump was created in MeiliSearch v0.21 or above, continue to step 2.
:::

When creating dumps, MeiliSearch calls the same method as the [get documents endpoint](/reference/api/documents.md#get-documents). This means that all fields must be [displayed](/reference/features/field_properties.md#displayed-fields) in order to be saved in the dump.

Start by using the [get displayed attributes endpoint](/reference/api/displayed_attributes.md#get-displayed-attributes) to verify that **all attributes are displayed**.

```bash
# whenever you see :index_uid, replace it with your index's unique id
curl -X GET \
  'http://127.0.0.1:7700/indexes/:index_uid/settings/displayed-attributes'
```

If the response is `{'displayedAttributes': '["*"]'}`, you can move on to the [next step](#step-2-create-the-dump).

If it's something else, then you need to use the [reset displayed attributes endpoint](/reference/api/displayed_attributes.md#reset-displayed-attributes). Before doing this, make sure you save your list of displayed attributes somewhere so you can restore it afterwards.

```bash
curl -X DELETE \
  'http://127.0.0.1:7700/indexes/:index_uid/settings/displayed-attributes'
```

This command should return:

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "indexUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

Now that all fields are displayed, proceed to the next step.

### Step 2: Create the dump

Before creating your dump, make sure that your [dump directory](/reference/features/configuration.md#dumps-destination) is somewhere accessible. By default, dumps are created in a folder called `dumps` at the root of your MeiliSearch directory.

::: note
If you are running MeiliSearch in a service using `systemd`, like AWS or a DO droplet, the dumps folder can be found in the configuration file directory, `cd /var/opt/meilisearch/dumps`.
:::

If you're unsure where your MeiliSearch directory is located, try this:

:::: tabs

::: tab macOS / Linux

```bash
which meilisearch
```

It should return something like this:

```bash
/absolute/path/to/your/meilisearch/directory
```

:::

::: tab Windows CMD

```bash
where meilisearch
```

It should return something like this:

```bash
/absolute/path/to/your/meilisearch/directory
```

:::

::: tab Windows PowerShell

```bash
(Get-Command meilisearch).Path
```

It should return something like this:

```bash
/absolute/path/to/your/meilisearch/directory
```

:::

::::

To create a dump, use the [create dump endpoint](/reference/api/dump.md#create-a-dump).

```bash
curl -X POST 'http://127.0.0.1:7700/dumps'
```

The server should return a response that looks like this:

```json
{
  "uid": "20210212-151153878",
  "status": "in_progress",
  "startedAt": "2021-02-12T15:11:53.402327Z"
}
```

This process can take some time. Since dump creation is an [asynchronous operation](/learn/advanced/asynchronous_operations.md), you can use the returned `uid` to [track its status](/reference/api/dump.md#get-dump-status).

```bash
# replace :dump_uid with the uid returned by the previous command
curl -X GET 'http://127.0.0.1:7700/dumps/:dump_uid/status'
```

Once the response to the previous command looks like this (`"status": "done"`), move on.

```json
{
  "uid": "20200929-114144097",
  "status": "done",
  "startedAt": "2020-09-29T11:41:44.392327Z",
  "finishedAt": "2020-09-29T11:41:50.792147Z"
}
```

### Step 3: Delete the database folder

To delete the old MeiliSearch version, you need to delete the `data.ms` folder. `data.ms` should be at the root of the MeiliSearch binary, unless you chose [another location](https://docs.meilisearch.com/reference/features/configuration.html#database-path).

### Step 4: Import the dump

Now that you’ve got your dump, [install the latest version of MeiliSearch](/learn/getting_started/installation.md#download-and-launch) and [import the dump](/reference/features/dumps.md#importing-a-dump) at launch using the [CLI option](/reference/features/configuration.md#import-dump).

```bash
# launch the latest version of MeiliSearch and import the specified dump file
./meilisearch --import-dump /dumps/your_dump_file.dump
```

Importing a dump requires indexing all the documents it contains. Depending on the size of your dataset, this process can take a long time and cause a spike in memory usage.

Finally, don’t forget to set `displayedAttributes` back to its previous value if necessary. You can do this using the [update displayed attributes endpoint](/reference/api/displayed_attributes.md#update-displayed-attributes).

Congratulations! You have successfully migrated your MeiliSearch database to the latest version! 🎉

## Updating from v0.14.0 or below

Since these versions predate the [dumps feature](/reference/features/dumps.md), the best solution is to export your documents and your [index settings](/reference/features/settings.md) as `.JSON` files.

In this guide, we will:

1. [Save your settings](#step-1-save-your-settings)
2. [Set all fields as displayed attributes](#step-2-set-all-fields-as-displayed-attributes)
3. [Save your documents](#step-3-save-your-documents)
4. [Delete the database folder](#step-4-delete-the-database-folder)
5. [Upload your data to the latest version of MeiliSearch](#step-5-upload-your-data-to-the-latest-version-of-meilisearch)

If you don’t need to preserve index settings, skip directly to [step two](#step-2-set-all-fields-as-displayed-attributes).

### Step 1: Save your settings

First, use the [get settings endpoint](/reference/api/settings.md#get-settings) to retrieve the [settings](/reference/features/settings.md) of any indexes you want to preserve, and save them to a file using the method you prefer.

```bash
# the -o option saves the output as a local file
curl -X GET \
  'http://127.0.0.1:7700/indexes/:index_uid/settings' -o mysettings.json
```

Repeat this process for all indexes you wish to migrate.

**It is important to save your settings before exporting documents**, since the next step may require you to modify the settings.

### Step 2: Set all fields as displayed attributes

To prevent data loss, all fields must be set as [displayed](/reference/features/field_properties.md#displayed-fields).

By default, all fields are added to the displayed attributes list. Still, it's a good idea to verify this before proceeding to the next step. You can do so by using the [get displayed attributes endpoint](/reference/api/displayed_attributes.md#get-displayed-attributes):

```bash
curl -X GET \
  'http://127.0.0.1:7700/indexes/:index_uid/settings/displayed-attributes'
```

If the response is `'["*"]'`, you can move on to the [next step](#step-3-save-your-documents).

If it's something else, then you need to use the [reset displayed-attributes endpoint](/reference/api/displayed_attributes.md#reset-displayed-attributes). Before doing this, make sure you save your list of displayed attributes somewhere so you can restore it afterwards.

```bash
curl -X DELETE \
  'http://127.0.0.1:7700/indexes/:index_uid/settings/displayed-attributes'
```

This command should return:

```json
{
    "uid": 1,
    "indexUid": "movies",
    "status": "enqueued",
    "type": "indexUpdate",
    "enqueuedAt": "2021-08-11T09:25:53.000000Z"
}
```

Now that all fields are displayed, proceed to the next step.

### Step 3: Save your documents

Use the [get documents endpoint](/reference/api/documents.md#get-documents) to retrieve your documents and save them using the method you prefer. Make sure to set the `limit` on documents returned so that, if you have some number of documents `n`, `limit ≥ n`. Otherwise, you risk data loss.

```bash
# the -o option saves the output as a local file
# whenever you see :index_uid, replace it with your index's unique id
curl -X GET \
  'http://127.0.0.1:7700/indexes/:index_uid/documents?limit=n' \
  -o mydocuments.json
```

### Step 4: Delete the database folder

To delete the old MeiliSearch version, you need to delete the `data.ms` folder. `data.ms` should be at the root of the MeiliSearch binary, unless you chose [another location](https://docs.meilisearch.com/reference/features/configuration.html#database-path).

### Step 5: Upload your data to the latest version of MeiliSearch

Finally, [install the latest version of MeiliSearch](/learn/getting_started/installation.md) and upload your data as usual.

If you chose to save your settings, make sure to follow this order:

```bash
# update your settings
curl -X POST -H "Content-Type: application/json" -d @mysettings.json \
  'http://127.0.0.1:7700/indexes/:index_uid/settings'

# then, add your documents
curl -X POST -H "Content-Type: application/json" -d @mydocuments.json \
  'http://127.0.0.1:7700/indexes/:index_uid/documents'
```

Since updating the settings requires re-indexing all documents, this order saves time and memory.

Congratulations! You have successfully migrated your MeiliSearch database to the latest version! 🎉
