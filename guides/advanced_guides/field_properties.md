# Field Properties

By default, every field in a document is **searchable** and **displayed**. These properties can be modified in the [settings](/references/settings.md).

## Searchable Fields

The **values** of the fields whose attributes are added to the [searchable-attributes list](/references/searchable_attributes.md) are **searched for matching query words**.

Their content is used by MeiliSearch to assess the relevancy of a document.

**By default, all field attributes are added to the searchable-attributes list**. If a new document is ingested and one of its fields was never present in any other document, the latter will be automatically added to the searchable-attributes list. [This behavior can be changed](/references/accept_new_fields.md).

Therefore, if a field attribute is not in the searchable-attributes list, the field will be ignored from searches but will remain stored in the server. This list can be restricted to a selected set of attributes in the settings.

#### Example

Suppose you manage a database that contains information about movies. By adding the following settings, the fields `uid`, `movie_id`, `title`, `description`, `poster`, `release_date` and `rank` will be searched.

<code-samples id="field_properties_guide_searchable_1" />

## Displayed Fields

The fields whose attributes are added to the [displayed-attributes list](/references/displayed_attributes.md) are **displayed in each matching document**.

Documents returned upon search contain only displayed fields.

**By default, all field attributes are added to the displayed-attributes list**. If a new document is ingested and one of its fields was never present in any other document, the latter will be automatically added to the displayed-attributes list. [This behavior can be changed](/references/accept_new_fields.md).

Therefore, if a field attribute is not in the displayed-attribute list, the field won't be added to the documents returned upon search. Nevertheless, the documents fetched using the `GET /documents` route will have those fields, this setting only affects the document hits upon search.

This list can be restricted to a selected set of attributes in the settings.

#### Example

Suppose you manage a database that contains information about movies. By adding the following settings, documents returned upon search will contain the fields `title`, `description`, `poster`, `release_date` and `rank`.

<code-samples id="field_properties_guide_displayed_1" />

## Data storing

All fields are stored. **This behavior cannot be changed**.

Thus, if a field is missing from both the displayed-attributes list and the searchable-attributes list, it **will still be stored**. It will be possible to add it to either or both lists at any time.
