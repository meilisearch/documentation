# Dumps

The `dumps` route allow the creation of database dumps. Dumps are compatible between MeiliSearch versions.
Dumps contains one or several indexes with settings and documents for each index.
During a dumps exportation, all indexes of the current instance are exported.
During a dumps importation, all the contained indexes are imported and overwrite indexes with the same uid.

## Create a Dump

<RouteHighlighter method="POST" route="/dumps"/>

Triggers a dump creation process. Once the process is complete, a dump is created in the [dumps folder](/guides/advanced_guides/configuration.md#dumps-folder). If the dumps folder does not exist yet, it will be created.

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

Get the status of a dump creation process using the uid returned after calling the [dump creation route](/references/dump.md#create-a-dump).
The returned status could be:

- `processing`: Dump creation is in progress.
- `dump_process_failed`: An error occured during dump process, and the task was aborted.
- `done`: Dump creation is finished and was successful.

### Example

<code-samples id="get_dump_status_1" />

#### Response: `200 Ok`

```json
{
  "uid": "20200929-114144097",
  "status": "done"
}
```
