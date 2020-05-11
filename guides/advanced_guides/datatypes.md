# Data Types

This guide describes the different data types supported for the fields in a document and how MeiliSearch handles them.

No matter the type, the value of a field will remain unchanged in the returned documents upon search.
For example, if you have a complex field with nested objects, this field will be returned with the same complexity upon search.

Based on their type, however, the fields will be handled and used in different way by MeiliSearch. **The type affect how a field is used for search results**.

Types:

- [String](/guides/advanced_guides/datatypes.md#string)
- [Numeric types](/guides/advanced_guides/datatypes.md#numeric-types): `integer`, `float`
- [Boolean](/guides/advanced_guides/datatypes.md#boolean)
- [Array](/guides/advanced_guides/datatypes.md#array)
- [Object](/guides/advanced_guides/datatypes.md#object)
- [`null` type](/guides/advanced_guides/datatypes.md#null-type)

When documents are returned upon search, they contain [displayed fields](/guides/advanced_guides/field_properties.md#displayed-fields). The displayed values are always **returned unchanged**.

### String

> String tokenization is the process of splitting a string into a list of individual terms that are called tokens.

A string is passed to a tokenizer and is then broken into separate string tokens. Each word (token) is indexed and stored in the global dictionary of the corresponding index.

- For Latin-based languages, the words are separated by space.
- For Kanji characters, the words are separated by character.

There are two kinds of space separators:

- **Soft spaces** (distance: 1): whitespaces, quotes, `'-' | '_' | '\'' | ':' | '/' | '\\' | '@'`
- **Hard spaces** (distance: 8): `'.' | ';' | ',' | '!' | '?' | '(' | ')'`

#### Example

```
"Bruce Willis,Vin Diesel"
```

In the example above, the distance between `Bruce` and `Willis` is equal to **1**. The distance between `Vin` and `Diesel` is equal to **1** too.
But, the distance between `Bruce` and `Vin` is equal to **8**. The same goes for `Bruce` and `Diesel`, or `Vin` and `Willis`, or also `Willis` and `Diesel`.

### Numeric types

A numeric type (`integer`, `float`) is converted to a human-readable decimal number string representation.

### Boolean

A Boolean value, which is either `true` or `false`, is received and converted to a lowercase human-readable text.

### Array

An array represents a collection of elements that can be strings or arrays for instance. An array is recursively broken into separate string tokens.

#### Example

The following input:

```json
[["Bruce Willis", "Vin Diesel"], "Kung Fu Panda"]
```

Will be processed as if all elements were arranged at the same level:

```json
"Bruce Willis", "Vin Diesel", "Kung Fu Panda"
```

The strings above will be separated by soft and hard spaces exactly as explained in the [string example](/guides/advanced_guides/datatypes.md#example).

### Object

JSON objects are written in key/value pairs and surrounded by curly braces. An object is broken into separate string tokens.

#### Example

```json
{
  "movie_id": "1564saqw12ss",
  "title": "Kung fu Panda"
}
```

In the example above, `movie_id`, `1564saqw12ss`, `title`, `Kung fu Panda` are all considered as sentences. The colon `:` and comma `,` characters are used as separators.

These sentences will be separated by soft and hard spaces exactly as explained in the [string example](/guides/advanced_guides/datatypes.md#example).

### null type

The `null` type can be pushed into MeiliSearch but it won't be taken into account for indexing.

## Possible Tokenization Issues

Even if it behaves exactly as expected, the tokenization process may make less sense in some cases such as:

```
"S.O.S"
"George R. R. Martin"
10,3
```

For the two strings above, the full stops `.` will be considered as hard spaces.
`10,3` will be broken into two strings `10` and `3` instead of being processed as a numeric type.
