# MeiliSearch Documentation

This repository is the documentation for the **open-source search engine API [MeiliSearch](https://github.com/meilisearch/meilisearch)**.

## Contributing

Hey, thank you so much for wanting to contribute! If you'd like to help improve this documentation, we'd love to have you! If you think something is missing or could be improved, issues are highly appreciated.

To contribute, clone this repository, commit your changes and open a pull request.

### Installing & Running

```bash
# Clone the repository
$ git clone git@github.com:meilisearch/documentation.git meilisearch-documentation && cd meilisearch-documentation
# Install dependencies
$ yarn install
# Run MeiliSearch documentation on https://localhost:8080
$ yarn dev
```

### Testing

A complete test can be done using the following command:

```
$ yarn test
```

The tests are triggered on build and on any pull request to master.

#### Checking dead links

Making changes to the documentation without creating any dead links can be a tedious task. Before submitting any pull request, you can check the dead links.

```bash
$ yarn check-links
```

#### Checking Styling

The documentation follows styling rules. The following files will be checked: `*.vue`, `*.js`, and `*.md`.

You can check out and fix the styling errors.

```bash
$ yarn style:fix
```

You can test if the code is well-formatted without fixing it.

```bash
$ yarn check-style
```

### Deployment

The documentation is deployed as a static website. The master branch is automatically deployed at [https://docs.meilisearch.com](https://docs.meilisearch.com).

You can build the static website using the following command:

```bash
$ yarn build
# The website is now available in .vuepress/dist and you can serve it using any webserver.
```

## Contact

Feel free to contact us about any questions you may have:

- At [bonjour@meilisearch.com](mailto:bonjour@meilisearch.com): English or French is welcome! 🇬🇧 🇫🇷
- Via the chat box available on every page of [our documentation](https://docs.meilisearch.com/) and on [our landing page](https://www.meilisearch.com/).
- Join our [Slack community](https://slack.meilisearch.com/).
- By opening an issue.

Any suggestion or feedback is highly appreciated. Thank you for your support!
