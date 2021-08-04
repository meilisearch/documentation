# Dumps

A dump is a compressed file containing an export of your MeiliSearch instance. It contains all your indexes, documents, and settings, but in a raw unprocessed form. A dump isn't an exact copy of your database—it is closer to a blueprint that allows you to create an identical dataset. A dump can be imported when launching MeiliSearch, but be advised that it may take some time to index all the documents within.

## Creating a dump

To create a dump of your dataset, you need to use the appropriate HTTP route: [`POST /dumps`](/reference/api/dump.md#create-a-dump). Using that route will trigger a dump creation process. Creating a dump is an asynchronous task that takes time based on the size of your dataset. A dump uid (unique identifier) is returned to help you track the process.

<CodeSamples id="post_dump_1" />

The above code triggers a dump creation process.

You can check the status of a particular dump creation process using the previously received `dump uid`: [`GET /dumps/:dump_uid/status`](/reference/api/dump.md#get-dump-status). Using this route, you can check whether your dump is still processing, has already been created, or has encountered a problem.

<CodeSamples id="get_dump_status_1" />

After your dump creation process is done, the dump file is created and added to the dump folder. By default, this folder is `/dumps` at the root of your MeiliSearch binary, [but this can be customized](/reference/features/configuration.md#dumps-destination).

Note that **if your dump folder does not already exist when the dump creation process is called, MeiliSearch will create it**.

If you restart MeiliSearch after creating a dump, you will not be able to use the dumps endpoint to find out that dump's `status`. This has no effect on the dump file itself.

::: note
If a dump file is visible in the file system, the dump process was successfully completed. MeiliSearch will never create a partial dump file if you interrupt an instance while it is generating a dump.
:::

## Importing a dump

Once you have exported a dump you will be able to use the `.dump` file to [launch MeiliSearch with the `--import-dump` command-line flag](/reference/features/configuration.md#import-dump).

As the data contained in the dump needs to be indexed, the process will take some time to complete. Only when the dump has been fully imported will the MeiliSearch server start, after which you can begin searching through your data.

```bash
./meilisearch --import-dump /dumps/20200813-042312213.dump
```

## Use cases

Dumps are used to restore your database after [updating MeiliSearch](/create/how_to/updating.md) or to copy your database to other MeiliSearch instances without having to worry about their respective versions.
