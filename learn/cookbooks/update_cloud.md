# Update Meilisearch on the cloud

The following guide walks you through the steps required to update your Meilisearch instance from an older version to the most recent on DigitalOcean, AWS, or GCP when using the Meilisearch official images.

::: danger
This guide does not work for versions below v0.15. For more information, [contact support](https://discord.gg/meilisearch)
:::

You'll need to connect via SSH to your cloud instance, and depending on the user you are connecting with (root, admin, etc.), you may need to prefix some commands with `sudo`

::: tip
If you are using v0.22 or above, use our [migration script](https://github.com/meilisearch/meilisearch-migration) to update to a newer Meilisearch version without losing data or settings.
:::

## Step 1: Verify your database version

Use the get version endpoint to check your Meilisearch version:

```sh
curl \
  -X GET 'http://<your-domain-name>/version' \
  -H 'Authorization: Bearer API_KEY'
```

::: warning
If you get a [`missing_authorization_header`](/reference/errors/error_codes.md#missing-authorization-header) error code, you might be using v0.24 or below. Change the authorization header to `X-MEILI-API-KEY: apiKey`:

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

If your `pkgVersion` is 0.21 or higher, you can jump to [step 3](#step-3-create-the-dump). If not, please proceed to the next step.

## Step 2: Set all fields as displayed attributes

::: warning
This step is only mandatory if you are on v0.20 or below.
:::

When creating dumps using Meilisearch versions v0.20 or below, all fields must be displayed to be saved in the dump.

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

Before creating your dump, ensure that your dump directory is accessible. By default, dumps are created in a folder called `dumps` in the configuration file directory: `/var/opt/meilisearch/dumps`

You can then create a dump of your Meilisearch database using:

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

## Step 5: Save the current binary and database for backup

Move the binary of the current Meilisearch version and the database to the `tmp/` folder:

```
mv /usr/bin/meilisearch /tmp
mv /var/lib/meilisearch/data.ms /tmp/
```

## Step 6: Install the desired version of Meilisearch

Dumps from Meilisearch v0.20.0 and below are no longer compatible with the new versions. Thus migration should be done in two steps. First, import your dump into an instance running any version of Meilisearch from v0.21 to v0.24, inclusive. Second, create another dump with that instance (v0.21 to v0.24) and import it to a final instance running your targeted version.

::: note
Once Meilisearch v1 is released, this two-step process won't be necessary as v1 will be compatible with dumps from all previous versions.
:::

Use the command below to download the Meilisearch binary:

```sh
# replace {meilisearch_version} with the version of your choice. Use the format: `vX.X.X`
curl "https://github.com/meilisearch/meilisearch/releases/download/{meilisearch_version}/meilisearch-linux-amd64" --output meilisearch --location --show-error
```

Give read and write access to meilisearch binary:

```
chmod +x meilisearch
```

Move the new Meilisearch binary to the systemd directory containing the executable files:

```
mv meilisearch /usr/bin/meilisearch
```

## Step 7: Launch Meilisearch and import the dump

Now that you've got the desired Meilisearch version, execute the command below to import the dump at launch.

```
# replace {dump_uid.dump} with the name of your dump file
meilisearch --db-path /var/lib/meilisearch/data.ms --import-dump "/var/opt/meilisearch/dumps/{dump_uid.dump}"
```

Importing a dump requires indexing all the documents it contains. Depending on the size of your dataset, this process can take a long time and cause a spike in memory usage.

::: danger Updating from  v0.27, v0.28, or v0.29 to v0.30 with the documents containing the `_geo` field
You might not be able to import your dump due to Meilisearch allowing malformed `_geo` fields in the above mentioned versions. Please ensure the `_geo` field follows the [correct format](/learn/advanced/geosearch.md#preparing-documents-for-location-based-search).
:::

## Step 8: Restart Meilisearch as a service

Once your dump has been correctly imported, press `Ctrl`+`C`  to stop Meilisearch. Next, execute the command below to run the script to configure Meilisearch and restart it as a service:

```
meilisearch-setup
```

Don't forget to set `displayedAttributes` back to its previous value if necessary. You can do this using the [update displayed attributes endpoint](/reference/api/settings.md#update-displayed-attributes).

Congratulations! You have successfully migrated your Meilisearch database to the latest version!

## Step 9: Clean files or rollback

If you've gone through all the previous steps and Meilisearch is up and running, it's time to do some cleanup. Remember those files we saved for backup? You can delete them with the following commands:

```
rm /tmp/meilisearch
rm -r /tmp/data.ms
```

Since you no longer need it, you can also delete the dump file:

```
rm /var/opt/meilisearch/dumps/{dump_uid.dump}

```

If for some reason, something went wrong, you can always roll back to the previous version. Move the files back to their previous location using:

```
mv /tmp/meilisearch /usr/bin/meilisearch
mv /tmp/data.ms /var/lib/meilisearch/data.ms

```

And run the configuration script: `meilisearch-setup`
