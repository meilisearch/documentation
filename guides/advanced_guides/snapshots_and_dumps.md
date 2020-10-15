# Snapshots and Dumps

## Snapshot vs Dump

MeiliSearch has two ways to save its data, `snapshots` and `dumps`.

Snapshots make it possible to schedule the creation of hard copies of your database. This feature is **intended mainly as a safeguard**—ensuring that if some failure occurs, you're able to relaunch MeiliSearch quickly and efficiently without having to wait for the re-indexing of documents. They are **not compatible between versions**.

Dumps, at the difference, are **exporting the data out of MeiliSearch** in a way that they are not bound to the MeiliSearch version. Because of that, when importing a dump, MeiliSearch will need to index all of your documents, a process that takes up time and overhead (based on the amount of documents, their size and the settings).

**To summarize**, snapshots are highly efficient but not portable between different versions of MeiliSearch. Dumps, on the other hand, are highly portable but not very efficient, as frequently launching MeiliSearch from a dump would cause your performance to suffer.

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

## Dumps

Dumps are compressed files containing an export of your MeiliSearch instance. It contains all your indexes, documents and settings in a raw unprocessed manner. A dump isn't an exact copy—more like a blueprint that allows you to create an identical dataset. Dumps can be imported on the launch of MeiliSearch. MeiliSearch will start after the data has been indexed.

### Dumps creation

To create a dump of your dataset, you need to use the appropriate http route: `POST /dumps`. Using that route will trigger a dump creation process. Creating a dump is an asynchronous task that takes time based on the size of your dataset. A dump uid (unique identifier) is returned to help you track the process.

<code-samples id="post_dump_1" />

### Triggers a dump creation process.

At any given moment, you can check the status of a particular dump creation process using the previously received dump uid, like so: `GET /dumps/:dump_uid/status`. Using this route, you can know whether your dump is still processing, is already done, or has encountered a problem.

<code-samples id="get_dump_status_1" />

After your dump creation process is done, the dump file is created and added in the dump folder. By default, this folder is `/dumps` at the root of your MeiliSearch binary, but this can be customized. Note that if your dump folder does not exist when the dump creation process is called, MeiliSearch will create it.

### Import a Dump

Once you have exported a dump, which is a tar.gz file, you are now able to use that dump to launch MeiliSearch. As the data contained in the dump needs to be indexed, the process will take some time to complete. Only when the dump has been fully imported will the MeiliSearch server start, after which you can begin searching through your data.

```bash
./meilisearch --import-dump /dumps/12345678.tar.gz
```

Because the indexation is the same process as when the documents are initially added to MeiliSearch, it is still a good practice to index documents in batches if the dataset is to big. The size of the batches are based on your dataset size and on your memory capacity.

[See here for more dumps options](/guides/advanced_guides/configuration.md#dumps-folder)

### Use Cases

Dumps are used after MeiliSearch updates or to communicate your database to other instances of MeiliSearch (on different servers for exemple) without having to worry about their respective Meilisearch version.
