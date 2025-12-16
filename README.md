<p align="center">
  <img src="assets/repo/meilisearch-logo-light.svg?sanitize=true#gh-light-mode-only" />
  <img src="assets/repo/meilisearch-logo-dark.svg?sanitize=true#gh-dark-mode-only" />
</p>

<h1 align="center">Meilisearch Documentation</h1>

<h4 align="center">
  <a href="https://www.meilisearch.com">Website</a> |
  <a href="https://roadmap.meilisearch.com">Roadmap</a> |
  <a href="https://blog.meilisearch.com">Blog</a> |
  <a href="https://www.meilisearch.com/docs">Documentation</a> |
  <a href="https://www.meilisearch.com/docs/faq">FAQ</a> |
  <a href="https://discord.meilisearch.com">Discord</a>
</h4>

This repository is the documentation for the **open-source search engine API [Meilisearch](https://github.com/meilisearch/meilisearch)**.

## Contributing

Hey, thank you so much for wanting to contribute! If you'd like to help improve this documentation, we'd love to have you!

For more information, see the [contributing overview](resources/help/contributing_docs.mdx).

## Updating the OpenAPI spec

The API Reference uses the OpenAPI specification from [Meilisearch releases](https://github.com/meilisearch/meilisearch/releases). To update to the latest version:

```bash
python3 scripts/update-openapi.py
```

This script:
1. Fetches the latest Meilisearch release version from GitHub
2. Downloads the OpenAPI spec from the release assets
3. Fixes known validation issues (null descriptions in externalDocs)
4. Saves it to `reference/openapi.json`

Run this script whenever a new Meilisearch version is released to keep the API documentation up to date.

## Contact

Feel free to contact us about any questions you may have:

- Join our [Discord community](https://discord.meilisearch.com).
- Open an [issue](https://github.com/meilisearch/documentation/issues)!

Any suggestion or feedback is highly appreciated. Thank you for your support!
