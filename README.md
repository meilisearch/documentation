# MeiliSearch documentation

This repository contains the documentation for [MeiliSearch](https://github.com/meilisearch/meilisearch), an open-source search engine API.

## Contributing

Want to contribute to the documentation of MeiliSearch? You can do so by cloning this repository, making your change and submitting your pull request.

Thank you for considering helping out!

### Install & Run

```bash
# Clone the repository
$ git clone git@github.com:meilisearch/documentation.git meilisearch-documentation && cd meilisearch-documentation
# Install dependencies
$ yarn install
# Run MeiliSearch documentation on https://localhost:8080
$ yarn dev
```

### Testing

A complete test can be done using this command:

```
$ yarn test
```

This will also trigger on `yarn build` and on any pull request to master.

#### Check dead links

It can be tough to make changes to the documentation without creating any dead links. You can check the dead links before making any pull request.

```bash
$ yarn check-links
```

#### Check Styling

The documentation follows styling rules. All the following files will be checked: `*.vue`, `*.js`, and `*.md`.

You can check out and fix the styling errors.

```bash
$ yarn style:fix
```

You can test if the code is well-formatted without fixing.

```bash
$ yarn check-style
```

### Deployment

The documentation is deployed as a static website. Master branch is automatically deployed to [https://docs.meilisearch.com](https://docs.meilisearch.com).

You can build the static website using the following command

```bash
$ yarn build
# The website is now available in .vuepress/dist and you can serve it using any webserver.
```
