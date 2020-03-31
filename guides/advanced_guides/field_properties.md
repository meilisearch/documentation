# Field properties

Every document field can have either or both or none of the following properties (which can be modified in the [settings](/references/settings.md)):

- Searchable
- Displayed

## Searchable fields

Searchable fields are fields whose attribute is stored in the [searchable-attributes](/references/searchable_attributes.md) list.

Therefore, the content of a searchable field is used by MeiliSearch to assess the relevancy of a document.
When a field's attribute is not in the searchable-attribute list, the field will be ignored from searches but remains stored in the server.

By default, all fields attributes are added to the searchable-attributes list. If a new document is ingested and one of its fields is missing from other documents, the latter will automatically be added to the searchable-attributes list. [This behavior can be modified](/references/accept_new_fields.md).

This list can be restricted to a specific set of attributes that you can select in the settings. That way, you are able to specify which fields should be ignored by MeiliSearch from searches..

## Displayed attributes

Displayed fields are fields whose attribute is stored in the [displayed-attributes](/references/displayed_attributes.md) list.

Therefore, a displayed field will be part of documents returned upon search.
When a field's attribute is not in the displayed-attribute list, the field won't be added to the documents.

By default, all fields attributes are added to the displayed-attributes list. If a new document is ingested and one of its fields is missing from other documents, the latter will automatically be added to the displayed-attributes list. [This behavior can be changed](/references/accept_new_fields.md).

This list can be restricted to a specific set of attributes that you can select in the settings. That way, you are able to specify which fields should not be returned upon search.

### Data storing

All field are stored. This behavior cannot be changed. Thus, if a field is missing from both the displayed-attributes list and the searchable-attributes list, it will be still stored. It will be possible to add it to either list at any time.
