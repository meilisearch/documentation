# Distinct attribute

The **value** of a field whose attribute is set as a distinct attribute will always be **unique** in the returned documents.

In such a case, there will **never be two, or more, occurrences of the same value** of that field in the different documents returned by MeiliSearch.

### Example

Suppose you have an e-commerce dataset. For an index that contains information about jackets, you may have several identical items in different variations (color or size).

As shown below, you have 3 documents that contain information about the same jacket. One of the jackets is brown, one is black, and the last one is blue.

```json
[
  {
    "id": 1,
    "description": "Leather jacket",
    "brand": "Lee jeans",
    "color": "brown",
    "product_id": "123456"
  },
  {
    "id": 2,
    "description": "Leather jacket",
    "brand": "Lee jeans",
    "color": "black",
    "product_id": "123456"
  },
  {
    "id": 2,
    "description": "Leather jacket",
    "brand": "Lee jeans",
    "color": "blue",
    "product_id": "123456"
  }
]
```

You may want to ignore the different colors of an item. To do so, you can set `product_id` as a `distinctAttribute`.

By [setting `product_id` as a distinct attribute](/references/distinct_attribute.md), search requests **will never return more than one jacket with the same `product_id`**.

```bash
 $ curl
  -X POST 'http://localhost:7700/indexes/jackets/settings' \
  --data '{ "distinctAttribute": "product_id" }'
```

::: warning
If the field does not exist, no error will be thrown.
:::
