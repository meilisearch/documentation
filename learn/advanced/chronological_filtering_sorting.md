# Filtering and sorting by date

In this guide, you will learn about Meilisearch's approach to date and time values, how to prepare your dataset for indexing, and how to chronologically sort and filter search results.

## Preparing your documents

To filter and sort search results chronologically, your documents must have at least one numeric field containing a [UNIX timestamp](https://kb.narrative.io/what-is-unix-time).

As an example, consider a database of video games. In this dataset, the release year is formatted as a timestamp:

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

If your chronological data is expressed in another format, like [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html), you must convert it to a numeric value before indexing it with Meilisearch.

Most programming languages have built-in tools to help you with this process. The JavaScript example below converts a game's release year, `2018`, to a numeric timestamp:

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
When preparing your dataset, it can be useful to leave the original date and time fields in your documents intact. In the example above, we keep the `year` field because it is more readable than the raw `timestamp`.
:::

After adding a numeric timestamp to all documents, [index your data](/reference/api/documents.md#add-or-replace-documents) as usual. See below for an example using our nonexistent video games dataset.

```sh
curl \
  -X POST 'http://localhost:7700/indexes/games/documents' \
  -H 'Content-Type: application/json' \
  --data-binary @games.json
```

## Filtering by timestamp

To filter search results based on their timestamp, add your document's timestamp field to the list of [`filterableAttributes`](/reference/api/settings.md#update-filterable-attributes):

```sh
curl \
  -X PUT 'http://localhost:7700/indexes/games/settings/filterable-attributes' \
  -H 'Content-Type: application/json' \
  --data-binary '[
    "release_date"
  ]'
```

Once you have configured `filterableAttributes`, you can filter search results by date. The following query only returns games released between 2018 and 2022:

```sh
curl \
  -X POST 'http://localhost:7700/indexes/games/search' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "q": "",
    "filter": "release_date >= 1514761200 AND release_date < 1672527600"
  }'
```

## Sorting by timestamp

To sort search results chronologically, add your document's timestamp field to the list of [`sortableAttributes`](/reference/api/settings.md#update-sortable-attributes):

```sh
curl \
  -X PUT 'http://localhost:7700/indexes/games/settings/sortable-attributes' \
  -H 'Content-Type: application/json' \
  --data-binary '[
    "release_date"
  ]'
```

Once you have configured `sortableAttributes`, you can sort your search results based on their timestamp. The following query returns all games sorted from most recent to oldest:

```sh
curl \
  -X POST 'http://localhost:7700/indexes/games/search' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "q": "",
    "sort": ["release_date:desc"]
  }'
```
