# Update to the latest Meilisearch version

Currently, Meilisearch databases can only be opened by the Meilisearch version you used to create them. The following guide will walk you through all the steps to migrate an existing database from an older version of Meilisearch to the most recent one.

If you already have a Meilisearch database with some data you don’t want to lose, you are in the right place!

::: danger
This guide does not work for versions below v0.15. For more information, [contact support](https://slack.meilisearch.com/).
:::

## Step 1: Verify your database version

Before we begin, you need to verify the version of Meilisearch that's compatible with your database, in other words, the version that indexed the data. You can do so by launching a Meilisearch instance:

```bash
./meilisearch --master-key="MASTER_KEY"
```

If Meilisearch launches successfully, use the get version endpoint, note your `pkgVersion`, and [proceed to the next step](#step-2-set-all-fields-as-displayed-attributes).

<CodeSamples id="updating_guide_check_version_new_authorization_header" />

::: note
If you're using v0.24 or below, use the `X-MEILI-API-KEY: apiKey` authorization header:

 <CodeSamples id="updating_guide_check_version_old_authorization_header" />
:::

The response should look something like this:

```json
{
  "commitSha": "stringOfLettersAndNumbers",
  "commitDate": "YYYY-MM-DDTimestamp",
  "pkgVersion": "x.y.z"
}
```

If you get the error `Cannot open database, expected Meilisearch engine version: 0.X.X, current engine version 0.Y.Y`, your database is not compatible with the currently installed Meilisearch version.

In this case, you need to download the compatible version now (`0.X.X` in the above error message) to access and export your database.

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

:::note
If you are updating to v0.28, keys imported from the old version will have their `key` and `uid` fields regenerated.
:::

## Step 2: Set all fields as displayed attributes

::: note
If your dump was created in Meilisearch v0.21 or above, continue to [step 3](#step-3-create-the-dump).
:::

When creating dumps using Meilisearch versions below v0.21, all fields must be [displayed](/learn/configuration/displayed_searchable_attributes.md#displayed-fields) in order to be saved in the dump.

Start by verifying that all attributes are included in the displayed attributes list:

<CodeSamples id="updating_guide_get_displayed_attributes_new" />

If the response is `{'displayedAttributes': '["*"]'}`, you can move on to the [next step](#step-3-create-the-dump).

If it's something else, then you need to reset the list of displayed attributes. Before doing this, make sure you save your list of displayed attributes somewhere so you can restore it afterwards.

<CodeSamples id="updating_guide_reset_displayed_attributes_new" />

This command returns a `taskUid`. You can use this to [track the status of the operation](/reference/api/tasks.md#get-one-task). Once the status is `succeeded`, you're good to go.

Now that all fields are displayed, proceed to the next step.

## Step 3: Create the dump

Before creating your dump, make sure that your [dump directory](/learn/configuration/instance_options.md#dumps-directory) is somewhere accessible. By default, dumps are created in a folder called `dumps` at the root of your Meilisearch directory.

::: note
If you are running Meilisearch in a service using `systemd`, like AWS or a DO droplet, the dumps folder can be found in the configuration file directory, `cd /var/opt/meilisearch/dumps`.
:::

If you're unsure where your Meilisearch directory is located, try this:

:::: tabs

::: tab UNIX

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

You can then create a dump of your database:

<CodeSamples id="updating_guide_create_dump" />

The server should return a response that looks like this:

```json
{
  "taskUid": 1,
  "indexUid": null,
  "status": "enqueued",
  "type": "dumpCreation",
  "enqueuedAt": "2022-06-21T16:10:29.217688Z"
}
```

This command returns a `taskUid`. You can use this to [track the status](/reference/api/tasks.md#get-one-task) of your dump. Keep in mind that the process can take some time to complete.

Once the `dumpCreation` task shows `"status": "succeeded"`, you're ready to move on.

```json
{
  "uid": 1,
  "indexUid": null,
  "status": "succeeded",
  "type": "dumpCreation",
  "canceledBy": null,
  "details": {
    "dumpUid": "20220621-161029217"
  },
  "error": null,
  "duration": "PT0.025872S",
  "enqueuedAt": "2022-06-21T16:10:29.217688Z",
  "startedAt": "2022-06-21T16:10:29.218297Z",
  "finishedAt": "2022-06-21T16:10:29.244169Z"
}
```

## Step 4: Stop the Meilisearch instance

Stop your Meilisearch instance. If you're running Meilisearch as a `systemctl` service, you can stop your instance with:

```bash
systemctl stop meilisearch
```

## Step 5: Delete the database folder

To delete the old Meilisearch version, you need to delete the `data.ms` folder. `data.ms` should be at the root of the Meilisearch binary, unless you chose [another location](/learn/configuration/instance_options.md#database-path).

::: note
If you are using the Meilisearch official images on DigitalOcean, AWS, or GCP, you will find the `data.ms` folder at `/var/lib/meilisearch/data.ms`.
:::

## Step 6: Import the dump

Now that you’ve got your dump, install the [latest version of Meilisearch](/learn/getting_started/quick_start.md#setup-and-installation) and [import the dump](/learn/advanced/dumps.md#importing-a-dump) at launch using the CLI option:

```bash
# launch the latest version of Meilisearch with the master key and import the specified dump file
./meilisearch --import-dump /dumps/your_dump_file.dump --master-key="MASTER_KEY"
```

::: warning
If you are using Meilisearch v0.20 or below, migration should be done in two steps. First, import your dump into an instance running any version of Meilisearch from v0.21 to v0.24, inclusive. Second, export another dump from this instance and import it to a final instance running your targeted version.
:::

Importing a dump requires indexing all the documents it contains. Depending on the size of your dataset, this process can take a long time and cause a spike in memory usage.

Finally, don’t forget to set `displayedAttributes` back to its previous value if necessary. You can do this using the [update displayed attributes endpoint](/reference/api/settings.md#update-displayed-attributes).

Congratulations! You have successfully migrated your Meilisearch database to the latest version! 🎉
