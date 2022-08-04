# Indexation and performance

Adding new documents to an index is a multi-threaded and memory-intensive operation. Meilisearch's indexes are at the core of what makes our search engine fast, relevant and reliable. In this article, we will go over some of the details regarding RAM consumption and multi-threading.

## RAM

By default, our indexer uses the `sysinfo` Rust library to calculate a machine's total memory size. Meilisearch then adapts its behavior so indexation uses a maximum two thirds of available resources. Alternatively, you can use the `[--max-indexing-memory](/learn/configuration/instance_options.md#max-indexing-memory)` instance option to manually control the maximum amount of RAM Meilisearch can consume.

It is important to prevent Meilisearch from using all available memory during indexation. If that happens, there are two negative consequences:

1. Meilisearch may be killed by the OS for over-consuming RAM

2. Users making search requests may experience slowdown while the indexer is processing an update

Memory overconsumption can still happen in two cases:

1. When letting Meilisearch automatically set the maximum amount of memory used during indexation, `sysinfo` may not be able to calculate the amount of available RAM for certain OSes. Meilisearch still makes an educated estimate and adapts its behavior based on that, but crashes may still happen in this case. [Follow this link for an exhaustive list of OSes supported by `sysinfo`](https://docs.rs/sysinfo/0.20.0/sysinfo/#supported-oses)

2. Lower-end machines might struggle when processing huge datasets. Splitting your data payload into smaller batches can help in this case. [For more information, consult the section below](#memory-crashes)

## Multi-threading

In machines with multi-core processors, the indexer avoids using more than half of the available processing units. For example, if your machine has twelve cores, the indexer will try to use six of them at most. This ensures Meilisearch is always ready to perform searches, even while you are updating an index.

You can override Meilisearch's default threading limit by using the `[--max-indexing-threads](/learn/configuration/instance_options.md#max-indexing-threads)` instance option. Allowing Meilisearch to use all processor cores for indexation might negatively impact your users' search experience.

Multi-threading is unfortunately not possible in machines with only one processor core.

## Improving indexation performance

If you encounter performance issues during the indexation we recommend trying the following points:

- Make sure you are using the latest [stable version of Meilisearch](https://github.com/meilisearch/meilisearch/releases). New releases often include performance improvements that can significantly increase indexation speed.

- Indexation is a memory-intensive and multi-threaded operation. This means **the more memory and processor cores available, the faster Meilisearch will index new documents**. When trying to improve indexation speed, using a machine with more processor cores is more effective than increasing RAM.

- **Bigger HTTP payloads are processed more quickly than smaller payloads**. For example, adding the same 100,000 documents in two batches of 50,000 documents will be quicker than adding them in four batches of 25,000 documents. By default, Meilisearch sets the maximum payload size to 100MB, but [you can change this value if necessary](/learn/configuration/instance_options.md#payload-limit-size). That said, **the bigger the payload is, the higher the memory consumption will be**. An instance may crash if it requires more RAM than is currently available in a machine.

  - If you want to speed up indexation but don't wish to batch documents manually, consider giving our [experimental auto-batcher](/learn/experimental/auto-batching.md) a try.

- **Meilisearch should not be your main database**. The more documents you add, the longer will indexation and search take, so you should only index documents you want to retrieve when searching.

- By default, all document fields are searchable. We strongly recommend changing this by [updating the `searchableAttributes` list](/reference/api/settings.md#update-searchable-attributes) so it only contains fields you want to search in. The fewer fields Meilisearch needs to index, the faster is the indexation process.

```json
[
  {
    "id": 1,
    "title": "Pride and Prejudice",
    "author": "Jane Austin",
    "genre": "romance"
  },
  {
    "id": 2,
    "title": "Le Petit Prince",
    "author": "Antoine de Saint-Exupéry",
    "genre": "adventure"
  }
]
```

- When creating a new index, first [configure its settings](/learn/configuration/settings.md) and only then add your documents. Following this order will significantly reduce indexation time.

- Since indexation speed is tightly connected to the size of your payload, using lightweight dataset formats such as CSV and NDJSON can lead to increased performance.

- Prefer machines using SSDs (Solid State Drives). We strongly recommend not running Meilisearch in HDDs (Hard Disk Drives).

- Ensure there are no limit to I/O operations in your machine. The restrictions imposed by cloud providers such as [AWS's Amazon EBS service](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html#IOcredit) can severely impact indexation performance

## Memory crashes

In some cases, the OS will interrupt Meilisearch and stop all its processes. Most of these crashes happen during indexation and are a result of a machine running out of RAM. This means your computer does not have enough memory to process your dataset.

We are aware of this issue and actively trying to resolve it. If you are struggling with memory-related crashes, we recommend:

- Adding new documents in smaller batches
- Increasing your machine's RAM
- Improving indexation performance [as described in the previous section](#improving-indexation-performance). Notable exception: increasing payload size is not advised if you are experiencing memory-related issues
