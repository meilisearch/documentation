# Update to the latest Meilisearch version

::: danger
This guide does not work for versions below v0.15. For more information, [contact support](https://discord.gg/meilisearch).
:::

Currently, Meilisearch databases can only be opened by the Meilisearch version you used to create them. The following guide will walk you through all the steps to migrate an existing database from an older version of Meilisearch to the most recent one.

If you're updating your Meilisearch instance on cloud platforms like DigitalOcean, AWS, or GCP, ensure that you are able to your cloud instance connect via SSH. Depending on the user you are connecting with (root, admin, etc.), you may need to prefix some commands with `sudo`.

::: tip
If you are using v0.22 or above, use our [migration script](https://github.com/meilisearch/meilisearch-migration) to update to a newer Meilisearch version without losing data or settings.
:::

## Step 1: Verify your database version

Before we begin, you need to verify the version of Meilisearch that's compatible with your database, in other words, the version that indexed the data. You can do so by launching a Meilisearch instance:

If Meilisearch launches successfully, use the get version endpoint and note your `pkgVersion`:

<CodeSamples id="updating_guide_check_version_new_authorization_header" />

::: warning
If Meilisearch returns a [`missing_authorization_header`](/reference/errors/error_codes.md#missing-authorization-header) error code, you might be using v0.24 or below. Change the authorization header to `X-MEILI-API-KEY: apiKey`:

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

If your `pkgVersion` is 0.21 or above, you can jump to [step 3](#step-3-create-the-dump). If not, proceed to the next step.

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

::: warning
If your dump was created in Meilisearch v0.21 or above, continue to [step 3](#step-3-create-the-dump).
:::

When creating dumps using Meilisearch versions below v0.21, all fields must be [displayed](/learn/configuration/displayed_searchable_attributes.md#displayed-fields) in order to be saved in the dump.

Start by verifying that all attributes are included in the displayed attributes list:

<CodeSamples id="updating_guide_get_displayed_attributes_new" />

If the response is `{'displayedAttributes': '["*"]'}`, you can move on to the [next step](#step-3-create-the-dump).

If it's something else, save the current list of displayed attributes to restore it after the migration is complete. Next, reset the list of displayed attributes to its default value (["*"]) using:

<CodeSamples id="updating_guide_reset_displayed_attributes_new" />

This command returns a `updateId`. You can use this to [track the status of the operation](/reference/api/tasks.md#get-one-task). Once the status is `processed`, you're good to go.

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

::: note
The response will vary slightly depending on your version. For v0.27 and below, the response returns a dump `uid`. You can track the status of the dump using the get dumps status endpoint:

```sh
curl \
  -X GET /dumps/:dump_uid/status
  -H 'Authorization: Bearer API_KEY' 
# -H 'X-Meili-API-Key: API_KEY' for v0.24 or below
```

:::

Use the `taskUid` to [track the status](/reference/api/tasks.md#get-one-task) of your dump. Keep in mind that the process can take some time to complete.

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

Stop your Meilisearch instance. If you're running Meilisearch as a `systemctl` service, connect via SSH to your cloud instance and execute the following command to stop Meilisearch:

```bash
systemctl stop meilisearch
```

You may need to prefix the above command with `sudo` if you are not connected as root.

## Step 5: Create a backup

Instead of deleting `data.ms`, we suggest creating a backup in case something goes wrong. `data.ms` should be at the root of the Meilisearch binary, unless you chose [another location](/learn/configuration/instance_options.md#database-path).

::: note
If you are using the Meilisearch official images on DigitalOcean, AWS, or GCP, you will find the `data.ms` folder at `/var/lib/meilisearch/data.ms`.
:::

Move the binary of the current Meilisearch version and the database to the `tmp/` folder:

:::: tabs

::: tab Meilisearch instance

```

```

:::

::: tab Cloud platforms

```
mv /usr/bin/meilisearch /tmp
mv /var/lib/meilisearch/data.ms /tmp/
```

:::

::::

## Step 6: Install the desired version of Meilisearch

Install the latest version of Meilisearch using:

:::: tabs

::: tab Meilisearch instance

```
# Install Meilisearch
curl -L https://install.meilisearch.com | sh

# Launch Meilisearch
./meilisearch
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

For cloud platforms, move the new Meilisearch binary to the `/usr/bin` directory containing the executable files:

```
mv meilisearch /usr/bin/meilisearch
```

## Step 7: Launch Meilisearch and import the dump

Execute the command below to import the dump at launch:

:::: tabs

::: tab Meilisearch instance

```bash
# launch the latest version of Meilisearch with the master key and import the specified dump file
./meilisearch --import-dump /dumps/{your_dump_file.dump} --master-key="MASTER_KEY"
```

:::

::: tab Cloud platforms

```sh
# replace {dump_uid.dump} with the name of your dump file
meilisearch --db-path /var/lib/meilisearch/data.ms --import-dump "/var/opt/meilisearch/dumps/{dump_uid.dump}"
```

:::

::::

::: warning
If you are using Meilisearch v0.20 or below, migration should be done in two steps. First, import your dump into an instance running any version of Meilisearch from v0.21 to v0.24, inclusive. Second, export another dump from this instance and import it to a final instance running your targeted version.

Once Meilisearch v1 is released, this two-step process won't be necessary as v1 will be compatible with dumps from all previous versions.
:::

Importing a dump requires indexing all the documents it contains. Depending on the size of your dataset, this process can take a long time and cause a spike in memory usage.

::: danger `_geo` field in v0.27, v0.28, and v0.29
You might not be able to import your dump due to Meilisearch allowing malformed `_geo` fields in the above-mentioned versions. Please ensure the `_geo` field follows the [correct format](/learn/advanced/geosearch.md#preparing-documents-for-location-based-search).
:::

## Step 8: Restart Meilisearch as a service

Once your dump has been correctly imported, press `Ctrl`+`C`  to stop Meilisearch. Next, execute the following command to run the script to configure Meilisearch and restart it as a service:

```
meilisearch-setup
```

If required, set `displayedAttributes` back to its previous value using the [update displayed attributes endpoint](/reference/api/settings.md#update-displayed-attributes).

## Step 9: Delete backup files or rollback

Now that your Meilisearch instance is up and running, you can delete the backup files with the following commands:

```
rm /tmp/meilisearch
rm -r /tmp/data.ms
```

You can also delete the dump file using:

```
rm /var/opt/meilisearch/dumps/{dump_uid.dump}
```

If for some reason, something went wrong, you can always roll back to the previous version. Move the files back to their previous location using:

```
mv /tmp/meilisearch /usr/bin/meilisearch
mv /tmp/data.ms /var/lib/meilisearch/data.ms
```

And run the configuration script:

```
meilisearch-setup
```
