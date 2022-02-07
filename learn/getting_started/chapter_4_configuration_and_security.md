# Chapter 4: Configuration and security

## Configuration options

Meilisearch allows you to configure your entire instance through **environment variables** and **command-line options**. You can configure your instance with environment variables before launch and with command line options at launch.

Meilisearch has configuration options for many critical actions, such as:

- Changing the database path
- Starting Meilisearch in a development or production environment
- Setting a master key to protect API endpoints
- Disabling analytics (enabled by default)

You can read about all of them in our [configuration guide](/reference/features/configuration.md).

## Data backup

Meilisearch allows you to backup your data using `dumps` or `screenshots`.

Dumps allow you to export your Meilisearch instance. A dump isn't an exact copy of your database—it is closer to a blueprint that allows you to create an identical dataset. It contains all your indexes, documents, and settings, but in a raw unprocessed form.

Snapshots, on the other hand, are an exact copy of your database. The documents in a snapshot are already "indexed" and ready to go, greatly increasing import speed. However, as a result, **snapshots are not compatible between different versions of Meilisearch.**

You can read more about [dumps](/reference/features/dumps.md) and [snapshots](/reference/features/snapshots.md) in their dedicated guides.

## Protecting Meilisearch

Meilisearch allows you to protect your instances by using API keys. API keys give you fine-grained control over which users can access which indexes, endpoints, and routes.

You can protect your Meilisearch instance by supplying it with an alphanumeric string representing your `master` key:

:::: tabs

::: tab CLI

./Meilisearch --master-key="your_master_key"

:::

::: tab Environment variable

Linux/MacOS:

export MEILI_MASTER_KEY="your_master_key"
./Meilisearch

Windows:

set MEILI_MASTER_KEY="your_master_key"
./Meilisearch

:::

::::

You can communicate with a protected instance using:

<CodeSamples id= getting_started_communicating_with_a_protected_instance />

You can read more about security in our [dedicated guide](/reference/features/authentication.md).

## What's next

Hopefully these chapters gave you a basic introduction to Meilisearch and what it can do. Once you get a hang of the basics, the possibilities are endless. To continue exploring Meilisearch, check out:

- [Advanced topics](/learn/advanced/README.md) for a more in depth understanding
- [API references](/reference/api/README.md)
