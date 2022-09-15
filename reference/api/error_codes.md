# Error codes

In this page you may find an exhaustive list of Meilisearch API errors.

## `index_creation_failed`

An error occurred while trying to create an index, check out our guide on [index creation](/learn/core_concepts/indexes.md).

## `index_already_exists`

An index with this UID already exists, check out our guide on [index creation](/learn/core_concepts/indexes.md).

## `index_not_found`

An index with this UID was not found, check out our guide on [index creation](/learn/core_concepts/indexes.md).

## `invalid_index_uid`

There is an error in the provided index format, check out our guide on [index creation](/learn/core_concepts/indexes.md).

## `index_not_accessible`

An internal error occurred while trying to access the requested index.

## `invalid_state`

The database is in an invalid state. Deleting the database and re-indexing should solve the problem.

## `primary_key_inference_failed`

The first provided document contains no fields with the substring `id`. [Manually designate the primary key](/learn/core_concepts/primary_key.md#setting-the-primary-key) or add `id` to one of your fields so it can be used as the primary key during inference. We recommend manually setting the primary key.

## `document_fields_limit_reached`

A document exceeds the maximum limit of 65,535 fields.

## `missing_document_id`

A document does not contain any value for the required primary key, and is thus invalid. Check documents in the current addition for the invalid ones.

## `invalid_document_id`

The provided document identifier does not meet the format requirements. A document identifier must be of type integer or string, composed only of alphanumeric characters (a-z A-Z 0-9), hyphens (-), and underscores (_).

## `invalid_filter`

The filter provided with the search is invalid. This may be due to syntax errors in the `filter` parameter, using reserved fields as filter expressions, or neglecting to add the filtering attributes to `filterableAttributes`. For troubleshooting, check our [guide on filtering](/learn/advanced/filtering_and_faceted_search.md).

## `invalid_sort`

The sort value is invalid. This may be due to syntax errors in the `sort` parameter, using reserved fields as sort expressions, or neglecting to add the sorting attributes to `sortableAttributes`. For troubleshooting, check our [guide on sorting](/learn/advanced/sorting.md).

## `bad_request`

The request is invalid, check the error message for more information.

## `document_not_found`

The requested document can't be retrieved. Either it doesn't exist, or the database was left in an inconsistent state.

## `internal`

 Meilisearch experienced an internal error. Check the error message, and [open an issue](https://github.com/meilisearch/meilisearch/issues/new?assignees=&labels=&template=bug_report.md&title=) if necessary.

## `missing_authorization_header`

- The requested resources are protected with an API key that was not provided in the request header. Check our guide on [security](/learn/security/master_api_keys.md) for more information.
- You are using the wrong authorization header for your version. **v0.24 and below** use `X-MEILI-API-KEY: apiKey`, whereas **v0.25 and above** use `Authorization: Bearer apiKey`.

## `not_found`

The requested resources could not be found.

## `payload_too_large`

The payload sent to the server was too large. Check out this [guide](/learn/configuration/instance_options.md#payload-limit-size) to customize the maximum payload size accepted by Meilisearch.

## `unretrievable_document`

The document exists in store, but there was an error retrieving it. This probably comes from an inconsistent state in the database.

## `invalid_content_type`

The Content-Type header is not supported by Meilisearch. Currently, Meilisearch only supports JSON, CSV, and NDJSON.

## `missing_content_type`

The payload does not contain a Content-Type header. Currently, Meilisearch only supports JSON, CSV, and NDJSON.

## `malformed_payload`

The Content-Type header does not match the request body payload format or the format is invalid.

## `missing_payload`

The Content-Type header was specified, but no request body was sent to the server or the request body is empty.  

## `dump_not_found`

The requested dump could not be found.  

## `dump_process_failed`

An error occurred during dump creation process, task aborted.

## `invalid_ranking_rule`

The provided ranking rules are invalid. This may be due to syntax errors in your ranking rules or specifying custom ranking rules on reserved fields or reserved expressions. For more information on ranking rule configuration, check our [relevancy guide](/learn/core_concepts/relevancy.md#ranking-rules).

## `invalid_geo_field`

The provided `_geo` field of one or more documents is invalid. Read more about `_geo` and how to troubleshoot it in [our dedicated guide](/learn/advanced/geosearch.md).

## `invalid_api_key`

The requested resources are protected with an API key. The provided API key is invalid. Read more about it at in our [dedicated guide](/learn/security/master_api_keys.md).

## `invalid_store_file`

The `data.ms` folder is in an invalid state. Your `.mdb` file is corrupted or the `data.ms` folder has been replaced by a file.

## `no_space_left_on_device`

The host system partition has reached its maximum capacity and can no longer accept writes.

## `database_size_limit_reached`

The requested database has reached its maximum size; no further documents can be added. For information on customizing the maximum database size accepted by Meilisearch, check out this [guide](/learn/configuration/instance_options.md#max-task-db-size).

## `index_primary_key_already_exists`

The requested index already has a primary key that cannot be changed.

## `invalid_api_key_description`

The `description` field for the provided API key resource is invalid. It should either be a string or `null`.

## `invalid_api_key_actions`

The `actions` field for the provided API key resource is invalid. It should be an array of strings representing action names.

## `invalid_api_key_indexes`

The `indexes` field for the provided API key resource is invalid. It should be an array of strings representing index names.

## `invalid_api_key_expires_at`

The `expiresAt` field for the provided API key resource is invalid. It should either show a future date or datetime in the RFC 3339 format or be set to `null`.

## `api_key_not_found`

The requested API key could not be found.

## `missing_parameter`

The payload is missing one or more required fields.

## `task_not_found`

The requested task does not exist. Please ensure that you are using the correct `uid`.

## `invalid_typo_tolerance_min_word_size_for_typos`

The `minWordSizeForTypos` object is invalid. The value for both `oneTypo` and `twoTypos` should be between `0` and `255`, and `twoTypos` should be greater or equal to `oneTypo`.

## `immutable_field`

The field you are trying to modify is immutable.

## `api_key_already_exists`

A key with this `uid` already exists.

## `invalid_api_key_uid`

The given `uid` is invalid. The `uid` must follow the [uuid v4](https://www.sohamkamani.com/uuid-versions-explained) format.

## `invalid_api_key_name`

The given `name` is invalid. It should either be a string or `null`.

## `invalid_task_status`

The requested task status is invalid. Please use one of the [possible values](/reference/api/tasks.md#status).

## `invalid_task_type`

The requested task type is invalid. Please use one of the [possible values](/reference/api/tasks.md#type).
