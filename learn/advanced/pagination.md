# Search result pagination

In a perfect world, users would not need to look beyond the first search result to find what they were looking for. In practice, however, it is usually necessary to create some kind of pagination interface to browse through long lists of results.

In this guide, we discuss two different approaches to pagination supported by Meilisearch: one using `offset` and `limit`, and another using `hitsPerPage` and `page`.

## Choosing the right pagination UI

There are many UI patterns that help your users navigate through search results. One common and efficient solution in Meilisearch is using `offset` and `limit` to create interfaces centered around ["Previous" and "Next" buttons](#previous-and-next-buttons).

Other solutions, such as [creating a page selector](/learn/advanced/pagination.md#numbered-page-selectors) allowing users to jump to any search results page, make use of `hitsPerPage` and `page` to obtain the exhaustive total number of matched documents.

Whatever UI you choose, there is a limited maximum number of search results Meilisearch will return for any given query. You can use [the `maxTotalHits` index setting](/reference/api/settings.md#pagination) to configure this, but be aware that higher limits may negatively impact search performance.

## "Previous" and "Next" buttons

Using "Previous" and "Next" buttons for pagination means that users can easily navigate through results, but don't have the ability to jump to an arbitrary results page.

Though this approach offers less precision than a full-blown page selector, it does not require knowing the exact number of search results. Since calculating the exhaustive number of documents matching a query is a resource-intensive process, interfaces like this might offer better performance.

### Implementation

To implement this interface in a website or application, we make our queries with the `limit` and `offset` search parameters. Response bodies will include an `estimatedTotalHits` field, containing a partial count of search results. This is Meilisearch's default behavior:

```json
{
  "hits": [
    …
  ],
  "query": "",
  "processingTimeMs": 15,
  "limit": 10,
  "offset": 0,
  "estimatedTotalHits": 471
}
```

#### `limit` and `offset`

"Previous" and "Next" buttons can be implemented using the [`limit`](/reference/api/search.md#limit) and [`offset`](/reference/api/search.md#offset) search parameters.

`limit` sets the size of a page. If you set `limit` to `10`, Meilisearch's response will contain a maximum of 10 search results. `offset` skips a number of search results. If you set `offset` to `20`, Meilisearch's response will skip the first 20 search results.

For example, you can use Meilisearch's JavaScript SDK to get the first ten films in a movies database:

```js
const results = await index.search("tarkovsky", { limit: 10, offset: 0 });
```

You can use both parameters together to create search pages.

#### Search pages and calculating `offset`

If you set `limit` to `20` and `offset` to `0`, you get the first twenty search results. We can call this our first page.

```js
const results = await index.search("tarkovsky", { limit: 20, offset: 0 });
```

Likewise, if you set `limit` to `20` and `offset` to `40`, you skip the first 40 search results and get documents ranked from 40 through 59. We can call this the third results page.

```js
const results = await index.search("tarkovsky", { limit: 20, offset: 40 });
```

You can use this formula to calculate a page's offset value: `offset = limit * (target page number - 1)`. In the previous example, the calculation would look like this: `offset = 20 * (3 - 1)`. This gives us `40` as the result: `offset = 20 * 2 = 40`.

Once a query returns fewer `hits` than your configured `limit`, you have reached the last results page.

#### Keeping track of the current page number

Even though this UI pattern does not allow users to jump to a specific page, it is still useful to keep track of the current page number.

The following JavaScript snippet stores the page number in an HTML element, `.pagination`, and updates it every time the user moves to a different search results page:

```js
function updatePageNumber(elem) {
  const directionBtn = elem.id
  // Get the page number stored in the pagination element
  let pageNumber = parseInt(document.querySelector('.pagination').dataset.pageNumber)

  // Update page number
  if (directionBtn === 'previous_button') {
    pageNumber = pageNumber - 1
  } else if (directionBtn === 'next_button') {
    pageNumber = pageNumber + 1
  }

  // Store new page number in the pagination element
  document.querySelector('.pagination').dataset.pageNumber = pageNumber
}

// Add data to our HTML element stating the user is on the first page
document.querySelector('.pagination').dataset.pageNumber = 0
// Each time a user clicks on the previous or next buttons, update the page number 
document.querySelector('#previous_button').onclick = function () { updatePageNumber(this) }
document.querySelector('#next_button').onclick = function () { updatePageNumber(this) }
```

#### Disabling navigation buttons for first and last pages

It is often helpful to disable navigation buttons when the user cannot move to the "next" or "previous" page.

The "Previous" button should be disabled whenever your `offset` is `0`, as this indicates your user is on the first results page.

To know when to disable the "Next" button, we recommend setting your query's `limit` to the number of results you wish to display per page plus one. That extra `hit` should not be shown to the user. Its purpose is to indicate that there is at least one more document to display on the next page.

The following JavaScript snippet runs checks whether we should disable a button every time the user navigates to another search results page:

```js
function updatePageNumber() {
  const pageNumber = parseInt(document.querySelector('.pagination').dataset.pageNumber)

  const offset = pageNumber * 20
  const results = await index.search('x', { limit: 21, offset })

  // If offset equals 0, we're on the first results page
  if (offset === 0 ) {
    document.querySelector('#previous_button').disabled = true;
  } 

  // If offset is bigger than 0, we're not on the first results page
  if (offset > 0 ) {
    document.querySelector('#previous_button').disabled = false;
  }

  // If Meilisearch returns 20 items or less, 
  // we are on the last page
  if (results.hits.length < 21 ) {
    document.querySelector('#next_button').disabled = true;
  } 

  // If Meilisearch returns exactly 21 results
  // and our page can only show 20 items at a time,
  // we have at least one more page with one result in it
  if (results.hits.length === 21 ) {
    document.querySelector('#next_button').disabled = false;
  }
}

document.querySelector('#previous_button').onclick = function () { updatePageNumber(this) }
document.querySelector('#next_button').onclick = function () { updatePageNumber(this) }
```

## Numbered page selectors

This type of pagination consists of a numbered list of pages accompanied by "Next" and "Previous" buttons. This is a common UI pattern that offers users a significant amount of precision when navigating results.

Calculating the total amount of search results for a query is a resource-intensive process. Because of that, page selectors might lead to slower interfaces.

### Implementation

By default, Meilisearch queries only return `estimatedTotalHits`. This value is likely to change as a user navigates search results and should not be used to create calculate the number of search result pages.

When your query contains either [`hitsPerPage`](/reference/api/search.md#number-of-results-per-page), [`page`](/reference/api/search.md#page), or both these search parameters, Meilisearch returns `totalHits` and `totalPages` instead of `estimatedTotalHits`. `totalHits` contains the exhaustive number of results for that query, and `totalPages` contains the exhaustive number of pages of search results for the same query:

```json
{
  "hits": [
    …
  ],
  "query": "",
  "processingTimeMs": 35,
  "hitsPerPage": 20,
  "page": 1,
  "totalPages": 4,
  "totalHits": 100
}
```

#### Search pages with `hitsPerPage` and `page`

`hitsPerPage` defines the maximum number of search results on a page.

Since `hitsPerPage` defines the number of results on a page, it has a direct effect on the total number of pages for a query. For example, if a query returns 100 results, setting `hitsPerPage` to `25` means you will have four pages of search results. Settings `hitsPerPage` to `50`, instead, means you will have only two pages of search results.

The following example returns the first 25 search results for a query:

```js
const results = await index.search(
  "tarkovsky", 
  { 
    hitsPerPage: 25, 
  }
);
```

To navigate through pages of search results, use the `page` search parameter. If you set `hitsPerPage` to `25` and your `totalPages` is `4`, `page` `1` contains documents from 1 to 25. Setting `page` to `2` instead returns documents from 26 to 50:

```js
const results = await index.search(
  "tarkovsky", 
  { 
    hitsPerPage: 25, 
    page: 2 
  }
);
```

::: note
`hitsPerPage` and `page` take precedence over `offset` and `limit`. If a query contains either `hitsPerPage` or `page`, any values passed to `offset` and `limit` are ignored.
:::

#### Create a numbered page list

The `totalPages` field included in the response contains the exhaustive count of search result pages based on your query's `hitsPerPage`. Use this to create a numbered list of pages.

For ease of use, queries with `hitsPerPage` and `page` always return the current page number. This means you do not need to manually keep track of which page you are displaying.

In the following example, we create a list of page buttons dynamically and highlight the current page:

```js
const pageNavigation = document.querySelector('#page-navigation');
const listContainer = pageNavigation.querySelector('#page-list');
const results = await index.search(
  "tarkovsky", 
  { 
    hitsPerPage: 25, 
    page: 1 
  }
);

const totalPages = results.totalPages;
const currentPage = results.page;

for (let i = 0; i < totalPages; i += 1) {
  const listItem = document.createElement('li');
  const pageButton = document.createElement('button');

  pageButton.innerHTML = i;

  if (currentPage === i) {
    listItem.classList.add("current-page");
  }

  listItem.append(pageButton);
  listContainer.append(listItem);
}
```

#### Adding navigation buttons

Your users are likely to be more interested in the page immediately after or before the current search results page. Because of this, it is often helpful to add "Next" and "Previous" buttons to your page list.

In this example, we add these buttons as the first and last elements of our page navigation component:

```js
const pageNavigation = document.querySelector('#page-navigation');

const buttonNext = document.createElement('button');
buttonNext.innerHTML = 'Next';

const buttonPrevious = document.createElement('button');
buttonPrevious.innerHTML = 'Previous';

pageNavigation.prepend(buttonPrevious);
pageNavigation.append(buttonNext);
```

We can also disable them as required when on the first or last page of search results:

```js
buttonNext.disabled = results.page === results.totalPages;
buttonPrevious.disabled = results.page === 1;
```
