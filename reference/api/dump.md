# Dumps

The `/dumps` route allows the creation of database dumps. Dumps are `.dump` files that can be used to restore Meilisearch data or migrate between different versions.

[Learn more about dumps](/learn/advanced/dumps.md).

## Create a dump

<RouteHighlighter method="POST" route="/dumps"/>

Triggers a dump creation task. Once the process is complete, a dump is created in the [dump directory](/learn/configuration/instance_options.md#dump-directory). If the dump directory does not exist yet, it will be created.

Dump tasks take priority over all other tasks in the queue. This means that a newly created dump task will be processed as soon as the current task is finished.

[Learn more about asynchronous operations](/learn/advanced/asynchronous_operations.md).

### Example

<CodeSamples id="post_dump_1" />

#### Response: `202 Accepted`

```json
{
  "taskUid": 1,
  "indexUid": null,
  "status": "enqueued",
  "type": "dumpCreation",
  "enqueuedAt": "2022-06-21T16:10:29.217688Z"
}
```

You can use this `taskUid` to get more details on [the status of the task](/reference/api/tasks.md#get-one-task)
