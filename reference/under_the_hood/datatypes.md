# Data types

This guide describes the different data types supported for the fields in a document and how MeiliSearch handles them.

No matter the type, the value of a field will remain unchanged in the returned documents upon search.
For example, if you have a complex field with nested objects, this field will be returned with the same complexity upon search.

Based on their type, however, the fields will be handled and used in different ways by MeiliSearch. **The type affects how a field is used for search results**.

Types:

- [String](/reference/under_the_hood/datatypes.md#string)
- [Numeric types](/reference/under_the_hood/datatypes.md#numeric-type): `integer`, `float`
- [Boolean](/reference/under_the_hood/datatypes.md#boolean)
- [Array](/reference/under_the_hood/datatypes.md#array)
- [Object](/reference/under_the_hood/datatypes.md#object)
- [`null` type](/reference/under_the_hood/datatypes.md#null-type)

### String

String is the primary type for indexing data in MeiliSearch. It enables to create the content in which to search. Strings are processed as detailed below.

> String tokenization is the process of splitting a string into a list of individual terms that are called tokens.

A string is passed to a tokenizer and is then broken into separate string tokens. A token is a **word**.

- For Latin-based languages, the words are separated by **space**.
- For Kanji characters, the words are separated by **character**.

For Latin-based languages, there are two kinds of **space separators**:

- **Soft spaces** (distance: 1): whitespaces, quotes, `'-' | '_' | '\'' | ':' | '/' | '\\' | '@' | '"' | '+' | '~' | '=' | '^' | '*' | '#'`
- **Hard spaces** (distance: 8): `'.' | ';' | ',' | '!' | '?' | '(' | ')' | '[' | ']' | '{' | '}'| '|'`

Distance plays an essential role in determining whether documents are relevant since [one of the ranking rules is the **proximity** rule](/learn/core_concepts/relevancy.md). The proximity rule sorts the results by increasing distance between matched query terms. Then, two words separated by a soft space are closer and thus considered **more relevant** than two words separated by a hard space.

After the tokenizing process, each word is indexed and stored in the global dictionary of the corresponding index.

#### Examples

To demonstrate how a string is split by space, let's say you have the following string as an input:

```
"Bruce Willis,Vin Diesel"
```

In the example above, the distance between `Bruce` and `Willis` is equal to **1**. The distance between `Vin` and `Diesel` is equal to **1** too.
But, the distance between `Bruce` and `Vin` is equal to **8**. The same goes for `Bruce` and `Diesel`, or `Willis` and `Vin`, or also `Willis` and `Diesel`.

Let's see another example. Given two documents:

```json
[
  {
    "movie_id": "001",
    "description": "Bruce.Willis"
  },
  {
    "movie_id": "002",
    "description": "Bruce super Willis"
  }
]
```

When making a query on `Bruce Willis`, `002` will be the first document returned and `001` will be the second one.
This will happen because the proximity distance between `Bruce` and `Willis` is equal to **2** in the document `002` whereas the distance between `Bruce` and `Willis` is equal to **8** in the document `001` since the full stop is a hard space.

### Numeric type

A numeric type (`integer`, `float`) is converted to a human-readable decimal number string representation. Numeric types can be searched as they are converted to strings.

You can add [custom ranking rules](/learn/core_concepts/relevancy.md#custom-rules) to create an ascending or descending sorting rule on a given attribute that has a numeric value in the documents.

You can also create [filters](/reference/features/filtering_and_faceted_search.md). The `>`, `>=`, `<`, and `<=` relational operators apply only to numerical values.

### Boolean

A Boolean value, which is either `true` or `false`, is received and converted to a lowercase human-readable text (i.e. `true` and `false`). Booleans can be searched as they are converted to strings.

### Array

An array represents a collection of elements that can be strings or arrays for instance. An array is recursively broken into separate string tokens, which means separate words.

After the tokenizing process, each word is indexed and stored in the global dictionary of the corresponding index.

#### Examples

The following input:

```json
[
  [
    "Bruce Willis",
    "Vin Diesel"
  ],
  "Kung Fu Panda"
]
```

Will be processed as if all elements were arranged at the same level:

```json
"Bruce Willis. Vin Diesel. Kung Fu Panda."
```

The strings above will be separated by soft and hard spaces exactly as explained in the [string example](/reference/under_the_hood/datatypes.md#examples).

### Object

JSON objects are written in key/value pairs and surrounded by curly braces. An object is broken into separate string tokens, which means separate words.

After the tokenizing process, each word is indexed and stored in the global dictionary of the corresponding index.

#### Example

```json
{
  "movie_id": "1564saqw12ss",
  "title": "Kung fu Panda"
}
```

In the example above, `movie_id`, `1564saqw12ss`, `title`, `Kung fu Panda` are all considered as sentences. The colon `:` and comma `,` characters are used as separators.

```json
"movie_id. 1564saqw12ss. title. Kung fu Panda."
```

These sentences will be separated by soft and hard spaces exactly as explained in the [string example](/reference/under_the_hood/datatypes.md#examples).

### null type

The `null` type can be pushed into MeiliSearch but it **won't be taken into account for indexing**.

## Possible tokenization issues

Even if it behaves exactly as expected, the tokenization process may make less sense in some cases such as:

```
"S.O.S"
"George R. R. Martin"
10,3
```

For the two strings above, the full stops `.` will be considered as hard spaces.
`10,3` will be broken into two strings `10` and `3` instead of being processed as a numeric type.
