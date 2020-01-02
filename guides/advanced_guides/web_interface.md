# Web interface

After adding documents to your MeiliSearch, it is possible to try out the search engine with the integrated web interface.

The web interface is served on the address and port specified in the command line argument `--listen`. If not specified, [the default address and port is used](/guides/advanced_guides/installation.md#environment-variables-and-flags).

### Example

By default the web server can be reached on `http://127.0.0.1:7700`.

Let's add some movies.

```bash
curl -X POST 'http://127.0.0.1:7700/indexes/movies_uid/documents'\
     --data @movies.json
```

Let's go to `http://127.0.0.1:7700` in our browser.

![Movies gif](/movies_web_2.gif)
