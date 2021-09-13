# Field properties

By default, whenever a document is added to MeiliSearch, all new attributes found in it are automatically added to two lists:

- [`searchableAttributes`](/reference/features/field_properties.md#the-searchableattributes-list): attributes whose values are searched for matching query words.
- [`displayedAttributes`](/reference/features/field_properties.md#displayed-fields): attributes whose fields are displayed in documents.

This means that by default, every field in a document is **searchable** and **displayed**. These properties can be modified in the [settings](/reference/api/settings.md).

## Searchable fields

A field can either be **searchable** or **non-searchable**.

When you perform a search, all searchable fields are checked for matching query words and used to assess document relevancy, while non-searchable fields are ignored entirely. **By default, all fields are searchable.**

Non-searchable fields are most useful for internal information that's not relevant to the search experience, such as URLs, sales numbers, or ratings used exclusively for sorting results.

::: tip
Even if you make a field non-searchable, it will remain [stored in the database](#data-storing) and can be made searchable again at a later time.
:::

### The `searchableAttributes` list

MeiliSearch uses an ordered list to determine which attributes are searchable. The order in which attributes appear in this list also determines their [impact on relevancy](/learn/core_concepts/relevancy.md#attribute-ranking-order), from most impactful to least.

In other words, the `searchableAttributes` list serves two purposes:

1. It designates the fields that are searchable.
2. It dictates the [attribute ranking order](/learn/core_concepts/relevancy.md#attribute-ranking-order).

There are two possible modes for the `searchableAttributes` list.

#### Default: Automatic

**By default, all attributes are automatically added to the `searchableAttributes` list in their order of appearance.** This means that the initial order will be based on the order of attributes in the first document indexed, with each new attribute found in subsequent documents added at the end of this list.

This default behavior is indicated by a `searchableAttributes` value of `["*"]`. To verify the current value of your `searchableAttributes` list, use the [get searchable attributes endpoint](/reference/api/searchable_attributes.md#get-searchable-attributes).

If you'd like to restore your searchable attributes list to this default behavior, simply [set `searchableAttributes` to an empty array `[]`](/reference/api/searchable_attributes.md#update-searchable-attributes) or use the [reset searchable attributes endpoint](/reference/api/searchable_attributes.md#reset-searchable-attributes).

#### Manual

You may want to make some attributes non-searchable, or change the [attribute ranking order](/learn/core_concepts/relevancy.md#attribute-ranking-order) after documents have been indexed. To do so, simply place the attributes in the desired order and send the updated list using the [update searchable attributes endpoint](/reference/api/searchable_attributes.md#update-searchable-attributes).

After manually updating the `searchableAttributes` list, **subsequent new attributes will no longer be automatically added** unless the settings are [reset](/reference/api/searchable_attributes.md#reset-searchable-attributes).

::: warning
Due to an implementation bug, manually updating `searchableAttributes` will change the displayed order of document fields in the JSON response. This behavior is inconsistent and will be fixed in a future release.
:::

#### Example

Suppose that you manage a database of movies with the following fields: `id`, `description`, `genre`, `title`, `release_date`. These fields all contain useful information; however, **some are more useful to search than others**. To make the `id` and `release_date` fields non-searchable and re-order the remaining fields by importance, you might update the searchable attributes list in the following way.

<CodeSamples id="field_properties_guide_searchable_1" />

## Displayed fields

The fields whose attributes are added to the [`displayedAttributes` list](/reference/api/displayed_attributes.md) are **displayed in each matching document**.

Documents returned upon search contain only displayed fields.

**By default, all field attributes are set as displayed**.

Therefore, if a field attribute is not in the displayed-attribute list, the field won't be added to the returned documents.

This list can be restricted to a selected set of attributes in the settings.

#### Example

Suppose you manage a database that contains information about movies. By adding the following settings, documents returned upon search will contain the fields `title`, `description`, `release_date` and `genre`.

<CodeSamples id="field_properties_guide_displayed_1" />

## Data storing

All fields are stored in the database. **This behavior cannot be changed**.

Thus, even if a field is missing from both the `displayedAttributes` list and the `searchableAttributes` list, **it is still stored in the database** and can be added to either or both lists at any time.
