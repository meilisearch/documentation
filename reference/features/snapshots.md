# Snapshots

A snapshot is an exact copy of the database (i.e. the data.ms folder) at the time the snapshot was created. Besides compression, snapshots do not go through any processing. They can be thought of as "pre-compiled copies".

Using this feature, it is possible to schedule snapshot creation at custom intervals and use existing snapshots to restore MeiliSearch.

## Creating snapshots

For MeiliSearch to create snapshots, the feature must be enabled by adding the following flag:

```bash
meilisearch --schedule-snapshot=true
```

By default, MeiliSearch creates snapshots in a directory called `snapshots/` at the root of your MeiliSearch.

The destination can be modified with the `--snapshot-dir` flag.

```bash
meilisearch --schedule-snapshot=true --snapshot-dir mySnapShots/
```

Now snapshots are created in `mySnapShots/` directory.

The first snapshot is created on launching MeiliSearch. After that, snapshots are created routinely on a set interval until you deactivate snapshots or end the MeiliSearch instance. By default, one snapshot is taken every 24 hours.

The amount of time between each new snapshot can be modified with the `--snapshot-interval-sec` flag.

```bash
meilisearch --schedule-snapshot=true --snapshot-interval-sec 3600
```

After running the above code, a snapshot is created every hour (3600 seconds).

During snapshot creation, old snapshots are **automatically overwritten**. This means that only the most recent snapshot should be present in the folder at any given time.

[[More about snapshots flags and env variables]](/reference/features/configuration.md#schedule-snapshot-creation)

## Starting from a snapshot

Because snapshots are exact copies of your database that haven't gone through any processing besides compression, starting a MeiliSearch instance from a snapshot is significantly faster than adding documents manually or starting from a dump.

Using the CLI flag `--import-snapshot`, MeiliSearch will start the server using the provided snapshot.

```bash
meilisearch --import-snapshot mySnapShots/data.ms.snapshot
```

## Common problems

Take note that whenever you launch MeiliSearch from a snapshot, it will *stop processing and throw an error** if it encounters either of the two following situations:

1. A database already exists (i.e. you have a non-empty `data.ms` folder in the same directory as your MeiliSearch binary)
2. No snapshot is found at the given path

In both cases, **this behavior is [configurable](/reference/features/configuration.md#ignore-missing-snapshot)**.

If you don't want MeiliSearch to throw an error when finding that a database already exists, you can add the following flag: `--ignore-snapshot-if-db-exists=true`. When using this flag, MeiliSearch will use the existing database to start an instance instead of throwing an error. The snapshot will be ignored.

If you do not want MeiliSearch to throw an error when there is no snapshot at the given path, you can add the following flag: `--ignore-missing-snapshot`. MeiliSearch will then continue its process and not import any snapshot.

When starting from a snapshot, chances are that you already have an existing database. **For security reasons, a database is never overwritten**. To load a snapshot when an existing database is present, you will have to manually delete the existing database. By default, this is the contents of the `data.ms` folder (unless you [changed the path](/reference/features/configuration.md#database-path)) which is located in the same folder as your MeiliSearch binary.
The simplest way to delete your database is with the terminal command `rm -rf data.ms`, after which you should be able to start MeiliSearch with a snapshot.

[[More about snapshots flags and env variables]](/reference/features/configuration.md#schedule-snapshot-creation)

## Use cases

**Snapshots are safeguards in case of problems**. If your MeiliSearch instance encounters a problem or if you make a mistake while manipulating your database, restarting your instance with the latest snapshot is an easy way to recover your data.

### Version compatibility

Since a snapshot is an exact replica of your database, it can only be opened by the same version of MeiliSearch that created it.
