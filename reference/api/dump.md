# Dumps

The `dumps` route allows the creation of database dumps. Dumps are `.dump` files that can be used to launch Meilisearch. Dumps are compatible between Meilisearch versions.

Creating a dump is also referred to as exporting it, whereas launching Meilisearch with a dump is referred to as importing it.

During a [dump export](/reference/api/dump.md#create-a-dump), all indexes of the current instance are exported—together with their documents and settings—and saved as a single `.dump` file.

During a dump import, all indexes contained in the indicated `.dump` file are imported along with their associated documents and settings. Any existing index with the same uid as an index in the dump file will be overwritten.

Dump imports must be performed when launching a Meilisearch instance [using the `import-dump` command-line option](/learn/configuration/instance_options.md#import-dump).

## Create a dump

<RouteHighlighter method="POST" route="/dumps"/>

Triggers a dump creation process. Once the process is complete, a dump is created in the [dumps directory](/learn/configuration/instance_options.md#dumps-destination). If the dumps directory does not exist yet, it will be created.

**Meilisearch only processes one dump at a time.** If you attempt to create a dump while another dump is still processing, Meilisearch will throw a [`dump_already_processing` error](/reference/api/error_codes.md#dump-already-processing). The task queue will not process any further tasks during dump creation, but you can still add new requests to the queue.

### Example

<CodeSamples id="post_dump_1" />

#### Response: `202 Accepted`

```json
{
  "uid": "20200929-114144097",
  "status": "in_progress",
  "startedAt": "2020-09-29T11:41:44.392327Z"
}
```

## Get dump status

<RouteHighlighter method="GET" route="/dumps/:dump_uid/status"/>

Get the status of a dump creation process using the uid returned after calling the [dump creation route](/reference/api/dump.md#create-a-dump).
The returned status could be:

- `in_progress`: Dump creation is in progress
- `failed`: An error occurred during dump process, and the task was aborted
- `done`: Dump creation is finished and was successful

### Example

<CodeSamples id="get_dump_status_1" />

#### Response: `200 Ok`

```json
{
  "uid": "20200929-114144097",
  "status": "done",
  "startedAt": "2020-09-29T11:41:44.392327Z",
  "finishedAt": "2020-09-29T11:41:50.792147Z"
}
```
