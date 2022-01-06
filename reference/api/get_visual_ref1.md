# GET visual reference 1

## Get stats of an index

<RouteHighlighter method="GET" route="/indexes/:index_uid/stats"/>

Get stats of an index.

### Path variables

| Variable        | Description                                                       | Type   |
| --------------- | ----------------------------------------------------------------- |--------|
| `index_uid`*    | The unique index identifier                                       |`string`|

### Fields returned

| Variable              | Description                                                       | Type    |
| --------------------- | ----------------------------------------------------------------- |---------|
| `numberOfDocuments`   | The total number of documents in an index                         |`integer`|
| `isIndexing`          | If true, the index is still processing documents and attempts to search will result in undefined behavior. If false, the index has finished processing and you can start searching.                       |`boolean`|
| `fieldDistribution`   | Shows every field in the individual index or the entire database along with the total number of documents in the index that contain that field                                                               |`object` |

## Get status of a task

The `tasks` route gives information about the progress of [asynchronous operations](/learn/advanced/asynchronous_operations.md).

### Path variables

| Variable      | Description           | Type    |
| ------------- | --------------------- |---------|
| `uid`*        | The task identifier   |`integer`|

### Fields returned

| Field        | Type      | Description                                                                                                      |
|--------------|-----------|--------------                                                                                                  |
| `uid`        | `integer` | The unique sequential identifier of the task                                                                     |
| `indexUid`   | `string`  | The unique index identifier                                                                                                                                  |
| `status`     | `string`  | The status of the task. Possible values are `enqueued`, `processing`, `succeeded`, `failed`                                                                                                                                    |
| `type`       | `string`  | The type of task. Possible values are `indexCreation`, `indexUpdate`, `indexDeletion`, `documentAddition`, `documentPartial`, `documentDeletion`, `settingsUpdate`, `clearAll`                                                                         |
| `details`    | `object`  | Detailed information on the task payload                                                                       |
| `error`      | `object`  | Error details and context. Only present when a task has the `failed` status                                                                                                                                      |
| `duration`   | `string`  | The total elapsed time the task spent in the `processing` state, in ISO 8601 format                            |
| `enqueuedAt` | `string`  | The date and time when the task was first `enqueued`, in ISO 8601 format                                       |
| `startedAt`  | `string`  | The date and time when the task began `processing`, in ISO 8601 format                                                                                                                                      |
| `finishedAt` | `string`  | The date and time when the task finished processing, whether `failed` or `succeeded`, in ISO 8601 format.                                                                                                                                     |
