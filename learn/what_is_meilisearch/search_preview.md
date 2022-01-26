# Search preview

After adding documents to your MeiliSearch instance, you can immediately start searching through your dataset using MeiliSearch's search preview. This can be useful when you want to check documents have been properly indexed and MeiliSearch is working as expected.

If your MeiliSearch instance does not have any indexes, you should see this screen.

![Screenshot of the search preview instructing the user to set an API key and configure an index](/search_preview_no_documents.png)

To access the search preview in your browser, navigate to the address and port specified in the command line argument `--http-addr`. If you did not configure `--http-addr` when launching your instance, [MeiliSearch's default address for the search preview is 127.0.0.1:7700](/reference/features/configuration.md#http-address-port-binding).

::: warning
For security reasons, search preview is only available in [development mode](/reference/features/configuration.md#environment).
:::

### Example

You can add a dataset containing many popular movies to an instance:

<CodeSamples id="add_movies_json_1" />

Once indexation is finished, you can access `http://127.0.0.1:7700` and confirm everything is working correcty by searching for "The Truman Show:"

<MovieGif />
