# Snapshots

A snapshot is an exact copy of the database (i.e., the `data.ms` folder) at the time the snapshot was created. Besides compression, snapshots do not go through any processing. They can be thought of as "pre-compiled copies".

Using this feature, it is possible to schedule snapshot creation at custom intervals and use existing snapshots to restore Meilisearch.

## Creating snapshots

To create snapshots, use the [`--schedule-snapshot` configuration option](/learn/configuration/instance_options.md#schedule-snapshot-creation):

```bash
meilisearch --schedule-snapshot
```

By default, Meilisearch creates snapshots in a directory called `snapshots/` at the root of your Meilisearch.

The destination can be modified with [`--snapshot-dir`](/learn/configuration/instance_options.md#snapshot-destination):

```bash
meilisearch --schedule-snapshot --snapshot-dir mySnapShots/
```

Now snapshots are created in `mySnapShots/` directory.

The first snapshot is created on launching Meilisearch. After that, snapshots are created routinely on a set interval until you deactivate snapshots by ending the Meilisearch instance. By default, one snapshot is taken every 24 hours.

The amount of time between each new snapshot can be modified with [`--snapshot-interval-sec`](/learn/configuration/instance_options.md#snapshot-interval):

```bash
meilisearch --schedule-snapshot --snapshot-interval-sec 3600
```

After running the above code, a snapshot is created every hour (3600 seconds).

During snapshot creation, old snapshots are **automatically overwritten**. This means only the most recent snapshot should be present in the folder at any given time.

[[More about snapshots flags and environment variables]](/learn/configuration/instance_options.md#schedule-snapshot-creation)

## Starting from a snapshot

Because snapshots are exact copies of your database that haven't gone through any processing besides compression, starting a Meilisearch instance from a snapshot is significantly faster than adding documents manually or starting from a dump.

Using the CLI flag `--import-snapshot`, Meilisearch will start the server using the provided snapshot.

```bash
meilisearch --import-snapshot mySnapShots/data.ms.snapshot
```

## Common problems

Take note that whenever you launch Meilisearch from a snapshot, it will **stop processing and throw an error** if it encounters either of the two following situations:

1. A database already exists (i.e., you have a non-empty `data.ms` folder in the same directory as your Meilisearch binary)
2. No snapshot is found at the given path

In both cases, **this behavior is [configurable](/learn/configuration/instance_options.md#ignore-missing-snapshot)**.

If you don't want Meilisearch to throw an error when finding that a database already exists, you can add the following flag: `--ignore-snapshot-if-db-exists=true`. When using this flag, Meilisearch will use the existing database to start an instance instead of throwing an error. The snapshot will be ignored.

If you do not want Meilisearch to throw an error when there is no snapshot at the given path, you can add the following flag: `--ignore-missing-snapshot`. Meilisearch will then continue its process and not import any snapshot.

When starting from a snapshot, chances are that you already have an existing database. **For security reasons, a database is never overwritten**. To load a snapshot when an existing database is present, you will have to manually delete the existing database. By default, this is the contents of the `data.ms` folder (unless you [changed the path](/learn/configuration/instance_options.md#database-path)) which is located in the same folder as your Meilisearch binary.
The simplest way to delete your database is with the terminal command `rm -rf data.ms`, after which you should be able to start Meilisearch with a snapshot.

[[More about snapshots flags and environment variables]](/learn/configuration/instance_options.md#schedule-snapshot-creation)

## Use cases

**Snapshots are safeguards in case of problems**. If your Meilisearch instance encounters a problem or if you make a mistake while manipulating your database, restarting your instance with the latest snapshot is an easy way to recover your data.

### Version compatibility

Since a snapshot is an exact replica of your database, it can only be opened by the same version of Meilisearch that created it.
