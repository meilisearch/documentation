# Distinct attribute

The distinct attribute is a special, user-designated field. It is most commonly used to prevent MeiliSearch from returning a set of several similar documents, instead forcing it to return only one.

The value of a field configured as a distinct attribute will always be unique among returned documents. This means there will **never be more than one occurrence of the same value** of a distinct attribute field in the different documents returned by MeiliSearch.

When multiple documents have the same value for the distinct attribute, MeiliSearch returns only the highest-ranked result after applying [ranking rules](/learn/core_concepts/relevancy.md#ranking-rules). If two or more documents are equivalent in terms of ranking, MeiliSearch returns the first result according to its `internal_id`.

### Example

Suppose you have an e-commerce dataset. For an index that contains information about jackets, you may have several identical items with minor variations such as color or size.

As shown below, this dataset contains three documents representing different versions of a Lee jeans leather jacket. One of the jackets is brown, one is black, and the last one is blue.

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

By default, a search for `lee leather jacket` would return all three documents. This might not be desired, since displaying nearly identical variations of the same item can make results appear cluttered.

In this case, you may want to ignore the different colors of a product. To do so, you can set `product_id` as a `distinctAttribute`.

<CodeSamples id="distinct_attribute_guide_1" />

By setting `distinctAttribute` to `product_id`, search requests **will never return more than one document with the same `product_id`**.

After setting the distinct attribute as shown above, querying for `lee leather jacket` would only return the first document found. The response would look like this:

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
