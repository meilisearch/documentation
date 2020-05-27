# Synonyms

_Child route of the [settings route](/references/settings.md)._

`Synonyms` is an object containing words and their respective synonyms. A synonym in Meilisearch is considered equal to its associated word in a search query.

Synonyms can also be updated directly through the [global settings route](/references/settings.md#update-settings) at the same time than the other settings.

::: note
Updating the settings means overwriting the default settings of MeiliSearch. You can reset to default values using the `DELETE` routes.
:::

[Learn more about synonyms](/guides/advanced_guides/synonyms.md)

## Get synonyms

<RouteHighlighter method="GET" route="/indexes/:index_uid/settings/synonyms"/>

Get the list of [synonyms](/guides/advanced_guides/synonyms.md) of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<code-samples id="get_synonyms_1" />

#### Response: `200 OK`

```json
{
  "wolverine": ["xmen", "logan"],
  "logan": ["wolverine", "xmen"],
  "wow": ["world of warcraft"]
}
```

## Update synonyms

<RouteHighlighter method="POST" route="/indexes/:index_uid/settings/synonyms"/>

Update the list of [synonyms](/guides/advanced_guides/synonyms.md) of an index.

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Body

An object that contains all synonyms and their associated words.

[Learn more about how to add your synonyms](/guides/advanced_guides/synonyms.md).

#### Example

<code-samples id="update_synonyms_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).

## Reset synonyms

<RouteHighlighter method="DELETE" route="/indexes/:index_uid/settings/synonyms"/>

Reset the list of [synonyms](/guides/advanced_guides/synonyms.md) of an index to its default value.

#### Default value

Empty object : `{}`

#### Path Variables

| Variable      | Description   |
| ------------- | ------------- |
| **index_uid** | The index UID |

#### Example

<code-samples id="reset_synonyms_1" />

#### Response: `202 Accepted`

```json
{
  "updateId": 1
}
```

This `updateId` allows you to [track the current update](/references/updates.md).
