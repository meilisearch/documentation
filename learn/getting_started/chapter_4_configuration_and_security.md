# Chapter 4: Getting ready for production

This chapter will help you get ready to use Meilisearch in production by covering topics such as instance-wide options, data backup, and security.

## Configuration options

Meilisearch allows you to configure your entire instance through **[environment variables](/reference/features/configuration.md#configuring-an-instance-with-environment-variables)** before launch or **[command-line options](/reference/features/configuration.md#configuring-an-instance-with-command-line-options)** at launch.

Meilisearch has configuration options for many critical actions, such as:

- Changing the database path
- Starting Meilisearch in a development or production environment
- Setting a master key to protect API endpoints
- Disabling telemetry (enabled by default)

You can read about all of them in our [configuration guide](/reference/features/configuration.md).

## Data backup

Meilisearch offers two options for backing up your data: `dumps` and `snapshots`.

Dumps export data in a raw unprocessed form and can be used to migrate your database between different tools or Meilisearch versions. A dump isn't an exact copy of your database—it is closer to a blueprint that allows you to rebuild an identical database.

Snapshots, on the other hand, are an exact copy of your database. The documents in a snapshot are already "indexed" and ready to go, therefore they import faster than dumps. However, as a result, **snapshots are not compatible between different versions of Meilisearch.** You can schedule snapshots at regular intervals and use them for rolling back data.

You can read more about [dumps](/reference/features/dumps.md) and [snapshots](/reference/features/snapshots.md) in their dedicated guides.

## Protecting Meilisearch

Meilisearch allows you to protect access to API endpoints. You can protect your Meilisearch instance by supplying it with an alphanumeric string representing your `master` key:

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

Once this has been done, you must supply an API key with sufficient permissions whenever you make an API request. For example:

<CodeSamples id= getting_started_communicating_with_a_protected_instance />

You can also manage API keys including altering expiration dates and permissions. Read more about security and permissions in our [dedicated guide](/reference/features/authentication.md).

## What's next

Hopefully these chapters have given you a basic introduction to Meilisearch and what it can do. Once you get a hang of the basics, the possibilities are endless. To continue exploring Meilisearch, check out:

- [Advanced topics](/learn/advanced/README.md)
- [API references](/reference/api/README.md)
