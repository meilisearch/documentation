# Distinct Attribute

The **value** of a field whose attribute is set as a distinct attribute will always be **unique** in the returned documents.

In such a case, there will **never be two, or more, occurrences of the same value** of that field in the different documents returned by MeiliSearch.

When multiple documents have the same value for a distinct attribute, MeiliSearch returns the first one after applying [ranking rules](/learn/core_concepts/relevancy.md#ranking-rules). If documents are equivalent in terms of ranking, MeiliSearch returns the first in terms of `internal_id`.

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
    "id": 3,
    "description": "Leather jacket",
    "brand": "Lee jeans",
    "color": "blue",
    "product_id": "123456"
  }
]
```

You may want to ignore the different colors of an item. To do so, you can set `product_id` as a `distinctAttribute`.

<CodeSamples id="distinct_attribute_guide_1" />

By [setting `product_id` as a distinct attribute](/reference/api/distinct_attribute.md), search requests **will never return more than one jacket with the same `product_id`**.

For this example, querying for `lee leather jacket` would only return the first document found. The response could look like this:

```json
{
  "hits": [
    {
      "id": 1,
      "description": "Leather jacket",
      "brand": "Lee jeans",
      "color": "brown",
      "product_id": "123456"
    }
  ],
  "offset": 0,
  "limit": 20,
  "nbHits": 1,
  "exhaustiveNbHits": false,
  "processingTimeMs": 0,
  "query": "lee leather jacket"
}
```
