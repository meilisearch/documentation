# Postman collection for MeiliSearch

Are you tired of using the `curl` command in your terminal to test MeiliSearch? It can be tedious to re-write every route when wanting to try out an API.

Postman is a platform that lets you create HTTP requests you can easily reuse and share with everyone. We provide a <a href="/postman/meilisearch-collection.json" download="meilisearch-postman-collection.json">Postman collection</a> containing all the routes of the MeiliSearch API! 🚀

::: note
If you don't have Postman already, you can [download it here](https://www.postman.com/downloads/).
It's free and available on many OS distributions.
:::

## Import the collection

Once you have downloaded the [Postman collection](/postman/meilisearch-collection.json), you need to import it into Postman.

![Importing the Postman collection](/postman/import.png)

## Edit the configuration

![Editing the Postman configuration](/postman/edit.png)

Set the API key if needed (set to `masterKey` by default):

![Editing the API Key](/postman/set_api_key.png)

Set the host URL (set to MeiliSearch's local port by default) and the index UID (set to `indexUID` by default):

![Editing variables to set the url and indexUID ](/postman/set_variables.png)

The `url` and `indexUID` variables are used in all the collection routes, like in this one:

![URL example](/postman/url.png)

## Start to use it!

You can now [run your MeiliSearch instance](/learn/getting_started/installation.md) and create your first index:

![Creating an index](/postman/create_index.png)
