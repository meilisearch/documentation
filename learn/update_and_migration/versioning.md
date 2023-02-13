# Versioning policy

This article describes the system behind Meilisearch's version numbering, compatibility between Meilisearch versions, and how Meilisearch version numbers relate to SDK and documentation versions.

## Engine versioning

Release versions follow the MAJOR.MINOR.PATCH format and adhere to the [Semantic Versioning 2.0.0 convention](https://semver.org/#semantic-versioning-200).

- MAJOR versions contain changes that break compatibility between releases
- MINOR versions introduce new features that are backwards compatible
- PATCH versions only contain high-priority bug fixes and security updates

::: warning
Prior to Meilisearch v1, MINOR versions also broke compatibility between releases.
:::

### Release schedule

Meilisearch releases new versions between four and six times a year. This number does not include PATCH releases.

### Support for previous versions

Meilisearch only maintains the latest engine release. Currently, there are no EOL (End of Life) or LTS (Long-Term Support) policies.

Consult the [engine versioning policy](https://github.com/meilisearch/engine-team/blob/main/resources/versioning-policy.md) for more information.

## SDK versioning

Meilisearch version numbers have no relationship to SDK version numbers. For example, `meilisearch-go` v0.22 introduced compatibility with Meilisearch v0.30. SDKs follow their own release schedules and must address issues beyond compatibility with Meilisearch.

When using an SDK, always consult its repository README, release description, and any dedicated documentation to determine which Meilisearch versions and features it supports.

## Documentation versioning

This Meilisearch documentation website follows the latest Meilisearch version. We do not maintain documentation for past releases.

It is possible to [access previous versions of the Meilisearch documentation website](/learn/update_and_migration/previous_docs_version.md), but the process and results are less than ideal. Users are strongly encouraged to always use the latest Meilisearch release.
