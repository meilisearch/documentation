# Update Meilisearch on cloud platforms

::: danger
This guide does not work for versions below v0.15. For more information, [contact support](https://discord.gg/meilisearch)
:::

The following guide walks you through the steps required to update your Meilisearch instance from an older version to the most recent on DigitalOcean, AWS, or GCP using the Meilisearch official images.

You can [connect via SSH](https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/) to your cloud instance, and depending on the user you are connecting with (root, admin, etc.), you may need to prefix some commands with `sudo`.

::: tip
If you are using v0.22 or above, use our [migration script](https://github.com/meilisearch/meilisearch-migration) to update to a newer Meilisearch version without losing data or settings.
:::

## Step 1: Verify your database version

Before we begin, you need to verify the version of Meilisearch that's compatible with your database, in other words, the version that indexed the data.

Use the get version endpoint to check your Meilisearch version:

```sh
curl \
  -X GET 'http://<your-domain-name>/version' \
  -H 'Authorization: Bearer API_KEY'
```

::: warning
If Meilisearch returns a [`missing_authorization_header`](/reference/errors/error_codes.md#missing-authorization-header) error code, you might be using v0.24 or below. Change the authorization header to `X-MEILI-API-KEY: apiKey`:

```sh
curl \
  -X GET 'http://<your-domain-name>/version' \
  -H 'X-Meili-API-Key: API_KEY'  

```

:::

The response should look something like this:

```json
{
  "commitSha": "stringOfLettersAndNumbers",
  "commitDate": "YYYY-MM-DDTimestamp",
  "pkgVersion": "x.y.z"
}
```

::: note
If you are updating to v0.28 or above, keys imported from the old version will have their `key` and `uid` fields regenerated
:::

If your `pkgVersion` is 0.21 or above, you can jump to [step 3](#step-3-create-the-dump). If not, proceed to the next step.

## Step 2: Set all fields as displayed attributes

::: warning
This step is only required if you are using v0.20 or below.
:::

When creating dumps using Meilisearch versions v0.20 or below, all fields must be [displayed](/learn/configuration/displayed_searchable_attributes.md) to be saved in the dump.

Start by verifying that all attributes are included in the displayed attributes list:

```sh
# replace {index_uid} with your index's unique id
curl \
  -X GET 'http://<your-domain-name>/indexes/{index_uid}/settings/displayed-attributes' \
  -H 'X-Meili-API-Key: API_KEY'  

```

If the response is `{'displayedAttributes': '["*"]'}`, you can proceed on to [step 3](#step-3-create-the-dump).

If it's something else, save the current list of displayed attributes to restore it after the migration is complete. Next, reset the list of displayed attributes to its default value (`["*"]`) using:

```sh
curl \
  -X DELETE 'http://<your-domain-name>/indexes/{index_uid}/settings/displayed-attributes' \
  -H 'X-Meili-API-Key: API_KEY'  
```

This command returns an `updateId`. You can use this to track the status of the operation.

```sh
# replace {updateId} with the updateId returned by the previous request
curl \
  -X GET 'http://<your-domain-name>/indexes/{index_uid}/updates/{updateId}' \
  -H 'X-Meili-API-Key: API_KEY'  
```

Once the status updates to `processed`, you're good to go.

## Step 3: Create the dump

Before creating your dump, ensure that your [dump directory](/learn/configuration/instance_options.md#dumps-directory) is accessible. By default, dumps are created in a folder called `dumps` in the configuration file directory: `/var/opt/meilisearch/dumps`

Use the following command to create a dump of your Meilisearch database:

```sh
curl \
  -X POST 'http://<your-domain-name>/dumps' \
  -H 'Authorization: Bearer API_KEY' 
# -H 'X-Meili-API-Key: API_KEY' for v0.24 or below
```

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
The response will vary slightly depending on your version. For v0.27 and below, the response returns a dump `uid`.
:::

Use the `taskUid` to track the status of the dump with the get task endpoint:

```sh
# replace {taskUid} with the value returned in the previous response
curl \
  -X GET 'http://<your-domain-name>/tasks/{taskUid}' \
  -H 'Authorization: Bearer API_KEY' 
```

Once the `status` updates to `succeeded`, move on to the next step.

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

If you haven't done it yet, connect via SSH to your cloud instance and execute the following command to stop Meilisearch. Remember you may need to prefix it with `sudo` if you are not connected as root.

```
systemctl stop meilisearch
```

## Step 5: Create a backup

Instead of deleting `data.ms`, we suggest creating a backup in case something goes wrong. `data.ms` can be found at `/var/lib/meilisearch/data.ms`.

Move the binary of the current Meilisearch version and the database to the `tmp/` folder:

```
mv /usr/bin/meilisearch /tmp
mv /var/lib/meilisearch/data.ms /tmp/
```

## Step 6: Install the desired version of Meilisearch

Install the latest version of Meilisearch using:

```sh
# replace {meilisearch_version} with the version of your choice. Use the format: `vX.X.X`
curl "https://github.com/meilisearch/meilisearch/releases/download/{meilisearch_version}/meilisearch-linux-amd64" --output meilisearch --location --show-error
```

Give execute permission to the Meilisearch binary:

```
chmod +x meilisearch
```

Move the new Meilisearch binary to the systemd directory containing the executable files:

```
mv meilisearch /usr/bin/meilisearch
```

## Step 7: Launch Meilisearch and import the dump

Execute the command below to import the dump at launch.

```
# replace {dump_uid.dump} with the name of your dump file
meilisearch --db-path /var/lib/meilisearch/data.ms --import-dump "/var/opt/meilisearch/dumps/{dump_uid.dump}"
```

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

## Step 9: Clean files or rollback

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
