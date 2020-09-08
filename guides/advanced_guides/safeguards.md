# Safeguards

MeiliSearch has only one way to save its data as of today: Snapshots.

## Snapshots

A snapshot is an exact copy of the database at the time the snapshot was created. Snapshots do not go through any processing.
With it, it is possible to create and restore MeiliSearch from snapshots and schedule snapshot creation at custom intervals.

### Creating Snapshots

For MeiliSearch to create snapshots, the feature must be enabled by specifying a path to the directory in which snapshots will be saved.

```bash
$ meilisearch --snapshot-path mySnapShots/
```

By default, MeiliSearch schedules a snapshot creation every day. When the instance starts, it will wait 24 hours until the first snapshot. This means that if you have launched MeiliSearch on Tuesday at 4 pm, the first snapshot will be created on Wednesday at 4 pm, and so on every day.

The schedule can be modified with the `--snapshot-interval-sec` flag.

```bash
$ meilisearch --snapshot-path mySnapShots/ --snapshot-interval-sec 3600
```

Now a snapshot will be created every hour.

During snapshot creation, snapshots are **overwritten**. Meaning, only the last snapshot will be present in the folder.

[[More about snapshots flags and env variables]](/guides/advanced_guides/configuration.md#schedule-snapshot-creation)

### Start from Snapshot

Because snapshots are zipped copies of your database that did not go through any processing, starting a MeiliSearch instance from one of them is significantly faster.

Using the global environment `MEILI_LOAD_FROM_SNAPSHOT` or the CLI flag `--load-from-snapshot` , MeiliSearch will start the server using the provided snapshot.

```bash
$ meilisearch --load-from-snapshot mySnapShots/data.ms.tar.gz
```

If a database already exists, or if no snapshot is found at the given path, MeiliSearch will **stop processing and throw an error**. This is configurable.

If you don't want MeiliSearch to throw an error if a database already exists, you can add the following flag: `--ignore-snapshot-if-db-exists=true`. By adding this flag, if a database exists, MeiliSearch will **not** import the snapshot and continue its process.

If you do not want MeiliSearch to throw an error when there is no snapshot at the given path you can add the following flag: `--ignore-missing-snapshot`. MeiliSearch will then continue its process and not import any snapshot.

When starting from a snapshot, chances are that you already have an existing database. **For security reasons, a database is never overwritten**. To load a snapshot when an existing database is present, you will have to delete it manually. By default, the database is in `data.ms` folder ([unless you changed the path](/guides/advanced_guides/configuration.md#database-path)), which is located in the same folder as your MeiliSearch binary.
The simplest way to delete your database is the use `rm -rf data.ms`. After which you can start your MeiliSearch with the path to the snapshot you want to load.

[[More about snapshots flags and env variables]](/guides/advanced_guides/configuration.md#schedule-snapshot-creation)

### Use Cases

**Snapshots are safeguards in case of problems**. If your MeiliSearch instance encounters a problem or if you have done a mistake while manipulating your database, restarting your instance with the latest snapshot is an easy way to recover your data.

### Version Compatibilities

Since a snapshot is a replica of your database, it will restore it only if your MeiliSearch runs on the version it has been created on.

For backups compatibility between different versions, we can't wait to show you our next feature: backups 😉.
