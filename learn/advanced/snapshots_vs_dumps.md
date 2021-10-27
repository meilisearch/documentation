# Data backup: snapshots vs. dumps

MeiliSearch has two ways to backup its data: `snapshots` and `dumps`.

### Snapshots

**Snapshots** make it possible to schedule the creation of hard copies of your database.

This feature is **intended mainly as a safeguard**: ensuring that if some failure occurs, you're able to relaunch your database quickly and efficiently from a snapshot.

The documents in a snapshot are already "indexed" and ready to go, greatly increasing import speed. However, as a result, **snapshots are not compatible between different versions of MeiliSearch**.

### Dumps

**Dumps**, on the other hand, export MeiliSearch data in a way that is not bound to a specific MeiliSearch version.

As a result, importing a dump requires MeiliSearch to re-index all of your documents. This process requires an amount of time and memory corresponding to the size of the database (the number of documents, their size, and the complexity of any index settings).

::: note
We do not recommend using dumps from a new MeiliSearch version to import an older version.
For example, you **should not** import a dump from MeiliSearch v0.22.0 to MeiliSearch v0.21.0. But importing a dump from MeiliSearch v0.21.0 to MeiliSearch v0.21.0 or higher will work.
:::

### Conclusion

To summarize:

- **Snapshots are highly efficient, but not portable** between different versions of MeiliSearch.
- **Dumps are portable, but not very efficient**.
  - Frequently launching MeiliSearch from a dump would cause your performance to suffer.

For more information, have a look at the reference documentation for [snapshots](/reference/features/snapshots.md) and [dumps](/reference/features/dumps.md).
