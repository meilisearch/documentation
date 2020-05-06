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

For latin-base languages, the words are separated by space.
For Kanji characters, the words are separated by Kanji character.

There are two kinds of separators:
- Soft spaces (distance: 1): whitespaces, quotes, `'-' | '_' | '\'' | ':' | '/' | '\\' | '@'`
- Hard spaces (distance: 8): `'.' | ';' | ',' | '!' | '?' | '(' | ')'`

```
"Bruce Willis,Vin Diesel"
```
For example, the distance between `Bruce` and `Willis` is one. The distance between `Vin` and `Diesel` is also one. But, the distance between `Bruce` and `Vin` is 8. Same goes for `Willis`and `Diesel`.

### Numeric types

### Boolean

### Array

### Object

JSON objects are written in key/value pairs and surrounded by curly braces.

### null type
