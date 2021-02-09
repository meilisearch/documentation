# Storage

::: tip TLDR

- If the database does not shrink after deleting documents or indexes, it is expected behavior. You are not losing space, MeiliSearch is keeping this space for performance reasons.
- You should have the same amount of RAM than the space taken on disk by MeiliSearch for optimal performances.
  :::

MeiliSearch is a database. It stores the indexed documents along with the data needed to perform lightning search.

Writing a database is hard, and we do not want to reinvent the wheel, so MeiliSearch uses a storage engine under the hood. Using a storage engine allows MeiliSearch to focus on improving search relevancy and search performance while abstracting the complicated task of creating, reading and updating documents on disk, and in memory.

## LMDB

The storage engine of MeiliSearch is a [Lightning Memory-Mapped Database](http://www.lmdb.tech/doc/) (LMDB for short). LMDB is a transactional key-value store written in C that was developed for OpenLDAP, and it has ACID properties.

We chose LMDB after we successfully (or not) tried MeiliSearch with [Sled](https://github.com/spacejam/sled) and [RocksDB](https://rocksdb.org/) and decided to move on with LMDB because it is the best combination of performance and stability for Meilisearch.

### Memory mapping

LMDB stores its data in a [memory-mapped file](https://en.wikipedia.org/wiki/Memory-mapped_file). All data fetched from LMDB is returned straight from the memory map, which means there is no memory allocation or memory copy during data fetches.

All documents stored on disk are automatically loaded in memory when MeiliSearch asks for them. This ensures LMDB will always make the best use of the RAM available to retrieve the documents.

For the best performance, it is recommended to provide the same amount of RAM as the size the database takes on disk, so all the data structures can fit in memory.

### Understanding LMDB

The choice of LMDB comes with certain pros and cons. In order to understand this choice, its upsides and downsides, we need to have an insight on how LMDB impact size and memory usage. This is well explained in [a blogpost of LMDB](https://symas.com/understanding-lmdb-database-file-sizes-and-memory-utilization/) and we are trying to summarize it here.

#### Database size

When freeing entries from the database (in our case, removing documents from MeiliSearch), one can observe that no space disk is released. The space previously used by the entry is marked as free for LMDB but not made available for the operating system.
Unlike other storage engines, LMDB chooses this design for performance issues as there is no need for a compaction phase.

As a result, you may see that the disk occupied by LMDB and therefore by MeiliSearch keeps growing even if you are deleting indexes or documents. This is normal behavior, and you can note that the database will not grow again if you write some data after deleting indexes or documents.

#### Memory usage

Since LMDB is memory mapped, it is the operating system who will manage the real memory allocated or not to MeiliSearch.

Thus, if you run MeiliSearch as a standalone program on a server, LMDB will use the maximum RAM it can use.
If you run MeiliSearch along with other programs, the OS will manage memory based on everyone's need making MeiliSearch quite flexible when used in development.

::: tip
**Virtual memory != Real memory**
Virtual memory is the memory asked by a program to the OS. This is not the memory that the program will actually use.

In this case, MeiliSearch will always ask for a memory map of 200Gb. This refers to the virtual memory requested to the OS by MeiliSearch, but as you can see, the amount of real memory in RAM used will be smaller.
:::

## Measured disk usage

We did some measurements on the default [movies.json](https://github.com/meilisearch/MeiliSearch/blob/master/datasets/movies/movies.json) dataset that you can find in the [getting started guide](/learn/tutorials/getting_started.md#add-documents).
This dataset is a JSON file of 8.6 MB and has 19,553 documents.
When we index this file in MeiliSearch, the amount of disk space taken by LMDB is 122MB.

| Raw JSON | MeiliSearch database size on disk | Real memory size | Private memory size     | Virtual memory size |
| -------- | --------------------------------- | ---------------- | ----------------------- | ------------------- |
| 8.6 MB   | 122 MB ( raw data **\* 14** )     | ≃ 6.3 MB         | 120 MB (≃ size on disk) | 204 Gb (memory map) |

That means this dataset is using 6.3 MB of RAM and 122 MB of disk space.
