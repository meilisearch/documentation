# Distinct attribute

The **value** of a field whose attribute is set as a distinct attribute will always be **unique** in the returned documents.

In such a case, there will **never be two, or more, occurrences of the same value** of that field in the different documents returned by MeiliSearch.

### Example

Suppose you have 3 documents, each with a different jacket. Each jacket has a **unique `color`** but **same `skuid`**:

```json
[
  {
    "id": 1,
    "skuid": "abcdef",
    "name": "Really nice Jacket",
    "color": "blue"
  },
  {
    "id": 2,
    "skuid": "abcdef",
    "name": "Really nice Jacket",
    "color": "red"
  },
  {
    "id": 3,
    "skuid": "abcdef",
    "name": "Really nice Jacket",
    "color": "green"
  }
]
```

By [setting `skuid` as a distinct field](/references/distinct_attribute.md), search requests **will never return two or more jackets with the same `skuid`**.

```bash
 $ curl
  -X POST 'http://localhost:7700/indexes/jackets/settings' \
  --data '{ "distinctAttribute": "skuid" }'
```

::: warning
If the field does not exist, no error will be thrown.
:::
