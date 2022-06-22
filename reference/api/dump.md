# Dumps

The `/dumps` route allows the creation of database dumps. Dumps are `.dump` files that can be used to restore Meilisearch data or migrate between different versions.

Creating a dump is also referred to as exporting it, whereas launching Meilisearch with a dump is referred to as importing it.

During a [dump export](/reference/api/dump.md#create-a-dump), all indexes of the current instance are exported—together with their documents and settings—and saved as a single `.dump` file.

During a dump import, all indexes contained in the indicated `.dump` file are imported along with their associated documents and settings. Any existing index with the same `uid` as an index in the dump file will be overwritten.

Dump imports must be performed when launching a Meilisearch instance [using the `import-dump` command-line option](/learn/configuration/instance_options.md#import-dump).

[Learn more about dumps](/learn/advanced/dumps.md).

## Create a dump

<RouteHighlighter method="POST" route="/dumps"/>

Triggers a dump creation task. Once the process is complete, a dump is created in the [dumps directory](/learn/configuration/instance_options.md#dumps-destination). If the dumps directory does not exist yet, it will be created.

Dump tasks take priority over all other tasks in the queue. This means that a newly created dump task will be processed as soon as the current task is finished. [Learn more about asynchronous operations](/learn/advanced/asynchronous_operations.md).

### Example

<CodeSamples id="post_dump_1" />

#### Response: `202 Accepted`

```json
{
  "taskUid": 0,
  "indexUid": null,
  "status": "enqueued",
  "type": "dumpCreation",
  "enqueuedAt": "2022-06-21T16:10:29.217688Z"
}
```

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task)
