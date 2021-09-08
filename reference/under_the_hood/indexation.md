# Indexation and performance

MeiliSearch indexation is a memory-intensive multi-threaded operation. It is one of the most important operations and at the core of what makes our search engine fast, relevant and reliable. In this article, we will go over some of the details regarding RAM consumption and multi-threading.


## RAM

Our indexer uses the `sysinfo` Rust library to calculate a machine's total memory size and adapts its behavior so indexation uses a maximum two thirds of available resources. This process helps us with two very important things:

1. By making sure indexation does use more resources than available in a machine, we minimize crashes due to RAM over-consumption

2. The remaining memory ensures that end-users experience no slowdown when using your application when you need to update indexes

Memory-related crashes can still happen in two cases:

1. `sysinfo` may not be able to calculate the amount of available RAM for certain OSes such as FreeBSD. MeiliSearch still makes an educated estimate and adapts its the behavior based on that, but crashes may still happen in this case. [Follow this link for an exhaustive list of OSes supported by `sysinfo`](https://docs.rs/sysinfo/0.20.0/sysinfo/#supported-oses). 

2. Lower-end machines might struggle when processing huge datasets. Splitting your data payload into smaller batches can help in this case. [For more information, consult the FAQ.](/faq.md#why-does-meilisearch-crash-when-i-try-to-add-documents)

## Multi-threading

The indexer never uses more than half of the available processor cores. For example, if your machine has twelve cores, MeiliSearch will use six of them at most. This ensures that MeiliSearch is always ready to perform searches, even while you are updating the indexes.

Multi-threading is unfortunately not possible in machines with only one processor core.
