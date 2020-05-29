# Field Properties

By default, every [new field](/guides/advanced_guides/field_properties.md#new-fields-and-known-fields) in a document is **searchable** and **displayed**. These properties can be modified in the [settings](/references/settings.md).

## Searchable Fields

The **values** of the fields whose attributes are added to the [searchable-attributes list](/references/searchable_attributes.md) are **searched for matching query words**.

Their content is used by MeiliSearch to assess the relevancy of a document.

**By default, all field attributes are added to the searchable-attributes list**. If a new document is ingested and one of its [fields is not yet known by MeiliSearch](/guides/advanced_guides/field_properties.md#new-fields-and-known-fields), the latter will be automatically added to the searchable-attributes list. [This behavior can be changed](/references/accept_new_fields.md).

Therefore, if a field attribute is not in the searchable-attributes list, the field will be ignored from searches but will remain stored in the server. This list can be restricted to a selected set of attributes in the settings.

#### Example

Suppose you manage a database that contains information about movies. By adding the following settings, the fields `uid`, `movie_id`, `title`, `description`, `poster`, `release_date` and `rank` will be searched.

<code-samples id="field_properties_guide_searchable_1" />

## Displayed Fields

The fields whose attributes are added to the [displayed-attributes list](/references/displayed_attributes.md) are **displayed in each matching document**.

Documents returned upon search contain only displayed fields.

**By default, all field attributes are added to the displayed-attributes list**. If a new document is ingested and one of its [fields is not yet known by MeiliSearch](/guides/advanced_guides/field_properties.md#new-fields-and-known-fields), the latter will be automatically added to the displayed-attributes list. [This behavior can be changed](/references/accept_new_fields.md).

Therefore, if a field attribute is not in the displayed-attribute list, the field won't be added to the returned documents.

This list can be restricted to a selected set of attributes in the settings.

#### Example

Suppose you manage a database that contains information about movies. By adding the following settings, documents returned upon search will contain the fields `title`, `description`, `poster`, `release_date` and `rank`.

<code-samples id="field_properties_guide_displayed_1" />

## New Fields and Known Fields

A **new field** is a field that is not yet known by MeiliSearch. As soon as a field is present in the settings, it becomes a **known field**.

Depending on its state, a different behavior will be applied.

### New Fields Behavior

A new field is a field that is **present in a new document and not present in the settings**. To know if a field is in the setting, you can [get the settings list](/references/settings.md#get-settings) to ensure the presence of your field.

A new field is automatically added to the `searchableAttributes` and `displayedAttributes` lists if [acceptNewFields](/guides/advanced_guides/settings.md#accept-new-fields) is set to true (`true` is the default value).

Once a new field has been added to those lists, it becomes **a known field** since it is now present in the settings.

### Known Fields Behavior

A known field is a field that is already present in the settings. To know if a field is in the setting, you can [get the settings list](/references/settings.md#get-settings) to ensure the presence of its attribute.

No automatic behavior is applied to this field. It will stay where it is present.

For example:

1. Add `size` to the `attributesForFacetting` setting before adding documents.

2. Add documents containing the `size` field.

`size` will not be automatically added to the `searchableAttributes` and `displayedAttributes` lists since its presence in `attributesForFacetting` made it a known field.

```json
{
  "attributesForFaceting": ["size"],
  "searchableAttributes": ["name", "description"],
  "displayedAttributes": ["name", "description"],
  ...
}
```

Now imagine the opposite scenario in which you first add the documents, and then you update the `attributesForFacetting` settings.
In that case when the documents are added, `size` is not yet present in the settings. Thus is automatically added to the `searchableAttributes` and `displayedAttributes` lists.
Adding `size` to the `attributesForFacetting` settings will not remove `size` from any other setting.

```json
{
  "attributesForFaceting": ["size"],
  "searchableAttributes": ["name", "description", "size"],
  "displayedAttributes": ["name", "description", "size"],
  ...
}
```

## Data storing

All fields are stored. **This behavior cannot be changed**.

Thus, if a field is missing from both the displayed-attributes list and the searchable-attributes list, it **will still be stored**. It will be possible to add it to either or both lists at any time.
