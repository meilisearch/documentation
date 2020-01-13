# Web interface

After adding documents to your MeiliSearch, it is possible to try out the search engine with the integrated web interface.

The web interface is served on **the same port** as MeiliSearch.

## Example

The server is listening on: `http://127.0.0.1:7700`.

Let's add some movies.

```bash
curl -X POST  'http://127.0.0.1:8080/indexes/movies_uid/documents'\
     --data @movies.json
```

Let's go to `http://127.0.0.1:7700` in our browser.

![Movies gif](/movies_web_2.gif)
