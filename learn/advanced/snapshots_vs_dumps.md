# Data backup: Snapshots vs dumps

Meilisearch has two ways to backup its data: `snapshots` and `dumps`.

## Snapshots

Snapshots make it possible to schedule the creation of hard copies of your database. These copies are bound to a specific Meilisearch version.

This feature is **intended mainly as a safeguard**: if a failure occurs, you're able to relaunch your database quickly and efficiently.

The documents in a snapshot are already indexed and ready to go, greatly increasing import speed. However, **snapshots are not compatible between different versions of Meilisearch**.

## Dumps

Dumps export Meilisearch data in a way that is not bound to a specific Meilisearch version. This means **dumps are ideal for migrating your data when you upgrade Meilisearch.**

**Importing a dump requires Meilisearch to re-index all your documents.** This process requires a significant amount of time and memory corresponding to the size of the database.

::: note
We do not recommend using dumps from a new Meilisearch version to import an older version.

For example, you can import a dump from Meilisearch v0.21 into v0.22 without any problems. Importing a dump generated in v0.22 into a v0.21 instance, however, can lead to unexpected behavior.
:::

## Conclusion

To summarize:

- Snapshots are highly efficient, but not portable between different versions of Meilisearch
- Dumps are portable between different Meilisearch versions, but not very efficient

For more information, have a look at the the documentation guides for [snapshots](/learn/advanced/snapshots.md) and [dumps](/learn/advanced/dumps.md).
