---
sidebarDepth: 2
---

# Telemetry

Meilisearch collects anonymized data from users in order to improve our product. This can be [deactivated at any time](#how-to-disable-data-collection), and any data that has already been collected can be [deleted on request](#how-to-delete-all-collected-data).

## What tools do we use to collect and visualize data?

We use [Segment](https://segment.com/), a platform for data collection and management, to collect usage data. We then feed that data into [Amplitude](https://amplitude.com/), a tool for graphing and highlighting data, so that we can build visualizations according to our needs.

## What kind of data do we collect?

Our data collection is focused on the following categories:

- **System** metrics, such as the technical specs of the device running Meilisearch, the software version, and the OS
- **Performance** metrics, such as the success rate of search requests and the average latency
- **Usage** metrics, aimed at evaluating our newest features. These change with each new version

See below for the [complete list of metrics we currently collect](#exhaustive-list-of-all-collected-data).

**We will never:**

- Identify or track users
- Collect personal information such as IP addresses, email addresses, or website URLs
- Store data from documents added to a Meilisearch instance

## Why collect telemetry data?

We collect telemetry data for only two reasons: so that we can improve our product, and so that we can continue working on this project full-time.

In order to create a better product, we need reliable quantitative information. The data we collect helps us fix bugs, evaluate the success of features, and better understand our users' needs.

We also need to prove that people are actually using Meilisearch. Usage metrics help us justify our existence to investors so that we can keep this project alive.

## Why should you trust us?

**Don't trust us—hold us accountable.** We feel that it is understandable, and in fact wise, to be distrustful of tech companies when it comes to your private data. That is why we attempt to maintain [complete transparency about our data collection](#exhaustive-list-of-all-collected-data), provide an [opt-out](#how-to-disable-data-collection), and enable users to [request the deletion of all their collected data](#how-to-delete-all-collected-data) at any time. In the absence of global data protection laws, we believe that this is the only ethical way to approach data collection.

No company is perfect. If you ever feel that we are being anything less than 100% transparent or collecting data that is infringing on your personal privacy, please let us know by emailing our dedicated account: [privacy@meilisearch.com](mailto:privacy@meilisearch.com). Similarly, if you discover a data rights initiative or data protection tool that you think is relevant to us, please share it. We are passionate about this subject and take it very seriously.

## How to disable data collection

Data collection can be disabled at any time by setting a command-line option or environment variable, then restarting the Meilisearch instance.

:::: tabs

::: tab Command-line option

```bash
meilisearch --no-analytics
```

:::

::: tab Environment variable

```bash
export MEILI_NO_ANALYTICS=true
meilisearch
```

:::

::: tab Cloud service

```bash
# The following procedure should work for all cloud providers,
# including DigitalOcean, Google Cloud Platform, and Amazon Web Services.
# First, open /etc/systemd/system/meilisearch.service with a text editor:

nano /etc/systemd/system/meilisearch.service

# Then add --no-analytics at the end of the command in ExecStart
# Don't forget to save and quit!
# Finally, run the following two commands:

systemctl daemon-reload
systemctl restart meilisearch
```

:::

::::

For more information about configuring Meilisearch, read our [configuration reference](/learn/configuration/instance_options.md).

## How to delete all collected data

We, the Meilisearch team, provide an email address so that users can request the complete removal of their data from all of our tools.

To do so, send an email to [privacy@meilisearch.com](mailto:privacy@meilisearch.com) containing the unique identifier generated for your Meilisearch installation (`Instance UID` when launching Meilisearch). Any questions regarding the management of the data we collect can also be sent to this email address.

## Exhaustive list of all collected data

Whenever an event is triggered that collects some piece of data, Meilisearch does not send it immediately. Instead, it bundles it with other data in a batch of up to `500kb`. Batches are sent either every hour, or after reaching `500kb`—whichever occurs first. This is done in order to improve performance and reduce network traffic.

::: tip Be advised!
This list is liable to change with every new version of Meilisearch. It's not because we're trying to be sneaky! It's because when we add new features we need to collect additional data points to see how they perform.
:::

| Metric name                                        | Description                                                                                 | Example
|----------------------------------------------------|---------------------------------------------------------------------------------------------|--------------------
| `context.app.version`                              | Meilisearch version number                                                                  | 0.23.0
| `infos.env`                                        | Value of `--env`/`MEILI_ENV`                                                                | production
| `infos.db_path`                                    | `true` if `--db-path`/`MEILI_DB_PATH` is specified, otherwise `false`                       | true
| `infos.import_dump`                                | `true` if `--import-dump` is specified, otherwise `false`                                   | true
| `infos.dumps_dir`                                  | `true` if `--dumps-dir`/`MEILI_DUMPS_DIR` is specified, otherwise `false`                   | true
| `infos.ignore_missing_dump`                        | `true` if `--ignore-missing-dump` is activated, otherwise `false`                           | true
| `infos.ignore_dump_if_db_exists`                   | `true` if `--ignore-dump-if-db-exists` is activated, otherwise `false`                      | true
| `infos.import_snapshot`                            | `true` if `--import-snapshot` is specified, otherwise `false`                               | true
| `infos.schedule_snapshot`                          | `true` if `--schedule-snapshot`/`MEILI_SCHEDULE_SNAPSHOT` is activated, otherwise `false`   | true
| `infos.snapshot_dir`                               | `true` if `--snapshot-dir`/`MEILI_SNAPSHOT_DIR` is specified, otherwise `false`             | true
| `infos.snapshot_interval_sec`                      | Value of `--snapshot-interval-sec`/`MEILI_SNAPSHOT_INTERVAL_SEC` in seconds                 | 86400
| `infos.ignore_missing_snapshot`                    | `true` if `--ignore-missing-snapshot` is activated, otherwise `false`                       | true
| `infos.ignore_snapshot_if_db_exists`               | `true` if `--ignore-snapshot-if-db-exists` is activated, otherwise `false`                  | true
| `infos.http_addr`                                  | `true` if `--http-addr`/`MEILI_HTTP_ADDR` is specified, otherwise `false`                   | true
| `infos.max_index_size`                             | Value of `--max-index-size`/`MEILI_MAX_INDEX_SIZE` in bytes                                 | 336042103
| `infos.max_task_db_size`                           | Value of `--max-task-db-size`/`MEILI_MAX_TASK_DB_SIZE` in bytes                             | 336042103
| `infos.http_payload_size_limit`                    | Value of `--http-payload-size-limit`/`MEILI_HTTP_PAYLOAD_SIZE_LIMIT` in bytes               | 336042103
| `infos.enable_autobatching`                        | `true` if `--enable-autobatching` is activated, otherwise `false`                           | true
| `infos.max_batch_size`                             | Value of `--max-batch-size`, otherwise `null`                                               | 1000
| `infos.max_documents_per_batch`                    | Value of `--max-documents-per-batch`, otherwise `null`                                      | 1000
| `infos.debounce_duration_sec`                      | Value of `--debounce-duration-sec` in seconds, otherwise `0`                                | 3600
| `infos.log_level`                                  | Value of `--log-level`/`MEILI_LOG_LEVEL`                                                    | debug
| `infos.max_indexing_memory`                        | Value of `--max-indexing-memory`/`MEILI_MAX_INDEXING_MEMORY` in bytes                       | 336042103
| `infos.max_indexing_threads`                       | Value of `--max-indexing-threads`/`MEILI_MAX_INDEXING_THREADS` in integer                   | 4
| `infos.log_level`                                  | Value of `--log-level`/`MEILI_LOG_LEVEL`                                                    | debug
| `system.distribution`                              | Distribution on which Meilisearch is launched                                               | Arch Linux
| `system.kernel_version`                            | Kernel version on which Meilisearch is launched                                             | 5.14.10
| `system.cores`                                     | Number of cores                                                                             | 24
| `system.ram_size`                                  | Total RAM capacity. Expressed in `KB`                                                       | 16777216
| `system.disk_size`                                 | Total capacity of the largest disk. Expressed in `Bytes`                                    | 1048576000
| `system.server_provider`                           | Users can tell us on which provider Meilisearch is hosted by filling the `MEILI_SERVER_PROVIDER` environment variable. This is also filled by our cloud deploy scripts, e.g., [GCP cloud-config.yaml](https://github.com/meilisearch/cloud-scripts/blob/56a7c2630c1a508e5ad0c0ba1d8cfeb8d2fa9ae0/scripts/providers/gcp/cloud-config.yaml#L33) | gcp
| `stats.database_size`                              | Database size. Expressed in `Bytes`                                                         | 2621440
| `stats.indexes_number`                             | Number of indexes                                                                           | 2
| `start_since_days`                                 | Number of days since instance was launched                                                  | 365
| `user_agent`                                       | User-agent header encountered during API calls                                              | ["Meilisearch Ruby (2.1)", "Ruby (3.0)"]
| `requests.99th_response_time`                      | Highest latency from among the fastest 99% of successful search requests                    | 57ms
| `requests.total_succeeded`                         | Total number of successful search requests                                                  | 3456
| `requests.total_failed`                            | Total number of failed search requests                                                      | 24
| `requests.total_received`                          | Total number of received search requests                                                    | 3480
| `sort.with_geoPoint`                               | `true` if the sort rule `_geoPoint` is specified, otherwise `false`                         | true
| `sort.avg_criteria_number`                         | Average number of sort criteria among all search requests containing the `sort` parameter   | 2
| `filter.with_geoRadius`                            | `true` if the filter rule `_geoRadius` is specified, otherwise `false`                      | false
| `filter.most_used_syntax`                          | Most used filter syntax among all search requests containing the `filter` parameter         | string
| `q.max_terms_number`                               | Highest number of terms given for the `q` parameter                                         | 5
| `pagination.max_limit`                             | Highest value given for the `limit` parameter                                               | 60
| `pagination.max_offset`                            | Highest value given for the `offset` parameter                                              | 1000
| `formatting.highlight_pre_tag`                     | `true` if `highlightPreTag` is specified, otherwise `false`                                 | false
| `formatting.highlight_post_tag`                    | `true` if `highlightPostTag` is specified, otherwise `false`                                | false
| `formatting.crop_length`                           | `true` if `cropLength` is specified, otherwise `false`                                      | false
| `formatting.crop_marker`                           | `true` if `cropMarker` is specified, otherwise `false`                                      | false
| `formatting.matches`                               | `true` if `matches` is specified, otherwise `false`                                         | false
| `primary_key`                                      | Name of primary key when explicitly set as part of document addition, document update, index creation, or index update. Otherwise `null` | id
| `payload_type`                                     | All values encountered in the `Content-Type` header, including invalid ones                 | ["application/json", "text/plain", "application/x-ndjson"]
| `index_creation`                                   | `true` if a document addition or update request triggered index creation, otherwise `false` | true
| `ranking_rules.sort_position`                      | Position of the `sort` ranking rule                                                         | 5
| `sortable_attributes.total`                        | Number of sortable attributes                                                               | 3
| `sortable_attributes.has_geo`                      | `true` if `_geo` is set as a sortable attribute, otherwise `false`                          | true
| `filterable_attributes.total`                      | Number of filterable attributes                                                             | 3
| `filterable_attributes.has_geo`                    | `true` if `_geo` is set as a filterable attribute, otherwise `false`                        | false
| `searchable_attributes.total`                      | Number of searchable attributes                                                             | 4
| `per_task_uid`                                     | `true` if a `uid` is used to fetch a particular task resource, otherwise `false`            | true
| `typo_tolerance.enabled`                           | `true` if typo tolerance is enabled, otherwise `false`                                      | true
| `typo_tolerance.disable_on_attributes`             | `true` if at least one value is defined for `disableOnAttributes`, otherwise `false`        | false
| `typo_tolerance.disable_on_words`                  | `true` if at least one value is defined for `disableOnWords`, otherwise `false`             | false
| `typo_tolerance.min_word_size_for_typos.one_typo`  | The defined value for the `minWordSizeForTypos.oneTypo` parameter                           | 5
| `typo_tolerance.min_word_size_for_typos.two_typos` | The defined value for the `minWordSizeForTypos.twoTypos` parameter                          | 9
