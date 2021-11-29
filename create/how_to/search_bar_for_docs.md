# Integrate a relevant search bar to your documentation

You might have noticed the search bar in this documentation.

![MeiliSearch docs search bar demo](/tuto-searchbar-for-docs/vuepress-searchbar-demo.gif)

And you are probably wanting the same for your own documentation!

This tutorial will guide you through the steps of building a relevant and powerful search bar for your documentation 🚀

1. [Run a MeiliSearch Instance](#run-a-meilisearch-instance)
2. [Scrape your content](#scrape-your-content)
3. [Integrate the Search Bar](#integrate-the-search-bar)

## Run a MeiliSearch instance

First of all, you need your documentation content to be scraped and pushed into a MeiliSearch instance.

You can install and run MeiliSearch on your machine using `curl`.

```bash
curl -L https://install.meilisearch.com | sh
./meilisearch --master-key=myMasterKey
```

There are [other ways to install MeiliSearch](/learn/getting_started/quick_start.md#download-and-launch).

MeiliSearch is open-source and can run either on your server or on any cloud provider.

::: note

The host URL and the API key you will provide in the next steps correspond to the credentials of this MeiliSearch instance.
In the example above, the host URL is `http://localhost:7700` and the API key is `myMasterKey`.

:::

## Scrape your content

The Meili team provides and maintains a [scraper tool](https://github.com/meilisearch/docs-scraper) to automatically read the content of your website and store it into an index in MeiliSearch.

### Configuration file

The scraper tool needs a configuration file to know what content you want to scrape. This is done by providing selectors (e.g. the HTML tag).

Here is an example of a basic configuration file:

```json
{
  "index_uid": "docs",
  "start_urls": [
    "https://www.example.com/doc/"
  ],
  "sitemap_urls": [
    "https://www.example.com/sitemap.xml"
  ],
  "stop_urls": [],
  "selectors": {
    "lvl0": {
      "selector": ".docs-lvl0",
      "global": true,
      "default_value": "Documentation"
    },
    "lvl1": {
      "selector": ".docs-lvl1",
      "global": true,
      "default_value": "Chapter"
    },
    "lvl2": ".docs-content .docs-lvl2",
    "lvl3": ".docs-content .docs-lvl3",
    "lvl4": ".docs-content .docs-lvl4",
    "lvl5": ".docs-content .docs-lvl5",
    "lvl6": ".docs-content .docs-lvl6",
    "text": ".docs-content p, .docs-content li"
  }
}
```

The `index_uid` field is the index identifier in your MeiliSearch instance in which your website content is stored. The scraping tool will create a new index if it does not exist.

The `docs-content` class is the main container of the textual content in this example. Most of the time, this tag is a `<main>` or an `<article>` HTML element.

`lvlX` selectors should use the standard title tags like `h1`, `h2`, `h3`, etc. You can also use static classes. Set a unique `id` or `name` attribute to these elements.

Every searchable `lvl` elements outside this main documentation container (for instance, in a sidebar) must be `global` selectors. They will be globally picked up and injected to every document built from your page.

If you use VuePress for your documentation, you can check out the [configuration file](https://github.com/meilisearch/documentation/blob/master/.vuepress/docs-scraper/docs-scraper.config.json) we use in production.
In our case, the main container is `theme-default-content` and the selector the titles and sub-titles are `h1`, `h2`...

::: tip

More [optional fields are available](https://github.com/meilisearch/docs-scraper#all-the-config-file-settings) to fit your need.

:::

### Run the scraper

You can run the scraper with Docker. With our local MeiliSearch instance set up at [the first step](#run-a-meilisearch-instance), we run:

```bash
docker run -t --rm \
  --network=host \
  -e MEILISEARCH_HOST_URL='http://localhost:7700' \
  -e MEILISEARCH_API_KEY='myMasterKey' \
  -v <absolute-path-to-your-config-file>:/docs-scraper/config.json \
  getmeili/docs-scraper:latest pipenv run ./docs_scraper config.json
```

::: note

If you don't want to use Docker, here are [other ways to run the scraper](https://github.com/meilisearch/docs-scraper#installation-and-usage).

:::

`<absolute-path-to-your-config-file>` should be the **absolute** path of your configuration file defined at [the previous step](#configuration-file).

The API key you must provide should have the permissions to add documents into your MeiliSearch instance. In a production environment, we recommend providing the private key instead of the master key, as it is safer and it has enough permissions to perform such requests.
_More about [MeiliSearch authentication](/reference/features/security.md)._

::: tip

We recommend running the scraper at each new deployment of your documentation, [as we do for the MeiliSearch's one](https://github.com/meilisearch/documentation/blob/master/.github/workflows/gh-pages-scraping.yml).

:::

## Integrate the search bar

If your documentation is not a VuePress application, you can directly go to [this section](#for-all-kinds-of-documentation).

### For VuePress documentation sites

If you use VuePress for your documentation, we provide a [Vuepress plugin](https://github.com/meilisearch/vuepress-plugin-meilisearch). This plugin is used in production in the MeiliSearch documentation.

![VuePress plugin example](/tuto-searchbar-for-docs/vuepress-plugin-example.png)

In your VuePress project:

:::: tabs

::: tab yarn

```bash
yarn add vuepress-plugin-meilisearch
```

:::

::: tab npm

```bash
npm install vuepress-plugin-meilisearch
```

:::

::::

In your `config.js` file:

```js
module.exports = {
  plugins: [
    [
      "vuepress-plugin-meilisearch",
      {
        "hostUrl": "<your-meilisearch-host-url>",
        "apiKey": "<your-meilisearch-api-key>",
        "indexUid": "docs"
      }
    ],
  ],
}
```

The `hostUrl` and the `apiKey` fields are the credentials of the MeiliSearch instance. Following on from this tutorial, they are respectively `http://localhost:7700` and `myMasterKey`.
`indexUid` is the index identifier in your MeiliSearch instance in which your website content is stored. It has been defined in the [config file](#configuration-file).

These three fields are mandatory, but more [optional fields are available](https://github.com/meilisearch/vuepress-plugin-meilisearch#customization) to customize your search bar.

::: warning

Since the configuration file is public, we strongly recommend providing the MeiliSearch public key in a production environment, which is enough to perform search requests.
Read more about [MeiliSearch authentication](/reference/features/security.md).

:::

### For all kinds of documentation

If you don't use VuePress for your documentation, we provide a [front-end SDK](https://github.com/meilisearch/docs-searchbar.js) to integrate a powerful and relevant search bar to any documentation website.

![docs-searchbar.js example](/tuto-searchbar-for-docs/docs-searchbar-example.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docs-searchbar.js@{version}/dist/cdn/docs-searchbar.min.css" />
  </head>

  <body>
    <input type="search" id="search-bar-input">
    <script src="https://cdn.jsdelivr.net/npm/docs-searchbar.js@{version}/dist/cdn/docs-searchbar.min.js"></script>
    <script>
      docsSearchBar({
        hostUrl: '<your-meilisearch-host-url>',
        apiKey: '<your-meilisearch-api-key>',
        indexUid: 'docs',
        inputSelector: '#search-bar-input',
        debug: true // Set debug to true if you want to inspect the dropdown
      });
    </script>
  </body>
</html>
```

The `hostUrl` and the `apiKey` fields are the credentials of the MeiliSearch instance. Following on from this tutorial, they are respectively `http://localhost:7700` and `myMasterKey`.
`indexUid` is the index identifier in your MeiliSearch instance in which your website content is stored. It has been defined in the [config file](#configuration-file).
`inputSelector` is the `id` attribute of the HTML search input tag.

::: warning

We strongly recommend providing the MeiliSearch public key in a production environment, which is enough to perform search requests.
Read more about [MeiliSearch authentication](/reference/features/security.md).

:::

The default behavior of this library fits perfectly for a documentation search bar, but you might need [some customizations](https://github.com/meilisearch/docs-searchbar.js#customization).

::: note

For more concrete examples, you can check out this [basic HTML file](https://github.com/meilisearch/docs-searchbar.js/blob/master/scripts/playground.html) or [this more advanced Vue file](https://github.com/meilisearch/vuepress-plugin-meilisearch/blob/master/MeiliSearchBox.vue).

:::

## What's next?

At this point you should have a working search engine on your website, congrats! 🎉
You can check [this tutorial](/create/how_to/running_production.md) if you now want to run MeiliSearch in production!
