# Indexation and performance

Adding new documents to an index is a multi-threaded and memory-intensive operation. Meilisearch's indexes are at the core of what makes our search engine fast, relevant and reliable. In this article, we will go over some of the details regarding RAM consumption and multi-threading.

## RAM

Our indexer uses the `sysinfo` Rust library to calculate a machine's total memory size. Meilisearch then adapts its behavior so indexation uses a maximum two thirds of available resources. This process helps us with two very important things:

1. We minimize crashes due to RAM over-consumption by making sure indexation does not use more resources than available in a machine

2. The remaining memory ensures that users experience no slowdown when using your application while the indexer is processing an update

Crashes caused by memory overconsumption can still happen in two cases:

1. `sysinfo` may not be able to calculate the amount of available RAM for certain OSes. Meilisearch still makes an educated estimate and adapts its the behavior based on that, but crashes may still happen in this case. [Follow this link for an exhaustive list of OSes supported by `sysinfo`](https://docs.rs/sysinfo/0.20.0/sysinfo/#supported-oses).

2. Lower-end machines might struggle when processing huge datasets. Splitting your data payload into smaller batches can help in this case. [For more information, consult the section below](#memory-crashes).

## Multi-threading

In machines with multi-core processors, the indexer avoids using more than half of the available processing units. For example, if your machine has twelve cores, the indexer will try to use six of them at most. This ensures Meilisearch is always ready to perform searches, even while you are updating an index.

Multi-threading is unfortunately not possible in machines with only one processor core.

## Improving indexation performance

If you encounter performance issues during the indexation we recommend trying the following points:

- Make sure you are using the latest [stable version of Meilisearch](https://github.com/meilisearch/meilisearch/releases). New releases often include performance improvements that can significantly increase indexation speed.

- Use a machine with more processor cores. Indexation is a memory-intensive and multi-threaded operation. This means **the more memory and processor cores available, the faster Meilisearch will index new documents**.

- Give our [auto-batcher](/learn/experimental/autobatching.md) a try. **Bigger HTTP payloads are processed more quickly than smaller payloads**. For example, adding the same 100,000 documents in two batches of 50,000 documents will be quicker than adding them in four batches of 25,000 documents. By default, Meilisearch sets the maximum payload size to 100MB, but [you can change this value if necessary](/learn/configuration/instance_options.md#payload-limit-size). That said, **the bigger the payload is, the higher the memory consumption will be**. An instance may crash if it requires more RAM than is currently available in a machine.

- **Meilisearch should not be your main database**. The more documents you add, the longer will indexation and search take, so you should only index documents you want to retrieve when searching.

- By default, all document fields are searchable. We strongly recommend changing this by [updating the `searchableAttributes` list](https://docs.meilisearch.com/reference/api/searchable_attributes.html#update-searchable-attributes) so it only contains fields you want to search in. The fewer fields Meilisearch needs to index, the faster is the indexation process.

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
