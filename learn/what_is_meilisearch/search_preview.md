# Search preview

After adding documents to your Meilisearch instance, you can immediately start searching through your dataset using Meilisearch's search preview. This can be useful when you want to check that documents have been properly indexed and Meilisearch is working as expected.

If your Meilisearch instance does not have any indexes, you should see this screen.

![Screenshot of the search preview instructing the user to set an API key and configure an index](/search_preview_no_documents.png)

To access the search preview in your browser, navigate to the address and port specified in the command line argument `--http-addr`. If you did not configure `--http-addr` when launching your instance, [Meilisearch's default address for the search preview is 127.0.0.1:7700](/learn/configuration/instance_options.md#http-address-port-binding).

::: warning
For security reasons, search preview is only available in [development mode](/learn/configuration/instance_options.md#environment).
:::

### Example

You can add a dataset containing many popular movies to an instance:

<CodeSamples id="add_movies_json_1" />

Once indexation is finished, you can access `http://127.0.0.1:7700` and confirm everything is working correctly by searching for "The Truman Show:"

<MovieGif />
