# Pagination of search results

In a perfect world, users would not need to look beyond the first search result to find what they were looking for. In practice, however, it is usually necessary to create some kind of pagination interface so users can browse through long lists of results.

In this guide, we will discuss some of Meilisearch's current limitations, how these limitations impact common pagination interface patterns, and the recommended way of handling pagination when using Meilisearch.

## Choosing the right pagination UI

For performance reasons, Meilisearch cannot provide the exact number of results for a query. When using the search endpoint, responses contain an `estimatedTotalHits` field. As its name indicates, `estimatedTotalHits` is only an estimate of how many documents match your user's query.

Because of this, we do not recommend creating interfaces with page selectors that allow users to jump to a specific page. If page selection is crucial to the software you are developing, see the [last section of this page](#not-recommended-page-selection) for tips that might help you work around Meilisearch's current limitations.

We recommend creating pagination interfaces centered around previous and next buttons.

::: note
By default, Meilisearch returns a maximum of 1000 search results. Consult our [index setting reference](/reference/api/settings.md) if you need to change this.
:::

## Recommended: Previous and next buttons

Using previous and next buttons for pagination means that users can easily page through results, but don't have the ability to jump to an arbitrary results page.

![Placeholder image for prev/next interface]()

Though this approach offers less precision than a full-blown page selector, it does not require knowing the precise number of search results. This makes it a good fit for Meilisearch's current capabilities.

### Implementation

Previous and next buttons can be implemented using the [`limit`](/reference/api/search.md#limit) and [`offset`](/reference/api/search.md#offset) search parameters.

Paginating requires providing an `offset` that is equal to your `limit` times the page number: `offset = limit * page number`. We recommend starting page count from 0 instead of 1 when calculating offset values.

For example, if you set `limit` to `20` and want the first page of search results, your `offset` must be 0: `offset = 0 * 20`.

```js
const results = await index.search("x", { limit: 20, offset: 0 });
```

If you want the third page of results, `offset` must be `40`: `offset = 2 * 20`.

```js
const results = await index.search("x", { limit: 20, offset: 40 });
```

Once a query returns fewer `hits` than your configured `limit`, you have reached the last results page.

It is often helpful to disable navigation buttons when the user cannot move to the "next" or "previous" page. The "previous" button should be disabled whenever your `offset` is 0.

To know when to disable the "next" button, we recommend setting your query's `limit` to the number of results you wish to display per page plus one. That extra `hit` should not be shown to the user; its purpose is to indicate that there is at least one more document to display on the next page:

```js
const results = await index.search("x", { limit: 21, offset: 0 })

if (offset === 0 ) {
  // If offset equals 0, we're on the first results page
  // and can disable the "previous" buttons
  document.querySelector("#previous_button").disabled = true;
} else {
  document.querySelector("#previous_button").disabled = false;
}

if (results.hits.length < 21 ) {
  // If Meilisearch returns 20 items or less, 
  // we don't have any more results to display
  // and can disable the "next" button
  document.querySelector("#next_button").disabled = true;
} else {
  // If Meilisearch returns exactly 21 results
  // and our page can only show 20 items at a time,
  // we have at least one more page with 1 result in it
  document.querySelector("#next_button").disabled = false;
}
```

## Not recommended: Page selection

This type of pagination consists of a numbered list of pages accompanied by next and previous buttons.

![placeholder page selection UI](https://vuejsexamples.com/content/images/2018/11/vue-pagination.gif)

This is a common UI pattern that offers users a significant amount of precision when navigating results. However, due to Meilisearch's [limitations](#choosing-the-right-pagination-ui), it is not a good fit for pagination with Meilisearch.

### Implementation

The general implementation of a page selection interface is similar to our [recommended solution](#recommended-previous-and-next-buttons), but also includes a numbered page list.

To create the page list, however, you must know the exact number of total results. For example, if you have 100 results and your search result pages contain 10 results each, your selector must show a list of numbers going from 1 to 10.

Since Meilisearch can only give you an estimate of total search results, it can be difficult to implement page selectors when using Meilisearch.

We recommend two different workarounds to create this kind of pagination interface with Meilisearch.

#### Set a hard limit on search results

By default, a search request returns 20 search results. You can change this value to a much higher number and treat it as the effective maximum of search results you will show a user. Doing so means the size of your `hits` array is the exact number of search results you have to paginate.

For example, if you set `limit` to 300, every search request made to Meilisearch returns at most 300 documents. If a query returns a `hits` array with 200 items and you want each page to display 20 results, you can create a page selector with 10 pages.

// perhaps a code sample here?

This method provides control and reliability. It also prevents users from paginating too far, which avoids performance loss. However, this limits the number of results your users can see.

::: note
We recommend caution when setting high values for `limit` as it can negatively impact performance.
:::

#### Accept the unreliable number

In this pagination method, use `estimatedTotalHits` to calculate the number of search result pages. This means your number of results and page count are likely to change until Meilisearch retrieves the last search result.

For example, a query's `estimatedTotalHits` might be `100` when you fetch the first page of search results. If you are showing 20 results per page, this means your interface will display a page selector with 5 pages. When you fetch the fifth and last page according to Meilisearch's current estimate, however, `estimatedTotalHits` might change to `300`. Your page list, previously displaying 5 pages, must now show 10 total pages.

This method gives users access to all search results. However, it also results in an interface that might feel unreliable due to constant and unpredictable changes.

## Unsatisfied? Let us know

Is the current state of pagination in Meilisearch negatively impacting you? Please share your thoughts with us in this [GitHub discussion](https://github.com/meilisearch/product/discussions/483). We are actively working on improving this aspect of Meilisearch and your input is greatly appreciated.
