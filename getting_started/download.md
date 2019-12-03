# Download

:::: tabs

::: tab curl
Download the **latest stable release** of MeiliSearch with **curl**.
```bash
$ curl https://raw.githubusercontent.com/meilisearch/MeiliSearch/master/download-latest.sh | sh
$ ./meilisearch
Server is listening on: http://127.0.0.1:7700
```
:::

::: tab Docker
Using Docker you can choose to run [any available tags](https://hub.docker.com/r/getmeili/meilisearch/tags)
```bash
$ docker run -it --rm -p 7700:7700 getmeili/meilisearch
Server is listening on: http://0.0.0.0:7700
```
:::

::: tab Cargo
If you have the Rust toolchain installed you can compile MeiliSearch from the sources.
```bash
$ git clone https://github.com/meilisearch/MeiliSearch.git
$ cd MeiliSearch && cargo run --release
Server is listening on: http://127.0.0.1:7700
```
:::

::::

More [ways to run MeiliSearch](/advanced_guides/binary.md) and more information about the [environment variables](/references/environment.md).
