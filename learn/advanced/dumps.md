# Dumps

Meilisearch stores its database in files located in `./data.ms` by default. Because this database is bound to the version of Meilisearch that created it, you must use dumps to migrate data between Meilisearch releases.

A dump is a compressed file containing an export of your Meilisearch instance. It contains all your indexes, documents, and settings, but in a raw unprocessed form. A dump isn't an exact copy of your database—it is closer to a blueprint that allows you to create an identical dataset.

Creating a dump is also referred to as exporting it, whereas launching Meilisearch with a dump is referred to as importing it.

## Creating a dump

To create a dump of your dataset, to use the [create a dump endpoint](/reference/api/dump.md#create-a-dump):

<CodeSamples id="post_dump_1" />

The above code triggers a dump creation process. It also returns a [summarized task object](/learn/advanced/asynchronous_operations.md#summarized-task-objects) that you can use to check the status of your dump.

```json
{
  "taskUid": 1,
  "indexUid": null,
  "status": "enqueued",
  "type": "dumpCreation",
  "enqueuedAt": "2022-06-21T16:10:29.217688Z"
}
```

In the below command, replace `1` with the `taskUid` returned by the previous command.

<CodeSamples id="get_task_1" />

This command should return an object with detailed information about the dump operation:

```json
{
  "uid": 1,
  "indexUid": null,
  "status": "succeeded",
  "type": "dumpCreation",
  "details": {
    "dumpUid": "20220621-161029217"
  },
  "duration": "PT0.025872S",
  "enqueuedAt": "2022-06-21T16:10:29.217688Z",
  "startedAt": "2022-06-21T16:10:29.218297Z",
  "finishedAt": "2022-06-21T16:10:29.244169Z"
}
```

The dump creation process is an asynchronous task that takes time proportional to the size of your dataset. All indexes of the current instance are exported along with their documents and settings and saved as a single `.dump` file.

After dump creation is finished—when `status` is `succeeded`—the dump file is added to the dump directory. By default, this folder is named `dumps` and can be found in the same directory as your Meilisearch binary. You can customize [this using the `--dumps-dir` configuration option](/learn/configuration/instance_options.md#dumps-destination). **If the dump directory does not already exist when the dump creation process is called, Meilisearch will create it.**

If a dump file is visible in the file system, the dump process was successfully completed. **Meilisearch will never create a partial dump file**, even if you interrupt an instance while it is generating a dump.

## Importing a dump

Dump imports must be performed when launching a Meilisearch instance [using the `import-dump` command-line option](/learn/configuration/instance_options.md#import-dump).

During a dump import, all indexes contained in the indicated `.dump` file are imported along with their associated documents and settings. Any existing index with the same `uid` as an index in the dump file will be overwritten.

While a dump is being imported, the API is not available to the task queue. As a result, no read or write operations can be performed until the importing process is complete.

Dumps from v0.20.0 and below are no longer compatible with the new versions. Before you start importing, check your [Meilisearch version](/reference/api/version.md#example) and proceed accordingly.

::: note
We do not recommend using dumps to migrate from a new Meilisearch version to an older one.

For example, you can import a dump from Meilisearch v0.21 into v0.22 without any problems. Importing a dump generated in v0.22 into a v0.21 instance, however, can lead to unexpected behavior.
:::

### Importing a dump for v0.21 or above

Once you have exported a dump you will be able to use the `.dump` file to [launch Meilisearch with the `--import-dump` command-line flag](/learn/configuration/instance_options.md#import-dump).

As the data contained in the dump needs to be indexed, the process will take some time to complete. Only when the dump has been fully imported will the Meilisearch server start, after which you can begin searching through your data.

```bash
./meilisearch --import-dump /dumps/20200813-042312213.dump
```

### Importing a dump for v0.20 or below

If you are using Meilisearch v0.20 or below, migration should be done in two steps. First, import your v0.20 dump into an instance running any version of Meilisearch between v0.21 and v0.25. Second, export another dump from this instance and import it to a final instance running your targeted version.

## Use cases

Dumps are used to restore your database after [updating Meilisearch](/learn/advanced/updating.md) or to copy your database to other Meilisearch instances without having to worry about their respective versions. For more on this subject, see a [comparison of snapshots and dumps](/learn/advanced/snapshots_vs_dumps.md).
