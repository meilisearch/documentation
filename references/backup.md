# Backup

The `backup` route allow users to trigger a backup creation and downloads the created backup.

## Trigger backup

<RouteHighlighter method="POST" route="/backup"/>

Trigger the backup creation process.

### Example

<code-samples id="post_backup_1" />

#### Response: `202 Accepted`

```json
{
    "id": 5
}
```

## Get backup status

<RouteHighlighter method="GET" route="/backup/:backup_uid/status"/>

Get backup status.   
Returned status could be:

- `processing`: backup creation is not finished
- `backup_process_failed`: an error occured during backup process, task aborted
- `done`: backup creation is finished

### Example

<code-samples id="get_backup_status_1" />

#### Response: `200 Ok`

```json
{
    "status": "processing"
}
```

## Download backup (probably not on first version)

<RouteHighlighter method="GET" route="/backup/:backup_uid"/>

Download backup.

### Example

<code-samples id="get_backup_1" />

#### Response: `200 Ok`

`backup.tar.gz` file.
