# Chapter 4: Configuration and security

## Configuration options

- I added too many, maybe we need fewer ones
- Do we want to list these in any particular order? Or alphabetical order?

MeiliSearch allows you to configure your entire instance through **environment variables** and **command-line options**. You can configure your instance with environment variables before launch and with command line options at launch.

This chapter covers some of the important configuration options but you can read about all of them in our [configuration guide](/reference/features/configuration.md).

### Database path

By default, all your database files will be created in a folder called `data.ms`. You can configure this using the `MEILI_DB_PATH` environment variable or the `--db-path` CLI option.

### Environment

You can run your MeiliSearch instance in `production` or `development`. By default, it runs in `development`, you can change that using the `MEILI_ENV` environment variable or the `--env` CLI option.

### Master key

You can protect your MeiliSearch instance by setting a master key. You can configure this using the `MEILI_MASTER_KEY` environment variable or the `--master-key` CLI option. MeiliSearch requires a master key when the `--env` is set to `production`.

### Disable analytics (I think we can use this here instead of payload limit size)

By default, MeiliSearch automatically collects data from all instances that do not opt out using this flag. You can configure it using the `MEILI_NO_ANALYTICS` environment variable or the `--no-analytics` CLI option.

You can read more about our data collection policy [here](/learn/what_is_meilisearch/telemetry.md).

### Payload limit size

MeiliSearch accepts JSON, NDJSON, and CSV payloads. The default payload limit is 104857600 (~100MB) but you can update it using the `MEILI_HTTP_PAYLOAD_SIZE_LIMIT` environment variable or the `--http-payload-size-limit` CLI option.

### Dumps (Can we mention this here?)

By default, MeiliSearch creates dump files in the `dumps/` directory. You can configure this using the `MEILI_DUMPS_DIR` environment variable or the `--dumps-dir` CLI option.

### Snapshots (Can we mention this here?)

- Which one do we mention here? Activating schedules snapshots or snapshot destination?

## Protecting MeiliSearch

- not sure how much content we need here

MeiliSearch allows you to protect your instances by using API keys. API keys give you fine-grained control over which users can access which indexes, endpoints, and routes.

You can protect your MeiliSearch instance by supplying it with an alphanumeric string representing your `master` key. MeiliSearch requires a master key when the `--env` is set to `production`. When you launch a secured instance for the first time, MeiliSearch creates two default API keys: `Default Search API Key` and `Default Admin API Key`.

The `master` key is the only key with access to the [`/keys` endpoint](/reference/api/keys.md). You can use this endpoint to create, update, list, and delete API keys.

You can read more about security in our [dedicated guide](/reference/features/authentication.md).

-> Add something to indicate the end. Where does the user go next?
