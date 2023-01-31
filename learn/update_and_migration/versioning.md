# Versioning policy

Meilisearch releases contain performance improvements, bug fixes, and new features, but may not always maintain full compatibility between Meilisearch versions.

This article describes the system behind Meilisearch's release versions and how they relate to SDK and documentation versions.

## Engine versioning

Release versions follow the MAJOR.MINOR.PATCH format and adhere to the [Semantic Versioning 2.0.0 convention](https://semver.org/#semantic-versioning-200).

MAJOR versions signal changes that break compatibility between releases. Migrating from Meilisearch v1.x.y to Meilisearch v2.x.y requires adapting an existing application to changes such as deprecated or renamed API routes.

MINOR versions signal backwards compatible changes. PATCH versions only contain high-priority bug fixes and security updates. Migrating between MINOR and PATCH releases is seamless and does not require changing an existing application's codebase.

::: warning
In Meilisearch releases before v1.0.0, MINOR versions are not always backwards compatible. If you are using a MAJOR release 0, such as Meilisearch v0.21, upgrading to v0.30 might require significant changes to your codebase.
:::

Meilisearch releases new versions between four and six times a year. This number does not include PATCH releases.

Meilisearch only maintains the latest engine release. Currently, there are no EOL and LTS policies. These will be outlined with the launch of Meilisearch v2.

Consult the [engine versioning policy](https://github.com/meilisearch/engine-team/blob/main/resources/versioning-policy.md) for more information.

## SDK versioning

Meilisearch release versions are not connected to SDK versions. SDKs follow their own release schedules and must address issues external to compatibility with Meilisearch. For example, there is no guarantee `meilisearch-js` v0.30 will work with Meilisearch v0.30.

When using an SDK, consult its dedicated documentation and README to determine which Meilisearch versions and features it supports.

Consult the [SDK versioning policy](https://github.com/meilisearch/integration-guides/blob/main/resources/versioning.md) for more information.

## Documentation versioning

The Meilisearch documentation follows the latest Meilisearch version. Meilisearch does not maintain documentation for past releases.

It is possible to [access previous versions of the Meilisearch documentation website](/learn/advanced/previous_docs_versions), though the process can be complex for inexperienced users. You are strongly encouraged to always use the latest Meilisearch release.
