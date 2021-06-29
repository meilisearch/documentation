# Telemetry

MeiliSearch collects anonymized data from users in order to improve our product. This can be [deactivated at any time](#how-to-disable-data-collection).

Note that while MeiliSearch is running in [`development` mode](/reference/features/configuration.md#environment), no data is collected.

## What kind of data do you collect?

We use two data-collection tools: [Amplitude](https://amplitude.com/amplitude-analytics) and [Sentry](https://sentry.io/welcome/). Both can be disabled by [following the below procedure](#how-to-disable-data-collection).

**Amplitude** collects information about how and where MeiliSearch is being used, including the amount of time a MeiliSearch instance has been running, the version it's using, the device that's running it, and the number of documents per index. It also tracks the number of unique users, which is our equivalent of counting downloads or installs.

Note that this data is aggregated, meaning that we never view individual statistics.

**Sentry** collects information about errors that occur while using MeiliSearch—in other words, bug reports and diagnostics.

**We will absolutely never collect private information**, including IP address, email, or website URLs. All of our data collection is **GDPR-compliant**.

::: warning

In the future, we may collect additional metrics relating to new features. To have the most up-to-date info, be sure to check the release notes after each new version. <Badge text="soon" type="warn"/>

:::

## How to disable data collection

Data collection can be disabled at any time by setting a command-line option or environment variable, then restarting the MeiliSearch instance.

:::: tabs

::: tab Option

```bash
meilisearch --no-analytics=true
```

:::

::: tab Env

```bash
export MEILI_NO_ANALYTICS=true
meilisearch
```

:::

::::

For more information about configuring MeiliSearch, read our [configuration reference](/reference/features/configuration.md).
