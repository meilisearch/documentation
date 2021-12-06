# Postman collection for MeiliSearch

Are you tired of using the `curl` command in your terminal to test MeiliSearch? It can be tedious to re-write every route when wanting to try out an API.

Postman is a platform that lets you create HTTP requests you can easily reuse and share with everyone. We provide a <a href="/postman/meilisearch-collection.json" download="meilisearch-postman-collection.json">Postman collection</a> containing all the routes of the MeiliSearch API! 🚀

::: note
If you don't have Postman already, you can [download it here](https://www.postman.com/downloads/).
It's free and available on many OS distributions.
:::

## Import the collection

Once you have downloaded the [Postman collection](/postman/meilisearch-collection.json), you need to import it into Postman.

![The Import button](/postman/import.png)

## Edit the configuration

![The Edit option in the overflow menu](/postman/edit.png)

Set the API key if needed (set to `masterKey` by default):

![The Authorization tab. Important: These parameters hold sensitive data. To keep this data source secure while working in a collaborative environment, we recommend using variables.](/postman/set_api_key.png)

Set the host URL (set to MeiliSearch's local port by default) and the index UID (set to `indexUID` by default):

![The Variables tab. Message at bottom of screen: The current value is used while sending a request and is never synced to Postman's servers.](/postman/set_variables.png)

The `url` and `indexUID` variables are used in all the collection routes, like in this one:

![Highlighting {{url}} and {{indexUID}}](/postman/url.png)

## Start to use it!

You can now [run your MeiliSearch instance](/learn/getting_started/installation.md) and create your first index:

![The Send button](/postman/create_index.png)
