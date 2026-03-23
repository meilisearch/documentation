# Meilisearch Documentation

## Documentation structure

The documentation is organized into five tabs:

- **Getting Started**: Where everyone starts. First steps with Meilisearch, SDK quick starts, framework integrations.
- **Capabilities**: All Meilisearch capabilities documented. Each capability follows the structure: Overview, Getting Started, How To, Advanced. Organized under `capabilities/` with sub-folders per capability (full_text_search, hybrid_search, geo_search, conversational_search, multi_search, filtering_sorting_faceting, personalization, analytics, security, teams, indexing).
- **References**: API reference documentation for the HTTP API. Generated from the OpenAPI spec. Must be updated whenever there is a new route. See scripts in `package.json`.
- **Resources**: Secondary references. Self-hosting, comparisons and migration guides for alternatives, under the hood internals, demos, and other resources.
- **Changelog**: Changelog of the Engine (and soon Cloud too). Automatically generated from GitHub releases. See scripts in `package.json`.

## Writing style

- **Never use em dashes (`—`)** in documentation content. Use commas, parentheses, or rewrite the sentence instead.
