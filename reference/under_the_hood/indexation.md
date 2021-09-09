# Indexation and performance

Adding new documents to an index is a multi-threaded and memory-intensive operation. MeiliSearch's indexes are at the core of what makes our search engine fast, relevant and reliable. In this article, we will go over some of the details regarding RAM consumption and multi-threading.

## RAM

Our indexer uses the `sysinfo` Rust library to calculate a machine's total memory size. MeiliSearch then adapts its behavior so indexation uses a maximum two thirds of available resources. This process helps us with two very important things:

1. We minimize crashes due to RAM over-consumption by making sure indexation does not use more resources than available in a machine

2. The remaining memory ensures that users experience no slowdown when using your application while the indexer is processing an update

Crashes caused by memory overconsumption can still happen in two cases:

1. `sysinfo` may not be able to calculate the amount of available RAM for certain OSes. MeiliSearch still makes an educated estimate and adapts its the behavior based on that, but crashes may still happen in this case. [Follow this link for an exhaustive list of OSes supported by `sysinfo`](https://docs.rs/sysinfo/0.20.0/sysinfo/#supported-oses).

2. Lower-end machines might struggle when processing huge datasets. Splitting your data payload into smaller batches can help in this case. [For more information, consult the FAQ.](/resources/faq.md#why-does-meilisearch-crash-when-i-try-to-add-documents)

## Multi-threading

In machines with multi-core processors, the indexer avoids using more than half of the available processing units. For example, if your machine has twelve cores, the indexer will try to use six of them at most. This ensures MeiliSearch is always ready to perform searches, even while you are updating an index.

Multi-threading is unfortunately not possible in machines with only one processor core.
