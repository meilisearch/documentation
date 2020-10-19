# Snapshots and Dumps

## Snapshot vs Dump

MeiliSearch has two ways to backup its data: `snapshots` and `dumps`.

**Snapshots** make it possible to schedule the creation of hard copies of your database. This feature is **intended mainly as a safeguard**: ensuring that if some failure occurs, you're able to relaunch your database quickly and efficiently from a snapshot. The documents in a snapshot are already "indexed" and ready to go, greatly increasing import speed. However, as a result, **snapshots are not compatible between different versions of MeiliSearch**.

Dumps, on the other hand, export MeiliSearch data in a way that is not bound to a specific MeiliSearch version. As a result, importing a dump requires MeiliSearch to index all of your documents. This process requires a certain amount of time and memory (corresponding to the number of documents, their size, and the complexity of any index settings).

**To summarize**, snapshots are highly efficient but not portable between different versions of MeiliSearch. Dumps, on the other hand, are highly portable but not very efficient, as frequently launching MeiliSearch from a dump would cause your performance to suffer.

## Snapshots

A snapshot is an exact copy of the database (i.e. the data.ms folder) at the time the snapshot was created. Besides compression, snapshots do not go through any processing. They can be thought of as "pre-compiled copies".
Using this feature, it is possible to schedule snapshot creation at custom intervals and use existing snapshots to restore MeiliSearch.

### Creating Snapshots

For MeiliSearch to create snapshots, the feature must be enabled by specifying a path to the directory in which snapshots will be saved.

```bash
$ meilisearch --snapshot-path mySnapShots/
```

By default, MeiliSearch schedules a snapshot creation every day. When the instance starts, it will wait 24 hours until the first snapshot. This means that if you have launched MeiliSearch on Tuesday at 4 pm, the first snapshot will be created on Wednesday at 4 pm, and so on every day.

The amount of time between each new snapshot can be modified with the `--snapshot-interval-sec` flag.

```bash
$ meilisearch --snapshot-path mySnapShots/ --snapshot-interval-sec 3600
```

After running the above code, a snapshot will be created every hour (3600 seconds).

During snapshot creation, old snapshots are **automatically overwritten**. This means that only the most recent snapshot should be present in the folder at any given time.

[[More about snapshots flags and env variables]](/guides/advanced_guides/configuration.md#schedule-snapshot-creation)

### Start from Snapshot

Because snapshots are exact copies of your database that haven't gone through any processing besides compression, starting a MeiliSearch instance from a snapshot is significantly faster than adding documents manually or starting from a dump.

Using the global environment `MEILI_LOAD_FROM_SNAPSHOT` or the CLI flag `--load-from-snapshot` , MeiliSearch will start the server using the provided snapshot.

```bash
$ meilisearch --load-from-snapshot mySnapShots/data.ms.tar.gz
```

####Common Problems

Take note that whenever you launch MeiliSearch from a snapshot, it will *stop processing and throw an error** if it encounters either of the two following situations:
1. A database already exists (i.e. you have a non-empty `data.ms` folder in the same directory as your MeiliSearch binary)
2. No snapshot is found at the given path

In both cases, **this behavior is [configurable](/guides/advanced_guides/configuration.md#ignore-missing-snapshot)**.

If you don't want MeiliSearch to throw an error when finding that a database already exists, you can add the following flag: `--ignore-snapshot-if-db-exists=true`. When using this flag, MeiliSearch will use the existing database to start an instance instead of throwing an error. The snapshot will be ignored.

If you do not want MeiliSearch to throw an error when there is no snapshot at the given path, you can add the following flag: `--ignore-missing-snapshot`. MeiliSearch will then continue its process and not import any snapshot.

When starting from a snapshot, chances are that you already have an existing database. **For security reasons, a database is never overwritten**. To load a snapshot when an existing database is present, you will have to manually delete the existing database. By default, this is the contents of the `data.ms` folder (unless you [changed the path](/guides/advanced_guides/configuration.md#database-path)) which is located in the same folder as your MeiliSearch binary.
The simplest way to delete your database is with the terminal command `rm -rf data.ms`, after which you should be able to start MeiliSearch with a snapshot.

[[More about snapshots flags and env variables]](/guides/advanced_guides/configuration.md#schedule-snapshot-creation)

### Use Cases

**Snapshots are safeguards in case of problems**. If your MeiliSearch instance encounters a problem or if you make a mistake while manipulating your database, restarting your instance with the latest snapshot is an easy way to recover your data.

### Version Compatibility

Since a snapshot is an exact replica of your database, it can only be opened by the same version of MeiliSearch that created it.

## Dumps

A dump is a compressed file containing an export of your MeiliSearch instance. It contains all your indexes, documents, and settings, but in a raw unprocessed form. A dump isn't an exact copy of your database—it is closer to a blueprint that allows you to create an identical dataset. A dump can be imported when launching MeiliSearch, but be advised that it may take some time to index all the documents within.

### Creating a Dump

To create a dump of your dataset, you need to use the appropriate HTTP route: `POST /dumps`. Using that route will trigger a dump creation process. Creating a dump is an asynchronous task that takes time based on the size of your dataset. A dump uid (unique identifier) is returned to help you track the process.

<code-samples id="post_dump_1" />

The above code triggers a dump creation process.

At any given moment, you can check the status of a particular dump creation process using the previously received dump uid, like so: `GET /dumps/:dump_uid/status`. Using this route, you can know whether your dump is still processing, has already been created, or has encountered a problem.

<code-samples id="get_dump_status_1" />

After your dump creation process is done, the dump file is created and added in the dump folder. By default, this folder is `/dumps` at the root of your MeiliSearch binary, but this can be customized. Note that **if your dump folder does not already exist when the dump creation process is called, MeiliSearch will create it**.

### Import a Dump

Once you have exported a dump, which is a `.dump` file, you are now able to use that dump to launch MeiliSearch. As the data contained in the dump needs to be indexed, the process will take some time to complete. Only when the dump has been fully imported will the MeiliSearch server start, after which you can begin searching through your data.

```bash
./meilisearch --import-dump /dumps/12345678.dump
```

Because the indexation is the same process as when the documents are initially added to MeiliSearch, it is still a good practice to index documents in batches if the dataset is to big. The size of the batches are based on your dataset size and on your memory capacity.

[See here for more dumps options](/guides/advanced_guides/configuration.md#dumps-destination)

### Use Cases

Dumps are used to restore your database after MeiliSearch updates or to communicate your database to other instances of MeiliSearch (e.g. running on different servers) without having to worry about their respective versions.
