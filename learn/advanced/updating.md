# Update to the latest Meilisearch version

Currently, Meilisearch databases can only be opened by the Meilisearch version you used to create them. The following guide will walk you through all the steps to **migrate an existing database** from an older version of Meilisearch to the most recent one.

If you already have a Meilisearch database with some data you don’t want to lose, you are in the right place!

:::note
If you have already **installed the latest version and manually indexed your data and settings**, you can ignore this guide.
:::

## Verify your database version

Before we begin, you need to **verify the version of Meilisearch that's compatible with your database**, i.e. the version that indexed the data. You can do so by launching a Meilisearch instance:

```bash
./meilisearch --master-key="your_master_key"
```

If Meilisearch launches successfully, use the [get version endpoint](/reference/api/version.md), note your `pkgVersion`, and [proceed to the next step](#proceed-according-to-your-database-version).

<CodeSamples id="updating_guide_check_version" />

The response should look something like this:

```json
{
  "commitSha": "stringOfLettersAndNumbers",
  "commitDate": "YYYY-MM-DDTimestamp",
  "pkgVersion": "x.y.z"
}
```

If you get the error `Cannot open database, expected Meilisearch engine version: 0.X.X, current engine version 0.Y.Y`, your database is not compatible with the currently installed Meilisearch version.

In this case, you need to **download the compatible version now** (i.e. `0.X.X` in the above error message) so that you can access and export your database.

:::: tabs

::: tab cURL
If you downloaded Meilisearch using `curl`, find and download the compatible version [here](https://github.com/meilisearch/meilisearch/releases) before continuing.
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
# clone Meilisearch and checkout the branch of the expected version
git clone https://github.com/meilisearch/meilisearch
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
apt-get install meilisearch-http=0.X.X
```

:::

::: tab Docker

Replace `0.X.X` with the version you would like to install.

```bash
docker run -it --rm \
    -p 7700:7700 \
    -v $(pwd)/meili_data:/meili_data \
    getmeili/meilisearch:v0.X.X
```

:::

::::

### Proceed according to your database version

Now that you know which Meilisearch version your database is compatible with, proceed accordingly:

- **If your database version is v0.15.0 or above**, continue to the [next section](#updating-from-v0-15-0-or-above).
- **If your version is v0.14.0 or below**, [go here](#updating-from-v0-14-0-or-below).

## Updating from v0.15.0 or above

Because Meilisearch v0.15.0 and above include the [dumps feature](/learn/advanced/dumps.md), updating is relatively simple.

In this guide, we will:

1. [Set all fields as displayed attributes](#step-1-set-all-fields-as-displayed-attributes)
2. [Create a dump using the Meilisearch version that's compatible with your database](#step-2-create-the-dump)
3. [Delete the database folder](#step-3-delete-the-database-folder)
4. [Import the dump using the most recent Meilisearch version](#step-4-import-the-dump)

### Step 1: Set all fields as displayed attributes

::: note
If your dump was created in Meilisearch v0.21 or above, continue to step 2.
:::

When creating dumps, Meilisearch calls the same method as the [get documents endpoint](/reference/api/documents.md#get-documents). This means that all fields must be [displayed](/learn/configuration/displayed_searchable_attributes.md#displayed-fields) in order to be saved in the dump.

Start by using the [get displayed attributes endpoint](/reference/api/displayed_attributes.md#get-displayed-attributes) to verify that **all attributes are displayed**.

<CodeSamples id="updating_guide_get_displayed_attributes" />

If the response is `{'displayedAttributes': '["*"]'}`, you can move on to the [next step](#step-2-create-the-dump).

If it's something else, then you need to use the [reset displayed attributes endpoint](/reference/api/displayed_attributes.md#reset-displayed-attributes). Before doing this, make sure you save your list of displayed attributes somewhere so you can restore it afterwards.

<CodeSamples id="updating_guide_reset_displayed_attributes" />

This command returns a `uid`. You can use this to [track the status of the operation](/reference/api/tasks.md#get-task). Once the status is `succeeded`, you're good to go.

Now that all fields are displayed, proceed to the next step.

### Step 2: Create the dump

Before creating your dump, make sure that your [dump directory](/learn/configuration/instance_options.md#dumps-destination) is somewhere accessible. By default, dumps are created in a folder called `dumps` at the root of your Meilisearch directory.

::: note
If you are running Meilisearch in a service using `systemd`, like AWS or a DO droplet, the dumps folder can be found in the configuration file directory, `cd /var/opt/meilisearch/dumps`.
:::

If you're unsure where your Meilisearch directory is located, try this:

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

<CodeSamples id="updating_guide_create_dump" />

The server should return a response that looks like this:

```json
{
  "uid": "20210212-151153878",
  "status": "in_progress",
  "startedAt": "2021-02-12T15:11:53.402327Z"
}
```

This process can take some time. Since dump creation is an [asynchronous operation](/learn/advanced/asynchronous_operations.md), you can use the returned `uid` to [track its status](/reference/api/dump.md#get-dump-status).

<CodeSamples id="updating_guide_get_dump_status" />

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

To delete the old Meilisearch version, you need to delete the `data.ms` folder. `data.ms` should be at the root of the Meilisearch binary, unless you chose [another location](/learn/configuration/instance_options.md#database-path).

::: tip

If you are using the Meilisearch official images on DigitalOcean, AWS, or GCP, you will find the `data.ms` folder at `/var/lib/meilisearch/data.ms`.

:::

### Step 4: Import the dump

Now that you’ve got your dump, [install the latest version of Meilisearch](/learn/getting_started/quick_start.md#step-1-setup-and-installation) and [import the dump](/learn/advanced/dumps.md#importing-a-dump) at launch using the [CLI option](/learn/configuration/instance_options.md#import-dump).

```bash
# launch the latest version of Meilisearch with the master key and import the specified dump file
./meilisearch --import-dump /dumps/your_dump_file.dump --master-key="your_master_key"
```

::: warning
If you are using Meilisearch v0.20 or below, migration should be done in two steps. First, import your dump into an instance running any version of Meilisearch from v0.21 to v0.24, inclusive. Second, export another dump from this instance and import it to a final instance running your targeted version.
:::

Importing a dump requires indexing all the documents it contains. Depending on the size of your dataset, this process can take a long time and cause a spike in memory usage.

Finally, don’t forget to set `displayedAttributes` back to its previous value if necessary. You can do this using the [update displayed attributes endpoint](/reference/api/displayed_attributes.md#update-displayed-attributes).

Congratulations! You have successfully migrated your Meilisearch database to the latest version! 🎉

## Updating from v0.14.0 or below

Since these versions predate the [dumps feature](/learn/advanced/dumps.md), the best solution is to export your documents and your [index settings](/learn/configuration/settings.md) as `.JSON` files.

In this guide, we will:

1. [Save your settings](#step-1-save-your-settings)
2. [Set all fields as displayed attributes](#step-2-set-all-fields-as-displayed-attributes)
3. [Save your documents](#step-3-save-your-documents)
4. [Delete the database folder](#step-4-delete-the-database-folder)
5. [Upload your data to the latest version of Meilisearch](#step-5-upload-your-data-to-the-latest-version-of-meilisearch)

If you don’t need to preserve index settings, skip directly to [step two](#step-2-set-all-fields-as-displayed-attributes).

### Step 1: Save your settings

First, use the [get settings endpoint](/reference/api/settings.md#get-settings) to retrieve the [settings](/learn/configuration/settings.md) of any indexes you want to preserve, and save them to a file using the method you prefer.

<CodeSamples id="updating_guide_get_settings" />

Repeat this process for all indexes you wish to migrate.

**It is important to save your settings before exporting documents**, since the next step may require you to modify the settings.

### Step 2: Set all fields as displayed attributes

To prevent data loss, all fields must be set as [displayed](/learn/configuration/displayed_searchable_attributes.md#displayed-fields).

By default, all fields are added to the displayed attributes list. Still, it's a good idea to verify this before proceeding to the next step. You can do so by using the [get displayed attributes endpoint](/reference/api/displayed_attributes.md#get-displayed-attributes):

<CodeSamples id="updating_guide_get_displayed_attributes" />

If the response is `'["*"]'`, you can move on to the [next step](#step-3-save-your-documents).

If it's something else, then you need to use the [reset displayed-attributes endpoint](/reference/api/displayed_attributes.md#reset-displayed-attributes). Before doing this, make sure you save your list of displayed attributes somewhere so you can restore it afterwards.

<CodeSamples id="updating_guide_reset_displayed_attributes" />

This command should return a [summarized task object](/learn/advanced/asynchronous_operations.md#summarized-task-objects) with `type` as `indexUpdate`.

Now that all fields are displayed, proceed to the next step.

### Step 3: Save your documents

Use the [get documents endpoint](/reference/api/documents.md#get-documents) to retrieve your documents and save them using the method you prefer. Make sure to set the `limit` on documents returned so that, if you have some number of documents `n`, `limit ≥ n`. Otherwise, you risk data loss.

<CodeSamples id="updating_guide_retrieve_documents" />

### Step 4: Delete the database folder

To delete the old Meilisearch version, you need to delete the `data.ms` folder. `data.ms` should be at the root of the Meilisearch binary, unless you chose [another location](/learn/configuration/instance_options.md#database-path).

### Step 5: Upload your data to the latest version of Meilisearch

Finally, [install the latest version of Meilisearch](/learn/getting_started/quick_start.md#step-1-setup-and-installation) and upload your data as usual.

If you chose to save your settings, make sure to follow this order:

<CodeSamples id="updating_guide_update_settings" />

<CodeSamples id="updating_guide_add_documents" />

Since updating the settings requires re-indexing all documents, this order saves time and memory.

Congratulations! You have successfully migrated your Meilisearch database to the latest version! 🎉
