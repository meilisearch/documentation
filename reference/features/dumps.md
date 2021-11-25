# Dumps

A dump is a compressed file containing an export of your MeiliSearch instance. It contains all your indexes, documents, and settings, but in a raw unprocessed form. A dump isn't an exact copy of your database—it is closer to a blueprint that allows you to create an identical dataset. A dump can be imported when launching MeiliSearch, but be advised that it may take some time to index all the documents within.

## Creating a dump

To create a dump of your dataset, you need to use the appropriate HTTP route: [`POST /dumps`](/reference/api/dump.md#create-a-dump). he dump creation process is an asynchronous task that takes time proportional to the size of your dataset.

<CodeSamples id="post_dump_1" />

The above code triggers a dump creation process. It also returns an object containing information about the dump:

```
{
  "uid": "20200929-114144097",
  "status": "in_progress",
  "startedAt": "2020-09-29T11:41:44.392327Z"
}
```

You can use the returned `uid` (unique identifier indicating when the dump was triggered) to track its progress with the [get dump status route](/reference/api/dump.md#get-dump-status). The returned status could be:

- `in_progress`: Dump creation is in progress
- `failed`: An error occurred during dump process, and the task was aborted
- `done`: Dump creation is finished and was successful

<CodeSamples id="get_dump_status_1" />

The above code sample returns an object with the following details about the dump:

```
{
  "uid": "20200929-114144097",
  "status": "done",
  "startedAt": "2020-09-29T11:41:44.392327Z",
  "finishedAt": "2020-09-29T11:41:50.792147Z"
}
```

After dump creation is finished, the dump file is added to the dump directory. By default, this folder is named `dumps` and can be found in the same directory as your  MeiliSearch binary. You can customize [this using the `--dumps-dir` configuration option](/reference/features/configuration.md#dumps-destination). **If the dump directory does not already exist when the dump creation process is called, MeiliSearch will create it.**

If a dump file is visible in the file system, the dump process was successfully completed. **MeiliSearch will never create a partial dump file** , even if you interrupt an instance while it is generating a dump.

::: note
Unlike [tasks](/learn/advanced/asynchronous_operations.md), dumps have no queue. **MeiliSearch only processes one dump at a time.** If you attempt to create a dump while another dump is still processing, MeiliSearch will throw an [error](/errors). While a dump is processing, the **task queue is paused and no write operations can occur on the database.** This is also true for [snapshots](/reference/features/snapshots.md#snapshots).
:::

::: warning
If you restart MeiliSearch after creating a dump, you will not be able to use the dumps endpoint to find out that dump's `status`. This has no effect on the dump file itself.
:::

## Importing a dump

Once you have exported a dump you will be able to use the `.dump` file to [launch MeiliSearch with the `--import-dump` command-line flag](/reference/features/configuration.md#import-dump).

As the data contained in the dump needs to be indexed, the process will take some time to complete. Only when the dump has been fully imported will the MeiliSearch server start, after which you can begin searching through your data.

```bash
./meilisearch --import-dump /dumps/20200813-042312213.dump
```

::: note
We do not recommend using dumps from a new MeiliSearch version to import an older version.
For example, you **should not** import a dump from MeiliSearch v0.22.0 to MeiliSearch v0.21.0. But importing a dump from MeiliSearch v0.21.0 to MeiliSearch v0.21.0 or higher will work.
:::

## Use cases

Dumps are used to restore your database after [updating MeiliSearch](/create/how_to/updating.md) or to copy your database to other MeiliSearch instances without having to worry about their respective versions.
