# Filtering

When searching for documents, it is sometimes desired to filter through the results based on criteria, to provide the user with the most relevant response possible.

Meilisearch allows you to define filters thanks to a **very simple query language**. Once defined, you can pass your filter to your search query, as a parameter.

### Using Filters

In order to apply filtering to a search, simply add a filter expression to the `filter` query parameter of your search. More on search query parameters [here](https://docs.meilisearch.com/references/search.html#query-parameters)

### The Query Language

In itself the query language is very simple, and allows you to filter results on any document field. For now it only allows you to query on fields that are either `number`, `boolean`, or `string`

### Conditions

Conditions are the primitives of query filters. They are composed of three mandatory parameters `field OP value` where:

- `field` refers to the document **attribute** to filter on. (_e.g_ id, title...). It is either a single alphanumeric word or a quoted string: `"movie title"`, and `release_date` are both valid `field`.
- `OP` is the comparison operator, it can be one of `=`, `!=`, `>`, `>=`, `<`, or `<=`. `value` is the test condition for which the filter shall filter upon.
- `value` is the test condition for which the filter shall filter upon.

The `=` and `!=` operators check for equality and difference. For strings, they are both **case insensitive**:

```SQL
title = "american ninja" // matches "American Ninja"
```

::: note
`string` values are either double-quoted, single-quoted or a single unquoted word: `title = "Scream"`, `title = 'Scream'` and `title = Scream` are all valid syntaxes, `title = The Avengers` is not.
:::

The `>`, `>=`, `<`, and `<=` apply **only to numerical values**, and behave the standard way.

::: warning
As no specific schema is enforced at indexing, the filtering engine will try to coerce the type of `value`. This can lead to undefined behaviour when big floats are coerced into integers and reciprocally. For this reason, it is best to have homogeneous typing across fields, especially if numbers tend to become large.
:::

### Expressions

The simplest form of expressions are conditions. New expressions are created either by connecting other expressions together with logical connectives, or by grouping expressions with parentheses, _e.g_:

```SQL
title = Scream // a condition is an expression
title = Scream OR title = "The Avengers" // also an expression
(title = Scream OR title = "The Avengers") // use parentheses to isolate an expression
NOT (title = Scream OR title = "The Avengers") // negate the whole expression
rating >= 3 AND (NOT (title = Scream OR title = "The Avengers")) // and so on...
```

### Logical Connectives

An arbitrary number of expressions can be connected together thanks to logical connectives. These connectives are:

- `NOT` negates the following expression, _e.g._ `NOT title = Scream`.
- `OR` performs a logical 'or' between two expressions, _e.g._ `title = Scream OR title = "the avengers"`
- `AND` performs a logical 'and' between two expressions, _e.g._ `title = Dumbo AND title = "Tim Burton"`

::: note
`NOT` has the highest precedence, this means that `NOT title = Scream OR title = "The Avengers"` is effectively evaluated `(NOT title = Scream) OR title = "The Avengers"`. `AND` precedence is lower than `NOT` and higher than `OR`.
:::

### A Note on Performance

MeiliSearch is intended to be a flexible tool. For this reason, we decided not to put any restrictions on which fields the user can filter on, nor on how the queries are built. It is important to understand that it can lead to performance issues in some cases. We are currently working on new features to address this issue, such as [faceting](https://en.wikipedia.org/wiki/Faceted_search) to allow you to efficiently narrow down the number of candidates to a query, and thus improving performances of plain filters, even in worst cases.

Also consider that `OR` and `AND` are left associative, meaning that the left-hand side is always evaluated first. If the left-hand side of an `OR` is `true` or the left-hand side of a `AND` is `false`, then the right-hand side won't be evaluated. You can sometimes get performance improvements by building your queries in such a way that the right-hand side of a connective is evaluated only when necessary.

### Examples

Suppose that you have a collection of movies, in the following JSON format:

```json
[
	{
		"id": "495925",
		"title": "Doraemon the Movie:Nobita's Treasure Island",
		"director": "Fujiko Fujio",
		"poster": "https://image.tmdb.org/t/p/w1280/cmJ71gdZxCqkMUvGwWgSg3MK7pC.jpg",
		"overview": "The story is based on Robert Louis Stevenson's Treasure Island novel.",
		"release_date": 1520035200
	},
	{
		"id": "329996",
		"title": "Dumbo",
		"director": "Tim Burton",
		"poster": "https://image.tmdb.org/t/p/w1280/279PwJAcelI4VuBtdzrZASqDPQr.jpg",
		"overview": "A young elephant, whose oversized ears enable him to fly, helps...",
		"release_date": 1553644800
	},
	{
		"id": "299536",
		"title": "Avengers:Infinity War",
		"director": "Joe Russo",
		"poster": "https://image.tmdb.org/t/p/w1280/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
		"overview": "As the Avengers and their allies have continued to protect...",
		"release_date": 1524618000
	},
	{
		"id": "458723",
		"title": "Us",
		"director": "Jordan Peele",
		"poster": "https://image.tmdb.org/t/p/w1280/ux2dU1jQ2ACIMShzB3yP93Udpzc.jpg",
		"overview": "Husband and wife Gabe and Adelaide Wilson take their...",
		"release_date": 1552521600
	},
	...
]
```

Say you want to only show to your user movies that were released after a certain date, then you can use the following filter:

```SQL
release_date > 795484800 // march 18, 1995
```

Now imagine that we want only the movies released after the 18 of march 1995, and directed by either Jordan Peel or Tim Burton, then you would use this filter:

```SQL
release_date > 795484800 AND (director = "Tim Burton" OR director = "Jordan Peel")
```

Note that filtering on string is case insensitive. Here, the parentheses are mandatory, as `AND` has a higher precedence.

Finally, imagine that you want to filter on "id". You would probably do this:

```SQL
id = "299536"
```

However, this would be a very bad idea. `id` uniquely identifies a movie. Therefore, only one document can match the user query. The filtering engine would have to search through all candidate documents to find the only possible match. This would be highly inefficient and should be avoided. We are currently working on a [faceted search](https://en.wikipedia.org/wiki/Faceted_search) feature, especially optimized for this kind of need. It is important to understand that filtering and querying don't have the same performances.
