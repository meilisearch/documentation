# Distinct

A field can be set as `distinct`.

When a field is `distinct`, there will **never be two, or more, occurence of the same value of that attribute** in the different documents that are returned by MeiliSearch.

### Example

Lets use the following documents sample with 3 jacket of **different `colors`** but **same `skuid`**:
```json
[
  {
    "id" : 1,
    "skuid" : "abcdef",
    "name" : "Really nice Jacket",
    "color" : "blue"
  },
  {
    "id" : 2,
    "skuid" : "abcdef",
    "name" : "Really nice Jacket",
    "color" : "red"
  },
  {
    "id" : 3,
    "skuid" : "abcdef",
    "name" : "Really nice Jacket",
    "color" : "green"
  },
]
```


By [setting `skuid` as a distinct field](/references/settings.md#distinct) :

```bash
curl
  --request POST 'http://localhost:7700/indexes/jackets/settings' \
  --data '{ "distinctField": "skuid" }'
```

With this setted, document request made to MeiliSearch **will never return two or more jacket with the same `skuid`**.

::: error
If the field does not exist no error will be thrown
:::
