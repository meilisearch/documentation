# Error codes

This page is an exhaustive list of Meilisearch API errors.

## `api_key_already_exists`

A key with this `uid` already exists.

## `api_key_not_found`

The requested API key could not be found.

## `bad_request`

The request is invalid, check the error message for more information.

## `database_size_limit_reached`

The requested database has reached its maximum size, and no further documents can be added. For information on customizing the maximum database size accepted by Meilisearch, check out this [guide](/learn/configuration/instance_options.md#max-task-db-size).

## `document_fields_limit_reached`

A document exceeds the maximum limit of 65,535 fields.

## `document_not_found`

The requested document can't be retrieved. Either it doesn't exist, or the database was left in an inconsistent state.

## `dump_not_found`

The requested dump could not be found.  

## `dump_process_failed`

An error occurred during dump creation process, task aborted.

## `invalid_swap_duplicate_index_found`

The indexes used in the `indexes` array for a [swap index](/reference/api/indexes.md#swap-indexes) request have been declared multiple times. You must declare each index only once.

## `immutable_api_key_actions`

The `actions` field of an API key cannot be modified.

## `immutable_api_key_created_at`

The `createdAt` field of an API key cannot be modified.

## `immutable_api_key_expires_at`

The `expiresAt` field of an API key cannot be modified.

## `immutable_api_key_indexes`

The `indexes` field of an API key cannot be modified.

## `immutable_api_key_key`

The `key` field of an API key cannot be modified.

## `immutable_api_key_uid`

The `uid` field of an API key cannot be modified.

## `immutable_api_key_updated_at`

The `updatedAt` field of an API key cannot be modified.

## `immutable_index_uid`

The `uid` field of an index key cannot be modified.

## `immutable_index_updated_at`

The `updatedAt` field of an index key cannot be modified.

## `index_already_exists`

An index with this UID already exists, check out our guide on [index creation](/learn/core_concepts/indexes.md).

## `index_creation_failed`

An error occurred while trying to create an index, check out our guide on [index creation](/learn/core_concepts/indexes.md).

## `index_not_found`

An index with this UID was not found, check out our guide on [index creation](/learn/core_concepts/indexes.md).

## `index_primary_key_already_exists`

The requested index already has a primary key that cannot be changed.

## `internal`

 Meilisearch experienced an internal error. Check the error message, and [open an issue](https://github.com/meilisearch/meilisearch/issues/new?assignees=&labels=&template=bug_report.md&title=) if necessary.

## `invalid_api_key`

The requested resources are protected with an API key. The provided API key is invalid. Read more about it in our [dedicated guide](/learn/security/master_api_keys.md).

## `invalid_api_key_actions`

The `actions` field for the provided API key resource is invalid. It should be an array of strings representing action names.

## `invalid_api_key_description`

The `description` field for the provided API key resource is invalid. It should either be a string or `null`.

## `invalid_api_key_expires_at`

The `expiresAt` field for the provided API key resource is invalid. It should either show a future date or datetime in the [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format or be set to `null`.

## `invalid_api_key_indexes`

The `indexes` field for the provided API key resource is invalid. It should be an array of strings representing index names.

## `invalid_api_key_limit`

The [`limit`](/reference/api/keys.md#query-parameters) parameter is invalid. It should be an integer.

## `invalid_api_key_name`

The given `name` is invalid. It should either be a string or `null`.

## `invalid_api_key_offset`

The [`offset`](/reference/api/keys.md#query-parameters) parameter is invalid. It should be an integer.

## `invalid_api_key_uid`

The given `uid` is invalid. The `uid` must follow the [uuid v4](https://www.sohamkamani.com/uuid-versions-explained) format.

## `invalid_content_type`

The Content-Type header is not supported by Meilisearch. Currently, Meilisearch only supports JSON, CSV, and NDJSON.

## `invalid_document_id`

The provided document identifier does not meet the format requirements. A document identifier must be of type integer or string, composed only of alphanumeric characters (a-z A-Z 0-9), hyphens (-), and underscores (_).

## `invalid_document_fields`

The [`fields`](/reference/api/documents.md#query-parameters) parameter is invalid. It should be a string.

## `invalid_document_limit`

The [`limit`](/reference/api/documents.md#query-parameters) parameter is invalid. It should be an integer.

## `invalid_document_offset`

The [`offset`](/reference/api/documents.md#query-parameters) parameter is invalid. It should be an integer.

## `invalid_filter`

The filter provided with the search is invalid. This may be due to syntax errors in the `filter` parameter, using reserved fields as filter expressions, or neglecting to add the filtering attributes to `filterableAttributes`. For troubleshooting, check our [guide on filtering](/learn/advanced/filtering_and_faceted_search.md).

## `invalid_document_geo_field`

The provided `_geo` field of one or more documents is invalid. Meilisearch expects `_geo` to be an object with two fields, `lat` and `lng`, each containing geographic coordinates expressed as a string or number. Read more about `_geo` and how to troubleshoot it in [our dedicated guide](/learn/advanced/geosearch.md).

## `invalid_index_limit`

The [`limit`](/reference/api/indexes.md#query-parameters) parameter is invalid. It should be an integer.

## `invalid_index_offset`

The [`offset`](/reference/api/indexes.md#query-parameters) parameter is invalid. It should be an integer.

## `invalid_index_uid`

There is an error in the provided index format, check out our guide on [index creation](/learn/core_concepts/indexes.md).

## `invalid_index_primary_key`

The [`primaryKey`](/reference/api/indexes.md#body-2) field is invalid. It should either be a string or set to `null`.

## `invalid_search_attributes_to_crop`

The [`attributesToCrop`](/reference/api/search.md#attributes-to-crop) parameter is invalid. It should be an array of strings, a string, or set to `null`.

## `invalid_search_attributes_to_highlight`

The [`attributesToHighlight`](/reference/api/search.md#attributes-to-highlight) parameter is invalid. It should be an array of strings, a string, or set to `null`.

## `invalid_search_attributes_to_retrieve`

The [`attributesToRetrieve`](/reference/api/search.md#attributes-to-retrieve) parameter is invalid. It should be an array of strings, a string, or set to `null`.

## `invalid_search_crop_length`

The [`cropLength`](/reference/api/search.md#crop-length) parameter is invalid. It should be an integer.

## `invalid_search_crop_marker`

The [`cropMarker`](/reference/api/search.md#crop-marker) parameter is invalid. It should be a string or set to `null`.

## `invalid_search_facets`

- The [`facets`](/reference/api/search.md#facets) parameter is invalid. It should be an array of strings, a string, or set to `null`
- The attribute used for faceting is not defined in the `filterableAttributes` list

## `invalid_search_filter`

This error occurs when:

- The syntax for the `filter` parameter is invalid
- The attribute used for filtering is not defined in the `filterableAttributes` list
- A reserved keyword like `_geo`, `_geoDistance`, or `_geoPoint` is used as a filter

## `invalid_search_highlight_post_tag`

The [`highlightPostTag`](/reference/api/search.md#highlight-tags) parameter is invalid. It should be a string.

## `invalid_search_highlight_pre_tag`

The [`highlightPreTag`](/reference/api/search.md#highlight-tags) parameter is invalid. It should be a string.

## `invalid_search_hits_per_page`

The [`hitsPerPage`](/reference/api/search.md#number-of-results-per-page) parameter is invalid. It should be an integer.

## `invalid_search_limit`

The [`limit`](/reference/api/search.md#limit) parameter is invalid. It should be an integer.

## `invalid_search_matching_strategy`

The [`matchingStrategy`](/reference/api/search.md#matching-strategy) parameter is invalid. It should either be set to `last` or `all`.

## `invalid_search_offset`

The [`offset`](/reference/api/search.md#offset) parameter is invalid. It should be an integer.

## `invalid_search_page`

The [`page`](/reference/api/search.md#page) parameter is invalid. It should be an integer.

## `invalid_search_q`

The [`q`](/reference/api/search.md#query-q) parameter is invalid. It should be a string or set to `null`

## `invalid_search_show_matches_position`

The [`showMatchesPosition`](/reference/api/search.md#show-matches-position) parameter is invalid. It should either be a boolean or set to `null`.

## `invalid_search_sort`

- The syntax for the `sort` parameter is invalid
- The attribute used for sorting is not defined in the `sortableAttributes` list or the `sort` ranking rule is missing from the settings
- A reserved keyword like `_geo`, `_geoDistance`, or `_geoPoint` is used as a filter

## `invalid_settings_displayed_attributes`

The value of displayed attributes is invalid. It should be an empty array, an array of strings, or set to `null`.

## `invalid_settings_distinct_attribute`

The value of distinct attributes is invalid. It should be a string or set to `null`.

## `invalid_settings_faceting`

The value for the [`maxValuesPerFacet`](/reference/api/settings.md#faceting-object) field is invalid. It should be an integer or set to `null`.

## `invalid_settings_filterable_attributes`

The value of filterable attributes is invalid. It should be an empty array, an array of strings, or set to `null`.

## `invalid_settings_pagination`

The value for the [`maxTotalHits`](/reference/api/settings.md#pagination-object) field is invalid. It should be an integer or set to `null`.

## `invalid_settings_ranking_rules`

- The settings payload has an invalid format
- A non-existent ranking rule is specified
- A custom ranking rule is malformed
- A reserved keyword like `_geo`, `_geoDistance`, or `_geoPoint` is used as a custom ranking rule

## `invalid_settings_searchable_attributes`

The value of searchable attributes is invalid. It should be an empty array, an array of strings or set to `null`.

## `invalid_settings_sortable_attributes`

The value of sortable attributes is invalid. It should be an empty array, an array of strings or set to `null`.

## `invalid_settings_stop_words`

The value of stop words is invalid. It should be an empty array, an array of strings or set to `null`.

## `invalid_settings_synonyms`

The value of the synonyms is invalid. It should either be an object or set to `null`.

## `invalid_settings_typo_tolerance`

- The `enabled` field is invalid. It should either be a boolean or set to `null`
- The `disableOnAttributes` field is invalid. It should either be an array of strings or set to `null`
- The `disableOnWords` field is invalid. It should either be an array of strings or set to `null`
- The `minWordSizeForTypos` field is invalid. It should either be an integer or set to `null`
- The value of either `oneTypo` or `twoTypos` is invalid. It should either be an integer or set to `null`

## `invalid_task_after_enqueued_at`

The `afterEnqueuedAt` query parameter is invalid.

## `invalid_task_after_finished_at`

The `afterFinishedAt` query parameter is invalid.

## `invalid_task_after_started_at`

The `afterStartedAt` query parameter is invalid.

## `invalid_task_before_enqueued_at`

The `beforeEnqueuedAt` query parameter is invalid.

## `invalid_task_before_finished_at`

The `beforeFinishedAt` query parameter is invalid.

## `invalid_task_before_started_at`

The `beforeStartedAt` query parameter is invalid.

## `invalid_task_date_filter`

The date format used is invalid. It should either use a date or datetime in the [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format or be set to `null`.

## `invalid_task_index_uids`

The `indexUids` query parameter contains an invalid index uid.

## `invalid_task_uids`

The `uids` query parameter is invalid.

## `invalid_task_uids_filter`

One or more of the given task `uids` is invalid. Task `uids` can be an integer or a string containing only numeric characters.

## `index_not_accessible`

An internal error occurred while trying to access the requested index.

## `invalid_ranking_rule`

The provided ranking rules are invalid. This may be due to syntax errors in your ranking rules or specifying custom ranking rules on reserved fields or reserved expressions. For more information on ranking rule configuration, check our [relevancy guide](/learn/core_concepts/relevancy.md#ranking-rules).

## `invalid_sort`

The sort value is invalid. This may be due to syntax errors in the `sort` parameter, using reserved fields as sort expressions, or neglecting to add the sorting attributes to `sortableAttributes`. For troubleshooting, check our [guide on sorting](/learn/advanced/sorting.md).

## `invalid_state`

The database is in an invalid state. Deleting the database and re-indexing should solve the problem.

## `invalid_store_file`

The `data.ms` folder is in an invalid state. Your `.mdb` file is corrupted or the `data.ms` folder has been replaced by a file.

## `invalid_swap_indexes`

This error happens when:

- The payload doesn't contain two index `uids` for a swap operation
- The payload contains an invalid index name in the `indexes` array

## `invalid_task_limit`

The [`limit`](/reference/api/tasks.md#query-parameters) parameter is invalid. It must be an integer.

## `invalid_task_statuses`

The requested task status is invalid. Please use one of the [possible values](/reference/api/tasks.md#status).

## `invalid_task_types`

The requested task type is invalid. Please use one of the [possible values](/reference/api/tasks.md#type).

## `invalid_task_canceled_by`

The `canceledBy` query parameter is invalid. It should be an integer. Multiple `uid`s should be separated by commas (`,`).

## `invalid_typo_tolerance_min_word_size_for_typos`

The `minWordSizeForTypos` object is invalid. The value for both `oneTypo` and `twoTypos` should be between `0` and `255`, and `twoTypos` should be greater or equal to `oneTypo`.

## `io_error`

This error generally occurs when the host system has no space left on the device or when the database doesn't have read or write access.

## `primary_key_inference_failed`

The first provided document contains no fields with the substring `id`. [Manually designate the primary key](/learn/core_concepts/primary_key.md#setting-the-primary-key) or add `id` to one of your fields so it can be used as the primary key during inference. We recommend manually setting the primary key.

## `malformed_payload`

The Content-Type header does not match the request body payload format or the format is invalid.

## `missing_api_key_actions`

The `actions` field is missing from payload.

## `missing_api_key_expires_at`

The `expiresAt` field is missing from payload.

## `missing_api_key_indexes`

The `indexes` field is missing from payload.

## `missing_authorization_header`

- The requested resources are protected with an API key that was not provided in the request header. Check our guide on [security](/learn/security/master_api_keys.md) for more information.
- You are using the wrong authorization header for your version. **v0.24 and below** use `X-MEILI-API-KEY: apiKey`, whereas **v0.25 and above** use `Authorization: Bearer apiKey`.

## `missing_content_type`

The payload does not contain a Content-Type header. Currently, Meilisearch only supports JSON, CSV, and NDJSON.

## `missing_document_id`

A document does not contain any value for the required primary key, and is thus invalid. Check documents in the current addition for the invalid ones.

`missing_index_uid`

The payload is missing the `uid` field.

## `missing_master_key`

You need to set a master key before you can access the `/keys` route. Read more about setting a master key at launch in our [dedicated guide](/learn/security/master_api_keys.md#protecting-a-meilisearch-instance).

## `missing_payload`

The Content-Type header was specified, but no request body was sent to the server or the request body is empty.

## `missing_swap_indexes`

The index swap payload is missing the [`indexes`](/reference/api/indexes.md#swap-indexes) object.

## `missing_task_filters`

The [cancel tasks](/reference/api/tasks.md#cancel-tasks) and [delete tasks](/reference/api/tasks.md#delete-tasks) endpoints require one of the available query parameters.

## `no_space_left_on_device`

The host system partition has reached its maximum capacity and can no longer accept writes.

## `not_found`

The requested resources could not be found.

## `payload_too_large`

The payload sent to the server was too large. Check out this [guide](/learn/configuration/instance_options.md#payload-limit-size) to customize the maximum payload size accepted by Meilisearch.

## `task_not_found`

The requested task does not exist. Please ensure that you are using the correct `uid`.

## `unretrievable_document`

The document exists in store, but there was an error retrieving it. This probably comes from an inconsistent state in the database.
