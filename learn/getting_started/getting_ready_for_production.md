# Getting ready for production

This chapter will help you get ready to use Meilisearch in production by covering topics such as instance-wide options and data backup.

## Instance options

Meilisearch allows you to configure your entire instance through **[environment variables](/learn/configuration/instance_options.md#environment-variables)** before launch or **[command-line options](/learn/configuration/instance_options.md#command-line-options-and-flags)** at launch.

Meilisearch has configuration options for many critical actions, such as:

- Changing the database path
- Starting Meilisearch in a development or production environment
- Setting a master key to protect API endpoints
- Disabling telemetry (enabled by default)

You can read about all of them in our [configuration guide](/learn/configuration/instance_options.md).

## Data backup

Meilisearch offers two options for backing up your data: `dumps` and `snapshots`.

Dumps export data in a raw unprocessed form and can be used to migrate your database between Meilisearch versions. A dump isn't an exact copy of your database—it is closer to a blueprint that allows you to rebuild an identical database.

Snapshots, on the other hand, are an exact copy of your database. The documents in a snapshot are already "indexed" and ready to go, therefore they import faster than dumps. However, as a result, **snapshots are not compatible between different versions of Meilisearch.** You can schedule snapshots at regular intervals and use them for rolling back data.

You can read more about [dumps](/learn/advanced/dumps.md) and [snapshots](/learn/advanced/snapshots.md) in their dedicated guides.

## What's next

Hopefully these chapters have given you a basic introduction to Meilisearch and some of the things it can do. Once you get a hang of the basics, the possibilities are endless. To continue exploring Meilisearch, check out:

- [Advanced topics](/learn/advanced/asynchronous_operations.md)
- [API references](/reference/api/overview.md)
- [Configuration](/learn/configuration/instance_options.md)
