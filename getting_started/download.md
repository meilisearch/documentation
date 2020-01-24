# Download

:::: tabs

::: tab cURL
Download the **latest stable release** of MeiliSearch with **curl**.
```bash
$ curl -L https://install.meilisearch.com | sh
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

::: tab Brew
If you use the Homebrew package manager.
```bash
$ brew update && brew install meilisearch
$ meilisearch
Server is listening on: http://127.0.0.1:7700
```
:::

::: tab APT
If you use the APT package manager
```bash
$ echo "deb [trusted=yes] https://apt.fury.io/meilisearch/ /" > /etc/apt/sources.list.d/fury.list
$ apt update && apt install meilisearch-http
$ meilisearch
Server is listening on: http://127.0.0.1:7700
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

::: tab Heroku
You can deploy the latest stable build of MeiliSearch straight on Heroku.

<p align="center">
  <a href="https://heroku.com/deploy?template=https://github.com/meilisearch/MeiliSearch">
    <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
  </a>
</p>

::: note
The deploy can take up to 20 minutes because it will compile the whole project from the GitHub repository.
:::

::: note
The [Heroku filesystem is ephemeral](https://help.heroku.com/K1PPS2WM/why-are-my-file-uploads-missing-deleted), which means you may lose your data on any restart of the Heroku instance. The Heroku deploy is okay for testing purposes, but it won't work for production.
:::


::::

More [ways to run MeiliSearch](/guides/advanced_guides/binary.md) and more information about the [environment variables and the flags](/guides/advanced_guides/binary.md#environment-variables-and-flags).
