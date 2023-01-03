---
sidebarDepth: 2
---

# Update to the latest Meilisearch version

Currently, Meilisearch databases are only compatible with the version of Meilisearch used to create them. The following guide will walk you through using a [dump](/learn/advanced/dumps.md) to migrate an existing database from an older version of Meilisearch to the most recent one.

If you're updating your Meilisearch instance on cloud platforms like DigitalOcean, AWS, or GCP, ensure that you can connect to your cloud instance via SSH. Depending on the user you are connecting with (root, admin, etc.), you may need to prefix some commands with `sudo`.

::: tip
If you are using v0.22 or above, use our [migration script](https://github.com/meilisearch/meilisearch-migration).
:::

::: danger
This guide only works for versions v0.15 and above. If you are using an older version, please [contact support](https://discord.gg/meilisearch) for more information.
:::

## Version-specific update instructions

This section contains instructions for upgrading from specific versions. Most versions don't require version-specific steps and you should be able to upgrade directly. If the version you are upgrading from isn't listed here, no additional steps are required.

- If you are using **v0.24 or below**, use the `X-MEILI-API-KEY: API_KEY` authorization header:

<CodeSamples id="updating_guide_check_version_old_authorization_header" />

- You might not be able to import your dump due to Meilisearch due to an error affecting `_geo` fields in **v0.27, v0.28, and v0.29**. Please ensure the `_geo` field follows the [correct format](/learn/advanced/geosearch.md#preparing-documents-for-location-based-search).

- If you are **updating to v0.28 or above**, keys imported from the old version will have their `key` and `uid` fields regenerated

## Step 1: Export data

### Verify your database version

First, verify the version of Meilisearch that's compatible with your database using the get version endpoint:

<CodeSamples id="updating_guide_check_version_new_authorization_header" />

The response should look something like this:

```json
{
  "commitSha": "stringOfLettersAndNumbers",
  "commitDate": "YYYY-MM-DDTimestamp",
  "pkgVersion": "x.y.z"
}
```

If your [`pkgVersion`](/reference/api/version.md#version-object) is 0.21 or above, you can jump to [creating the dump](#create-the-dump). If not, proceed to the next step.

### Set all fields as displayed attributes

::: note
If your dump was created in Meilisearch v0.21 or above, continue to the [next step](#create-the-dump).
:::

When creating dumps using Meilisearch versions below v0.21, all fields must be [displayed](/learn/configuration/displayed_searchable_attributes.md#displayed-fields) in order to be saved in the dump.

Start by verifying that all attributes are included in the displayed attributes list:

<CodeSamples id="updating_guide_get_displayed_attributes_old_authorization_header" />

If the response is `{'displayedAttributes': '["*"]'}`, you can move on to the [next step](#create-the-dump).

If the response is anything else, save the current list of displayed attributes in a text file and then reset the displayed attributes list to its default value `(["*"])`:

<CodeSamples id="updating_guide_reset_displayed_attributes_old_authorization_header" />

This command returns an `updateId`. Use the get update endpoint to track the status of the operation:

<CodeSamples id="updating_guide_get_update_status" />

Once the status is `processed`, you're good to go.

### Create the dump

Before creating your dump, make sure that your [dump directory](/learn/configuration/instance_options.md#dumps-directory) is somewhere accessible. By default, dumps are created in a folder called `dumps` at the root of your Meilisearch directory.

**Cloud platforms** like  DigitalOcean, AWS, and GCP are configured to store dumps in the `/var/opt/meilisearch/dumps` directory.

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

Use the `taskUid` to [track the status](/reference/api/tasks.md#get-one-task) of your dump. Keep in mind that the process can take some time to complete.

::: note
The response will vary slightly depending on your version. For v0.27 and below, the response returns a dump `uid`. You can track the status of the dump using the get dumps status endpoint:

<CodeSamples id="updating_guide_get_dump_status" />

:::

Once the `dumpCreation` task shows `"status": "succeeded"`, you're ready to move on.

## Step 2: Prepare for migration

### Stop the Meilisearch instance

Stop your Meilisearch instance.

:::: tabs

::: tab Local installation

If you're running Meilisearch locally, you can stop the program with `Ctrl + c`.

:::

::: tab Cloud platforms

If you're running Meilisearch as a `systemctl` service, connect via SSH to your cloud instance and execute the following command to stop Meilisearch:

```bash
systemctl stop meilisearch
```

You may need to prefix the above command with `sudo` if you are not connected as root.

:::

::::

### Create a backup

Instead of deleting `data.ms`, we suggest creating a backup in case something goes wrong. `data.ms` should be at the root of the Meilisearch binary, unless you chose [another location](/learn/configuration/instance_options.md#database-path).

On **cloud platforms**, you will find the `data.ms` folder at `/var/lib/meilisearch/data.ms`.

Move the binary of the current Meilisearch installation and database to the `/tmp` folder:

:::: tabs

::: tab Local installation

```
mv /path/to/your/meilisearch/directory/meilisearch /tmp
mv /path/to/your/meilisearch/directory/meilisearch/data.ms /tmp/
```

:::

::: tab Cloud platforms

```
mv /usr/bin/meilisearch /tmp
mv /var/lib/meilisearch/data.ms /tmp/
```

:::

::::

## Step 3: Import data

### Install the desired version of Meilisearch

Install the latest version of Meilisearch using:

:::: tabs

::: tab Local installation

```bash
curl -L https://install.meilisearch.com | sh
```

:::

::: tab Cloud platforms

```sh
# replace {meilisearch_version} with the version of your choice. Use the format: `vX.X.X`
curl "https://github.com/meilisearch/meilisearch/releases/download/{meilisearch_version}/meilisearch-linux-amd64" --output meilisearch --location --show-error
```

:::

::::

Give execute permission to the Meilisearch binary:

```
chmod +x meilisearch
```

For **cloud platforms**, move the new Meilisearch binary to the `/usr/bin` directory containing the executable files:

```
mv meilisearch /usr/bin/meilisearch
```

::: warning
If you are using Meilisearch v0.20 or below, migration should be done in two steps. First, import your dump into an instance running any version of Meilisearch from v0.21 to v0.24, inclusive. Second, export another dump from this instance and import it to a final instance running your targeted version.

Once Meilisearch v1 is released, this two-step process won't be necessary as v1 will be compatible with dumps from all previous versions.
:::

### Launch Meilisearch and import the dump

Execute the command below to import the dump at launch:

:::: tabs

::: tab Local installation

```bash
# replace {dump_uid.dump} with the name of your dump file
./meilisearch --import-dump dumps/{dump_uid.dump} --master-key="MASTER_KEY"
```

:::

::: tab Cloud platforms

```sh
# replace {dump_uid.dump} with the name of your dump file
meilisearch --db-path /var/lib/meilisearch/data.ms --import-dump "/var/opt/meilisearch/dumps/{dump_uid.dump}"
```

:::

::::

Importing a dump requires indexing all the documents it contains. Depending on the size of your dataset, this process can take a long time and cause a spike in memory usage.

### Restart Meilisearch as a service

If you're running a **cloud instance**, press `Ctrl`+`C`  to stop Meilisearch once your dump has been correctly imported. Next, execute the following command to run the script to configure Meilisearch and restart it as a service:

```
meilisearch-setup
```

If required, set `displayedAttributes` back to its previous value using the [update displayed attributes endpoint](/reference/api/settings.md#update-displayed-attributes).

### Delete backup files or rollback (_optional_)

Now that your updated Meilisearch instance is up and running, verify that the dump import was successful and no data was lost.

If for some reason, something went wrong, you can always roll back to the previous version. Move the files back to their previous location using:

:::: tabs

::: tab Local installation

```
mv /tmp/meilisearch /path/to/your/meilisearch/directory/meilisearch
mv /tmp/data.ms /path/to/your/meilisearch/directory/meilisearch/data.ms
```

:::

::: tab Cloud platforms

```
mv /tmp/meilisearch /usr/bin/meilisearch
mv /tmp/data.ms /var/lib/meilisearch/data.ms
```

:::

::::

For **cloud platforms** run the configuration script at the root of your Meilisearch directory:

```
meilisearch-setup
```

If all went well, you can delete the backup files using:

```
rm -r /tmp/meilisearch
rm -r /tmp/data.ms
```

You can also delete the dump file if desired:

:::: tabs

::: tab Local installation

```
rm /path/to/your/meilisearch/directory/meilisearch/dumps/{dump_uid.dump}
```

:::

::: tab Cloud platforms

```
rm /var/opt/meilisearch/dumps/{dump_uid.dump}
```

:::

::::
