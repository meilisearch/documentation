# Data Types

This page describes the different data types supported for the fields in a document and how MeiliSearch does handle them.

- [String](/guides/advanced_guides/datatypes.md#string)
- [Numeric types](/guides/advanced_guides/datatypes.md#numeric-types): `integer`, `float`
- [Boolean](/guides/advanced_guides/datatypes.md#boolean)
- [Array](/guides/advanced_guides/datatypes.md#array)
- [Object](/guides/advanced_guides/datatypes.md#object)
- [`null` type](/guides/advanced_guides/datatypes.md#null-type)

When documents are returned upon search, they contain [displayed fields](/guides/advanced_guides/field_properties.md#displayed-fields). The displayed values are always **returned unchanged**.

If a field is [searchable](/guides/advanced_guides/field_properties.md#searchable-fields), each data type is handled in a different way.

### String

> String tokenization is the process of splitting a string into a list of individual terms that are called tokens.

A string is passed to a tokenizer and is then broken into separate string tokens. Each word (token) is indexed and stored in the global dictionary of the corresponding index.

- For Latin-based languages, the words are separated by space.
- For Kanji characters, the words are separated by character.

There are two kinds of separators:

- **Soft spaces** (distance: 1): whitespaces, quotes, `'-' | '_' | '\'' | ':' | '/' | '\\' | '@'`
- **Hard spaces** (distance: 8): `'.' | ';' | ',' | '!' | '?' | '(' | ')'`

```
"Bruce Willis,Vin Diesel"
```

For example, the distance between `Bruce` and `Willis` is equal to one. The distance between `Vin` and `Diesel` is also equal to one.

But, the distance between `Bruce` and `Vin` is equal to 8. The same goes for `Willis`and `Diesel`.

### Numeric types

A numeric type (`integer`, `float`) is converted to a human-readable decimal number string representation.

### Boolean

A Boolean value, which is either `true` or `false`, is received and converted to a lowercase human-readable text.

### Array

### Object

JSON objects are written in key/value pairs and surrounded by curly braces.

```json
"title": "Interstellar"
```

In the example above, `title` and `Interstellar` are both considered as words. The colon `:` is used as a separator.

### null type

The `null` type can be pushed into MeiliSearch but it won't be taken into account for indexation.
