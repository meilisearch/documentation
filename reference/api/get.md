# GET

## Get distinct attribute

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/distinct-attribute"/>

Get the distinct attribute field of an index.

### Path variables

| Variable        | Description                                                       | Type   |
| --------------- | ----------------------------------------------------------------- |--------|
| **index_uid***  | The unique index identifier                                       | string |
| `index_uid`*    | The unique index identifier                                       |`string`|

> We can have a default value column where needed but not in all tables

### Example

<CodeSamples id='get_distinct_attribute_1'/>

#### Response

:::: tabs

::: tab 200 Ok

```json
"skuid"
```

:::

::: tab failure1

:::

::: tab failure2

:::

::::
