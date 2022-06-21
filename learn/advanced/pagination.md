# Pagination of search results

In a perfect world, users would not need to look beyond the first search result to find what they were looking for. In practice, this is difficult to achieve due to design constraints, performance trade-offs, and even inneffective query terms. Because of that, it is usually necessary to create a pagination interface so users can browse through long lists of results.

In this guide, we will discuss some of Meilisearch's current limitations, how these limitations impact common pagination interface patterns, and the recommended way of handling pagination when using Meilisearch.

## Choosing the right pagination interface

For performance reasons, Meilisearch cannot provide you with the exact number of possible results for a query. Instead, you can only know the `estimatedTotalHits` when using our search API. As its name indicates, `estimatedTotalHits` is only an estimate of how many documents match your user's query.

Additionally, Meilisearch is optimized to return the most relevant results as fast as possible. The negative side of this design decision is that queries might become slower the further away we get from the first results.

Because you cannot know the number of total hits and slower queries the further we move from the first result, we do not recommend creating interfaces with page selectors that allow users to jump to any arbitrary result page. If this type of interface is crucial for your user's search experience, this document's last section lists a number of tips that might help you work around Meilisearch's current limitations.

Instead of a full page selector, we recommend creating pagination interfaces centered around previous and next buttons.

::: note
By default, Meilisearch only returns a maximum of 1000 search results. Consult our [index setting reference](/reference/api/settings.md) to know how to change this.
:::

## Recommended: Previous and next buttons

Pagination interfaces that rely solely on previous and next buttons are similar to page selectors, but do not allow users to jump to an arbitrary results page.

![Placeholder image for prev/next interface]()

Though this approach offers less precision than a full-blown page selector, it does not require knowing the number of total search results.

### Implementation

Previous and next buttons can be implemented using the [`limit`](/reference/api/search.md#limit) and [`offset`](/reference/api/search.md#offset) search parameters.

Paginating requires providing an `offset` that is equal to your `limit` times the page number times: `offset = limit * page number`.

For example, if you set `limit` to `20` and want the first page of search results, your `offset` must be 0: `offset = 0 * 20`.

```sh
curl \
  -X POST 'http://localhost:7700/indexes/movies/search' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "q": "shifu",
    "limit": 20,
    "offset": 0
  }'
```

If you keep the same `limit` and want the third page of results, `offset` must be `40`: `offset = 2 * 20`.

```sh
curl \
  -X POST 'http://localhost:7700/indexes/movies/search' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "q": "shifu",
    "limit": 20,
    "offset": 40
  }'
```

As you might have noticed, we start counting page numbers from 0. This means the first page of results is 0, the second page is 1, and so forth.

It is often helpful to disable navigation buttons when the user cannot move to next or the "previous page. The "previous" button should be disabled whenever your `offset` is 0.

To disable the "next" button, we recommend setting your `limit` to the number of displayed results plus 1. For example, if you want each page to display 20 search results, set `limit` to 21. If the number of returned items is less than 21, we can safely assume we are in the last page.

```js
const results = await index.search("x", { limit: 21, offset: 0 })

// Previous button 
if (offset === 0 ) {
  // last page
  document.querySelector("#previous_button").disabled
}

// Next button
if (results.hits.length < limit ) {
  // last page
  document.querySelector("#next_button").disabled
}
```

## Not recommended: Page selection

As its name states, this type of pagination is made of a numbered list of pages accompanied by next and previous buttons.

[UI screenshot]

![](https://vuejsexamples.com/content/images/2018/11/vue-pagination.gif)

This is a very common type of interface and offers users a significant amount of precision when navigating results. Despite being similar to our recommended pagination solution, the page selector requires knowing the exact number of total matches. This makes it difficult to implement when using Meilisearch.

### Implementation

The general implementation of a page selection interface is similar to our recommended solution, using previous and next buttons: you must use the `limit` and `offset` search parameters to set your page size and navigate between search results.

To create the page list, however, you must know the exact number of total results. For example, if you have 100 results and your search result pages contain 10 results each, your selector must show a list of numbers going from 1 to 10. Meilisearch, however, can only give you an estimate of the total number of search results.

We recommend two different workarounds to create this kind of pagination interface with Meilisearch.

#### Set a hard limit of results during your search

By default, a search request returns 20 search results. You can change this value to a much higher number and treat it as the effective maximum of search results you will show a user. Doing so means the size of your `hits` array is the exact number of search results you have to paginate.

For example, if you set `limit` to 300, every search request made to Meilisearch returns at most 300 documents. If a query returns a `hits` array with 200 items and you want each page to display 20 results, you can create a page selector with 10 pages.

This method provides control and reliability. It also prevents users from paginating too far, which avoids performance loss. However, this limits the number of results your users can see.

::: note
We do not recommend setting high values for `limit` as it can negatively impact performance.
:::

#### Accept the unreliable number

You can still use `estimatedTotalHits` to calculate the number of search result pages. This means your page count is likely to change until Meilisearch retrives the last search result.

For example, a query's `estimatedTotalHits` might be `100` when you fetch the first page of search results. If you are showing 20 results per page, this means your interface will display a page selector with 5 pages. When you fetch the fifth and last page in Meilisearch's current estimate, however, `estimatedTotalHits` might change to `300`. Your page list, previously displaying 5 pages, must now show 10 total pages.

This method gives users access to all search results. However, it also results in an interface that might occasionally change in front of the user.

## Unsatisfied? Let us know

We are actively working on improving Meilisearch pagination. Is our recommended pagination method not suitable for the application you're developing? Is page selection critical for your website? Please let us know in this GitHub discussion.

Is creating pagination interfaces in Meilisearch   for you this is a huge issue, please provide feedback on [this discussion](https://github.com/meilisearch/product/discussions/483).