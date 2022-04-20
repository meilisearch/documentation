# Data types

This article describes how Meilisearch handles the different types of data in your documents. The behavior described here concerns only Meilisearch's internal processes and can be helpful in understanding how the tokenizer works, but keep in mind that **the value of a field remains unchanged in returned documents**. For example, if a document contains a nested object, this value will keep the exact same structure upon search.

[[toc]]

## String

String is the primary type for indexing data in Meilisearch. It enables to create the content in which to search. Strings are processed as detailed below.

String tokenization is the process of **splitting a string into a list of individual terms that are called tokens.**

A string is passed to a tokenizer and is then broken into separate string tokens. A token is a **word**.

- For Latin-based languages, the words are separated by **space**.
- For Kanji characters, the words are separated by **character**.

For Latin-based languages, there are two kinds of **space separators**:

- **Soft spaces** (distance: 1): whitespaces, quotes, `'-' | '_' | '\'' | ':' | '/' | '\\' | '@' | '"' | '+' | '~' | '=' | '^' | '*' | '#'`
- **Hard spaces** (distance: 8): `'.' | ';' | ',' | '!' | '?' | '(' | ')' | '[' | ']' | '{' | '}'| '|'`

Distance plays an essential role in determining whether documents are relevant since [one of the ranking rules is the **proximity** rule](/learn/core_concepts/relevancy.md). The proximity rule sorts the results by increasing distance between matched query terms. Then, two words separated by a soft space are closer and thus considered **more relevant** than two words separated by a hard space.

After the tokenizing process, each word is indexed and stored in the global dictionary of the corresponding index.

### Examples

To demonstrate how a string is split by space, let's say you have the following string as an input:

```
"Bruce Willis,Vin Diesel"
```

In the example above, the distance between `Bruce` and `Willis` is equal to **1**. The distance between `Vin` and `Diesel` is also **1**. However, the distance between `Bruce` and `Vin` is equal to **8**. The same goes for `Bruce` and `Diesel`, or `Willis` and `Vin`, or also `Willis` and `Diesel`.

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

When making a query on `Bruce Willis`, `002` will be the first document returned and `001` will be the second one. This will happen because the proximity distance between `Bruce` and `Willis` is equal to **2** in the document `002` whereas the distance between `Bruce` and `Willis` is equal to **8** in the document `001` since the full stop is a hard space.

## Numeric

A numeric type (`integer`, `float`) is converted to a human-readable decimal number string representation. Numeric types can be searched as they are converted to strings.

You can add [custom ranking rules](/learn/core_concepts/relevancy.md#custom-rules) to create an ascending or descending sorting rule on a given attribute that has a numeric value in the documents.

You can also create [filters](/learn/advanced/filtering_and_faceted_search.md). The `>`, `>=`, `<`, and `<=` relational operators apply only to numerical values.

## Boolean

A Boolean value, which is either `true` or `false`, is received and converted to a lowercase human-readable text (i.e. `true` and `false`). Booleans can be searched as they are converted to strings.

## Object

JSON objects are written in key/value pairs and surrounded by curly braces. When parsing simple non-nested objects, Meilisearch flattens the object, converting both key and value into strings.

### Example

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

These sentences will be separated by soft and hard spaces exactly as explained in the [string example](/learn/advanced/datatypes.md#examples).

### Nested objects

An object can also contain other objects, creating nested structures of objects within objects. In these cases, Meilisearch first eliminates nesting, then proceeds to flatten the object as usual.

In the example below, the `patient_name` key contains an object:

```json
{
  "id": 0,
  "patient_name": {
    "forename": "Imogen",
    "surname": "Temult"
  }
}
```

Meilisearch uses dot notation to eliminate nesting:

```json
{
  "id": 0,
  "patient_name.forename": "Imogen",
  "patient_name.surname": "Temult",
}
```

Once that is done, the object can be flattened into a string:

```json
"id: 0, patient_name.forename: Imogen, patient_name.surname: Temult"
```

This behavior remains the same regardless of nesting depth.

Meilisearch also eliminates nesting in arrays of objects. In this case, values are grouped by key:

```json
{
  "id": 0,
  "patient_name": "Imogen Temult",
  "appointments": [
    {
      "date": "2022-01-01",
      "doctor": "Jester Lavorre",
      "ward": "psychiatry"
    },
    {
      "date": "2019-01-01",
      "doctor": "Dorian Storm"
    },
  ]
}
```

Would be parsed as:

```json
{
  "id": 0,
  "patient_name": "Imogen Temult",
  "appointments.date": ["2022-01-01", "2019-01-01"],
  "appointments.doctor": ["Jester Lavorre", "Dorian Storm"],
  "appointments.ward": ["psichiatry"]
}
```

This flattened object is an intermediary representation of Meilisearch's inner workings to facilitate indexation. During search, the returned document will keep its original structure.

## `null`

The `null` type can be pushed into Meilisearch but it **won't be taken into account for indexing**.

## Array

An array is an ordered list of values. These values can be of any type: numbers, strings, booleans, objects, or even other arrays.

Meilisearch flattens arrays and concatenates them into strings. Non-string values are converted as described in this article's previous sections.

### Example

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

Once the above array has been flattened, it will be parsed exactly as explained in the [string example](/learn/advanced/datatypes.md#examples).


## Possible tokenization issues

Even if it behaves exactly as expected, the tokenization process may lead to unintuitive results in some cases, such as:

```
"S.O.S"
"George R. R. Martin"
10,3
```

For the two strings above, the full stops `.` will be considered as hard spaces.

`10,3` will be broken into two strings—`10` and `3`—instead of being processed as a numeric type.
