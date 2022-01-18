# Chapter 4: Configuration and security

## Configuration options

MeiliSearch allows you to configure your entire instance through **environment variables** and **command-line options**. You can configure your instance with environment variables before launch and with command line options at launch.

This chapter covers some of the important configuration options but you can read about all of them in our [configuration guide](/reference/features/configuration.md).

### Database path

By default, all your database files will be created in a folder called `data.ms`. You can configure this using the `MEILI_DB_PATH` environment variable or the `--db-path` CLI option.

### Environment

You can run your MeiliSearch instance in `production` or `development`. By default, it runs in `development`, you can change that using the `MEILI_ENV` environment variable or the `--env` CLI option.

### Master key

You can protect your MeiliSearch instance by setting a master key. You can configure this using the `MEILI_MASTER_KEY` environment variable or the `--master-key` CLI option. MeiliSearch requires a master key when the `--env` is set to `production`.

### Disable analytics

By default, MeiliSearch automatically collects data from all instances that do not opt out using this flag. You can configure it using the `MEILI_NO_ANALYTICS` environment variable or the `--no-analytics` CLI option.

You can read more about our data collection policy [here](/learn/what_is_meilisearch/telemetry.md).

## Data backup

MeiliSearch allows you to backup your data using `dumps` or `screenshots`.

Dumps allow you to export your MeiliSearch instance. A dump isn't an exact copy of your database—it is closer to a blueprint that allows you to create an identical dataset. It contains all your indexes, documents, and settings, but in a raw unprocessed form.

Snapshots, on the other hand, are an exact copy of your database. The documents in a snapshot are already "indexed" and ready to go, greatly increasing import speed. However, as a result, **snapshots are not compatible between different versions of MeiliSearch.**

You can read more about [dumps](/reference/features/dumps.md) and [snapshots](/reference/features/snapshots.md) in their dedicated guides.

## Protecting MeiliSearch

MeiliSearch allows you to protect your instances by using API keys. API keys give you fine-grained control over which users can access which indexes, endpoints, and routes.

You can protect your MeiliSearch instance by supplying it with an alphanumeric string representing your `master` key. MeiliSearch requires a master key when the `--env` is set to `production`. When you launch a secured instance for the first time, MeiliSearch creates two default API keys: `Default Search API Key` and `Default Admin API Key`.

You can read more about security in our [dedicated guide](/reference/features/authentication.md).

## What's next

Hopefully these chapters gave you a basic introduction to MeiliSearch and what it can do. Once you get a hang of the basics, the possibilities are endless. To continue exploring MeiliSearch, check out:

- [Advanced topics](/learn/advanced/README.md) for a more in depth understanding
- [API references](/reference/api/README.md)
