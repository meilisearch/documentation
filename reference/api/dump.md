# Dumps

The `dumps` route allows the creation of database dumps. Dumps are `.dump` files that can be used to launch MeiliSearch. Dumps are compatible between MeiliSearch versions.

Creating a dump is also referred to as exporting it, whereas launching MeiliSearch with a dump is referred to as importing it.

During a [dump export](/reference/api/dump.md#create-a-dump), all indexes of the current instance are exported—together with their documents and settings—and saved as a single `.dump` file.

During a dump import, all indexes contained in the indicated `.dump` file are imported along with their associated documents and settings. Any existing index with the same uid as an index in the dump file will be overwritten.

Dump imports are [performed at launch](/reference/features/configuration.md#import-dump) using an option. [Batch size](/reference/features/configuration.md#dump-batch-size) can also be set at this time.

## Create a dump

<RouteHighlighter method="POST" route="/dumps"/>

Triggers a dump creation process. Once the process is complete, a dump is created in the [dumps directory](/reference/features/configuration.md#dumps-destination). If the dumps directory does not exist yet, it will be created.

### Example

<CodeSamples id="post_dump_1" />

#### Response: `202 Accepted`

```json
{
  "uid": "20200929-114144097",
  "status": "in_progress"
}
```

## Get dump status

<RouteHighlighter method="GET" route="/dumps/:dump_uid/status"/>

Get the status of a dump creation process using the uid returned after calling the [dump creation route](/reference/api/dump.md#create-a-dump).
The returned status could be:

- `in_progress`: Dump creation is in progress.
- `failed`: An error occured during dump process, and the task was aborted.
- `done`: Dump creation is finished and was successful.

### Example

<CodeSamples id="get_dump_status_1" />

#### Response: `200 Ok`

```json
{
  "uid": "20200929-114144097",
  "status": "done"
}
```
