# Indexation and performance

Adding new documents to an index is a multi-threaded and memory-intensive operation. MeiliSearch's indexes are at the core of what makes our search engine fast, relevant and reliable. In this article, we will go over some of the details regarding RAM consumption and multi-threading.

## RAM

Our indexer uses the `sysinfo` Rust library to calculate a machine's total memory size. MeiliSearch then adapts its behavior so indexation uses a maximum two thirds of available resources. This process helps us with two very important things:

1. We minimize crashes due to RAM over-consumption by making sure indexation does not use more resources than available in a machine

2. The remaining memory ensures that users experience no slowdown when using your application while the indexer is processing an update

Crashes caused by memory overconsumption can still happen in two cases:

1. `sysinfo` may not be able to calculate the amount of available RAM for certain OSes. MeiliSearch still makes an educated estimate and adapts its the behavior based on that, but crashes may still happen in this case. [Follow this link for an exhaustive list of OSes supported by `sysinfo`](https://docs.rs/sysinfo/0.20.0/sysinfo/#supported-oses).

2. Lower-end machines might struggle when processing huge datasets. Splitting your data payload into smaller batches can help in this case. [For more information, consult the section below](/reference/under_the_hood/indexation.md#memory-crashes).

## Multi-threading

In machines with multi-core processors, the indexer avoids using more than half of the available processing units. For example, if your machine has twelve cores, the indexer will try to use six of them at most. This ensures MeiliSearch is always ready to perform searches, even while you are updating an index.

Multi-threading is unfortunately not possible in machines with only one processor core.

## Speed up the indexation time

If you encounter some performance issues during the indexation we recommend trying the following points:

1. Make sure you are using the latest [stable version of MeiliSearch](https://github.com/meilisearch/MeiliSearch/releases). Our latest releases often include performance optimizations that can significantly increase indexation speed.

2. Indexation is a memory-intensive and multi-threaded operation. This means that **the more memory and processor cores available, the faster MeiliSearch will index new documents**. In general, using a machine with many processor cores will be more effective than increasing RAM.

3. **Bigger HTTP payloads are processed more quickly than smaller payloads**. For example, adding the same 100,000 documents in two batches of 50,000 documents will be quicker than in four batches of 25,000 documents. By default, MeiliSearch sets the maximum payload size to 100MB, but [you can change this value if necessary](/reference/features/configuration.md#payload-limit-size). That said, **the bigger the payload, the higher the memory consumption**. An instance may crash if it requires more RAM than is currently available in a machine.

4. **MeiliSearch should not be your main database**. By this we mean you should only index documents you want to retrieve when searching. The more documents you add, the longer will indexation and search take.

5. By default, all the fields of your documents are considered as "searchable". We strongly recommend changing this by [setting the `searchablaAttributes`](https://docs.meilisearch.com/reference/api/searchable_attributes.html#update-searchable-attributes) with the exhaustive list of fields you want to search in. The fewer fields MeiliSearch needs to index, the faster is the indexation process.
For example, if indexing the `id` and `genre` fields has little impact on the quality of your search, adding only `title` and `author` to `searchableAttributes` will increase indexation speed:

```json
[
  { "id": 1, "title": "Pride and Prejudice", "author": "Jane Austin", "genre": "romance" },
  { "id": 2, "title": "Le Petit Prince", "author": "Antoine de Saint-Exupéry", "genre": "adventure" }
]
```

- The first time you push your documents, we recommend pushing your settings first, and then, add your documents. Not the contrary. It will drastically decrease the time of indexation. `searchableAttributes` described in the previous point is part of these settings.

- Since indexation speed is tightly connected to the size of your payload, using lightweight dataset formats such as CSV and NDJSON can lead to increased performance. Be aware converting your JSON dataset into CSV will not work for array and objects fields.

- Do not run MeiliSearch in machine using a HDD (Hard Disk Drive). Most of the recent cloud providers do not offer this kind of service anymore, but it can still happen.

- Ensure your cloud provider does not limit your I/O operations, like AWS does with their [Amazon EBS service](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html) for example.

## Memory crashes

In some cases, MeiliSearch can be stopped by the OS. Most of these crashes happen during indexation and are a result of a machine running out of RAM. This happens when your computer does not have enough memory to process your dataset.

We are aware of this issue and actively trying to resolve it. If you are struggling with memory-related crashes, we recommend:


- Adding new documents in smaller batches
- Increasing your machine's RAM
- Improving indexation performance as described in the previous section. Notable exception: increasing payload size, as recommended on item #3, is not advised if you are experiencing memory-related issues
