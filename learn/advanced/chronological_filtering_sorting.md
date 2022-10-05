# Filtering and sorting with chronological values

In this guide, you will learn about Meilisearch's approach to date and time values, how to prepare your dataset for indexing, and how to chronologically sort and filter search results.

## Preparing your documents

To filter and sort search results based on chronological values, your documents must have a numeric field containing a UNIX timestamp. In this videogames dataset, the release year is formatted as a timestamp:

```json
[
  {
    "id": 0,
    "title": "Return of the Obra Dinn",
    "genre": "adventure",
    "release_date": 1514761200
  },
  {
    "id": 1,
    "title": "The Excavation of Hob's Barrow",
    "genre": "adventure",
    "release_date": 1640991600
  },
  {
    "id": 2,
    "title": "Bayonetta 2",
    "genre": "action",
    "release_date": 1388530800
  }
]
```

If your chronological data is expressed in datetime formats such as ISO 8601 like `"2022-01-01"`, you must convert it to a numeric value before indexing it with Meilisearch.

Most programming languages have built-in tools to help you with this process:

```js
let game = {
  "id": 0,
  "title": "Return of the Obra Dinn",
  "genre": "adventure",
  "year": 2018
};

const timestamp = Date.parse(game.year);

game = {
  "id": 0,
  "title": "Return of the Obra Dinn",
  "genre": "adventure",
  "year": 2018,
  "release_date": timestamp
};
```

:::tip
When preparing your dataset, it can be useful to leave the date and time fields in your documents intact. In the example above, we keep the `year` field because it is more readable than the raw `timestamp`.
:::

After adding a numeric timestamp to all documents, index your dataset as usual.

## Chronological filtering

To filter search results, add your document's timestamp field to the `filterableAttributes` index setting:

```sh
curl \
  -X PUT 'http://localhost:7700/indexes/games/settings/filterable-attributes' \
  -H 'Content-Type: application/json' \
  --data-binary '[
    "release_date"
  ]'
```

Once you have configured `filterableAttributes`, you can filter your search results chronologically. The following query only returns games released between 2018 and 2022:

```sh
curl \
  -X POST 'http://localhost:7700/indexes/games/search' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "q": "",
    "filter": "release_date >= 1514761200 AND release_date < 1672527600"
  }'
```

## Chronological sorting

To sort search results chronologically, add your document's timestamp field to the `sortableAttributes` index setting:

```sh
curl \
  -X PUT 'http://localhost:7700/indexes/games/settings/sortable-attributes' \
  -H 'Content-Type: application/json' \
  --data-binary '[
    "release_date"
  ]'
```

Once you have configured `sortableAttributes`, you can sort your search results chronologically. The following query returns all `adventure` games ordered from the newest to oldest release date:

```sh
curl \
  -X POST 'http://localhost:7700/indexes/games/search' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "q": "adventure",
    "sort": ["release_date:desc"]
  }'
```
