# Field Properties

By default, every field in a document is **searchable** and **displayed**. These properties can be modified in the [settings](/references/settings.md).

## Searchable Fields

The **values** of the fields whose attributes are added to the [searchable-attributes list](/references/searchable_attributes.md) are **searched for matching query words**.

Their content is used by MeiliSearch to assess the relevancy of a document.

**By default, all field attributes are set as searchable**.

Therefore, if a field attribute is not in the searchable-attributes list, the field will be ignored from searches but will remain stored in the server. This list can be restricted to a selected set of attributes in the settings.

#### Example

given a dataset with the following fields: id, description, genre, title, release_date. We can update the searchable attributes by removing the id and the release_date and re-order fields following their importance.

Suppose that you managed a database of movies with the following fields: `id`, `description`, `genre`, `title`, `release_date`. They all contain useful information; however, some are more useful than others. If you wanted to make the `id` and `release_date` fields non-searchable, and re-order the remaining fields by importance, you could update the searchable attributes in the following way.

<CodeSamples id="field_properties_guide_searchable_1" />

## Displayed Fields

The fields whose attributes are added to the [displayed-attributes list](/references/displayed_attributes.md) are **displayed in each matching document**.

Documents returned upon search contain only displayed fields.

**By default, all field attributes are set as displayed**.

Therefore, if a field attribute is not in the displayed-attribute list, the field won't be added to the returned documents.

This list can be restricted to a selected set of attributes in the settings.

#### Example

Suppose you manage a database that contains information about movies. By adding the following settings, documents returned upon search will contain the fields `title`, `description`, `poster`, `release_date` and `rank`.

<CodeSamples id="field_properties_guide_displayed_1" />

## Data storing

All fields are stored. **This behavior cannot be changed**.

Thus, if a field is missing from both the displayed-attributes list and the searchable-attributes list, it **will still be stored**. It will be possible to add it to either or both lists at any time.
