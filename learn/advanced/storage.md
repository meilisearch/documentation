# Storage

Meilisearch is, in many ways, a database. It stores indexed documents along with the data needed to return relevant search results.

## Database location

Meilisearch creates the database in the moment you first launch an instance. By default, you can find it inside a `data.ms` folder located in the same directory as the `meilisearch` binary.

The database location can change depending on a number of factors, such as whether you have configured a different database path with the [`--db-path` instance option](/learn/configuration/instance_options.md#database-path), or if you're using an OS virtualization tool like [Docker](https://docker.com).

## LMDB

Creating a database from scratch and managing it hard work. It would make no sense to try and reinvent the wheel, so Meilisearch uses a storage engine under the hood. This allows Meilisearch to focus on improving search relevancy and search performance while abstracting the complicated task of creating, reading and updating documents on disk and in memory.

The storage engine Meilisearch uses under the hood is a [Lightning Memory-Mapped Database](http://www.lmdb.tech/doc/) (LMDB for short). LMDB is a transactional key-value store written in C that was developed for OpenLDAP and has ACID properties.

We chose LMDB after extensive testing with LMDB itself, [Sled](https://github.com/spacejam/sled) and [RocksDB](https://rocksdb.org/). We chose LMDB because it provided us with the best combination between performance and stability.

### Memory mapping

LMDB stores its data in a [memory-mapped file](https://en.wikipedia.org/wiki/Memory-mapped_file). All data fetched from LMDB is returned straight from the memory map, which means there is no memory allocation or memory copy during data fetches.

All documents stored on disk are automatically loaded in memory when Meilisearch asks for them. This ensures LMDB will always make the best use of the RAM available to retrieve the documents.

For the best performance, it is recommended to provide the same amount of RAM as the size the database takes on disk, so all the data structures can fit in memory.

### Understanding LMDB

The choice of LMDB comes with certain pros and cons. In order to understand this choice, its upsides and downsides, we need to have an insight on how LMDB impact size and memory usage. This is well explained in [a blog post of LMDB](https://www.symas.com/post/understanding-lmdb-database-file-sizes-and-memory-utilization) and we are trying to summarize it here.

#### Database size

When freeing entries from the database (in our case, removing documents from Meilisearch), one can observe that no space disk is released. The space previously used by the entry is marked as free for LMDB but not made available for the operating system.

Unlike other storage engines, LMDB chooses this design for performance issues as there is no need for a compaction phase.

As a result, you may see that the disk occupied by LMDB and therefore by Meilisearch keeps growing even if you are deleting indexes or documents. This is normal behavior, and you can note that the database will not grow again if you write some data after deleting indexes or documents.

#### Memory usage

Since LMDB is memory mapped, it is the operating system that manages the real memory allocated (or not) to Meilisearch.

Thus, if you run Meilisearch as a standalone program on a server, LMDB will use the maximum RAM it can use. In general, you should have the same amount of RAM than the space taken on disk by Meilisearch for optimal performance.

On the other hand, if you run Meilisearch along with other programs, the OS will manage memory based on everyone's need. This makes Meilisearch's memory usage quite flexible when used in development.

::: tip
**Virtual Memory != Real Memory**
Virtual memory is the disk space a program requests from the OS. It is not the memory that the program will actually use.

Meilisearch will always demand a certain amount of space to use as a [memory map](#memory-mapping). This space will be used as virtual memory, but the amount of real memory (RAM) used will be much smaller.
:::

## Measured disk usage

The following measurements were taken using <a id="downloadMovie" href="/movies.json" download="movies.json">an 8.6 MB JSON dataset containing 19,553 documents</a>.

After indexed, the dataset size in LMDB is about 122MB.

| Raw JSON | Meilisearch database size on disk | RAM usage | Virtual memory usage |
| -------- | --------------------------------- | -------------------- | ------------------- |
| 9.1 MB   | 224 MB                            | ≃ 305 MB             | 205 Gb (memory map) |

This means the database is using **305 MB of RAM and 224 MB of disk space.** Note that [virtual memory](https://www.enterprisestorageforum.com/hardware/virtual-memory/) **refers only to disk space allocated by your computer for Meilisearch—it does not mean that it's actually in use by the database.** See [Memory Usage](#memory-usage) for more details.

::: warning

These metrics are highly dependent on the machine that is running Meilisearch. Running this test in significantly underpowered machines is likely to give different results.

:::

It is important to note that **there is no reliable way to predict the final size of a database**. This is true for just about any search engine on the market—we're just the only ones saying it out loud.

Database size is affected by a large number of criteria, including settings, relevancy rules, use of facets, the number of different languages present, and more.

## Soft deletion

Meilisearch renders deleted documents inaccessible to all users but does not immediately remove them from the database. This is a common optimization technique called soft deletion. Soft deleted documents are permanently deleted during a later update, depending on your index size and the available disk space. It might be important to check how soft deletion interacts with data retention legislation relevant to your application.

Soft deletion also affects document updates: when you update a document, Meilisearch removes the current record and creates a new document with updated data.
