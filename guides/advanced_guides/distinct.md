# Distinct

A field can be set as `distinct`.

When a field is `distinct`, there will **never be two, or more, occurence of the same value of that attribute** in the different documents that are returned by MeiliSearch.

### Example

Let's use the following documents sample with 3 jackets of **different `colors`** but **same `skuid`**:
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
  },
]
```


By [setting `skuid` as a distinct field](/references/settings.md#distinct-field):

```bash
 $ curl
  -X POST 'http://localhost:7700/indexes/jackets/settings' \
  --data '{ "distinctField": "skuid" }'
```

With this setting, search requests **will never return two or more jackets with the same `skuid`**.

::: error
If the field does not exist, no error will be thrown.
:::
