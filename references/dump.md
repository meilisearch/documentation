# Dumps

The `dumps` route allow the creation of database dumps. Dumps are compatible between MeiliSearch versions.

## Trigger a dump creation

<RouteHighlighter method="POST" route="/dumps"/>

Trigger a dump creation process. Once the process is completed, a dump is created in the [dumps folder](/guides/advanced_guides/configuration.md#dumps-folder).

### Example

<code-samples id="post_dump_1" />

#### Response: `202 Accepted`

```json
{
  "uid": "20200929-114144097",
  "status": "processing"
}
```

## Get dump status

<RouteHighlighter method="GET" route="/dumps/:dump_uid/status"/>

Get the status of a dump.
Returned status could be:

- `processing`: Dump creation is not yet finished.
- `dump_process_failed`: An error occured during dump process, and the task was aborted.
- `done`: Dump creation is finished. 

A dump is created in the [dumps folder](/guides/advanced_guides/configuration.md#dumps-folder). After the creation process is over, a dump can be imported to a MeiliSearch Instance at runtime.

### Example

<code-samples id="get_dump_status_1" />

#### Response: `200 Ok`

```json
{
  "uid": "20200929-114144097",
  "status": "done"
}
```
