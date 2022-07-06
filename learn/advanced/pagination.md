# Search result pagination

In a perfect world, users would not need to look beyond the first search result to find what they were looking for. In practice, however, it is usually necessary to create some kind of pagination interface to browse through long lists of results.

In this guide, we will discuss some of Meilisearch's current limitations, how these limitations impact common pagination interface patterns, and the recommended way of handling pagination when using Meilisearch.

## Choosing the right pagination UI

There are quite a few pagination interfaces you might want to implement in your application. Many common UI patterns have a page selector allowing users to jump to any search results page. To create a page selector, you must know the exact number of total results so you can calculate the precise number of result pages.

For performance reasons, however, Meilisearch cannot provide the exact number of results for a query. Instead, when using the [search endpoint](/reference/api/search.md), responses contain an `estimatedTotalHits` field. As its name indicates, `estimatedTotalHits` is only an estimate of how many documents match your user's query.

Because of this, we do not recommend creating interfaces with page selectors. If page selection is crucial to the software you are developing, see the [last section of this page](#not-recommended-page-selection) for tips that might help you work around Meilisearch's current limitations.

Many other pagination UIs are fully compatible with Meilisearch, such as infinite scrolling and buttons that manually load more results on click. For an experience similar to page selection, we recommend creating pagination interfaces centered around [previous and next buttons](#recommended-previous-and-next-buttons).

## Recommended: Previous and next buttons

Using previous and next buttons for pagination means that users can easily navigate through results, but don't have the ability to jump to an arbitrary results page.

![Placeholder image for prev/next interface]()

Though this approach offers less precision than a full-blown page selector, it does not require knowing the precise number of search results. This makes it a good fit for Meilisearch's current capabilities.

### Implementation

#### `limit` and `offset`

Previous and next buttons can be implemented using the [`limit`](/reference/api/search.md#limit) and [`offset`](/reference/api/search.md#offset) search parameters.

`limit` sets the size of a page. If you set `limit` to `10`, Meilisearch's response will contain a maximum of 10 search results. `offset` skips a number of search results. If you set `offset` to `20`, Meilisearch's response will skip the first 20 search results.

For example, you can use Meilisearch's JavaScript SDK to get the first ten films in a movies database:

```js
const results = await index.search("tarkovsky", { limit: 10, offset: 0 });
```

You can use both parameters together to effectively create search pages.

#### Search pages and calculating `offset`

If you set `limit` to `20` and `offset` to `0`, you get the first twenty search results. We can call this our first page.

```js
const results = await index.search("tarkovsky", { limit: 20, offset: 0 });
```

Likewise, if you set `limit` to `20` and `offset` to `40`, you skip the first 40 search results and get documents ranked from 40 through 59. We can call this the third results page.

```js
const results = await index.search("tarkovsky", { limit: 20, offset: 40 });
```

Use this formula to quickly calculate a page's offset value: `offset = limit * (target page number - 1)`.

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

## Not recommended: Page selection

This type of pagination consists of a numbered list of pages accompanied by next and previous buttons.

![placeholder page selection UI](https://vuejsexamples.com/content/images/2018/11/vue-pagination.gif)

This is a common UI pattern that offers users a significant amount of precision when navigating results. However, due to Meilisearch's [limitations](#choosing-the-right-pagination-ui), it is not a good fit for pagination with Meilisearch.

### Implementation

The general implementation of a page selection interface is similar to our [recommended solution](#recommended-previous-and-next-buttons), but also includes a numbered page list.

To create a numbered page list, however, you must know the exact number of total results. For example, if you have 100 results and your search result pages contain 10 results each, your selector must show a list of numbers going from 1 to 10.

Since Meilisearch can only give you an estimate of total search results, it is difficult to implement page selectors when using Meilisearch.

We recommend two different workarounds to create this kind of pagination interface with Meilisearch.

#### Use `limit` to set a maximum number of search results

By default, a search request returns 20 search results. You can change this value to a much higher number and treat it as the effective maximum of search results you will show a user. Doing so means the size of your `hits` array is the exact number of search results you have to paginate.

For example, if you set `limit` to `300`, every search request made to Meilisearch returns at most 300 documents. If a query returns a `hits` array with 200 items and you want each page to display 20 results, you can create a page selector with 10 pages.

In the following JavaScript snippet, each time a user searches, we make a new query with `limit` set to `300`. Once we receive the search results, we store them in a variable and create a list of numbered pages. When users click on any number in the page list, we display a new page:

```js
// Retrieve search results and create the page selector
function getSearchResults(searchTerm) {
  // The amount of results we want to display in each page
  const hitsPerPage = 10

  // The maximum amount of results we will display
  const { hits } = await index.search(searchTerm, { limit: 300 })

  // Clear the previous buttons…
  const pagination = document.querySelector('.pagination')
  pagination.innerHTML = ''

  // …and create a new button for each search results page
  for (let page = 0; page < hits.length; page += hitsPerPage) {
    const numberBtn = document.createElement('button');
    numberBtn.innerText = page / hitsPerPage

    // When the user clicks on a page number, show that results page
    numberBtn.onclick = function () { 
      const pageNumber = parseInt(this.innerText)
      changePage(pageNumber, hits, hitsPerPage)
    }

    pagination.appendChild(numberBtn)
  }

  // Display first search results page
  changePage(1, hits, hitsPerPage)
}

// Display a page of search results
function changePage(pageNumber, hits, hitsPerPage) {
  const offset = (pageNumber - 1) * hitsPerPage
  const paginatedHits = hits.slice(offset, offset + hitsPerPage)
  const resultList = document.querySelector('.results')

  resultList.innerHTML = ''

  paginatedHits.map(hit => {
    const resultItem = document.createElement('div');
    resultItem.innerText = hit.title
    resultList.appendChild(resultItem)
  })
}

// Get the search bar and retrieve results every time the user makes a new query
const searchBar = document.querySelector('.searchBar')
searchBar.onChange(function () { getSearchResults('tarkovsky') })
```

This method provides control and reliability. It also prevents users from paginating too far, which might result in performance gains. However, it limits the number of results your users can see. Additionally, we recommend caution when setting high values for `limit` as it can negatively impact performance.

::: note
By default, Meilisearch returns a maximum of 1000 search results. Consult our [index setting reference](/reference/api/pagination.md#maxtotalhits-1) if you need to change this.
:::

#### Use `estimatedTotalHits`

Though we advise against it, you can use `estimatedTotalHits` to calculate the number of search result pages. This means your number of results and page count are likely to change until Meilisearch retrieves the last search result.

For example, a query's `estimatedTotalHits` might be `100` when you fetch the first page of search results. If you are showing 20 results per page, this means your interface will display a page selector with 5 pages. When you fetch the fifth and last page according to Meilisearch's current estimate, however, `estimatedTotalHits` might change to `300`. Your page list, previously displaying 5 pages, must now show 10 total pages.

This method gives users access to all search results. However, it also results in an interface that might feel unreliable due to constant and unpredictable changes.

## Unsatisfied? Let us know

Is the current state of pagination in Meilisearch negatively impacting you? Please share your thoughts with us in this [GitHub discussion](https://github.com/meilisearch/product/discussions/483). We are actively working on improving this aspect of Meilisearch and your input is greatly appreciated.
