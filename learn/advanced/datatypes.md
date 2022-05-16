# Data types

This article explains how Meilisearch handles the different types of data in your dataset.

**The behavior described here concerns only Meilisearch's internal processes** and can be helpful in understanding how the tokenizer works. Document fields remain unchanged for most practical purposes not related to Meilisearch's inner workings.

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

When making a query on `Bruce Willis`, `002` will be the first document returned, and `001` will be the second one. This will happen because the proximity distance between `Bruce` and `Willis` is equal to **2** in the document `002`, whereas the distance between `Bruce` and `Willis` is equal to **8** in the document `001` since the full-stop character `.` is a hard space.

## Numeric

A numeric type (`integer`, `float`) is converted to a human-readable decimal number string representation. Numeric types can be searched as they are converted to strings.

You can add [custom ranking rules](/learn/core_concepts/relevancy.md#custom-rules) to create an ascending or descending sorting rule on a given attribute that has a numeric value in the documents.

You can also create [filters](/learn/advanced/filtering_and_faceted_search.md). The `>`, `>=`, `<`, and `<=` relational operators apply only to numerical values.

## Boolean

A Boolean value, which is either `true` or `false`, is received and converted to a lowercase human-readable text (i.e. `true` and `false`). Booleans can be searched as they are converted to strings.

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

## Objects

When a document field contains an object, Meilisearch flattens it and brings the object's keys and values to the root level of the document itself.

Keep in mind that the flattened objects represented here are an intermediary snapshot of internal processes. When searching, the returned document will keep its original structure.

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

During indexation, Meilisearch uses dot notation to eliminate nested fields:

```json
{
  "id": 0,
  "patient_name.forename": "Imogen",
  "patient_name.surname": "Temult",
}
```

Using dot notation, no information is lost when flattening nested objects, regardless of nesting depth.

Imagine that the example document above includes an additional object, `address`, containing home and work addresses, each of which are objects themselves. After flattening, the document would look like this:

```json
{
  "id": 0,
  "patient_name.forename": "Imogen",
  "patient_name.surname": "Temult",
  "address.home.street": "Largo Isarco, 2",
  "address.home.postcode": "20139",
  "address.home.city": "Milano",
  "address.work.street": "Ca' Corner Della Regina, 2215",
  "address.work.postcode": "30135",
  "address.work.city": "Venezia",
}
```

Meilisearch's internal flattening process also eliminates nesting in arrays of objects. In this case, values are grouped by key. Consider the following document:

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

After flattening, it would look like this:

```json
{
  "id": 0,
  "patient_name": "Imogen Temult",
  "appointments.date": [
    "2022-01-01",
    "2019-01-01"
  ],
  "appointments.doctor": [
    "Jester Lavorre",
    "Dorian Storm"
  ],
  "appointments.ward": [
    "psychiatry"
  ]
}
```

Once all objects inside a document have been flattened, Meilisearch will continue processing it as described in the previous sections. For example, arrays will be flattened, and numeric and boolean values will be turned into strings.

## Possible tokenization issues

Even if it behaves exactly as expected, the tokenization process may lead to unintuitive results in some cases, such as:

```
"S.O.S"
"George R. R. Martin"
10,3
```

For the two strings above, the full stops `.` will be considered as hard spaces.

`10,3` will be broken into two strings—`10` and `3`—instead of being processed as a numeric type.
