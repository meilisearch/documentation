# Dumps

A dump is a compressed file containing an export of your MeiliSearch instance. It contains all your indexes, documents, and settings, but in a raw unprocessed form. A dump isn't an exact copy of your database—it is closer to a blueprint that allows you to create an identical dataset. A dump can be imported when launching MeiliSearch, but be advised that it may take some time to index all the documents within.

## Creating a dump

To create a dump of your dataset, you need to use the appropriate HTTP route: `POST /dumps`. Using that route will trigger a dump creation process. Creating a dump is an asynchronous task that takes time based on the size of your dataset. A dump uid (unique identifier) is returned to help you track the process.

<CodeSamples id="post_dump_1" />

The above code triggers a dump creation process.

At any given moment, you can check the status of a particular dump creation process using the previously received dump uid, like so: `GET /dumps/:dump_uid/status`. Using this route, you can know whether your dump is still processing, has already been created, or has encountered a problem.

<CodeSamples id="get_dump_status_1" />

After your dump creation process is done, the dump file is created and added in the dump folder. By default, this folder is `/dumps` at the root of your MeiliSearch binary, but this can be customized. Note that **if your dump folder does not already exist when the dump creation process is called, MeiliSearch will create it**.

## Importing a dump

Once you have exported a dump, which is a `.dump` file, you are now able to use that dump to launch MeiliSearch. As the data contained in the dump needs to be indexed, the process will take some time to complete. Only when the dump has been fully imported will the MeiliSearch server start, after which you can begin searching through your data.

```bash
./meilisearch --import-dump /dumps/20200813-042312213.dump
```

Because importing a dump is the same process as when documents are initially indexed by MeiliSearch, it can require some time and memory. If your dataset is very large, it is good practice to index documents in larger batches. This will speed up the indexing process at the cost of memory.

[See here for more dumps options](/reference/features/configuration.md#dumps-destination)

## Use cases

Dumps are used to restore your database after MeiliSearch updates or to communicate your database to other instances of MeiliSearch (e.g. running on different servers) without having to worry about their respective versions.
